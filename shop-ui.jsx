// shop-ui.jsx — Themed UI primitives shared across screens.
// Themes are passed in via the `theme` prop on the top-level ShopApp.

// ─────────────────────────────────────────────────────────────
// Theme definitions
// ─────────────────────────────────────────────────────────────
const THEMES = {
  velvet: {
    name: 'Mono',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F0',
    ink: '#0A0A0A',
    inkSoft: '#737373',
    rule: 'rgba(10,10,10,0.08)',
    accent: '#2D4BFF',
    accentInk: '#FFFFFF',
    tan: '#0A0A0A',
    radius: 16,
    radiusSm: 10,
    radiusPill: 999,
    display: '"Geist", "DM Sans", system-ui, sans-serif',
    body: '"Geist", "DM Sans", system-ui, sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    letterDisplay: '-0.035em',
    letterCaps: '0.10em',
    italic: false,
    productTint: 'neutral'
  },
  studio: {
    name: 'Block',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F4F2EE',
    ink: '#0F0F0F',
    inkSoft: '#666660',
    rule: 'rgba(15,15,15,0.08)',
    accent: '#FF4D1F',
    accentInk: '#FFFFFF',
    tan: '#0F0F0F',
    radius: 24,
    radiusSm: 14,
    radiusPill: 999,
    display: '"Bricolage Grotesque", "Space Grotesk", system-ui, sans-serif',
    body: '"Manrope", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    letterDisplay: '-0.045em',
    letterCaps: '0.12em',
    italic: false,
    productTint: 'color'
  }
};

// ─────────────────────────────────────────────────────────────
// Tiny inline icons (stroke-only, 1.5px). One source of truth.
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.5 }) {
  const p = {
    fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round'
  };
  const paths = {
    back: <path d="M15 5L7 12L15 19" {...p} />,
    close: <><path d="M6 6L18 18" {...p} /><path d="M6 18L18 6" {...p} /></>,
    search: <><circle cx="11" cy="11" r="7" {...p} /><path d="M16.5 16.5L21 21" {...p} /></>,
    bag: <><path d="M5 8H19L18 20H6L5 8Z" {...p} /><path d="M9 8C9 5.79 10.34 4 12 4C13.66 4 15 5.79 15 8" {...p} /></>,
    heart: <path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" {...p} />,
    user: <><circle cx="12" cy="8" r="4" {...p} /><path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" {...p} /></>,
    home: <path d="M4 11L12 4L20 11V20H14V14H10V20H4V11Z" {...p} />,
    box: <><path d="M4 8L12 4L20 8V18L12 22L4 18V8Z" {...p} /><path d="M4 8L12 12L20 8" {...p} /><path d="M12 12V22" {...p} /></>,
    card: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M3 10H21" {...p} /></>,
    ghost: <path d="M5 10C5 6 8 4 12 4C16 4 19 6 19 10V20L17 18L15 20L13 18L11 20L9 18L7 20L5 18V10Z" {...p} />,
    truck: <><path d="M2 8H14V17H2V8Z" {...p} /><path d="M14 11H18L21 14V17H14V11Z" {...p} /><circle cx="6" cy="18.5" r="1.5" {...p} /><circle cx="17" cy="18.5" r="1.5" {...p} /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" {...p} /><path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" {...p} /></>,
    leaf: <path d="M4 20C4 11 11 4 20 4C20 13 13 20 4 20Z M4 20L12 12" {...p} />,
    arrow: <><path d="M4 12H20" {...p} /><path d="M14 6L20 12L14 18" {...p} /></>,
    check: <path d="M5 12L10 17L19 7" {...p} />,
    chev: <path d="M9 6L15 12L9 18" {...p} />,
    minus: <path d="M5 12H19" {...p} />,
    plus: <><path d="M12 5V19" {...p} /><path d="M5 12H19" {...p} /></>,
    apple: <path d="M16.5 12.5C16.5 10 18.5 8.5 18.5 8.5C18.5 8.5 17 6.5 14.5 6.5C12.5 6.5 11.5 7.5 10 7.5C8.5 7.5 7 6.5 5.5 6.5C3.5 6.5 1.5 8.5 1.5 12C1.5 16 4 21 6.5 21C8 21 8.5 20 10 20C11.5 20 12 21 13.5 21C15 21 17 17 18 14C16 13 16.5 12.5 16.5 12.5Z M13 4.5C14 3 14 1.5 14 1.5C14 1.5 12 1.5 11 3C10 4.5 10 6 10 6C10 6 12 6 13 4.5Z" fill={color} stroke="none" />,
    drop: <path d="M12 3C12 3 5 11 5 15C5 18.5 8 21 12 21C16 21 19 18.5 19 15C19 11 12 3 12 3Z" {...p} />,
    zap: <path d="M13 3L5 14H11L10 21L18 10H12L13 3Z" {...p} />,
    gift: <><rect x="4" y="9" width="16" height="11" rx="1" {...p} /><path d="M4 13H20 M12 9V20 M12 9C12 9 10 4 7.5 5C5.5 5.8 7 9 12 9 M12 9C12 9 14 4 16.5 5C18.5 5.8 17 9 12 9" {...p} /></>,
    eye: <><path d="M2 12C4 7 8 5 12 5C16 5 20 7 22 12C20 17 16 19 12 19C8 19 4 17 2 12Z" {...p} /><circle cx="12" cy="12" r="3" {...p} /></>,
    eyeOff: <><path d="M3 3L21 21" {...p} /><path d="M9.5 9.5C9.18 9.95 9 10.45 9 11C9 12.66 10.34 14 12 14C12.55 14 13.05 13.82 13.5 13.5" {...p} /><path d="M6 6.5C4.5 7.5 3 9.5 2 12C4 17 8 19 12 19C13.5 19 15 18.7 16.3 18.3 M18 16.5C20 15 21.5 13 22 12C20 7 16 5 12 5C11 5 10 5.15 9 5.45" {...p} /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {paths[name] || null}
    </svg>);

}

// ─────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────
function PrimaryButton({ theme, children, onClick, full = true, size = 'lg', style = {} }) {
  const h = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fs = size === 'lg' ? 17 : 15;
  return (
    <button onClick={onClick} className="shhh-grad" style={{
      height: h, width: full ? '100%' : undefined,
      borderRadius: theme.radiusPill,
      fontFamily: theme.body, fontWeight: 700, fontSize: fs, letterSpacing: -0.1,
      cursor: 'pointer', padding: '0 22px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'transform .12s ease',
      boxShadow: '0 6px 20px rgba(110,77,248,0.28), 0 2px 6px rgba(255,79,184,0.18)',
      ...style
    }}>{children}</button>);

}

function GhostButton({ theme, children, onClick, full = true, size = 'md', style = {} }) {
  const h = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  return (
    <button onClick={onClick} style={{
      height: h, width: full ? '100%' : undefined,
      borderRadius: theme.radiusPill,
      background: 'transparent',
      border: `1.5px solid ${theme.ink}`,
      color: theme.ink,
      fontFamily: theme.body, fontWeight: 600, fontSize: 15,
      cursor: 'pointer', padding: '0 22px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style
    }}>{children}</button>);

}

function ApplePayButton({ theme, onClick, label = 'Apple Pay' }) {
  return (
    <button onClick={onClick} style={{
      height: 56, width: '100%', borderRadius: theme.radiusPill,
      background: '#000', color: '#fff', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontFamily: '-apple-system, system-ui', fontWeight: 500, fontSize: 19
    }}>
      <span style={{ marginTop: -2 }}><Icon name="apple" size={22} color="#fff" /></span>
      <span style={{ letterSpacing: -0.2 }}>Pay</span>
    </button>);

}

function GooglePayButton({ theme, onClick }) {
  return (
    <button onClick={onClick} style={{
      height: 56, width: '100%', borderRadius: theme.radiusPill,
      background: '#000', color: '#fff', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'Roboto, system-ui', fontWeight: 500, fontSize: 17
    }}>
      <span style={{ fontWeight: 500, letterSpacing: -0.1 }}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </span>
      <span>Pay</span>
    </button>);

}

// ─────────────────────────────────────────────────────────────
// Product imagery — abstract SVG blob in a tinted card
// ─────────────────────────────────────────────────────────────
function ProductBlob({ product, theme, size = 'md', tint }) {
  const dim = size === 'lg' ? 320 : size === 'md' ? 160 : 96;
  const mono = theme.productTint === 'neutral';
  const bg = tint || (mono ? theme.surfaceAlt : product.swatches[2]);
  const fg = mono ? theme.ink : product.swatches[0];
  const stroke = mono ? theme.ink : product.swatches[1];
  const id = `pb-${product.id}-${size}`;
  return (
    <div style={{
      width: '100%', aspectRatio: '1/1', borderRadius: theme.radius,
      background: `radial-gradient(circle at 30% 25%, ${bg} 0%, ${bg} 40%, ${shade(bg, -8)} 100%)`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: mono ? `1px solid ${theme.rule}` : 'none'
    }}>
      {/* studio backdrop sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.18) 0%, transparent 55%)'
      }} />
      {!mono &&
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(135deg, transparent 0 22px, ${product.swatches[1]}10 22px 23px)`,
        mixBlendMode: 'multiply', opacity: 0.5
      }} />
      }
      {product.image &&
      <img src={product.image} alt={product.name} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'contain', padding: '14%',
        filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.18))',
        zIndex: 2
      }} />
      }
      {!product.image && <svg viewBox="0 0 100 100" width={mono ? '62%' : '68%'} height={mono ? '62%' : '68%'}
      style={{ position: 'relative', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.22))' }}>
        <defs>
          <linearGradient id={id + '-fill'} x1="0.3" y1="0.1" x2="0.7" y2="1">
            <stop offset="0%" stopColor={lighten(fg, 14)} />
            <stop offset="55%" stopColor={fg} />
            <stop offset="100%" stopColor={shade(fg, -18)} />
          </linearGradient>
          <radialGradient id={id + '-glow'} cx="0.3" cy="0.22" r="0.55">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <path d={product.blob} fill={`url(#${id}-fill)`} />
        <path d={product.blob} fill={`url(#${id}-glow)`} />
        <path d={product.blob} fill="none" stroke={stroke} strokeWidth={0.4} opacity={0.35} />
      </svg>}
      {/* ground reflection */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 18, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.30), transparent 70%)',
        filter: 'blur(2px)'
      }} />
    </div>);

}

// Small color helpers used by ProductBlob for studio-shot shading.
function lighten(hex, pct) {return _shiftHex(hex, pct);}
function shade(hex, pct) {return _shiftHex(hex, pct);}
function _shiftHex(hex, pct) {
  if (!hex || typeof hex !== 'string' || hex[0] !== '#') return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return hex;
  const f = (i) => Math.max(0, Math.min(255, parseInt(h.slice(i, i + 2), 16) + Math.round(255 * pct / 100)));
  const r = f(0).toString(16).padStart(2, '0');
  const g = f(2).toString(16).padStart(2, '0');
  const b = f(4).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// ─────────────────────────────────────────────────────────────
// Product card (variants: image / minimal / textled)
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, theme, variant = 'image', onClick, isFavourite, onFavourite, onQuickBuy }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();onClick && onClick();}
  };
  const [cardImg, setCardImg] = React.useState(0);
  // Active % promo → discounted price node (strikethrough + new price + tag).
  const _pct = (typeof window !== 'undefined' && window.__shhhPct) ? window.__shhhPct : 0;
  const PriceTag = ({ size = 13 }) => {
    // Per-product sale (oldPrice) — independent of global promo
    if (product.oldPrice && product.oldPrice > product.price) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: theme.mono, fontSize: size, color: theme.accent, fontWeight: 700 }}>€{product.price}</span>
          <s style={{ fontFamily: theme.mono, fontSize: size - 3, color: theme.inkSoft, fontWeight: 400 }}>€{product.oldPrice}</s>
        </span>
      );
    }
    if (_pct > 0) {
      const np = (product.price * (1 - _pct / 100)).toFixed(2);
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <s style={{ fontFamily: theme.mono, fontSize: size - 2, color: theme.inkSoft, fontWeight: 400 }}>€{product.price}</s>
          <span style={{ fontFamily: theme.mono, fontSize: size, color: theme.accent, fontWeight: 700 }}>€{np}</span>
        </span>
      );
    }
    return <span style={{ fontFamily: theme.mono, fontSize: size, color: theme.ink, fontWeight: 600 }}>€{product.price}</span>;
  };
  // Action overlay buttons used in the 'image' variant
  const Actions = () =>
  <>
      {onFavourite &&
    <button onClick={(e) => {e.stopPropagation();onFavourite(product.id);}}
    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'} style={{
      all: 'unset', cursor: 'pointer',
      position: 'absolute', top: 8, right: 8, zIndex: 2,
      width: 34, height: 34, borderRadius: 999,
      background: isFavourite ? theme.ink : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      color: isFavourite ? theme.bg : theme.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      transition: 'transform .14s ease, background .14s ease'
    }}>
          {isFavourite ?
      <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" fill={theme.accent} />
              </svg> :
      <Icon name="heart" size={18} />}
        </button>
    }
      {onQuickBuy && false &&
    <button onClick={(e) => {e.stopPropagation();onQuickBuy(product.id);}}
    aria-label="Quick buy" style={{
      all: 'unset', cursor: 'pointer',
      position: 'absolute', bottom: 8, right: 8, zIndex: 2,
      height: 32, borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: theme.body, fontWeight: 700, fontSize: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)', alignContent: "unset", justifyContent: "flex-start", padding: "0px 12px", margin: "0px"
    }} className="shhh-grad">
          ⚡ <span style={{ marginTop: -1, color: "rgb(0, 0, 0)" }}>Buy</span>
        </button>
    }
    </>;


  if (variant === 'minimal') {
    return (
      <div onClick={onClick} role="button" tabIndex={0} onKeyDown={handleKey} style={{
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        gap: 10, width: '100%', boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative' }}>
          <ProductBlob product={product} theme={theme} />
          <Actions />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: theme.ink }}>{product.name}</span>
          <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.inkSoft }}>€{product.price}</span>
        </div>
      </div>);

  }
  if (variant === 'textled') {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <div onClick={onClick} role="button" tabIndex={0} onKeyDown={handleKey} style={{
          cursor: 'pointer', display: 'flex', gap: 14,
          padding: 14, background: theme.surface, borderRadius: theme.radius,
          border: `1px solid ${theme.rule}`, width: '100%', boxSizing: 'border-box',
          alignItems: 'center'
        }}>
          <div style={{ width: 76, height: 76, flexShrink: 0, position: 'relative' }}>
            <ProductBlob product={product} theme={theme} size="sm" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 22,
              color: theme.ink, letterSpacing: theme.letterDisplay,
              fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1.1
            }}>{product.name}</div>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginTop: 2 }}>
              {product.tagline}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink, fontWeight: 600 }}>
                €{product.price}
              </span>
              {product.badge &&
              <span style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 600,
                padding: '2px 8px', borderRadius: 4,
                background: theme.accent, color: theme.accentInk,
                letterSpacing: 0.4, textTransform: 'uppercase'
              }}>{product.badge}</span>
              }
            </div>
          </div>
        </div>
        {onFavourite &&
        <button onClick={(e) => {e.stopPropagation();onFavourite(product.id);}} style={{
          all: 'unset', cursor: 'pointer',
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          width: 30, height: 30, borderRadius: 999,
          background: isFavourite ? theme.ink : theme.surfaceAlt,
          color: isFavourite ? theme.bg : theme.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {isFavourite ?
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" fill={theme.accent} /></svg> :
          <Icon name="heart" size={16} />}
          </button>
        }
      </div>);

  }
  // default: image-led card
  return (
    <div onClick={onClick} role="button" tabIndex={0} onKeyDown={handleKey} style={{
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
      width: '100%', boxSizing: 'border-box',
      background: theme.surface, borderRadius: theme.radius,
      border: `1px solid ${theme.rule}`,
      overflow: 'hidden', position: 'relative',
      boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 10px 24px -18px rgba(0,0,0,0.22)',
      transition: 'transform .2s ease, box-shadow .2s ease'
    }}>
      <div style={{ position: 'relative', padding: 10 }}>
        {(() => {
          const cols = (product.swatches || []).slice(0, 4);
          const multi = cols.length > 1;
          return (
            <div style={{ position: 'relative' }}>
              <ProductBlob product={product} theme={theme} tint={cols[cardImg] || undefined} />
              {multi && (
                <>
                  {/* Tap zones — left/right half of image navigates without opening the card */}
                  <div onClick={(e) => { e.stopPropagation(); setCardImg((cardImg - 1 + cols.length) % cols.length); }}
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', zIndex: 1, cursor: 'pointer' }} />
                  <div onClick={(e) => { e.stopPropagation(); setCardImg((cardImg + 1) % cols.length); }}
                    style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', zIndex: 1, cursor: 'pointer' }} />
                  <button onClick={(e) => { e.stopPropagation(); setCardImg((cardImg - 1 + cols.length) % cols.length); }}
                    aria-label="Iepriekšējā krāsa" style={{
                    all: 'unset', cursor: 'pointer', position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                    width: 26, height: 26, borderRadius: 999, color: theme.inkSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, fontSize: 16, opacity: 0.55,
                  }}>‹</button>
                  <button onClick={(e) => { e.stopPropagation(); setCardImg((cardImg + 1) % cols.length); }}
                    aria-label="Nākamā krāsa" style={{
                    all: 'unset', cursor: 'pointer', position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                    width: 26, height: 26, borderRadius: 999, color: theme.inkSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, fontSize: 16, opacity: 0.55,
                  }}>›</button>
                  <div style={{
                    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: 4, zIndex: 2,
                  }}>
                    {cols.map((_, i) => (
                      <span key={i} style={{
                        width: i === cardImg ? 12 : 5, height: 5, borderRadius: 5,
                        background: i === cardImg ? theme.ink : 'rgba(0,0,0,0.25)', transition: 'width .2s',
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}
        {(() => {
          const b = product.oldPrice && product.oldPrice > product.price
            ? { l: '−' + Math.round((1 - product.price / product.oldPrice) * 100) + '%', bg: '#E0282E', fg: '#fff' }
            : product.isNew ? { l: 'Jaunums', bg: '#1F8A4C', fg: '#fff' }
            : product.clearance ? { l: 'Izpārdošana', bg: '#E07B00', fg: '#fff' }
            : product.badge ? { l: product.badge, bg: theme.ink, fg: theme.bg }
            : null;
          return b ? (
            <div style={{
              position: 'absolute', top: 18, left: 18, zIndex: 1,
              background: b.bg, color: b.fg,
              fontFamily: theme.body, fontSize: 10, fontWeight: 700,
              letterSpacing: 0.4, padding: '4px 9px', borderRadius: 6,
            }}>{b.l}</div>
          ) : null;
        })()}
        <Actions />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Brand eyebrow */}
        {product.brand && (
          <div style={{
            fontFamily: theme.body, fontSize: 10, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft,
          }}>{product.brand}</div>
        )}
        {/* Product name — max 2 lines, no hyphenation */}
        <h3 style={{
          margin: 0, fontFamily: theme.body, fontWeight: 700, fontSize: 14,
          color: theme.ink, lineHeight: 1.25, letterSpacing: -0.1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', hyphens: 'none', wordBreak: 'normal',
          minHeight: 35,
        }}>{product.name}</h3>
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: theme.accent, fontSize: 11, letterSpacing: 0.5 }}>★</span>
          <span style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, color: theme.ink }}>{product.rating || 4.7}</span>
          <span style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>({product.reviewCount || 128})</span>
        </div>
        {/* Price row + Buy action */}
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ minWidth: 0, flexShrink: 1, overflow: 'hidden' }}><PriceTag size={14} /></div>
          {onQuickBuy && (
            <button onClick={(e) => { e.stopPropagation(); onQuickBuy(product.id); }}
              aria-label="Pirkt" className="shhh-grad" style={{
              cursor: 'pointer', height: 34, borderRadius: 999, padding: '0 12px',
              display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0, whiteSpace: 'nowrap',
              fontFamily: theme.body, fontWeight: 700, fontSize: 12, color: '#000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
            }}>⚡ Pirkt</button>
          )}
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar (persistent on most screens)
// ─────────────────────────────────────────────────────────────
function BottomBar({ theme, current, onNav, cartCount = 0, frameless = false }) {
  const t = typeof useT === 'function' ? useT() : (k, fb) => fb || k;
  const Item = ({ id, icon, label }) => {
    const active = current === id;
    return (
      <button onClick={() => onNav(id)} style={{
        all: 'unset', cursor: 'pointer', flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '8px 0',
        color: active ? theme.ink : theme.inkSoft,
        position: 'relative'
      }}>
        <Icon name={icon} size={22} />
        <span style={{ fontFamily: theme.body, fontSize: 10, fontWeight: active ? 600 : 500, letterSpacing: 0.2 }}>
          {label}
        </span>
        {id === 'cart' && cartCount > 0 &&
        <span style={{
          position: 'absolute', top: 4, right: 'calc(50% - 18px)',
          minWidth: 16, height: 16, borderRadius: 8,
          background: theme.accent, color: theme.accentInk,
          fontSize: 10, fontWeight: 700, fontFamily: theme.body,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px'
        }}>{cartCount}</span>
        }
      </button>);

  };
  return (
    <div style={{
      position: frameless ? 'fixed' : 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: frameless ? 'calc(8px + env(safe-area-inset-bottom, 0px))' : 26, paddingTop: 4,
      background: theme.bg + 'EE',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${theme.rule}`,
      display: 'flex', alignItems: 'stretch',
      zIndex: 5
    }}>
      <Item id="home" icon="home" label={t('tab.shop', 'Shop')} />
      <Item id="category" icon="search" label={t('tab.browse', 'Browse')} />
      <Item id="account" icon="user" label={t('tab.you', 'You')} />
      <Item id="cart" icon="bag" label={t('tab.bag', 'Bag')} />
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Top header (used on inner screens)
// ─────────────────────────────────────────────────────────────
function TopBar({ theme, title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px 14px', gap: 8
    }}>
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center' }}>
        {onBack &&
        <button onClick={onBack} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          color: theme.ink
        }}>
            <Icon name="back" size={26} />
          </button>
        }
      </div>
      <div style={{
        fontFamily: theme.body, fontSize: 15, fontWeight: 600,
        color: theme.ink, letterSpacing: 0.2
      }}>{title}</div>
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Brand wordmark
// ─────────────────────────────────────────────────────────────
function Wordmark({ theme, size = 22 }) {
  return (
    <div style={{
      fontFamily: theme.display, fontWeight: 700, fontSize: size,
      letterSpacing: theme.letterDisplay,
      fontStyle: theme.italic ? 'italic' : 'normal',
      lineHeight: 1, display: 'inline-block'
    }} className="shhh-grad-text">shhh...</div>);

}

// ─────────────────────────────────────────────────────────────
// Trust signal tile
// ─────────────────────────────────────────────────────────────
function TrustTile({ theme, signal, compact = false }) {
  return (
    <div style={{
      padding: compact ? 14 : 18, background: theme.surface,
      borderRadius: theme.radius, border: `1px solid ${theme.rule}`,
      display: 'flex', flexDirection: 'column', gap: 10
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: theme.radiusSm,
        background: theme.surfaceAlt, display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: theme.ink
      }}>
        <Icon name={signal.icon} size={20} />
      </div>
      <div>
        <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: theme.ink, marginBottom: 2 }}>
          {signal.title}
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.4 }}>
          {signal.body}
        </div>
      </div>
    </div>);

}

Object.assign(window, {
  THEMES, Icon, PrimaryButton, GhostButton, ApplePayButton, GooglePayButton,
  ProductBlob, ProductCard, BottomBar, TopBar, Wordmark, TrustTile
});