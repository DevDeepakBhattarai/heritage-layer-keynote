// Headless Chrome over the DevTools protocol, shared by the review and pdf scripts.
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9333;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchChrome({ width, height, profile }) {
  await rm(profile, { recursive: true, force: true }).catch(() => {});
  await mkdir(profile, { recursive: true });

  const child = spawn(
    chrome,
    ["--headless=new", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "--allow-file-access-from-files", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},${height}`, "about:blank"],
    { stdio: "ignore", windowsHide: true },
  );

  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
      target = list.find((x) => x.type === "page" && x.webSocketDebuggerUrl);
    } catch {}
    if (!target) await sleep(100);
  }
  if (!target) {
    child.kill();
    throw new Error("Chrome DevTools endpoint did not become ready");
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  };
  function call(method, params = {}) {
    const msgId = ++id;
    return new Promise((resolve, reject) => {
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }
  async function evaluate(expression) {
    const r = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || "Runtime evaluation failed");
    return r.result?.value;
  }
  /** Navigates to a deck URL and waits for the scene to mount. */
  async function open(url) {
    await call("Page.navigate", { url });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`document.readyState === 'complete' && !!document.querySelector('.scene')`)) return;
      await sleep(50);
    }
  }
  async function close() {
    ws.close();
    child.kill();
    await sleep(300);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }

  await call("Page.enable");
  await call("Runtime.enable");
  return { call, evaluate, open, close };
}
