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
import { SITE_URL, SITE } from './site.config.mjs';

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

// ── llms.txt / llms-full.txt — auto-generated from the live catalog & pages ──
// Hands AI engines (ChatGPT/Claude/Perplexity/Gemini/Copilot) clean plain text
// they can ingest without rendering JS. Stays in sync because it's built from
// the same data the app uses.
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const sentence = (s) => { s = clean(s); const i = s.indexOf('. '); return i > 0 ? s.slice(0, i + 1) : s.slice(0, 130); };

async function collectData(page) {
  const dom = new JSDOM('<!doctype html><html><head><title>t</title></head><body><div id="root"></div></body></html>',
    { runScripts: 'dangerously', pretendToBeVisual: true, url: SITE_URL + '/' });
  const w = dom.window; shim(w);
  const run = (f) => { const s = w.document.createElement('script'); s.textContent = fs.readFileSync(path.join(OUT, f), 'utf8'); w.document.body.appendChild(s); };
  run('vendor/react.production.min.js'); run('vendor/react-dom.production.min.js'); run(`dist/${page}.bundle.js`);
  await new Promise((r) => setTimeout(r, 1600));
  const d = {
    products: Array.isArray(w.PRODUCTS) ? w.PRODUCTS.filter((p) => p && p.id !== 'gift') : [],
    landings: w.CATEGORY_LANDINGS || {},
    content: w.CONTENT_PAGES || {},
    legal: w.LEGAL_PAGES || {},
    brandNames: Array.isArray(w.BRAND_NAMES) ? w.BRAND_NAMES : [],
  };
  dom.window.close();
  return d;
}

function buildLlms({ products, landings, content, legal, brandNames }) {
  const base = SITE_URL;
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const guideKeys = ['guide-first-vibrator', 'guide-lube', 'body-safe', 'size-material', 'anonymous-billing', 'how-it-ships', 'shipping-policy', 'payment-methods', 'certification', 'faq', 'glossary', 'usage', 'care-guides'].filter((k) => content[k]);

  let idx = `# ${SITE.name} — ${SITE.tagline}\n\n> ${SITE.summary} Operē ${SITE.legalName} (Rīga, LV).\n\n`;
  idx += `## Kategorijas\n`;
  for (const k of Object.keys(landings)) idx += `- [${landings[k].title}](${base}/kategorija/${landings[k].cat || k}): ${sentence(landings[k].intro)}\n`;
  idx += `\n## Produkti\n`;
  for (const p of products) idx += `- [${p.name}](${base}/produkts/${p.id}): ${p.brand ? p.brand + ', ' : ''}€${p.price}, ${clean(p.ptype) || p.category}.\n`;
  idx += `\n## Ceļveži un info\n`;
  for (const k of guideKeys) idx += `- [${content[k].title}](${base}/info/${k}): ${clean(content[k].sub)}\n`;
  idx += `\n## Zīmoli\n${brands.join(', ')}${brandNames.length ? ` un vēl ${brandNames.length}+ zīmoli` : ''}.\n`;
  idx += `\n## Par uzņēmumu\n- ${SITE.legalName} · Reģ. ${SITE.regNr} · PVN ${SITE.vat} · ${SITE.address} · ${SITE.email} · ${SITE.phone}\n`;
  idx += `\n## Pilns saturs (LLM)\n- [llms-full.txt](${base}/llms-full.txt): Pilns produktu (cenas, specifikācijas, apraksti), piegādes, atgriešanas un BUJ saturs.\n`;

  let full = `# ${SITE.name} — ${SITE.tagline}\n\n> ${SITE.summary}\n\n`;
  full += `Operators: ${SITE.legalName}, reģ. nr. ${SITE.regNr}, PVN ${SITE.vat}, ${SITE.address}. Saziņa: ${SITE.email}, ${SITE.phone}. Valodas: ${SITE.langs.join('/')}. Tirgi: ${SITE.markets.join(', ')}. Mājaslapa: ${base}/\n\n`;
  full += `## Kāpēc ${SITE.name} (uzticība un priekšrocības)\n`;
  full += `- Diskrēta piegāde: vienkārša, nemarķēta kaste; sūtītājs un bankas izraksts rāda "NL Trading Co" — bez logo vai produktu nosaukumiem.\n`;
  full += `- Anonīms maksājums: kartes datus neuzglabājam; maksājumus apstrādā sertificēti pakalpojumu sniedzēji.\n`;
  full += `- Maksājumu veidi: ${SITE.payments.join(', ')}.\n`;
  full += `- Ķermenim droši materiāli: medicīniskas klases silikons, bez ftalātiem, atbilstība ISO 10993.\n`;
  full += `- Piegāde: visā Baltijā 1–3 darba dienu laikā; pasūtījumi līdz plkst. 16:00 (EET) nosūtīti tajā pašā darba dienā; uz pakomātu, pakalpojumu punktu vai durvīm (Omniva, DPD, Pastomat, Venipak).\n`;
  full += `- Atgriešana: 14 dienu atteikuma tiesības (ES Direktīva 2011/83/ES) + brīvprātīga 30 dienu bezmaksas atgriešana neatvērtām, aizzīmogotām precēm. Higiēnas dēļ atvērtas ķermeņa kontakta preces nav atgriežamas.\n`;
  full += `- Tikai pilngadīgām personām (18+).\n\n`;
  full += `## Kategorijas\n`;
  for (const k of Object.keys(landings)) {
    const l = landings[k]; full += `### ${l.title}\n${clean(l.intro)}\n`;
    const subs = (l.subs || []).map((s) => typeof s === 'string' ? s : (s.label || s.name || s.title || '')).filter(Boolean);
    if (subs.length) full += `Apakškategorijas: ${subs.join(', ')}.\n`;
    full += `URL: ${base}/kategorija/${l.cat || k}\n\n`;
  }
  full += `## Produkti (${products.length})\n`;
  for (const p of products) {
    const specs = [];
    if (p.modes) specs.push(`${p.modes} režīmi`);
    if (p.decibels) specs.push(`${p.decibels} dB`);
    if (p.length) specs.push(clean(p.length));
    if (p.waterproof) specs.push('ūdensizturīgs (IPX7)');
    if (p.rechargeable) specs.push('uzlādējams (USB-C)');
    full += `### ${p.name} — €${p.price}\n`;
    full += `Zīmols: ${p.brand || '-'} | Tips: ${clean(p.ptype) || '-'} | Materiāls: ${clean(p.material) || '-'}${specs.length ? ' | ' + specs.join(', ') : ''}${p.rating ? ` | Vērtējums: ${p.rating}/5 (${p.reviewCount} atsauksmes)` : ''}\n`;
    if (p.tagline) full += `${clean(p.tagline)}\n`;
    full += `${clean(p.desc).slice(0, 420)}\n`;
    full += `URL: ${base}/produkts/${p.id}\n\n`;
  }
  full += `## Zīmoli\nPieejami: ${brands.join(', ')}${brandNames.length ? `, un vēl ${brandNames.length}+ zīmoli (piem., ${brandNames.slice(0, 12).join(', ')}…)` : ''}.\n\n`;
  const faq = (content.faq && content.faq.sections) || [];
  if (faq.length) { full += `## Biežāk uzdotie jautājumi (BUJ)\n`; for (const [q, a] of faq) full += `**${clean(q)}** ${clean(a)}\n\n`; }
  const ret = (legal.returns && legal.returns.sections) || [];
  if (ret.length) { full += `## Piegāde un atgriešana\n`; for (const [h, t] of ret.slice(0, 8)) full += `**${clean(h)}**: ${clean(t)}\n`; full += `\n`; }
  full += `## Uzņēmums\n${SITE.legalName}, reģ. nr. ${SITE.regNr}, PVN ${SITE.vat}. Adrese: ${SITE.address}. E-pasts: ${SITE.email}. Tālrunis: ${SITE.phone}.\n`;

  return { index: idx, full };
}

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

async function main() {
  const data = await collectData('mobile');
  const { index, full } = buildLlms(data);
  fs.writeFileSync(path.join(OUT, 'llms.txt'), index);
  fs.writeFileSync(path.join(OUT, 'llms-full.txt'), full);
  console.log(`  [llms] llms.txt (${(index.length / 1024).toFixed(1)} KB) + llms-full.txt (${(full.length / 1024).toFixed(1)} KB) from ${data.products.length} products, ${Object.keys(data.landings).length} categories`);
  const n = await prerender(ROUTES);
  console.log(`prerender: ${n} page(s)`);
}
// Non-fatal: an SSG hiccup must never block a deploy (the working router stays).
main().then(() => process.exit(0)).catch((e) => { console.error('[prerender] non-fatal:', e && e.message); process.exit(0); });
