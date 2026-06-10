// admin-devtools.jsx — Developer workspace: IT bug-triage queue, feature flags,
// API tokens, and environment controls. Depends on AT, AIcon, ABadge, ABtn,
// ATable/ATd, AField, AInput, ASelect, AEmpty, APanel, ADrawer (globals) +
// window.loadBugs/saveBugs/BUG_STATUS from admin-report.jsx.

const FLAGS_KEY = 'shhh_admin_flags_v1';
const TOKENS_KEY = 'shhh_admin_tokens_v1';
const ENVS = ['Production', 'Staging', 'Local'];

function dtStamp() { return (window.nowStamp ? nowStamp() : new Date().toISOString().slice(0, 16).replace('T', ' ')); }
function dtLoad(key, seed) { try { const v = JSON.parse(localStorage.getItem(key) || 'null'); if (v) return v; } catch (e) {} const s = seed(); try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) {} return s; }
function dtSave(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

function seedFlags() {
  return [
    { key: 'checkout_v2', label: 'New checkout', desc: 'Redesigned one-page checkout.', envs: { Production: false, Staging: true, Local: true } },
    { key: 'returns_portal', label: 'Self-serve returns portal', desc: 'Customer-facing RMA form on the storefront.', envs: { Production: true, Staging: true, Local: true } },
    { key: 'ai_search', label: 'AI product search', desc: 'Semantic search on the catalogue.', envs: { Production: false, Staging: false, Local: true } },
    { key: 'multi_currency', label: 'Multi-currency pricing', desc: 'Per-market price lists (PLN, SEK).', envs: { Production: false, Staging: true, Local: true } },
  ];
}
function seedTokens() {
  return [
    { id: 'tok1', name: 'Storefront API', token: 'sk_live_8f2a…d41c', scope: 'read', created: '2026-05-12', lastUsed: '2026-06-03', status: 'active' },
    { id: 'tok2', name: 'Analytics export (cron)', token: 'sk_live_1b90…77ee', scope: 'read', created: '2026-04-02', lastUsed: '2026-06-04', status: 'active' },
  ];
}

// ── Bug-triage queue (IT side of the report chat) ────────────
function DevBugQueue({ ctx }) {
  const { toast, confirm, emailSettings } = ctx;
  const [, force] = React.useState(0);
  const refresh = () => force(v => v + 1);
  const [statusF, setStatusF] = React.useState('all');
  const [sevF, setSevF] = React.useState('all');
  const [selId, setSelId] = React.useState(null);
  const [reply, setReply] = React.useState('');
  const scroll = React.useRef(null);
  const all = (window.loadBugs ? window.loadBugs() : []);
  const BS = window.BUG_STATUS || {};
  const sevTone = { low: 'neutral', normal: 'blue', high: 'warn', blocker: 'danger' };
  const agent = 'IT · ' + ((emailSettings && emailSettings.fromName) || 'Developer');

  const list = all.filter(b => (statusF === 'all' || b.status === statusF) && (sevF === 'all' || b.severity === sevF));
  const sel = selId ? all.find(b => b.id === selId) : null;
  React.useEffect(() => { const c = scroll.current; if (c) c.scrollTop = c.scrollHeight; }, [selId, sel && sel.thread && sel.thread.length]);

  const mutate = (id, fn) => { const next = window.loadBugs().map(b => b.id === id ? fn({ ...b }) : b); window.saveBugs(next); refresh(); };
  const setStatus = (b, status) => {
    if (status === 'fixed') {
      confirm({ title: 'Mark ' + b.id + ' as fixed?', body: 'The reporter is notified and sees a “Fixed” banner.', prompt: { label: 'Resolution note (shown to the reporter)', placeholder: 'e.g. Fixed in v15.21 — rounding corrected.', required: true }, confirmLabel: 'Mark fixed', tone: 'primary', icon: 'check', onConfirm: (note) => { mutate(b.id, x => { x.status = 'fixed'; x.resolvedAt = dtStamp(); x.resolution = note; x.notified = false; x.statusHistory = [...(x.statusHistory || []), { status: 'fixed', ts: dtStamp() }]; return x; }); toast(b.id + ' marked fixed'); } });
      return;
    }
    mutate(b.id, x => { x.status = status; x.statusHistory = [...(x.statusHistory || []), { status, ts: dtStamp() }]; return x; });
    toast(b.id + ' → ' + (BS[status] || {}).label);
  };
  const sendItReply = () => {
    if (!reply.trim()) return;
    mutate(selId, x => { x.thread = [...(x.thread || []), { id: 'it' + Date.now(), from: 'it', author: agent, ts: dtStamp(), body: reply.trim(), images: [] }]; return x; });
    setReply(''); toast('Reply sent to reporter');
  };

  const counts = { all: all.length, open: all.filter(b => b.status === 'open').length, in_progress: all.filter(b => b.status === 'in_progress').length, fixed: all.filter(b => b.status === 'fixed').length };

  return (
    <div style={{ maxWidth: 940 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {[['all', 'All'], ['open', 'Open'], ['in_progress', 'In progress'], ['fixed', 'Fixed']].map(([id, l]) => (
          <button key={id} onClick={() => setStatusF(id)} style={{ all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, background: statusF === id ? AT.ink : AT.panel, color: statusF === id ? '#fff' : AT.ink, border: `1px solid ${statusF === id ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{counts[id] != null ? counts[id] : ''}</span></button>
        ))}
        <ASelect label="Severity" value={sevF} onChange={setSevF} options={[{ value: 'all', label: 'All' }, { value: 'blocker', label: 'Blocker' }, { value: 'high', label: 'High' }, { value: 'normal', label: 'Normal' }, { value: 'low', label: 'Low' }]} />
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{list.length} of {all.length} reports</span>
      </div>

      <ATable columns={[{ label: 'ID' }, { label: 'Problem' }, { label: 'Severity' }, { label: 'Reporter' }, { label: 'Context' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {list.map(b => (
          <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => { setSelId(b.id); setReply(''); }}>
            <ATd mono strong>{b.id}</ATd>
            <ATd>{b.desc}<span style={{ display: 'block', fontSize: 11, color: AT.inkSoft }}>{b.category}{b.diag && b.diag.errors && b.diag.errors.length ? ' · ⚠ ' + b.diag.errors.length + ' error(s)' : ''}{(b.thread || []).length ? ' · ' + b.thread.length + ' msg' : ''}</span></ATd>
            <ATd><ABadge tone={sevTone[b.severity] || 'neutral'}>{b.severity}</ABadge></ATd>
            <ATd>{b.reporter || '—'}</ATd>
            <ATd><span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{b.diag ? b.diag.screen + ' · ' + b.diag.version : '—'}</span></ATd>
            <ATd><ABadge tone={(BS[b.status] || {}).tone || 'neutral'}>{(BS[b.status] || {}).label || b.status}</ABadge></ATd>
            <ATd align="right"><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
          </tr>
        ))}
      </ATable>
      {list.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No reports" sub="Nothing in this filter." /></div>}

      <ADrawer open={!!sel} onClose={() => setSelId(null)} width={640} title={sel ? sel.id : ''} sub={sel ? sel.desc : ''}>
        {sel && (() => {
          const BSx = BS[sel.status] || {};
          return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingBottom: 12, borderBottom: `1px solid ${AT.rule}` }}>
                <ABadge tone={sevTone[sel.severity] || 'neutral'}>{sel.severity}</ABadge>
                <ABadge tone={BSx.tone || 'neutral'}>{BSx.label || sel.status}</ABadge>
                <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>by {sel.reporter} · {sel.ts}</span>
                <div style={{ flex: 1 }} />
                <ASelect value={sel.status} onChange={(v) => setStatus(sel, v)} options={[{ value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In progress' }, { value: 'fixed', label: 'Mark fixed…' }]} />
              </div>

              {/* Diagnostics */}
              <div style={{ marginTop: 12, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 13 }}>
                <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 8 }}>Diagnostics</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
                  {sel.diag && [['Screen', sel.diag.screen], ['Role', sel.diag.role], ['Business', sel.diag.business], ['Market', sel.diag.market], ['Viewport', sel.diag.viewport], ['Version', sel.diag.version]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 7, fontFamily: AT.body, fontSize: 12 }}><span style={{ color: AT.inkSoft, minWidth: 64 }}>{k}</span><span style={{ color: AT.ink, fontWeight: 600 }}>{v}</span></div>
                  ))}
                </div>
                {sel.steps && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${AT.ruleSoft}` }}><div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, marginBottom: 3 }}>STEPS</div><div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sel.steps}</div></div>}
                {sel.diag && sel.diag.errors && sel.diag.errors.length > 0 && <pre style={{ margin: '10px 0 0', maxHeight: 90, overflow: 'auto', background: '#1A1A19', color: '#FFB4B4', borderRadius: 7, padding: 10, fontFamily: AT.mono, fontSize: 10.5, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{sel.diag.errors.join('\n')}</pre>}
                {(sel.shots || []).length > 0 && <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>{sel.shots.map((s, i) => s.type === 'video' ? <video key={i} src={s.url} controls style={{ width: 96, height: 72, borderRadius: 7, background: '#000' }} /> : <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}><img src={s.url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 7, border: `1px solid ${AT.rule}` }} /></a>)}</div>}
              </div>

              {/* Conversation with reporter */}
              <div ref={scroll} style={{ flex: 1, minHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 2px', marginTop: 12, background: AT.surfaceAlt, borderRadius: AT.radiusSm }}>
                <div style={{ textAlign: 'center', fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>Conversation with reporter · {(sel.thread || []).length} messages</div>
                {(sel.thread || []).map(m => {
                  const itSide = m.from === 'it';
                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: itSide ? 'flex-end' : 'flex-start', gap: 4 }}>
                      <div style={{ display: 'flex', gap: 7, padding: '0 4px' }}><span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: itSide ? '#21438C' : AT.ink }}>{m.author}</span><span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft }}>{m.ts}</span></div>
                      <div style={{ maxWidth: '82%', background: itSide ? AT.accent : AT.panel, color: itSide ? '#fff' : AT.ink, border: itSide ? 'none' : `1px solid ${AT.rule}`, borderRadius: 13, padding: '9px 12px', fontFamily: AT.body, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.body}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
                <textarea value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendItReply(); } }} rows={1} placeholder="Reply to the reporter as IT… (⌘↵)" style={{ flex: 1, resize: 'none', minHeight: 40, maxHeight: 120, padding: '10px 13px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontSize: 13.5, color: AT.ink, outline: 'none', lineHeight: 1.4, boxSizing: 'border-box' }} />
                <button onClick={sendItReply} disabled={!reply.trim()} style={{ all: 'unset', cursor: reply.trim() ? 'pointer' : 'not-allowed', height: 40, padding: '0 16px', borderRadius: AT.radiusSm, background: reply.trim() ? AT.accent : AT.surfaceAlt, color: reply.trim() ? '#fff' : AT.inkSoft, display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: AT.body, fontWeight: 700, fontSize: 13, flexShrink: 0 }}><AIcon name="send" size={15} color={reply.trim() ? '#fff' : AT.inkSoft} /> Send</button>
              </div>
            </div>
          );
        })()}
      </ADrawer>
    </div>
  );
}

// ── Feature flags ────────────────────────────────────────────
function DevFlags({ ctx }) {
  const { toast, env } = ctx;
  const [flags, setFlags] = React.useState(() => dtLoad(FLAGS_KEY, seedFlags));
  const save = (next) => { setFlags(next); dtSave(FLAGS_KEY, next); };
  const toggle = (key, e) => save(flags.map(f => f.key === key ? { ...f, envs: { ...f.envs, [e]: !f.envs[e] } } : f));
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginBottom: 16 }}>Turn features on per environment. You are viewing <strong style={{ color: AT.ink }}>{env}</strong>.</div>
      <ATable columns={[{ label: 'Feature' }, { label: 'Production', align: 'center' }, { label: 'Staging', align: 'center' }, { label: 'Local', align: 'center' }]}>
        {flags.map(f => (
          <tr key={f.key}>
            <ATd><div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{f.label}</div><div style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{f.key}</div><div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginTop: 2 }}>{f.desc}</div></ATd>
            {ENVS.map(e => (
              <ATd key={e} align="center"><button onClick={() => toggle(f.key, e)} title={f.envs[e] ? 'On' : 'Off'} style={{ all: 'unset', cursor: 'pointer', width: 42, height: 24, borderRadius: 999, background: f.envs[e] ? AT.accent : AT.rule, position: 'relative', display: 'inline-block', verticalAlign: 'middle', outline: e === env ? `2px solid ${AT.ink}` : 'none', outlineOffset: 2 }}><span style={{ position: 'absolute', top: 2, left: f.envs[e] ? 20 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} /></button></ATd>
            ))}
          </tr>
        ))}
      </ATable>
      <div style={{ marginTop: 12 }}><ABtn kind="soft" size="sm" onClick={() => { save(seedFlags()); toast('Flags reset to defaults'); }}>Reset to defaults</ABtn></div>
    </div>
  );
}

// ── API tokens ───────────────────────────────────────────────
function DevTokens({ ctx }) {
  const { toast, confirm } = ctx;
  const [tokens, setTokens] = React.useState(() => dtLoad(TOKENS_KEY, seedTokens));
  const save = (next) => { setTokens(next); dtSave(TOKENS_KEY, next); };
  const [draft, setDraft] = React.useState(null);
  const [reveal, setReveal] = React.useState(null);
  const gen = () => 'sk_live_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const create = () => {
    if (!draft.name.trim()) { toast('Name the token'); return; }
    const full = gen();
    const rec = { id: 't' + Date.now(), name: draft.name.trim(), token: full.slice(0, 9) + '…' + full.slice(-4), full, scope: draft.scope, created: dtStamp().slice(0, 10), lastUsed: '—', status: 'active' };
    save([rec, ...tokens]); setDraft(null); setReveal(rec.id);
    if (ctx.log) ctx.log('settings', 'Created API token', rec.name, rec.scope);
    toast('Token created — copy it now, it won’t be shown again');
  };
  const revoke = (t) => confirm({ title: 'Revoke “' + t.name + '”?', body: 'Any integration using this token will stop working immediately.', confirmLabel: 'Revoke token', icon: 'shield', tone: 'danger', onConfirm: () => { save(tokens.map(x => x.id === t.id ? { ...x, status: 'revoked' } : x)); toast('Token revoked'); } });
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>Programmatic access for scripts & integrations — scoped and revocable. Never share a personal login.</div>
        <ABtn kind="primary" onClick={() => setDraft({ name: '', scope: 'read' })}><AIcon name="plus" size={15} /> New token</ABtn>
      </div>
      <ATable columns={[{ label: 'Name' }, { label: 'Token' }, { label: 'Scope' }, { label: 'Created' }, { label: 'Last used' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {tokens.map(t => (
          <tr key={t.id}>
            <ATd strong>{t.name}</ATd>
            <ATd mono>{reveal === t.id && t.full ? t.full : t.token}{reveal === t.id && t.full ? <button onClick={() => { try { navigator.clipboard.writeText(t.full); } catch (e) {} toast('Copied'); }} style={{ all: 'unset', cursor: 'pointer', marginLeft: 8, color: AT.accent, fontFamily: AT.body, fontWeight: 600, fontSize: 11.5 }}>Copy</button> : null}</ATd>
            <ATd><ABadge tone={t.scope === 'write' ? 'warn' : 'neutral'}>{t.scope}</ABadge></ATd>
            <ATd mono>{t.created}</ATd>
            <ATd mono>{t.lastUsed}</ATd>
            <ATd><ABadge tone={t.status === 'active' ? 'ok' : 'danger'}>{t.status}</ABadge></ATd>
            <ATd align="right">{t.status === 'active' ? <ABtn kind="ghost" size="sm" onClick={() => revoke(t)}>Revoke</ABtn> : <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>—</span>}</ATd>
          </tr>
        ))}
      </ATable>

      <ADrawer open={!!draft} onClose={() => setDraft(null)} width={420} title="New API token"
        footer={draft && (<><ABtn kind="ghost" onClick={() => setDraft(null)}>Cancel</ABtn><ABtn kind="primary" onClick={create}><AIcon name="check" size={15} /> Create token</ABtn></>)}>
        {draft && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AField label="Name" hint="What uses this token?"><AInput value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Mobile app · production" /></AField>
            <AField label="Scope"><ASelect value={draft.scope} onChange={v => setDraft({ ...draft, scope: v })} options={[{ value: 'read', label: 'Read only' }, { value: 'write', label: 'Read & write' }]} /></AField>
            <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.5 }}>The full token is shown once after creation. Store it somewhere safe — you can always revoke and re-create.</div>
          </div>
        )}
      </ADrawer>
    </div>
  );
}

// ── Environment ──────────────────────────────────────────────
function DevEnv({ ctx }) {
  const { env, setEnv, toast, confirm } = ctx;
  const tone = { Production: { bg: '#E7F4EC', fg: '#1F6B3C' }, Staging: { bg: '#FFF4E0', fg: '#7A5200' }, Local: { bg: '#E7F0FF', fg: '#21438C' } };
  const resetDemo = () => confirm({ title: 'Reset all demo data?', body: 'Clears locally-stored orders, settings, tabs, views, reports and flags, then reloads with fresh seed data. Useful on staging/local.', confirmLabel: 'Reset & reload', icon: 'refund', tone: 'danger', onConfirm: () => { try { Object.keys(localStorage).filter(k => k.startsWith('shhh_admin')).forEach(k => localStorage.removeItem(k)); } catch (e) {} location.reload(); } });
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 4 }}>Environment</div>
        <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 14 }}>Switch the environment this console points at. Non-production shows a coloured badge in the header so nobody confuses it with live.</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {ENVS.map(e => (
            <button key={e} onClick={() => { setEnv(e); toast('Environment → ' + e); }} style={{ all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: AT.radiusSm, border: `1px solid ${env === e ? AT.ink : AT.rule}`, background: env === e ? (tone[e] || {}).bg : AT.panel, color: env === e ? (tone[e] || {}).fg : AT.inkSoft, fontFamily: AT.body, fontWeight: 700, fontSize: 13.5 }}>{e}{env === e ? ' ✓' : ''}</button>
          ))}
        </div>
      </APanel>
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 12 }}>Build</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {[['Version', 'v15.20'], ['Commit', 'a3f9c21'], ['Deployed', '2026-06-04 09:10'], ['Channel', env]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 8, fontFamily: AT.body, fontSize: 13 }}><span style={{ color: AT.inkSoft, minWidth: 72 }}>{k}</span><span style={{ color: AT.ink, fontWeight: 600, fontFamily: AT.mono }}>{v}</span></div>
          ))}
        </div>
      </APanel>
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 4 }}>Test data</div>
        <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 14 }}>Restore the seeded demo dataset. Safe on Staging/Local; avoid on Production.</div>
        <ABtn kind="ghost" onClick={resetDemo} style={{ color: AT.danger, borderColor: AT.danger }}><AIcon name="refund" size={15} color={AT.danger} /> Reset demo data</ABtn>
      </APanel>
    </div>
  );
}

function ADevTools({ ctx, nav }) {
  const [tab, setTab] = React.useState('queue');
  const tabs = [['queue', 'Bug queue'], ['flags', 'Feature flags'], ['tokens', 'API tokens'], ['env', 'Environment']];
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 22, overflowX: 'auto' }}>
        {tabs.map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22, fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft, borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent', whiteSpace: 'nowrap' }}>{l}</button>
        ))}
      </div>
      {tab === 'queue' && <DevBugQueue ctx={ctx} />}
      {tab === 'flags' && <DevFlags ctx={ctx} />}
      {tab === 'tokens' && <DevTokens ctx={ctx} />}
      {tab === 'env' && <DevEnv ctx={ctx} />}
    </div>
  );
}

Object.assign(window, { ADevTools });
