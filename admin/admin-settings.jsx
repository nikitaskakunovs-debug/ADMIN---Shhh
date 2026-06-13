// admin-settings.jsx — expanded Settings sub-panels: Team & roles, Tax/VAT,
// Shipping zones, Store profile, Notifications preferences.

const SETTINGS_TEAM = [
  { name: 'Olivia Williams', email: 'olivia@shhh.lv', role: 'owner', active: true },
  { name: 'Jānis Krūmiņš', email: 'janis@shhh.lv', role: 'fulfilment', active: true },
  { name: 'Marta Liepa', email: 'marta@shhh.lv', role: 'support', active: true },
  { name: 'Edgars V.', email: 'edgars@shhh.lv', role: 'content', active: false },
];

function panelTitle(t, sub) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>{t}</div>
      {sub && <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Team & roles ─────────────────────────────────────────────
function SettingsTeam({ ctx }) {
  const { toast, confirm } = ctx;
  const TEAM_KEY = 'shhh_admin_team';
  const [team, setTeamState] = React.useState(() => { try { const s = JSON.parse(localStorage.getItem(TEAM_KEY) || 'null'); if (Array.isArray(s) && s.length) return s; } catch (e) {} return SETTINGS_TEAM.map(m => ({ ...m, markets: m.markets || [] })); });
  const setTeam = (updater) => setTeamState(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; try { localStorage.setItem(TEAM_KEY, JSON.stringify(next)); } catch (e) {} return next; });
  const [editing, setEditing] = React.useState(null); // { orig, name, email, role, markets, active }
  const roleKeys = Object.keys(window.ADMIN_ROLES || {});
  const markets = window.MARKETS || [];
  const setRole = (email, role) => { setTeam(prev => prev.map(m => m.email === email ? { ...m, role } : m)); toast('Role updated'); };
  const doToggle = (email) => setTeam(prev => prev.map(m => m.email === email ? { ...m, active: !m.active } : m));
  const toggleActive = (m) => {
    if (!m.active) { doToggle(m.email); return; }
    confirm({ title: `Disable ${m.name}?`, body: `${m.name} will immediately lose access to the back-office. You can re-enable them later.`, confirmLabel: 'Yes, disable access', icon: 'shield', tone: 'danger', onConfirm: () => doToggle(m.email) });
  };
  const scopeLabel = (m) => (!m.markets || m.markets.length === 0) ? 'All markets' : m.markets.join(' · ');
  const newUser = () => setEditing({ orig: null, name: '', email: '', role: 'support', markets: [], active: true });
  const editUser = (m) => setEditing({ orig: m.email, name: m.name, email: m.email, role: m.role, markets: m.markets || [], active: m.active });
  const saveUser = () => {
    const e = editing;
    if (!e.name.trim() || !e.email.trim()) { toast('Name and email are required'); return; }
    if (!/.+@.+\..+/.test(e.email)) { toast('Enter a valid email'); return; }
    const rec = { name: e.name.trim(), email: e.email.trim(), role: e.role, markets: e.markets, active: e.active };
    setTeam(prev => {
      if (e.orig) return prev.map(m => m.email === e.orig ? rec : m);
      if (prev.some(m => m.email === rec.email)) { toast('That email already has access'); return prev; }
      return [...prev, rec];
    });
    if (ctx.log) ctx.log('settings', e.orig ? 'Updated user' : 'Created user', rec.email, (window.ADMIN_ROLES[rec.role] || {}).label || rec.role);
    toast(e.orig ? 'User updated' : 'User created · invite emailed to ' + rec.email);
    setEditing(null);
  };
  const removeUser = (m) => confirm({ title: `Remove ${m.name}?`, body: `${m.name} (${m.email}) will lose all access. This can’t be undone.`, confirmLabel: 'Yes, remove', icon: 'trash', tone: 'danger', onConfirm: () => { setTeam(prev => prev.filter(x => x.email !== m.email)); toast('User removed'); } });

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        {panelTitle('Team members', 'Create users, set their role, and limit them to specific markets.')}
        <ABtn kind="primary" onClick={newUser}><AIcon name="plus" size={15} /> Add user</ABtn>
      </div>
      <ATable columns={[{ label: 'Member' }, { label: 'Role' }, { label: 'Markets' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {team.map(m => (
          <tr key={m.email}>
            <ATd strong><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><AAvatar name={m.name} size={30} /><span>{m.name}<span style={{ display: 'block', fontWeight: 400, fontSize: 11.5, color: AT.inkSoft }}>{m.email}</span></span></span></ATd>
            <ATd><ASelect value={m.role} onChange={v => setRole(m.email, v)} options={roleKeys.map(r => ({ value: r, label: (window.ADMIN_ROLES[r] || {}).label || r }))} /></ATd>
            <ATd><span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{scopeLabel(m)}</span></ATd>
            <ATd><ABadge tone={m.active ? 'ok' : 'neutral'}>{m.active ? 'Active' : 'Disabled'}</ABadge></ATd>
            <ATd align="right"><span style={{ display: 'inline-flex', gap: 6 }}><ABtn kind="ghost" size="sm" onClick={() => editUser(m)}>Edit</ABtn><ABtn kind="ghost" size="sm" onClick={() => toggleActive(m)}>{m.active ? 'Disable' : 'Enable'}</ABtn></span></ATd>
          </tr>
        ))}
      </ATable>

      <div style={{ marginTop: 22 }}>
        {panelTitle('What each role can open', 'Toggle the sections each role can access — changes apply immediately and persist.')}
        {(() => {
          const ALL_SECTIONS = Array.from(new Set([].concat(...Object.values(window.ROLE_NAV || {}))));
          const secLabel = (s) => { const n = (window.NAV_ITEMS || []).find(i => i.id === s); return n ? n.label : (s.charAt(0).toUpperCase() + s.slice(1)); };
          const toggleSec = (role, s) => {
            if (s === 'dashboard') { toast('Dashboard is always available'); return; }
            const cur = (window.ROLE_NAV[role] || []).slice();
            const next = cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s];
            ctx.setRolePerms(role, next);
          };
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {roleKeys.map(r => (
                <APanel key={r} pad={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: AT.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.body, fontWeight: 800, fontSize: 11 }}>{(window.ADMIN_ROLES[r] || {}).short}</span>
                    <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{(window.ADMIN_ROLES[r] || {}).label}</span>
                    <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{(window.ROLE_NAV[r] || []).length} sections</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ALL_SECTIONS.map(s => {
                      const on = (window.ROLE_NAV[r] || []).includes(s);
                      const locked = s === 'dashboard';
                      return (
                        <button key={s} onClick={() => toggleSec(r, s)} title={locked ? 'Always available' : (on ? 'Click to remove' : 'Click to add')} style={{
                          all: 'unset', cursor: locked ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 9px', borderRadius: 999, fontFamily: AT.body, fontSize: 11.5, fontWeight: 600,
                          textTransform: 'capitalize', opacity: locked ? 0.6 : 1,
                          background: on ? AT.accentSoft : AT.surfaceAlt, color: on ? AT.accent : AT.inkSoft,
                          border: `1px solid ${on ? AT.accent : 'transparent'}`,
                        }}>
                          <AIcon name={on ? 'check' : 'plus'} size={11} color={on ? AT.accent : AT.inkSoft} />{secLabel(s)}
                        </button>
                      );
                    })}
                  </div>
                </APanel>
              ))}
            </div>
          );
        })()}
      </div>

      <ADrawer open={!!editing} onClose={() => setEditing(null)} width={440} title={editing && editing.orig ? 'Edit user' : 'Add a new user'} sub={editing && editing.orig ? editing.orig : 'They’ll get an email invite to set a password'}
        footer={editing && (<><ABtn kind="ghost" onClick={() => setEditing(null)}>Cancel</ABtn>{editing.orig && <ABtn kind="ghost" onClick={() => { const m = team.find(x => x.email === editing.orig); setEditing(null); m && removeUser(m); }} style={{ color: AT.danger }}>Remove</ABtn>}<ABtn kind="primary" onClick={saveUser}><AIcon name="check" size={15} /> {editing.orig ? 'Save changes' : 'Create user'}</ABtn></>)}>
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AField label="Full name"><AInput value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Anna Bērziņa" /></AField>
            <AField label="Work email"><AInput value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="name@shhh.lv" type="email" /></AField>
            <AField label="Role" hint={((window.ROLE_NAV || {})[editing.role] || []).length + ' sections · ' + ((window.ADMIN_ROLES[editing.role] || {}).desc || '')}>
              <ASelect value={editing.role} onChange={v => setEditing({ ...editing, role: v })} options={roleKeys.map(r => ({ value: r, label: (window.ADMIN_ROLES[r] || {}).label || r }))} />
            </AField>
            <AField label="Market access" hint="Leave empty for all markets, or pick the countries this user may work in.">
              {markets.length ? <AMultiSelect label="Markets" value={editing.markets} onChange={v => setEditing({ ...editing, markets: v })} options={markets.map(mk => ({ value: mk.id, label: mk.country + (mk.status === 'planned' ? ' (soon)' : '') }))} /> : <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>All markets</span>}
            </AField>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '11px 13px', borderRadius: AT.radiusSm, background: AT.surfaceAlt }}>
              <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
              <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>Active <span style={{ fontWeight: 400, color: AT.inkSoft }}>— can sign in right away</span></span>
            </label>
          </div>
        )}
      </ADrawer>
    </div>
  );
}

// ── Tax / VAT ────────────────────────────────────────────────
function SettingsTax({ ctx }) {
  const { toast } = ctx;
  const [rate, setRate] = React.useState(Math.round((window.VAT_RATE || 0.21) * 100));
  const [pricesIncl, setPricesIncl] = React.useState(true);
  const [vatId, setVatId] = React.useState('LV40203456789');
  const reduced = [['Standard', rate + '%', 'Most products'], ['Reduced', '12%', 'n/a for adult goods'], ['Zero', '0%', 'Exports outside EU']];
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <APanel pad={20}>
        {panelTitle('VAT configuration', 'Latvia standard rate. Storefront prices are shown VAT-inclusive.')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AField label="Standard VAT rate (%)"><AInput type="number" value={rate} onChange={e => setRate(e.target.value)} /></AField>
          <AField label="VAT registration no."><AInput value={vatId} onChange={e => setVatId(e.target.value)} /></AField>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: AT.radiusSm, background: AT.surfaceAlt, marginTop: 14 }}>
          <input type="checkbox" checked={pricesIncl} onChange={e => setPricesIncl(e.target.checked)} />
          <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>Catalog prices include VAT</span>
        </label>
        <div style={{ marginTop: 14 }}><ABtn kind="primary" onClick={() => toast('Tax settings saved')}>Save tax settings</ABtn></div>
      </APanel>
      <APanel pad={20}>
        {panelTitle('Rates')}
        <ATable columns={[{ label: 'Rate' }, { label: 'Value' }, { label: 'Applies to' }]}>
          {reduced.map(([n, v, a]) => (<tr key={n}><ATd strong>{n}</ATd><ATd mono>{v}</ATd><ATd>{a}</ATd></tr>))}
        </ATable>
      </APanel>
    </div>
  );
}

// ── Shipping zones ───────────────────────────────────────────
function SettingsShipping({ ctx }) {
  const { toast, confirm } = ctx;
  const [zones, setZones] = React.useState([
    { zone: 'Latvia', methods: 'Omniva, DPD, Venipak, Pasts', rate: 2.5, free: 60 },
    { zone: 'Estonia', methods: 'Omniva, DPD', rate: 4.5, free: 80 },
    { zone: 'Lithuania', methods: 'Omniva, Venipak', rate: 4.5, free: 80 },
    { zone: 'EU (rest)', methods: 'DPD', rate: 9.9, free: 150 },
  ]);
  const set = (i, k, v) => setZones(prev => prev.map((z, j) => j === i ? { ...z, [k]: v } : z));
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        {panelTitle('Shipping zones', 'Rates and free-shipping thresholds per region. All parcels ship plain & unbranded.')}
        <ABtn kind="primary" onClick={() => toast('New zone (demo)')}><AIcon name="plus" size={15} /> Add zone</ABtn>
      </div>
      <ATable columns={[{ label: 'Zone' }, { label: 'Methods' }, { label: 'Rate (€)', align: 'right' }, { label: 'Free over (€)', align: 'right' }, { label: '', align: 'right' }]}>
        {zones.map((z, i) => (
          <tr key={z.zone}>
            <ATd strong>{z.zone}</ATd>
            <ATd>{z.methods}</ATd>
            <ATd align="right"><input type="number" value={z.rate} onChange={e => set(i, 'rate', e.target.value)} style={{ width: 70, textAlign: 'right', height: 30, padding: '0 8px', borderRadius: 6, border: `1px solid ${AT.rule}`, fontFamily: AT.mono, fontSize: 12.5, outline: 'none' }} /></ATd>
            <ATd align="right"><input type="number" value={z.free} onChange={e => set(i, 'free', e.target.value)} style={{ width: 70, textAlign: 'right', height: 30, padding: '0 8px', borderRadius: 6, border: `1px solid ${AT.rule}`, fontFamily: AT.mono, fontSize: 12.5, outline: 'none' }} /></ATd>
            <ATd align="right"><ABtn kind="ghost" size="sm" onClick={() => confirm({ title: `Remove the ${z.zone} zone?`, body: 'Orders to this region will fall back to your default rate. This cannot be undone.', confirmLabel: 'Yes, remove zone', icon: 'trash', tone: 'danger', onConfirm: () => { setZones(prev => prev.filter((_, j) => j !== i)); toast(`${z.zone} removed`); } })}>Remove</ABtn></ATd>
          </tr>
        ))}
      </ATable>
      <div style={{ marginTop: 14 }}><ABtn kind="primary" onClick={() => toast('Shipping zones saved')}>Save zones</ABtn></div>
    </div>
  );
}

// ── Store profile ────────────────────────────────────────────
function SettingsStore({ ctx }) {
  const { toast } = ctx;
  const [d, setD] = React.useState({ name: 'Shhh', legal: 'NL Trading Co SIA', billing: 'NL Trading Co', reg: '40203456789', email: 'support@shhh.lv', phone: '+371 6700 0000', address: 'Brīvības iela 68 – 14, Rīga, LV-1011', currency: 'EUR', theme: 'light' });
  const set = (k, v) => setD({ ...d, [k]: v });
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <APanel pad={20}>
        {panelTitle('Store profile', 'Legal identity and the discreet billing descriptor shown on bank statements.')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AField label="Store name"><AInput value={d.name} onChange={e => set('name', e.target.value)} /></AField>
          <AField label="Legal entity"><AInput value={d.legal} onChange={e => set('legal', e.target.value)} /></AField>
          <AField label="Billing descriptor" hint="Shown on card statements"><AInput value={d.billing} onChange={e => set('billing', e.target.value)} /></AField>
          <AField label="Reg. number"><AInput value={d.reg} onChange={e => set('reg', e.target.value)} /></AField>
          <AField label="Support email"><AInput value={d.email} onChange={e => set('email', e.target.value)} /></AField>
          <AField label="Phone"><AInput value={d.phone} onChange={e => set('phone', e.target.value)} /></AField>
        </div>
        <div style={{ marginTop: 14 }}><AField label="Registered address"><AInput value={d.address} onChange={e => set('address', e.target.value)} /></AField></div>
        <div style={{ marginTop: 14 }}><ABtn kind="primary" onClick={() => toast('Store profile saved')}>Save profile</ABtn></div>
      </APanel>
      <APanel pad={20}>
        {panelTitle('Appearance', 'Admin theme preference.')}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']].map(([id, l]) => (
            <button key={id} onClick={() => { set('theme', id); toast(`Theme → ${l}`); }} style={{ all: 'unset', cursor: 'pointer', padding: '9px 16px', borderRadius: AT.radiusSm, background: d.theme === id ? AT.ink : AT.panel, color: d.theme === id ? '#fff' : AT.ink, border: `1px solid ${d.theme === id ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{l}</button>
          ))}
        </div>
      </APanel>
    </div>
  );
}

// ── Notification preferences ─────────────────────────────────
function SettingsNotif({ ctx }) {
  const { toast } = ctx;
  const [prefs, setPrefs] = React.useState({
    newOrder: { email: true, push: true }, payment: { email: true, push: false },
    lowStock: { email: true, push: true }, review: { email: false, push: true },
    returnClaim: { email: true, push: true }, payout: { email: true, push: false },
  });
  const rows = [['newOrder', 'New paid order'], ['payment', 'Awaiting / failed payment'], ['lowStock', 'Low stock'], ['review', 'Review to moderate'], ['returnClaim', 'Return / warranty claim'], ['payout', 'Payout settled']];
  const toggle = (k, ch) => setPrefs(prev => ({ ...prev, [k]: { ...prev[k], [ch]: !prev[k][ch] } }));
  return (
    <div style={{ maxWidth: 600 }}>
      <APanel pad={20}>
        {panelTitle('Notification preferences', 'Which events ping the team, and how.')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 28px', alignItems: 'center' }}>
          <span />
          <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', textAlign: 'center' }}>Email</span>
          <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', textAlign: 'center' }}>In-app</span>
          {rows.map(([k, l]) => (
            <React.Fragment key={k}>
              <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, padding: '12px 0', borderTop: `1px solid ${AT.ruleSoft}` }}>{l}</div>
              <div style={{ textAlign: 'center', borderTop: `1px solid ${AT.ruleSoft}`, padding: '12px 0' }}><input type="checkbox" checked={prefs[k].email} onChange={() => toggle(k, 'email')} /></div>
              <div style={{ textAlign: 'center', borderTop: `1px solid ${AT.ruleSoft}`, padding: '12px 0' }}><input type="checkbox" checked={prefs[k].push} onChange={() => toggle(k, 'push')} /></div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><ABtn kind="primary" onClick={() => toast('Notification preferences saved')}>Save preferences</ABtn></div>
      </APanel>
    </div>
  );
}

Object.assign(window, { SettingsTeam, SettingsTax, SettingsShipping, SettingsStore, SettingsNotif, SettingsEmail });

// ── Email identity & signature ───────────────────────────────
function SettingsEmail({ ctx }) {
  const { toast, emailSettings, setEmailSettings } = ctx;
  const [d, setD] = React.useState(emailSettings || { fromName: 'Olivia Williams', teamLine: 'shhh... Customer Care', signoff: 'Kind regards', footer: 'Discreet adult store · support@shhh.lv' });
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const logoRef = React.useRef(null);
  const onLogo = (e) => { const f = (e.target.files || [])[0]; if (f) { const rd = new FileReader(); rd.onload = () => set('logo', rd.result); rd.readAsDataURL(f); } e.target.value = ''; };
  const LogoMark = () => (d.logo
    ? <img src={d.logo} alt="logo" style={{ height: 26, maxWidth: 150, objectFit: 'contain', display: 'block' }} />
    : <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, letterSpacing: AT.ld }}>shhh...</span>);
  return (
    <div style={{ maxWidth: 760, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <APanel pad={20} style={{ flex: '1 1 340px' }}>
        {panelTitle('Email identity & signature', 'Used on every reply you send from Returns & warranty.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AField label="Your name" hint="Shown as the sender and in the signature (instead of your role)."><AInput value={d.fromName} onChange={e => set('fromName', e.target.value)} placeholder="e.g. Olivia Williams" /></AField>
          <AField label="Company logo" hint="Shown in the email footer. PNG/SVG with transparent background works best.">
            <input ref={logoRef} type="file" accept="image/*" onChange={onLogo} style={{ display: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 132, height: 50, borderRadius: AT.radiusSm, border: `1px dashed ${AT.rule}`, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}><LogoMark /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ABtn kind="soft" size="sm" onClick={() => logoRef.current && logoRef.current.click()}><AIcon name="catalog" size={14} /> {d.logo ? 'Replace logo' : 'Upload logo'}</ABtn>
                {d.logo && <button onClick={() => set('logo', null)} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.danger }}>Remove</button>}
              </div>
            </div>
          </AField>
          <AField label="Sign-off"><AInput value={d.signoff} onChange={e => set('signoff', e.target.value)} placeholder="Kind regards" /></AField>
          <AField label="Team line" hint="The line under your name."><AInput value={d.teamLine} onChange={e => set('teamLine', e.target.value)} placeholder="shhh... Customer Care" /></AField>
          <AField label="Footer" hint="Shown under the logo. Use multiple lines for address, hours, links, legal note, etc.">
            <textarea value={d.footer} onChange={e => set('footer', e.target.value)} rows={4} placeholder={'Discreet adult store · support@shhh.lv · +371 6700 0000\nNL Trading Co SIA · Brīvības iela 68, Rīga\nMon–Fri 9:00–18:00'}
              style={{ ...aInputStyle, height: 'auto', minHeight: 96, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }} />
          </AField>
        </div>
        <div style={{ marginTop: 16 }}><ABtn kind="primary" onClick={() => { setEmailSettings(d); toast('Email signature saved'); }}>Save signature</ABtn></div>
      </APanel>
      <APanel pad={20} style={{ flex: '1 1 280px' }}>
        {panelTitle('Live preview', 'How the bottom of each email looks.')}
        <div style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 16, fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.6, color: AT.ink }}>
          <div>Hi Marta,</div>
          <div style={{ marginTop: 11, color: AT.inkSoft }}>…your message…</div>
          <div style={{ marginTop: 15 }}>{d.signoff || 'Kind regards'},</div>
          <div style={{ fontWeight: 700 }}>{d.fromName || 'Your name'}</div>
          <div style={{ color: AT.inkSoft }}>{d.teamLine || 'shhh... Customer Care'}</div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${AT.rule}`, display: 'flex', alignItems: 'flex-start', gap: 9, flexWrap: 'wrap' }}>
            <LogoMark />
            <span style={{ fontFamily: AT.body, fontSize: 10.5, color: AT.inkSoft, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{d.footer || 'Discreet adult store · support@shhh.lv'}{'\n'}Re: RET-1042 · order #SH-24041</span>
          </div>
        </div>
      </APanel>
    </div>
  );
}
