// admin-screens-3.jsx — Reviews, Returns & warranty, Content/CMS, Brands, Settings

// ─────────────────────────────────────────────────────────────
// REVIEWS MODERATION
// ─────────────────────────────────────────────────────────────
function AReviews({ ctx }) {
  const { reviews, setReviews, toast, log } = ctx;
  const [tab, setTab] = React.useState('pending');
  const [rating, setRating] = React.useState('all');
  const [verified, setVerified] = React.useState('all');
  const [prodFilter, setProdFilter] = React.useState([]);
  const [q, setQ] = React.useState('');
  const decide = (id, decision) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, decided: decision } : r));
    if (log) log('review', decision === 'approved' ? 'Approved review' : 'Rejected review', id, '');
    toast(decision === 'approved' ? 'Review approved & published' : 'Review rejected');
  };
  const pname = (id) => ((window.PRODUCTS || []).find(p => p.id === id) || {}).name || id;
  const reviewProducts = Array.from(new Set(reviews.map(r => r.product)));
  const list = reviews.filter(r => {
    if (tab === 'pending' ? r.decided : r.decided !== tab) return false;
    if (rating !== 'all' && r.stars !== +rating) return false;
    if (verified === 'yes' && !r.verified) return false;
    if (verified === 'no' && r.verified) return false;
    if (prodFilter.length && !prodFilter.includes(r.product)) return false;
    if (q) { const s = q.toLowerCase(); if (!((r.body || '').toLowerCase().includes(s) || (r.name || '').toLowerCase().includes(s) || pname(r.product).toLowerCase().includes(s))) return false; }
    return true;
  });
  const anyFilter = rating !== 'all' || verified !== 'all' || prodFilter.length || q;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']].map(([id, l]) => {
          const n = id === 'pending' ? reviews.filter(r => !r.decided).length : reviews.filter(r => r.decided === id).length;
          const active = tab === id;
          return <button key={id} onClick={() => setTab(id)} style={{
            all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
            background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
            border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
          }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <ASelect label="Rating" value={rating} onChange={setRating} options={[{ value: 'all', label: 'All' }, { value: '5', label: '★ 5' }, { value: '4', label: '★ 4' }, { value: '3', label: '★ 3' }, { value: '2', label: '★ 2' }, { value: '1', label: '★ 1' }]} />
        <ASelect label="Buyer" value={verified} onChange={setVerified} options={[{ value: 'all', label: 'All' }, { value: 'yes', label: 'Verified' }, { value: 'no', label: 'Unverified' }]} />
        <AMultiSelect label="Product" value={prodFilter} onChange={setProdFilter} options={reviewProducts.map(p => ({ value: p, label: pname(p), count: reviews.filter(r => r.product === p).length }))} />
        <AFilterReset show={anyFilter} onClear={() => { setRating('all'); setVerified('all'); setProdFilter([]); setQ(''); }} />
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search review text, author, product…" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map(r => (
          <APanel key={r.id} pad={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ color: AT.accent, fontSize: 14, letterSpacing: 1 }}>{'★'.repeat(r.stars)}<span style={{ color: AT.rule }}>{'★'.repeat(5 - r.stars)}</span></span>
                  <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{r.name}</span>
                  {r.verified ? <ABadge tone="ok">✓ Verified buyer</ABadge> : <ABadge tone="warn">Unverified</ABadge>}
                  {!r.verified && /spam|http|link|follow/i.test(r.body) && <ABadge tone="danger">Spam risk</ABadge>}
                </div>
                <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, lineHeight: 1.5 }}>{r.body}</div>
                <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginTop: 6 }}>{pname(r.product)} · {r.date}</div>
              </div>
              {!r.decided ? (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <ABtn kind="primary" size="sm" onClick={() => decide(r.id, 'approved')}><AIcon name="check" size={15} /> Approve</ABtn>
                  <ABtn kind="danger" size="sm" onClick={() => decide(r.id, 'rejected')}><AIcon name="x" size={15} /> Reject</ABtn>
                </div>
              ) : <ABadge tone={r.decided === 'approved' ? 'ok' : 'danger'}>{r.decided}</ABadge>}
            </div>
          </APanel>
        ))}
        {list.length === 0 && <AEmpty title="Nothing here" sub="No reviews in this tab." />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RETURNS & WARRANTY
// ─────────────────────────────────────────────────────────────
function AReturns({ ctx }) {
  const { returns, setReturns, toast, log, confirm, replyToReturn, role } = ctx;
  const [filter, setFilter] = React.useState('all');
  const [openId, setOpenId] = React.useState(null);
  const [view, setView] = React.useState('claims'); // claims | notes | files
  const [kindFilter, setKindFilter] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [sort, setSort] = React.useState('newest');
  const [channelFilter, setChannelFilter] = React.useState('all');
  const agent = 'Support · ' + (((window.ADMIN_ROLES || {})[role] || {}).label || 'You');
  const stamp = () => (window.nowStamp ? nowStamp() : new Date().toISOString().slice(0, 16).replace('T', ' '));
  const set = (id, status, msg) => { setReturns(returns.map(r => r.id === id ? { ...r, status } : r)); if (log) log('return', status === 'approved' ? 'Approved claim' : 'Closed claim', id, ''); toast(msg); };
  // Approve a claim, recording WHY (the manager's refund reason) on the claim + as an internal note.
  const approveClaim = (r, reason) => {
    const note = (r.refund ? 'Refund approved' : 'Claim approved') + (reason ? ' — reason: ' + reason : '');
    setReturns(returns.map(x => x.id === r.id ? {
      ...x, status: 'approved', refundReason: reason || '',
      thread: [...(x.thread || []), { id: 'm' + Date.now(), from: 'support', via: 'note', author: agent + ' (note)', ts: stamp(), body: note + (r.refund ? ' · ' + money(r.refund) : ''), images: [] }],
    } : x));
    if (log) log('return', r.refund ? 'Approved & refunded' : 'Approved claim', r.id, reason || '');
    toast(`${r.id} approved${r.refund ? ' · ' + money(r.refund) + ' refunded' : ''}`);
  };
  const askApprove = (r) => confirm({
    title: r.refund ? 'Approve & refund ' + money(r.refund) + '?' : 'Approve this claim?',
    body: r.refund ? `This issues a refund of ${money(r.refund)} for claim ${r.id} and can’t be undone. Record why you’re approving it — it’s saved to the claim and the audit log.` : `Claim ${r.id} will be approved.`,
    confirmLabel: r.refund ? 'Approve & refund ' + money(r.refund) : 'Yes, approve',
    icon: 'refund', tone: 'danger',
    prompt: { label: r.refund ? 'Reason for the refund' : 'Note (optional)', placeholder: r.refund ? 'e.g. Confirmed defect within warranty — replacement out of stock.' : 'Add context for the team…', required: !!r.refund },
    onConfirm: (reason) => approveClaim(r, reason),
  });
  const list = returns.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (kindFilter !== 'all' && r.kind !== kindFilter) return false;
    if (channelFilter !== 'all' && (r.channel || 'email') !== channelFilter) return false;
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    if (q) { const s = q.toLowerCase(); if (!((r.id || '').toLowerCase().includes(s) || (r.ref || '').toLowerCase().includes(s) || (r.item || '').toLowerCase().includes(s) || (r.reason || '').toLowerCase().includes(s))) return false; }
    return true;
  }).sort((a, b) => {
    if (sort === 'oldest') return a.date < b.date ? -1 : 1;
    if (sort === 'refund-d') return (b.refund || 0) - (a.refund || 0);
    return a.date < b.date ? 1 : -1; // newest
  });
  const anyFilter = filter !== 'all' || kindFilter !== 'all' || channelFilter !== 'all' || from || to || q || sort !== 'newest';
  // Aggregates across all claims for the Notes and Files views.
  const allNotes = [];
  returns.forEach(r => (r.thread || []).forEach(m => { if (m.via === 'note') allNotes.push({ ...m, claimId: r.id, item: r.item, customer: r.customer }); }));
  allNotes.sort((a, b) => a.ts < b.ts ? 1 : -1);
  const allFiles = [];
  returns.forEach(r => {
    (r.intake && r.intake.photos || []).forEach(img => allFiles.push({ ...img, claimId: r.id, item: r.item, customer: r.customer, source: 'Web form', ts: (r.intake && r.intake.submittedAt) || r.date }));
    (r.thread || []).forEach(m => (m.images || []).forEach(img => allFiles.push({ ...img, claimId: r.id, item: r.item, customer: r.customer, source: m.from === 'support' ? 'Support' : (m.via === 'web' ? 'Web form' : 'Customer email'), ts: m.ts })));
  });
  allFiles.sort((a, b) => a.ts < b.ts ? 1 : -1);

  const viewTab = (id, label, n) => {
    const active = view === id;
    return <button key={id} onClick={() => setView(id)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 999, background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink, border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 700, fontSize: 13 }}>{label}<span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.22)' : AT.surfaceAlt, color: active ? '#fff' : AT.inkSoft, fontFamily: AT.mono, fontSize: 10.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span></button>;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {viewTab('claims', 'Claims', returns.length)}
        {viewTab('notes', 'Internal notes', allNotes.length)}
        {viewTab('files', 'All files', allFiles.length)}
      </div>

      {view === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allNotes.length === 0 ? <AEmpty title="No internal notes yet" sub="Notes your team adds inside a claim appear here — never sent to customers." /> : allNotes.map(n => (
            <APanel key={n.claimId + n.id} pad={0} style={{ overflow: 'hidden' }}>
              <button onClick={() => { setView('claims'); setOpenId(n.claimId); }} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', gap: 13, padding: '13px 16px', alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: '#FFF4E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="list" size={16} color="#E0A800" /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: AT.mono, fontSize: 12, fontWeight: 700, color: AT.accent }}>{n.claimId}</span>
                    <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{n.item}</span>
                    <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>· {n.author}</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{n.ts}</span>
                  </div>
                  <div style={{ fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.5, color: '#7A5200' }}>{n.body}</div>
                </div>
                <AIcon name="chev" size={16} color={AT.inkSoft} />
              </button>
            </APanel>
          ))}
        </div>
      )}

      {view === 'files' && (
        allFiles.length === 0 ? <AEmpty title="No files yet" sub="Photos from web-form submissions and email attachments will collect here." /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {allFiles.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden', background: AT.panel }}>
                <a href={f.url} target="_blank" rel="noreferrer" style={{ display: 'block', lineHeight: 0 }}>
                  <img src={f.url} alt={f.name || ''} style={{ display: 'block', width: '100%', height: 134, objectFit: 'cover' }} />
                </a>
                <div style={{ padding: '9px 11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <ABadge tone={f.source === 'Support' ? 'blue' : 'neutral'}>{f.source}</ABadge>
                    <div style={{ flex: 1 }} />
                    <button onClick={() => { setView('claims'); setOpenId(f.claimId); }} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.mono, fontSize: 11, fontWeight: 700, color: AT.accent }}>{f.claimId}</button>
                  </div>
                  <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name || 'image'}</div>
                  <div style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.item} · {f.ts}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {view === 'claims' && (<React.Fragment>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {[['all', 'All'], ['open', 'Open'], ['approved', 'Approved'], ['closed', 'Closed']].map(([id, l]) => {
          const active = filter === id;
          const n = id === 'all' ? returns.length : returns.filter(r => r.status === id).length;
          return <button key={id} onClick={() => setFilter(id)} style={{
            all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
            background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
            border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
          }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <ASelect label="Type" value={kindFilter} onChange={setKindFilter} options={[{ value: 'all', label: 'All' }, { value: 'return', label: 'Return' }, { value: 'warranty', label: 'Warranty' }]} />
        <ASelect label="Channel" value={channelFilter} onChange={setChannelFilter} options={[{ value: 'all', label: 'All' }, { value: 'web', label: 'Web form' }, { value: 'email', label: 'Email' }]} />
        <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'refund-d', label: 'Refund ↓' }]} />
        <AFilterReset show={anyFilter} onClear={() => { setFilter('all'); setKindFilter('all'); setChannelFilter('all'); setFrom(''); setTo(''); setQ(''); setSort('newest'); }} />
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search claim, order, item, reason…" />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{list.length} of {returns.length}</span>
      </div>
      <ATable columns={[{ label: 'Claim' }, { label: 'Order' }, { label: 'Channel' }, { label: 'Type' }, { label: 'Item' }, { label: 'Reason' }, { label: 'Chat', align: 'center' }, { label: 'Refund', align: 'right' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {list.map(r => {
          const msgs = (r.thread || []).length;
          const lastFromCustomer = msgs && r.thread[r.thread.length - 1].from === 'customer';
          const ch = r.channel || 'email';
          return (
            <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setOpenId(r.id)}>
              <ATd mono strong>{r.id}</ATd>
              <ATd mono>#{r.ref}<span style={{ display: 'block', fontWeight: 400, fontSize: 10.5, color: AT.inkSoft }}>{orderInvoiceNo({ ref: r.ref })}</span></ATd>
              <ATd>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>
                  <AIcon name={ch === 'web' ? 'dashboard' : 'mail'} size={14} color={ch === 'web' ? AT.accent : AT.inkSoft} />
                  {ch === 'web' ? 'Web form' : 'Email'}
                </span>
              </ATd>
              <ATd><ABadge tone={r.kind === 'warranty' ? 'blue' : 'neutral'}>{r.kind}</ABadge></ATd>
              <ATd strong>{r.item}</ATd>
              <ATd>{r.reason}</ATd>
              <ATd align="center">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: AT.body, fontSize: 12.5, color: lastFromCustomer ? AT.accent : AT.inkSoft, fontWeight: lastFromCustomer ? 700 : 500 }}>
                  <AIcon name="chat" size={15} color={lastFromCustomer ? AT.accent : AT.inkSoft} />{msgs}{lastFromCustomer ? <span style={{ width: 7, height: 7, borderRadius: 999, background: AT.accent }} /> : null}
                </span>
              </ATd>
              <ATd mono align="right">{r.refund ? money(r.refund) : '—'}</ATd>
              <ATd><ABadge tone={r.status === 'open' ? 'warn' : r.status === 'approved' ? 'ok' : 'neutral'}>{r.status}</ABadge></ATd>
              <ATd align="right">
                {r.status === 'open' ? (
                  <span style={{ display: 'inline-flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <ABtn kind="primary" size="sm" onClick={() => askApprove(r)}>Approve</ABtn>
                    <ABtn kind="ghost" size="sm" onClick={() => set(r.id, 'closed', `${r.id} closed`)}>Close</ABtn>
                  </span>
                ) : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.accent }}>Open chat <AIcon name="chev" size={14} color={AT.accent} /></span>}
              </ATd>
            </tr>
          );
        })}
      </ATable>
      {list.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No claims" sub="Nothing in this status." /></div>}
      </React.Fragment>)}

      <AReturnChat ctx={ctx} claim={openId ? returns.find(r => r.id === openId) : null} onClose={() => setOpenId(null)}
        onApprove={(r) => askApprove(r)}
        onCloseClaim={(r) => set(r.id, 'closed', `${r.id} closed`)} />
    </div>
  );
}

// ── Support ⇄ customer email chat for a return/warranty claim ──
function AReturnChat({ ctx, claim, onClose, onApprove, onCloseClaim }) {
  const { replyToReturn, toast, role, emailSettings } = ctx;
  const es = emailSettings || {};
  const [text, setText] = React.useState('');
  const [mode, setMode] = React.useState('reply'); // 'reply' (emails customer) | 'note' (internal)
  const [tab, setTab] = React.useState('all'); // all | notes | files
  const [pending, setPending] = React.useState([]); // images queued for the next message
  const [ccOpen, setCcOpen] = React.useState(false);
  const [ccList, setCcList] = React.useState([]);
  const [ccInput, setCcInput] = React.useState('');
  const [preview, setPreview] = React.useState(false);
  const [sendingIds, setSendingIds] = React.useState([]); // emails currently being (re)sent
  const [replyTo, setReplyTo] = React.useState(null); // a previous message this reply quotes
  const scrollRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const composerRef = React.useRef(null);
  React.useEffect(() => { setText(''); setPending([]); setMode('reply'); setTab('all'); setCcOpen(false); setCcList([]); setCcInput(''); setPreview(false); setSendingIds([]); setReplyTo(null); const c = scrollRef.current; if (c) c.scrollTop = 0; prevLen.current = (claim && claim.thread && claim.thread.length) || 0; }, [claim && claim.id]);
  const prevLen = React.useRef(0);
  React.useEffect(() => {
    const len = (claim && claim.thread && claim.thread.length) || 0;
    const c = scrollRef.current;
    if (c && len > prevLen.current) c.scrollTop = c.scrollHeight;
    prevLen.current = len;
  }, [claim && claim.thread && claim.thread.length]);

  const agentShort = es.fromName || 'Support';
  const agentName = agentShort;
  const firstName = ((claim && claim.customer) || 'there').split(' ')[0];
  const stamp = () => (window.nowStamp ? nowStamp() : new Date().toISOString().slice(0, 16).replace('T', ' '));
  const onPick = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => { const rd = new FileReader(); rd.onload = () => setPending(p => [...p, { url: rd.result, name: f.name }]); rd.readAsDataURL(f); });
    e.target.value = '';
  };
  const addCc = (raw) => {
    const v = (raw || '').trim().replace(/[,;]$/, '');
    if (v && /.+@.+\..+/.test(v) && !ccList.includes(v)) setCcList(l => [...l, v]);
    setCcInput('');
  };
  const send = () => {
    if (!text.trim() && pending.length === 0) return;
    const isNote = mode === 'note';
    const msg = { id: 'm' + Date.now(), from: 'support', via: isNote ? 'note' : 'email', author: isNote ? (agentName + ' (note)') : agentName, ts: stamp(), body: text.trim(), images: pending };
    if (!isNote) { msg.to = [claim.email].filter(Boolean); msg.cc = ccList.slice(); msg.status = 'sent'; }
    if (!isNote && replyTo) msg.replyTo = { id: replyTo.id, author: replyTo.author, ts: replyTo.ts, via: replyTo.via || 'email', excerpt: (replyTo.body || '').slice(0, 170) };
    replyToReturn(claim.id, msg);
    setText(''); setPending([]); setPreview(false); setReplyTo(null); setTab(isNote ? 'notes' : 'all');
    toast(isNote ? 'Internal note added' : 'Reply emailed to ' + (claim.customer || 'customer') + (ccList.length ? ' +' + ccList.length + ' cc' : ''));
  };
  const onKey = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } };
  // Patch a single message inside the current claim's thread.
  const updateMsg = (mid, patch) => {
    if (!ctx.setReturns) return;
    ctx.setReturns((ctx.returns || []).map(r => r.id === claim.id ? { ...r, thread: (r.thread || []).map(x => x.id === mid ? { ...x, ...patch } : x) } : r));
  };
  // Resend a support email to the customer — shows a brief “Sending…”, then marks it Sent.
  const resend = (m) => {
    if (sendingIds.includes(m.id)) return;
    setSendingIds(ids => [...ids, m.id]);
    setTimeout(() => {
      setSendingIds(ids => ids.filter(i => i !== m.id));
      updateMsg(m.id, { status: 'sent', ts: stamp(), resent: true });
      toast('Email resent to ' + (claim.email || 'the customer'));
    }, 650);
  };

  // Renders a message body as a real, branded email (greeting · body · sign-off · footer).
  const EmailBody = ({ body, images, light }) => (
    <div style={{ fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.6, color: light ? AT.ink : AT.ink }}>
      <div>Hi {firstName},</div>
      {body && <div style={{ marginTop: 11, whiteSpace: 'pre-wrap' }}>{body}</div>}
      {(images || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 11 }}>
          {images.map((img, i) => (
            <a key={i} href={img.url} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: 8, overflow: 'hidden', border: `1px solid ${AT.rule}`, lineHeight: 0 }}>
              <img src={img.url} alt={img.name || ''} style={{ display: 'block', width: 150, height: 112, objectFit: 'cover' }} />
            </a>
          ))}
        </div>
      )}
      <div style={{ marginTop: 15 }}>{es.signoff || 'Kind regards'},</div>
      <div style={{ fontWeight: 700 }}>{agentShort}</div>
      <div style={{ color: AT.inkSoft }}>{es.teamLine || 'shhh... Customer Care'}</div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${AT.rule}`, display: 'flex', alignItems: 'flex-start', gap: 9, flexWrap: 'wrap' }}>
        {es.logo
          ? <img src={es.logo} alt="logo" style={{ height: 26, maxWidth: 150, objectFit: 'contain', display: 'block' }} />
          : <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, letterSpacing: AT.ld }}>shhh...</span>}
        <span style={{ fontFamily: AT.body, fontSize: 10.5, color: AT.inkSoft, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{es.footer || 'Discreet adult store · support@shhh.lv'}{'\n'}Re: {claim ? claim.id : ''} · order #{claim ? claim.ref : ''}</span>
      </div>
    </div>
  );
  const recipientsLine = (m) => {
    const to = (m.to && m.to.length ? m.to : [claim.email]).filter(Boolean);
    return (
      <div style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>
        <span><strong style={{ color: AT.ink }}>To:</strong> {to.join(', ')}</span>
        {(m.cc && m.cc.length) ? <span> · <strong style={{ color: AT.ink }}>Cc:</strong> {m.cc.join(', ')}</span> : null}
      </div>
    );
  };

  const statusTone = claim ? (claim.status === 'open' ? 'warn' : claim.status === 'approved' ? 'ok' : 'neutral') : 'neutral';
  const viaTag = (via) => {
    const map = { email: { icon: 'mail', label: 'Email' }, web: { icon: 'dashboard', label: 'Web form' }, note: { icon: 'list', label: 'Internal note' } };
    const t = map[via] || map.email;
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontSize: 10, fontWeight: 600, color: AT.inkSoft }}><AIcon name={t.icon} size={11} color={AT.inkSoft} />{t.label}</span>;
  };
  // Delivery status + resend control for an outbound support email.
  const statusRow = (m) => {
    const sending = sendingIds.includes(m.id);
    const failed = !sending && m.status === 'failed';
    const okColor = '#1F8A4C', failColor = '#B42318';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '1px 4px 0' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontSize: 10.5, fontWeight: 600, color: sending ? AT.inkSoft : failed ? failColor : okColor }}>
          {sending
            ? <React.Fragment><span style={{ width: 9, height: 9, borderRadius: 999, border: `2px solid ${AT.rule}`, borderTopColor: AT.accent, display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Sending…</React.Fragment>
            : <React.Fragment><AIcon name={failed ? 'close' : 'check'} size={11} color={failed ? failColor : okColor} sw={3} />{failed ? 'Failed to send' : (m.resent ? 'Resent' : 'Sent')}</React.Fragment>}
        </span>
        {!sending && (
          <button onClick={() => resend(m)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: failed ? failColor : AT.accent }}>
            <AIcon name="mail" size={12} color={failed ? failColor : AT.accent} />{failed ? 'Retry send' : 'Resend'}
          </button>
        )}
        {!sending && replyAction(m)}
      </div>
    );
  };
  // Quote a specific earlier message in the next reply.
  const startReply = (m) => { setMode('reply'); setReplyTo(m); setTab('all'); setTimeout(() => { if (composerRef.current) composerRef.current.focus(); }, 60); };
  // Compact "in reply to …" reference shown inside a message that quotes another.
  const quoteChip = (rt, onPanel) => rt ? (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '7px 10px', marginBottom: 10, borderLeft: `3px solid ${AT.accent}`, background: onPanel ? AT.surfaceAlt : 'rgba(255,255,255,0.16)', borderRadius: 6 }}>
      <span style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1, color: onPanel ? AT.accent : '#fff', marginTop: 1 }}>↩</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, color: onPanel ? AT.accent : '#fff' }}>In reply to {rt.author} · {rt.ts}</div>
        <div style={{ fontFamily: AT.body, fontSize: 11.5, lineHeight: 1.45, color: onPanel ? AT.inkSoft : 'rgba(255,255,255,0.85)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rt.excerpt || rt.body}</div>
      </div>
    </div>
  ) : null;
  // Small "Reply" action that quotes this message in the composer.
  const replyAction = (m, color) => (
    <button onClick={() => startReply(m)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: color || AT.accent }}>
      <span style={{ fontSize: 12, lineHeight: 1 }}>↩</span> Reply
    </button>
  );
  const bubble = (m) => {
    const mine = m.from === 'support';
    const note = m.via === 'note';
    if (note) {
      // Internal note — centred, distinct, never sent to the customer.
      return (
        <div key={m.id} style={{ alignSelf: 'center', maxWidth: '88%', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: '#7A5200' }}>{m.author}</span>
            <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{m.ts}</span>
          </div>
          <div style={{ background: '#FFF4E0', border: '1px dashed #E0A800', borderRadius: 10, padding: '9px 12px', fontFamily: AT.body, fontSize: 12.5, lineHeight: 1.5, color: '#7A5200' }}>{m.body}</div>
        </div>
      );
    }
    // Support outbound email — rendered as a real, branded email card.
    if (mine && m.via === 'email') {
      return (
        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 4px' }}>
            <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.ink }}>{m.author}</span>
            {viaTag('email')}
            <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{m.ts}</span>
          </div>
          <div style={{ maxWidth: '88%', width: '100%', background: AT.panel, border: `1px solid ${m.status === 'failed' && !sendingIds.includes(m.id) ? '#E6B4B0' : AT.rule}`, borderRadius: 12, borderTopRightRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '8px 13px', background: AT.accentSoft, borderBottom: `1px solid ${AT.rule}` }}>{recipientsLine(m)}</div>
            <div style={{ padding: '13px 14px' }}>{quoteChip(m.replyTo, true)}<EmailBody body={m.body} images={m.images} /></div>
          </div>
          {statusRow(m)}
        </div>
      );
    }
    return (
      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 4px' }}>
          <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.ink }}>{m.author}</span>
          {viaTag(m.via || 'email')}
          <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{m.ts}</span>
        </div>
        <div style={{ maxWidth: '78%', background: mine ? AT.accent : AT.panel, color: mine ? '#fff' : AT.ink, border: mine ? 'none' : `1px solid ${AT.rule}`, borderRadius: 14, borderTopRightRadius: mine ? 4 : 14, borderTopLeftRadius: mine ? 14 : 4, padding: '10px 13px' }}>
          {quoteChip(m.replyTo, !mine)}
          {m.body && <div style={{ fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.body}</div>}
          {(m.images || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: m.body ? 9 : 0 }}>
              {m.images.map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: 9, overflow: 'hidden', border: `1px solid ${mine ? 'rgba(255,255,255,0.3)' : AT.rule}`, lineHeight: 0 }}>
                  <img src={img.url} alt={img.name || ''} style={{ display: 'block', width: 150, height: 112, objectFit: 'cover' }} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', padding: '1px 4px 0' }}>{replyAction(m)}</div>
      </div>
    );
  };

  // Structured web-form submission (the exact answers the customer gave).
  const intakeCard = (claim && claim.channel === 'web' && claim.intake) ? (
    <div style={{ border: `1px solid ${AT.accent}`, borderRadius: AT.radiusSm, overflow: 'hidden', marginBottom: 4, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: AT.accentSoft, borderBottom: `1px solid ${AT.rule}` }}>
        <AIcon name="dashboard" size={15} color={AT.accent} />
        <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.accent }}>Submitted via web form</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{claim.intake.submittedAt}</span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 16px' }}>
          {claim.intake.fields.map(([k, v], i) => (
            <div key={i}>
              <div style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 1 }}>{k}</div>
              <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink }}>{v}</div>
            </div>
          ))}
        </div>
        {claim.intake.comment && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${AT.ruleSoft}` }}>
            <div style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 3 }}>Customer comment</div>
            <div style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1.5, color: AT.ink }}>{claim.intake.comment}</div>
          </div>
        )}
        {(claim.intake.photos || []).length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 6 }}>Uploaded photos</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {claim.intake.photos.map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: 9, overflow: 'hidden', border: `1px solid ${AT.rule}`, lineHeight: 0 }}>
                  <img src={img.url} alt={img.name || ''} style={{ display: 'block', width: 130, height: 98, objectFit: 'cover' }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // Per-claim shortcuts: notes only, and every file attached to this claim.
  const claimNotes = claim ? (claim.thread || []).filter(m => m.via === 'note') : [];
  const claimFiles = [];
  if (claim) {
    ((claim.intake && claim.intake.photos) || []).forEach(img => claimFiles.push({ ...img, source: 'Web form', ts: (claim.intake && claim.intake.submittedAt) || claim.date }));
    (claim.thread || []).forEach(m => (m.images || []).forEach(img => claimFiles.push({ ...img, source: m.from === 'support' ? 'Support' : (m.via === 'web' ? 'Web form' : 'Customer email'), ts: m.ts })));
  }
  // Link the claim back to its originating order so we can show the same
  // invoice block the Orders screen does (net / VAT / total, download, send).
  const claimOrder = claim ? ((ctx.allOrders || ctx.orders || (typeof window !== 'undefined' && window.SEED_ORDERS) || []).find(o => o.ref === claim.ref)) : null;
  const claimFin = claimOrder ? orderFinance(claimOrder, (typeof window !== 'undefined' && window.SEED_PAYOUTS)) : null;
  const claimMarket = (claimOrder && (claimOrder.market || claimOrder.country)) || 'LV';
  const drawerTab = (id, label, n) => {
    const active = tab === id;
    return <button key={id} onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 999, background: active ? AT.ink : 'transparent', color: active ? '#fff' : AT.ink, border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{label}<span style={{ minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.22)' : AT.surfaceAlt, color: active ? '#fff' : AT.inkSoft, fontFamily: AT.mono, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span></button>;
  };

  return (
    <ADrawer open={!!claim} onClose={onClose} width={620}
      title={claim ? claim.item : ''} sub={claim ? claim.id + ' · order #' + claim.ref : ''}>
      {claim && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Claim summary + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 0 14px', borderBottom: `1px solid ${AT.rule}`, flexWrap: 'wrap' }}>
            <AAvatar name={claim.customer || 'C'} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{claim.customer || 'Customer'}</div>
              <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{claim.email || ''}</div>
            </div>
            <ABadge tone={claim.kind === 'warranty' ? 'blue' : 'neutral'}>{claim.kind}</ABadge>
            <ABadge tone={(claim.channel || 'email') === 'web' ? 'blue' : 'neutral'}>{(claim.channel || 'email') === 'web' ? 'Web form' : 'Email'}</ABadge>
            <ABadge tone={statusTone}>{claim.status}</ABadge>
            {claim.refund ? <span style={{ fontFamily: AT.mono, fontSize: 13, fontWeight: 700, color: AT.ink }}>{money(claim.refund)}</span> : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Reason: <strong style={{ color: AT.ink }}>{claim.reason}</strong></span>
            <div style={{ flex: 1 }} />
            {claim.status === 'open' && (
              <span style={{ display: 'inline-flex', gap: 6 }}>
                <ABtn kind="primary" size="sm" onClick={() => onApprove(claim)}>Approve{claim.refund ? ' & refund' : ''}</ABtn>
                <ABtn kind="ghost" size="sm" onClick={() => onCloseClaim(claim)}>Close claim</ABtn>
              </span>
            )}
          </div>

          {/* Within-claim shortcuts */}
          <div style={{ display: 'flex', gap: 7, padding: '4px 0 0', flexWrap: 'wrap' }}>
            {drawerTab('all', 'Conversation', (claim.thread || []).length)}
            {drawerTab('invoice', 'Invoice', claimFin ? fmtMoney(claimFin.gross, claimMarket) : '—')}
            {drawerTab('notes', 'Internal notes', claimNotes.length)}
            {drawerTab('files', 'Files', claimFiles.length)}
          </div>

          {/* Timeline / Notes / Files */}
          <div ref={scrollRef} style={{ flex: 1, minHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 2px', background: AT.surfaceAlt, borderRadius: AT.radiusSm, margin: '8px 0 4px' }}>
            {tab === 'all' && (<React.Fragment>
              {intakeCard}
              <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>{(claim.channel || 'email') === 'web' ? 'Conversation after the web submission' : 'Email conversation'} · {(claim.thread || []).length} messages</div>
              {(claim.thread || []).length === 0 && <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, padding: '12px 0' }}>No replies yet — start the conversation below.</div>}
              {(claim.thread || []).map(bubble)}
            </React.Fragment>)}

            {tab === 'notes' && (claimNotes.length === 0 ? (
              <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, padding: '24px 12px' }}>No internal notes on this claim yet. Switch the composer to “Internal note” to add one.</div>
            ) : claimNotes.map(m => (
              <div key={m.id} style={{ background: '#FFF4E0', border: '1px dashed #E0A800', borderRadius: 10, padding: '10px 13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <AIcon name="list" size={13} color="#E0A800" />
                  <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: '#7A5200' }}>{m.author}</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{m.ts}</span>
                </div>
                <div style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1.5, color: '#7A5200' }}>{m.body}</div>
              </div>
            )))}

            {tab === 'files' && (claimFiles.length === 0 ? (
              <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, padding: '24px 12px' }}>No files attached to this claim yet.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {claimFiles.map((f, i) => (
                  <div key={i} style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden', background: AT.panel }}>
                    <a href={f.url} target="_blank" rel="noreferrer" style={{ display: 'block', lineHeight: 0 }}>
                      <img src={f.url} alt={f.name || ''} style={{ display: 'block', width: '100%', height: 110, objectFit: 'cover' }} />
                    </a>
                    <div style={{ padding: '8px 10px' }}>
                      <ABadge tone={f.source === 'Support' ? 'blue' : 'neutral'}>{f.source}</ABadge>
                      <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.ink, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name || 'image'}</div>
                      <div style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft }}>{f.ts}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {tab === 'invoice' && (() => {
              const cardStyle = { border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 16, background: AT.panel };
              const cardHead = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 };
              const cardIcon = { width: 34, height: 34, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
              const rowKV = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', fontFamily: AT.body, fontSize: 13 };
              const invTool = { all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, color: AT.ink };
              const mk = marketById(claimMarket);
              const invNo = claimFin ? claimFin.invoice : orderInvoiceNo({ ref: claim.ref });
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignSelf: 'stretch', width: '100%' }}>
                  {/* Invoice — same block shown on the order */}
                  <div style={cardStyle}>
                    <div style={cardHead}>
                      <span style={cardIcon}><AIcon name="finance" size={17} color={AT.ink} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Invoice</div>
                        <div style={{ fontFamily: AT.mono, fontSize: 12, color: AT.accent }}>{invNo} · order #{claim.ref}</div>
                      </div>
                      {claimFin && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}><ABadge tone={claimFin.payState === 'refunded' ? 'danger' : claimFin.payState === 'captured' ? 'ok' : 'warn'}>{claimFin.payState === 'captured' ? 'Paid' : claimFin.payState === 'refunded' ? 'Refunded' : 'Draft'}</ABadge>{claimFin.reverseCharge && <ABadge tone="blue">Reverse charge</ABadge>}</div>}
                    </div>
                    {claimFin && claimFin.business && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, margin: '-8px 0 8px' }}>{(claimOrder && claimOrder.company) ? claimOrder.company + ' · ' : ''}VAT {claimFin.vatNo}</div>}
                    {claimFin ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 8 }}>
                        <div style={{ ...rowKV, color: AT.inkSoft }}><span>Net{claimFin.reverseCharge ? '' : ' (ex VAT)'}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{fmtMoney(claimFin.net, claimMarket)}</span></div>
                        <div style={{ ...rowKV, color: AT.inkSoft }}><span>{claimFin.reverseCharge ? 'VAT 0% · reverse charge' : `VAT ${(mk.vat * 100).toFixed(mk.vat * 100 % 1 ? 1 : 0)}% · ${mk.id}`}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{fmtMoney(claimFin.vat, claimMarket)}</span></div>
                        <div style={{ ...rowKV, paddingTop: 8, borderTop: `1px solid ${AT.ruleSoft}` }}><span style={{ fontWeight: 700, color: AT.ink }}>{claimFin.reverseCharge ? 'Total (0% VAT)' : 'Total incl. VAT'}</span><span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink }}>{fmtMoney(claimFin.gross, claimMarket)}</span></div>
                        {claimFin.reverseCharge && <div style={{ marginTop: 8, padding: '9px 11px', borderRadius: AT.radiusSm, background: AT.accentSoft, fontFamily: AT.body, fontSize: 11.5, lineHeight: 1.45, color: '#21438C' }}>Reverse charge — VAT accounted by the recipient. Intra-Community supply (Art. 196, Dir. 2006/112/EC). Customer EU VAT No. <strong>{claimFin.vatNo}</strong>.</div>}
                      </div>
                    ) : (
                      <div style={{ borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 10, fontFamily: AT.body, fontSize: 12.5, lineHeight: 1.5, color: AT.inkSoft }}>Invoice <strong style={{ color: AT.ink }}>{invNo}</strong> is on file for order #{claim.ref}. The original order isn’t in the current market view — switch to “All markets” to see net / VAT / total amounts.</div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                      <button onClick={() => toast('Invoice ' + invNo + ' downloaded')} style={invTool}><AIcon name="download" size={15} color={AT.ink} /> Download PDF</button>
                      <button onClick={() => toast('Invoice sent to ' + (claim.email || 'customer'))} style={invTool}><AIcon name="mail" size={15} color={AT.ink} /> Send to customer</button>
                    </div>
                  </div>

                  {/* Refund tied to this claim */}
                  <div style={cardStyle}>
                    <div style={cardHead}>
                      <span style={cardIcon}><AIcon name="refund" size={17} color={AT.ink} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Refund for this claim</div>
                        <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{claim.kind === 'warranty' ? 'Warranty — usually replaced, not refunded' : 'Return'}</div>
                      </div>
                      <ABadge tone={claim.status === 'approved' ? 'ok' : claim.status === 'open' ? 'warn' : 'neutral'}>{claim.status}</ABadge>
                    </div>
                    <div style={{ borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 8 }}>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>Refund amount</span><span style={{ fontFamily: AT.mono, fontWeight: 700, color: AT.ink }}>{claim.refund ? money(claim.refund) : '—'}</span></div>
                      {claim.refundReason ? <div style={{ ...rowKV, color: AT.inkSoft, alignItems: 'flex-start' }}><span>Reason</span><span style={{ color: AT.ink, maxWidth: '62%', textAlign: 'right', lineHeight: 1.4 }}>{claim.refundReason}</span></div> : null}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Composer */}
          <div style={{ borderTop: `1px solid ${AT.rule}`, paddingTop: 12 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, background: AT.surfaceAlt, borderRadius: 8, padding: 3, width: 'fit-content' }}>
              {[['reply', 'Reply', 'mail'], ['note', 'Internal note', 'list']].map(([m, l, ic]) => (
                <button key={m} onClick={() => setMode(m)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: mode === m ? AT.panel : 'transparent', color: mode === m ? AT.ink : AT.inkSoft, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  <AIcon name={ic} size={13} color={mode === m ? AT.ink : AT.inkSoft} />{l}
                </button>
              ))}
            </div>
            {mode === 'reply' && (
              <div style={{ marginBottom: 10, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 11px', borderBottom: `1px solid ${AT.ruleSoft}` }}>
                  <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, width: 26 }}>To</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12, color: AT.ink }}><AIcon name="user" size={12} color={AT.inkSoft} />{claim.email || 'customer'}</span>
                  <div style={{ flex: 1 }} />
                  {!ccOpen && <button onClick={() => setCcOpen(true)} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.accent }}>+ Cc</button>}
                </div>
                {ccOpen && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, width: 26 }}>Cc</span>
                    {ccList.map((c, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 6px 3px 9px', borderRadius: 999, background: AT.accentSoft, fontFamily: AT.body, fontSize: 12, color: AT.accent }}>{c}
                        <button onClick={() => setCcList(l => l.filter((_, k) => k !== i))} style={{ all: 'unset', cursor: 'pointer', display: 'flex' }}><AIcon name="close" size={11} color={AT.accent} /></button>
                      </span>
                    ))}
                    <input value={ccInput} onChange={e => setCcInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',' || e.key === ';') { e.preventDefault(); addCc(ccInput); } else if (e.key === 'Backspace' && !ccInput && ccList.length) { setCcList(l => l.slice(0, -1)); } }} onBlur={() => addCc(ccInput)} placeholder="add email + Enter" style={{ flex: 1, minWidth: 130, border: 'none', outline: 'none', background: 'transparent', fontFamily: AT.body, fontSize: 12.5, color: AT.ink }} />
                  </div>
                )}
              </div>
            )}
            {preview && mode === 'reply' && (
              <div style={{ marginBottom: 10, border: `1px solid ${AT.accent}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: AT.accentSoft }}>
                  <AIcon name="eye" size={14} color={AT.accent} />
                  <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 12, color: AT.accent }}>Preview — what {firstName} receives</span>
                </div>
                <div style={{ padding: '8px 13px', borderBottom: `1px solid ${AT.ruleSoft}`, fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>
                  <div><strong style={{ color: AT.ink }}>Subject:</strong> Re: your {claim.kind} — {claim.item} ({claim.id})</div>
                  <div style={{ marginTop: 2 }}>{recipientsLine({ to: [claim.email], cc: ccList })}</div>
                </div>
                <div style={{ padding: '14px 15px', background: AT.panel, maxHeight: 240, overflowY: 'auto' }}>
                  {replyTo && quoteChip(replyTo, true)}
                  {(text.trim() || pending.length) ? <EmailBody body={text.trim()} images={pending} /> : <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Start typing to see the email preview…</span>}
                </div>
              </div>
            )}
            {pending.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {pending.map((img, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${AT.rule}`, lineHeight: 0 }}>
                    <img src={img.url} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                    <button onClick={() => setPending(p => p.filter((_, k) => k !== i))} style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 999, background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="close" size={11} color="#fff" /></button>
                  </div>
                ))}
              </div>
            )}
            {mode === 'reply' && replyTo && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10, padding: '9px 11px', borderRadius: AT.radiusSm, border: `1px solid ${AT.accent}`, background: AT.accentSoft }}>
                <span style={{ fontSize: 15, lineHeight: 1, color: AT.accent, marginTop: 1 }}>↩</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.accent }}>Replying to {replyTo.author} · {replyTo.ts}{replyTo.via === 'note' ? ' (internal note)' : ''}</div>
                  <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{(replyTo.body || '').slice(0, 200) || '(no text)'}</div>
                </div>
                <button onClick={() => setReplyTo(null)} title="Remove quote" style={{ all: 'unset', cursor: 'pointer', display: 'flex', padding: 2 }}><AIcon name="close" size={13} color={AT.accent} /></button>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPick} style={{ display: 'none' }} />
              <button onClick={() => fileRef.current && fileRef.current.click()} title="Attach image" style={{ all: 'unset', cursor: 'pointer', width: 40, height: 40, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AIcon name="paperclip" size={17} color={AT.inkSoft} />
              </button>
              <textarea ref={composerRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey} rows={1} placeholder={mode === 'note' ? 'Add an internal note (not sent to customer)… (⌘↵)' : (replyTo ? 'Reply to ' + replyTo.author + '… (⌘↵ to send)' : 'Write a reply… (⌘↵ to send)')}
                style={{ flex: 1, resize: 'none', minHeight: 40, maxHeight: 120, padding: '10px 13px', borderRadius: AT.radiusSm, border: `1px solid ${mode === 'note' ? '#E0A800' : AT.rule}`, background: mode === 'note' ? '#FFFBF2' : AT.panel, fontFamily: AT.body, fontSize: 13.5, color: AT.ink, outline: 'none', lineHeight: 1.4, boxSizing: 'border-box' }} />
              <button onClick={send} disabled={!text.trim() && pending.length === 0} title="Send" style={{ all: 'unset', cursor: (!text.trim() && pending.length === 0) ? 'not-allowed' : 'pointer', height: 40, padding: '0 16px', borderRadius: AT.radiusSm, background: (!text.trim() && pending.length === 0) ? AT.surfaceAlt : (mode === 'note' ? '#E0A800' : AT.accent), color: (!text.trim() && pending.length === 0) ? AT.inkSoft : '#fff', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: AT.body, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                <AIcon name="send" size={15} color={(!text.trim() && pending.length === 0) ? AT.inkSoft : '#fff'} /> {mode === 'note' ? 'Add note' : 'Send'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft, flex: 1 }}>{mode === 'note' ? 'Internal notes are visible only to your team — never sent to the customer.' : 'Sent as a branded email to ' + (claim.email || 'the customer') + (ccList.length ? ' + ' + ccList.length + ' cc' : '') + ', with greeting & signature.'}</div>
              {mode === 'reply' && <button onClick={() => setPreview(p => !p)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: preview ? AT.accent : AT.inkSoft }}><AIcon name="eye" size={14} color={preview ? AT.accent : AT.inkSoft} />{preview ? 'Hide preview' : 'Preview email'}</button>}
            </div>
          </div>
        </div>
      )}
    </ADrawer>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTENT / CMS — list every page; edit text that shows on the storefront
// ─────────────────────────────────────────────────────────────
function pageGroup(k, p) {
  if (k.startsWith('journal')) return 'Journal';
  if (k.startsWith('guide') || k === 'size-material' || k === 'glossary') return 'Guides';
  if (k.startsWith('brand-')) return 'Brand pages';
  if (['accessibility', 'gdpr', 'terms', 'privacy', 'cookies', 'returns'].includes(k) || (p.kicker || '').toLowerCase().includes('juridisk')) return 'Legal';
  const head = (p.kicker || '').split(' · ')[0];
  if (['Trust', 'Support'].includes(head)) return head;
  return head || 'Other';
}

function AContent({ ctx }) {
  const { toast, saveCms, cms } = ctx;
  const pages = window.CONTENT_PAGES || {};
  const journalIdx = window.JOURNAL_INDEX || [];
  const [q, setQ] = React.useState('');
  const [group, setGroup] = React.useState('All');
  const [openKey, setOpenKey] = React.useState(null);
  const [draft, setDraft] = React.useState(null);
  const [, force] = React.useState(0);

  const allEntries = Object.entries(pages);
  const groups = ['All', ...Array.from(new Set(allEntries.map(([k, p]) => pageGroup(k, p)))).sort((a, b) => {
    const order = ['Trust', 'Support', 'Guides', 'Journal', 'Legal', 'Brand pages', 'Other'];
    return (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99);
  })];

  const entries = allEntries.filter(([k, p]) => {
    if (group !== 'All' && pageGroup(k, p) !== group) return false;
    if (q) { const s = q.toLowerCase(); return (p.title || '').toLowerCase().includes(s) || k.includes(s) || (p.sub || '').toLowerCase().includes(s); }
    return true;
  });

  const openEditor = (k) => {
    const p = pages[k] || {};
    setOpenKey(k);
    setDraft({
      title: p.title || '', kicker: p.kicker || '', sub: p.sub || '', intro: p.intro || '',
      sections: (p.sections || []).map(s => Array.isArray(s) ? [s[0], s[1]] : [s.title || '', s.body || '']),
    });
  };
  const edited = (k) => !!(cms && cms[k]);

  const save = () => {
    saveCms(openKey, {
      title: draft.title, kicker: draft.kicker, sub: draft.sub, intro: draft.intro,
      sections: draft.sections.filter(s => s[0] || s[1]),
    });
    toast(`"${draft.title || openKey}" saved — live on storefront`);
    force(x => x + 1);
    setOpenKey(null);
  };

  const p = openKey ? pages[openKey] : null;
  const special = p && (p.isFaq || p.isReviews || p.isUsage || p.isIndex || p.isOrderLookup || p.isBrandsIndex || p.table || p.clothingTable || p.formKind);

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {groups.map(g => {
          const active = group === g;
          const n = g === 'All' ? allEntries.length : allEntries.filter(([k, pp]) => pageGroup(k, pp) === g).length;
          return <button key={g} onClick={() => setGroup(g)} style={{
            all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
            background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
            border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
          }}>{g} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>;
        })}
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search pages…" />
        <ABtn kind="primary" onClick={() => toast('New page (demo)')}><AIcon name="plus" size={15} /> New page</ABtn>
      </div>
      <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 14 }}>
        Showing {entries.length} of {allEntries.length} pages · {journalIdx.length} journal posts · edits publish to mobile + desktop
      </div>

      <ATable columns={[{ label: 'Title' }, { label: 'Key' }, { label: 'Group' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {entries.map(([k, pg]) => (
          <tr key={k} style={{ cursor: 'pointer' }} onClick={() => openEditor(k)}>
            <ATd strong>{pg.title || k}<div style={{ fontWeight: 400, fontSize: 11.5, color: AT.inkSoft }}>{pg.sub || pg.kicker}</div></ATd>
            <ATd mono>{k}</ATd>
            <ATd>{pageGroup(k, pg)}</ATd>
            <ATd>{edited(k) ? <ABadge tone="blue">Edited</ABadge> : <ABadge tone="ok">Published</ABadge>}</ATd>
            <ATd align="right"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: AT.accent, fontFamily: AT.body, fontWeight: 700, fontSize: 12.5 }}>Edit <AIcon name="chev" size={15} color={AT.accent} /></span></ATd>
          </tr>
        ))}
      </ATable>
      {entries.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No pages match" sub="Try another group or search." /></div>}

      {/* Editor */}
      <ADrawer open={!!openKey && !!draft} onClose={() => setOpenKey(null)} width={620}
        title={p ? (p.title || openKey) : ''} sub={openKey ? 'Key: ' + openKey : ''}
        footer={openKey && (<><ABtn kind="ghost" onClick={() => setOpenKey(null)}>Cancel</ABtn><ABtn kind="primary" onClick={save}><AIcon name="check" size={15} /> Save & publish</ABtn></>)}>
        {openKey && draft && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 12, borderRadius: AT.radiusSm, background: AT.accentSoft, fontFamily: AT.body, fontSize: 12.5, color: '#21438C', lineHeight: 1.5 }}>
              Changes save to both the <strong>mobile</strong> and <strong>desktop</strong> storefront instantly.
            </div>
            <AField label="Kicker / category"><AInput value={draft.kicker} onChange={e => setDraft({ ...draft, kicker: e.target.value })} /></AField>
            <AField label="Title"><AInput value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></AField>
            <AField label="Subtitle"><AInput value={draft.sub} onChange={e => setDraft({ ...draft, sub: e.target.value })} /></AField>
            {('intro' in (p || {}) || draft.intro) && (
              <AField label="Intro paragraph"><textarea value={draft.intro} onChange={e => setDraft({ ...draft, intro: e.target.value })} rows={3} style={{ ...aInputStyle, height: 'auto', padding: 12, lineHeight: 1.5, resize: 'vertical' }} /></AField>
            )}

            {/* Sections */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>Sections ({draft.sections.length})</div>
                <ABtn kind="soft" size="sm" onClick={() => setDraft({ ...draft, sections: [...draft.sections, ['', '']] })}><AIcon name="plus" size={14} /> Add section</ABtn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {draft.sections.map((s, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.surfaceAlt }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <AInput value={s[0]} placeholder="Section heading" onChange={e => { const ns = draft.sections.slice(); ns[i] = [e.target.value, ns[i][1]]; setDraft({ ...draft, sections: ns }); }} style={{ background: AT.panel }} />
                      <button onClick={() => setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== i) })} style={{ all: 'unset', cursor: 'pointer', width: 38, height: 38, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="x" size={16} color={AT.danger} /></button>
                    </div>
                    <textarea value={s[1]} placeholder="Section text" rows={3} onChange={e => { const ns = draft.sections.slice(); ns[i] = [ns[i][0], e.target.value]; setDraft({ ...draft, sections: ns }); }} style={{ ...aInputStyle, width: '100%', height: 'auto', padding: 12, lineHeight: 1.5, resize: 'vertical', background: AT.panel }} />
                  </div>
                ))}
                {draft.sections.length === 0 && <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>No text sections on this page{special ? ' — its main content is generated (e.g. FAQ, reviews, tables, forms).' : '. Add one above.'}</div>}
              </div>
            </div>

            {special && (
              <div style={{ padding: 12, borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.5 }}>
                This page also renders dynamic content (FAQ, reviews, tables or a form). Title, kicker, subtitle and intro above are still editable.
              </div>
            )}
            <button onClick={() => { if (window.__shhhPreviewBase) {} }} style={{ display: 'none' }} />
          </div>
        )}
      </ADrawer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────────────────────
function ABrands({ ctx }) {
  const { toast, brandFeatured, setBrandFeatured } = ctx;
  const brands = window.BRANDS || [];
  const [q, setQ] = React.useState('');
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);
  const [sort, setSort] = React.useState('name');
  const featured = brandFeatured || {};
  const toggleFeat = (id) => setBrandFeatured({ ...featured, [id]: !featured[id] });
  let list = brands.filter(b => !q || b.name.toLowerCase().includes(q.toLowerCase()));
  if (onlyFeatured) list = list.filter(b => featured[b.id]);
  list = list.slice().sort((a, b) => sort === 'name-d' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['all', 'All brands'], ['feat', 'Featured only']].map(([id, l]) => {
            const active = (id === 'feat') === onlyFeatured;
            return <button key={id} onClick={() => setOnlyFeatured(id === 'feat')} style={{
              all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
              background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
              border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
            }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{id === 'feat' ? Object.values(featured).filter(Boolean).length : brands.length}</span></button>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'name', label: 'A–Z' }, { value: 'name-d', label: 'Z–A' }]} />
          <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{list.length} of {brands.length}</span>
          <ASearch value={q} onChange={setQ} placeholder="Search brands…" />
          <ABtn kind="primary" size="md" onClick={() => toast('Add brand (demo)')}><AIcon name="plus" size={15} /> Add brand</ABtn>
        </div>
      </div>
      <ATable columns={[{ label: 'Brand' }, { label: 'Slug' }, { label: 'Featured' }, { label: '', align: 'right' }]}>
        {list.slice(0, 80).map(b => (
          <tr key={b.id}>
            <ATd strong>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 6, background: AT.ink, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.body, fontWeight: 800, fontSize: 12 }}>{b.name[0]}</span>
                {b.name}
              </span>
            </ATd>
            <ATd mono>{b.id}</ATd>
            <ATd>
              <button onClick={() => toggleFeat(b.id)} style={{ all: 'unset', cursor: 'pointer', color: featured[b.id] ? AT.accent : AT.inkSoft }}>
                <AIcon name="reviews" size={18} color={featured[b.id] ? AT.accent : AT.rule} />
              </button>
            </ATd>
            <ATd align="right"><ABtn kind="ghost" size="sm" onClick={() => toast('Brand editor (demo)')}>Edit</ABtn></ATd>
          </tr>
        ))}
      </ATable>
      {list.length > 80 && <div style={{ marginTop: 12, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, textAlign: 'center' }}>Showing first 80 of {list.length} — refine with search.</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────
function ASettings({ ctx }) {
  const { toast } = ctx;
  const [tab, setTab] = React.useState('general');
  const tabs = [['general', 'General'], ['team', 'Team & roles'], ['email', 'Email & signature'], ['tax', 'Tax / VAT'], ['shipping', 'Shipping zones'], ['store', 'Store profile'], ['notif', 'Notifications']];
  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22, fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft, borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent', whiteSpace: 'nowrap' }}>{label}</button>
  );
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 22, overflowX: 'auto' }}>{tabs.map(([id, l]) => tabBtn(id, l))}</div>
      {tab === 'general' && <SettingsGeneral ctx={ctx} />}
      {tab === 'team' && <SettingsTeam ctx={ctx} />}
      {tab === 'email' && <SettingsEmail ctx={ctx} />}
      {tab === 'tax' && <SettingsTax ctx={ctx} />}
      {tab === 'shipping' && <SettingsShipping ctx={ctx} />}
      {tab === 'store' && <SettingsStore ctx={ctx} />}
      {tab === 'notif' && <SettingsNotif ctx={ctx} />}
    </div>
  );
}

function SettingsGeneral({ ctx }) {
  const { toast } = ctx;
  const couriers = window.COURIERS || [];
  const senders = window.PSEUDO_SENDERS || [];
  const [lang, setLang] = React.useState('lv');
  const [sender, setSender] = React.useState('nl');
  const [tracking, setTracking] = React.useState({ ga4: true, meta: true });
  const langs = [['lv', 'Latviešu'], ['ru', 'Русский'], ['en', 'English'], ['lt', 'Lietuvių'], ['et', 'Eesti']];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
      {/* Couriers */}
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 14, color: AT.ink }}>Couriers</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {couriers.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${AT.ruleSoft}` }}>
              <div>
                <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{c.name} {c.anonymous && <ABadge tone="ok">anon</ABadge>}</div>
                <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{c.sub} · {c.eta}</div>
              </div>
              <span style={{ fontFamily: AT.mono, fontSize: 13, color: AT.ink, fontWeight: 700 }}>{money(c.price)}</span>
            </div>
          ))}
        </div>
      </APanel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Languages */}
        <APanel pad={20}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 6, color: AT.ink }}>Languages</div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 12 }}>Default storefront language</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {langs.map(([code, label]) => (
              <button key={code} onClick={() => { setLang(code); toast(`Default language → ${label}`); }} style={{
                all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                background: lang === code ? AT.ink : AT.panel, color: lang === code ? '#fff' : AT.ink,
                border: `1px solid ${lang === code ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
              }}>{label}{lang === code && ' ✓'}</button>
            ))}
          </div>
        </APanel>

        {/* Discretion */}
        <APanel pad={20}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 6, color: AT.ink }}>Discretion</div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 12 }}>Default parcel sender label</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {senders.map(s => (
              <button key={s.id} onClick={() => { setSender(s.id); toast(`Default sender → ${s.name}`); }} style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: AT.radiusSm,
                border: `1px solid ${sender === s.id ? AT.ink : AT.rule}`, background: sender === s.id ? AT.surfaceAlt : AT.panel,
              }}>
                <span style={{ width: 28, height: 28, borderRadius: 6, background: s.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.body, fontWeight: 800, fontSize: 11 }}>{s.logo}</span>
                <span style={{ flex: 1 }}><span style={{ display: 'block', fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.ink }}>{s.name}</span><span style={{ display: 'block', fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{s.sub}</span></span>
                {sender === s.id && <AIcon name="check" size={16} color={AT.accent} />}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 10 }}>Analytics (consent-gated)</div>
          {[['ga4', 'Google Analytics 4', 'G-4WC2LJ49LH'], ['meta', 'Meta Pixel', '698566206451686']].map(([k, l, id]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={tracking[k]} onChange={e => { setTracking({ ...tracking, [k]: e.target.checked }); toast(`${l} ${e.target.checked ? 'enabled' : 'disabled'}`); }} />
              <span style={{ flex: 1, fontFamily: AT.body, fontSize: 13, color: AT.ink }}>{l}</span>
              <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{id}</span>
            </label>
          ))}
        </APanel>
      </div>
    </div>
  );
}

Object.assign(window, { AReviews, AReturns, ABrands, ASettings, SettingsGeneral });
