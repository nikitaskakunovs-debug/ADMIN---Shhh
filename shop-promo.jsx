// shop-promo.jsx — marketing promo-code system (separate from gift cards).
// Codes stack WITH gift cards. Discount always shown as a line item.

const PROMO_CODES = {
  'SUMMER20':  { type: 'percent', value: 20, label: '−20%',        desc: 'Vasaras atlaide −20%' },
  'WELCOME10': { type: 'percent', value: 10, label: '−10%',        desc: 'Pirmā pirkuma atlaide −10%' },
  'AGAIN15':   { type: 'percent', value: 15, label: '−15%',        desc: 'Atkārtota pirkuma atlaide −15%' },
  'FREESHIP':  { type: 'shipping', value: 0,  label: 'Bezmaksas piegāde', desc: 'Bezmaksas piegāde' },
  'MINUS10':   { type: 'fixed',   value: 10, label: '−€10',        desc: 'Atlaide −€10' },
};

// Validate a raw code string. Returns { ok, code, promo, error }.
function validatePromo(raw) {
  const code = (raw || '').trim().toUpperCase();
  if (!code) return { ok: false, error: 'Ievadi kodu' };
  const promo = PROMO_CODES[code];
  if (!promo) return { ok: false, error: 'Nederīgs vai beidzies kods' };
  return { ok: true, code, promo };
}

// Compute the promo discount (in €) against an items subtotal + shipping.
// Returns { discount, freeShipping }.
function promoDiscount(promo, subtotal, shipping) {
  if (!promo) return { discount: 0, freeShipping: false };
  if (promo.type === 'percent') return { discount: +(subtotal * promo.value / 100).toFixed(2), freeShipping: false };
  if (promo.type === 'fixed') return { discount: Math.min(promo.value, subtotal), freeShipping: false };
  if (promo.type === 'shipping') return { discount: 0, freeShipping: true };
  return { discount: 0, freeShipping: false };
}

// ─────────────────────────────────────────────────────────────
// PromoField — reusable input + validation feedback + applied chip.
// Persisted via the appliedPromo / setAppliedPromo props (lifted state).
// ─────────────────────────────────────────────────────────────
function PromoField({ theme, appliedPromo, setAppliedPromo, compact = false }) {
  const [raw, setRaw] = React.useState('');
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(!compact);

  const apply = () => {
    const res = validatePromo(raw);
    if (!res.ok) { setError(res.error); return; }
    setError('');
    setAppliedPromo({ code: res.code, ...res.promo });
    setRaw('');
  };

  if (appliedPromo) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderRadius: theme.radius,
        background: theme.accent + '14', border: `1.5px solid ${theme.accent}`,
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 999, background: theme.accent, color: theme.accentInk,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontSize: 13, fontWeight: 700,
        }}>✓</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
            {appliedPromo.code} · {appliedPromo.label}
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>{appliedPromo.desc}</div>
        </div>
        <button onClick={() => setAppliedPromo(null)} style={{
          all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: theme.inkSoft,
        }}>Noņemt</button>
      </div>
    );
  }

  if (compact && !open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
      }}>
        <Icon name="zap" size={15} color={theme.accent} /> Vai jums ir promo kods?
      </button>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
          placeholder="Promo kods"
          style={{
            flex: 1, minWidth: 0, height: 46, padding: '0 14px',
            borderRadius: theme.radiusSm, border: `1.5px solid ${error ? '#E5484D' : theme.rule}`,
            background: theme.surface, fontFamily: theme.mono, fontSize: 14,
            color: theme.ink, outline: 'none', textTransform: 'uppercase',
          }} />
        <button onClick={apply} style={{
          all: 'unset', cursor: 'pointer', padding: '0 18px', height: 46,
          borderRadius: theme.radiusSm, background: theme.ink, color: theme.bg,
          fontFamily: theme.body, fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center',
        }}>Pielietot</button>
      </div>
      {error && (
        <div style={{ fontFamily: theme.body, fontSize: 11, color: '#E5484D', marginTop: 6 }}>✗ {error}</div>
      )}
      <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 6 }}>
        Demo kodi: SUMMER20 · WELCOME10 · FREESHIP · MINUS10
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnnouncementBar — thin strip above header advertising a code.
// ─────────────────────────────────────────────────────────────
function AnnouncementBar({ theme, onApply, appliedPromo }) {
  const [dismissed, setDismissed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  // Persistent "active" state once a promo is applied.
  if (appliedPromo) {
    return (
      <div className="shhh-grad" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '7px 14px', fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: '#fff',
      }}>
        <span>✓ {appliedPromo.code} aktīvs · {appliedPromo.label} pie kases</span>
      </div>
    );
  }
  if (dismissed) return null;
  return (
    <div className="shhh-grad" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '7px 36px 7px 14px', position: 'relative',
      fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: '#fff',
    }}>
      <span>−20% ar kodu</span>
      <button onClick={() => {
        if (onApply) onApply({ code: 'SUMMER20', ...PROMO_CODES['SUMMER20'] });
        setCopied(true); setTimeout(() => setCopied(false), 1500);
      }} style={{
        all: 'unset', cursor: 'pointer', padding: '2px 8px', borderRadius: 6,
        background: 'rgba(255,255,255,0.25)', fontWeight: 800, letterSpacing: 0.5,
      }}>{copied ? 'PIELIETOTS ✓' : 'SUMMER20'}</button>
      <span>🔥</span>
      <button onClick={() => setDismissed(true)} aria-label="Aizvērt" style={{
        all: 'unset', cursor: 'pointer', position: 'absolute', right: 10, top: '50%',
        transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>✕</button>
    </div>
  );
}

// Active percentage discount (0–100) from an applied promo, else 0.
function activePercent(appliedPromo) {
  return (appliedPromo && appliedPromo.type === 'percent') ? appliedPromo.value : 0;
}

Object.assign(window, { PROMO_CODES, validatePromo, promoDiscount, PromoField, AnnouncementBar, activePercent });
