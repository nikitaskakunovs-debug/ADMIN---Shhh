/* Shhh Admin — screen 4: Customers list + Customer detail. */

(function () {
  const { useState, useMemo } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function customerStats(c) {
    const orders = D.customerOrders(c.id).filter(o => o.status !== 'cancelled');
    const spent = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + o.total, 0);
    return { orders: orders.length, spent, last: orders.length ? Math.max(...orders.map(o => o.createdAt)) : null };
  }

  function tierOf(spent) {
    if (spent >= 500) return { label: 'VIP', tone: 'accent' };
    if (spent >= 200) return { label: 'Regular', tone: 'ok' };
    if (spent > 0) return { label: 'New', tone: 'neutral' };
    return { label: 'Window shopper', tone: 'neutral' };
  }

  function CustomersScreen() {
    const nav = window.useAdminNav();
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('spent');

    const rows = useMemo(() => {
      const needle = q.trim().toLowerCase();
      const enriched = D.customers.map(c => ({ ...c, ...customerStats(c) }));
      const filtered = needle
        ? enriched.filter(c => c.name.toLowerCase().includes(needle) || c.email.includes(needle) || c.city.toLowerCase().includes(needle))
        : enriched;
      return filtered.sort((a, b) =>
        sort === 'spent' ? b.spent - a.spent :
        sort === 'orders' ? b.orders - a.orders :
        (b.last || 0) - (a.last || 0));
    }, [q, sort]);

    const subscribed = D.customers.filter(c => c.marketing).length;

    return (
      <AdminViews.Page title="Customers"
        description={`${D.customers.length} customers · ${subscribed} subscribed to marketing`}>

        <UI.Card pad={16}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <UI.SearchBox value={q} onChange={setQ} placeholder="Search name, email, city…" style={{ width: 280 }} />
            <UI.Select value={sort} onChange={setSort} style={{ width: 180 }} options={[
              { value: 'spent', label: 'Sort: total spent' },
              { value: 'orders', label: 'Sort: order count' },
              { value: 'recent', label: 'Sort: most recent' },
            ]} />
          </div>

          <UI.Table
            rowKey={c => c.id}
            empty="No customers found"
            onRowClick={c => nav.navigate('customer', { id: c.id })}
            columns={[
              { key: 'name', label: 'Customer', render: c => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <UI.Avatar name={c.name} size={32} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: T.faint }}>{c.email}</div>
                  </div>
                </div>
              )},
              { key: 'city', label: 'Location', render: c => <span style={{ color: T.sub }}>{c.city}, {c.country}</span> },
              { key: 'tier', label: 'Tier', render: c => { const t = tierOf(c.spent); return <UI.Badge tone={t.tone}>{t.label}</UI.Badge>; } },
              { key: 'marketing', label: 'Marketing', render: c => c.marketing
                ? <span style={{ color: T.ok, display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 13 }}><UI.Icon name="check" size={13} />Subscribed</span>
                : <span style={{ color: T.faint, fontSize: 13 }}>—</span> },
              { key: 'orders', label: 'Orders', align: 'right' },
              { key: 'spent', label: 'Total spent', align: 'right', render: c => <b>{D.money(c.spent)}</b> },
            ]}
            rows={rows} />
        </UI.Card>
      </AdminViews.Page>
    );
  }

  function CustomerScreen({ params }) {
    const nav = window.useAdminNav();
    const customer = D.customers.find(c => c.id === params.id);
    if (!customer) {
      return (
        <AdminViews.Page title="Customer not found" backTo="customers" backLabel="Customers">
          <UI.EmptyState title="This customer doesn't exist" icon="alert" />
        </AdminViews.Page>
      );
    }
    const stats = customerStats(customer);
    const tier = tierOf(stats.spent);
    const orders = D.customerOrders(customer.id);
    const aov = stats.orders ? stats.spent / stats.orders : 0;

    return (
      <AdminViews.Page
        backTo="customers" backLabel="Customers"
        title={customer.name}
        description={`Customer since ${customer.since} · ${customer.city}, ${customer.country}`}
        actions={<UI.Badge tone={tier.tone} style={{ fontSize: 13, padding: '6px 14px' }}>{tier.label}</UI.Badge>}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <UI.Stat label="Total spent" value={D.money(stats.spent)} />
          <UI.Stat label="Orders" value={stats.orders} hint={stats.last ? 'last ' + D.timeAgo(stats.last) : 'none yet'} />
          <UI.Stat label="Average order" value={D.money(aov)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
          <UI.Card title="Order history" pad={14}>
            <UI.Table
              rowKey={o => o.id}
              empty="No orders yet"
              onRowClick={o => nav.navigate('order', { id: o.id })}
              columns={[
                { key: 'id', label: 'Order', render: o => <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{o.id}</span> },
                { key: 'createdAt', label: 'Date', render: o => <span style={{ color: T.sub }}>{D.fullDate(o.createdAt)}</span> },
                { key: 'items', label: 'Items', render: o => <span style={{ color: T.sub }}>{o.items.map(it => it.name).join(', ')}</span>, wrap: true },
                { key: 'status', label: 'Status', render: o => <UI.StatusBadge status={o.status} /> },
                { key: 'total', label: 'Total', align: 'right', render: o => <b>{D.money(o.total)}</b> },
              ]}
              rows={orders} />
          </UI.Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card title="Contact">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <UI.Avatar name={customer.name} size={44} />
                <div>
                  <div style={{ fontWeight: 700 }}>{customer.name}</div>
                  <div style={{ fontSize: 12.5, color: T.sub }}>{customer.email}</div>
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: T.sub, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UI.Icon name="globe" size={14} />{customer.city}, {customer.country}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <UI.Icon name={customer.marketing ? 'check' : 'x'} size={14} color={customer.marketing ? T.ok : T.faint} />
                  {customer.marketing ? 'Subscribed to marketing' : 'Not subscribed'}
                </div>
              </div>
            </UI.Card>

            <UI.Card title="Quick actions">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <UI.Button variant="ghost" size="sm" icon="discounts"
                  onClick={() => UI.toast(`Personal code sent to ${customer.name.split(' ')[0]}`)}>Send a discount code</UI.Button>
                <UI.Button variant="ghost" size="sm" icon="doc"
                  onClick={() => UI.toast('Note saved')}>Add a note</UI.Button>
              </div>
            </UI.Card>
          </div>
        </div>
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Customers = CustomersScreen;
  window.AdminScreens.Customer = CustomerScreen;
})();
