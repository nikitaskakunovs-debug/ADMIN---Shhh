// admin-report.jsx — frictionless "Report a problem" tool. Auto-captures the
// current screen, role, market scope, browser, viewport, app version and the
// last few console errors so IT gets actionable context without the user typing it.

// ── Background console-error capture (ring buffer) ───────────
(function installErrorCapture() {
  if (window.__bugLogInstalled) return;
  window.__bugLogInstalled = true;
  window.__bugLog = window.__bugLog || [];
  const push = (entry) => { window.__bugLog.push(entry); if (window.__bugLog.length > 12) window.__bugLog.shift(); };
  window.addEventListener('error', (e) => push({ ts: Date.now(), kind: 'error', msg: (e.message || 'Error') + (e.filename ? ' @ ' + String(e.filename).split('/').pop() + ':' + e.lineno : '') }));
  window.addEventListener('unhandledrejection', (e) => push({ ts: Date.now(), kind: 'promise', msg: 'Unhandled rejection: ' + ((e.reason && (e.reason.message || e.reason)) || 'unknown') }));
})();

const BUG_KEY = 'shhh_admin_bugs_v3';
const APP_VERSION = 'v15.16';
const BUG_STATUS = {
  open: { label: 'Open', tone: 'warn', step: 'Received by IT' },
  in_progress: { label: 'In progress', tone: 'blue', step: 'IT is working on it' },
  fixed: { label: 'Fixed', tone: 'ok', step: 'Resolved & deployed' },
  wontfix: { label: 'Closed', tone: 'neutral', step: 'Closed' },
};
function saveBugs(list) { try { localStorage.setItem(BUG_KEY, JSON.stringify(list)); } catch (e) {} }
// Seed a couple of example tickets so status timeline + "fixed" notification are visible.
function seedBugs() {
  return [
    { id: 'BUG-10231', ts: '2026-06-02 11:05', status: 'fixed', notified: false, severity: 'high', category: 'visual',
      reporter: 'Marta Liepa', desc: 'Checkout button overlaps the price on small screens.', steps: '',
      resolvedAt: '2026-06-03 14:20', resolution: 'Fixed in v15.14 — button now wraps below the price under 380px.',
      statusHistory: [{ status: 'open', ts: '2026-06-02 11:05' }, { status: 'in_progress', ts: '2026-06-02 15:40' }, { status: 'fixed', ts: '2026-06-03 14:20' }],
      thread: [
        { id: 't1', from: 'it', author: 'IT · Roberts', ts: '2026-06-02 15:42', body: 'Thanks for flagging — which phone model were you using?', images: [] },
        { id: 't2', from: 'user', author: 'Marta Liepa', ts: '2026-06-02 16:10', body: 'iPhone 13 mini, Safari.', images: [] },
        { id: 't3', from: 'it', author: 'IT · Roberts', ts: '2026-06-03 14:21', body: 'Reproduced and fixed — it’s live now. Thanks!', images: [] },
      ],
      diag: { screen: 'Orders', role: 'Support', business: 'shhh', market: 'LV', viewport: '375×812', version: 'v15.13', errors: [] }, shots: [] },
    { id: 'BUG-10228', ts: '2026-06-01 09:30', status: 'in_progress', notified: true, severity: 'normal', category: 'data',
      reporter: 'Jānis Krūmiņš', desc: 'Stock count looks wrong right after a refund is approved.', steps: '1. Approve a refund\n2. Open Inventory',
      statusHistory: [{ status: 'open', ts: '2026-06-01 09:30' }, { status: 'in_progress', ts: '2026-06-02 10:10' }],
      thread: [
        { id: 't1', from: 'it', author: 'IT · Roberts', ts: '2026-06-02 10:12', body: 'Looking into this. Which market were you in, and was it a full or partial refund?', images: [] },
      ],
      diag: { screen: 'Inventory', role: 'Fulfilment', business: 'shhh', market: 'All markets', viewport: '1440×900', version: 'v15.15', errors: [] }, shots: [] },
  ];
}
function loadBugs() {
  try { const v = JSON.parse(localStorage.getItem(BUG_KEY) || 'null'); if (Array.isArray(v)) return v; } catch (e) {}
  const s = seedBugs(); saveBugs(s); return s;
}

function BugReporter({ ctx, screenLabel, scope, role }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState('new'); // new | list
  const [desc, setDesc] = React.useState('');
  const [steps, setSteps] = React.useState('');
  const [severity, setSeverity] = React.useState('normal');
  const [category, setCategory] = React.useState('bug');
  const [shots, setShots] = React.useState([]);
  const [bugs, setBugs] = React.useState(loadBugs);
  const [selId, setSelId] = React.useState(null); // open ticket detail (chat)
  const [chatText, setChatText] = React.useState('');
  const chatScroll = React.useRef(null);
  const fileRef = React.useRef(null);
  const chatFileRef = React.useRef(null);

  React.useEffect(() => { window.__openBugReport = () => setOpen(true); return () => { delete window.__openBugReport; }; }, []);
  // Notify the reporter when any of their reports has been fixed (once).
  React.useEffect(() => {
    const list = loadBugs();
    const unseen = list.filter(b => b.status === 'fixed' && !b.notified);
    if (unseen.length) {
      const t = setTimeout(() => {
        ctx && ctx.toast && ctx.toast(unseen.length === 1 ? ('✓ Your report ' + unseen[0].id + ' was fixed') : ('✓ ' + unseen.length + ' of your reports were fixed'));
        const upd = list.map(b => b.status === 'fixed' ? { ...b, notified: true } : b);
        saveBugs(upd); setBugs(upd); window.__bugRefresh && window.__bugRefresh();
      }, 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);
  React.useEffect(() => { if (open) { setView('new'); setDesc(''); setSteps(''); setSeverity('normal'); setCategory('bug'); setShots([]); setSelId(null); setChatText(''); setBugs(loadBugs()); } }, [open]);

  // Send a chat message (from the user) on a ticket; persists + appends to thread.
  const sendChat = (imgs) => {
    if (!chatText.trim() && (!imgs || !imgs.length)) return;
    const ts = (window.nowStamp ? nowStamp() : new Date().toISOString().slice(0, 16).replace('T', ' '));
    const msg = { id: 'c' + Date.now(), from: 'user', author: (ctx && ctx.emailSettings && ctx.emailSettings.fromName) || 'You', ts, body: chatText.trim(), images: imgs || [] };
    const next = loadBugs().map(b => b.id === selId ? { ...b, thread: [...(b.thread || []), msg] } : b);
    saveBugs(next); setBugs(next); setChatText('');
    if (ctx && ctx.log) ctx.log('settings', 'Replied to IT', selId, (msg.body || '').slice(0, 60));
    setTimeout(() => { const c = chatScroll.current; if (c) c.scrollTop = c.scrollHeight; }, 30);
  };
  const onChatFile = (e) => {
    const imgs = [];
    const files = Array.from(e.target.files || []);
    let pending = files.length;
    if (!pending) return;
    files.forEach(f => { const rd = new FileReader(); rd.onload = () => { imgs.push({ url: rd.result, name: f.name, type: (f.type || '').startsWith('video') ? 'video' : 'image' }); if (--pending === 0) sendChat(imgs); }; rd.readAsDataURL(f); });
    e.target.value = '';
  };

  // Auto-captured diagnostics — what IT will receive.
  const diag = React.useMemo(() => {
    const mkt = scope && scope.market && scope.market !== 'all' ? scope.market : 'All markets';
    return {
      screen: screenLabel || '—',
      role: ((window.ADMIN_ROLES || {})[role] || {}).label || role || '—',
      business: (scope && scope.business) || '—',
      market: mkt,
      viewport: (typeof window !== 'undefined' ? window.innerWidth + '×' + window.innerHeight : '—'),
      ua: (navigator.userAgent || '').replace(/ \(.*?\)/, ''),
      version: APP_VERSION,
      when: (window.nowStamp ? nowStamp() : new Date().toISOString().slice(0, 16).replace('T', ' ')),
      errors: (window.__bugLog || []).slice(-5).map(e => e.msg),
    };
  }, [open, screenLabel, scope, role]);

  const onPick = (e) => {
    Array.from(e.target.files || []).forEach(f => { const rd = new FileReader(); rd.onload = () => setShots(s => [...s, { url: rd.result, name: f.name, type: (f.type || '').startsWith('video') ? 'video' : 'image' }]); rd.readAsDataURL(f); });
    e.target.value = '';
  };
  const submit = () => {
    if (!desc.trim()) { ctx && ctx.toast && ctx.toast('Add a short description first'); return; }
    const ticket = {
      id: 'BUG-' + String(Date.now()).slice(-5), ts: diag.when, status: 'open', notified: true,
      desc: desc.trim(), steps: steps.trim(), severity, category,
      reporter: (ctx && ctx.emailSettings && ctx.emailSettings.fromName) || diag.role,
      statusHistory: [{ status: 'open', ts: diag.when }],
      thread: [],
      diag, shots,
    };
    const next = [ticket, ...loadBugs()];
    saveBugs(next); setBugs(next); window.__bugRefresh && window.__bugRefresh();
    if (ctx && ctx.log) ctx.log('settings', 'Reported a problem', ticket.id, desc.trim().slice(0, 60));
    ctx && ctx.toast && ctx.toast('Sent to IT · ' + ticket.id + ' · you’ll be notified when it’s fixed');
    setView('list'); setDesc(''); setSteps(''); setShots([]);
  };

  React.useEffect(() => { if (selId) { setChatText(''); setTimeout(() => { const c = chatScroll.current; if (c) c.scrollTop = c.scrollHeight; }, 40); } }, [selId]);
  const chatBubble = (m) => {
    const mine = m.from === 'user';
    return (
      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 4px' }}>
          <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: mine ? AT.ink : '#21438C' }}>{m.author}</span>
          <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft }}>{m.ts}</span>
        </div>
        <div style={{ maxWidth: '82%', background: mine ? AT.accent : AT.panel, color: mine ? '#fff' : AT.ink, border: mine ? 'none' : `1px solid ${AT.rule}`, borderRadius: 13, borderTopRightRadius: mine ? 4 : 13, borderTopLeftRadius: mine ? 13 : 4, padding: '9px 12px' }}>
          {m.body && <div style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.body}</div>}
          {(m.images || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: m.body ? 8 : 0 }}>
              {m.images.map((s, i) => s.type === 'video'
                ? <video key={i} src={s.url} controls style={{ width: 120, height: 88, objectFit: 'cover', borderRadius: 7, background: '#000' }} />
                : <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}><img src={s.url} alt="" style={{ width: 120, height: 88, objectFit: 'cover', borderRadius: 7 }} /></a>)}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!open) return null;
  const sevTone = { low: 'neutral', normal: 'blue', high: 'warn', blocker: 'danger' };
  const catLabel = { bug: 'Bug', visual: 'Visual glitch', data: 'Wrong data', perf: 'Slow / freezing', idea: 'Suggestion' };

  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }} style={{
      position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(20,20,19,0.5)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '8vh 20px 20px',
    }}>
      <div style={{ width: 560, maxWidth: '100%', maxHeight: '84vh', background: AT.panel, borderRadius: 16, boxShadow: '0 30px 90px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 20px', borderBottom: `1px solid ${AT.rule}` }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: AT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="bug" size={18} color="#fff" /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink }}>Report a problem</div>
            <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>Goes straight to IT with the context already attached.</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="close" size={16} color={AT.inkSoft} /></button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 16px 0' }}>
          {[['new', 'New report'], ['list', 'My reports' + (bugs.length ? ' (' + bugs.length + ')' : '')]].map(([id, l]) => (
            <button key={id} onClick={() => setView(id)} style={{ all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 8, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, background: view === id ? AT.surfaceAlt : 'transparent', color: view === id ? AT.ink : AT.inkSoft }}>{l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {view === 'new' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={labelStyle}>What went wrong?</div>
                <textarea autoFocus value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the problem in a sentence or two…" style={{ ...aInputStyle, height: 'auto', minHeight: 70, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <div style={labelStyle}>Type</div>
                  <ASelect value={category} onChange={setCategory} options={Object.keys(catLabel).map(k => ({ value: k, label: catLabel[k] }))} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <div style={labelStyle}>Severity</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[['low', 'Low'], ['normal', 'Normal'], ['high', 'High'], ['blocker', 'Blocker']].map(([v, l]) => (
                      <button key={v} onClick={() => setSeverity(v)} style={{ all: 'unset', cursor: 'pointer', padding: '7px 12px', borderRadius: 999, fontFamily: AT.body, fontWeight: 600, fontSize: 12, border: `1px solid ${severity === v ? AT.ink : AT.rule}`, background: severity === v ? AT.ink : AT.panel, color: severity === v ? '#fff' : AT.inkSoft }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div style={labelStyle}>Steps to reproduce <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: AT.inkSoft }}>(optional)</span></div>
                <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={2} placeholder={'1. Open…\n2. Click…\n3. See…'} style={{ ...aInputStyle, height: 'auto', minHeight: 56, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }} />
              </div>
              <div>
                <div style={labelStyle}>Screenshots / video <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: AT.inkSoft }}>(optional)</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={onPick} style={{ display: 'none' }} />
                  <button onClick={() => fileRef.current && fileRef.current.click()} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, color: AT.ink }}><AIcon name="paperclip" size={15} color={AT.inkSoft} /> Attach image / video</button>
                  {shots.map((s, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${AT.rule}`, lineHeight: 0, width: 52, height: 52 }}>
                      {s.type === 'video'
                        ? <video src={s.url} style={{ width: 52, height: 52, objectFit: 'cover' }} muted />
                        : <img src={s.url} alt="" style={{ width: 52, height: 52, objectFit: 'cover' }} />}
                      {s.type === 'video' && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}><span style={{ width: 18, height: 18, borderRadius: 999, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</span></span>}
                      <button onClick={() => setShots(p => p.filter((_, k) => k !== i))} style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 1, right: 1, width: 16, height: 16, borderRadius: 999, background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="close" size={10} color="#fff" /></button>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft, marginTop: 6 }}>A short screen recording helps IT reproduce the issue fastest.</div>
              </div>

              {/* Auto-captured diagnostics */}
              <div style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: AT.surfaceAlt }}>
                  <AIcon name="bolt" size={14} color={AT.accent} />
                  <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 12, color: AT.ink }}>Attached automatically</span>
                  <span style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>— so you don’t have to explain it</span>
                </div>
                <div style={{ padding: '11px 13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 14px' }}>
                  {[['Screen', diag.screen], ['Role', diag.role], ['Business', diag.business], ['Market', diag.market], ['Viewport', diag.viewport], ['Version', diag.version]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 7, fontFamily: AT.body, fontSize: 12 }}><span style={{ color: AT.inkSoft, minWidth: 64 }}>{k}</span><span style={{ color: AT.ink, fontWeight: 600 }}>{v}</span></div>
                  ))}
                </div>
                {diag.errors.length > 0 && (
                  <div style={{ padding: '0 13px 12px' }}>
                    <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.danger, marginBottom: 5 }}>⚠ {diag.errors.length} recent console error{diag.errors.length > 1 ? 's' : ''} captured</div>
                    <pre style={{ margin: 0, maxHeight: 90, overflow: 'auto', background: '#1A1A19', color: '#FFB4B4', borderRadius: 7, padding: 10, fontFamily: AT.mono, fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{diag.errors.join('\n')}</pre>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ABtn kind="primary" onClick={submit}><AIcon name="send" size={15} /> Send to IT</ABtn>
                <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>Routed to the IT queue with all the context above.</span>
              </div>
            </div>
          ) : selId ? (() => {
            const b = bugs.find(x => x.id === selId) || {};
            const sm = BUG_STATUS[b.status] || BUG_STATUS.open;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <button onClick={() => setSelId(null)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, color: AT.inkSoft, marginBottom: 10 }}><AIcon name="chev" size={14} color={AT.inkSoft} /> All reports</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontFamily: AT.mono, fontSize: 12, fontWeight: 700, color: AT.accent }}>{b.id}</span>
                  <ABadge tone={sevTone[b.severity] || 'neutral'}>{b.severity}</ABadge>
                  <ABadge tone={sm.tone}>{sm.label}</ABadge>
                </div>
                <div style={{ fontFamily: AT.body, fontSize: 14, fontWeight: 600, color: AT.ink, lineHeight: 1.5 }}>{b.desc}</div>
                {b.status === 'fixed' && b.resolution && <div style={{ fontFamily: AT.body, fontSize: 12, color: '#1F6B3C', background: '#E7F4EC', border: '1px solid #B7E0C6', borderRadius: 8, padding: '8px 11px', marginTop: 8 }}>✓ Fixed{b.resolvedAt ? ' on ' + b.resolvedAt : ''} — {b.resolution}</div>}
                <div ref={chatScroll} style={{ flex: 1, minHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 2px', marginTop: 12, background: AT.surfaceAlt, borderRadius: AT.radiusSm }}>
                  <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>Chat with IT · {(b.thread || []).length} messages</div>
                  {(b.thread || []).length === 0 && <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, padding: '8px 12px' }}>No messages yet. IT will reply here if they have questions.</div>}
                  {(b.thread || []).map(m => chatBubble(m))}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
                  <input ref={chatFileRef} type="file" accept="image/*,video/*" multiple onChange={onChatFile} style={{ display: 'none' }} />
                  <button onClick={() => chatFileRef.current && chatFileRef.current.click()} title="Attach image / video" style={{ all: 'unset', cursor: 'pointer', width: 40, height: 40, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="paperclip" size={16} color={AT.inkSoft} /></button>
                  <textarea value={chatText} onChange={e => setChatText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendChat(); } }} rows={1} placeholder="Reply to IT… (⌘↵ to send)" style={{ flex: 1, resize: 'none', minHeight: 40, maxHeight: 120, padding: '10px 13px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontSize: 13.5, color: AT.ink, outline: 'none', lineHeight: 1.4, boxSizing: 'border-box' }} />
                  <button onClick={() => sendChat()} disabled={!chatText.trim()} style={{ all: 'unset', cursor: chatText.trim() ? 'pointer' : 'not-allowed', height: 40, padding: '0 16px', borderRadius: AT.radiusSm, background: chatText.trim() ? AT.accent : AT.surfaceAlt, color: chatText.trim() ? '#fff' : AT.inkSoft, display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: AT.body, fontWeight: 700, fontSize: 13, flexShrink: 0 }}><AIcon name="send" size={15} color={chatText.trim() ? '#fff' : AT.inkSoft} /> Send</button>
                </div>
              </div>
            );
          })() : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bugs.length === 0 ? (
                <AEmpty title="No reports yet" sub="Problems you send to IT will appear here so you can track them." />
              ) : bugs.map(b => {
                const sm = BUG_STATUS[b.status] || BUG_STATUS.open;
                const tlen = (b.thread || []).length;
                const itWaiting = tlen && b.thread[tlen - 1].from === 'it';
                return (
                <div key={b.id} onClick={() => setSelId(b.id)} style={{ border: `1px solid ${itWaiting ? AT.accent : AT.rule}`, borderRadius: AT.radiusSm, padding: '12px 14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: AT.mono, fontSize: 12, fontWeight: 700, color: AT.accent }}>{b.id}</span>
                    <ABadge tone={sevTone[b.severity] || 'neutral'}>{b.severity}</ABadge>
                    <ABadge tone="neutral">{catLabel[b.category] || b.category}</ABadge>
                    <ABadge tone={sm.tone}>{sm.label}</ABadge>
                    {tlen ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontSize: 11.5, fontWeight: itWaiting ? 700 : 500, color: itWaiting ? AT.accent : AT.inkSoft }}><AIcon name="chat" size={13} color={itWaiting ? AT.accent : AT.inkSoft} />{tlen}{itWaiting ? <span style={{ width: 7, height: 7, borderRadius: 999, background: AT.accent }} /> : null}</span> : null}
                    <div style={{ flex: 1 }} />
                    <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{b.ts}</span>
                  </div>
                  <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, lineHeight: 1.5 }}>{b.desc}</div>
                  {itWaiting ? <div style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.accent, marginTop: 6 }}>IT asked a question — tap to reply</div> : null}

                  {/* Fixed banner with resolution + when */}
                  {b.status === 'fixed' && (
                    <div style={{ display: 'flex', gap: 9, marginTop: 9, padding: '9px 12px', borderRadius: 8, background: '#E7F4EC', border: '1px solid #B7E0C6' }}>
                      <AIcon name="check" size={15} color="#1F8A4C" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: '#1F6B3C' }}>Fixed{b.resolvedAt ? ' on ' + b.resolvedAt : ''}</div>
                        {b.resolution && <div style={{ fontFamily: AT.body, fontSize: 12, color: '#2B5C3E', marginTop: 2, lineHeight: 1.5 }}>{b.resolution}</div>}
                      </div>
                    </div>
                  )}

                  {/* Status timeline */}
                  {(b.statusHistory || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 10 }}>
                      {b.statusHistory.map((h, i) => {
                        const hm = BUG_STATUS[h.status] || {};
                        const done = true;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 999, background: h.status === 'fixed' ? '#1F8A4C' : h.status === 'in_progress' ? AT.accent : AT.inkSoft, flexShrink: 0 }} />
                            <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.ink, fontWeight: 600 }}>{hm.step || h.status}</span>
                            <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{h.ts}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Attached media */}
                  {(b.shots || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                      {b.shots.map((s, i) => s.type === 'video'
                        ? <video key={i} src={s.url} controls style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 7, border: `1px solid ${AT.rule}`, background: '#000' }} />
                        : <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}><img src={s.url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 7, border: `1px solid ${AT.rule}` }} /></a>)}
                    </div>
                  )}

                  <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 8 }}>{b.diag.screen} · {b.diag.market} · {b.diag.role}{b.diag.errors && b.diag.errors.length ? ' · ' + b.diag.errors.length + ' error(s)' : ''}</div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const labelStyle = { fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 6 };

Object.assign(window, { BugReporter, loadBugs, saveBugs, BUG_KEY, BUG_STATUS });
