/* Shhh Admin — screen 5: Discounts & campaigns. */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function DiscountsScreen() {
    const [promos, setPromos] = useState(SHOP_PROMO.promos);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ code: '', type: 'percent', value: '10', appliesTo: 'Entire order' });

    const togglePause = (p) => {
      const next = p.status === 'paused' ? 'active' : 'paused';
      p.status = next;
      setPromos([...promos]);
      UI.toast(`${p.code} ${next === 'paused' ? 'paused' : 'resumed'}`);
    };

    const create = () => {
      const code = form.code.trim().toUpperCase();
      if (!code) { UI.toast('Give the code a name', 'danger'); return; }
      if (promos.some(p => p.code === code)) { UI.toast('That code already exists', 'danger'); return; }
      const promo = {
        id: 'PR-' + (promos.length + 1).toString().padStart(2, '0'),
        code, type: form.type,
        value: form.type === 'shipping' ? 0 : Math.max(0, parseFloat(form.value) || 0),
        status: 'active', starts: new Date(D.NOW).toISOString().slice(0, 10), ends: null,
        used: 0, limit: null, appliesTo: form.appliesTo, note: 'Created in admin',
      };
      SHOP_PROMO.promos.unshift(promo);
      setPromos([...SHOP_PROMO.promos]);
      setCreating(false);
      setForm({ code: '', type: 'percent', value: '10', appliesTo: 'Entire order' });
      UI.toast(`Discount ${code} created`);
    };

    const activeCount = promos.filter(p => p.status === 'active').length;
    const totalUses = promos.reduce((s, p) => s + p.used, 0);

    return (
      <AdminViews.Page title="Discounts"
        description={`${activeCount} active codes · ${totalUses.toLocaleString()} total redemptions`}
        actions={<UI.Button icon="plus" onClick={() => setCreating(true)}>New discount</UI.Button>}>

        <UI.Card pad={16} style={{ marginBottom: 16 }}>
          <UI.Table
            rowKey={p => p.id}
            columns={[
              { key: 'code', label: 'Code', render: p => (
                <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 13.5 }}>{p.code}</span>
              )},
              { key: 'value', label: 'Value', render: p => <UI.Badge tone="accent">{SHOP_PROMO.typeLabel(p)}</UI.Badge> },
              { key: 'appliesTo', label: 'Applies to', render: p => <span style={{ color: T.sub }}>{p.appliesTo}</span> },
              { key: 'window', label: 'Window', render: p => (
                <span style={{ color: T.sub, fontSize: 12.5 }}>{p.starts}{p.ends ? ' → ' + p.ends : ' → ∞'}</span>
              )},
              { key: 'used', label: 'Used', align: 'right', render: p => (
                <span style={{ fontFamily: T.mono, fontSize: 12.5 }}>{p.used}{p.limit ? ' / ' + p.limit : ''}</span>
              )},
              { key: 'status', label: 'Status', render: p => <UI.StatusBadge status={p.status} /> },
              { key: 'actions', label: '', align: 'right', render: p => (
                (p.status === 'active' || p.status === 'paused') ? (
                  <UI.Button size="sm" variant="subtle" onClick={() => togglePause(p)}>
                    {p.status === 'paused' ? 'Resume' : 'Pause'}
                  </UI.Button>
                ) : null
              )},
            ]}
            rows={promos} />
        </UI.Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <UI.Card title="Campaigns">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SHOP_PROMO.campaigns.map(c => {
                const roas = c.spend ? (c.revenue / c.spend).toFixed(1) : null;
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: T.faint }}>{c.channel} · from {c.starts}</div>
                    </div>
                    {roas && <UI.Badge tone={roas >= 4 ? 'ok' : 'warn'}>{roas}× ROAS</UI.Badge>}
                    <UI.StatusBadge status={c.status} />
                  </div>
                );
              })}
            </div>
          </UI.Card>

          <UI.Card title="Redemptions by code">
            <UI.HBars data={promos.filter(p => p.used > 0).sort((a, b) => b.used - a.used).slice(0, 5)
              .map(p => ({ name: p.code, value: p.used }))} />
          </UI.Card>
        </div>

        {creating && (
          <UI.Modal title="New discount" onClose={() => setCreating(false)} footer={
            <React.Fragment>
              <UI.Button variant="ghost" onClick={() => setCreating(false)}>Cancel</UI.Button>
              <UI.Button icon="check" onClick={create}>Create discount</UI.Button>
            </React.Fragment>
          }>
            <UI.Field label="Code" hint="Customers type this at checkout. It will be upper-cased.">
              <UI.Input value={form.code} placeholder="e.g. SUMMERHUSH"
                onChange={e => setForm({ ...form, code: e.target.value })} style={{ fontFamily: T.mono }} />
            </UI.Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <UI.Field label="Type">
                <UI.Select value={form.type} onChange={v => setForm({ ...form, type: v })} options={[
                  { value: 'percent', label: 'Percentage off' },
                  { value: 'fixed', label: 'Fixed amount off' },
                  { value: 'shipping', label: 'Free shipping' },
                ]} />
              </UI.Field>
              {form.type !== 'shipping' && (
                <UI.Field label={form.type === 'percent' ? 'Percent (%)' : 'Amount (€)'}>
                  <UI.Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                </UI.Field>
              )}
            </div>
            <UI.Field label="Applies to">
              <UI.Select value={form.appliesTo} onChange={v => setForm({ ...form, appliesTo: v })} options={[
                { value: 'Entire order', label: 'Entire order' },
                ...SHOP_DATA.categories.map(c => ({ value: c.name, label: c.name })),
              ]} />
            </UI.Field>
          </UI.Modal>
        )}
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Discounts = DiscountsScreen;
})();
