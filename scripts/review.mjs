// Visual review: screenshots every beat of the standalone deck and checks that no
// text element leaves the stage. Usage: node scripts/review.mjs [--slides 1,2] [--width 1920]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { slides } from "../src/presentation.ts";
import { launchChrome, sleep } from "./chrome.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const onlySlides = option("slides", "")
  .split(",")
  .filter(Boolean)
  .map((value) => Number(value));
const width = Number(option("width", 1920));
const height = Math.round((width * 9) / 16);
const settle = Number(option("settle", 3200));

const cwd = process.cwd();
const shotDir = path.join(cwd, "visual-review");
await mkdir(shotDir, { recursive: true });

const artifact = pathToFileURL(path.join(cwd, "dist", "index.html")).href;

const overflowProbe = `(() => {
  const stage = document.querySelector('.stage').getBoundingClientRect();
  const issues = [];
  const walker = document.createTreeWalker(document.querySelector('.deck'), NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('.notes-panel, .overlay, .progress')) continue;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    let visible = true;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (Number(s.opacity) === 0 || s.display === 'none') { visible = false; break; }
    }
    if (!visible) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const r = range.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const pad = 2;
    if (r.left < stage.left - pad || r.right > stage.right + pad || r.top < stage.top - pad || r.bottom > stage.bottom + pad) {
      issues.push({ text: node.textContent.trim().slice(0, 40), rect: { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) } });
    }
    // Text that overflows its own box (clipped by overflow hidden ancestors) is also a defect.
    if (el.scrollWidth > el.clientWidth + 2 && style.overflow !== 'visible' && style.whiteSpace === 'nowrap') {
      issues.push({ text: node.textContent.trim().slice(0, 40), clipped: true });
    }
  }
  return issues;
})()`;

const browser = await launchChrome({ width, height, profile: path.join(cwd, ".chrome-review") });
const report = [];
try {
  await browser.call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });

  for (let s = 0; s < slides.length; s++) {
    if (onlySlides.length && !onlySlides.includes(s + 1)) continue;
    for (let b = 0; b < slides[s].beats; b++) {
      await browser.open(`${artifact}?slide=${s + 1}&beat=${b + 1}&review=1`);
      await sleep(settle);
      const issues = await browser.evaluate(overflowProbe);
      const name = `s${String(s + 1).padStart(2, "0")}-b${b + 1}-${width}.png`;
      const shot = await browser.call("Page.captureScreenshot", { format: "png" });
      await writeFile(path.join(shotDir, name), Buffer.from(shot.data, "base64"));
      report.push({ slide: s + 1, beat: b + 1, issues });
      console.log(`${issues.length ? "WARN" : "ok  "} ${name}${issues.length ? " " + JSON.stringify(issues) : ""}`);
    }
  }
  await writeFile(path.join(cwd, "visual-review", `report-${width}.json`), JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
