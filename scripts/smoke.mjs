import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("dist/index.html");
const html = await readFile(output, "utf8");
const bytes = (await stat(output)).size;

const checks = [
  ["embedded font", html.includes("font/woff2") || html.includes("data:font")],
  ["presentation title", html.includes("Heritage Layer Keynote")],
  ["embedded image data", html.includes("data:image/")],
  ["no source module path", !html.includes('src="/src/main.tsx"')],
  ["no external stylesheet", !/<link[^>]+rel=["']stylesheet["']/i.test(html)],
  ["standalone size", bytes > 1_000_000],
];

const failed = checks.filter(([, passed]) => !passed);

for (const [name, passed] of checks) {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
} else {
  console.log(`Standalone artifact: ${output} (${(bytes / 1_000_000).toFixed(1)} MB)`);
}
