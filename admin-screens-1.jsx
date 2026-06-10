/* Shhh Admin — screen 1: customisable Dashboard.
   A 12-column grid of widgets; drag the handle to reorder, × to remove,
   "Add card" to restore. Layout persists in localStorage. */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  const DEFAULT_LAYOUT = ['rev', 'orders', 'aov', 'pending', 'chart', 'top', 'recent', 'lowstock', 'promos'];

  const WIDGETS = {
    rev: { title: 'Revenue · 30 days', span: 3, render: () => {
      const k = D.kpis();
      return <UI.Stat label="Revenue · 30 days" value={D.moneyShort(k.revenue30)} delta={k.revenueDelta}
        hint="vs previous 30d" spark={D.revenueByDay(14).map(d => d.value)} />;
    }},
    orders: { title: 'Orders · 30 days', span: 3, render: () => {
      const k = D.kpis();
      return <UI.Stat label="Orders · 30 days" value={k.orders30} delta={k.ordersDelta}
        hint="vs previous 30d" spark={D.revenueByDay(14).map(d => d.count)} />;
    }},
    aov: { title: 'Average order value', span: 3, render: () => {
      const k = D.kpis();
      return <UI.Stat label="Average order value" value={D.money(k.aov)} hint="last 30 days" />;
    }},
    pending: { title: 'Needs attention', span: 3, render: () => {
      const k = D.kpis();
      return <UI.Stat label="Awaiting fulfilment" value={k.pendingCount} hint={`${k.refunds30} refunds in 30d`} />;
    }},
    chart: { title: 'Sales over time', span: 8, render: () => (
      <UI.Card title="Sales over time" action={<UI.Badge tone="accent">Last 30 days</UI.Badge>}>
        <UI.AreaChart data={D.revenueByDay(30)} money height={210} />
      </UI.Card>
    )},
    top: { title: 'Top products', span: 4, render: ({ nav }) => (
      <UI.Card title="Top products" action={
        <UI.Button size="sm" variant="subtle" onClick={() => nav.navigate('reports')}>Report</UI.Button>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {D.topProducts(5).map((p, i) => {
            const prod = SHOP_DATA.product(p.productId);
            return (
              <div key={p.productId} onClick={() => nav.navigate('product', { id: p.productId })}
                style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}>
                <UI.Swatch color={prod ? prod.color : '#ddd'} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: T.faint }}>{p.units} sold</div>
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 12.5, color: T.sub }}>{D.moneyShort(p.revenue)}</div>
              </div>
            );
          })}
        </div>
      </UI.Card>
    )},
    recent: { title: 'Recent orders', span: 7, render: ({ nav }) => (
      <UI.Card title="Recent orders" action={
        <UI.Button size="sm" variant="subtle" onClick={() => nav.navigate('orders')}>View all</UI.Button>
      } pad={14}>
        <UI.Table
          rowKey={o => o.id}
          onRowClick={o => nav.navigate('order', { id: o.id })}
          columns={[
            { key: 'id', label: 'Order', render: o => <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{o.id}</span> },
            { key: 'customerName', label: 'Customer' },
            { key: 'status', label: 'Status', render: o => <UI.StatusBadge status={o.status} /> },
            { key: 'total', label: 'Total', align: 'right', render: o => <b>{D.money(o.total)}</b> },
            { key: 'createdAt', label: '', align: 'right', render: o => <span style={{ color: T.faint, fontSize: 12.5 }}>{D.timeAgo(o.createdAt)}</span> },
          ]}
          rows={D.orders.slice(0, 6)} />
      </UI.Card>
    )},
    lowstock: { title: 'Low stock', span: 5, render: ({ nav }) => {
      const low = D.lowStock(10);
      return (
        <UI.Card title="Low stock" action={<UI.Badge tone={low.length ? 'warn' : 'ok'}>{low.length} items</UI.Badge>}>
          {low.length === 0 ? <UI.EmptyState title="All stocked up" icon="check" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {low.slice(0, 5).map(p => (
                <div key={p.id} onClick={() => nav.navigate('product', { id: p.id })}
                  style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}>
                  <UI.Swatch color={p.color} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: T.faint, fontFamily: T.mono }}>{p.sku}</div>
                  </div>
                  <UI.Badge tone={p.stock === 0 ? 'danger' : 'warn'}>{p.stock === 0 ? 'Out' : p.stock + ' left'}</UI.Badge>
                </div>
              ))}
            </div>
          )}
        </UI.Card>
      );
    }},
    promos: { title: 'Active discounts', span: 7, render: ({ nav }) => (
      <UI.Card title="Active discounts" action={
        <UI.Button size="sm" variant="subtle" onClick={() => nav.navigate('discounts')}>Manage</UI.Button>
      }>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {SHOP_PROMO.promos.filter(p => p.status === 'active').map(p => (
            <div key={p.id} style={{
              border: `1px dashed ${T.lineStrong}`, borderRadius: 12, padding: '10px 14px', minWidth: 150,
            }}>
              <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 13.5 }}>{p.code}</div>
              <div style={{ fontSize: 12.5, color: T.sub, marginTop: 2 }}>{SHOP_PROMO.typeLabel(p)} · {p.appliesTo}</div>
              <div style={{ fontSize: 11.5, color: T.faint, marginTop: 4 }}>{p.used} uses</div>
            </div>
          ))}
        </div>
      </UI.Card>
    )},
    cats: { title: 'Sales by category', span: 5, render: () => (
      <UI.Card title="Sales by category">
        <UI.HBars data={D.salesByCategory().slice(0, 5)} money />
      </UI.Card>
    )},
    locales: { title: 'Storefront locales', span: 4, render: ({ nav }) => (
      <UI.Card title="Storefront locales" action={
        <UI.Button size="sm" variant="subtle" onClick={() => nav.navigate('settings')}>Settings</UI.Button>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SHOP_I18N.locales.map(l => (
            <div key={l.code} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
              <span style={{ fontSize: 17 }}>{l.flag}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{l.name}</span>
              <UI.Badge tone={l.enabled ? 'ok' : 'neutral'}>{l.enabled ? l.coverage + '%' : 'off'}</UI.Badge>
            </div>
          ))}
        </div>
      </UI.Card>
    )},
  };

  function Dashboard() {
    const nav = window.useAdminNav();
    const [layout, setLayoutRaw] = useState(() =>
      (D.prefs.get('dash-layout', null) || DEFAULT_LAYOUT).filter(id => WIDGETS[id]));
    const [dragIdx, setDragIdx] = useState(null);
    const [overIdx, setOverIdx] = useState(null);
    const [addOpen, setAddOpen] = useState(false);

    const setLayout = (next) => { setLayoutRaw(next); D.prefs.set('dash-layout', next); };

    const remove = id => setLayout(layout.filter(x => x !== id));
    const add = id => { setLayout([...layout, id]); setAddOpen(false); };
    const drop = (to) => {
      if (dragIdx == null || dragIdx === to) { setDragIdx(null); setOverIdx(null); return; }
      const next = [...layout];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(to, 0, moved);
      setLayout(next);
      setDragIdx(null); setOverIdx(null);
    };

    const available = Object.keys(WIDGETS).filter(id => !layout.includes(id));
    const greeting = new Date(D.NOW).getHours() < 12 ? 'Good morning' : 'Good afternoon';

    return (
      <AdminViews.Page
        title={`${greeting}, Nikita`}
        description={`Here's how ${SHOP_DATA.store.name} is doing · ${D.fullDate(D.NOW)}`}
        actions={
          <div style={{ position: 'relative' }}>
            <UI.Button variant="ghost" icon="plus" onClick={() => setAddOpen(!addOpen)}>Add card</UI.Button>
            {addOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', zIndex: 60,
                border: `1px solid ${T.line}`, borderRadius: 14, boxShadow: T.shadowPop, padding: 8, width: 230,
              }}>
                {available.length === 0 && <div style={{ padding: 12, fontSize: 13, color: T.faint }}>All cards are on the board.</div>}
                {available.map(id => (
                  <button key={id} onClick={() => add(id)} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: 13.5,
                    fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 9,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,10,10,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {WIDGETS[id].title}
                  </button>
                ))}
                <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 6, paddingTop: 6 }}>
                  <button onClick={() => { setLayout(DEFAULT_LAYOUT); setAddOpen(false); }} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12.5,
                    color: T.sub, border: 'none', background: 'transparent', cursor: 'pointer',
                  }}>Reset to default layout</button>
                </div>
              </div>
            )}
          </div>
        }>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {layout.map((id, i) => {
            const w = WIDGETS[id];
            return (
              <div key={id} className="dash-cell"
                draggable
                onDragStart={e => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move'; }}
                onDragOver={e => { e.preventDefault(); setOverIdx(i); }}
                onDragLeave={() => setOverIdx(cur => (cur === i ? null : cur))}
                onDrop={e => { e.preventDefault(); drop(i); }}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                style={{
                  gridColumn: `span ${w.span}`, position: 'relative', minWidth: 0,
                  opacity: dragIdx === i ? 0.4 : 1,
                  outline: overIdx === i && dragIdx !== null && dragIdx !== i ? `2px dashed ${T.accent}` : 'none',
                  outlineOffset: 4, borderRadius: T.radius, transition: 'opacity .12s ease',
                }}>
                <div className="dash-chrome" style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 5, display: 'flex', gap: 2,
                  opacity: 0, transition: 'opacity .15s ease', background: 'rgba(255,255,255,0.92)',
                  borderRadius: 9, boxShadow: T.shadow,
                }}>
                  <span title="Drag to reorder" style={{ display: 'inline-flex', alignItems: 'center', padding: '0 4px', cursor: 'grab', color: T.faint }}>
                    <UI.Icon name="drag" size={14} />
                  </span>
                  <UI.IconButton icon="x" size={26} title="Remove card" onClick={() => remove(id)} />
                </div>
                {w.render({ nav })}
              </div>
            );
          })}
        </div>

        {layout.length === 0 && (
          <UI.EmptyState title="Blank canvas" hint="You removed every card. Add some back with the button above." />
        )}
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Dashboard = Dashboard;
})();
