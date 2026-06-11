// shop-seo.jsx — per-page SEO: dynamic <title>, meta description, canonical,
// hreflang, Open Graph, and JSON-LD structured data injected on navigation.

const SITE = {
  name: 'Shhh',
  baseUrl: 'https://shhh.lv',
  langs: ['lv', 'ru', 'lt', 'et', 'en'],
};

// Per-screen SEO metadata. {title} gets the brand appended.
const SEO_MAP = {
  home:        { path: '/',                 title: 'Shhh — diskrēts seksa veikals · intīmpreces ar piegādi Baltijā', desc: 'Diskrēts pieaugušo veikals. Vienkārša kaste, anonīms maksājums, ķermenim droši materiāli. Piegāde Baltijā 24h. Vibratori, dildo, lubrikanti, prezervatīvi.' },
  category:    { path: '/veikals',          title: 'Veikals — visas intīmpreces', desc: 'Pārlūko visu sortimentu: vibratori, anālie stimulatori, dildo, lubrikanti, erotiskā veļa, prezervatīvi. Diskrēta piegāde, anonīms maksājums.' },
  product:     { path: '/produkts',         title: '', desc: '' }, // filled per-product
  cart:        { path: '/grozs',            title: 'Grozs', desc: 'Tavs iepirkumu grozs.', noindex: true },
  checkout:    { path: '/apmaksa',          title: 'Apmaksa', desc: 'Droša, anonīma apmaksa.', noindex: true },
  confirmation:{ path: '/pasutijums',       title: 'Pasūtījums apstiprināts', desc: '', noindex: true },
  account:     { path: '/konts',            title: 'Mans konts', desc: '', noindex: true },
  packaging:   { path: '/ka-tas-pienak',    title: 'Kā tas pienāk — diskrēta piegāde', desc: 'Vienkārša kaste bez logo, anonīms sūtītājs "NL Trading Co", piegāde uz pakomātu vai durvīm. Uzzini, kā saglabājam tavu privātumu.' },
  legal:       { path: '/juridiski',        title: 'Juridiskā informācija', desc: 'Lietošanas noteikumi, privātuma politika, sīkfaili un atgriešanas.' },
  content:     { path: '/info',             title: '', desc: '' }, // filled per-key
  catland:     { path: '/kategorija',       title: '', desc: '' }, // filled per-cat
  '404':       { path: '/404',              title: 'Lapa nav atrasta', desc: '', noindex: true },
};

function _setMeta(name, content, attr = 'name') {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function _setLink(rel, href, hreflang) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function _setJsonLd(id, obj) {
  let el = document.getElementById(id);
  if (obj == null) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

// Static, site-wide structured data injected once.
function injectGlobalSEO() {
  let g = {};
  try { g = (JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}')).__global || {}; } catch (e) {}
  const baseUrl = g.baseUrl || SITE.baseUrl;
  _setJsonLd('ld-org', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: g.siteName || 'Shhh',
    legalName: g.orgName || 'NL Trading Co SIA',
    url: baseUrl,
    logo: baseUrl + '/logo.png',
    vatID: g.vat || 'LV40203456789',
    address: {
      '@type': 'PostalAddress',
      streetAddress: g.address || 'Brīvības iela 68 – 14',
      addressLocality: 'Rīga',
      postalCode: 'LV-1011',
      addressCountry: 'LV',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: g.email || 'support@shhh.lv',
      telephone: g.phone || '+371-6700-0000',
      contactType: 'customer support',
      availableLanguage: ['Latvian', 'Russian', 'Lithuanian', 'Estonian', 'English'],
    },
  });
  _setJsonLd('ld-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shhh',
    url: SITE.baseUrl,
    inLanguage: SITE.langs,
    potentialAction: {
      '@type': 'SearchAction',
      target: SITE.baseUrl + '/veikals?q={query}',
      'query-input': 'required name=query',
    },
  });
}

// Update SEO for the current screen. Pulls product / content / category context.
function updateSEO(screen, params, lang) {
  const base = SEO_MAP[screen] || SEO_MAP.home;
  let title = base.title;
  let desc = base.desc;
  let path = base.path;
  let crumb = null;
  let product = null;

  if (screen === 'product') {
    const p = (window.PRODUCTS || []).find(x => x.id === params?.id);
    if (p) {
      product = p;
      title = `${p.name} — ${p.tagline}`;
      desc = `${p.desc || ''} ${p.material}. Diskrēta piegāde, anonīms maksājums, bezmaksas atgriešana.`.trim().slice(0, 158);
      path = '/produkts/' + p.id;
    }
  } else if (screen === 'content') {
    const pg = (window.CONTENT_PAGES || {})[params?.key];
    if (pg) {
      title = pg.title;
      desc = (pg.sub || '').slice(0, 158);
      path = '/info/' + (params.key || '');
    }
  } else if (screen === 'catland') {
    const cl = (window.CATEGORY_LANDINGS || {})[params?.cat];
    if (cl) {
      title = cl.title + ' — diskrēts seksa veikals';
      desc = (cl.intro || '').slice(0, 158);
      path = '/kategorija/' + (params.cat || '');
      crumb = cl.title;
    }
  } else if (screen === 'legal') {
    path = '/juridiski/' + (params?.key || 'terms');
  }

  // CMS SEO overrides (per page + language), edited in the admin panel.
  let _kw = '', _ogTitle, _ogDesc, _ogImage, _robots, _canonical, _twCard;
  try {
    const ov = JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}');
    const okey = screen === 'content' ? (params && params.key) : null;
    const entry = okey ? ov[okey] : null;
    if (entry) {
      const seo = Object.assign({}, (entry.lv || {}).seo, (entry[lang] || {}).seo);
      if (seo.title) title = seo.title;
      if (seo.description) desc = seo.description;
      _kw = seo.keywords || ''; _ogTitle = seo.ogTitle; _ogDesc = seo.ogDescription;
      _ogImage = seo.ogImage; _robots = seo.robots; _canonical = seo.canonical; _twCard = seo.twitterCard;
    }
  } catch (e) {}

  // Global SEO defaults (admin "Global SEO" editor → '__global').
  try {
    const g = (JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}')).__global || {};
    if (screen === 'home') { if (g.defaultTitle) title = g.defaultTitle; if (g.defaultDesc) desc = g.defaultDesc; }
    if (!_kw && g.defaultKeywords) _kw = g.defaultKeywords;
    if (!_ogImage && g.defaultOgImage) _ogImage = g.defaultOgImage;
  } catch (e) {}

  const fullTitle = title ? `${title} | Shhh` : 'Shhh — diskrēts seksa veikals';
  document.title = fullTitle;

  _setMeta('description', desc);
  _setMeta('robots', _robots ? (_robots === 'noindex' ? 'noindex,follow' : 'index,follow') : (base.noindex ? 'noindex,follow' : 'index,follow'));
  if (_kw) _setMeta('keywords', _kw);

  // Open Graph + Twitter
  _setMeta('og:title', _ogTitle || fullTitle, 'property');
  _setMeta('og:description', _ogDesc || desc, 'property');
  _setMeta('og:type', product ? 'product' : 'website', 'property');
  _setMeta('og:url', (_canonical || (SITE.baseUrl + path)), 'property');
  _setMeta('og:site_name', 'Shhh', 'property');
  if (_ogImage) _setMeta('og:image', _ogImage, 'property');
  _setMeta('twitter:card', _twCard || 'summary_large_image');
  _setMeta('twitter:title', _ogTitle || fullTitle);
  _setMeta('twitter:description', _ogDesc || desc);
  if (_ogImage) _setMeta('twitter:image', _ogImage);

  // Canonical + hreflang
  const canonical = _canonical || (SITE.baseUrl + path);
  _setLink('canonical', canonical);
  SITE.langs.forEach(l => _setLink('alternate', `${SITE.baseUrl}/${l}${path === '/' ? '' : path}`, l));
  _setLink('alternate', canonical, 'x-default');

  // Per-page JSON-LD: breadcrumb
  const crumbs = [{ name: 'Sākums', path: '/' }];
  if (screen === 'product') { crumbs.push({ name: 'Veikals', path: '/veikals' }); crumbs.push({ name: product?.name || '', path }); }
  else if (screen === 'catland') { crumbs.push({ name: 'Veikals', path: '/veikals' }); crumbs.push({ name: crumb || '', path }); }
  else if (screen === 'content') { crumbs.push({ name: title || '', path }); }
  else if (screen === 'category') { crumbs.push({ name: 'Veikals', path }); }
  if (crumbs.length > 1) {
    _setJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name,
        item: SITE.baseUrl + c.path,
      })),
    });
  } else {
    _setJsonLd('ld-breadcrumb', null);
  }

  // Product schema
  if (product) {
    _setJsonLd('ld-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.desc,
      sku: product.id,
      material: product.material,
      brand: { '@type': 'Brand', name: 'Shhh' },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: canonical,
        seller: { '@type': 'Organization', name: 'NL Trading Co SIA' },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7', reviewCount: 128,
      },
    });
  } else {
    _setJsonLd('ld-product', null);
  }

  // FAQ schema on the FAQ content page
  if (screen === 'content' && params?.key === 'faq') {
    const pg = (window.CONTENT_PAGES || {}).faq;
    if (pg && pg.sections) {
      _setJsonLd('ld-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pg.sections.map(([q, a]) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
  } else {
    _setJsonLd('ld-faq', null);
  }

  // Article schema on journal posts
  if (screen === 'content' && (params?.key || '').startsWith('journal-')) {
    const pg = (window.CONTENT_PAGES || {})[params.key];
    if (pg) {
      _setJsonLd('ld-article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pg.title,
        description: pg.sub,
        datePublished: pg.published,
        author: { '@type': 'Organization', name: 'Shhh' },
        publisher: { '@type': 'Organization', name: 'Shhh' },
      });
    }
  } else {
    _setJsonLd('ld-article', null);
  }

  // HowTo schema on the usage-instructions page
  if (screen === 'content' && params?.key === 'usage') {
    const pu = window.PRODUCT_USAGE || {};
    const ld = Object.keys(pu).map(pid => {
      const prod = (window.PRODUCTS || []).find(p => p.id === pid);
      return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Kā lietot ' + (prod ? prod.name : pid),
        step: pu[pid].steps.map((s, i) => ({
          '@type': 'HowToStep', position: i + 1, text: s,
        })),
      };
    });
    _setJsonLd('ld-howto', ld);
  } else {
    _setJsonLd('ld-howto', null);
  }
}

Object.assign(window, { injectGlobalSEO, updateSEO, SEO_MAP, SITE_SEO: SITE });
