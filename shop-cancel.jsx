// shop-cancel.jsx — cancel-order reason page + cancellation confirmation.

function CancelOrderScreen({ theme, nav }) {
  const order = window.__shhhCancelOrder || { ref: 'SH-23847', total: 0 };
  const [reason, setReason] = React.useState('');
  const [note, setNote] = React.useState('');
  const [done, setDone] = React.useState(false);

  const REASONS = [
    'Pārdomāju pirkumu',
    'Atradu lētāk citur',
    'Izvēlējos nepareizu preci',
    'Maksājums neizdevās',
    'Piegāde aizņem pārāk ilgu laiku',
    'Cits iemesls',
  ];

  const back = () => { window.__shhhLookupRef = order.ref; nav('content', { key: 'order-lookup' }); };

  if (done) {
    (window.__shhhCancelledRefs = window.__shhhCancelledRefs || {})[order.ref] = true;
    return (
      <div style={{ paddingBottom: 40 }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>Pasūtījums atcelts</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, margin: '12px auto 16px', background: '#B3261E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>✕</div>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 24, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 8 }}>Pasūtījums atcelts</div>
          <p style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, maxWidth: 320, margin: '0 auto 8px' }}>
            Pasūtījums <strong style={{ color: theme.ink }}>#{order.ref}</strong> ir veiksmīgi atcelts. {order.paid ? 'Atmaksu' : 'Ja maksājums bija veikts, atmaksu'} uz sākotnējo maksājuma metodi saņemsi 5 darba dienu laikā.
          </p>
          <div style={{ padding: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton theme={theme} onClick={back}>Atpakaļ uz Mani pasūtījumi</PrimaryButton>
            <GhostButton theme={theme} onClick={() => nav('category', {})}>Turpināt iepirkties 🍒</GhostButton>
          </div>
        </div>
      </div>
    );
  }

  const card = { background: theme.surface, border: `1px solid ${theme.rule}`, borderRadius: theme.radius, padding: 14, marginBottom: 14 };
  const label = { fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10 };

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={back} style={{ all: 'unset', cursor: 'pointer', fontSize: 22, color: theme.ink }}>‹</button>
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>Atcelt pasūtījumu</span>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginBottom: 16 }}>
          Pasūtījums <strong style={{ color: theme.ink }}>#{order.ref}</strong>{order.total ? ' · €' + order.total.toFixed(2) : ''}
        </div>

        <div style={card}>
          <div style={label}>Atcelšanas iemesls <span style={{ color: theme.accent }}>*</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REASONS.map(r => (
              <button key={r} onClick={() => setReason(r)} style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: theme.radiusSm,
                background: reason === r ? theme.surfaceAlt : 'transparent',
                border: `1.5px solid ${reason === r ? theme.ink : theme.rule}`,
              }}>
                <span style={{ width: 18, height: 18, borderRadius: 999, flexShrink: 0, border: `2px solid ${reason === r ? theme.ink : theme.rule}`, background: reason === r ? theme.ink : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {reason === r && <span style={{ width: 7, height: 7, borderRadius: 999, background: theme.bg }} />}
                </span>
                <span style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink }}>{r}</span>
              </button>
            ))}
          </div>
        </div>

        {reason === 'Cits iemesls' && (
          <div style={card}>
            <div style={label}>Pastāsti vairāk</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Apraksti iemeslu…" style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical',
                padding: 12, borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
                fontFamily: theme.body, fontSize: 14, color: theme.ink, background: theme.bg, outline: 'none',
              }} />
          </div>
        )}

        <PrimaryButton theme={theme} full onClick={() => reason && setDone(true)}
          style={{ opacity: reason ? 1 : 0.45, marginTop: 4 }}>
          Apstiprināt atcelšanu
        </PrimaryButton>
        <GhostButton theme={theme} full onClick={back} style={{ marginTop: 10 }}>
          Paturēt pasūtījumu
        </GhostButton>
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          🔁 Ja maksājums bija veikts, atmaksa tiks veikta tikai uz sākotnējo maksājuma metodi.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CancelOrderScreen });
