/* Shhh Admin — screen 2: Orders list + Order detail. */

(function () {
  const { useState, useMemo } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  const STATUS_FLOW = ['pending', 'paid', 'fulfilled'];

  function OrdersScreen() {
    const nav = window.useAdminNav();
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('all');

    const rows = useMemo(() => {
      const needle = q.trim().toLowerCase();
      return D.orders.filter(o => {
        if (status !== 'all' && o.status !== status) return false;
        if (!needle) return true;
        return o.id.toLowerCase().includes(needle)
          || o.customerName.toLowerCase().includes(needle)
          || o.items.some(it => it.name.toLowerCase().includes(needle));
      });
    }, [q, status]);

    const count = s => D.orders.filter(o => s === 'all' || o.status === s).length;

    return (
      <AdminViews.Page title="Orders" description={`${D.orders.length} orders · ${D.kpis().pendingCount} need fulfilment`}
        actions={<UI.Button variant="ghost" icon="download" onClick={() => exportOrdersCsv(rows)}>Export CSV</UI.Button>}>

        <UI.Card pad={16}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <UI.SearchBox value={q} onChange={setQ} placeholder="Search order, customer, item…" style={{ width: 280 }} />
            <UI.FilterChips value={status} onChange={setStatus} options={[
              { value: 'all', label: 'All', count: count('all') },
              { value: 'pending', label: 'Pending', count: count('pending') },
              { value: 'paid', label: 'Paid', count: count('paid') },
              { value: 'fulfilled', label: 'Fulfilled', count: count('fulfilled') },
              { value: 'refunded', label: 'Refunded', count: count('refunded') },
              { value: 'cancelled', label: 'Cancelled', count: count('cancelled') },
            ]} />
          </div>

          <UI.Table
            rowKey={o => o.id}
            empty="No orders match your filters"
            onRowClick={o => nav.navigate('order', { id: o.id })}
            columns={[
              { key: 'id', label: 'Order', render: o => <span style={{ fontFamily: T.mono, fontWeight: 700 }}>{o.id}</span> },
              { key: 'createdAt', label: 'Date', render: o => <span style={{ color: T.sub }}>{D.fullDate(o.createdAt)}</span> },
              { key: 'customerName', label: 'Customer', render: o => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <UI.Avatar name={o.customerName} size={26} />
                  <span style={{ fontWeight: 600 }}>{o.customerName}</span>
                  <span style={{ color: T.faint, fontSize: 12 }}>{o.country}</span>
                </div>
              )},
              { key: 'items', label: 'Items', render: o => <span style={{ color: T.sub }}>{o.items.reduce((s, it) => s + it.qty, 0)}</span> },
              { key: 'payment', label: 'Payment', render: o => <span style={{ color: T.sub }}>{o.payment}</span> },
              { key: 'status', label: 'Status', render: o => <UI.StatusBadge status={o.status} /> },
              { key: 'total', label: 'Total', align: 'right', render: o => <b>{D.money(o.total)}</b> },
            ]}
            rows={rows} />
        </UI.Card>
      </AdminViews.Page>
    );
  }

  function exportOrdersCsv(rows) {
    const head = 'order,date,customer,country,status,payment,items,total\n';
    const body = rows.map(o =>
      [o.id, new Date(o.createdAt).toISOString().slice(0, 10), `"${o.customerName}"`, o.country,
       o.status, o.payment, o.items.reduce((s, it) => s + it.qty, 0), o.total].join(',')
    ).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([head + body], { type: 'text/csv' }));
    a.download = 'shhh-orders.csv';
    a.click();
    UI.toast(`Exported ${rows.length} orders`);
  }

  function OrderScreen({ params }) {
    const nav = window.useAdminNav();
    const order = D.orders.find(o => o.id === params.id);
    const [status, setStatus] = useState(order ? order.status : 'pending');
    if (!order) {
      return (
        <AdminViews.Page title="Order not found" backTo="orders" backLabel="Orders">
          <UI.EmptyState title="This order doesn't exist" icon="alert" />
        </AdminViews.Page>
      );
    }
    const customer = D.customers.find(c => c.id === order.customerId);
    const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(status) + 1];

    const advance = () => {
      order.status = nextStatus;
      setStatus(nextStatus);
      UI.toast(`Order ${order.id} marked ${nextStatus}`);
    };
    const refund = () => {
      order.status = 'refunded';
      setStatus('refunded');
      UI.toast(`Order ${order.id} refunded`, 'danger');
    };

    const timeline = [
      { label: 'Order placed', ts: order.createdAt, done: true },
      { label: 'Payment captured', ts: order.createdAt + 9 * 60000, done: status !== 'pending' && status !== 'cancelled' },
      { label: 'Fulfilled & shipped', ts: order.createdAt + 26 * 3600000, done: status === 'fulfilled' },
    ];

    return (
      <AdminViews.Page
        backTo="orders" backLabel="Orders"
        title={<span>Order <span style={{ fontFamily: T.mono }}>{order.id}</span></span>}
        description={`Placed ${D.fullDate(order.createdAt)} · ${D.timeAgo(order.createdAt)}`}
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            {status !== 'refunded' && status !== 'cancelled' && (
              <UI.Button variant="ghost" onClick={refund}>Refund</UI.Button>
            )}
            {nextStatus && status !== 'refunded' && status !== 'cancelled' && (
              <UI.Button icon="check" onClick={advance}>Mark {nextStatus}</UI.Button>
            )}
          </div>
        }>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card title="Items" action={<UI.StatusBadge status={status} />} pad={16}>
              <UI.Table
                rowKey={it => it.sku + it.size}
                columns={[
                  { key: 'name', label: 'Product', render: it => {
                    const p = SHOP_DATA.product(it.productId);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <UI.Swatch color={p ? p.color : '#ddd'} size={34} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{it.name}</div>
                          <div style={{ fontSize: 12, color: T.faint, fontFamily: T.mono }}>{it.sku} · {it.size}</div>
                        </div>
                      </div>
                    );
                  }},
                  { key: 'qty', label: 'Qty', align: 'right' },
                  { key: 'price', label: 'Price', align: 'right', render: it => D.money(it.price) },
                  { key: 'line', label: 'Total', align: 'right', render: it => <b>{D.money(it.price * it.qty)}</b> },
                ]}
                rows={order.items} />

              <div style={{ marginTop: 16, marginLeft: 'auto', maxWidth: 280, fontSize: 13.5 }}>
                <Row k="Subtotal" v={D.money(order.subtotal)} />
                {order.discount > 0 && <Row k={`Discount (${order.discountCode})`} v={'−' + D.money(order.discount)} accent />}
                <Row k="Shipping" v={order.shipping === 0 ? 'Free' : D.money(order.shipping)} />
                <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 8, paddingTop: 8 }}>
                  <Row k={<b>Total</b>} v={<b style={{ fontSize: 15 }}>{D.money(order.total)}</b>} />
                </div>
              </div>
            </UI.Card>

            <UI.Card title="Timeline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {timeline.map((t, i) => (
                  <div key={t.label} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: t.done ? T.okSoft : 'rgba(10,10,10,0.05)', color: t.done ? T.ok : T.faint,
                      }}><UI.Icon name={t.done ? 'check' : 'dots'} size={12} /></div>
                      {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 18, background: T.line }} />}
                    </div>
                    <div style={{ paddingBottom: 16 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: t.done ? T.ink : T.faint }}>{t.label}</div>
                      {t.done && <div style={{ fontSize: 12, color: T.faint }}>{D.fullDate(t.ts)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </UI.Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card title="Customer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => customer && nav.navigate('customer', { id: customer.id })}>
                <UI.Avatar name={order.customerName} size={40} />
                <div>
                  <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                  <div style={{ fontSize: 12.5, color: T.sub }}>{customer ? customer.email : '—'}</div>
                </div>
              </div>
              {customer && (
                <div style={{ marginTop: 14, fontSize: 13, color: T.sub, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="globe" size={14} />{customer.city}, {customer.country}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="orders" size={14} />{D.customerOrders(customer.id).length} orders total</div>
                </div>
              )}
            </UI.Card>

            <UI.Card title="Payment & shipping">
              <div style={{ fontSize: 13.5, display: 'flex', flexDirection: 'column', gap: 9, color: T.sub }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="card" size={15} /><span style={{ color: T.ink, fontWeight: 600 }}>{order.payment}</span></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="truck" size={15} />{order.shipping === 0 ? 'Free shipping (over €80)' : 'Standard · ' + D.money(order.shipping)}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="globe" size={15} />Ships to {order.country}</div>
              </div>
            </UI.Card>

            {order.note && (
              <UI.Card title="Customer note">
                <div style={{
                  fontSize: 13.5, fontStyle: 'italic', background: T.warnSoft, color: T.warn,
                  padding: '10px 14px', borderRadius: 12,
                }}>"{order.note}"</div>
              </UI.Card>
            )}
          </div>
        </div>
      </AdminViews.Page>
    );
  }

  function Row({ k, v, accent }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: accent ? T.accent : 'inherit' }}>
        <span style={{ color: accent ? T.accent : T.sub }}>{k}</span><span>{v}</span>
      </div>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Orders = OrdersScreen;
  window.AdminScreens.Order = OrderScreen;
})();
