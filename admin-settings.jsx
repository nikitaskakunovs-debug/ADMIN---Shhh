/* Shhh Admin — Settings: store profile, localisation, shipping,
   payments, team, danger zone. Tabs within one screen. */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function GeneralTab() {
    const [form, setForm] = useState({
      name: SHOP_DATA.store.name,
      tagline: SHOP_DATA.store.tagline,
      email: SHOP_DATA.store.supportEmail,
      domain: SHOP_DATA.store.domain,
    });
    const set = (k, v) => setForm({ ...form, [k]: v });
    return (
      <UI.Card title="Store profile" style={{ maxWidth: 640 }}>
        <UI.Field label="Store name"><UI.Input value={form.name} onChange={e => set('name', e.target.value)} /></UI.Field>
        <UI.Field label="Tagline"><UI.Input value={form.tagline} onChange={e => set('tagline', e.target.value)} /></UI.Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <UI.Field label="Support email"><UI.Input value={form.email} onChange={e => set('email', e.target.value)} /></UI.Field>
          <UI.Field label="Domain"><UI.Input value={form.domain} onChange={e => set('domain', e.target.value)} /></UI.Field>
        </div>
        <UI.Button icon="check" onClick={() => {
          SHOP_DATA.store.name = form.name; SHOP_DATA.store.tagline = form.tagline;
          SHOP_DATA.store.supportEmail = form.email; SHOP_DATA.store.domain = form.domain;
          UI.toast('Store profile saved');
        }}>Save</UI.Button>
      </UI.Card>
    );
  }

  function LocalesTab() {
    const [locales, setLocales] = useState(SHOP_I18N.locales);
    const [preview, setPreview] = useState('lv');
    const toggle = (l) => {
      if (l.code === SHOP_I18N.defaultLocale) { UI.toast("Can't disable the default locale", 'danger'); return; }
      l.enabled = !l.enabled;
      setLocales([...locales]);
      UI.toast(`${l.name} ${l.enabled ? 'enabled' : 'disabled'}`);
    };
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, alignItems: 'start' }}>
        <UI.Card title="Storefront languages">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {locales.map(l => (
              <div key={l.code} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {l.name}
                    {l.code === SHOP_I18N.defaultLocale && <UI.Badge tone="accent" style={{ marginLeft: 8 }}>default</UI.Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: T.faint }}>{l.coverage}% translated</div>
                </div>
                <UI.Toggle checked={l.enabled} onChange={() => toggle(l)} />
              </div>
            ))}
          </div>
        </UI.Card>

        <UI.Card title="Translation preview" action={
          <UI.Select value={preview} onChange={setPreview} style={{ width: 140, padding: '5px 10px' }}
            options={locales.map(l => ({ value: l.code, label: l.flag + ' ' + l.name }))} />
        } pad={14}>
          <UI.Table
            rowKey={k => k}
            columns={[
              { key: 'key', label: 'Key', render: k => <span style={{ fontFamily: T.mono, fontSize: 12 }}>{k}</span> },
              { key: 'en', label: 'English', render: k => <span style={{ color: T.sub }}>{SHOP_I18N.t('en', k)}</span>, wrap: true },
              { key: 'tr', label: 'Translation', render: k => {
                const has = SHOP_I18N.strings[preview] && SHOP_I18N.strings[preview][k] != null;
                return has ? <span>{SHOP_I18N.t(preview, k)}</span> : <UI.Badge tone="warn">missing</UI.Badge>;
              }, wrap: true },
            ]}
            rows={SHOP_I18N.keys()} />
        </UI.Card>
      </div>
    );
  }

  function ShippingTab() {
    const zones = [
      { name: 'Baltics', countries: 'LV, EE, LT', eta: '1–3 days', price: '€3.90 · free over €80' },
      { name: 'Nordics', countries: 'FI, SE, DK', eta: '2–5 days', price: '€5.90 · free over €80' },
      { name: 'EU', countries: 'All other EU', eta: '3–7 days', price: '€7.90 · free over €120' },
    ];
    return (
      <div style={{ maxWidth: 720 }}>
        <UI.Card title="Shipping zones" pad={14} style={{ marginBottom: 16 }}>
          <UI.Table
            rowKey={z => z.name}
            columns={[
              { key: 'name', label: 'Zone', render: z => <b>{z.name}</b> },
              { key: 'countries', label: 'Countries', render: z => <span style={{ color: T.sub }}>{z.countries}</span> },
              { key: 'eta', label: 'Delivery', render: z => <span style={{ color: T.sub }}>{z.eta}</span> },
              { key: 'price', label: 'Rate' },
            ]}
            rows={zones} />
        </UI.Card>
        <UI.Card title="Packaging">
          <UI.Toggle checked={true} onChange={() => UI.toast('Discreet packaging is part of the brand — always on 🤫', 'danger')}
            label="Discreet outer box (no logo, label says “apparel”)" />
        </UI.Card>
      </div>
    );
  }

  function PaymentsTab() {
    const [methods, setMethods] = useState([
      { id: 'card', name: 'Cards (Visa, MC, Amex)', fee: '2.9% + €0.25', on: true },
      { id: 'applepay', name: 'Apple Pay / Google Pay', fee: '2.9% + €0.25', on: true },
      { id: 'paypal', name: 'PayPal', fee: '3.4% + €0.35', on: true },
      { id: 'klarna', name: 'Klarna — pay later', fee: '4.2% + €0.45', on: true },
      { id: 'bank', name: 'Bank transfer', fee: 'free', on: false },
    ]);
    const toggle = m => {
      m.on = !m.on; setMethods([...methods]);
      UI.toast(`${m.name} ${m.on ? 'enabled' : 'disabled'}`);
    };
    return (
      <UI.Card title="Payment methods" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {methods.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UI.Icon name="card" size={17} color={T.sub} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: T.faint }}>fee {m.fee}</div>
              </div>
              <UI.Toggle checked={m.on} onChange={() => toggle(m)} />
            </div>
          ))}
        </div>
      </UI.Card>
    );
  }

  function TeamTab() {
    const team = [
      { name: 'Nikita Skakunovs', email: 'nikita.skakunovs@gmail.com', role: 'Owner' },
      { name: 'Anna Ozola', email: 'anna@shhh-store.example', role: 'Content' },
      { name: 'Marta Liepa', email: 'marta@shhh-store.example', role: 'Fulfilment' },
    ];
    return (
      <UI.Card title="Team" style={{ maxWidth: 560 }} action={
        <UI.Button size="sm" variant="ghost" icon="plus" onClick={() => UI.toast('Invites are stubbed in this demo', 'danger')}>Invite</UI.Button>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {team.map(m => (
            <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UI.Avatar name={m.name} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: T.faint }}>{m.email}</div>
              </div>
              <UI.Badge tone={m.role === 'Owner' ? 'accent' : 'neutral'}>{m.role}</UI.Badge>
            </div>
          ))}
        </div>
      </UI.Card>
    );
  }

  function DangerTab() {
    return (
      <UI.Card title="Danger zone" style={{ maxWidth: 560, borderColor: 'rgba(229,72,77,0.35)' }}>
        <div style={{ fontSize: 13.5, color: T.sub, marginBottom: 14 }}>
          Clears saved admin preferences (dashboard layout, etc.) from this browser. Demo data regenerates on reload.
        </div>
        <UI.Button variant="danger" icon="trash" onClick={() => {
          D.prefs.clearAll();
          UI.toast('Local preferences cleared — reloading');
          setTimeout(() => location.reload(), 900);
        }}>Reset local preferences</UI.Button>
      </UI.Card>
    );
  }

  function SettingsScreen() {
    const [tab, setTab] = useState('general');
    const tabs = {
      general: <GeneralTab />, locales: <LocalesTab />, shipping: <ShippingTab />,
      payments: <PaymentsTab />, team: <TeamTab />, danger: <DangerTab />,
    };
    return (
      <AdminViews.Page title="Settings" description="Store configuration and team">
        <UI.Tabs value={tab} onChange={setTab} tabs={[
          { value: 'general', label: 'General' },
          { value: 'locales', label: 'Languages' },
          { value: 'shipping', label: 'Shipping' },
          { value: 'payments', label: 'Payments' },
          { value: 'team', label: 'Team' },
          { value: 'danger', label: 'Danger zone' },
        ]} />
        {tabs[tab]}
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Settings = SettingsScreen;
})();
