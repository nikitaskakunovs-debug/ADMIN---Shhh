// admin-ui.jsx — operator design system: tokens, shell, and primitives.
// Shares the storefront brand (Geist + blue #2D4BFF) but runs denser, with a
// dark sidebar (the brand's footer/menu colour) and a light data workspace.

const AT = {
  app: '#F4F4F2',
  panel: '#FFFFFF',
  side: '#0F0F0E',
  sideRule: 'rgba(255,255,255,0.10)',
  sideInk: '#FFFFFF',
  sideSoft: 'rgba(255,255,255,0.55)',
  ink: '#0A0A0A',
  inkSoft: '#6B6B68',
  rule: 'rgba(10,10,10,0.10)',
  ruleSoft: 'rgba(10,10,10,0.06)',
  accent: '#2D4BFF',
  accentSoft: '#EAEEFF',
  surfaceAlt: '#F4F4F2',
  ok: '#1F8A4C', warn: '#C2410C', danger: '#D0282E',
  radius: 12, radiusSm: 8, radiusPill: 999,
  display: '"Geist", system-ui, sans-serif',
  body: '"Geist", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
  ld: '-0.02em', lc: '0.08em',
};

// ── Icons (compact stroke set) ───────────────────────────────
function AIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" {...p} /><rect x="14" y="3" width="7" height="5" rx="1.5" {...p} /><rect x="14" y="12" width="7" height="9" rx="1.5" {...p} /><rect x="3" y="16" width="7" height="5" rx="1.5" {...p} /></>,
    orders: <><path d="M4 8L12 4L20 8V18L12 22L4 18V8Z" {...p} /><path d="M4 8L12 12L20 8" {...p} /><path d="M12 12V22" {...p} /></>,
    catalog: <><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" {...p} /></>,
    inventory: <><path d="M3 7l9-4 9 4-9 4-9-4Z" {...p} /><path d="M3 12l9 4 9-4M3 17l9 4 9-4" {...p} /></>,
    promos: <><path d="M3 9l9-5 9 5v6l-9 5-9-5V9Z" {...p} /><path d="M9 12h.01M15 12h.01" {...p} /></>,
    reviews: <path d="M12 4l2.3 5 5.7.5-4.3 3.8 1.3 5.6L12 16l-5.3 2.9 1.3-5.6L3.7 9.5 9.4 9 12 4Z" {...p} />,
    returns: <><path d="M3 12a9 9 0 1 0 3-6.7" {...p} /><path d="M3 4v5h5" {...p} /></>,
    content: <><rect x="4" y="3" width="16" height="18" rx="2" {...p} /><path d="M8 8h8M8 12h8M8 16h5" {...p} /></>,
    brands: <><circle cx="12" cy="9" r="5" {...p} /><path d="M8.5 13L7 21l5-2.5L17 21l-1.5-8" {...p} /></>,
    settings: <><circle cx="12" cy="12" r="3" {...p} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...p} /></>,
    search: <><circle cx="11" cy="11" r="7" {...p} /><path d="M16.5 16.5L21 21" {...p} /></>,
    chev: <path d="M9 6l6 6-6 6" {...p} />,
    chevDown: <path d="M6 9l6 6 6-6" {...p} />,
    plus: <><path d="M12 5v14M5 12h14" {...p} /></>,
    check: <path d="M5 12l5 5L19 7" {...p} />,
    close: <><path d="M6 6l12 12M6 18L18 6" {...p} /></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" {...p} /></>,
    truck: <><path d="M2 8H14V17H2V8Z" {...p} /><path d="M14 11H18L21 14V17H14V11Z" {...p} /><circle cx="6" cy="18.5" r="1.5" {...p} /><circle cx="17" cy="18.5" r="1.5" {...p} /></>,
    refund: <><path d="M3 7v5h5" {...p} /><path d="M3.5 12a8.5 8.5 0 1 1 2 5.5" {...p} /><path d="M12 8v4l3 2" {...p} /></>,
    undo: <><path d="M9 7L4 12l5 5" {...p} /><path d="M4 12h11a5 5 0 0 1 0 10h-2" {...p} /></>,
    redo: <><path d="M15 7l5 5-5 5" {...p} /><path d="M20 12H9a5 5 0 0 0 0 10h2" {...p} /></>,
    x: <><path d="M6 6l12 12M6 18L18 6" {...p} /></>,
    dots: <><circle cx="5" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="19" cy="12" r="1.4" fill={color} stroke="none" /></>,
    download: <><path d="M12 4v11M7 11l5 5 5-5" {...p} /><path d="M5 20h14" {...p} /></>,
    bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7Z" {...p} />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" {...p} /><circle cx="12" cy="12" r="3" {...p} /></>,
    users: <><circle cx="9" cy="8" r="3.2" {...p} /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" {...p} /><path d="M16 5.5a3 3 0 0 1 0 5.5M17.5 19a5.5 5.5 0 0 0-3-4.9" {...p} /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" {...p} /><path d="M4 7l8 6 8-6" {...p} /></>,
    chat: <><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.2A8 8 0 1 1 21 12Z" {...p} /></>,
    paperclip: <><path d="M21 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 6" {...p} /></>,
    send: <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" {...p} /></>,
    bug: <><rect x="8" y="6" width="8" height="13" rx="4" {...p} /><path d="M12 2v3M5 9l3 1M19 9l-3 1M4 14h4M16 14h4M5 19l3-1.5M19 19l-3-1.5M9 4l1.5 2M15 4l-1.5 2" {...p} /></>,
    phone: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 18l-1 3a16 16 0 0 1-13-13L5 4Z" {...p} />,
    pin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" {...p} /><circle cx="12" cy="10" r="2.5" {...p} /></>,
    trash: <><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" {...p} /></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" {...p} /></>,
    tag: <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" {...p} /><circle cx="8" cy="8" r="1.4" fill={color} stroke="none" /></>,
    pkg: <><path d="M4 8l8-4 8 4v8l-8 4-8-4V8Z" {...p} /><path d="M4 8l8 4 8-4M12 12v8" {...p} /></>,
    analytics: <><path d="M4 19V5M4 19h16M8 16v-4M12 16V9M16 16v-6" {...p} /></>,
    finance: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M3 10h18M7 15h4" {...p} /></>,
    megaphone: <><path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1Z" {...p} /><path d="M18 8a4 4 0 0 1 0 8" {...p} /></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" {...p} /><path d="M10 20a2 2 0 0 0 4 0" {...p} /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" {...p} /><path d="M3 9h18M8 3v4M16 3v4" {...p} /></>,
    filter: <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" {...p} />,
    grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" {...p} /><rect x="13" y="4" width="7" height="7" rx="1.5" {...p} /><rect x="4" y="13" width="7" height="7" rx="1.5" {...p} /><rect x="13" y="13" width="7" height="7" rx="1.5" {...p} /></>,
    list: <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...p} /></>,
    plug: <><path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v6" {...p} /></>,
    grip: <><circle cx="9" cy="6" r="1.3" fill={color} stroke="none" /><circle cx="15" cy="6" r="1.3" fill={color} stroke="none" /><circle cx="9" cy="12" r="1.3" fill={color} stroke="none" /><circle cx="15" cy="12" r="1.3" fill={color} stroke="none" /><circle cx="9" cy="18" r="1.3" fill={color} stroke="none" /><circle cx="15" cy="18" r="1.3" fill={color} stroke="none" /></>,
    eyeOff: <><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.8M9.4 5.2A9.3 9.3 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.4A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 3-.5" {...p} /></>,
    logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" {...p} /><path d="M10 17l-5-5 5-5M5 12h12" {...p} /></>,
    login: <><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" {...p} /><path d="M15 17l5-5-5-5M20 12H8" {...p} /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" {...p} /></>,
    user: <><circle cx="12" cy="8" r="4" {...p} /><path d="M4 20a8 8 0 0 1 16 0" {...p} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>{paths[name] || null}</svg>;
}

// ── Buttons ──────────────────────────────────────────────────
function ABtn({ children, onClick, kind = 'primary', size = 'md', full, style = {}, disabled }) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const pads = size === 'sm' ? '0 12px' : '0 16px';
  const fs = size === 'sm' ? 12.5 : 13.5;
  const styles = {
    primary: { background: AT.accent, color: '#fff', border: '1px solid ' + AT.accent },
    ghost: { background: AT.panel, color: AT.ink, border: '1px solid ' + AT.rule },
    danger: { background: '#fff', color: AT.danger, border: '1px solid ' + AT.danger },
    dark: { background: AT.ink, color: '#fff', border: '1px solid ' + AT.ink },
    soft: { background: AT.surfaceAlt, color: AT.ink, border: '1px solid transparent' },
  }[kind];
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      all: 'unset', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'pointer',
      height: h, padding: pads, borderRadius: AT.radiusSm,
      fontFamily: AT.body, fontWeight: 600, fontSize: fs, letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      width: full ? '100%' : undefined, opacity: disabled ? 0.45 : 1, ...styles, ...style,
    }}>{children}</button>
  );
}

// ── Status / generic badges ──────────────────────────────────
function AStatus({ status }) {
  const m = (ORDER_STATUS[status]) || { label: status, fg: AT.inkSoft, bg: AT.surfaceAlt, dot: AT.inkSoft };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 8px', borderRadius: 999, background: m.bg, color: m.fg,
      fontFamily: AT.body, fontWeight: 700, fontSize: 11.5, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: m.dot }} />
      {m.label}
    </span>
  );
}
function ABadge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: AT.surfaceAlt, fg: AT.inkSoft },
    blue: { bg: AT.accentSoft, fg: AT.accent },
    ok: { bg: '#E3F0E6', fg: AT.ok },
    warn: { bg: '#FBE9A8', fg: '#7A5A00' },
    danger: { bg: '#F3E0E0', fg: AT.danger },
  }[tone];
  return <span style={{
    padding: '2px 8px', borderRadius: 6, background: tones.bg, color: tones.fg,
    fontFamily: AT.body, fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap',
  }}>{children}</span>;
}

// ── Cards / layout ───────────────────────────────────────────
function APanel({ children, style = {}, pad = 0 }) {
  return <div style={{ background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, padding: pad, ...style }}>{children}</div>;
}
function AStat({ label, value, delta, deltaTone = 'ok', icon }) {
  return (
    <APanel pad={18} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>{label}</span>
        {icon && <span style={{ color: AT.inkSoft }}><AIcon name={icon} size={16} /></span>}
      </div>
      <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 30, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1 }}>{value}</div>
      {delta != null && (
        <div style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: deltaTone === 'ok' ? AT.ok : deltaTone === 'warn' ? AT.warn : AT.inkSoft }}>{delta}</div>
      )}
    </APanel>
  );
}

function ASectionTitle({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
      <h2 style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink, margin: 0 }}>{children}</h2>
      {right}
    </div>
  );
}

// ── Inputs ───────────────────────────────────────────────────
function AField({ label, children, hint }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>}
      {children}
      {hint && <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginTop: 5 }}>{hint}</div>}
    </label>
  );
}
const aInputStyle = {
  width: '100%', boxSizing: 'border-box', height: 38, padding: '0 12px',
  borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel,
  fontFamily: AT.body, fontSize: 13.5, color: AT.ink, outline: 'none',
};
function AInput(props) { return <input {...props} style={{ ...aInputStyle, ...(props.style || {}) }} />; }
function ASearch({ value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', borderRadius: AT.radiusSm, background: AT.surfaceAlt, minWidth: 220 }}>
      <AIcon name="search" size={16} color={AT.inkSoft} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: AT.body, fontSize: 13, color: AT.ink, minWidth: 0,
      }} />
    </div>
  );
}

// Compact dropdown filter (label + options)
function ASelect({ label, value, onChange, options, width }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 6px 0 12px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, gap: 4, width }}>
      {label && <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{label}</span>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer',
        fontFamily: AT.body, fontSize: 13, fontWeight: 600, color: AT.ink, padding: '0 4px', flex: 1,
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Multi-select filter: button + count badge, opens a checkbox list. `value` is an array.
function AMultiSelect({ label, value, onChange, options, width }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  value = value || [];
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const toggle = (v) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  const n = value.length;
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', width }}>
      <button onClick={() => setOpen(o => !o)} style={{
        all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: width || 'auto',
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 38, padding: '0 10px 0 12px',
        borderRadius: AT.radiusSm, border: `1px solid ${n ? AT.accent : AT.rule}`, background: n ? AT.accentSoft : AT.panel,
      }}>
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: n ? AT.accent : AT.inkSoft, whiteSpace: 'nowrap' }}>{label}</span>
        {n > 0 && <span style={{ minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>}
        <AIcon name="chevDown" size={14} color={n ? AT.accent : AT.inkSoft} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 44, left: 0, zIndex: 70, minWidth: Math.max(190, parseInt(width) || 0), maxHeight: 300, overflowY: 'auto', background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 5, boxShadow: '0 16px 40px rgba(0,0,0,0.16)' }}>
          {n > 0 && <button onClick={() => onChange([])} style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: '6px 9px', fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.accent }}>Clear selection</button>}
          {options.map(o => {
            const on = value.includes(o.value);
            return (
              <button key={o.value} onClick={() => toggle(o.value)} style={{
                all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px', borderRadius: 7,
                fontFamily: AT.body, fontSize: 13, color: AT.ink,
              }}
                onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${on ? AT.accent : AT.rule}`, background: on ? AT.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{on && <AIcon name="check" size={11} color="#fff" />}</span>
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.count != null && <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{o.count}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// "Clear all filters" link — shown only when any filter is active.
function AFilterReset({ show, onClear }) {
  if (!show) return null;
  return (
    <button onClick={onClear} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 8px', fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.accent }}>
      <AIcon name="x" size={13} color={AT.accent} /> Clear filters
    </button>
  );
}

// Date range (from / to). Values are YYYY-MM-DD strings or ''.
function ADateRange({ from, to, onFrom, onTo }) {
  const inp = { height: 38, padding: '0 8px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontSize: 12.5, color: AT.ink, outline: 'none', colorScheme: 'light' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <AIcon name="calendar" size={15} color={AT.inkSoft} />
      <input type="date" value={from || ''} onChange={e => onFrom(e.target.value)} style={inp} />
      <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>→</span>
      <input type="date" value={to || ''} onChange={e => onTo(e.target.value)} style={inp} />
    </span>
  );
}

// ── Table ────────────────────────────────────────────────────
function ATable({ columns, children }) {
  return (
    <APanel style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AT.body }}>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} style={{
                  textAlign: c.align || 'left', padding: '12px 16px', whiteSpace: 'nowrap',
                  fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase',
                  color: AT.inkSoft, borderBottom: `1px solid ${AT.rule}`, background: AT.surfaceAlt,
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </APanel>
  );
}
function ATd({ children, align, mono, strong, style = {}, onClick }) {
  return <td onClick={onClick} style={{
    padding: '12px 16px', borderBottom: `1px solid ${AT.ruleSoft}`, textAlign: align || 'left',
    fontFamily: mono ? AT.mono : AT.body, fontSize: 13, color: strong ? AT.ink : AT.inkSoft,
    fontWeight: strong ? 700 : 500, verticalAlign: 'middle', ...style,
  }}>{children}</td>;
}

// ── Drawer (right slide-over) ────────────────────────────────
function ADrawer({ open, onClose, title, sub, children, footer, width = 540 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,10,10,0.45)', display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: width, maxWidth: '94vw', height: '100%', background: AT.panel,
        display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${AT.rule}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 20, letterSpacing: AT.ld, color: AT.ink }}>{title}</div>
            {sub && <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginTop: 3 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999, background: AT.surfaceAlt, color: AT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="close" size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>{children}</div>
        {footer && <div style={{ padding: '16px 22px', borderTop: `1px solid ${AT.rule}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: AT.surfaceAlt }}>{footer}</div>}
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────
function AToast({ msg, onUndo }) {
  if (!msg) return null;
  const text = typeof msg === 'string' ? msg : msg.text;
  const undoable = typeof msg === 'object' && msg.undo;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 300,
      background: AT.ink, color: '#fff', padding: '12px 18px', borderRadius: 10,
      fontFamily: AT.body, fontWeight: 600, fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, background: AT.ok, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="check" size={12} color="#fff" sw={2.4} /></span>
      {text}
      {undoable && onUndo && (
        <button onClick={onUndo} style={{
          all: 'unset', cursor: 'pointer', marginLeft: 4, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.22)',
          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: '#fff',
        }}><AIcon name="undo" size={14} color="#fff" /> Undo</button>
      )}
    </div>
  );
}

// ── Confirm dialog (guards critical actions: refunds, deletes, copies, serious changes) ──
// Driven by ctx.confirm({ title, body, confirmLabel, tone, icon, requireType, onConfirm }).
// `state` is null when closed. tone: 'danger' (default) | 'primary'.
function AConfirm({ state, onClose }) {
  const [typed, setTyped] = React.useState('');
  const [promptVal, setPromptVal] = React.useState('');
  React.useEffect(() => { setTyped(''); setPromptVal(''); }, [state]);
  const tone = (state && state.tone) || 'danger';
  const accent = tone === 'danger' ? AT.danger : AT.accent;
  const needType = state && state.requireType;
  const prompt = state && state.prompt; // { label, placeholder, required }
  const promptOk = !prompt || !prompt.required || promptVal.trim().length > 0;
  const ready = (!needType || typed.trim().toUpperCase() === String(needType).toUpperCase()) && promptOk;
  const go = React.useCallback(() => {
    if (!ready) return;
    const fn = state && state.onConfirm;
    const val = promptVal;
    onClose();
    if (fn) fn(val);
  }, [state, ready, onClose, promptVal]);
  React.useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'Enter' && ready && !needType) { e.preventDefault(); go(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state, ready, needType, go, onClose]);
  if (!state) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(10,10,10,0.5)',
      backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true" style={{
        width: 452, maxWidth: '100%', background: AT.panel, borderRadius: AT.radius,
        boxShadow: '0 30px 90px rgba(0,0,0,0.45)', overflow: 'hidden',
        animation: 'aConfirmIn .14s ease-out',
      }}>
        <div style={{ padding: '24px 24px 0', display: 'flex', gap: 14 }}>
          <span style={{
            width: 44, height: 44, borderRadius: 999, flexShrink: 0,
            background: tone === 'danger' ? '#F7E4E4' : AT.accentSoft, color: accent,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><AIcon name={state.icon || (tone === 'danger' ? 'trash' : 'shield')} size={21} color={accent} /></span>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18.5, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1.2 }}>{state.title || 'Do you really want to do this?'}</div>
            {state.body && <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.inkSoft, marginTop: 7, lineHeight: 1.5 }}>{state.body}</div>}
          </div>
        </div>
        {needType && (
          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginBottom: 6 }}>Type <strong style={{ color: AT.ink, fontFamily: AT.mono }}>{needType}</strong> to confirm</div>
            <input autoFocus value={typed} onChange={e => setTyped(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && ready) { e.preventDefault(); go(); } }}
              style={{ ...aInputStyle, borderColor: ready ? AT.ok : AT.rule }} />
          </div>
        )}
        {prompt && (
          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.ink, marginBottom: 6 }}>{prompt.label || 'Reason'}{prompt.required ? <span style={{ color: AT.danger }}> *</span> : ''}</div>
            <textarea autoFocus value={promptVal} onChange={e => setPromptVal(e.target.value)} rows={3} placeholder={prompt.placeholder || ''}
              style={{ ...aInputStyle, height: 'auto', minHeight: 70, padding: '10px 12px', resize: 'vertical', lineHeight: 1.45 }} />
          </div>
        )}
        <div style={{ padding: '20px 24px 22px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <ABtn kind="ghost" onClick={onClose}>{state.cancelLabel || 'Cancel'}</ABtn>
          <ABtn kind={tone === 'danger' ? 'danger' : 'primary'} onClick={go} disabled={!ready}
            style={tone === 'danger' ? { background: AT.danger, color: '#fff', borderColor: AT.danger } : {}}>
            {state.confirmLabel || 'Yes, continue'}
          </ABtn>
        </div>
      </div>
    </div>
  );
}

// ── Refund modal (correct a mistake: VAT, totals, overcharge, goodwill…) ──
// Driven by ctx.refund(order). Lets the operator pick an amount (full / VAT /
// custom partial), choose a reason, and add a free-text note. onSubmit gets
// (order, { amount, reason, reasonLabel, note }).
const REFUND_REASONS = [
  { id: 'vat',        label: 'VAT correction',            hint: 'Wrong VAT rate, or VAT charged where it should not have been' },
  { id: 'price',      label: 'Pricing / total error',     hint: 'Subtotal, sum or a line price was miscalculated' },
  { id: 'overcharge', label: 'Overcharge or double charge', hint: 'The customer was billed more than once or for too much' },
  { id: 'promo',      label: 'Missed discount or promo',  hint: 'A code or sale price was not applied at checkout' },
  { id: 'shipping',   label: 'Shipping overcharge',       hint: 'Delivery fee was charged in error or set too high' },
  { id: 'goodwill',   label: 'Goodwill gesture',          hint: 'Compensation for a delay, mix-up or other issue' },
  { id: 'other',      label: 'Other reason',              hint: 'Describe what happened in the note below' },
];
function ARefundModal({ state, onClose, onSubmit }) {
  const order = state && state.order;
  const om = order ? (order.market || order.country || 'LV') : 'LV';
  const rc = order ? (typeof isReverseCharge === 'function' && isReverseCharge(order)) : false;
  const gross = order ? (Number(order.total) || 0) : 0;
  const alreadyRefunded = order ? (order.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0) : 0;
  const remaining = Math.max(0, gross - alreadyRefunded);
  const vatPortion = rc ? 0 : (typeof vatOf === 'function' ? vatOf(remaining).vat : 0);

  const [amount, setAmount] = React.useState('');
  const [preset, setPreset] = React.useState('full');
  const [reason, setReason] = React.useState('');
  const [note, setNote] = React.useState('');

  React.useEffect(() => {
    if (!order) return;
    setAmount(remaining.toFixed(2));
    setPreset('full');
    setReason('');
    setNote('');
  }, [order]);

  const applyPreset = (id) => {
    setPreset(id);
    if (id === 'full') setAmount(remaining.toFixed(2));
    else if (id === 'vat') setAmount(vatPortion.toFixed(2));
    else if (id === 'custom') setAmount('');
  };
  const onAmount = (v) => { setAmount(v.replace(/[^0-9.]/g, '')); setPreset('custom'); };

  const amt = parseFloat(amount) || 0;
  const overMax = amt > remaining + 0.005;
  const reasonObj = REFUND_REASONS.find(r => r.id === reason);
  const needNote = reason === 'other';
  const noteOk = !needNote || note.trim().length > 0;
  const ready = !!order && amt > 0.005 && !overMax && !!reason && noteOk;

  const go = () => {
    if (!ready) return;
    const info = { amount: Math.round(amt * 100) / 100, reason, reasonLabel: reasonObj ? reasonObj.label : reason, note: note.trim() };
    const ord = order;
    onClose();
    if (onSubmit) onSubmit(ord, info);
  };

  React.useEffect(() => {
    if (!order) return;
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [order, onClose]);

  if (!order) return null;
  const isPartial = amt > 0 && amt < remaining - 0.005;
  const presetChip = (id, label) => {
    const on = preset === id;
    return (
      <button key={id} onClick={() => applyPreset(id)} style={{
        all: 'unset', cursor: 'pointer', padding: '8px 13px', borderRadius: 999,
        border: `1.5px solid ${on ? AT.ink : AT.rule}`, background: on ? AT.ink : AT.panel,
        color: on ? '#fff' : AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap',
      }}>{label}</button>
    );
  };
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(10,10,10,0.5)',
      backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{
        width: 512, maxWidth: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        background: AT.panel, borderRadius: AT.radius, boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
        overflow: 'hidden', animation: 'aConfirmIn .14s ease-out',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 18px', display: 'flex', gap: 14, borderBottom: `1px solid ${AT.ruleSoft}` }}>
          <span style={{ width: 44, height: 44, borderRadius: 999, flexShrink: 0, background: '#F7E4E4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="refund" size={21} color={AT.danger} /></span>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18.5, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1.2 }}>Issue a refund</div>
            <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginTop: 5, lineHeight: 1.45 }}>Correct a mistake on order <span style={{ fontFamily: AT.mono, color: AT.ink }}>#{order.ref}</span> — VAT, totals, an overcharge or anything else. The customer is repaid to their original method.</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="x" size={17} color={AT.inkSoft} /></button>
        </div>

        {/* Body (scrolls) */}
        <div style={{ padding: '18px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Money summary */}
          <div style={{ display: 'flex', gap: 0, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
            {[['Order total', fmtMoney(gross, om)], ['Already refunded', alreadyRefunded > 0 ? '−' + fmtMoney(alreadyRefunded, om) : '—'], ['Refundable now', fmtMoney(remaining, om)]].map(([l, v], i) => (
              <div key={l} style={{ flex: 1, padding: '11px 14px', borderLeft: i ? `1px solid ${AT.ruleSoft}` : 'none' }}>
                <div style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontFamily: AT.mono, fontSize: 14, fontWeight: 700, color: i === 2 ? AT.ink : AT.inkSoft, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div>
            <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.ink, marginBottom: 8 }}>Amount to refund</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
              {presetChip('full', 'Full · ' + fmtMoney(remaining, om))}
              {!rc && vatPortion > 0.005 && presetChip('vat', `VAT ${Math.round(VAT_RATE * 100)}% · ` + fmtMoney(vatPortion, om))}
              {presetChip('custom', 'Custom amount')}
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: AT.mono, fontSize: 14, color: AT.inkSoft, pointerEvents: 'none' }}>€</span>
              <input value={amount} onChange={e => onAmount(e.target.value)} inputMode="decimal" placeholder="0.00"
                style={{ ...aInputStyle, paddingLeft: 26, fontFamily: AT.mono, fontSize: 15, fontWeight: 700, borderColor: overMax ? AT.danger : AT.rule }} />
            </div>
            {overMax && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.danger, marginTop: 6 }}>That is more than the {fmtMoney(remaining, om)} still refundable on this order.</div>}
            {isPartial && !overMax && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 6 }}>Partial refund — the order stays {order.status} and {fmtMoney(remaining - amt, om)} remains refundable.</div>}
          </div>

          {/* Reason */}
          <div>
            <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.ink, marginBottom: 8 }}>Reason <span style={{ color: AT.danger }}>*</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {REFUND_REASONS.map(r => {
                const on = reason === r.id;
                return (
                  <button key={r.id} onClick={() => setReason(r.id)} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 11, padding: '10px 12px',
                    borderRadius: AT.radiusSm, border: `1.5px solid ${on ? AT.accent : AT.rule}`, background: on ? AT.accentSoft : AT.panel,
                  }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, flexShrink: 0, marginTop: 1, border: `2px solid ${on ? AT.accent : AT.rule}`, background: AT.panel, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on && <span style={{ width: 7, height: 7, borderRadius: 999, background: AT.accent }} />}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.ink }}>{r.label}</span>
                      <span style={{ display: 'block', fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 1, lineHeight: 1.4 }}>{r.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.ink, marginBottom: 6 }}>Note {needNote ? <span style={{ color: AT.danger }}>*</span> : <span style={{ fontWeight: 400, color: AT.inkSoft }}>(optional)</span>}</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder={needNote ? 'Required — explain the refund for the audit trail.' : 'Add context for the team and the audit trail (e.g. “Charged 21% VAT, customer is reverse-charge — refunding the VAT”).'}
              style={{ ...aInputStyle, height: 'auto', minHeight: 64, padding: '10px 12px', resize: 'vertical', lineHeight: 1.45 }} />
          </div>

          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '10px 12px', borderRadius: AT.radiusSm, background: '#FBF1EC' }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, flexShrink: 0, marginTop: 1, background: '#C2410C', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.display, fontWeight: 800, fontSize: 11 }}>!</span>
            <span style={{ fontFamily: AT.body, fontSize: 11.5, lineHeight: 1.45, color: '#8A3A12' }}>A refund moves real money and is logged to the change log. It can’t be undone from here.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: `1px solid ${AT.ruleSoft}` }}>
          <ABtn kind="ghost" onClick={onClose}>Cancel</ABtn>
          <ABtn kind="danger" onClick={go} disabled={!ready} style={{ background: AT.danger, color: '#fff', borderColor: AT.danger, opacity: ready ? 1 : 0.5 }}>
            {amt > 0.005 && !overMax ? `Refund ${fmtMoney(amt, om)}` : 'Refund'}
          </ABtn>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
function AEmpty({ title, sub }) {
  return (
    <APanel pad={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink, marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>{sub}</div>}
    </APanel>
  );
}

// ── Shell: dark sidebar + topbar ─────────────────────────────
const NAV_GROUPS = [
  { items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  ] },
  { label: 'Sell', items: [
    { id: 'orders', label: 'Orders', icon: 'orders' },
    { id: 'returns', label: 'Returns & warranty', icon: 'returns' },
  ] },
  { label: 'Customers', items: [
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'reviews', label: 'Reviews', icon: 'reviews' },
  ] },
  { label: 'Products', items: [
    { id: 'catalog', label: 'Catalog', icon: 'catalog' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory' },
    { id: 'brands', label: 'Brands', icon: 'brands' },
  ] },
  { label: 'Marketing', items: [
    { id: 'marketing', label: 'Marketing', icon: 'megaphone' },
    { id: 'promos', label: 'Promos & gift cards', icon: 'promos' },
  ] },
  { label: 'Reports', items: [
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'finances', label: 'Finances', icon: 'finance' },
  ] },
  { label: 'Content', items: [
    { id: 'content', label: 'Content', icon: 'content' },
  ] },
  { label: 'Admin', items: [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'devtools', label: 'Developer', icon: 'plug' },
    { id: 'help', label: 'User manual', icon: 'list' },
  ] },
];
// Flat list kept for compatibility; 'notifications' (bell) and 'activity' (account
// menu) remain routable but are intentionally absent from the sidebar.
const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

// ── Avatar (initials) ────────────────────────────────────────
function AAvatar({ name, size = 32, tone }) {
  const initials = (name || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const palette = ['#2D4BFF', '#1F8A4C', '#C2410C', '#9A6BFF', '#0A0A0A', '#E0A800'];
  const idx = (name || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length;
  const bg = tone || palette[idx];
  return (
    <span style={{ width: size, height: size, borderRadius: 999, background: bg, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.body, fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>{initials}</span>
  );
}

// ── Charts (lightweight SVG) ─────────────────────────────────
function ALineChart({ series, labels, height = 200, format }) {
  const W = 640, H = height, pad = { l: 8, r: 8, t: 16, b: 24 };
  const all = series.flatMap(s => s.data);
  const max = Math.max(...all) * 1.15 || 1;
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const x = (i, n) => pad.l + (iw * i) / (n - 1);
  const y = (v) => pad.t + ih - (ih * v) / max;
  const path = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i, data.length).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad.l} x2={W - pad.r} y1={pad.t + ih * f} y2={pad.t + ih * f} stroke={AT.ruleSoft} strokeWidth="1" />
      ))}
      {series.map((s, si) => (
        <g key={si}>
          <path d={path(s.data)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" opacity={s.faded ? 0.35 : 1} strokeDasharray={s.dashed ? '5 5' : undefined} />
          {!s.faded && s.data.map((v, i) => <circle key={i} cx={x(i, s.data.length)} cy={y(v)} r="3" fill={s.color} />)}
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i, labels.length)} y={H - 6} textAnchor="middle" fontFamily={AT.mono} fontSize="11" fill={AT.inkSoft}>{l}</text>
      ))}
    </svg>
  );
}

function ADonut({ data, size = 150, thickness = 22, centerLabel, centerSub }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2, c = size / 2, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${c} ${c})`}>
          {data.map((d, i) => {
            const len = (d.value / total) * circ;
            const el = <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={d.color} strokeWidth={thickness} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} />;
            offset += len; return el;
          })}
        </g>
        {centerLabel && <text x={c} y={c - 2} textAnchor="middle" fontFamily={AT.display} fontWeight="800" fontSize="22" fill={AT.ink}>{centerLabel}</text>}
        {centerSub && <text x={c} y={c + 16} textAnchor="middle" fontFamily={AT.body} fontSize="10.5" fill={AT.inkSoft}>{centerSub}</text>}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color }} />
            <span style={{ flex: 1, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{d.label}</span>
            <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AGauge({ pct, label, sub, size = 180 }) {
  const r = size / 2 - 14, c = size / 2;
  const circ = Math.PI * r; // half circle
  const val = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <path d={`M 14 ${c} A ${r} ${r} 0 0 1 ${size - 14} ${c}`} fill="none" stroke={AT.surfaceAlt} strokeWidth="14" strokeLinecap="round" />
        <path d={`M 14 ${c} A ${r} ${r} 0 0 1 ${size - 14} ${c}`} fill="none" stroke={AT.accent} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(circ * val) / 100} ${circ}`} />
        <text x={c} y={c - 6} textAnchor="middle" fontFamily={AT.display} fontWeight="800" fontSize="28" fill={AT.ink}>{val}%</text>
        {sub && <text x={c} y={c + 12} textAnchor="middle" fontFamily={AT.body} fontSize="11" fill={AT.inkSoft}>{sub}</text>}
      </svg>
      {label && <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginTop: 4, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

function AStackBar({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
        {segments.map((s, i) => <div key={i} style={{ width: (s.value / total) * 100 + '%', background: s.color }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />
            <span style={{ flex: 1, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{s.label}</span>
            <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Change log (per-section recent activity, shown at page bottom) ──
function AChangeLog({ audit = [], type = 'all', nav, title }) {
  const [open, setOpen] = React.useState(true);
  const types = window.AUDIT_TYPES || {};
  const scoped = (type && type !== 'all') ? audit.filter(a => a.type === type) : audit;
  const rows = scoped.slice(0, 6);
  const today = (window.nowStamp ? nowStamp() : '').slice(0, 10);
  const fmtWhen = (ts) => {
    const d = (ts || '').slice(0, 10), t = (ts || '').slice(11);
    if (d === today) return 'Today · ' + t;
    return d.slice(5).replace('-', '/') + ' · ' + t;
  };
  return (
    <section style={{ marginTop: 38, paddingTop: 24, borderTop: `1px solid ${AT.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button onClick={() => setOpen(o => !o)} style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9,
        }}>
          <span style={{ display: 'flex', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', color: AT.inkSoft }}><AIcon name="chev" size={14} /></span>
          <AIcon name="list" size={15} color={AT.inkSoft} />
          <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft }}>{title || 'Recent changes'}</span>
          <span style={{ minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999, background: AT.surfaceAlt, color: AT.inkSoft, fontFamily: AT.mono, fontSize: 10.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{scoped.length}</span>
        </button>
        <div style={{ flex: 1 }} />
        {nav && <button onClick={() => nav('activity')} style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.accent,
        }}>View full log <AIcon name="arrow" size={14} color={AT.accent} /></button>}
      </div>

      {open && (rows.length === 0 ? (
        <APanel pad={20} style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>No changes recorded in this area yet — edits you make here will appear at the bottom of the page.</APanel>
      ) : (
        <APanel style={{ overflow: 'hidden' }}>
          {rows.map((a, idx) => {
            const t = types[a.type] || { icon: 'dashboard', label: a.type };
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 16px', borderTop: idx === 0 ? 'none' : `1px solid ${AT.ruleSoft}` }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={t.icon} size={15} color={AT.ink} /></span>
                <AAvatar name={a.actor} size={24} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>{a.actor}</strong> · {a.action}{a.target ? <span style={{ color: AT.inkSoft }}> — </span> : ''}{a.target && <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.accent }}>{a.target}</span>}
                  </div>
                  {a.detail && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.detail}</div>}
                </div>
                {type === 'all' && <ABadge tone="neutral">{t.label}</ABadge>}
                <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{fmtWhen(a.ts)}</span>
              </div>
            );
          })}
        </APanel>
      ))}
    </section>
  );
}

// ── Shell helpers: header icon button + dropdown menu styles ──
const hdrIconBtn = {
  all: 'unset', cursor: 'pointer', width: 38, height: 38, borderRadius: AT.radiusSm,
  border: `1px solid ${AT.rule}`, background: AT.panel, display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
const menuLabel = {
  fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc,
  textTransform: 'uppercase', color: AT.inkSoft, padding: '8px 10px 4px',
};
const menuDivider = { height: 1, background: AT.rule, margin: '6px 4px' };
function menuItem(active) {
  return {
    all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8,
    background: active ? AT.accentSoft : 'transparent', color: active ? AT.accent : AT.ink,
    fontFamily: AT.body, fontWeight: 600, fontSize: 13,
  };
}

// ── Login screen (sign-in / sign-out flow) ───────────────────
function ALogin({ onSignIn, role = 'owner', setRole }) {
  const [email, setEmail] = React.useState('admin@shhh.lv');
  const [pw, setPw] = React.useState('password');
  const submit = (e) => { if (e) e.preventDefault(); onSignIn(); };
  return (
    <div style={{ minHeight: '100vh', background: AT.side, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: AT.body }}>
      <form onSubmit={submit} style={{ width: 384, maxWidth: '100%', background: AT.panel, borderRadius: 16, padding: '34px 30px', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 30, letterSpacing: AT.ld }}>shhh...</span>
          <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft, border: `1px solid ${AT.rule}`, padding: '2px 6px', borderRadius: 5, letterSpacing: 0.5 }}>ADMIN</span>
        </div>
        <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.inkSoft, marginBottom: 22 }}>Sign in to the back-office console.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AField label="Work email"><AInput value={email} onChange={e => setEmail(e.target.value)} type="email" autoFocus /></AField>
          <AField label="Password"><AInput value={pw} onChange={e => setPw(e.target.value)} type="password" /></AField>
          <AField label="Sign in as">
            <select value={role} onChange={e => setRole && setRole(e.target.value)} style={{ ...aInputStyle, cursor: 'pointer' }}>
              {Object.keys(ADMIN_ROLES).map(rk => <option key={rk} value={rk}>{ADMIN_ROLES[rk].label} — {ADMIN_ROLES[rk].desc}</option>)}
            </select>
          </AField>
        </div>
        <button type="submit" style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', marginTop: 22, width: '100%', textAlign: 'center', height: 46, lineHeight: '46px', borderRadius: 10, background: AT.accent, color: '#fff', fontFamily: AT.body, fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <AIcon name="login" size={17} color="#fff" /> Sign in
        </button>
        <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, textAlign: 'center', marginTop: 16 }}>Protected area · billed as NL Trading Co</div>
      </form>
    </div>
  );
}

// ── Browser-style tab strip (drag to reorder) ────────────────
function ATabBar({ tabs, activeId, splitId, split, onSelect, onClose, onNew, onToggleSplit, onReorder }) {
  const [dragId, setDragId] = React.useState(null);
  const [over, setOver] = React.useState(null); // { id, after }
  const endDrag = () => { setDragId(null); setOver(null); };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', background: AT.surfaceAlt, borderBottom: `1px solid ${AT.rule}`, padding: '0 8px', height: 42, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 2, overflowX: 'auto', flex: 1 }}>
        {tabs.map(t => {
          const isA = t.id === activeId, isB = split && t.id === splitId;
          const active = isA || isB;
          const dragging = dragId === t.id;
          const showBefore = over && over.id === t.id && !over.after && dragId && dragId !== t.id;
          const showAfter = over && over.id === t.id && over.after && dragId && dragId !== t.id;
          return (
            <div key={t.id}
              draggable
              onDragStart={(e) => { setDragId(t.id); try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.id); } catch (err) {} }}
              onDragEnd={endDrag}
              onDragOver={(e) => { if (!dragId || dragId === t.id) return; e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const after = e.clientX > r.left + r.width / 2; setOver(o => (o && o.id === t.id && o.after === after) ? o : { id: t.id, after }); }}
              onDrop={(e) => { e.preventDefault(); if (dragId && dragId !== t.id && onReorder) onReorder(dragId, t.id, over ? over.after : false); endDrag(); }}
              onMouseDown={(e) => { if (e.button === 1) { e.preventDefault(); if (tabs.length > 1) onClose(t.id); return; } onSelect(t.id); }} title={t.title} style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 0 12px', cursor: 'pointer',
              borderBottom: `2px solid ${active ? AT.accent : 'transparent'}`, background: active ? AT.panel : 'transparent',
              maxWidth: 210, minWidth: 116, boxSizing: 'border-box', opacity: dragging ? 0.45 : 1,
              boxShadow: showBefore ? `inset 2px 0 0 ${AT.accent}` : showAfter ? `inset -2px 0 0 ${AT.accent}` : 'none',
            }}>
              <AIcon name={t.icon} size={14} color={active ? AT.ink : AT.inkSoft} />
              <span style={{ flex: 1, minWidth: 0, fontFamily: AT.body, fontWeight: active ? 700 : 600, fontSize: 12.5, color: active ? AT.ink : AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
              {split && (isA || isB) && <span style={{ width: 15, height: 15, borderRadius: 4, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{isA ? 'A' : 'B'}</span>}
              {tabs.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onClose(t.id); }} title="Close tab" style={{ all: 'unset', cursor: 'pointer', width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: AT.inkSoft }}
                  onMouseEnter={e => { e.currentTarget.style.background = AT.surfaceAlt; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <AIcon name="close" size={12} color={AT.inkSoft} />
                </button>
              )}
            </div>
          );
        })}
        <button onClick={onNew} title="New tab" style={{ all: 'unset', cursor: 'pointer', width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AT.inkSoft, flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.color = AT.ink; }}
          onMouseLeave={e => { e.currentTarget.style.color = AT.inkSoft; }}>
          <AIcon name="plus" size={16} color="currentColor" />
        </button>
      </div>
      <button onClick={onToggleSplit} title={split ? 'Exit split view' : 'Split view — see two tabs side by side'} style={{
        all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0 12px', margin: '5px 0',
        borderLeft: `1px solid ${AT.rule}`, color: split ? AT.accent : AT.inkSoft, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
      }}>
        <span style={{ display: 'inline-flex', width: 16, height: 14, border: `1.6px solid ${split ? AT.accent : AT.inkSoft}`, borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1.6, background: split ? AT.accent : AT.inkSoft, transform: 'translateX(-50%)' }} />
        </span>
        {split ? 'Exit split' : 'Split'}
      </button>
    </div>
  );
}

function AdminShell({ role, setRole, current, nav, pageTitle, pageSub, actions, badges, onSignOut, scope, setScope, tabBar, fullBleed, meName, env, undo, redo, canUndo, canRedo, undoLabel, redoLabel, children }) {
  const allowed = ROLE_NAV[role] || ROLE_NAV.owner;
  const groups = NAV_GROUPS
    .map(g => ({ ...g, items: g.items.filter(i => allowed.includes(i.id)) }))
    .filter(g => g.items.length);
  scope = scope || { business: 'shhh', market: 'all' };
  setScope = setScope || (() => {});
  const biz = businessById(scope.business);
  const mkt = scope.market === 'all' ? null : marketById(scope.market);

  // Scope switcher popovers
  const [bizOpen, setBizOpen] = React.useState(false);
  const [mktOpen, setMktOpen] = React.useState(false);
  const bizRef = React.useRef(null);
  const mktRef = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => {
      if (bizRef.current && !bizRef.current.contains(e.target)) setBizOpen(false);
      if (mktRef.current && !mktRef.current.contains(e.target)) setMktOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Collapsible sidebar (persisted)
  const [collapsed, setCollapsed] = React.useState(() => { try { return JSON.parse(localStorage.getItem('shhh_admin_sidebar') || 'false'); } catch (e) { return false; } });
  React.useEffect(() => { try { localStorage.setItem('shhh_admin_sidebar', JSON.stringify(collapsed)); } catch (e) {} }, [collapsed]);

  // Account menu (top-right)
  const [acctOpen, setAcctOpen] = React.useState(false);
  const acctRef = React.useRef(null);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const helpRef = React.useRef(null);
  React.useEffect(() => {
    if (!helpOpen) return undefined;
    const onDoc = (e) => { if (helpRef.current && !helpRef.current.contains(e.target)) setHelpOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [helpOpen]);
  React.useEffect(() => {
    if (!acctOpen) return;
    const onDoc = (e) => { if (acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [acctOpen]);

  const rInfo = ADMIN_ROLES[role] || {};
  const userName = meName || rInfo.label || 'Admin';
  const userEmail = (meName ? meName.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') : (rInfo.short ? String(rInfo.short).toLowerCase() : 'admin')) + '@shhh.lv';
  const W = collapsed ? 76 : 248;
  const accountLinks = [
    { id: 'activity', label: 'Changelog', icon: 'list' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', badge: badges && badges.notifications },
    { id: 'settings', label: 'Personalization', icon: 'settings' },
  ].filter(l => allowed.includes(l.id));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: AT.app, color: AT.ink, fontFamily: AT.body }}>
      {/* Sidebar */}
      <aside style={{
        width: W, flexShrink: 0, background: AT.side, color: AT.sideInk,
        position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column',
        transition: 'width .18s ease', overflow: 'hidden',
      }}>
        <div style={{ padding: collapsed ? '20px 0 16px' : '20px 22px 16px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8 }}>
          {collapsed
            ? <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 24, letterSpacing: AT.ld }}>s…</span>
            : <>
                <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 24, letterSpacing: AT.ld }}>shhh...</span>
                <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.sideSoft, border: `1px solid ${AT.sideRule}`, padding: '2px 6px', borderRadius: 5, letterSpacing: 0.5 }}>ADMIN</span>
              </>}
        </div>
        {/* Business switcher */}
        <div ref={bizRef} style={{ position: 'relative', padding: collapsed ? '0 10px 10px' : '0 14px 12px' }}>
          <button onClick={() => { setBizOpen(o => !o); setMktOpen(false); }} title={collapsed ? biz.name : undefined} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 0' : '9px 11px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: AT.radiusSm, background: 'rgba(255,255,255,0.06)', border: `1px solid ${AT.sideRule}`,
          }}>
            <span style={{ width: 28, height: 28, borderRadius: 7, background: AT.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.display, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{biz.short}</span>
            {!collapsed && <>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.sideInk, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{biz.name}</span>
                <span style={{ display: 'block', fontFamily: AT.body, fontSize: 10.5, color: AT.sideSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{biz.tag}</span>
              </span>
              <AIcon name="chevDown" size={15} color={AT.sideSoft} />
            </>}
          </button>
          {bizOpen && (
            <div style={{ position: 'absolute', top: collapsed ? 50 : 56, left: collapsed ? 10 : 14, right: collapsed ? 'auto' : 14, width: collapsed ? 220 : 'auto', zIndex: 70, background: '#1A1A19', border: `1px solid ${AT.sideRule}`, borderRadius: AT.radiusSm, padding: 5, boxShadow: '0 18px 44px rgba(0,0,0,0.5)' }}>
              <div style={{ fontFamily: AT.body, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: AT.sideSoft, padding: '6px 9px 5px' }}>Businesses</div>
              {BUSINESSES.map(b => (
                <button key={b.id} onClick={() => { setScope({ ...scope, business: b.id }); setBizOpen(false); }} style={{
                  all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', borderRadius: 7,
                  background: b.id === scope.business ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: AT.sideInk, fontFamily: AT.body, fontWeight: 600, fontSize: 13,
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: b.id === scope.business ? AT.accent : 'rgba(255,255,255,0.12)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{b.short}</span>
                  <span style={{ flex: 1 }}>{b.name}</span>
                  {b.planned && <span style={{ fontFamily: AT.mono, fontSize: 9, color: AT.sideSoft, border: `1px solid ${AT.sideRule}`, padding: '1px 5px', borderRadius: 4 }}>SOON</span>}
                  {b.id === scope.business && <AIcon name="check" size={14} color="#fff" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: collapsed ? '6px 10px' : '8px 12px', display: 'flex', flexDirection: 'column', gap: collapsed ? 2 : 4, overflowY: 'auto', overflowX: 'hidden' }}>
          {groups.map((g, gi) => (
            <div key={g.label || 'g' + gi} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: gi === 0 ? 0 : (collapsed ? 8 : 10) }}>
              {g.label && (collapsed
                ? <div style={{ height: 1, background: AT.sideRule, margin: '4px 8px 6px' }} />
                : <div style={{ fontFamily: AT.body, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.34)', padding: '2px 12px 4px' }}>{g.label}</div>)}
              {g.items.map(it => {
                const active = current === it.id;
                return (
                  <button key={it.id} onClick={() => nav(it.id)} title={collapsed ? it.label : undefined} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    padding: collapsed ? '11px 0' : '9px 12px', justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: AT.radiusSm, position: 'relative',
                    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                    color: active ? AT.sideInk : AT.sideSoft,
                    fontFamily: AT.body, fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap',
                  }}>
                    <span style={{ position: 'relative', display: 'flex' }}>
                      <AIcon name={it.icon} size={18} color={active ? '#fff' : 'rgba(255,255,255,0.6)'} />
                      {collapsed && badges && badges[it.id] ? <span style={{ position: 'absolute', top: -4, right: -5, width: 7, height: 7, borderRadius: 999, background: AT.accent }} /> : null}
                    </span>
                    {!collapsed && it.label}
                    {!collapsed && badges && badges[it.id] ? (
                      <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{badges[it.id]}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        {/* Collapse toggle */}
        <div style={{ padding: 10, borderTop: `1px solid ${AT.sideRule}` }}>
          <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand menu' : 'Collapse menu'} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px', borderRadius: AT.radiusSm,
            background: 'rgba(255,255,255,0.06)', color: AT.sideSoft, fontFamily: AT.body, fontWeight: 600, fontSize: 13,
          }}>
            <span style={{ display: 'flex', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}><AIcon name="chev" size={16} color={AT.sideSoft} /></span>
            {!collapsed && 'Collapse menu'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: fullBleed ? '100vh' : undefined, overflow: fullBleed ? 'hidden' : undefined }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, background: 'rgba(244,244,242,0.85)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${AT.rule}`, padding: '14px 28px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <button onClick={() => setCollapsed(c => !c)} title="Toggle menu" style={hdrIconBtn}><AIcon name="menu" size={18} color={AT.ink} /></button>
          {env && env !== 'Production' && (() => {
            const tone = env === 'Staging' ? { bg: '#FFF4E0', fg: '#7A5200', bd: '#E0A800' } : { bg: '#E7F0FF', fg: '#21438C', bd: AT.accent };
            return <span title={'You are in the ' + env + ' environment'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', borderRadius: 7, background: tone.bg, border: `1px solid ${tone.bd}`, color: tone.fg, fontFamily: AT.mono, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: tone.fg }} />{env}</span>;
          })()}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageTitle}</div>
            {pageSub && <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageSub}</div>}
          </div>
          {/* Global search trigger */}
          <button onClick={() => window.__openAdminSearch && window.__openAdminSearch()} title="Search everything (⌘K)" style={{
            all: 'unset', cursor: 'pointer', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 9,
            height: 38, padding: '0 12px', minWidth: 220, maxWidth: 320, flex: '0 1 300px',
            borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.surfaceAlt,
          }}>
            <AIcon name="search" size={16} color={AT.inkSoft} />
            <span style={{ flex: 1, fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search everything…</span>
            <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft, border: `1px solid ${AT.rule}`, borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
          </button>
          <div style={{ flex: 1 }} />
          {(undo || redo) && (
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={canUndo ? undo : undefined} title={canUndo ? 'Undo: ' + (undoLabel || '') + '  (⌘Z)' : 'Nothing to undo'}
                style={{ ...hdrIconBtn, cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}>
                <AIcon name="undo" size={17} color={AT.ink} />
              </button>
              <button onClick={canRedo ? redo : undefined} title={canRedo ? 'Redo: ' + (redoLabel || '') + '  (⌘⇧Z)' : 'Nothing to redo'}
                style={{ ...hdrIconBtn, cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.4 }}>
                <AIcon name="redo" size={17} color={AT.ink} />
              </button>
            </div>
          )}
          {actions}
          {/* Market switcher */}
          <div ref={mktRef} style={{ position: 'relative' }}>
            <button onClick={() => { setMktOpen(o => !o); setBizOpen(false); }} style={{
              all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 38, padding: '0 11px', borderRadius: AT.radiusSm,
              border: `1px solid ${mkt ? AT.accent : AT.rule}`, background: mkt ? AT.accentSoft : AT.panel,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, height: 20, padding: '0 5px', borderRadius: 5, background: mkt ? AT.accent : AT.surfaceAlt, color: mkt ? '#fff' : AT.inkSoft, fontFamily: AT.mono, fontSize: 11, fontWeight: 700 }}>{mkt ? mkt.id : 'ALL'}</span>
              <span style={{ fontFamily: AT.body, fontWeight: 600, fontSize: 13, color: AT.ink }}>{mkt ? mkt.country : 'All markets'}</span>
              <AIcon name="chevDown" size={14} color={AT.inkSoft} />
            </button>
            {mktOpen && (
              <div style={{ position: 'absolute', top: 46, right: 0, zIndex: 80, width: 256, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, padding: 6, boxShadow: '0 18px 50px rgba(0,0,0,0.18)' }}>
                <div style={menuLabel}>{biz.name} · markets</div>
                <button onClick={() => { setScope({ ...scope, market: 'all' }); setMktOpen(false); }} style={menuItem(scope.market === 'all')}>
                  <span style={{ width: 26, height: 20, borderRadius: 5, background: scope.market === 'all' ? AT.accent : AT.surfaceAlt, color: scope.market === 'all' ? '#fff' : AT.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.mono, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>ALL</span>
                  All markets <span style={{ marginLeft: 'auto', fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>consolidated</span>
                </button>
                <div style={menuDivider} />
                {MARKETS.map(m => (
                  <button key={m.id} onClick={() => { setScope({ ...scope, market: m.id }); setMktOpen(false); }} style={menuItem(scope.market === m.id)}>
                    <span style={{ width: 26, height: 20, borderRadius: 5, background: scope.market === m.id ? AT.accent : AT.surfaceAlt, color: scope.market === m.id ? '#fff' : AT.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.mono, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{m.id}</span>
                    {m.country}
                    {m.status === 'planned'
                      ? <span style={{ marginLeft: 'auto', fontFamily: AT.mono, fontSize: 9, color: AT.inkSoft, border: `1px solid ${AT.rule}`, padding: '1px 5px', borderRadius: 4 }}>SOON</span>
                      : <span style={{ marginLeft: 'auto', fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{m.currency}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Report a problem */}
          <button onClick={() => window.__openBugReport && window.__openBugReport()} title="Report a problem to IT" style={hdrIconBtn}><AIcon name="bug" size={18} color={AT.ink} /></button>
          {/* Contextual help */}
          <div ref={helpRef} style={{ position: 'relative' }}>
            <button onClick={() => setHelpOpen(o => !o)} title="Help for this screen" style={{ ...hdrIconBtn, fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink, background: helpOpen ? AT.accentSoft : AT.panel, borderColor: helpOpen ? AT.accent : AT.rule }}>?</button>
            {helpOpen && (() => {
              const sh = (window.SCREEN_HELP || {})[current] || { title: pageTitle, tips: [], topic: null };
              return (
                <div style={{ position: 'absolute', top: 50, right: 0, zIndex: 80, width: 300, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, padding: 16, boxShadow: '0 18px 50px rgba(0,0,0,0.18)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <AIcon name="bolt" size={16} color={AT.accent} />
                    <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{sh.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 13 }}>
                    {(sh.tips || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: AT.accent, marginTop: 7, flexShrink: 0 }} />
                        <span style={{ fontFamily: AT.body, fontSize: 12.5, lineHeight: 1.5, color: AT.inkSoft }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setHelpOpen(false); nav('help', sh.topic ? { topic: sh.topic } : undefined); }} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: AT.radiusSm, background: AT.ink, color: '#fff', fontFamily: AT.body, fontWeight: 700, fontSize: 13 }}>
                    {sh.topic ? 'Open the full guide' : 'Open the user manual'} <AIcon name="arrow" size={14} color="#fff" />
                  </button>
                </div>
              );
            })()}
          </div>
          {/* Notifications bell */}
          {allowed.includes('notifications') && (
            <button onClick={() => nav('notifications')} title="Notifications" style={{ ...hdrIconBtn, position: 'relative' }}>
              <AIcon name="bell" size={18} color={AT.ink} />
              {badges && badges.notifications ? <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 999, background: AT.danger }} /> : null}
            </button>
          )}
          {/* Account menu */}
          <div ref={acctRef} style={{ position: 'relative' }}>
            <button onClick={() => setAcctOpen(o => !o)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '3px 6px 3px 3px', borderRadius: 999, border: `1px solid ${acctOpen ? AT.rule : 'transparent'}`, background: acctOpen ? AT.panel : 'transparent' }}>
              <AAvatar name={userName} size={34} />
              <AIcon name="chevDown" size={15} color={AT.inkSoft} />
            </button>
            {acctOpen && (
              <div style={{ position: 'absolute', top: 50, right: 0, zIndex: 80, width: 264, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, padding: 6, boxShadow: '0 18px 50px rgba(0,0,0,0.18)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px 12px' }}>
                  <AAvatar name={userName} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{userName}</div>
                    <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
                  </div>
                </div>
                <div style={menuDivider} />
                <div style={menuLabel}>Switch role · preview</div>
                {Object.keys(ADMIN_ROLES).map(rk => (
                  <button key={rk} onClick={() => setRole(rk)} style={menuItem(rk === role)}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: rk === role ? AT.accent : AT.surfaceAlt, color: rk === role ? '#fff' : AT.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.body, fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{ADMIN_ROLES[rk].short}</span>
                    {ADMIN_ROLES[rk].label}
                    {rk === role && <span style={{ marginLeft: 'auto' }}><AIcon name="check" size={14} color={AT.accent} /></span>}
                  </button>
                ))}
                {accountLinks.length > 0 && <div style={menuDivider} />}
                {accountLinks.map(l => (
                  <button key={l.id} onClick={() => { nav(l.id); setAcctOpen(false); }} style={menuItem(false)}>
                    <AIcon name={l.icon} size={16} color={AT.ink} /> {l.label}
                    {l.badge ? <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: AT.danger, color: '#fff', fontFamily: AT.mono, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{l.badge}</span> : null}
                  </button>
                ))}
                <div style={menuDivider} />
                <button onClick={() => { setAcctOpen(false); onSignOut && onSignOut(); }} style={{ ...menuItem(false), color: AT.danger }}>
                  <AIcon name="logout" size={16} color={AT.danger} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Market context bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          padding: '9px 28px', background: mkt ? AT.accentSoft : AT.panel,
          borderBottom: `1px solid ${AT.rule}`,
          fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: AT.ink, fontWeight: 600 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: AT.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.display, fontWeight: 800, fontSize: 11 }}>{biz.short}</span>
            {biz.name}
            <AIcon name="chev" size={13} color={AT.inkSoft} />
            {mkt ? mkt.country : 'All markets'}
          </span>
          <span style={{ width: 1, height: 16, background: AT.rule }} />
          {mkt ? (
            <>
              <span>Currency <strong style={{ color: AT.ink }}>{mkt.currency}</strong></span>
              <span>VAT <strong style={{ color: AT.ink }}>{(mkt.vat * 100).toFixed(mkt.vat * 100 % 1 ? 1 : 0)}%</strong></span>
              <span>Language <strong style={{ color: AT.ink }}>{mkt.lang}</strong></span>
              <span>Billed as <strong style={{ color: AT.ink }}>{mkt.entity}</strong></span>
              {mkt.status === 'planned' && <ABadge tone="warn">Not live yet</ABadge>}
            </>
          ) : (
            <span>Consolidated view · {MARKETS.filter(m => m.status === 'live').length} live markets · figures normalized to EUR</span>
          )}
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: AT.mono, fontSize: 11 }}>{MARKETS.filter(m => m.status === 'live').map(m => m.id).join(' · ')}</span>
        </div>
        {tabBar}
        {fullBleed ? (
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
        ) : (
          <main style={{ flex: 1, padding: 28, maxWidth: 1320, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  AT, AIcon, ABtn, AStatus, ABadge, APanel, AStat, ASectionTitle,
  AField, AInput, ASearch, aInputStyle, ATable, ATd, ADrawer, AToast, AEmpty,
  AdminShell, ATabBar, NAV_ITEMS, AChangeLog, ALogin,
  AAvatar, ALineChart, ADonut, AGauge, AStackBar, ASelect, AMultiSelect, AFilterReset, ADateRange,
});
