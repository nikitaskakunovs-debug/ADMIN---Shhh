// shop-returns.jsx — Return / warranty claim form, opened from a shipped order.

function ReturnFormScreen({ theme, nav }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const order = window.__shhhReturnOrder || { ref: 'SH-23901' };
  // Verification gate — prove ownership of the order before opening a claim.
  const [verified, setVerified] = React.useState(false);
  const [vRef, setVRef] = React.useState((order.ref || '').replace(/^SH-?/i, ''));
  const [vToken, setVToken] = React.useState('');
  const [vErr, setVErr] = React.useState(false);
  const EXPECTED_TOKEN = '2931'; // demo 4-digit code from the order email
  const verify = () => {
    if (('SH-' + vRef.trim().replace(/\D/g, '')) === (order.ref || '').toUpperCase() && vToken.trim() === EXPECTED_TOKEN) {
      setVerified(true); setVErr(false);
    } else { setVErr(true); }
  };
  const [kind, setKind] = React.useState('return'); // return | warranty
  const [reason, setReason] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  const [done, setDone] = React.useState(false);

  const RETURN_REASONS = [
    'Neatbilst aprakstam',
    'Nepareizs izmērs',
    'Pārdomāju (14 dienu atteikuma tiesības)',
    'Saņēmu nepareizu preci',
    'Iepakojums bojāts piegādē',
  ];
  const WARRANTY_REASONS = [
    'Nedarbojas / neieslēdzas',
    'Pārstāja uzlādēties',
    'Ražošanas defekts',
    'Motors / vibrācija nedarbojas',
    'Materiāls bojāts',
  ];
  const reasons = kind === 'return' ? RETURN_REASONS : WARRANTY_REASONS;
  const PRESETS = kind === 'return'
    ? ['Prece neatbilst tam, kas attēlots veikalā.', 'Izvēlējos nepareizu izmēru, vēlos atgriezt neatvērtu.', 'Pārdomāju pirkumu 14 dienu laikā.']
    : ['Ierīce neieslēdzas, lai gan ir pilnībā uzlādēta.', 'Pēc dažām lietošanas reizēm pārstāja vibrēt.', 'Pamanīju ražošanas defektu uz virsmas.'];

  const addPhoto = () => setPhotos(p => p.length < 4 ? [...p, '📷 foto_' + (p.length + 1) + '.jpg'] : p);
  const canSubmit = reason && desc.trim().length > 4;
  const submit = () => {
    if (!canSubmit) return;
    const claimNo = (kind === 'return' ? 'RET-' : 'WAR-') + Math.floor(Math.random() * 90000 + 10000);
    (window.__shhhClaims = window.__shhhClaims || {})[order.ref] = {
      kind, reason, desc, photos: photos.length, claimNo,
      date: new Date().toLocaleDateString('lv-LV'),
    };
    setClaimNo(claimNo);
    setDone(true);
    // Record the claim in the database (admin Returns inbox). The real
    // RET-/WAR- reference replaces the provisional one when it arrives.
    if (window.SHHH_LIVE && window.SHHH_LIVE.status !== 'fallback') {
      const firstItem = order.items && order.items[0] && (order.items[0].name || order.items[0].id);
      window.SHHH_LIVE.submitReturn({
        orderRef: order.ref || '', kind, reason, desc,
        item: firstItem || '', name: (order.details && order.details.name) || '',
        email: (order.details && order.details.email) || order.email || '',
      }).then(r => {
        if (r && r.ref) {
          setClaimNo(r.ref);
          if (window.__shhhClaims && window.__shhhClaims[order.ref]) window.__shhhClaims[order.ref].claimNo = r.ref;
          window.shhhLog && window.shhhLog('[shhh] return claim recorded as ' + r.ref);
        }
      }).catch(e => window.shhhWarn && window.shhhWarn('[shhh] return DB submit failed', e));
    }
  };
  const [claimNo, setClaimNo] = React.useState('');

  if (done) {
    return (
      <div style={{ paddingBottom: 40 }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => { window.__shhhLookupRef = order.ref; nav('content', { key: 'order-lookup' }); }} style={{ all: 'unset', cursor: 'pointer', fontSize: 20, color: theme.ink }}>‹</button>
          <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>Pieteikums nosūtīts</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, margin: '12px auto 16px', background: '#1F8A4C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✓</div>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 24, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 8 }}>Paldies!</div>
          <p style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, maxWidth: 320, margin: '0 auto 8px' }}>
            Tavs {kind === 'return' ? 'atgriešanas' : 'garantijas'} pieteikums pasūtījumam <strong style={{ color: theme.ink }}>#{order.ref}</strong> ir saņemts. Atbildēsim uz e-pastu 1 darba dienas laikā ar bezmaksas atgriešanas uzlīmi un norādījumiem.
          </p>
          <div style={{ fontFamily: theme.mono, fontSize: 12, color: theme.inkSoft, marginTop: 12 }}>Pieteikuma nr. {claimNo}</div>
          <div style={{ padding: '24px 0 0' }}>
            <PrimaryButton theme={theme} onClick={() => { window.__shhhLookupRef = order.ref; nav('content', { key: 'order-lookup' }); }}>Atpakaļ uz pasūtījumu</PrimaryButton>
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
        <button onClick={() => { window.__shhhLookupRef = order.ref; nav('content', { key: 'order-lookup' }); }} style={{ all: 'unset', cursor: 'pointer', fontSize: 22, color: theme.ink }}>‹</button>
        <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>Atgriešana / garantija</span>
      </div>

      <div style={{ padding: '0 20px' }}>
        {!verified ? (
          <div>
            <div style={{
              padding: 14, borderRadius: theme.radius, background: theme.surfaceAlt,
              marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.5 }}>
                Lai novērstu krāpniecību, pieteikumu var iesniegt tikai pasūtījuma īpašnieks. Ievadi pasūtījuma numuru un slepeno kodu no apstiprinājuma e-pasta.
              </div>
            </div>
            <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, borderRadius: theme.radius, padding: 14 }}>
              <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8 }}>Pasūtījuma numurs</div>
              <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${theme.rule}`, borderRadius: theme.radiusSm, background: theme.bg, marginBottom: 12, overflow: 'hidden' }}>
                <span style={{ padding: '12px 0 12px 12px', fontFamily: theme.mono, fontSize: 14, fontWeight: 700, color: theme.inkSoft }}>SH-</span>
                <input value={vRef} onChange={e => setVRef(e.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" placeholder="23901" style={{
                  flex: 1, boxSizing: 'border-box', padding: '12px 12px 12px 4px',
                  border: 'none', fontFamily: theme.mono, fontSize: 14, color: theme.ink, background: 'transparent', outline: 'none',
              }} />
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8 }}>🔑 4 ciparu kods <span style={{ color: theme.accent }}>*</span></div>
              <input value={vToken} onChange={e => setVToken(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric" maxLength={4} placeholder="1234" style={{
                width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: theme.radiusSm,
                border: `1.5px solid ${vErr ? '#E0282E' : theme.rule}`,
                fontFamily: theme.mono, fontSize: 15, color: theme.ink, background: theme.bg, outline: 'none',
              }} />
              {vErr && <div style={{ fontFamily: theme.body, fontSize: 12, color: '#E0282E', marginTop: 8 }}>Nepareizs numurs vai kods. Pārbaudi apstiprinājuma e-pastu.</div>}
              <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
                💡 Demo kods: <strong style={{ color: theme.ink }}>2931</strong>
              </div>
            </div>
            <PrimaryButton theme={theme} full onClick={verify} style={{ marginTop: 14 }}>
              Turpināt
            </PrimaryButton>
            <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
              🔁 Atmaksa vienmēr tiek veikta tikai uz sākotnējo maksājuma metodi — nekad uz citu kontu.
            </div>
          </div>
        ) : (
        <div>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginBottom: 16 }}>
          Pasūtījums <strong style={{ color: theme.ink }}>#{order.ref}</strong> · ✓ apstiprināts
        </div>

        {/* Kind toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['return', '↩︎ Atgriešana'], ['warranty', '🛡 Garantija']].map(([id, l]) => (
            <button key={id} onClick={() => { setKind(id); setReason(''); }} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '11px 0',
              borderRadius: theme.radiusPill,
              background: kind === id ? theme.ink : theme.surface,
              color: kind === id ? theme.bg : theme.ink,
              border: `1.5px solid ${kind === id ? theme.ink : theme.rule}`,
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
            }}>{l}</button>
          ))}
        </div>

        {/* Reason */}
        <div style={card}>
          <div style={label}>Iemesls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reasons.map(r => (
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

        {/* Description with presets */}
        <div style={card}>
          <div style={label}>Apraksts</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {PRESETS.map(p => (
              <button key={p} onClick={() => setDesc(p)} style={{
                all: 'unset', cursor: 'pointer', padding: '6px 10px', borderRadius: 999,
                background: theme.surfaceAlt, fontFamily: theme.body, fontSize: 11, color: theme.ink,
              }}>{p.length > 32 ? p.slice(0, 30) + '…' : p}</button>
            ))}
          </div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
            placeholder="Apraksti, kas notika…" style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical',
              padding: 12, borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
              fontFamily: theme.body, fontSize: 14, color: theme.ink, background: theme.bg, outline: 'none',
            }} />
        </div>

        {/* Photos */}
        <div style={card}>
          <div style={label}>Pievieno fotoattēlus <span style={{ textTransform: 'none', fontWeight: 400 }}>(neobligāti)</span></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {photos.map((p, i) => (
              <div key={i} style={{ width: 64, height: 64, borderRadius: theme.radiusSm, background: theme.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative' }}>
                🖼
                <button onClick={() => setPhotos(ph => ph.filter((_, j) => j !== i))} style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 999, background: theme.ink, color: theme.bg, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ))}
            {photos.length < 4 && (
              <button onClick={addPhoto} style={{
                all: 'unset', cursor: 'pointer', width: 64, height: 64, borderRadius: theme.radiusSm,
                border: `1.5px dashed ${theme.rule}`, color: theme.inkSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2,
              }}>
                <span style={{ fontSize: 20 }}>＋</span>
                <span style={{ fontFamily: theme.body, fontSize: 9 }}>Foto</span>
              </button>
            )}
          </div>
        </div>

        <PrimaryButton theme={theme} full onClick={submit}
          style={{ opacity: canSubmit ? 1 : 0.45, marginTop: 4 }}>
          Nosūtīt pieteikumu
        </PrimaryButton>
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
          Bezmaksas atgriešana 14 dienu laikā · atmaksa 5 darba dienu laikā pēc preces saņemšanas.
        </div>
        </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ReturnFormScreen });
