// tools/site.config.mjs — single source of truth for build-time site config.
// Used by tools/build.mjs (domain rewrite) and tools/prerender.mjs (llms files).
// Update these when you have the real values.

// ── Your live domain (the ONE place to set it) ─────────────────────────────
export const SITE_URL = 'https://shhh.lv';

// ── Business identity (placeholders until you provide the real ones) ───────
export const SITE = {
  name: 'Shhh',
  tagline: 'Diskrēts pieaugušo veikals — intīmpreces ar piegādi Baltijā',
  summary: 'Shhh ir diskrēts tiešsaistes pieaugušo veikals. Vienkārša kaste bez logo, anonīms maksājums, ķermenim droši materiāli un piegāde Baltijā 24 stundu laikā.',
  legalName: 'NL Trading Co SIA',
  regNr: '40203456789',
  vat: 'LV40203456789',
  address: 'Brīvības iela 68 – 14, Rīga, LV-1011, Latvija',
  email: 'support@shhh.lv',
  phone: '+371 6700 0000',
  markets: ['Latvija', 'Lietuva', 'Igaunija'],
  langs: ['lv', 'ru', 'lt', 'et', 'en'],
  payments: ['Apple Pay', 'Google Pay', 'Citadele', 'Swedbank', 'SEB', 'Luminor', 'Klix', 'Inbank', 'maksājumu kartes', 'bankas pārskaitījums'],
};
