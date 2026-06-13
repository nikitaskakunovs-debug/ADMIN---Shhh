// desktop-ui.jsx — theme tokens, TopNav, Footer, ProductCard, Buttons, primitives

const DT = {
  bg: '#FFFFFF',
  bgAlt: '#F4F4F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F2F0',
  ink: '#0A0A0A',
  inkSoft: '#6E6E6E', // AA-safe (>=4.5:1) on white and the #F2F2F0 alt surface
  rule: 'rgba(10,10,10,0.08)',
  accent: '#2D4BFF',
  radius: 16,
  radiusSm: 10,
  radiusPill: 999,
  display: '"Geist", "DM Sans", system-ui, sans-serif',
  body: '"Geist", "DM Sans", system-ui, sans-serif',
  mono: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
  ld: '-0.035em',
  lc: '0.10em',
  maxWidth: 1280,
  navHeight: 72,
};

// Theme object in the shape the reused mobile components expect (THEMES.* shape),
// so ContentScreen / brand pages / gift cards / order lookup render with desktop tokens.
const DTHEME = {
  name: 'Desktop',
  bg: DT.bg, surface: DT.surface, surfaceAlt: DT.surfaceAlt,
  ink: DT.ink, inkSoft: DT.inkSoft, rule: DT.rule,
  accent: DT.accent, accentInk: '#FFFFFF', tan: DT.ink,
  radius: DT.radius, radiusSm: DT.radiusSm, radiusPill: 999,
  display: DT.display, body: DT.body, mono: DT.mono,
  letterDisplay: DT.ld, letterCaps: DT.lc, italic: false,
  productTint: 'neutral',
};

// Reuse the gradient classes defined globally: .shhh-grad / .shhh-grad-text / .shhh-grad-dot

// ─────────────────────────────────────────────────────────────
// Layout primitives
// ─────────────────────────────────────────────────────────────
function Container({ children, style = {}, pad = true }) {
  return (
    <div style={{
      maxWidth: DT.maxWidth, margin: '0 auto',
      padding: pad ? '0 32px' : 0,
      ...style,
    }}>{children}</div>
  );
}

function Section({ children, style = {}, bg = 'transparent', divider = false }) {
  return (
    <section style={{
      background: bg, borderTop: divider ? `1px solid ${DT.rule}` : 'none',
      ...style,
    }}>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, size = 'md', full = false, style = {} }) {
  const h = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fs = size === 'lg' ? 16 : size === 'md' ? 14 : 13;
  return (
    <button onClick={onClick} className="shhh-grad" style={{
      height: h, padding: '0 22px', borderRadius: 999,
      fontFamily: DT.body, fontWeight: 700, fontSize: fs, letterSpacing: -0.1,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined,
      boxShadow: '0 6px 20px rgba(110,77,248,0.25), 0 2px 6px rgba(255,79,184,0.18)',
      ...style,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, size = 'md', full = false, style = {} }) {
  const h = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fs = size === 'lg' ? 16 : size === 'md' ? 14 : 13;
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      height: h, padding: '0 22px', borderRadius: 999,
      border: `1.5px solid ${DT.ink}`, color: DT.ink,
      fontFamily: DT.body, fontWeight: 700, fontSize: fs,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined, boxSizing: 'border-box',
      ...style,
    }}>{children}</button>
  );
}

function IconBtn({ children, onClick, badge, label, style = {} }) {
  return (
    <button onClick={onClick} aria-label={label} type="button" style={{
      all: 'unset', cursor: 'pointer', position: 'relative',
      width: 40, height: 40, flexShrink: 0, borderRadius: 999, // flexShrink:0 keeps a >=24px tap target when the nav is cramped
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: DT.ink, ...style,
    }}>
      {children}
      {badge != null && badge > 0 && (
        <span style={{
          position: 'absolute', top: 4, right: 0,
          minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
          background: DT.accent, color: '#fff',
          fontFamily: DT.mono, fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Simple SVG icons
// ─────────────────────────────────────────────────────────────
function DIcon({ name, size = 22, color = 'currentColor', sw = 1.6 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    search: <><circle cx="11" cy="11" r="7" {...p} /><path d="M16.5 16.5L21 21" {...p} /></>,
    heart: <path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" {...p} />,
    heartF: <path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" fill={color} stroke="none" />,
    bag: <><path d="M5 8H19L18 20H6L5 8Z" {...p} /><path d="M9 8C9 5.79 10.34 4 12 4C13.66 4 15 5.79 15 8" {...p} /></>,
    user: <><circle cx="12" cy="8" r="4" {...p} /><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" {...p} /></>,
    arrow: <><path d="M4 12H20" {...p} /><path d="M14 6L20 12L14 18" {...p} /></>,
    chev: <path d="M9 6L15 12L9 18" {...p} />,
    chevDown: <path d="M6 9L12 15L18 9" {...p} />,
    close: <><path d="M6 6L18 18" {...p} /><path d="M6 18L18 6" {...p} /></>,
    check: <path d="M5 12L10 17L19 7" {...p} />,
    box: <><path d="M4 8L12 4L20 8V18L12 22L4 18V8Z" {...p} /><path d="M4 8L12 12L20 8" {...p} /><path d="M12 12V22" {...p} /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" {...p} /><path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" {...p} /></>,
    truck: <><path d="M2 8H14V17H2V8Z" {...p} /><path d="M14 11H18L21 14V17H14V11Z" {...p} /><circle cx="6" cy="18.5" r="1.5" {...p} /><circle cx="17" cy="18.5" r="1.5" {...p} /></>,
    ghost: <path d="M5 10C5 6 8 4 12 4C16 4 19 6 19 10V20L17 18L15 20L13 18L11 20L9 18L7 20L5 18V10Z" {...p} />,
    card: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M3 10H21" {...p} /></>,
    eyeOff: <><path d="M3 3L21 21" {...p} /><path d="M6 6.5C4.5 7.5 3 9.5 2 12C4 17 8 19 12 19C13.5 19 15 18.7 16.3 18.3 M18 16.5C20 15 21.5 13 22 12C20 7 16 5 12 5C11 5 10 5.15 9 5.45" {...p} /></>,
    plus: <><path d="M12 5V19" {...p} /><path d="M5 12H19" {...p} /></>,
    minus: <path d="M5 12H19" {...p} />,
    zap: <path d="M13 3L5 14H11L10 21L18 10H12L13 3Z" {...p} />,
    filter: <path d="M3 5h18M6 12h12M10 19h4" {...p} />,
    info: <><circle cx="12" cy="12" r="9" {...p} /><path d="M12 11v6M12 8h.01" {...p} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name] || null}</svg>;
}

// ─────────────────────────────────────────────────────────────
// Wordmark
// ─────────────────────────────────────────────────────────────
function DWordmark({ size = 28, onClick }) {
  return (
    <div onClick={onClick} style={{
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: DT.display, fontWeight: 800, fontSize: size,
      letterSpacing: DT.ld, lineHeight: 1, display: 'inline-block',
    }} className="shhh-grad-text">shhh...</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top nav
// ─────────────────────────────────────────────────────────────
function TopNav({ nav, current, cartCount, favCount, openWelcome }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const megaRef = React.useRef(null);
  React.useEffect(() => {
    if (!megaOpen) return;
    const onDoc = (e) => { if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [megaOpen]);

  const linkStyle = (active) => ({
    all: 'unset', cursor: 'pointer',
    fontFamily: DT.body, fontWeight: 600, fontSize: 14,
    color: active ? DT.ink : DT.inkSoft, padding: '8px 0',
    borderBottom: active ? `2px solid ${DT.ink}` : '2px solid transparent',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  });

  const submitSearch = (e) => {
    e.preventDefault();
    nav('search', { q: q.trim() });
  };

  const catTiles = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${DT.rule}`,
    }}>
      <Container>
        <div style={{
          height: DT.navHeight, display: 'flex',
          alignItems: 'center', gap: 28,
        }}>
          <DWordmark size={28} onClick={() => nav('home')} />
          <nav style={{ display: 'flex', gap: 22, marginLeft: 8, alignItems: 'center' }}>
            <div ref={megaRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setMegaOpen(o => !o); }}
                onMouseEnter={() => setMegaOpen(true)}
                style={linkStyle(current === 'browse')}>
                {t('nav.shop', 'Veikals')} <span style={{ fontSize: 9, opacity: 0.5, transform: megaOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {megaOpen && (
                <div onMouseLeave={() => setMegaOpen(false)} style={{
                  position: 'absolute', top: 46, left: -16, zIndex: 60,
                  width: 560, background: DT.surface,
                  border: `1px solid ${DT.rule}`, borderRadius: DT.radius,
                  boxShadow: '0 24px 50px rgba(0,0,0,0.12)', padding: 20,
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {catTiles.map(c => (
                      <button key={c.id} onClick={() => { setMegaOpen(false); nav('catland', { cat: c.id }); }} style={{
                        all: 'unset', cursor: 'pointer', padding: '12px 14px', borderRadius: DT.radiusSm,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: DT.surfaceAlt,
                      }}>
                        <span style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>{c.label}</span>
                        <span style={{ fontFamily: DT.mono, fontSize: 11, color: DT.inkSoft }}>{c.count}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => { setMegaOpen(false); nav('browse', { cat: 'all' }); }} className="shhh-grad" style={{
                      flex: 1, cursor: 'pointer', height: 42, borderRadius: 999,
                      fontFamily: DT.body, fontWeight: 700, fontSize: 13,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>{t('home.shopAll', 'Viss katalogs')} 🍒</button>
                    <button onClick={() => { setMegaOpen(false); nav('sale'); }} style={{
                      all: 'unset', cursor: 'pointer', height: 42, padding: '0 18px', borderRadius: 999,
                      border: `1.5px solid ${DT.accent}`, color: DT.accent,
                      fontFamily: DT.body, fontWeight: 700, fontSize: 13,
                      display: 'inline-flex', alignItems: 'center',
                    }}>Akcijas</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => nav('brands')} style={linkStyle(current === 'brands')}>{t('nav.brands', 'Zīmoli')}</button>
            <button onClick={() => nav('sale')} style={{ ...linkStyle(current === 'sale'), color: current === 'sale' ? DT.ink : DT.accent }}>Akcijas 🔥</button>
            <button onClick={() => nav('giftcard')} style={linkStyle(current === 'giftcard')}>Dāvanu karte 🎁</button>
            <button onClick={openWelcome} style={linkStyle(false)}>💘 {t('nav.match', 'Match')}</button>
          </nav>
          <div style={{ flex: 1 }} />
          <form onSubmit={submitSearch} style={{
            height: 40, padding: '0 6px 0 14px', borderRadius: 999,
            background: DT.surfaceAlt,
            display: 'inline-flex', alignItems: 'center', gap: 8, width: 240,
          }}>
            <DIcon name="search" size={16} color={DT.inkSoft} />
            <input value={q} onChange={e => setQ(e.target.value)}
              type="search" aria-label={t('nav.search', 'Meklēt katalogā')}
              placeholder={t('nav.search', 'Search the catalogue…')} style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: DT.body, fontSize: 13, color: DT.ink, minWidth: 0,
            }} />
          </form>
          <DLangSwitcher />
          <IconBtn onClick={() => nav('account', { tab: 'favourites' })} badge={favCount}
            label={t('nav.favourites', 'Vēlmes') + (favCount ? ` (${favCount})` : '')}>
            <DIcon name="heart" size={20} />
          </IconBtn>
          <IconBtn onClick={() => nav('lookup')} label={t('nav.orders', 'Mani pasūtījumi')}>
            <DIcon name="box" size={20} />
          </IconBtn>
          <IconBtn onClick={() => nav('account')} label={t('nav.account', 'Konts')}>
            <DIcon name="user" size={20} />
          </IconBtn>
          <IconBtn onClick={() => nav('cart')} badge={cartCount}
            label={t('nav.cart', 'Grozs') + (cartCount ? ` (${cartCount})` : '')}>
            <DIcon name="bag" size={20} />
          </IconBtn>
        </div>
      </Container>
    </header>
  );
}

const D_LANGS = [
  { id: 'lv', code: 'LV' }, { id: 'ru', code: 'RU' }, { id: 'lt', code: 'LT' },
  { id: 'et', code: 'EE' }, { id: 'en', code: 'ENG' },
];

function DLangSwitcher() {
  const [open, setOpen] = React.useState(false);
  const langCtx = (typeof useLang === 'function') ? useLang() : { lang: 'lv', setLang: () => {} };
  const lang = langCtx.lang;
  const setLang = langCtx.setLang;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const cur = D_LANGS.find(l => l.id === lang) || D_LANGS[0];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        all: 'unset', cursor: 'pointer',
        height: 32, padding: '0 12px', borderRadius: 999,
        background: DT.surfaceAlt, color: DT.ink,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: DT.body, fontWeight: 700, fontSize: 11, letterSpacing: 0.4,
      }}>
        {cur.code}
        <span style={{ opacity: 0.5, fontSize: 9 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 38, right: 0, zIndex: 10,
          minWidth: 100, background: DT.surface,
          border: `1px solid ${DT.rule}`, borderRadius: DT.radius,
          boxShadow: '0 14px 30px rgba(0,0,0,0.10)', padding: 4,
        }}>
          {D_LANGS.map(l => (
            <button key={l.id} onClick={() => { setLang(l.id); setOpen(false); }} style={{
              all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
              padding: '8px 12px', borderRadius: DT.radiusSm,
              background: lang === l.id ? DT.surfaceAlt : 'transparent',
              fontFamily: DT.body, fontWeight: 600, fontSize: 13, color: DT.ink,
              width: '100%', boxSizing: 'border-box', justifyContent: 'space-between',
            }}>
              {l.code}
              {lang === l.id && <DIcon name="check" size={14} color={DT.accent} sw={2.2} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function DFooter({ nav }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const openCookies = () => { if (window.__shhhOpenConsent) window.__shhhOpenConsent(); };
  const cols = [
    { h: t('footer.guides', 'Ceļveži'), items: [
      ['Pirmais vibrators', () => nav('content', { key: 'guide-first-vibrator' })],
      ['Ūdens vs silikona lubrikants', () => nav('content', { key: 'guide-lube' })],
      ['Izmēru un materiālu ceļvedis', () => nav('content', { key: 'size-material' })],
      ['Vārdnīca', () => nav('content', { key: 'glossary' })],
      ['The Journal', () => nav('content', { key: 'journal' })],
    ]},
    { h: t('footer.brands', 'Zīmoli'), items: [
      ['Visi zīmoli', () => nav('brands')],
      ['Pulse', () => nav('content', { key: 'brand-pulse' })],
      ['Velura', () => nav('content', { key: 'brand-velura' })],
      ['Lumen', () => nav('content', { key: 'brand-lumen' })],
    ]},
    { h: t('footer.shop', 'Veikals'), items: [
      ['Viss katalogs', () => nav('browse', { cat: 'all' })],
      ['Solo', () => nav('catland', { cat: 'solo' })],
      ['Pāriem', () => nav('catland', { cat: 'couples' })],
      ['Iesācējiem', () => nav('catland', { cat: 'beginners' })],
      ['Dāvanu karte 🎁', () => nav('giftcard')],
      ['Akcijas 🔥', () => nav('sale')],
      ['Dāvana', () => nav('occasion', { key: 'gift' })],
      ['Sev', () => nav('occasion', { key: 'solo' })],
      ['Pirmā reize', () => nav('occasion', { key: 'first' })],
      ['Palutini sevi', () => nav('occasion', { key: 'treat' })],
    ]},
    { h: t('footer.trust', 'Uzticība'), items: [
      ['How it ships', () => nav('packaging')],
      ['Piegādes politika', () => nav('content', { key: 'shipping-policy' })],
      ['Maksājumu veidi', () => nav('content', { key: 'payment-methods' })],
      ['Anonymous billing', () => nav('content', { key: 'anonymous-billing' })],
      ['Body-safe materials', () => nav('content', { key: 'body-safe' })],
      ['Sertifikāti un testēšana', () => nav('content', { key: 'certification' })],
    ]},
    { h: t('footer.support', 'Atbalsts'), items: [
      ['Par mums', () => nav('content', { key: 'about' })],
      ['Atsauksmes', () => nav('content', { key: 'reviews' })],
      ['Mani pasūtījumi', () => nav('lookup')],
      ['FAQ', () => nav('content', { key: 'faq' })],
      ['Contact', () => nav('content', { key: 'contact' })],
      ['Lietošanas instrukcijas', () => nav('content', { key: 'usage' })],
      ['Care guides', () => nav('content', { key: 'care-guides' })],
    ]},
  ];
  const compareSites = [
    { name: 'Salidzini.lv', url: 'https://www.salidzini.lv/', stripe: '#7CC061', text: 'salidzini' },
    { name: 'KurPirkt.lv', url: 'https://www.kurpirkt.lv/', stripe: '#FF6A00', text: 'kurpirkt' },
    { name: '220.lv', url: 'https://www.220.lv/', stripe: '#E63312', text: '220' },
    { name: 'Pigu.lv', url: 'https://pigu.lv/', stripe: '#0066CC', text: 'pigu' },
    { name: 'Ceno.lv', url: 'https://ceno.lv/', stripe: '#7B2FF7', text: 'ceno' },
  ];
  const socials = [
    { name: 'Instagram', url: 'https://instagram.com/', d: 'inst' },
    { name: 'Facebook', url: 'https://facebook.com/', d: 'fb' },
    { name: 'TikTok', url: 'https://tiktok.com/', d: 'tt' },
  ];
  const SocialIcon = ({ d }) => {
    if (d === 'inst') return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>;
    if (d === 'fb') return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.7V8.5H8V12h2.5v9H14v-9h2.3l.5-3.5H14Z" fill="currentColor"/></svg>;
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 4c.4 2 1.7 3.4 3.7 3.7v2.8c-1.4 0-2.7-.4-3.8-1.1v5.6c0 3-2.2 5.2-5.1 5.2C8 20.2 6 18.1 6 15.3c0-2.7 2.1-4.9 4.8-4.9.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.2 0-2.1.9-2.1 2.1 0 1.2.9 2.1 2.2 2.1 1.3 0 2.2-1 2.2-2.4V4h2.9Z" fill="currentColor"/></svg>;
  };
  const colTitle = {
    fontFamily: DT.body, fontSize: 11, fontWeight: 700,
    letterSpacing: DT.lc, textTransform: 'uppercase', marginBottom: 14, opacity: 0.72,
  };
  const linkBtn = { all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontSize: 13, opacity: 0.85, textAlign: 'left', padding: '5px 0', minHeight: 24, boxSizing: 'border-box' };

  return (
    <footer style={{ background: DT.ink, color: DT.bg, marginTop: 80 }}>
      <Container>
        {/* Brand + newsletter + 5 link columns */}
        <div style={{
          padding: '64px 0 40px',
          display: 'grid', gridTemplateColumns: '1.7fr repeat(5, 1fr)', gap: 32,
        }}>
          <div>
            <div className="shhh-grad-text" style={{
              fontFamily: DT.display, fontWeight: 800, fontSize: 36,
              letterSpacing: DT.ld, marginBottom: 14,
            }}>shhh...</div>
            <div style={{ fontFamily: DT.body, fontSize: 13, opacity: 0.65, lineHeight: 1.5, maxWidth: 320 }}>
              A discreet adult shop. Plain box, anonymous billing, body-safe materials. Shipping across the Baltics in 24 hours.
            </div>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={colTitle}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.items.map(([l, go]) => (
                  <button key={l} onClick={go} style={linkBtn}>{l}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Payment + also-listed-on */}
        <div style={{
          padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        }}>
          {typeof PaymentLogos === 'function'
            ? <PaymentLogos theme={DTHEME} dark h={30} label="Secure payments" />
            : <span />}
          <div>
            <div style={{ ...colTitle, marginBottom: 8, textAlign: 'right' }}>Also listed on</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
              {compareSites.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" title={c.name} style={{
                  textDecoration: 'none', cursor: 'pointer', height: 34, padding: '0 12px', borderRadius: 6,
                  background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: '#0F0F0E', fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: -0.2,
                }}>
                  <span style={{ display: 'inline-block', width: 3, height: 16, borderRadius: 2, background: c.stripe }} />
                  <span>{c.text}<span style={{ color: '#65645E' }}>.lv</span></span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Company + social */}
        <div style={{
          padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: DT.body, fontSize: 12, opacity: 0.7, lineHeight: 1.7 }}>
            <div style={{ ...colTitle, marginBottom: 8 }}>Company</div>
            <div><strong style={{ opacity: 0.95 }}>NL Trading Co SIA</strong></div>
            <div>Reg. nr. 40203456789 · VAT LV40203456789</div>
            <div>Brīvības iela 68 – 14, Rīga, LV-1011, Latvia</div>
            <div>support@shhh.lv · +371 6700 0000</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {socials.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} aria-label={s.name} style={{
                width: 40, height: 40, borderRadius: 999, color: DT.bg, background: 'rgba(255,255,255,0.08)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
              }}><SocialIcon d={s.d} /></a>
            ))}
            <span style={{ fontFamily: DT.body, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginLeft: 4 }}>@shhh.lv</span>
          </div>
        </div>

        {/* Legal strip */}
        <div style={{
          padding: '18px 0', borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', flexWrap: 'wrap', gap: '6px 18px', alignItems: 'center',
        }}>
          {[
            ['Terms', () => nav('legal', { key: 'terms' })],
            ['Privacy', () => nav('legal', { key: 'privacy' })],
            ['Cookies', () => nav('legal', { key: 'cookies' })],
            ['Returns', () => nav('legal', { key: 'returns' })],
            ['GDPR', () => nav('content', { key: 'gdpr' })],
            ['18+ verification', () => nav('legal', { key: 'age' })],
            ['Pieejamība', () => nav('content', { key: 'accessibility' })],
            ['Sīkdatņu iestatījumi', openCookies],
            ['Delete account', () => nav('legal', { key: 'delete' })],
          ].map(([l, go]) => (
            <button key={l} onClick={go} style={{
              all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontSize: 12, opacity: 0.7,
              padding: '6px 0', minHeight: 24, display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box',
            }}>{l}</button>
          ))}
        </div>
        <div style={{
          padding: '16px 0 28px', borderTop: '1px solid rgba(255,255,255,0.10)',
          fontFamily: DT.mono, fontSize: 11, opacity: 0.5, letterSpacing: 0.3,
        }}>
          © {new Date().getFullYear()} Shhh… · NL Trading Co SIA · Made quietly in Rīga · 18+
        </div>
      </Container>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Product card (desktop)
// ─────────────────────────────────────────────────────────────
function DProductBlob({ product, size = 'md', tint }) {
  const bg = tint || DT.surfaceAlt;
  const fg = DT.ink;
  const id = `dpb-${product.id}-${size}`;
  const sh = (typeof shade === 'function') ? shade : (h) => h;
  const li = (typeof lighten === 'function') ? lighten : (h) => h;
  return (
    <div style={{
      width: '100%', aspectRatio: '1/1', borderRadius: DT.radius,
      background: `radial-gradient(circle at 30% 25%, ${bg} 0%, ${bg} 40%, ${sh(bg, -8)} 100%)`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${DT.rule}`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.16) 0%, transparent 55%)',
      }} />
      {(
        <svg viewBox="0 0 100 100" width="62%" height="62%"
          style={{ position: 'relative', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.22))' }}>
          <defs>
            <linearGradient id={id + '-fill'} x1="0.3" y1="0.1" x2="0.7" y2="1">
              <stop offset="0%" stopColor={li(fg, 18)} />
              <stop offset="55%" stopColor={fg} />
              <stop offset="100%" stopColor={sh(fg, -18)} />
            </linearGradient>
            <radialGradient id={id + '-glow'} cx="0.3" cy="0.22" r="0.55">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <path d={product.blob} fill={`url(#${id}-fill)`} />
          <path d={product.blob} fill={`url(#${id}-glow)`} />
          <path d={product.blob} fill="none" stroke={fg} strokeWidth={0.4} opacity={0.35} />
        </svg>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 18, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28), transparent 70%)',
        filter: 'blur(2px)',
      }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 14,
        fontFamily: DT.mono, fontSize: 10, letterSpacing: 0.5,
        color: DT.inkSoft, opacity: 0.7, textTransform: 'uppercase', zIndex: 3,
      }}>{product.id}</div>
    </div>
  );
}

function DProductCard({ product, onClick, onFavourite, isFavourite, onQuickBuy }) {
  // Delegate to the reused mobile ProductCard (image variant) so every card
  // surface — home, browse, search, sale, category landings — is identical
  // and matches the mobile prototype's Mono studio look.
  return (
    <ProductCard
      product={product} theme={DTHEME} variant="image"
      onClick={onClick} isFavourite={isFavourite}
      onFavourite={onFavourite} onQuickBuy={onQuickBuy} />
  );
}

// ─────────────────────────────────────────────────────────────
// Pill
// ─────────────────────────────────────────────────────────────
function DPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      padding: '8px 14px', borderRadius: 999,
      background: active ? DT.ink : DT.surface,
      color: active ? DT.bg : DT.ink,
      border: `1.5px solid ${active ? DT.ink : DT.rule}`,
      fontFamily: DT.body, fontWeight: 600, fontSize: 13,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Content frame — hosts reused mobile screens in a centered desktop column
// ─────────────────────────────────────────────────────────────
function DContentFrame({ children, width = 880 }) {
  return (
    <main style={{ minHeight: '50vh' }}>
      <Container>
        <div style={{ padding: '28px 0 60px', maxWidth: width, margin: '0 auto' }}>
          {children}
        </div>
      </Container>
    </main>
  );
}

Object.assign(window, {
  DT, DTHEME, Container, Section, PrimaryBtn, GhostBtn, IconBtn, DIcon,
  DWordmark, TopNav, DFooter, DProductBlob, DProductCard, DPill, DLangSwitcher,
  DContentFrame,
});
