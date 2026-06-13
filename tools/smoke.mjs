// tools/smoke.mjs — deploy gate. Boots the COMPILED bundles in jsdom and fails
// (non-zero exit) if either storefront page does not render. Run after
// `node tools/build.mjs`; if this fails in CI the gh-pages publish is skipped,
// so a broken build can never reach the live site.

import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function shim(win) {
  win.scrollTo = () => {}; win.scroll = () => {};
  win.matchMedia = (q) => ({ matches: false, media: q, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  class OBS { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  win.IntersectionObserver = OBS; win.ResizeObserver = OBS;
  win.fetch = () => Promise.reject(new Error('offline-smoke')); // force the demo-data fallback
  if (!win.requestAnimationFrame) win.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
}

async function boot(page) {
  const url = `https://example.test/${page}.html`;
  const dom = new JSDOM('<!DOCTYPE html><html><head><title>t</title></head><body><div id="root"></div></body></html>',
    { runScripts: 'dangerously', pretendToBeVisual: true, url });
  const win = dom.window; shim(win);
  const errors = [];
  win.addEventListener('error', (e) => errors.push('window.error: ' + ((e.error && e.error.stack) || e.message)));
  win.console.error = (...a) => errors.push('console.error: ' + a.map(String).join(' '));
  const run = (f) => { const s = win.document.createElement('script'); s.textContent = fs.readFileSync(path.join(ROOT, f), 'utf8'); win.document.body.appendChild(s); };
  try {
    run('vendor/react.production.min.js');
    run('vendor/react-dom.production.min.js');
    run(`build/dist/${page}.bundle.js`); // core (or single) bundle
  } catch (e) { errors.push('THROW during core load: ' + (e.stack || e.message)); }
  await new Promise((r) => setTimeout(r, 900)); // stay under the core's 1500ms idle rest-loader
  const root = win.document.getElementById('root');
  const kids = root ? root.childNodes.length : -1;
  const text = root ? (root.textContent || '').length : 0;

  // If this page is code-split, load the lazy "rest" bundle and confirm it
  // defines its screen components without error (the build's idle-loader would
  // do this at runtime; we drive it explicitly so a bad split fails the gate).
  let restNote = '';
  const restRel = `build/dist/${page}.rest.js`;
  if (fs.existsSync(path.join(ROOT, restRel))) {
    try {
      run(restRel);
      win.__shhhRest = true;
      win.dispatchEvent(new win.Event('shhh-rest-ready'));
    } catch (e) { errors.push('THROW during rest load: ' + (e.stack || e.message)); }
    await new Promise((r) => setTimeout(r, 350));
    const need = ['DCheckout', 'DCart', 'DSearch', 'DContentHost'];
    const missing = need.filter((g) => typeof win[g] !== 'function');
    if (missing.length) errors.push('rest globals missing after load: ' + missing.join(','));
    restNote = ` rest=loaded(${need.length - missing.length}/${need.length})`;
  }

  // Ignore React dev warnings / benign noise; everything else is fatal.
  const fatal = errors.filter((e) => !/Warning:|act\(|deprecated/i.test(e));
  const ok = kids > 0 && text > 200 && fatal.length === 0;
  console.log(`[smoke:${page}] root.children=${kids} text=${text}${restNote} fatal=${fatal.length} -> ${ok ? 'OK' : 'FAIL'}`);
  fatal.slice(0, 8).forEach((e) => console.log('   ! ' + e.slice(0, 280)));
  return ok;
}

const results = [];
for (const p of ['desktop', 'mobile']) results.push(await boot(p));
const allOk = results.every(Boolean);
console.log(allOk ? 'SMOKE PASS' : 'SMOKE FAIL');
process.exit(allOk ? 0 : 1);
