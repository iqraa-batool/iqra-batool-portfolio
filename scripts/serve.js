#!/usr/bin/env node
/**
 * Tiny static server for previewing /public locally.
 *   node scripts/serve.js [port]     (default 4321, or $PORT)
 * Serves directory URLs (/about/ → /about/index.html) and 404.html for misses.
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "public");
const PORT = Number(process.argv[2] || process.env.PORT || 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".woff2": "font/woff2",
};

if (!fs.existsSync(ROOT)) {
  console.error("public/ does not exist yet. Run `npm run build` first.");
  process.exit(1);
}

http
  .createServer((req, res) => {
    let urlPath;
    try { urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { urlPath = "/"; }
    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!urlPath.endsWith("/")) { res.writeHead(301, { Location: urlPath + "/" }); return res.end(); }
      file = path.join(file, "index.html");
    }
    let status = 200;
    if (!fs.existsSync(file)) { status = 404; file = path.join(ROOT, "404.html"); }
    res.writeHead(status, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Serving public/ at http://localhost:${PORT}`));
