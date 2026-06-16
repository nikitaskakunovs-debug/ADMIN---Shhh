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

// ── THE ONE PLACE TO SET YOUR DOMAIN ───────────────────────────────────────
// Every canonical, Open Graph tag, sitemap URL, llms.txt link, robots.txt
// Sitemap line and JSON-LD @id in the DEPLOYED site is rewritten to this at
// build time. Leave as-is to keep https://shhh.lv; change it here (one line)
// when your live domain differs — then connect that domain's DNS to GitHub Pages.
const SITE_URL = 'https://shhh.lv';

const PAGES = ['desktop', 'mobile'];

// Code-splitting: files listed here are pulled OUT of a page's main bundle into
// a lazy "<page>.rest.js" that the core bundle loads on idle (after first paint).
// Only put files here whose components are NEVER rendered on the initial home
// view — checkout/cart/search/content/legal screens. DApp guards navigation to
// these screens until the rest bundle has loaded (window.__shhhRest). Anything
// rendered unconditionally on home (DWelcomeModal in desktop-screens-3.jsx,
// AnnouncementBar, the chrome) MUST stay in core. Empty set => single bundle.
const REST_FILES = {
  desktop: new Set([
    'shop-checkout-bits.jsx', 'shop-content.jsx', 'shop-brands.jsx', 'shop-invoice.jsx',
    'shop-returns.jsx', 'shop-cancel.jsx', 'shop-usage.jsx',
    'desktop-screens-2.jsx', 'desktop-screens-4.jsx',
  ]),
  mobile: new Set(),
};

function compileSource(code, label) {
  return Babel.transform(code, {
    presets: ['env', 'react'],
    sourceType: 'script',
    compact: true,
    comments: false,
    filename: label.replace(/[#]/g, '_'),
  }).code;
}

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
function toProdHtml(html, page, hasRest) {
  const marker = '<div id="root"></div>';
  const i = html.indexOf(marker);
  if (i === -1) throw new Error(`[build:${page}] no #root marker`);
  let head = html.slice(0, i + marker.length);
  head = head.replace(/[ \t]*<link rel="preconnect" href="https:\/\/unpkg\.com"[^>]*>\r?\n/i, '');
  head = head.replace(/<!-- Fonts \+ CDN \(React\/Babel are served from unpkg\) -->/i, '<!-- Fonts -->');
  // Preload the render-critical JS so it fetches at high priority during head
  // parse (the page is client-rendered, so this bundle is the LCP path). The
  // lazy "rest" bundle is prefetched at LOW priority — cached for fast first
  // navigation, but never on the home critical path.
  const preload =
    '<link rel="preload" as="script" href="vendor/react.production.min.js">\n' +
    '<link rel="preload" as="script" href="vendor/react-dom.production.min.js">\n' +
    `<link rel="preload" as="script" href="dist/${page}.bundle.js?v=${VER}">\n` +
    (hasRest ? `<link rel="prefetch" as="script" href="dist/${page}.rest.js?v=${VER}">\n` : '');
  head = head.replace('</head>', preload + '</head>');
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
  // <script> in the browser today. sourceType:'script' + preset-env give
  // sloppy-mode top-level globals and const->var, so deliberate redeclarations
  // across files (e.g. desktop's DEFAULT_FILTERS overriding the shared one)
  // keep working as they do at runtime. ';' between files guards against ASI.
  const restSet = REST_FILES[page] || new Set();
  const core = [], rest = [];
  for (const s of sources) (restSet.has(s.label) ? rest : core).push(s);
  const group = (arr) => arr.map(s => `/* ${s.label} */\n;${compileSource(s.code, s.label)}`).join('\n');

  const distDir = path.join(OUT, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  let coreJs = group(core);
  if (rest.length) {
    fs.writeFileSync(path.join(distDir, `${page}.rest.js`), group(rest));
    // On-demand loader (idempotent). DApp calls it the moment the user heads to
    // a lazy screen. Until then the rest bundle never executes, so it's off the
    // home page's critical path AND out of its "unused JS". A <link rel=prefetch>
    // (added in toProdHtml) warms the cache so that first navigation is instant.
    coreJs += `\n;window.__shhhLoadRest=function(){if(window.__shhhRestStarted)return;window.__shhhRestStarted=true;` +
      `var s=document.createElement('script');s.src='dist/${page}.rest.js?v=${VER}';s.async=false;` +
      `s.onload=function(){window.__shhhRest=true;try{window.dispatchEvent(new Event('shhh-rest-ready'));}catch(e){}};` +
      `(document.body||document.documentElement).appendChild(s);};`;
  }
  fs.writeFileSync(path.join(distDir, `${page}.bundle.js`), coreJs);
  fs.writeFileSync(path.join(OUT, `${page}.html`), toProdHtml(html, page, rest.length > 0));
  return { page, core: core.length, rest: rest.length, bytes: coreJs.length };
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

// Rewrite the placeholder domain to SITE_URL across the whole deployed tree, so
// the domain lives in exactly one place (the SITE_URL constant above).
function applyDomain() {
  const target = SITE_URL.replace(/\/$/, '');
  if (target === 'https://shhh.lv') return; // default — already correct in source
  const exts = new Set(['.html', '.htm', '.txt', '.xml', '.js', '.json', '.webmanifest']);
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (exts.has(path.extname(e.name))) {
        const s = fs.readFileSync(p, 'utf8');
        if (s.includes('https://shhh.lv')) fs.writeFileSync(p, s.split('https://shhh.lv').join(target));
      }
    }
  };
  walk(OUT);
  console.log(`  domain -> ${target}`);
}

async function main() {
  copyTree();
  fs.writeFileSync(path.join(OUT, '.nojekyll'), ''); // serve dist/ verbatim, no Jekyll
  const stats = [];
  for (const p of PAGES) stats.push(await bundlePage(p));
  applyDomain();
  for (const s of stats) {
    console.log(`  ${s.page}: core=${s.core} files (${(s.bytes / 1024).toFixed(0)} KB)` +
      (s.rest ? `  + rest=${s.rest} files (lazy)` : ''));
  }
  console.log(`build/ ready (v=${VER})`);
}

main().catch(e => { console.error(e); process.exit(1); });
