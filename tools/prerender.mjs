// tools/prerender.mjs — static pre-rendering (SSG) for crawlers & AI.
//
// Boots the production bundle in jsdom, lets React + shop-seo.jsx render the
// page and inject its JSON-LD, then bakes the rendered #root + structured data
// into a static HTML file. Crawlers that don't run JS (Bing, GPTBot, ClaudeBot,
// PerplexityBot, Amazonbot, Applebot …) now receive real content + schema; the
// bundle still boots on top for interactive users (device-routed).
//
// Run after tools/build.mjs (it reads from / writes into ./build).

import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'build');

function shim(w) {
  w.scrollTo = () => {}; w.scroll = () => {};
  w.matchMedia = (q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  class O { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  w.IntersectionObserver = O; w.ResizeObserver = O;
  w.fetch = () => Promise.reject(new Error('offline-prerender')); // build-time = built-in catalog
  if (!w.requestAnimationFrame) w.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
}

// Render one route with the given page bundle; return what a crawler should see.
async function render(page, route) {
  const dom = new JSDOM('<!doctype html><html><head><title>t</title></head><body><div id="root"></div></body></html>',
    { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://shhh.lv/' + (route.path || '') });
  const w = dom.window; shim(w);
  if (route.r) w.__shhhRoute = route.r;
  const run = (f) => { const s = w.document.createElement('script'); s.textContent = fs.readFileSync(path.join(OUT, f), 'utf8'); w.document.body.appendChild(s); };
  run('vendor/react.production.min.js');
  run('vendor/react-dom.production.min.js');
  run(`dist/${page}.bundle.js`);
  await new Promise((r) => setTimeout(r, 1800));
  const doc = w.document;
  const root = doc.getElementById('root');
  const out = {
    rootHTML: root ? root.innerHTML : '',
    bodyClass: doc.body.className || '',
    title: doc.title,
    desc: (doc.querySelector('meta[name="description"]') || {}).content || '',
    canonical: (doc.querySelector('link[rel="canonical"]') || {}).href || '',
    jsonld: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.outerHTML),
    textLen: (root ? root.textContent : '').replace(/\s+/g, ' ').trim().length,
  };
  dom.window.close();
  return out;
}

// Device-routing loader: picks desktop/mobile bundle in-place (no redirect),
// so the URL stays clean and React takes over the pre-rendered DOM.
function deviceLoader(ver) {
  return `<script>(function(){var qs=new URLSearchParams(location.search),f=qs.get('view');` +
    `if(f==='desktop'||f==='mobile')try{sessionStorage.setItem('shhh_view',f);}catch(e){}` +
    `var p=null;try{p=sessionStorage.getItem('shhh_view');}catch(e){}` +
    `var m=p?p==='mobile':(Math.min(screen.width,screen.height)<768||/Android|iPhone|iPod|Mobile/i.test(navigator.userAgent));` +
    `function a(s){var x=document.createElement('script');x.src=s;x.defer=true;document.head.appendChild(x);}` +
    `a('vendor/react.production.min.js');a('vendor/react-dom.production.min.js');` +
    `a((m?'dist/mobile.bundle.js':'dist/desktop.bundle.js')+'?v=${ver}');})();</script>`;
}

// Assemble a crawlable static file from the mobile template + rendered fragment.
function assemble(template, r, ver) {
  let html = template;
  // 1) route-specific <head> (title/description/canonical) + JSON-LD
  if (r.title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  if (r.desc) html = html.replace(/(<meta name="description" content=")[^"]*(">)/, `$1${esc(r.desc)}$2`);
  if (r.canonical) html = html.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${esc(r.canonical)}$2`);
  const ld = r.jsonld.join('\n');
  html = html.replace('</head>', ld + '\n</head>');
  // 2) drop the bundle-specific preload + the three bundle <script> tags
  html = html.replace(/<link rel="preload" as="script" href="dist\/[^"]*">\s*/g, '');
  html = html.replace(/<!-- Precompiled[\s\S]*?<\/script>\s*<\/body>/, deviceLoader(ver) + '\n</body>');
  // 3) bake the rendered content + body class
  if (r.bodyClass) html = html.replace('<body>', `<body class="${esc(r.bodyClass)}">`);
  html = html.replace('<div id="root"></div>', `<div id="root">${r.rootHTML}</div>`);
  return html;
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

async function prerender(routes) {
  const template = fs.readFileSync(path.join(OUT, 'mobile.html'), 'utf8');
  const ver = (template.match(/mobile\.bundle\.js\?v=(\d+)/) || [])[1] || Date.now();
  let ok = 0;
  for (const route of routes) {
    const r = await render('mobile', route);
    if (r.textLen < 300) { console.log(`  [prerender] SKIP ${route.label} (only ${r.textLen} chars rendered)`); continue; }
    const file = path.join(OUT, route.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, assemble(template, r, ver));
    console.log(`  [prerender] ${route.out}  (${r.textLen} chars, schema: ${r.jsonld.length})`);
    ok++;
  }
  return ok;
}

// v1: the homepage (zero-param). Product/category/content routes get added here
// once the bundle reads window.__shhhRoute for its initial screen.
const ROUTES = [
  { label: 'home', path: '', out: 'index.html' },
];

prerender(ROUTES).then((n) => console.log(`prerender: ${n} page(s)`)).then(() => process.exit(0))
  // Non-fatal: if a route can't render, the build's plain router index.html is
  // left in place and the site still deploys — SSG is an enhancement, not a gate.
  .catch((e) => { console.error('[prerender] non-fatal:', e && e.message); process.exit(0); });
