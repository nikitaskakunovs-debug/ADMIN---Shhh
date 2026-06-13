// tools/build.mjs — production build for the Shhh storefront.
//
// WHY: the dev pages (desktop.html / mobile.html) load React's *development*
// UMD builds plus @babel/standalone (~3 MB) and transpile ~25 .jsx files in
// the browser, on the main thread, before first paint. Great for editing,
// terrible for Lighthouse. This script precompiles each page's script set into
// ONE minified, Babel-free bundle and rewrites the HTML to load that bundle +
// React *production* builds. The .jsx files stay the source of truth — you keep
// editing them; CI (or `node tools/build.mjs`) produces the deployed output.
//
// OUTPUT: ./build/ — a full copy of the repo with desktop.html / mobile.html
// swapped to their compiled form and dist/*.bundle.js added. CI pushes ./build
// to the gh-pages branch that GitHub Pages serves.

import * as Babel from '@babel/standalone';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'build');
const VER = String(Date.now());

const PAGES = ['desktop', 'mobile'];

// Read a script's body: external src (minus ?v=) -> file contents; inline -> as-is.
// Skips the React / ReactDOM / Babel CDN tags (the prod HTML supplies its own).
function isVendorCdn(src) {
  return /unpkg\.com|cdn\.jsdelivr|babel|react(-dom)?\./i.test(src || '');
}

function collectSources(html, page) {
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const srcAttrRe = /\bsrc\s*=\s*["']([^"']+)["']/i;
  const sources = [];
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const attrs = m[1] || '';
    const inner = m[2] || '';
    const srcM = attrs.match(srcAttrRe);
    if (srcM) {
      const src = srcM[1];
      if (isVendorCdn(src)) continue;            // React/Babel CDN — dropped in prod
      if (/googletagmanager\.com/i.test(src)) continue; // GTM stays inline in <head>
      const file = src.split('?')[0];
      const abs = path.join(ROOT, file);
      if (!fs.existsSync(abs)) throw new Error(`[build:${page}] missing script source: ${file}`);
      sources.push({ label: file, code: fs.readFileSync(abs, 'utf8') });
    } else {
      // inline block. Skip the GTM loader (head) — identified by gtm.js / dataLayer push.
      if (/gtm\.js|googletagmanager/i.test(inner)) continue;
      if (!inner.trim()) continue;
      sources.push({ label: `${page}#inline`, code: inner });
    }
  }
  return sources;
}

// Turn the dev HTML into prod HTML: keep <head> (incl. GTM) + body chrome up to
// #root, drop every body <script>, drop the now-unused unpkg preconnect, and add
// React production + the compiled bundle (all deferred, order-preserving).
function toProdHtml(html, page) {
  const marker = '<div id="root"></div>';
  const i = html.indexOf(marker);
  if (i === -1) throw new Error(`[build:${page}] no #root marker`);
  let head = html.slice(0, i + marker.length);
  head = head.replace(/[ \t]*<link rel="preconnect" href="https:\/\/unpkg\.com"[^>]*>\r?\n/i, '');
  head = head.replace(/<!-- Fonts \+ CDN \(React\/Babel are served from unpkg\) -->/i, '<!-- Fonts -->');
  return head +
    '\n\n<!-- Precompiled, Babel-free bundle + React production (see tools/build.mjs) -->\n' +
    '<script defer src="vendor/react.production.min.js"></script>\n' +
    '<script defer src="vendor/react-dom.production.min.js"></script>\n' +
    `<script defer src="dist/${page}.bundle.js?v=${VER}"></script>\n\n` +
    '</body>\n</html>\n';
}

async function bundlePage(page) {
  const htmlPath = path.join(ROOT, `${page}.html`);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const sources = collectSources(html, page);
  // Compile EACH source separately — exactly as babel-standalone does per
  // <script> in the browser today — then concatenate the outputs in document
  // order. sourceType:'script' + preset-env give sloppy-mode top-level globals
  // and const->var, so deliberate redeclarations across files (e.g. desktop's
  // DEFAULT_FILTERS overriding the shared one) keep working as they do at
  // runtime. ';' between files guards against ASI at boundaries.
  const js = sources.map(s => {
    const out = Babel.transform(s.code, {
      presets: ['env', 'react'],
      sourceType: 'script',
      compact: true,
      comments: false,
      filename: s.label.replace(/[#]/g, '_'),
    });
    return `/* ${s.label} */\n;${out.code}`;
  }).join('\n');
  fs.mkdirSync(path.join(OUT, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'dist', `${page}.bundle.js`), js);
  fs.writeFileSync(path.join(OUT, `${page}.html`), toProdHtml(html, page));
  return { page, files: sources.length, bytes: js.length };
}

function copyTree() {
  const skip = new Set(['.git', 'node_modules', 'build', 'tools']);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    fs.cpSync(path.join(ROOT, entry.name), path.join(OUT, entry.name), { recursive: true });
  }
}

async function main() {
  copyTree();
  fs.writeFileSync(path.join(OUT, '.nojekyll'), ''); // serve dist/ verbatim, no Jekyll
  const stats = [];
  for (const p of PAGES) stats.push(await bundlePage(p));
  for (const s of stats) {
    console.log(`  ${s.page}.bundle.js  <-  ${s.files} sources  =  ${(s.bytes / 1024).toFixed(0)} KB minified`);
  }
  console.log(`build/ ready (v=${VER})`);
}

main().catch(e => { console.error(e); process.exit(1); });
