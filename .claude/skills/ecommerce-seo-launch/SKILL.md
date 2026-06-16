---
name: ecommerce-seo-launch
description: >
  Playbook for making a client-rendered (React/SPA) ecommerce or marketing site
  genuinely effective for SEO, AI/answer-engine search (GEO/AEO), analytics, and
  launch-readiness — not just "looks done." Covers the #1 trap (JS-injected SEO
  on a client-rendered SPA is invisible to crawlers), pre-rendering/SSG on static
  hosting, real structured data, GTM/GA4/TikTok consent-gated tracking,
  performance (dropping in-browser transpilers, code-splitting), accessibility,
  and a headless validation harness. Use when working on SEO, structured data
  (schema.org / JSON-LD), llms.txt, sitemaps, robots, GTM/GA4/Meta/TikTok tag
  setup, cookie consent, pre-rendering/SSR/SSG, Core Web Vitals / PageSpeed,
  accessibility audits, or launch-readiness for a website — especially a
  JavaScript-rendered one on static hosting (GitHub Pages, S3, Netlify static).
---

# Ecommerce / marketing-site SEO + launch playbook

Distilled from shipping a real Latvian adult-ecommerce store (React + Babel-standalone,
no build step, GitHub Pages). Most of this is the *non-obvious* stuff — the traps that
make a site look finished while doing nothing. Follow it; update it when reality teaches
you something new.

## 0. The order of operations (do not skip step 1)

1. **Diagnose what a crawler actually receives** before touching anything (§1).
2. **Foundations** that everything else depends on: real domain, real URLs, server-visible HTML (§2).
3. **Structured data from real data**, not placeholders (§3).
4. **Tracking** (GTM/GA4/etc.), consent-gated, no PII (§4).
5. **Performance** and **accessibility** (§5, §6).
6. **Validate everything with the headless harness** (§7) — this is the highest-leverage habit here.

## 1. FIRST: what does a no-JS crawler see? (the #1 trap)

A client-rendered SPA serves an **empty `<div id="root">`** and paints the page with JS.
Beautiful Organization/Product/FAQ JSON-LD injected by `document.createElement` after
React mounts is **invisible** to:
- **Bing** (limited JS rendering),
- **every AI crawler**: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Amazonbot, Applebot.
- Googlebot *can* render JS (deferred, 2-phase, less reliably) — it's the only one that does well.

So markup that "looks great in theory" can be **completely non-functional live**. Always check first:

```bash
# What's actually in the served HTML (no JS):
node -e "const h=require('fs').readFileSync('build/index.html','utf8');
const text=h.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
console.log('visible text:',text.length,'chars | JSON-LD blocks:',(h.match(/application\/ld\+json/g)||[]).length);"
```
If that prints `0 chars / 0 JSON-LD`, the SEO/AEO program is non-functional regardless of how good the markup is. Fix the foundation (§2) before anything else.

## 2. Foundations (without these, the rest does nothing)

- **The domain must be real and singular.** A `sitemap.xml`, `llms.txt`, canonicals and schema
  that all point at `https://brand.tld` while the site is served from `…github.io/repo/` means
  every canonical points crawlers *away* to a dead host → pages get dropped. Centralize the
  domain in **one** place (a `SITE_URL` constant) and rewrite all output to it at build time.
  Don't seriously SEO a temp/preview domain; wait for DNS.
- **URLs must be real, crawlable files** — one per product/category/article. An SPA with
  state-based "routes" (`/produkts/x` that's React state, not a file) has **zero** indexable
  product URLs and the sitemap lists 404s. Fix = pre-render (§2a).
- **Avoid JS redirects as entry points.** `index.html` doing `location.replace()` is invisible to
  non-JS bots and a soft signal at best.

### 2a. Pre-render (SSG) — the keystone for a JS site on static hosting

SSR vs pre-render: **for crawlers they're identical** (both ship full HTML). SSG needs no
server, stays on static hosting, and the client app refreshes live data after load (no "price
flash"). **Pick SSG** unless you genuinely need per-request personalization.

The pattern that worked (no framework, just the existing build + jsdom):
1. **Build** the production bundle (Babel-free, prod React) into `build/`.
2. **Pre-render**: boot the bundle in **jsdom**, let React + the SEO module render and inject
   JSON-LD, then **bake the rendered `#root` + the JSON-LD into a static HTML file** per route.
   Enumerate routes from the live data (`PRODUCTS`, categories, content, legal).
3. Each deep page **bakes `window.__shhhRoute = {screen, params}`** so the bundle boots on the
   right screen for real users too, and **device-routes** the bundle (desktop/mobile) in place.
4. Generate `sitemap.xml` from the **pages actually emitted** (not a hand-written list).
5. Wire it into CI: `build → prerender → smoke → deploy`. Make pre-render **non-fatal**
   (a thin/broken route is skipped; the build still deploys).

Gotchas that cost real time here (check them every time):
- **Relative assets 404 from subdirectories.** A page at `/produkts/x/` loading `vendor/react.js`
  resolves to `/produkts/x/vendor/react.js` → 404 → no bundle. Fix with a **relative
  `<base href="../../">`** (depth = number of path segments) — works on a subpath *and* a root domain.
- **Screen-name mismatches silently kill schema.** If the router uses `'pdp'`/`'browse'` but the
  SEO module only builds product schema for `screen === 'product'`, the product JSON-LD,
  `<title>` and canonical **never fire**. Normalize names in one place.
- **Memory / time at scale.** Hundreds of jsdom boots can OOM and a mid-loop throw can skip the
  tail (sitemap/legal). Use **per-route try/catch**, write the sitemap from successes, and
  **don't pre-render thin auto-generated pages** (e.g. a page per brand for 260 brands with no
  products) — curate.
- `process.exit(0)` after jsdom work — carousels/timers keep the event loop alive.

### 2b. pushState (real shareable URLs + back/forward)

Sync the URL on navigation so deep links are shareable and history works. Keep it scoped to
**indexable screens** (which have pre-rendered files, so refresh always hits a real page);
leave transient screens (cart/checkout) on the last URL. **Detect the base path at runtime**
(strip the current route/filename from `location.pathname`) so it works on `/repo/` subpaths and
root domains. Validate with a subpath server, not just `/`.

### 2c. robots / sitemap / llms

- `robots.txt`: explicitly **allow the AI crawlers** (GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, PerplexityBot, Applebot-Extended,
  Bingbot); disallow private flows (cart/checkout/account/admin). Point `Sitemap:` at the real domain.
- `sitemap.xml`: watch the **namespace typo** `sitemap.org` → must be `sitemaps.org` (silently
  invalidates the whole file). Generate it from real emitted URLs.
- **`llms.txt`** (curated index) + **`llms-full.txt`** (full plain-text feed: trust/USP block,
  every category intro, every product with specs+price+description, FAQ, returns). **Auto-generate
  from the catalog during the build** so it can't go stale. It only works at the domain **root**
  (`/llms.txt`) — useless on a subpath. It's emerging/unofficial (many engines ignore it) — a
  cheap supplement, not a substitute for server-visible content.

## 3. Structured data — from REAL data, never placeholders

- **Never fabricate.** A hardcoded `aggregateRating: 4.7/128` on every product, or `brand: "Shop"`
  when products are real brands, is a **Google policy violation** (manual-action risk) and just a
  lie. Build schema from the actual record: real `brand`, `gtin` from the barcode, `price`,
  `availability` from stock, **per-product** rating *only if real reviews exist on the page*
  (else omit it).
- Complete the `Offer`: `priceValidUntil`, `itemCondition`, `hasMerchantReturnPolicy`,
  `shippingDetails` — these now gate merchant rich results.
- Use an `@graph` with `@id`s so Organization/WebSite/Product/Breadcrumb form one entity.
  Add real `sameAs` (social/Wikidata) — the strongest knowledge-graph signal.
- Per page type: Organization+WebSite (home), Product+Offer+(Review/AggregateRating) (PDP),
  CollectionPage+ItemList (category), BreadcrumbList (everywhere), FAQPage, Article+Person author.
- **Adult / restricted verticals:** expect Shopping/merchant rich results to be **suppressed by
  policy** regardless of perfect markup. Aim for Breadcrumb/FAQ/Article/Sitelinks-Search-Box +
  AI citeability instead, and say so honestly.

## 4. Tracking (GTM / GA4 / Meta / TikTok) — consent-gated, no PII

- **One dataLayer** funnel; map events to vendors in GTM. Don't *also* add GA4 tags in GTM if
  you forward to GA4 in code — it double-counts.
- **GDPR consent gating:** analytics/ads tags load **only after opt-in**; re-arm saved consent on
  every later visit. Keep dormant slots for vendors keyed off the consent category.
- **No PII, ever** in any event (no email/phone/name/address/payment) — by construction.
- **Purchase fires ONLY on confirmed payment**, with the **server-computed final paid total**
  (products + shipping − discounts − gift cards) for honest ROAS — never on form submit / pending /
  bank-transfer creation. **Dedupe per order id** (sessionStorage) so a confirmation-page refresh
  can't re-fire it. Use `event_id = order_id` for browser/server (CAPI) dedup later.
- Exclude staging/showroom traffic (`?stage=1` etc.) from all conversion events.
- Watch for **leftover agency IDs** (a prototype's GA4/Pixel/Clarity) leaking real visitor data —
  audit and remove before launch.
- Quiet debug `console.log`s behind a flag before launch.

## 5. Performance (Core Web Vitals / PageSpeed)

- **In-browser transpilation is the killer.** Shipping `@babel/standalone` (~3 MB) + React *dev*
  builds and transpiling JSX on the main thread caps mobile Performance around 30–55 and is the
  single biggest win to remove. Move transpilation to **build time** (precompile JSX → a minified,
  Babel-free bundle) and ship **React production** builds. This can also be done in CI so the
  "no build step" dev workflow is preserved (edit source, push, CI compiles).
- **Code-split**: ship a small core (home/PDP/chrome) and lazy-load the rest **on navigation**
  (not eager-idle — eager still counts as "unused JS" in the trace). A `<link rel=prefetch>`
  keeps first nav fast. Guard navigation to a not-yet-loaded screen with a loader.
- **Fonts**: load the stylesheet **non-render-blocking** (`media=print` → `onload`), `display=swap`,
  and **only the families actually used** (audit — desktop/mobile themes may differ).
- **Honest ceiling:** a client-rendered store that must show **correct prices** has an LCP gated by
  JS + the catalog fetch. Without SSR/SSG you'll plateau (often 80s, not 100) on mobile. Pre-rendering
  (§2a) is what actually fixes LCP too. Don't promise 100 you can't reach; say what's blocking it.

## 6. Accessibility (the audits that actually fail)

Real failures seen + fixes:
- **`button-name`**: icon-only buttons need `aria-label` (and `type="button"`); mark decorative
  SVGs `aria-hidden="true"`.
- **`label`**: most inputs pass via `placeholder` (axe accepts it as an accessible name), but add
  `aria-label` on search/icon inputs anyway.
- **`color-contrast`**: borderline greys (`#737373` on `#F2F2F0` = 4.4) fail 4.5:1 → nudge darker
  (`#6E6E6E`). Watch **compounded opacity** (parent `0.7` × child `0.55` = 0.385 → fails). Brand
  logo text (e.g. a payment mark) can fail — darken it.
- **`target-size`** (mobile, WCAG 2.5.8): icon buttons squished by flex (add `flexShrink:0`),
  dense footer/nav links (add padding/min-height ≥24px), carousel dots/arrows. **Some are genuinely
  hard** on dense product cards without a redesign — fix the tractable ones, be honest about the rest.
  Also catch **collapsed buttons** (a `width:100%` element inside an `all:unset` button can render
  ~2px if the grid column collapses — give the wrapper an explicit aspect/`minmax`).
- `<html lang>` should match the rendered language (and update it when the language switcher changes).
- A named, credentialed `Person` author is a strong E-E-A-T + AI-trust signal.

## 7. Validation harness (the highest-leverage habit)

You can't reach the live site or run real Lighthouse from a sandbox? Build it locally. This caught
a total desktop crash, a 343px tablet overflow, the SSG base-path bug, and the screen-name bug.

- **jsdom** to render the bundle and assert content + schema (also the **deploy gate** / smoke test):
  shim `matchMedia/IntersectionObserver/ResizeObserver/scrollTo/fetch(reject→demo data)`,
  inject React + bundle as `<script>` textContent (`runScripts:'dangerously'`), wait ~1.3s,
  read `#root` text + `script[type=application/ld+json]`, then `process.exit(0)`.
- **puppeteer** (install `puppeteer` + `lighthouse` + `chrome-launcher`) for: real Lighthouse
  (`blockedUrlPatterns` for third parties to isolate first-party signal), full-page screenshots
  (read PNGs ≤2000px), **crawl every link** catching `pageerror` (finds runtime crashes), and
  overflow checks (`scrollWidth − clientWidth`, elements past the right edge).
- Caveats: headless `screen.width` ≠ viewport (device-detection scripts misfire → use a `?view=`
  override to test); the keyless PSI API is rate-limited (429) — run Lighthouse locally instead;
  large MCP results get saved to a file → parse with `jq`.
- Re-render after fixes and re-crawl; "the markup is correct" is not "the page works."

## 8. "Make it real" discipline (don't fabricate; centralize)

- **Never invent business/legal facts** — company reg number, VAT, phone, address, social handles,
  customer reviews. Fabricating these on a live commercial store is harmful. Make everything you
  *can* derive real (schema from data, generated logo/og-image/favicon), and **ask the owner** for
  the rest.
- **Centralize** the domain + business identity in **one config file** so it's a one-line update
  and it propagates (schema, footer, llms feeds). Generate the brand assets that are referenced but
  missing (`logo.png`, `og-image.png` 1200×630, `favicon`) — a 404'd OG image is a dead share card.
- Two launch items that are *not* code and must be flagged: **DNS for the real domain** and a **real
  payment provider** (a `Math.random()` "success" checkout takes no money).

## 9. Build / deploy shape that worked

- `build → prerender → smoke(gate) → publish` in CI; a failed smoke **blocks** the deploy (a broken
  build can't reach prod); a failed prerender is **non-fatal** (degrades to the client-rendered page).
- Commit/push only when asked; end commit messages with the session URL; never put the model
  identifier in commits/artifacts.
- Cache-bust local script includes with `?v=<timestamp>` so Pages' short cache doesn't serve stale JS.

## 10. Pre-launch checklist

- [ ] No-JS fetch of home + a product shows real content + JSON-LD (§1).
- [ ] One `SITE_URL`; canonicals/sitemap/llms/schema all use it; DNS connected.
- [ ] Real per-product/category/content/legal pre-rendered URLs; sitemap from real files; namespace `sitemaps.org`.
- [ ] Product schema from real data; no fabricated ratings; complete Offer.
- [ ] robots allows AI crawlers; llms.txt + llms-full.txt at root, auto-generated.
- [ ] Tracking consent-gated, no PII, purchase-only-on-paid+deduped, no leftover agency IDs.
- [ ] Babel-free prod bundle; code-split; fonts non-blocking; honest CWV expectations.
- [ ] A11y: button-name/label/contrast/target-size/lang addressed; harness re-run clean.
- [ ] Business facts real or explicitly flagged to the owner; payment provider noted.
