/* Shhh Admin — Reports + Finances hubs in a single file (no cross-file
   load dependency, per index.html). */

(function () {
  const { useState, useMemo } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  // ---------- Reports ----------
  function ReportsScreen() {
    const nav = window.useAdminNav();
    const [range, setRange] = useState(30);
    const days = useMemo(() => D.revenueByDay(range), [range]);
    const revenue = days.reduce((s, d) => s + d.value, 0);
    const orders = days.reduce((s, d) => s + d.count, 0);
    const best = days.reduce((a, b) => (b.value > a.value ? b : a), days[0]);
    const cats = D.salesByCategory();
    const top = D.topProducts(8);

    const exportCsv = () => {
      const head = 'date,revenue,orders\n';
      const body = days.map(d => [new Date(d.ts).toISOString().slice(0, 10), d.value, d.count].join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([head + body], { type: 'text/csv' }));
      a.download = `shhh-sales-${range}d.csv`;
      a.click();
      UI.toast('Report exported');
    };

    return (
      <AdminViews.Page title="Reports" description="Sales performance across the storefront"
        actions={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <UI.FilterChips value={range} onChange={setRange} options={[
              { value: 7, label: '7 days' }, { value: 30, label: '30 days' }, { value: 60, label: '60 days' },
            ]} />
            <UI.Button variant="ghost" icon="download" onClick={exportCsv}>Export</UI.Button>
          </div>
        }>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <UI.Stat label="Revenue" value={D.moneyShort(revenue)} hint={`last ${range} days`} />
          <UI.Stat label="Orders" value={orders} hint={`last ${range} days`} />
          <UI.Stat label="Avg order value" value={orders ? D.money(revenue / orders) : '—'} />
          <UI.Stat label="Best day" value={best ? D.moneyShort(best.value) : '—'} hint={best ? best.label : ''} />
        </div>

        <UI.Card title="Revenue" style={{ marginBottom: 16 }}>
          <UI.AreaChart data={days} money height={230} />
        </UI.Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
          <UI.Card title="Sales by category">
            <UI.HBars data={cats} money />
          </UI.Card>

          <UI.Card title="Top products" pad={14}>
            <UI.Table
              rowKey={p => p.productId}
              onRowClick={p => nav.navigate('product', { id: p.productId })}
              columns={[
                { key: 'name', label: 'Product', render: p => {
                  const prod = SHOP_DATA.product(p.productId);
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UI.Swatch color={prod ? prod.color : '#ddd'} size={28} />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  );
                }},
                { key: 'units', label: 'Units', align: 'right' },
                { key: 'revenue', label: 'Revenue', align: 'right', render: p => <b>{D.money(p.revenue)}</b> },
              ]}
              rows={top} />
          </UI.Card>
        </div>
      </AdminViews.Page>
    );
  }

  // ---------- Finances ----------
  function buildPayouts() {
    // weekly payouts derived from fulfilled+paid orders, newest first
    const eligible = D.orders.filter(o => o.status === 'fulfilled' || o.status === 'paid');
    const weeks = {};
    eligible.forEach(o => {
      const week = Math.floor((D.NOW - o.createdAt) / (7 * D.DAY));
      weeks[week] = weeks[week] || { gross: 0, orders: 0 };
      weeks[week].gross += o.total;
      weeks[week].orders += 1;
    });
    return Object.keys(weeks).map(Number).sort((a, b) => a - b).slice(0, 8).map(w => {
      const gross = weeks[w].gross;
      const fees = gross * 0.029 + weeks[w].orders * 0.25; // card fees
      return {
        id: 'PO-' + (8120 - w),
        date: D.fullDate(D.NOW - w * 7 * D.DAY),
        orders: weeks[w].orders,
        gross, fees,
        net: gross - fees,
        status: w === 0 ? 'pending' : 'paid',
      };
    });
  }

  function FinancesScreen() {
    const payouts = useMemo(buildPayouts, []);
    const pending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.net, 0);
    const paid30 = payouts.filter(p => p.status === 'paid').slice(0, 4).reduce((s, p) => s + p.net, 0);
    const fees30 = payouts.slice(0, 4).reduce((s, p) => s + p.fees, 0);

    // rough cost-of-goods estimate from catalog costs
    const k = D.kpis();
    const cogsRatio = 0.33;
    const grossMargin = Math.round((1 - cogsRatio) * 100);
    const vat = k.revenue30 * 0.21 / 1.21;

    return (
      <AdminViews.Page title="Finances" description="Payouts, fees and tax at a glance">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <UI.Stat label="Next payout" value={D.money(pending)} hint="arrives in 2 days" />
          <UI.Stat label="Paid out · 30d" value={D.moneyShort(paid30)} />
          <UI.Stat label="Processing fees · 30d" value={D.money(fees30)} hint="2.9% + €0.25 / order" />
          <UI.Stat label="Gross margin" value={grossMargin + '%'} hint="estimated from catalog costs" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <UI.Card title="Payouts" pad={14}>
            <UI.Table
              rowKey={p => p.id}
              columns={[
                { key: 'id', label: 'Payout', render: p => <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{p.id}</span> },
                { key: 'date', label: 'Date', render: p => <span style={{ color: T.sub }}>{p.date}</span> },
                { key: 'orders', label: 'Orders', align: 'right' },
                { key: 'gross', label: 'Gross', align: 'right', render: p => D.money(p.gross) },
                { key: 'fees', label: 'Fees', align: 'right', render: p => <span style={{ color: T.danger }}>−{D.money(p.fees)}</span> },
                { key: 'net', label: 'Net', align: 'right', render: p => <b>{D.money(p.net)}</b> },
                { key: 'status', label: 'Status', render: p => <UI.StatusBadge status={p.status} /> },
              ]}
              rows={payouts} />
          </UI.Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card title="VAT estimate · 30 days">
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{D.money(vat)}</div>
              <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>
                21% Latvian VAT included in {D.moneyShort(k.revenue30)} of gross sales. OSS return due July 31.
              </div>
            </UI.Card>

            <UI.Card title="Refunds · 30 days">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{k.refunds30}</div>
                <UI.Badge tone={k.refunds30 > 5 ? 'warn' : 'ok'}>{k.refunds30 > 5 ? 'watch this' : 'healthy'}</UI.Badge>
              </div>
              <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>
                Most refunds cite sizing — the size guide refresh should help.
              </div>
            </UI.Card>

            <UI.Card title="Payout account">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                <UI.Icon name="card" size={18} />
                <div>
                  <div style={{ fontWeight: 600 }}>Swedbank ··· 4821</div>
                  <div style={{ fontSize: 12, color: T.faint }}>Weekly payouts · EUR</div>
                </div>
              </div>
            </UI.Card>
          </div>
        </div>
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Reports = ReportsScreen;
  window.AdminScreens.Finances = FinancesScreen;
})();
