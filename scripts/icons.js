#!/usr/bin/env node
/**
 * Renders the PNG fallbacks from the SVG sources using a headless
 * Chromium browser (Chrome or Edge) — no npm dependencies.
 *
 *   node scripts/icons.js
 *
 * Writes src/img/og-image.png (1200×630), apple-touch-icon.png (180×180)
 * and favicon-32.png (32×32). Set CHROME_PATH if your browser lives elsewhere.
 */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const IMG = path.resolve(__dirname, "..", "src", "img");
const candidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ib-icons-"));
const jobs = [
  { svg: "og.svg", out: "og-image.png", w: 1200, h: 630 },
  { svg: "favicon.svg", out: "apple-touch-icon.png", w: 180, h: 180, bg: "#0B0B0B" },
  { svg: "favicon.svg", out: "favicon-32.png", w: 32, h: 32, scale: 0.25 },
];

for (const j of jobs) {
  const svg = fs.readFileSync(path.join(IMG, j.svg), "utf8");
  const html = `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700&family=Inter:wght@400&display=block"><style>html,body{margin:0;width:${j.w / (j.scale || 1)}px;height:${j.h / (j.scale || 1)}px;overflow:hidden;background:${j.bg || "transparent"}}svg{display:block;width:${j.w / (j.scale || 1)}px;height:${j.h / (j.scale || 1)}px}</style></head><body>${svg}</body></html>`;
  const page = path.join(tmp, j.out + ".html");
  fs.writeFileSync(page, html);
  const out = path.join(IMG, j.out);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", `--user-data-dir=${path.join(tmp, "profile")}`, "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--hide-scrollbars", "--virtual-time-budget=8000", "--default-background-color=00000000",
    // Very small windows hang some headless builds, so tiny icons render at a
    // larger window size with a fractional device scale factor.
    `--window-size=${j.w / (j.scale || 1)},${j.h / (j.scale || 1)}`, `--force-device-scale-factor=${j.scale || 1}`, `--screenshot=${out}`, "file:///" + page.replace(/\\/g, "/"),
  ], { stdio: "ignore", timeout: 60000 });
  console.log(`✓ ${path.relative(process.cwd(), out)} (${fs.statSync(out).size} bytes)`);
}
fs.rmSync(tmp, { recursive: true, force: true });
