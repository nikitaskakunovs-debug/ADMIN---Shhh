// shop-consent.jsx — GDPR/ePrivacy cookie consent manager.
// Categories: necessary (always), analytics, ads, functional.
// Scripts are GATED — analytics/ads tags only fire after opt-in.
//
// ── LAUNCH CONFIG ─────────────────────────────────────────────
// Drop your real IDs here at go-live. Leave '' to keep a tag dormant.
const TRACKING = {
  ga4: 'G-P5RN3NFJ7J', // Google Analytics 4 (Shhh.lv property)
  clarity: '',      // Microsoft Clarity — add your own ID to enable
  metaPixel: '',    // Meta/Facebook Pixel — add your real Pixel ID to enable
  googleAds: '',    // e.g. 'AW-XXXXXXXXX'  (Google Ads remarketing)
  tiktok: 'D8M8CDJC77UDGKSVL3GG', // TikTok Pixel
};

// Cookie registry shown in the "Par sīkfailiem" detail table.
const COOKIE_REGISTRY = {
  necessary: [
    { name: 'SHHHSID', prov: 'shhh.lv', dur: 'Sesija', desc: 'Nodrošina groza un sesijas saglabāšanu pasūtīšanas laikā.' },
    { name: 'shhh_consent', prov: 'shhh.lv', dur: '12 mēneši', desc: 'Saglabā tavas sīkdatņu izvēles.' },
    { name: 'shhh_age', prov: 'shhh.lv', dur: '12 mēneši', desc: 'Atceras 18+ vecuma apstiprinājumu.' },
  ],
  analytics: [
    { name: '_ga', prov: 'Google LLC', dur: '13 mēneši', desc: 'Atšķir unikālos lietotājus apmeklējumu statistikai.' },
    { name: '_ga_*', prov: 'Google LLC', dur: '13 mēneši', desc: 'Saglabā sesijas stāvokli Google Analytics.' },
    { name: '_clck / _clsk', prov: 'Microsoft', dur: '1 diena – 1 gads', desc: 'Microsoft Clarity sesijas un mijiedarbības analīze.' },
  ],
  ads: [
    { name: '_gcl_au', prov: 'Google LLC', dur: '3 mēneši', desc: 'Google Ads konversiju mērīšana.' },
    { name: 'IDE / test_cookie', prov: 'Google DoubleClick', dur: '1 gads', desc: 'Reklāmu rādīšana un atkārtota mārketinga atbalsts.' },
    { name: '_fbp', prov: 'Meta', dur: '3 mēneši', desc: 'Meta (Facebook/Instagram) reklāmu mērīšana.' },
    { name: '_ttp / _tt_enable_cookie', prov: 'TikTok', dur: '13 mēneši', desc: 'TikTok reklāmu mērīšana un mērķauditorijas.' },
  ],
  functional: [
    { name: 'shhh_lang', prov: 'shhh.lv', dur: '12 mēneši', desc: 'Atceras izvēlēto valodu.' },
    { name: 'shhh_recent', prov: 'shhh.lv', dur: '30 dienas', desc: 'Saglabā nesen skatītos produktus.' },
  ],
};

const CONSENT_KEY = 'shhh_consent_v1';

function readConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch (e) { return null; }
}
function writeConsent(c) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, ts: Date.now() })); } catch (e) {}
  // Fire/skip tags based on consent (real tags load here at launch).
  applyConsent(c);
  window.dispatchEvent(new CustomEvent('shhh-consent', { detail: c }));
}

// Gated loader — only injects a tag if its category is granted AND an ID is set.
function applyConsent(c) {
  if (!c) return;
  if (c.analytics && TRACKING.ga4 && !window.__ga4Loaded) {
    window.__ga4Loaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TRACKING.ga4;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    // send_page_view off: shop-tracking.js sends page_view per screen itself.
    window.gtag('config', TRACKING.ga4, { anonymize_ip: true, send_page_view: false });
  }
  if (c.analytics && TRACKING.clarity && !window.__clarityLoaded) {
    window.__clarityLoaded = true;
    (function(cl, a, r, i, t, y){
      cl[a] = cl[a] || function(){ (cl[a].q = cl[a].q || []).push(arguments); };
      t = document.createElement('script'); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = document.getElementsByTagName('script')[0]; y.parentNode.insertBefore(t, y);
    })(window, 'clarity', 'script', TRACKING.clarity);
  }
  if (c.ads && (TRACKING.metaPixel || TRACKING.googleAds || TRACKING.tiktok)) {
    if (TRACKING.metaPixel && !window.__metaLoaded) {
      window.__metaLoaded = true;
      (function(f, b, e, v, n, t, s){
        if (f.fbq) return; n = f.fbq = function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, 'script');
      window.fbq('init', TRACKING.metaPixel);
      window.fbq('track', 'PageView');
    }
    if (TRACKING.googleAds && !window.__gadsLoaded) {
      window.__gadsLoaded = true;
      var gs = document.createElement('script'); gs.async = true;
      gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + TRACKING.googleAds;
      document.head.appendChild(gs);
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', TRACKING.googleAds);
    }
    if (TRACKING.tiktok && !window.__ttLoaded) {
      window.__ttLoaded = true;
      (function (w, d, t) {
        w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
        ttq.load = function (e, n) {
          var r = 'https://analytics.tiktok.com/i18n/pixel/events.js', o = n && n.partner;
          ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
          ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
          ttq._o = ttq._o || {}; ttq._o[e] = n || {};
          n = document.createElement('script'); n.type = 'text/javascript'; n.async = !0; n.src = r + '?sdkid=' + e + '&lib=' + t;
          e = document.getElementsByTagName('script')[0]; e.parentNode.insertBefore(n, e);
        };
        ttq.load(TRACKING.tiktok);
        ttq.page();
      })(window, document, 'ttq');
    }
  }
}

Object.assign(window, { TRACKING, COOKIE_REGISTRY, readConsent, writeConsent, applyConsent });
// Returning visitors: re-arm consented tags on every page load (previously
// tags only loaded in the click handler, so saved consent did nothing).
applyConsent(readConsent());

// ─────────────────────────────────────────────────────────────
// ConsentBanner — bottom bar + customise modal
// ─────────────────────────────────────────────────────────────
function ConsentBanner({ theme, open, onClose, forceCustomize, frameless = false }) {
  const [view, setView] = React.useState('bar'); // 'bar' | 'customize'
  const [langOpen, setLangOpen] = React.useState(false);
  const langCtx = (typeof useLang === 'function') ? useLang() : { lang: 'lv', setLang: () => {} };
  const [prefs, setPrefs] = React.useState(() => {
    const c = readConsent();
    return { analytics: c?.analytics || false, ads: c?.ads || false, functional: c?.functional || false };
  });
  React.useEffect(() => { if (forceCustomize && open) setView('customize'); }, [forceCustomize, open]);
  if (!open) return null;

  const save = (over) => {
    const c = { necessary: true, ...prefs, ...over };
    writeConsent(c);
    onClose();
  };

  const CAT = [
    { k: 'necessary', t: 'Obligāti nepieciešamās', d: 'Nodrošina vietnes pamatdarbību — grozs, sesija, drošība. Vienmēr aktīvas.', locked: true },
    { k: 'analytics', t: 'Veiktspējas / Analīze', d: 'Palīdz redzēt, kā apmeklētāji lieto vietni (Google Analytics, Microsoft Clarity). Neidentificē tevi personīgi.' },
    { k: 'ads', t: 'Mērķa / Reklāma', d: 'Ļauj rādīt atbilstošas reklāmas un mērīt kampaņas (Meta, Google Ads).' },
    { k: 'functional', t: 'Funkcionalitātes', d: 'Atceras tavas izvēles, piem., valodu un nesen skatītos produktus.' },
  ];

  return (
    <div style={{
      position: frameless ? 'fixed' : 'absolute', inset: 0, zIndex: 130,
      display: 'flex',
      alignItems: view === 'customize' ? 'flex-end' : 'flex-end',
      justifyContent: view === 'customize' ? 'center' : 'flex-start',
      background: view === 'customize' ? 'rgba(0,0,0,0.45)' : 'transparent',
      backdropFilter: view === 'customize' ? 'blur(4px)' : 'none',
      WebkitBackdropFilter: view === 'customize' ? 'blur(4px)' : 'none',
      pointerEvents: 'none',
      padding: view === 'customize' ? 0 : '0 12px 84px',
    }}>
      <div style={{
        width: view === 'customize' ? '100%' : 'auto',
        maxWidth: view === 'customize' ? 'none' : 320,
        maxHeight: view === 'customize' ? '90%' : 'auto', overflowY: 'auto',
        background: theme.bg, pointerEvents: 'auto',
        borderRadius: view === 'customize' ? '20px 20px 0 0' : 18,
        border: view === 'customize' ? 'none' : `1px solid ${theme.rule}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
        padding: view === 'customize' ? '18px 18px 22px' : '16px 16px 16px',
      }}>
        {view === 'bar' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 17, color: theme.ink, letterSpacing: theme.letterDisplay }}>
                Mēs izmantojam sīkfailus
              </div>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={() => setLangOpen(o => !o)} aria-label={'Valoda: ' + ((langCtx.lang || 'lv').toUpperCase())} style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, minHeight: 24,
                }}>
                  <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>🌐</span>
                  <span style={{ fontFamily: theme.mono, fontSize: 10, fontWeight: 700, color: theme.inkSoft }}>
                    {(langCtx.lang || 'lv').toUpperCase() === 'ET' ? 'EE' : (langCtx.lang || 'lv').toUpperCase()}
                  </span>
                </button>
                {langOpen && (
                  <div style={{
                    position: 'absolute', top: 26, right: 0, zIndex: 10,
                    background: theme.bg, border: `1px solid ${theme.rule}`,
                    borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
                    padding: 4, minWidth: 84,
                  }}>
                    {[['LV','lv'],['RU','ru'],['ENG','en'],['LT','lt'],['EE','et']].map(([lbl, code]) => {
                      const on = langCtx.lang === code;
                      return (
                        <button key={code} onClick={() => { langCtx.setLang(code); setLangOpen(false); }} style={{
                          all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box',
                          padding: '7px 10px', borderRadius: 7,
                          background: on ? theme.surfaceAlt : 'transparent',
                          fontFamily: theme.body, fontSize: 12, fontWeight: 700,
                          color: theme.ink,
                        }}>{lbl}</button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.5, marginBottom: 14 }}>
              Sīkfaili ļauj mums uzlabot lietotāju pieredzi un ieviest jaunas funkcijas. Novērtēsim, ja piekritīsi to izmantošanai.{' '}
              <button onClick={() => { window.__shhhNavLegal && window.__shhhNavLegal('cookies'); }} style={{
                all: 'unset', cursor: 'pointer', color: theme.accent, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', minHeight: 24,
              }}>Lasīt vairāk</button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => save({ analytics: false, ads: false, functional: false })} style={{
                all: 'unset', cursor: 'pointer', flex: 1, height: 44, borderRadius: 8,
                background: 'transparent', color: theme.ink, textAlign: 'center',
                border: `1.5px solid ${theme.rule}`,
                fontFamily: theme.body, fontWeight: 700, fontSize: 12.5, letterSpacing: 0.4,
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>Atteikties</button>
              <button onClick={() => save({ analytics: true, ads: true, functional: true })} className="shhh-grad" style={{
                cursor: 'pointer', flex: 1, height: 44, borderRadius: 8,
                fontFamily: theme.body, fontWeight: 700, fontSize: 12.5, letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}>Piekrist visiem</button>
            </div>
            <button onClick={() => setView('customize')} style={{
              all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center', boxSizing: 'border-box',
              marginTop: 12, padding: '7px 0', fontFamily: theme.body, fontSize: 12, fontWeight: 700,
              letterSpacing: 0.4, textTransform: 'uppercase', color: theme.inkSoft,
            }}>⚙ Pielāgot</button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>
                Sīkdatņu iestatījumi
              </div>
              <button onClick={() => setView('bar')} style={{
                all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999,
                background: theme.surfaceAlt, color: theme.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {CAT.map(c => {
                const on = c.locked || prefs[c.k];
                return (
                  <div key={c.k} style={{
                    padding: 14, borderRadius: theme.radius,
                    background: theme.surface, border: `1px solid ${theme.rule}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>{c.t}</div>
                      <button onClick={() => !c.locked && setPrefs(p => ({ ...p, [c.k]: !p[c.k] }))}
                        disabled={c.locked} style={{
                        all: 'unset', cursor: c.locked ? 'default' : 'pointer',
                        width: 44, height: 26, borderRadius: 999, flexShrink: 0,
                        background: on ? theme.accent : theme.rule,
                        opacity: c.locked ? 0.5 : 1, position: 'relative',
                        transition: 'background .2s',
                      }}>
                        <span style={{
                          position: 'absolute', top: 3, left: on ? 21 : 3,
                          width: 20, height: 20, borderRadius: 999, background: '#fff',
                          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }} />
                      </button>
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.45 }}>{c.d}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => save({})} style={{
                all: 'unset', cursor: 'pointer', flex: 1, height: 46, borderRadius: 999,
                background: 'transparent', color: theme.ink, textAlign: 'center',
                border: `1.5px solid ${theme.rule}`,
                fontFamily: theme.body, fontWeight: 700, fontSize: 13.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>Saglabāt izvēli</button>
              <button onClick={() => save({ analytics: true, ads: true, functional: true })} className="shhh-grad" style={{
                cursor: 'pointer', flex: 1, height: 46, borderRadius: 999,
                fontFamily: theme.body, fontWeight: 700, fontSize: 13.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>Piekrist visiem</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.ConsentBanner = ConsentBanner;
