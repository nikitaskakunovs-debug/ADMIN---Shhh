/* Shhh Admin — shared UI kit: tokens, icons, buttons, cards, tables,
   form controls, overlays, charts and toasts. Everything renders inline
   styles so the kit is self-contained. */

(function () {
  const { useState, useEffect } = React;

  const T = {
    bg: '#F4F4F2', card: '#FFFFFF', ink: '#0A0A0A', sub: '#6B6B6B', faint: '#9A9A96',
    line: 'rgba(10,10,10,0.08)', lineStrong: 'rgba(10,10,10,0.14)',
    accent: '#2D4BFF', accentSoft: 'rgba(45,75,255,0.08)',
    danger: '#E5484D', dangerSoft: 'rgba(229,72,77,0.1)',
    ok: '#1A7F37', okSoft: 'rgba(26,127,55,0.1)',
    warn: '#B97A00', warnSoft: 'rgba(185,122,0,0.12)',
    mono: "'Geist Mono', ui-monospace, monospace",
    radius: 16, radiusSm: 10,
    shadow: '0 1px 2px rgba(10,10,10,0.04), 0 8px 24px rgba(10,10,10,0.05)',
    shadowPop: '0 12px 40px rgba(10,10,10,0.18)',
  };

  // ---------- icons ----------
  const PATHS = {
    home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
    orders: 'M21 8 12 3 3 8v8l9 5 9-5V8M3 8l9 5 9-5M12 13v8',
    products: 'M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM8 7V5a4 4 0 0 1 8 0v2',
    customers: 'M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19c0-1.9-1.1-3.4-2.7-3.9M17 4.3a3.5 3.5 0 0 1 0 6.4M4 19c0-1.9 1.1-3.4 2.7-3.9M7 4.3a3.5 3.5 0 0 0 0 6.4',
    discounts: 'M9 15 15 9M9.5 9.5h.01M14.5 14.5h.01M20.3 13.7 13.7 20.3a2 2 0 0 1-2.8 0l-7.2-7.2V4h9.1l7.5 7.5a1.6 1.6 0 0 1 0 2.2Z',
    reports: 'M4 20V10M10 20V4M16 20v-7M21 20H3',
    finances: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15 9.3A3.2 3.2 0 0 0 12.3 8c-1.8 0-3.3 1.8-3.3 4s1.5 4 3.3 4c1.1 0 2.1-.5 2.7-1.3M7.5 11h5M7.5 13.5h5',
    cms: 'M4 4h16v16H4zM4 9h16M9 9v11',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.6 7.6 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a7.4 7.4 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.6 7.6 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z',
    help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5A2.5 2.5 0 0 1 12 7c1.4 0 2.5 1 2.5 2.3 0 1.6-2.2 2-2.5 3.4M12 16.5h.01',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm10 3-5-5',
    plus: 'M12 5v14M5 12h14',
    x: 'M6 6l12 12M18 6 6 18',
    check: 'M4.5 12.5 10 18 19.5 6.5',
    chevronDown: 'm6 9 6 6 6-6',
    chevronRight: 'm9 6 6 6-6 6',
    arrowLeft: 'M19 12H5m6-7-7 7 7 7',
    arrowUpRight: 'M7 17 17 7M9 7h8v8',
    arrowDownRight: 'M7 7l10 10M17 9v8H9',
    dots: 'M5 12h.01M12 12h.01M19 12h.01',
    drag: 'M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 21h16',
    filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5Z',
    alert: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    bug: 'M9 9V7a3 3 0 0 1 6 0v2m-9 4H3m3 4-2.5 2.5M6 9 3.5 6.5M18 13h3m-3 4 2.5 2.5M18 9l2.5-2.5M12 20a5 5 0 0 0 5-5v-3a5 5 0 0 0-10 0v3a5 5 0 0 0 5 5Zm0 0v-9',
    terminal: 'M4 17l6-5-6-5M12 19h8',
    sparkle: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
    doc: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M9 13h6M9 17h6',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18Z',
    truck: 'M1 7h13v9H1zM14 10h4l3 3v3h-7M5.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm12 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z',
    card: 'M2 6h20v12H2zM2 10h20M5 15h4',
    copy: 'M8 8h12v12H8zM8 8V4h12v12h-4',
    refresh: 'M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4',
    book: 'M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 19.5Zm0 0A2.5 2.5 0 0 1 6.5 17H19v4H6.5A2.5 2.5 0 0 1 4 19.5Z',
  };

  function Icon({ name, size = 18, color = 'currentColor', style }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, display: 'block', ...style }}>
        <path d={PATHS[name] || PATHS.dots} />
      </svg>
    );
  }

  // ---------- buttons ----------
  function Button({ children, icon, variant = 'primary', size = 'md', onClick, disabled, style, title }) {
    const [hover, setHover] = useState(false);
    const pads = size === 'sm' ? '6px 12px' : '9px 16px';
    const base = {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: pads,
      borderRadius: 99, border: '1px solid transparent', cursor: disabled ? 'default' : 'pointer',
      fontWeight: 600, fontSize: size === 'sm' ? 13 : 14, transition: 'all .15s ease',
      opacity: disabled ? 0.45 : 1, whiteSpace: 'nowrap', userSelect: 'none',
    };
    const variants = {
      primary: { background: hover ? '#1F3AE0' : T.accent, color: '#fff' },
      ghost: { background: hover ? 'rgba(10,10,10,0.05)' : 'transparent', color: T.ink, borderColor: T.lineStrong },
      soft: { background: hover ? 'rgba(45,75,255,0.14)' : T.accentSoft, color: T.accent },
      danger: { background: hover ? '#C93A3F' : T.danger, color: '#fff' },
      subtle: { background: hover ? 'rgba(10,10,10,0.07)' : 'rgba(10,10,10,0.04)', color: T.ink },
    };
    return (
      <button title={title} disabled={disabled} onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ ...base, ...variants[variant], ...style }}>
        {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}
        {children}
      </button>
    );
  }

  function IconButton({ icon, onClick, title, size = 34, tone = 'ink', style }) {
    const [hover, setHover] = useState(false);
    const color = tone === 'danger' ? T.danger : T.ink;
    return (
      <button title={title} onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10, border: 'none', cursor: 'pointer', color,
          background: hover ? (tone === 'danger' ? T.dangerSoft : 'rgba(10,10,10,0.06)') : 'transparent',
          transition: 'background .15s ease', ...style,
        }}>
        <Icon name={icon} size={Math.round(size * 0.52)} />
      </button>
    );
  }

  // ---------- surfaces ----------
  function Card({ title, action, children, pad = 20, style }) {
    return (
      <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: T.radius, boxShadow: T.shadow, padding: pad, ...style }}>
        {(title || action) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
            {action}
          </div>
        )}
        {children}
      </div>
    );
  }

  const TONES = {
    ok: { bg: T.okSoft, fg: T.ok }, warn: { bg: T.warnSoft, fg: T.warn },
    danger: { bg: T.dangerSoft, fg: T.danger }, accent: { bg: T.accentSoft, fg: T.accent },
    neutral: { bg: 'rgba(10,10,10,0.06)', fg: T.sub },
  };
  const STATUS_TONE = {
    fulfilled: 'ok', paid: 'accent', pending: 'warn', refunded: 'danger', cancelled: 'neutral',
    active: 'ok', draft: 'neutral', archived: 'neutral', scheduled: 'accent', expired: 'neutral',
    paused: 'warn', published: 'ok', running: 'ok', finished: 'neutral',
  };

  function Badge({ children, tone = 'neutral', style }) {
    const t = TONES[tone] || TONES.neutral;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
        borderRadius: 99, background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600,
        textTransform: 'capitalize', whiteSpace: 'nowrap', ...style,
      }}>{children}</span>
    );
  }
  const StatusBadge = ({ status }) => <Badge tone={STATUS_TONE[status] || 'neutral'}>{status}</Badge>;

  function Stat({ label, value, delta, hint, spark }) {
    const up = delta != null && delta >= 0;
    return (
      <Card pad={18} style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, minHeight: 18 }}>
              {delta != null && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: up ? T.ok : T.danger, fontSize: 12.5, fontWeight: 700 }}>
                  <Icon name={up ? 'arrowUpRight' : 'arrowDownRight'} size={13} />{Math.abs(delta)}%
                </span>
              )}
              {hint && <span style={{ fontSize: 12.5, color: T.faint }}>{hint}</span>}
            </div>
          </div>
          {spark && <Sparkline values={spark} width={92} height={34} />}
        </div>
      </Card>
    );
  }

  // ---------- table ----------
  function Table({ columns, rows, onRowClick, rowKey, empty }) {
    const [hoverKey, setHoverKey] = useState(null);
    if (!rows.length) return <EmptyState title={empty || 'Nothing here yet'} />;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} style={{
                  textAlign: c.align || 'left', padding: '8px 12px', color: T.sub, fontWeight: 600,
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em',
                  borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap', width: c.width,
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const k = rowKey ? rowKey(row) : i;
              return (
                <tr key={k}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onMouseEnter={() => setHoverKey(k)} onMouseLeave={() => setHoverKey(null)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: hoverKey === k && onRowClick ? 'rgba(10,10,10,0.025)' : 'transparent',
                  }}>
                  {columns.map(c => (
                    <td key={c.key} style={{ padding: '11px 12px', borderBottom: `1px solid ${T.line}`, textAlign: c.align || 'left', whiteSpace: c.wrap ? 'normal' : 'nowrap' }}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ---------- forms ----------
  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: T.radiusSm, border: `1px solid ${T.lineStrong}`,
    background: '#fff', fontSize: 14, outline: 'none', color: T.ink,
  };
  function Input(props) { return <input {...props} style={{ ...inputStyle, ...props.style }} />; }
  function Textarea(props) { return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', ...props.style }} />; }
  function Select({ options, value, onChange, style }) {
    return (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', ...style }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  function Field({ label, children, hint }) {
    return (
      <label style={{ display: 'block', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {children}
        {hint && <div style={{ fontSize: 12, color: T.faint, marginTop: 4 }}>{hint}</div>}
      </label>
    );
  }
  function Toggle({ checked, onChange, label }) {
    return (
      <div onClick={() => onChange(!checked)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{
          width: 38, height: 22, borderRadius: 99, padding: 3, transition: 'background .15s ease',
          background: checked ? T.accent : 'rgba(10,10,10,0.18)',
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%', background: '#fff',
            transform: checked ? 'translateX(16px)' : 'none', transition: 'transform .15s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }} />
        </div>
        {label && <span style={{ fontSize: 13.5 }}>{label}</span>}
      </div>
    );
  }
  function SearchBox({ value, onChange, placeholder, style }) {
    return (
      <div style={{ position: 'relative', ...style }}>
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.faint }}>
          <Icon name="search" size={15} />
        </span>
        <input value={value} placeholder={placeholder || 'Search…'} onChange={e => onChange(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 34 }} />
      </div>
    );
  }
  function FilterChips({ options, value, onChange }) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => {
          const on = value === o.value;
          return (
            <button key={o.value} onClick={() => onChange(o.value)} style={{
              padding: '5px 13px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${on ? T.accent : T.lineStrong}`,
              background: on ? T.accentSoft : '#fff', color: on ? T.accent : T.sub,
            }}>
              {o.label}{o.count != null && <span style={{ opacity: 0.6, marginLeft: 5 }}>{o.count}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // ---------- overlays ----------
  function Modal({ title, onClose, children, width = 480, footer }) {
    useEffect(() => {
      const onKey = e => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);
    return (
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20,
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: '#fff', borderRadius: 20, width, maxWidth: '100%', maxHeight: '86vh',
          display: 'flex', flexDirection: 'column', boxShadow: T.shadowPop, animation: 'aConfirmIn .22s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 0' }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{title}</div>
            <IconButton icon="x" onClick={onClose} title="Close" />
          </div>
          <div style={{ padding: '16px 22px', overflowY: 'auto' }}>{children}</div>
          {footer && <div style={{ padding: '14px 22px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: `1px solid ${T.line}` }}>{footer}</div>}
        </div>
      </div>
    );
  }

  function Drawer({ title, subtitle, onClose, children, width = 460, footer }) {
    useEffect(() => {
      const onKey = e => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.32)', zIndex: 190 }}>
        <div onClick={e => e.stopPropagation()} style={{
          position: 'absolute', top: 10, right: 10, bottom: 10, width, maxWidth: 'calc(100vw - 20px)',
          background: '#fff', borderRadius: 20, boxShadow: T.shadowPop, display: 'flex', flexDirection: 'column',
          animation: 'aConfirmIn .22s ease',
        }}>
          <div style={{ padding: '20px 24px 12px', borderBottom: `1px solid ${T.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
              <IconButton icon="x" onClick={onClose} title="Close" />
            </div>
            {subtitle && <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <div style={{ padding: '18px 24px', overflowY: 'auto', flex: 1 }}>{children}</div>
          {footer && <div style={{ padding: '14px 24px 18px', borderTop: `1px solid ${T.line}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
        </div>
      </div>
    );
  }

  function Tabs({ tabs, value, onChange }) {
    return (
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.line}`, marginBottom: 20 }}>
        {tabs.map(t => {
          const on = value === t.value;
          return (
            <button key={t.value} onClick={() => onChange(t.value)} style={{
              padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 14, fontWeight: on ? 700 : 500, color: on ? T.ink : T.sub,
              borderBottom: `2px solid ${on ? T.accent : 'transparent'}`, marginBottom: -1,
            }}>{t.label}</button>
          );
        })}
      </div>
    );
  }

  function EmptyState({ title, hint, icon = 'sparkle', action }) {
    return (
      <div style={{ textAlign: 'center', padding: '44px 20px', color: T.sub }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: 'rgba(10,10,10,0.05)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        }}><Icon name={icon} size={22} /></div>
        <div style={{ fontWeight: 700, color: T.ink, fontSize: 15 }}>{title}</div>
        {hint && <div style={{ fontSize: 13.5, marginTop: 4, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>{hint}</div>}
        {action && <div style={{ marginTop: 14 }}>{action}</div>}
      </div>
    );
  }

  // ---------- charts (pure SVG) ----------
  function Sparkline({ values, width = 120, height = 36, color = T.accent }) {
    if (!values || values.length < 2) return null;
    const max = Math.max(...values, 1), min = Math.min(...values, 0);
    const pts = values.map((v, i) => [
      (i / (values.length - 1)) * (width - 2) + 1,
      height - 2 - ((v - min) / (max - min || 1)) * (height - 4),
    ]);
    const line = pts.map(p => p.join(',')).join(' ');
    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <polygon points={`1,${height - 1} ${line} ${width - 1},${height - 1}`} fill={color} opacity="0.08" />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  function AreaChart({ data, height = 200, color = T.accent, money }) {
    // data: [{ label, value }]
    const [hover, setHover] = useState(null);
    const W = 720, H = height, padL = 8, padB = 22, padT = 14;
    const max = Math.max(...data.map(d => d.value), 1);
    const x = i => padL + (i / (data.length - 1)) * (W - padL * 2);
    const y = v => padT + (1 - v / max) * (H - padT - padB);
    const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
    const every = Math.ceil(data.length / 7);
    return (
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}
          onMouseLeave={() => setHover(null)}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            const i = Math.round(((e.clientX - r.left) / r.width * W - padL) / (W - padL * 2) * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, i)));
          }}>
          {[0.25, 0.5, 0.75, 1].map(f => (
            <line key={f} x1={padL} x2={W - padL} y1={y(max * f)} y2={y(max * f)} stroke={T.line} strokeWidth="1" />
          ))}
          <polygon points={`${x(0)},${y(0)} ${line} ${x(data.length - 1)},${y(0)}`} fill={color} opacity="0.07" />
          <polyline points={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          {hover != null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke={T.lineStrong} strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(data[hover].value)} r="4.2" fill={color} stroke="#fff" strokeWidth="2" />
            </g>
          )}
          {data.map((d, i) => (i % every === 0 ?
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill={T.faint} fontFamily="inherit">{d.label}</text> : null))}
        </svg>
        {hover != null && (
          <div style={{
            position: 'absolute', left: `${(x(hover) / W) * 100}%`, top: 0, transform: 'translateX(-50%)',
            background: T.ink, color: '#fff', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600,
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            {data[hover].label} · {money ? AdminData.money(data[hover].value) : data[hover].value}
          </div>
        )}
      </div>
    );
  }

  function HBars({ data, money }) {
    // data: [{ name, value }]
    const max = Math.max(...data.map(d => d.value), 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(d => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{d.name}</span>
              <span style={{ color: T.sub, fontFamily: T.mono, fontSize: 12.5 }}>{money ? AdminData.money(d.value) : d.value}</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(10,10,10,0.06)' }}>
              <div style={{
                height: '100%', width: `${(d.value / max) * 100}%`, borderRadius: 99,
                background: 'linear-gradient(90deg,#6E4DF8,#2D4BFF)',
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ---------- toasts ----------
  const toastListeners = [];
  let toastSeq = 0;
  function toast(message, tone = 'ok') {
    toastListeners.forEach(fn => fn({ id: ++toastSeq, message, tone }));
  }
  function ToastHost() {
    const [items, setItems] = useState([]);
    useEffect(() => {
      const fn = t => {
        setItems(prev => [...prev, t]);
        setTimeout(() => setItems(prev => prev.filter(i => i.id !== t.id)), 3200);
      };
      toastListeners.push(fn);
      return () => toastListeners.splice(toastListeners.indexOf(fn), 1);
    }, []);
    return (
      <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {items.map(t => (
          <div key={t.id} style={{
            background: T.ink, color: '#fff', borderRadius: 99, padding: '10px 18px', fontSize: 13.5,
            fontWeight: 600, boxShadow: T.shadowPop, display: 'flex', alignItems: 'center', gap: 8,
            animation: 'aConfirmIn .2s ease',
          }}>
            <Icon name={t.tone === 'danger' ? 'alert' : 'check'} size={15}
              color={t.tone === 'danger' ? '#FF8A8E' : '#7DE0A0'} />
            {t.message}
          </div>
        ))}
      </div>
    );
  }

  function Avatar({ name, size = 32 }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#FF4FB8,#6E4DF8)', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38, fontWeight: 700,
      }}>{initials}</div>
    );
  }

  function Swatch({ color, size = 34, radius = 10 }) {
    return <div style={{ width: size, height: size, borderRadius: radius, background: color, border: '1px solid rgba(10,10,10,0.08)', flexShrink: 0 }} />;
  }

  function Kbd({ children }) {
    return (
      <span style={{
        fontFamily: T.mono, fontSize: 11, padding: '2px 6px', borderRadius: 6,
        border: `1px solid ${T.lineStrong}`, background: '#fff', color: T.sub,
      }}>{children}</span>
    );
  }

  window.AdminUI = {
    T, Icon, Button, IconButton, Card, Badge, StatusBadge, Stat, Table,
    Input, Textarea, Select, Field, Toggle, SearchBox, FilterChips,
    Modal, Drawer, Tabs, EmptyState, Sparkline, AreaChart, HBars,
    toast, ToastHost, Avatar, Swatch, Kbd,
  };
})();
