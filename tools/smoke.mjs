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
    run(`build/dist/${page}.bundle.js`);
  } catch (e) { errors.push('THROW during load: ' + (e.stack || e.message)); }
  await new Promise((r) => setTimeout(r, 1200));
  const root = win.document.getElementById('root');
  const kids = root ? root.childNodes.length : -1;
  const text = root ? (root.textContent || '').length : 0;
  // Ignore React dev warnings / benign noise; everything else is fatal.
  const fatal = errors.filter((e) => !/Warning:|act\(|deprecated/i.test(e));
  const ok = kids > 0 && text > 200 && fatal.length === 0;
  console.log(`[smoke:${page}] root.children=${kids} text=${text} fatal=${fatal.length} -> ${ok ? 'OK' : 'FAIL'}`);
  fatal.slice(0, 8).forEach((e) => console.log('   ! ' + e.slice(0, 280)));
  return ok;
}

const results = [];
for (const p of ['desktop', 'mobile']) results.push(await boot(p));
const allOk = results.every(Boolean);
console.log(allOk ? 'SMOKE PASS' : 'SMOKE FAIL');
process.exit(allOk ? 0 : 1);
