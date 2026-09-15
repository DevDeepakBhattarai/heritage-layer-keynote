// Renders the standalone deck to a PDF of slide images. Every slide gets its final
// beat. A slide whose later beats replace or dim earlier text (the hook, the problem
// fragments, the product screens, the two revenue streams) also gets the earlier
// beats that hold that text, so the PDF keeps everything the talk shows.
// Usage: node scripts/pdf.mjs [--out "Nepal Yatra-pitch.pdf"] [--settle 3500]
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFDocument } from "pdf-lib";
import { PRODUCT_NAME, slides } from "../src/presentation.ts";
import { launchChrome, sleep } from "./chrome.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const settle = Number(option("settle", 3500));
const out = path.resolve(option("out", `${PRODUCT_NAME}-pitch.pdf`));

const width = 1920;
const height = 1080;
// Points, so the page opens at the standard 13.33in x 7.5in widescreen size.
const pageWidth = 960;
const pageHeight = 540;

const cwd = process.cwd();
const artifact = pathToFileURL(path.join(cwd, "dist", "index.html")).href;

// Text nodes a reader can make out: on screen, and not faded below half opacity.
const readableTextProbe = `(() => {
  const walker = document.createTreeWalker(document.querySelector('.deck'), NodeFilter.SHOW_TEXT);
  const tokens = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent.trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || el.closest('.notes-panel, .overlay, .progress, .nav')) continue;
    let opacity = 1;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.display === 'none' || s.visibility === 'hidden') { opacity = 0; break; }
      opacity *= Number(s.opacity);
    }
    if (opacity < 0.5) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const r = range.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    tokens.push(text);
  }
  return tokens;
})()`;

// Walks a slide's beats from last to first and keeps a beat when it shows text
// that no kept beat shows.
function pagesFor(beats) {
  const kept = [];
  const covered = new Set();
  for (let b = beats.length - 1; b >= 0; b--) {
    const missing = beats[b].tokens.filter((token) => !covered.has(token));
    if (b === beats.length - 1 || missing.length) {
      kept.unshift({ beat: b, missing });
      for (const token of beats[b].tokens) covered.add(token);
    }
  }
  return kept;
}

const browser = await launchChrome({ width, height, profile: path.join(cwd, ".chrome-pdf") });
const pdf = await PDFDocument.create();
pdf.setTitle(`${PRODUCT_NAME} pitch`);
try {
  await browser.call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: false });

  for (let s = 0; s < slides.length; s++) {
    const beats = [];
    for (let b = 0; b < slides[s].beats; b++) {
      await browser.open(`${artifact}?slide=${s + 1}&beat=${b + 1}&review=1`);
      await browser.evaluate(`document.head.appendChild(Object.assign(document.createElement('style'), { textContent: '.nav { display: none; }' })) && true`);
      await sleep(settle);
      const tokens = await browser.evaluate(readableTextProbe);
      const shot = await browser.call("Page.captureScreenshot", { format: "jpeg", quality: 90 });
      beats.push({ tokens, image: Buffer.from(shot.data, "base64") });
    }

    for (const { beat, missing } of pagesFor(beats)) {
      const image = await pdf.embedJpg(beats[beat].image);
      pdf.addPage([pageWidth, pageHeight]).drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
      const why = beat === beats.length - 1 ? "final beat" : `keeps: ${missing.slice(0, 4).join(" | ")}${missing.length > 4 ? " ..." : ""}`;
      console.log(`page ${String(pdf.getPageCount()).padStart(2)}  slide ${s + 1} beat ${beat + 1}  ${slides[s].title}  (${why})`);
    }
  }

  const bytes = await pdf.save();
  await writeFile(out, bytes);
  console.log(`${out} (${pdf.getPageCount()} pages, ${(bytes.length / 1_000_000).toFixed(1)} MB)`);
} finally {
  await browser.close();
}
