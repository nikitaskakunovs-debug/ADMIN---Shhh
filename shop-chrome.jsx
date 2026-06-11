// shop-chrome.jsx — Mobile website chrome: sticky header, burger menu, footer.

// ─────────────────────────────────────────────────────────────
// Payment method logo tiles (used in footer + checkout)
// ─────────────────────────────────────────────────────────────
function PayLogo({ brand, h = 36 }) {
  const tile = (children, extra = {}) => (
    <div title={brand} style={{
      height: h, padding: '0 12px', borderRadius: 6,
      background: '#FFFFFF', border: '1px solid rgba(15,15,14,0.10)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: h * 1.5, gap: 4, color: '#0F0F0E',
      ...extra,
    }}>{children}</div>
  );

  if (brand === 'apple') return tile(
    <span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 500, fontSize: h * 0.42, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <svg width={h * 0.36} height={h * 0.42} viewBox="0 0 24 24"><path d="M16.5 12.5C16.5 10 18.5 8.5 18.5 8.5C18.5 8.5 17 6.5 14.5 6.5C12.5 6.5 11.5 7.5 10 7.5C8.5 7.5 7 6.5 5.5 6.5C3.5 6.5 1.5 8.5 1.5 12C1.5 16 4 21 6.5 21C8 21 8.5 20 10 20C11.5 20 12 21 13.5 21C15 21 17 17 18 14C16 13 16.5 12.5 16.5 12.5Z M13 4.5C14 3 14 1.5 14 1.5C14 1.5 12 1.5 11 3C10 4.5 10 6 10 6C10 6 12 6 13 4.5Z" fill="#000" /></svg>
      <span style={{ letterSpacing: -0.3 }}>Pay</span>
    </span>
  );

  if (brand === 'google') return tile(
    <span style={{ fontFamily: 'Roboto, system-ui', fontWeight: 500, fontSize: h * 0.42, display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: -0.2 }}>
      <svg width={h * 0.42} height={h * 0.42} viewBox="0 0 24 24">
        <path d="M21.35 11.1H12v3.2h5.35c-.25 1.3-1 2.4-2.15 3.15v2.6h3.45c2-1.85 3.15-4.55 3.15-7.85 0-.7-.05-1.4-.2-2.1z" fill="#4285F4"/>
        <path d="M12 22c2.9 0 5.35-.95 7.15-2.6l-3.45-2.6c-.95.65-2.15 1-3.7 1-2.85 0-5.25-1.9-6.1-4.5H2.3v2.7C4.1 19.5 7.8 22 12 22z" fill="#34A853"/>
        <path d="M5.9 13.3c-.25-.65-.4-1.35-.4-2.05s.15-1.4.4-2.05V6.5H2.3C1.5 8 1 9.95 1 12s.5 4 1.3 5.5l3.6-2.7z" fill="#FBBC05"/>
        <path d="M12 5.4c1.6 0 3 .55 4.1 1.6l3.05-3.05C17.35 2.25 14.9 1.3 12 1.3 7.8 1.3 4.1 3.8 2.3 7.5l3.6 2.7c.85-2.6 3.25-4.8 6.1-4.8z" fill="#EA4335"/>
      </svg>
      <span style={{ color: '#5F6368' }}>Pay</span>
    </span>
  );

  if (brand === 'visa') return tile(
    <span style={{
      fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 900, fontStyle: 'italic',
      fontSize: h * 0.5, letterSpacing: -1, lineHeight: 1, color: '#1A1F71',
    }}>
      VIS<span style={{ color: '#F7B600' }}>A</span>
    </span>
  );

  if (brand === 'mastercard') return tile(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: h * 0.55, height: h * 0.55, borderRadius: 999, background: '#EB001B' }} />
      <div style={{ width: h * 0.55, height: h * 0.55, borderRadius: 999, background: '#F79E1B', marginLeft: -h * 0.22, mixBlendMode: 'multiply' }} />
    </div>
  );

  if (brand === 'maestro') return tile(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: h * 0.55, height: h * 0.55, borderRadius: 999, background: '#0099DF' }} />
      <div style={{ width: h * 0.55, height: h * 0.55, borderRadius: 999, background: '#ED0006', marginLeft: -h * 0.22, mixBlendMode: 'multiply' }} />
    </div>
  );

  if (brand === 'citadele') return tile(
    <span style={{
      fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: h * 0.34,
      color: '#fff', background: '#E12B36', padding: '4px 8px', borderRadius: 3,
      letterSpacing: -0.2,
    }}>Citadele</span>,
    { padding: '0 8px' }
  );

  if (brand === 'swedbank') return tile(
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: h * 0.46, height: h * 0.46, borderRadius: 999,
        background: 'radial-gradient(circle at 35% 35%, #F4A100 0 30%, #F47000 31% 70%, #D85F00 71% 100%)',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
      }} />
      <span style={{
        fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: h * 0.38,
        color: '#F47000', letterSpacing: -0.3,
      }}>Swedbank</span>
    </span>
  );

  if (brand === 'seb') return tile(
    <span style={{
      fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: h * 0.5,
      color: '#0E1F38', letterSpacing: 0,
    }}>
      <span>S</span>
      <span style={{ color: '#7CC061', margin: '0 1px' }}>|</span>
      <span>E</span>
      <span style={{ color: '#7CC061', margin: '0 1px' }}>|</span>
      <span>B</span>
    </span>
  );

  if (brand === 'luminor') return tile(
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <svg width={h * 0.34} height={h * 0.34} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#5C2D91" />
        <circle cx="12" cy="12" r="4" fill="#fff" />
      </svg>
      <span style={{
        fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: h * 0.38,
        color: '#3F0D6E', letterSpacing: -0.2,
      }}>Luminor</span>
    </span>
  );

  if (brand === 'revolut') return tile(
    <span style={{
      fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700,
      fontSize: h * 0.42, color: '#000', letterSpacing: -0.4,
    }}>Revolut</span>
  );

  if (brand === 'paypal') return tile(
    <span style={{
      fontFamily: 'system-ui, sans-serif', fontStyle: 'italic', fontWeight: 800,
      fontSize: h * 0.42, letterSpacing: -0.5,
    }}>
      <span style={{ color: '#003087' }}>Pay</span><span style={{ color: '#0070BA' }}>Pal</span>
    </span>
  );

  if (brand === 'amex') return tile(
    <span style={{
      fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: h * 0.28,
      color: '#fff', background: '#006FCF', padding: '4px 8px', borderRadius: 3,
      lineHeight: 1.1, letterSpacing: 0.4, textAlign: 'center',
    }}>AMERICAN<br/>EXPRESS</span>,
    { padding: '0 8px' }
  );

  if (brand === 'klix') return tile(
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: h * 0.5, height: h * 0.5, borderRadius: 6,
        background: '#1B1B3A', color: '#22D3A6',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: h * 0.34,
      }}>K</span>
      <span style={{
        fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: h * 0.4,
        color: '#1B1B3A', letterSpacing: -0.4,
      }}>klix</span>
    </span>,
    { padding: '0 8px' }
  );

  if (brand === 'inbank') return tile(
    <span style={{
      fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: h * 0.4,
      color: '#1A1A1A', letterSpacing: -0.4, display: 'inline-flex', alignItems: 'baseline',
    }}>
      <span style={{ color: '#FF5A36' }}>i</span>nbank
    </span>,
    { padding: '0 8px' }
  );

  return tile(<span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: h * 0.36 }}>{brand}</span>);
}

const SECURE_PAYMENT_BRANDS = [
  'apple', 'google', 'revolut', 'visa', 'mastercard', 'maestro',
  'citadele', 'swedbank', 'seb', 'luminor', 'klix', 'inbank',
];

function PaymentLogos({ theme, brands = SECURE_PAYMENT_BRANDS, h = 36, label = 'Secure payments', dark = false }) {
  const labelColor = dark ? 'rgba(255,255,255,0.55)' : theme.inkSoft;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={labelColor} strokeWidth="1.6" />
          <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke={labelColor} strokeWidth="1.6" />
        </svg>
        <span style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: labelColor,
        }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {brands.map(b => <PayLogo key={b} brand={b} h={h} />)}
      </div>
    </div>
  );
}

Object.assign(window, { PayLogo, PaymentLogos, SECURE_PAYMENT_BRANDS });

// ─────────────────────────────────────────────────────────────
// MobileHeader — sticky at top of every screen
// ─────────────────────────────────────────────────────────────
function MobileHeader({ theme, nav, cartCount, favCount, openMenu, openWelcome, appliedPromo, setAppliedPromo }) {
  return (
    <React.Fragment>
      {typeof AnnouncementBar === 'function' ? (
        <AnnouncementBar theme={theme} appliedPromo={appliedPromo} onApply={(p) => setAppliedPromo && setAppliedPromo(p)} />
      ) : null}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: theme.bg + 'F0',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${theme.rule}`,
      }}>
      <div style={{
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => nav('home')} style={{
          all: 'unset', cursor: 'pointer', flexShrink: 0,
        }}>
          <Wordmark theme={theme} size={24} />
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => nav('search')} aria-label="Meklēt" style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
        }}><Icon name="search" size={22} /></button>
        <LangSwitcher theme={theme} />
        <button onClick={openMenu} aria-label="Menu" style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.ink,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// MobileMenu — slide-in drawer
// ─────────────────────────────────────────────────────────────
function MobileMenu({ theme, open, onClose, nav, openWelcome, favCount = 0 }) {
  const langCtx = (typeof useLang === 'function') ? useLang() : { lang: 'lv', setLang: () => {} };
  if (!open) return null;
  const ink = '#FFFFFF';
  const inkSoft = 'rgba(255,255,255,0.55)';
  const surfaceAlt = 'rgba(255,255,255,0.08)';
  const rule = 'rgba(255,255,255,0.10)';

  const go = (s, p) => { onClose(); nav(s, p); };

  // Big primary nav item
  const NavItem = ({ icon, label, onClick, badge, accent }) => (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
      gap: 16, padding: '16px 24px', width: '100%', boxSizing: 'border-box',
      borderBottom: `1px solid ${rule}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: accent ? theme.accent : surfaceAlt, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={19} color="#fff" />
      </div>
      <span style={{
        flex: 1, fontFamily: theme.display, fontWeight: 700, fontSize: 22,
        letterSpacing: theme.letterDisplay, color: ink, lineHeight: 1,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {label}
        {badge != null && badge > 0 && (
          <span style={{
            minWidth: 20, padding: '0 6px', height: 20, borderRadius: 999,
            background: theme.accent, color: '#fff',
            fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{badge}</span>
        )}
      </span>
      <Icon name="chev" size={18} color={inkSoft} />
    </button>
  );

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '88%', maxWidth: 340, height: '100%',
        background: '#101010', color: ink, overflowY: 'auto',
        boxShadow: '-12px 0 32px rgba(0,0,0,0.32)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${rule}`,
        }}>
          <div style={{
            fontFamily: theme.display, fontWeight: 800, fontSize: 24,
            letterSpacing: theme.letterDisplay, lineHeight: 1,
          }} className="shhh-grad-text">shhh...</div>
          <button onClick={onClose} aria-label="Close" style={{
            all: 'unset', cursor: 'pointer', width: 36, height: 36,
            borderRadius: 999, background: surfaceAlt, color: ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="close" size={18} color={ink} /></button>
        </div>

        {/* Primary nav — short and bold */}
        <div style={{ flex: 1 }}>
          <NavItem icon="search" label="Veikals"
            onClick={() => go('category', { cat: 'all' })} />
          <NavItem icon="heart" label="Vēlmes" badge={favCount}
            onClick={() => go('account', { tab: 'favourites' })} />
          <NavItem icon="bag" label="Grozs"
            onClick={() => go('cart')} />
          <NavItem icon="box" label="Mani pasūtījumi"
            onClick={() => go('content', { key: 'order-lookup' })} />
          <NavItem icon="zap" label="Akcijas 🔥" accent
            onClick={() => go('sale')} />
          <NavItem icon="gift" label="Dāvanu karte 🎁"
            onClick={() => go('giftcard')} />

          {/* Match CTA */}
          <div style={{ padding: '22px 24px 8px' }}>
            <button onClick={() => { onClose(); openWelcome && openWelcome(); }} className="shhh-grad" style={{
              cursor: 'pointer', width: '100%', height: 50, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
              boxShadow: '0 6px 18px rgba(110,77,248,0.30)',
            }}>💘 Take the 30-sec match</button>
          </div>

          {/* Language switcher — fills the gap, common menu utility */}
          <div style={{ padding: '18px 24px 0' }}>
            <div style={{
              fontFamily: theme.body, fontSize: 10, fontWeight: 700,
              letterSpacing: theme.letterCaps, textTransform: 'uppercase',
              color: inkSoft, marginBottom: 10,
            }}>Valoda</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[['LV','lv'],['RU','ru'],['EN','en'],['LT','lt'],['EE','et']].map(([lng, code]) => {
                const activeL = langCtx.lang === code;
                return (
                <button key={code} onClick={() => langCtx.setLang(code)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '7px 14px', borderRadius: 999,
                  background: activeL ? '#fff' : 'transparent',
                  color: activeL ? '#101010' : ink,
                  border: `1px solid ${activeL ? '#fff' : rule}`,
                  fontFamily: theme.body, fontWeight: 700, fontSize: 12,
                }}>{lng}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 24px', borderTop: `1px solid ${rule}`,
          fontFamily: theme.mono, fontSize: 10, color: inkSoft, letterSpacing: 0.4,
        }}>
          <div>Visa pārējā info atrodama lapas kājenē ↓</div>
          <div style={{ marginTop: 6 }}>© {new Date().getFullYear()} Shhh… · Rīga</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MobileFooter — bottom of every screen
// ─────────────────────────────────────────────────────────────
function MobileFooter({ theme, nav }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  return (
    <footer style={{
      background: theme.ink, color: theme.bg, marginTop: 40,
      padding: '32px 20px 110px',
    }}>
      <div className="shhh-grad-text" style={{
        fontFamily: theme.display, fontWeight: 800, fontSize: 32,
        letterSpacing: theme.letterDisplay, lineHeight: 1, marginBottom: 8,
      }}>shhh...</div>
      <div style={{
        fontFamily: theme.body, fontSize: 12, opacity: 0.65,
        lineHeight: 1.5, marginBottom: 22,
      }}>
        A discreet adult shop. Plain box, anonymous billing, body-safe materials.
        Shipping across the Baltics in 24 hours.
      </div>

      <div style={{ marginBottom: 22 }}>
        {[
          { h: 'Ceļveži', items: [
            ['Pirmais vibrators', () => nav('content', { key: 'guide-first-vibrator' })],
            ['Ūdens vs silikona lubrikants', () => nav('content', { key: 'guide-lube' })],
            ['Izmēru un materiālu ceļvedis', () => nav('content', { key: 'size-material' })],
            ['Vārdnīca', () => nav('content', { key: 'glossary' })],
            ['The Journal', () => nav('content', { key: 'journal' })],
          ]},
          { h: 'Zīmoli', items: [
            ['Visi zīmoli', () => nav('content', { key: 'brands-all' })],
            ['Pulse', () => nav('content', { key: 'brand-pulse' })],
            ['Velura', () => nav('content', { key: 'brand-velura' })],
            ['Lumen', () => nav('content', { key: 'brand-lumen' })],
          ]},
          { h: t('footer.shop','Veikals'), items: [
            ['All', () => nav('category', { cat: 'all' })],
            ['Solo', () => nav('category', { cat: 'solo' })],
            ['Couples', () => nav('category', { cat: 'couples' })],
            ['Beginners', () => nav('category', { cat: 'beginners' })],
            ['Dāvanu karte 🎁', () => nav('giftcard')],
            ['Akcijas 🔥', () => nav('sale')],
            ['Dāvana', () => nav('occasion', { key: 'gift' })],
            ['Sev', () => nav('occasion', { key: 'solo' })],
            ['Pāriem', () => nav('occasion', { key: 'couples' })],
            ['Pirmā reize', () => nav('occasion', { key: 'first' })],
            ['Palutini sevi', () => nav('occasion', { key: 'treat' })],
            ['Ceļojumiem', () => nav('occasion', { key: 'travel' })],
          ]},
          { h: t('footer.trust','Uzticība'), items: [
            ['How it ships', () => nav('content', { key: 'how-it-ships' })],
            ['Piegādes politika', () => nav('content', { key: 'shipping-policy' })],
            ['Maksājumu veidi', () => nav('content', { key: 'payment-methods' })],
            ['Anonymous billing', () => nav('content', { key: 'anonymous-billing' })],
            ['Body-safe materials', () => nav('content', { key: 'body-safe' })],
            ['Sertifikāti un testēšana', () => nav('content', { key: 'certification' })],
          ]},
          { h: t('footer.support','Atbalsts'), items: [
            ['Par mums', () => nav('content', { key: 'about' })],
            ['Rekvizīti / Impressum', () => nav('content', { key: 'about' })],
            ['Atsauksmes', () => nav('content', { key: 'reviews' })],
            ['Order lookup', () => nav('content', { key: 'order-lookup' })],
            ['FAQ', () => nav('content', { key: 'faq' })],
            ['Contact', () => nav('content', { key: 'contact' })],
            ['Lietošanas instrukcijas', () => nav('content', { key: 'usage' })],
            ['Care guides', () => nav('content', { key: 'care-guides' })],
          ]},
        ].map(col => (
          <details key={col.h} style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <summary style={{
              listStyle: 'none', cursor: 'pointer',
              padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.bg,
            }}>
              <span>{col.h}</span>
              <span style={{ opacity: 0.5, fontSize: 11 }}>+</span>
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 0 16px' }}>
              {col.items.map(([l, go]) => (
                <button key={l} onClick={go} style={{
                  all: 'unset', cursor: 'pointer', textAlign: 'left',
                  fontFamily: theme.body, fontSize: 13, opacity: 0.8,
                }}>{l}</button>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Payment methods */}
      <div style={{ marginBottom: 22 }}>
        <PaymentLogos theme={theme} dark h={36} />
      </div>

      {/* Found on / price comparison sites */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
            <path d="M16.5 16.5L21 21" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: theme.body, fontSize: 10, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}>{t('footer.alsoOn','Also listed on')}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { name: 'Salidzini.lv', url: 'https://www.salidzini.lv/',
              bg: '#FFFFFF', stripe: '#7CC061', logoText: 'salidzini', logoSub: '.lv' },
            { name: 'KurPirkt.lv', url: 'https://www.kurpirkt.lv/',
              bg: '#FFFFFF', stripe: '#FF6A00', logoText: 'kurpirkt', logoSub: '.lv' },
            { name: '220.lv', url: 'https://www.220.lv/',
              bg: '#FFFFFF', stripe: '#E63312', logoText: '220', logoSub: '.lv' },
            { name: 'Pigu.lv', url: 'https://pigu.lv/',
              bg: '#FFFFFF', stripe: '#0066CC', logoText: 'pigu', logoSub: '.lv' },
            { name: 'Ceno.lv', url: 'https://ceno.lv/',
              bg: '#FFFFFF', stripe: '#7B2FF7', logoText: 'ceno', logoSub: '.lv' },
          ].map(c => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" title={c.name}
              style={{
                textDecoration: 'none', cursor: 'pointer',
                height: 36, padding: '0 12px', borderRadius: 6,
                background: c.bg, border: '1px solid rgba(15,15,14,0.10)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#0F0F0E', fontFamily: 'system-ui, sans-serif',
                fontWeight: 800, fontSize: 13, letterSpacing: -0.2,
              }}>
              <span style={{
                display: 'inline-block', width: 3, height: 18, borderRadius: 2,
                background: c.stripe,
              }} />
              <span>{c.logoText}<span style={{ color: '#65645E', fontWeight: 700 }}>{c.logoSub}</span></span>
            </a>
          ))}
        </div>
        <div style={{
          marginTop: 8, fontFamily: theme.body, fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
        }}>
          {t('footer.alsoSub',"Compare our prices on Latvia's biggest aggregator sites. Same plain-box shipping when you order through them.")}
        </div>
      </div>

      {/* Company info */}
      <div style={{
        paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)',
        fontFamily: theme.body, fontSize: 11, opacity: 0.7, lineHeight: 1.6,
        marginBottom: 14,
      }}>
        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          opacity: 0.7, marginBottom: 8,
        }}>{t('footer.company','Company')}</div>
        <div><strong style={{ opacity: 0.95 }}>NL Trading Co SIA</strong></div>
        <div>Reg. nr. 40203456789 · VAT LV40203456789</div>
        <div>Brīvības iela 68 – 14, Rīga, LV-1011, Latvia</div>
        <div>support@shhh.lv · +371 6700 0000</div>
      </div>

      {/* Social media */}
      <div style={{
        paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {[
          { name: 'Instagram', url: 'https://instagram.com/', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/>
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
            </svg>
          )},
          { name: 'Facebook', url: 'https://facebook.com/', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.7V8.5H8V12h2.5v9H14v-9h2.3l.5-3.5H14Z" fill="currentColor"/>
            </svg>
          )},
          { name: 'TikTok', url: 'https://tiktok.com/', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M16 4c.4 2 1.7 3.4 3.7 3.7v2.8c-1.4 0-2.7-.4-3.8-1.1v5.6c0 3-2.2 5.2-5.1 5.2C8 20.2 6 18.1 6 15.3c0-2.7 2.1-4.9 4.8-4.9.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.2 0-2.1.9-2.1 2.1 0 1.2.9 2.1 2.2 2.1 1.3 0 2.2-1 2.2-2.4V4h2.9Z" fill="currentColor"/>
            </svg>
          )},
        ].map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
            aria-label={s.name} style={{
              width: 40, height: 40, borderRadius: 999, color: theme.bg,
              background: 'rgba(255,255,255,0.08)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none',
            }}>{s.icon}</a>
        ))}
        <span style={{
          marginLeft: 'auto', fontFamily: theme.body, fontSize: 11,
          color: 'rgba(255,255,255,0.55)',
        }}>@shhh.lv</span>
      </div>

      {/* Legal — slim inline strip */}
      <div style={{
        paddingTop: 16, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', flexWrap: 'wrap', gap: '8px 14px',
      }}>
        {[
          ['Terms', () => nav('legal', { key: 'terms' })],
          ['Privacy', () => nav('legal', { key: 'privacy' })],
          ['Cookies', () => nav('legal', { key: 'cookies' })],
          ['Returns', () => nav('legal', { key: 'returns' })],
          ['GDPR', () => nav('content', { key: 'gdpr' })],
          ['18+ verification', () => nav('legal', { key: 'age' })],
          ['Pieejamība', () => nav('content', { key: 'accessibility' })],
          ['Sīkdatņu iestatījumi', () => window.__shhhOpenConsent && window.__shhhOpenConsent()],
          ['Delete account', () => nav('legal', { key: 'delete' })],
        ].map(([l, go]) => (
          <button key={l} onClick={go} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: theme.body, fontSize: 11, opacity: 0.7, color: theme.bg,
          }}>{l}</button>
        ))}
      </div>

      {/* © */}
      <div style={{
        paddingTop: 14, marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)',
        fontFamily: theme.mono, fontSize: 10, opacity: 0.5,
        letterSpacing: 0.3,
      }}>
        © {new Date().getFullYear()} Shhh… · Made quietly in Rīga
      </div>
    </footer>
  );
}

Object.assign(window, { MobileHeader, MobileMenu, MobileFooter, LegalScreen, AgeCookieGate });

// ─────────────────────────────────────────────────────────────
// AgeCookieGate — 18+ confirmation + cookie acceptance on entry
// ─────────────────────────────────────────────────────────────
function AgeCookieGate({ theme, open, onAccept, onLeave, onLearn }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [showCookieDetails, setShowCookieDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(15,15,15,0.65)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxHeight: '92%', overflowY: 'auto',
        background: theme.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 22px 28px',
        boxShadow: '0 -12px 36px rgba(0,0,0,0.20)',
      }}>
        {/* grabber */}
        <div style={{
          width: 40, height: 4, borderRadius: 4,
          background: theme.rule, margin: '0 auto 18px',
        }} />

        {/* 18+ badge */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: theme.ink, color: theme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.display, fontWeight: 800, fontSize: 22,
          letterSpacing: -0.5, marginBottom: 16,
        }}>18+</div>

        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 10,
        }}>{'Ātra pārbaude pirms ieiešanas'}</div>

        <h2 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 30,
          letterSpacing: theme.letterDisplay, lineHeight: 0.98,
          color: theme.ink, margin: '0 0 14px',
        }}>{'Tikai pieaugušajiem — tas ir nopietni.'}</h2>

        <p style={{
          fontFamily: theme.body, fontSize: 13, lineHeight: 1.55,
          color: theme.inkSoft, margin: '0 0 18px',
        }}>
          Ieejot tu apstiprini, ka esi <strong style={{ color: theme.ink }}>18 gadus vecs vai vecāks</strong>,
          un piekrīti mūsu <button onClick={() => onLearn && onLearn('terms')} style={{
            all: 'unset', cursor: 'pointer', color: theme.ink, textDecoration: 'underline',
          }}>lietošanas noteikumiem</button> un <button onClick={() => onLearn && onLearn('privacy')} style={{
            all: 'unset', cursor: 'pointer', color: theme.ink, textDecoration: 'underline',
          }}>privātuma politikai</button>.
        </p>

        <PrimaryButton theme={theme} size="lg" onClick={() => onAccept({})}>
          {'Esmu 18+ — ieiet'}
        </PrimaryButton>

        <button onClick={onLeave} style={{
          all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center',
          marginTop: 14, padding: '10px 0',
          fontFamily: theme.body, fontSize: 12, fontWeight: 600,
          color: theme.inkSoft, textDecoration: 'underline',
        }}>{'Esmu jaunāks par 18 — atstāt vietni'}</button>
      </div>
    </div>
  );
}

function LeftSiteOverlay({ theme }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 250,
      background: theme.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 28, textAlign: 'center',
    }}>
      <div>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 18px',
          background: theme.surfaceAlt, color: theme.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.display, fontWeight: 800, fontSize: 22,
        }}>👋</div>
        <h2 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 30,
          letterSpacing: theme.letterDisplay, lineHeight: 1, margin: '0 0 12px',
        }}>Take care.</h2>
        <p style={{
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, margin: 0,
        }}>
          This shop is for grown-ups only. Come back when you're 18.
        </p>
      </div>
    </div>
  );
}

window.LeftSiteOverlay = LeftSiteOverlay;

// ─────────────────────────────────────────────────────────────
// LegalScreen — Terms / Privacy / Cookies / Returns / 18+ / Delete account
// ─────────────────────────────────────────────────────────────
const LEGAL_PAGES = {
  terms: {
    title: 'Lietošanas noteikumi',
    tab: 'Noteikumi',
    sub: 'Līguma noteikumi starp tevi un NL Trading Co SIA.',
    published: '12.09.2024.',
    updated: '01.06.2026.',
    version: 'v3.0',
    sections: [
      ['1. Pārdevējs', 'Interneta veikalu shhh.lv pārvalda NL Trading Co SIA, vienotais reģ. nr. 40203456789, PVN nr. LV40203456789, juridiskā adrese: Brīvības iela 68–14, Rīga, LV-1011, Latvija. Saziņa: support@shhh.lv, +371 6700 0000. Šie noteikumi veido distances līgumu starp tevi (patērētāju) un pārdevēju.'],
      ['2. Līguma noslēgšana', 'Līgums uzskatāms par noslēgtu brīdī, kad esi veicis pasūtījumu un saņēmis apstiprinājuma e-pastu ar pasūtījuma numuru. Pasūtot tu apliecini, ka esi iepazinies ar šiem noteikumiem, privātuma politiku un esi vismaz 18 gadus vecs.'],
      ['3. Cenas un pieejamība', 'Visas cenas norādītas eiro (€) ar iekļautu 21% PVN. Pieejamība tiek rādīta reāllaikā. Ja prece izpārdota laikā starp pasūtījumu un apmaksu, mēs atceļam attiecīgo pozīciju un atmaksājam to 24 stundu laikā. Mēs paturam tiesības labot acīmredzamas cenu kļūdas.'],
      ['4. Apmaksa', 'Pieņemam Apple Pay, Google Pay, banklink (Citadele, Swedbank, SEB, Luminor), maksājumu kartes, BNPL (Klix, Inbank) un bankas pārskaitījumu. Maksājumus apstrādā sertificēti pakalpojumu sniedzēji; mēs neuzglabājam tavas kartes datus. Bankas izrakstā maksājums parādās kā "NL Trading Co".'],
      ['5. Piegāde', 'Pasūtījumi, kas veikti līdz plkst. 16:00 (EET), tiek nosūtīti tajā pašā darba dienā. Piegāde notiek uz pakomātu, pakalpojumu punktu vai līdz durvīm visā Baltijā 1–3 darba dienu laikā. Piegādes izmaksas tiek parādītas pirms apmaksas.'],
      ['6. Atteikuma tiesības', 'Tev ir 14 dienu atteikuma tiesības saskaņā ar ES Direktīvu 2011/83/ES, kā arī mūsu brīvprātīgā 30 dienu atgriešanas politika neatvērtām precēm. Higiēnas apsvērumu dēļ atvērtas, ķermeņa kontakta preces nevar atgriezt, ja vien tās nav bojātas. Pilna informācija sadaļā "Atgriešana".'],
      ['7. Garantija', 'Visām precēm ir 2 gadu likumiskā atbilstības garantija. Bojātu vai neatbilstošu preci nomainām vai atmaksājam bez maksas. Šie noteikumi neierobežo tavas patērētāja likumiskās tiesības.'],
      ['8. Vecuma ierobežojums', 'Veikals paredzēts tikai pilngadīgām personām (18+). Pasūtīšana nepilngadīgo vārdā ir aizliegta un ir pamats pasūtījuma atcelšanai.'],
      ['9. Daļēja piegāde', 'Ja pasūtījumā ir vairākas preces un kāda no tām apstrādes brīdī nav pieejama, pasūtījumu sadalām — pieejamās preces nosūtām uzreiz, pārējās tiklīdz tās saņemam no piegādātāja. Par papildu piegādi nav jāmaksā. Pasūtījuma saņemšana pa daļām pieejama tikai vienas valsts robežās (Latvija, Lietuva, Igaunija).'],
      ['10. Preces izpārdošana un 30 dienu termiņš', 'Ja prece pasūtīšanas brīdī bija pieejama, bet apstrādes laikā jau izpārdota, par to informējam e-pastā. Ja nevaram nodrošināt nosūtīšanu 30 dienu laikā, piedāvājam citu preci samaksātās summas vērtībā vai veicam pilnu naudas atmaksu. Precēm ar atzīmi "Paziņot, kad pieejams" var pieteikties e-pasta paziņojumam par atkārtotu pieejamību.'],
      ['11. Muita un nodokļi', 'Visas cenas norādītas ar iekļautu 21% PVN. Saņemot sūtījumu Eiropas Savienībā, papildu nodokļi nav jāmaksā. Sūtījumiem ārpus ES var tikt piemēroti saņēmēja valsts muitas nodokļi — to apmēru un samaksas kārtību nosaka saņēmēja valsts; par tiem atbild saņēmējs. Komersanti, kas reģistrēti kā PVN maksātāji citā ES valstī, var iegādāties preces bez PVN saskaņā ar reversā PVN principu.'],
      ['12. Atbildība', 'Preces tiek pārdotas atbilstoši aprakstam. Pirms lietošanas iepazīsties ar katras preces kopšanas un lietošanas norādēm. Mēs neuzņemamies atbildību par zaudējumiem, kas radušies preces nepareizas lietošanas dēļ ārpus norādījumiem.'],
      ['13. Strīdi un piemērojamās tiesības', 'Līgumam piemērojami Latvijas Republikas tiesību akti. Strīdus risinām pārrunu ceļā (support@shhh.lv). Ja vienošanos panākt neizdodas, patērētājs var vērsties Patērētāju tiesību aizsardzības centrā (ptac.gov.lv) vai ES strīdu izšķiršanas platformā (ec.europa.eu/odr). Piekritība — Rīgas pilsētas tiesa.'],
    ],
  },
  privacy: {
    title: 'Privātuma politika',
    tab: 'Privātums',
    sub: 'Ko mēs vācam, kāpēc un cik ilgi glabājam.',
    published: '12.09.2024.',
    updated: '01.06.2026.',
    version: 'v4.0',
    sections: [
      ['1. Pārzinis', 'Tavu personas datu pārzinis ir NL Trading Co SIA, reģ. nr. 40203456789, Brīvības iela 68–14, Rīga, LV-1011. Datu jautājumos raksti: privacy@shhh.lv.'],
      ['2. Kādus datus vācam', 'Pasūtījuma izpildei: e-pasts (obligāts), saņēmēja vārds un adrese vai pakomāta kods, tālrunis (neobligāts — pakomātam pietiek ar e-pastu). Maksājuma dati: kartes numuru NEUZGLABĀJAM — to apstrādā maksājumu pakalpojumu sniedzējs. Atbalsta gadījumā: sarakste ar mūsu komandu.'],
      ['3. Apstrādes mērķis un pamats', 'Datus apstrādājam, lai izpildītu līgumu (pasūtījuma piegāde — VDAR 6.1.b pants), pildītu juridiskos pienākumus (grāmatvedība — 6.1.c pants) un mūsu leģitīmajās interesēs (krāpšanas novēršana — 6.1.f pants). Mārketinga e-pastus nesūtām.'],
      ['4. Analītika un mārketings', 'Ar tavu piekrišanu izmantojam: Google Analytics 4 un Google Ads (apmeklējumu un reklāmas mērīšana), Meta Pixel (Facebook/Instagram reklāma), un siltuma karšu / sesiju ierakstu rīku (vietnes lietojamības uzlabošanai). Šie rīki var ievietot trešo pušu sīkdatnes un nodot datus to operatoriem. Vari atteikties sīkdatņu piekrišanas logā vai pārlūka iestatījumos.'],
      ['5. Glabāšanas termiņš', 'Pasūtījuma dati (vārds, adrese, preces) tiek automātiski dzēsti 30 dienas pēc piegādes. Anonimizēti rēķini un summas tiek glabāti 7 gadus, kā to prasa Latvijas grāmatvedības likums. Analītikas dati tiek glabāti saskaņā ar attiecīgā rīka noklusējuma termiņiem (Google Analytics — līdz 14 mēnešiem).'],
      ['6. Datu nodošana', 'Datus nododam tiktāl, cik nepieciešams: kurjeram (piegādes adrese vai kods), maksājumu pakalpojumu sniedzējam (summa), un — ar tavu piekrišanu — analītikas/reklāmas partneriem (Google, Meta). Daži no tiem var apstrādāt datus ārpus ES/EEZ (piem., ASV) saskaņā ar ES standarta līguma klauzulām un ES–ASV Datu privātuma ietvaru.'],
      ['7. Tavas tiesības', 'Tev ir tiesības piekļūt saviem datiem, tos labot, dzēst ("tikt aizmirstam"), ierobežot apstrādi, iebilst pret apstrādi un saņemt datus pārnesamā formātā. Pieprasījumu iesniedz privacy@shhh.lv — izpildām 30 dienu laikā (parasti 7). Skati arī sadaļu "Datu pieprasījums (GDPR)".'],
      ['8. Sūdzības', 'Ja uzskati, ka tavi dati apstrādāti nepareizi, vari iesniegt sūdzību Datu valsts inspekcijā (dvi.gov.lv).'],
    ],
  },
  cookies: {
    title: 'Sīkdatņu politika',
    tab: 'Sīkdatnes',
    sub: 'Kādas sīkdatnes izmantojam un kā tās pārvaldīt.',
    published: '12.09.2024.',
    updated: '02.06.2026.',
    version: 'v3.0',
    sections: [
      ['1. Kas ir sīkdatnes', 'Sīkdatnes ir nelieli teksta faili, ko vietne saglabā tavā ierīcē. Tās palīdz vietnei atcerēties tavu sesiju, darboties pareizi un — ar tavu piekrišanu — mērīt apmeklējumus un reklāmu.'],
      ['2. Obligāti nepieciešamās', 'Pirmās puses "sesijas" sīkdatne saglabā tavu grozu un sīkdatņu izvēles. Tā ir tehniski nepieciešama, tāpēc piekrišana nav vajadzīga.'],
      ['3. Veiktspējas (analīzes)', 'Ar tavu piekrišanu izmantojam Google Analytics 4, lai saprastu, kā apmeklētāji lieto vietni (apmeklētās lapas, ierīce, aptuvenā atrašanās vieta). Izmantojam arī siltuma karšu / sesiju ierakstu rīku, lai uzlabotu lietojamību.'],
      ['4. Mērķa (reklāmas)', 'Ar tavu piekrišanu izmantojam Meta Pixel un Google Ads, lai rādītu un mērītu reklāmu Facebook, Instagram un Google platformās. Šīs sīkdatnes var izsekot apmeklējumus starp vietnēm un nodot datus Google un Meta.'],
      ['5. Tava izvēle', 'Pirmajā apmeklējumā tu izvēlies, kuras sīkdatnes atļaut. Izvēli vari mainīt jebkurā laikā, notīrot sīkdatnes pārlūkā vai sazinoties ar mums. Atsakoties no analītikas/reklāmas sīkdatnēm, vietne joprojām darbosies pilnvērtīgi.'],
      ['6. Kā dzēst', 'Pārlūka iestatījumi → privātums/sīkdatnes → notīrīt vietnei shhh.lv. Tavs grozs un izvēles tiks atiestatītas.'],
      ['7. Drošība', 'Mēs izmantojam šifrēšanu (TLS) un drošības pasākumus, lai aizsargātu datus pret ļaunprātīgu izmantošanu, nozaudēšanu vai izmainīšanu.'],
    ],
  },
  returns: {
    title: 'Atgriešana un atmaksa',
    tab: 'Atgriešana',
    sub: 'Free, 30 days + 14-day EU withdrawal rights.',
    published: '12 Sep 2024',
    updated: '29 May 2026',
    version: 'v2.0',
    sections: [
      ['14 dienu atteikuma tiesības (ES)', 'Saskaņā ar ES Patērētāju tiesību direktīvu 2011/83/ES tev ir tiesības atteikties no pirkuma 14 dienu laikā no preces saņemšanas bez iemesla norādīšanas. Atteikuma termiņš sākas dienā, kad tu (vai tava norādītā persona) saņem preci.'],
      ['Kā izmantot atteikuma tiesības', 'Paziņo mums par atteikumu 14 dienu laikā, rakstot uz returns@shhh.lv ar pasūtījuma numuru, vai izmantojot atteikuma veidlapu. Pēc tam preci jānosūta atpakaļ 14 dienu laikā.'],
      ['Higiēnas izņēmums', 'ES likums (Direktīvas 16. pants) ļauj atteikt atgriešanu aizzīmogotām precēm, kuras nav piemērotas atgriešanai veselības vai higiēnas apsvērumu dēļ, ja zīmogs pēc piegādes ir noņemts. Tāpēc atvērtas, ķermeņa kontakta preces nevar atgriezt, ja vien tās nav bojātas.'],
      ['Atteikuma logs', '14 dienu likumiskās atteikuma tiesības + mūsu brīvprātīgā 30 dienu politika neatvērtām, aizzīmogotām precēm. Izvēlies, kurš tev izdevīgāks.'],
      ['Bojātas preces', 'Bojāta piegādē vai pārstāj darboties 2 gadu garantijas laikā? Nomainām bez maksas. Raksti support@shhh.lv ar pasūtījuma numuru. Tas neietekmē tavas likumiskās tiesības.'],
      ['Kā atgriezt', 'Nomet jebkurā Omniva vai DPD pakomātā ar apmaksāto etiķeti, ko nosūtām e-pastā 1 stundas laikā pēc atgriešanas pieprasījuma.'],
      ['Atmaksa', 'Atmaksu veicam 14 dienu laikā no atteikuma paziņojuma saņemšanas (parasti 5 darbdienās pēc preces saņemšanas) — pa to pašu maksājuma kanālu, ko izmantoji pirkumam.'],
      ['Atteikuma veidlapa', 'Lejuplādē Shhh.lv atteikuma veidlapu (PDF). Tev jānorāda tikai pasūtījuma numurs un slepenais kods — vārds un uzvārds nav obligāti, ja pasūtīji anonīmi. Aizpildi un nosūti uz returns@shhh.lv. @@PDF:atteikuma-veidlapa.pdf@@'],
      ['Preces, uz kurām atteikuma tiesības NEattiecas', 'Higiēnas un veselības apsvērumu dēļ (ES Direktīvas 2011/83/ES 16. pants) atteikuma tiesības nevar izmantot, ja iepakojuma zīmogs ir atvērts, šādām precēm: seksa rotaļlietas un palīglīdzekļi, to kopšanas piederumi; lubrikanti, masāžas eļļas un geli; smaržas, kosmētika un higiēnas preces; prezervatīvi; pletnes, pātagas un BDSM aksesuāri ar auduma/ādas/lateksa/silikona daļām; lateksa un vinila (PVC) apģērbi; zeķes, zeķubikses, apakšveļa un komplekti (ja atvērts biksīšu/zeķu zīmogs); parūkas; baterijas; grāmatas; dāvanu kartes; komplekti, kuros ir kāda no minētajām precēm.'],
      ['Preces stāvoklis', 'Atgriežamai precei jābūt nelietotai, oriģinālajā un nesabojātajā iepakojumā ar marķējumiem. Tā nedrīkst saturēt tabakas, smaržu vai kosmētikas traipus un smakas. Saglabā kases čeku vai rēķinu (der arī bankas maksājuma uzdevums).'],
    ],
  },
  age: {
    title: '18+ vecuma apstiprināšana',
    tab: '18+',
    sub: 'To prasa likums. Mēs to padarām vienkāršu.',
    published: '12.09.2024.',
    updated: '01.06.2026.',
    version: 'v2.0',
    sections: [
      ['1. Kāpēc tas nepieciešams', 'Pieaugušo preču pārdošana nepilngadīgajiem ir aizliegta. Saskaņā ar Latvijas tiesību aktiem mums jāpārliecinās, ka pircējs ir vismaz 18 gadus vecs.'],
      ['2. Reģistrējoties', 'Ievadot vietnē, tu ar vienu pieskārienu apstiprini, ka esi 18+. Mēs neuzglabājam ID kopijas un neprasām dokumentus reģistrācijas brīdī.'],
      ['3. Piegādes brīdī', 'Augstas vērtības pasūtījumiem kurjers var lūgt uzrādīt personu apliecinošu dokumentu pie durvīm. Pakomāta saņemšanai pietiek ar vienreizējo kodu — dokuments nav jāuzrāda.'],
      ['4. Mūsu apņemšanās', 'Mēs nepārdodam, nepiegādājam un nereklamējam preces nepilngadīgajiem. Ja ir aizdomas, ka kontu izmanto nepilngadīgais, nekavējoties sazinies ar mums (support@shhh.lv) — mēs to bloķēsim.'],
    ],
  },
  delete: {
    title: 'Konta dzēšana',
    tab: 'Dzēst',
    sub: 'Bez jautājumiem. Izdarīts 7 dienu laikā.',
    published: '12 Sep 2024',
    updated: '01.06.2026.',
    version: 'v2.0',
    sections: [
      ['1. Kas tiek dzēsts', 'Visi pasūtījumu dati, piegādes adreses, e-pasts, tālrunis, iecienītās preces un jebkuras saglabātās "saderināšanas" izvēles, kas saistītas ar tavu e-pastu.'],
      ['2. Kas paliek', 'Anonimizētas rēķinu summas, ko Latvijas grāmatvedības likums prasa glabāt 7 gadus. Tās nesatur identificējošus datus un nav saistāmas ar tevi.'],
      ['3. Kā pieprasīt', 'Nospied pogu zemāk vai raksti uz delete@shhh.lv ar tēmu "dzēst". Apstiprinām pieprasījumu 24 stundu laikā un dzēšanu veicam 7 dienu laikā saskaņā ar VDAR.'],
      ['4. Pēc dzēšanas', 'Saņemsi apstiprinājuma e-pastu. Aktīvi pasūtījumi (vēl nepiegādāti) tiks pabeigti pirms dzēšanas — citādi tos nevarētu nogādāt.'],
    ],
    cta: true,
  },
};

function LegalScreen({ theme, nav, params }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const key = params?.key || 'terms';
  const page = LEGAL_PAGES[key] || LEGAL_PAGES.terms;
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Sticky-like top with breadcrumbs */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
        }}>
          <button onClick={() => nav('home')} style={{
            all: 'unset', cursor: 'pointer', color: theme.inkSoft,
          }}>{t('page.home','Home')}</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>{page.title}</span>
        </div>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 10,
        }}>Legal</div>
        <h1 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 38,
          letterSpacing: theme.letterDisplay, lineHeight: 0.95,
          color: theme.ink, margin: 0,
        }}>{page.title}</h1>
        <p style={{
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft,
          lineHeight: 1.5, margin: '10px 0 14px',
        }}>{page.sub}</p>

        {/* Publication + renewal dates */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22,
        }}>
          <div style={{
            padding: '6px 10px', borderRadius: 999,
            background: theme.surfaceAlt, color: theme.ink,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: theme.body, fontSize: 11, fontWeight: 600,
          }}>
            <span style={{ color: theme.inkSoft, fontWeight: 500 }}>{t('legal.published','Published')}</span>
            <span style={{ fontFamily: theme.mono }}>{page.published}</span>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 999,
            background: theme.accent, color: theme.accentInk,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          }}>
            <span style={{ opacity: 0.85, fontWeight: 600 }}>{t('legal.updated','Updated')}</span>
            <span style={{ fontFamily: theme.mono }}>{page.updated}</span>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 999,
            border: `1px solid ${theme.rule}`, color: theme.inkSoft,
            display: 'inline-flex', alignItems: 'center',
            fontFamily: theme.mono, fontSize: 11, fontWeight: 600,
          }}>{page.version}</div>
        </div>
      </div>

      {/* Section tabs (quick-jump) */}
      <div style={{
        padding: '0 0 20px',
        display: 'flex', gap: 6, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollPaddingLeft: 20, scrollPaddingRight: 20,
      }}>
        <div style={{ width: 14, flexShrink: 0 }} />
        {Object.entries(LEGAL_PAGES).map(([k, p]) => (
          <button key={k} onClick={() => nav('legal', { key: k })} style={{
            all: 'unset', cursor: 'pointer', flexShrink: 0,
            padding: '7px 12px', borderRadius: 999,
            background: k === key ? theme.ink : 'transparent',
            color: k === key ? theme.bg : theme.ink,
            border: k === key ? 'none' : `1.5px solid ${theme.rule}`,
            fontFamily: theme.body, fontSize: 12, fontWeight: 600,
          }}>{p.tab}</button>
        ))}
        <div style={{ width: 14, flexShrink: 0 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {page.sections.map(([title, body], i) => { return (
          <div key={i} style={{
            padding: 18, borderRadius: theme.radius,
            background: theme.surface, border: `1px solid ${theme.rule}`,
          }}>
            <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 18,
              letterSpacing: theme.letterDisplay, color: theme.ink, marginBottom: 8, lineHeight: 1.1,
            }}>{title}</div>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55 }}>
              {(() => {
                const m = String(body).match(/@@PDF:([^@]+)@@/);
                if (!m) return body;
                const txt = String(body).replace(/@@PDF:[^@]+@@/, '').trim();
                return (
                  <>
                    {txt}
                    <button onClick={() => window.__shhhDownloadForm && window.__shhhDownloadForm()} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12,
                      padding: '10px 16px', borderRadius: theme.radiusPill, border: 'none', cursor: 'pointer',
                      background: theme.ink, color: theme.bg,
                      fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                    }}>📄 Lejuplādēt PDF veidlapu</button>
                  </>
                );
              })()}
            </div>
          </div>
        );})}

        {/* Rekvizīti — company contact on every legal page */}
        <div style={{
          padding: 16, borderRadius: theme.radius,
          background: theme.surfaceAlt, marginTop: 4,
        }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 10,
          }}>Rekvizīti</div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, lineHeight: 1.7 }}>
            <div><strong>NL Trading Co SIA</strong></div>
            <div>Reģ. Nr. 40203456789 · PVN LV40203456789</div>
            <div>Brīvības iela 68 – 6, Rīga, LV-1011, Latvija</div>
            <div>E-pasts: <span style={{ color: theme.accent }}>info@shhh.lv</span></div>
            <div>Tālr.: +371 6700 0000</div>
            <div>Mājaslapa: www.shhh.lv</div>
          </div>
        </div>

        {page.cta && (
          <div style={{
            padding: 20, borderRadius: theme.radius,
            background: theme.surface, border: `1.5px solid ${theme.accent}`,
          }}>
            <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 18,
              letterSpacing: theme.letterDisplay, color: theme.ink, marginBottom: 6, lineHeight: 1.1,
            }}>Delete this device's data</div>
            <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginBottom: 14, lineHeight: 1.5 }}>
              Removes order history, favourites and matchmaker picks stored on this device.
              For server-side data tied to your email, you'll get a confirmation email afterwards.
            </div>
            {!confirmOpen ? (
              <button onClick={() => setConfirmOpen(true)} style={{
                all: 'unset', cursor: 'pointer',
                padding: '12px 18px', borderRadius: theme.radiusPill,
                background: theme.accent, color: theme.accentInk,
                fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>Request account deletion</button>
            ) : (
              <div style={{
                padding: 12, borderRadius: theme.radiusSm,
                background: theme.surfaceAlt,
                fontFamily: theme.body, fontSize: 12, color: theme.ink, lineHeight: 1.5,
              }}>
                <strong>Request sent.</strong> Confirmation will arrive at the email on file within 24 hours.
                Final deletion runs within 7 days. You can still order in the meantime.
              </div>
            )}
          </div>
        )}

        {/* Saistītās lapas — internal links */}
        {(() => {
          const L = {
            order: ['📦 Pārbaudīt pasūtījuma statusu', () => { window.__shhhLookupRef = null; nav('content', { key: 'order-lookup' }); }],
            ret: ['↩︎ Pieteikt atgriešanu vai garantiju', () => nav('content', { key: 'order-lookup' })],
            ship: ['🚚 Piegādes noteikumi', () => nav('content', { key: 'shipping-policy' })],
            pay: ['💳 Maksājumu veidi', () => nav('content', { key: 'payment-methods' })],
            gdpr: ['🔐 Datu pieprasījums (GDPR)', () => nav('content', { key: 'gdpr' })],
            contact: ['✉️ Sazināties ar mums', () => nav('content', { key: 'contact' })],
            faq: ['❓ Biežāk uzdotie jautājumi', () => nav('content', { key: 'faq' })],
            privacy: ['🔒 Privātuma politika', () => nav('legal', { key: 'privacy' })],
            terms: ['📄 Lietošanas noteikumi', () => nav('legal', { key: 'terms' })],
            returns: ['↩︎ Atgriešana un atmaksa', () => nav('legal', { key: 'returns' })],
            cookies: ['🍪 Sīkdatņu politika', () => nav('legal', { key: 'cookies' })],
            del: ['🗑 Konta dzēšana', () => nav('legal', { key: 'delete' })],
          };
          const map = {
            terms: ['returns', 'privacy', 'ship', 'pay', 'order'],
            privacy: ['gdpr', 'cookies', 'del', 'contact'],
            cookies: ['privacy', 'gdpr', 'contact'],
            returns: ['order', 'ret', 'ship', 'contact'],
            age: ['privacy', 'terms', 'contact'],
            delete: ['gdpr', 'privacy', 'order', 'contact'],
          };
          const items = (map[key] || []).map(k => L[k]).filter(Boolean);
          if (!items.length) return null;
          return (
            <div style={{ marginTop: 8, padding: 18, borderRadius: theme.radius, background: theme.surfaceAlt }}>
              <div style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 12,
              }}>Saistītās lapas</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map(([label, go], i) => (
                  <button key={i} onClick={go} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '12px 0',
                    borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
                    fontFamily: theme.body, fontSize: 14, fontWeight: 600, color: theme.ink,
                  }}>
                    <span>{label}</span>
                    <span style={{ color: theme.inkSoft }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
