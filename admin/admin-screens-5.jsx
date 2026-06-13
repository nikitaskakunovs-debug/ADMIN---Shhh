// admin-screens-5.jsx — Analytics, Finances/Invoices, Marketing/Automations,
// Notifications, and the expanded tabbed Settings.

// ════════════════════════════════════════════════════════════
// ANALYTICS / REPORTS  — superseded by the Reports hub (admin-analytics.jsx +
// admin-reports-*.jsx). Kept as a reference fallback; not exported as AAnalytics.
// ════════════════════════════════════════════════════════════
function AAnalyticsLegacy({ ctx, nav }) {
  const { orders, toast } = ctx;
  const [range, setRange] = React.useState('30');
  const paidish = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const revenue = paidish.reduce((s, o) => s + o.total, 0);
  const aov = paidish.length ? revenue / paidish.length : 0;

  // by category
  const catMap = {};
  paidish.forEach(o => o.items.forEach(i => {
    const p = (window.PRODUCTS || []).find(x => x.id === i.id); if (!p) return;
    catMap[p.category] = (catMap[p.category] || 0) + i.price * i.qty;
  }));
  const catColors = ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C', '#0A0A0A'];
  const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([label, v], i) => ({ label, value: Math.round(v), color: catColors[i % catColors.length] }));
  const catTotal = catData.reduce((s, d) => s + d.value, 0) || 1;

  // top products
  const unitMap = {};
  paidish.forEach(o => o.items.forEach(i => { if (i.id !== 'gift') unitMap[i.id] = (unitMap[i.id] || 0) + i.qty; }));
  const top = Object.entries(unitMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const funnel = window.CONVERSION_FUNNEL || [];
  const fmax = funnel[0] ? funnel[0].value : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <ASelect label="Period" value={range} onChange={setRange} options={[{ value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last quarter' }, { value: '365', label: 'Last year' }]} />
        <div style={{ flex: 1 }} />
        <ABtn kind="ghost" onClick={() => toast('Report exported to CSV')}><AIcon name="download" size={15} /> Export CSV</ABtn>
        <ABtn kind="ghost" onClick={() => toast('Report exported to PDF')}><AIcon name="download" size={15} /> Export PDF</ABtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <AStat label="Revenue" value={money(revenue)} delta="▲ 12.4%" icon="finance" />
        <AStat label="Orders" value={paidish.length} delta="▲ 6.1%" icon="orders" />
        <AStat label="Avg order" value={money(aov)} delta="▲ 4.1%" icon="bolt" />
        <AStat label="Conversion" value="5.1%" delta="▲ 0.4pp" icon="analytics" />
      </div>

      {/* Revenue trend */}
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink, marginBottom: 10 }}>Revenue trend</div>
        <ALineChart height={220} series={[{ data: REVENUE_PREV, color: '#9A9A96', faded: true, dashed: true }, { data: REVENUE_THIS, color: AT.accent }]} labels={REVENUE_DAYS} />
      </APanel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Sales by category */}
        <APanel pad={20}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>Sales by category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catData.map(d => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink, textTransform: 'capitalize' }}>{d.label}</span>
                  <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{money(d.value)}</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: AT.surfaceAlt }}><div style={{ height: '100%', width: (d.value / catTotal * 100) + '%', borderRadius: 4, background: d.color }} /></div>
              </div>
            ))}
          </div>
        </APanel>

        {/* Sales by location */}
        <APanel pad={20}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>Sales by location</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(window.SALES_BY_CITY || []).map(c => (
              <div key={c.city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{c.city}</span>
                  <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{c.value}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: AT.surfaceAlt }}><div style={{ height: '100%', width: c.value + '%', borderRadius: 4, background: AT.accent }} /></div>
              </div>
            ))}
          </div>
        </APanel>
      </div>

      {/* Conversion funnel */}
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>Conversion funnel</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {funnel.map((f, i) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 110, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{f.label}</span>
              <div style={{ flex: 1, height: 26, borderRadius: 6, background: AT.surfaceAlt, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (f.value / fmax * 100) + '%', background: AT.accent, opacity: 1 - i * 0.13, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                  <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: '#fff', fontWeight: 700 }}>{f.value.toLocaleString()}</span>
                </div>
              </div>
              <span style={{ width: 48, textAlign: 'right', fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft }}>{i === 0 ? '100%' : (f.value / fmax * 100).toFixed(1) + '%'}</span>
            </div>
          ))}
        </div>
      </APanel>

      {/* Top products */}
      <div>
        <ASectionTitle right={<ABtn kind="soft" size="sm" onClick={() => nav('catalog')}>Catalog <AIcon name="arrow" size={14} /></ABtn>}>Top products</ASectionTitle>
        <ATable columns={[{ label: '#' }, { label: 'Product' }, { label: 'Brand' }, { label: 'Units', align: 'center' }, { label: 'Revenue', align: 'right' }]}>
          {top.map(([id, units], i) => {
            const p = (window.PRODUCTS || []).find(x => x.id === id); if (!p) return null;
            return (
              <tr key={id}>
                <ATd mono>{i + 1}</ATd>
                <ATd strong>{p.name}</ATd>
                <ATd>{p.brand}</ATd>
                <ATd mono align="center">{units}</ATd>
                <ATd mono strong align="right">{money(p.price * units)}</ATd>
              </tr>
            );
          })}
        </ATable>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FINANCES / INVOICES — superseded by the Finances hub (admin-finances.jsx).
// Kept as a reference fallback; not exported as AFinances.
// ════════════════════════════════════════════════════════════
function AFinancesLegacy({ ctx, nav }) {
  const { orders, toast } = ctx;
  const [tab, setTab] = React.useState('overview');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [invStatus, setInvStatus] = React.useState('all');
  const [openInv, setOpenInv] = React.useState(null);

  const paidish = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const gross = paidish.reduce((s, o) => s + o.total, 0);
  const vatTotal = paidish.reduce((s, o) => s + vatOf(o.total).vat, 0);
  const refunds = orders.filter(o => o.status === 'refunded').reduce((s, o) => s + o.total, 0);
  const payouts = window.SEED_PAYOUTS || [];

  // gateway breakdown
  const gwMap = {};
  paidish.forEach(o => { gwMap[o.payMethod] = (gwMap[o.payMethod] || 0) + o.total; });
  const gwData = Object.entries(gwMap).sort((a, b) => b[1] - a[1]);
  const gwTotal = gwData.reduce((s, [, v]) => s + v, 0) || 1;

  // invoices derived from paid-ish orders
  const invoices = paidish.map(o => ({ id: 'INV-' + o.ref.replace('SH-', ''), ref: o.ref, customer: o.alias, email: o.email, date: o.date.slice(0, 10), total: o.total, status: o.status === 'refunded' ? 'refunded' : 'paid' }));
  const invList = invoices.filter(inv => {
    if (invStatus !== 'all' && inv.status !== invStatus) return false;
    if (from && inv.date < from) return false;
    if (to && inv.date > to) return false;
    return true;
  });

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22, fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft, borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent' }}>{label}</button>
  );
  const gwLabel = (m) => m.charAt(0).toUpperCase() + m.slice(1);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 18 }}>
        {tabBtn('overview', 'Overview')}{tabBtn('invoices', `Invoices (${invoices.length})`)}{tabBtn('payouts', 'Payouts')}{tabBtn('vat', 'VAT report')}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <AStat label="Gross revenue" value={money(gross)} delta="incl. VAT" icon="finance" />
            <AStat label="Net (ex VAT)" value={money(gross - vatTotal)} icon="bolt" />
            <AStat label={`VAT ${Math.round(VAT_RATE * 100)}% due`} value={money(vatTotal)} delta="to declare" deltaTone="warn" icon="finance" />
            <AStat label="Refunds" value={money(refunds)} delta={refunds ? 'this period' : 'none'} deltaTone={refunds ? 'warn' : 'ok'} icon="refund" />
          </div>
          <APanel pad={20}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>Payment gateways</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {gwData.map(([m, v]) => (
                <div key={m}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink }}>{gwLabel(m)}</span>
                    <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{money(v)} · {Math.round(v / gwTotal * 100)}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 4, background: AT.surfaceAlt }}><div style={{ height: '100%', width: (v / gwTotal * 100) + '%', borderRadius: 4, background: AT.accent }} /></div>
                </div>
              ))}
            </div>
          </APanel>
        </div>
      )}

      {tab === 'invoices' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            <ASelect label="Status" value={invStatus} onChange={setInvStatus} options={[{ value: 'all', label: 'All' }, { value: 'paid', label: 'Paid' }, { value: 'refunded', label: 'Refunded' }]} />
            <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
            <div style={{ flex: 1 }} />
            <ABtn kind="ghost" onClick={() => toast('Invoices exported')}><AIcon name="download" size={15} /> Export</ABtn>
          </div>
          <ATable columns={[{ label: 'Invoice' }, { label: 'Order' }, { label: 'Customer' }, { label: 'Date' }, { label: 'Net', align: 'right' }, { label: 'VAT', align: 'right' }, { label: 'Total', align: 'right' }, { label: 'Status' }, { label: '', align: 'right' }]}>
            {invList.map(inv => (
              <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setOpenInv(inv)}>
                <ATd mono strong onClick={() => setOpenInv(inv)}>{inv.id}</ATd>
                <ATd mono onClick={() => setOpenInv(inv)}>#{inv.ref}</ATd>
                <ATd onClick={() => setOpenInv(inv)}>{inv.customer}</ATd>
                <ATd mono onClick={() => setOpenInv(inv)}>{inv.date.slice(5)}</ATd>
                <ATd mono align="right" onClick={() => setOpenInv(inv)}>{money(vatOf(inv.total).net)}</ATd>
                <ATd mono align="right" onClick={() => setOpenInv(inv)}>{money(vatOf(inv.total).vat)}</ATd>
                <ATd mono strong align="right" onClick={() => setOpenInv(inv)}>{money(inv.total)}</ATd>
                <ATd onClick={() => setOpenInv(inv)}><ABadge tone={inv.status === 'refunded' ? 'danger' : 'ok'}>{inv.status}</ABadge></ATd>
                <ATd align="right" onClick={() => setOpenInv(inv)}><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
              </tr>
            ))}
          </ATable>

          <ADrawer open={!!openInv} onClose={() => setOpenInv(null)} width={520}
            title={openInv ? openInv.id : ''} sub={openInv ? 'Order #' + openInv.ref + ' · ' + openInv.date : ''}
            footer={openInv && (<><ABtn kind="ghost" onClick={() => toast('Invoice PDF downloaded')}><AIcon name="download" size={15} /> Download</ABtn><ABtn kind="ghost" onClick={() => toast('Invoice sent to customer')}><AIcon name="mail" size={15} /> Send</ABtn><ABtn kind="primary" onClick={() => { nav('orders', { ref: openInv.ref }); }}>Open order</ABtn></>)}>
            {openInv && (() => { const v = vatOf(openInv.total); return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ padding: 16, borderRadius: AT.radiusSm, background: AT.surfaceAlt }}>
                  <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink }}>NL Trading Co SIA</div>
                  <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, lineHeight: 1.5 }}>Brīvības iela 68 – 14, Rīga, LV-1011<br />VAT LV40203456789</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Bill to', openInv.customer], ['Email', openInv.email], ['Invoice date', openInv.date], ['Status', openInv.status]].map(([l, val]) => (
                    <div key={l}><div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 3 }}>{l}</div><div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, textTransform: l === 'Status' ? 'capitalize' : 'none' }}>{val}</div></div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8, borderTop: `1px solid ${AT.rule}` }}>
                  {[['Net (ex VAT)', money(v.net)], [`VAT ${Math.round(VAT_RATE * 100)}%`, money(v.vat)]].map(([l, val]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}><span>{l}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{val}</span></div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8, borderTop: `1px solid ${AT.rule}` }}>
                    <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>Total incl. VAT</span>
                    <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink }}>{money(openInv.total)}</span>
                  </div>
                </div>
              </div>
            ); })()}
          </ADrawer>
        </div>
      )}

      {tab === 'payouts' && (
        <ATable columns={[{ label: 'Payout' }, { label: 'Date' }, { label: 'Method' }, { label: 'Gross', align: 'right' }, { label: 'Fees', align: 'right' }, { label: 'Net', align: 'right' }, { label: 'Status' }]}>
          {payouts.map(p => (
            <tr key={p.id}>
              <ATd mono strong>{p.id}</ATd>
              <ATd mono>{p.date.slice(5)}</ATd>
              <ATd>{p.method}</ATd>
              <ATd mono align="right">{money(p.gross)}</ATd>
              <ATd mono align="right" style={{ color: AT.warn }}>−{money(p.fees)}</ATd>
              <ATd mono strong align="right">{money(p.net)}</ATd>
              <ATd><ABadge tone={p.status === 'paid' ? 'ok' : 'warn'}>{p.status}</ABadge></ATd>
            </tr>
          ))}
        </ATable>
      )}

      {tab === 'vat' && (
        <div style={{ maxWidth: 640 }}>
          <APanel pad={20}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>VAT summary · this period</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Gross sales (incl. VAT)', money(gross)], ['Net sales (ex VAT)', money(gross - vatTotal)], [`Output VAT ${Math.round(VAT_RATE * 100)}%`, money(vatTotal)], ['Refunded VAT', '−' + money(vatOf(refunds).vat)]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: AT.body, fontSize: 13.5, color: AT.inkSoft }}><span>{l}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{v}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTop: `1px solid ${AT.rule}` }}>
                <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>VAT payable</span>
                <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink }}>{money(vatTotal - vatOf(refunds).vat)}</span>
              </div>
            </div>
            <div style={{ marginTop: 16 }}><ABtn kind="primary" onClick={() => toast('VAT report exported (PVN deklarācija)')}><AIcon name="download" size={15} /> Export PVN report</ABtn></div>
          </APanel>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MARKETING / AUTOMATIONS
// ════════════════════════════════════════════════════════════
function AMarketing({ ctx }) {
  const { toast } = ctx;
  const [tab, setTab] = React.useState('automations');
  const [autos, setAutos] = React.useState(window.SEED_AUTOMATIONS || []);
  const campaigns = window.SEED_CAMPAIGNS || [];
  const toggle = (id) => { setAutos(prev => prev.map(a => a.id === id ? { ...a, on: !a.on } : a)); const a = autos.find(x => x.id === id); toast(`${a.name} ${a.on ? 'paused' : 'turned on'}`); };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22, fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft, borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent' }}>{label}</button>
  );

  const reach = autos.filter(a => a.on).reduce((s, a) => s + a.reach, 0);
  const autoOrders = autos.filter(a => a.on).reduce((s, a) => s + a.orders, 0);
  const autoSales = autos.filter(a => a.on).reduce((s, a) => s + a.sales, 0);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 18 }}>
        {tabBtn('automations', 'Automations')}{tabBtn('campaigns', `Campaigns (${campaigns.length})`)}
      </div>

      {tab === 'automations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <AStat label="Active automations" value={autos.filter(a => a.on).length} icon="megaphone" />
            <AStat label="Reach (30d)" value={reach.toLocaleString()} icon="users" />
            <AStat label="Attributed orders" value={autoOrders} deltaTone="ok" icon="orders" />
            <AStat label="Attributed sales" value={money(autoSales)} delta="▲ from automations" icon="bolt" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {autos.map(a => (
              <APanel key={a.id} pad={18}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>{a.name}</span>
                      <ABadge tone={a.on ? 'ok' : 'neutral'}>{a.on ? 'Active' : 'Off'}</ABadge>
                    </div>
                    <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>{a.desc}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 22, textAlign: 'right' }}>
                    {[['Reach', a.reach.toLocaleString()], ['Orders', a.orders], ['Conv.', a.conv + '%'], ['Sales', money(a.sales)]].map(([l, v]) => (
                      <div key={l}><div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>{v}</div><div style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>{l}</div></div>
                    ))}
                  </div>
                  <ABtn kind={a.on ? 'ghost' : 'primary'} onClick={() => toggle(a.id)}>{a.on ? 'Pause' : 'Turn on'}</ABtn>
                </div>
              </APanel>
            ))}
          </div>
          <APanel pad={18} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: AT.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="megaphone" size={20} color={AT.accent} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>Recover sales with re-engagement</div>
              <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Discreet, consent-based emails — never reveals product names.</div>
            </div>
            <ABtn kind="primary" onClick={() => toast('New automation (demo)')}><AIcon name="plus" size={15} /> New automation</ABtn>
          </APanel>
        </div>
      )}

      {tab === 'campaigns' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <ABtn kind="primary" onClick={() => toast('New campaign (demo)')}><AIcon name="plus" size={15} /> New campaign</ABtn>
          </div>
          <ATable columns={[{ label: 'Campaign' }, { label: 'Status' }, { label: 'Sent', align: 'right' }, { label: 'Open %', align: 'right' }, { label: 'Click %', align: 'right' }, { label: 'Sales', align: 'right' }, { label: 'Date' }]}>
            {campaigns.map(c => (
              <tr key={c.id}>
                <ATd strong>{c.name}</ATd>
                <ATd><ABadge tone={c.status === 'active' ? 'ok' : c.status === 'scheduled' ? 'blue' : 'neutral'}>{c.status}</ABadge></ATd>
                <ATd mono align="right">{c.sent ? c.sent.toLocaleString() : '—'}</ATd>
                <ATd mono align="right">{c.open ? c.open + '%' : '—'}</ATd>
                <ATd mono align="right">{c.click ? c.click + '%' : '—'}</ATd>
                <ATd mono strong align="right">{c.sales ? money(c.sales) : '—'}</ATd>
                <ATd mono>{c.date.slice(5)}</ATd>
              </tr>
            ))}
          </ATable>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// NOTIFICATIONS CENTRE
// ════════════════════════════════════════════════════════════
function ANotifications({ ctx, nav }) {
  const { orders, reviews, returns, stock, toast } = ctx;
  const [readIds, setReadIds] = React.useState([]);
  const [filter, setFilter] = React.useState('all');

  const items = [];
  orders.filter(o => o.status === 'pending').forEach(o => items.push({ id: 'pay-' + o.ref, type: 'payment', icon: 'refund', tone: 'warn', title: `Awaiting payment · #${o.ref}`, sub: `${o.alias} · ${money(o.total)}`, go: () => nav('orders', { ref: o.ref }) }));
  orders.filter(o => o.status === 'paid').forEach(o => items.push({ id: 'ship-' + o.ref, type: 'order', icon: 'orders', tone: 'blue', title: `New paid order · #${o.ref}`, sub: `${o.alias} · ${o.items.reduce((s, i) => s + i.qty, 0)} items · ready to fulfil`, go: () => nav('orders', { ref: o.ref }) }));
  reviews.filter(r => !r.decided).forEach(r => items.push({ id: 'rev-' + r.id, type: 'review', icon: 'reviews', tone: 'blue', title: `Review to moderate`, sub: `${r.name} · ${r.stars}★`, go: () => nav('reviews') }));
  returns.filter(r => r.status === 'open').forEach(r => items.push({ id: 'ret-' + r.id, type: 'return', icon: 'returns', tone: 'danger', title: `${r.kind === 'warranty' ? 'Warranty' : 'Return'} claim · ${r.id}`, sub: `${r.item} · ${r.reason}`, go: () => nav('returns') }));
  (window.PRODUCTS || []).filter(p => (stock[p.id] ?? 0) <= 4).forEach(p => items.push({ id: 'stk-' + p.id, type: 'stock', icon: 'inventory', tone: 'danger', title: `Low stock · ${p.name}`, sub: `${stock[p.id] ?? 0} units left`, go: () => nav('inventory') }));

  const filtered = items.filter(i => filter === 'all' || i.type === filter);
  const unread = items.filter(i => !readIds.includes(i.id)).length;
  const markAll = () => { setReadIds(items.map(i => i.id)); toast('All marked as read'); };

  const FILTERS = [['all', 'All'], ['order', 'Orders'], ['payment', 'Payments'], ['review', 'Reviews'], ['return', 'Returns'], ['stock', 'Stock']];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {FILTERS.map(([id, l]) => {
          const active = filter === id;
          const n = id === 'all' ? items.length : items.filter(i => i.type === id).length;
          return <button key={id} onClick={() => setFilter(id)} style={{ all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink, border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>;
        })}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{unread} unread</span>
        <ABtn kind="ghost" onClick={markAll}><AIcon name="check" size={15} /> Mark all read</ABtn>
      </div>

      {filtered.length === 0 ? <AEmpty title="All clear" sub="No notifications in this category." /> : (
        <APanel style={{ overflow: 'hidden' }}>
          {filtered.map((i, idx) => {
            const read = readIds.includes(i.id);
            return (
              <button key={i.id} onClick={() => { setReadIds(prev => prev.includes(i.id) ? prev : [...prev, i.id]); i.go(); }} style={{
                all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                borderTop: idx === 0 ? 'none' : `1px solid ${AT.ruleSoft}`, background: read ? AT.panel : AT.accentSoft + '55',
              }}>
                <span style={{ width: 38, height: 38, borderRadius: 9, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={i.icon} size={18} color={AT.ink} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{i.title}</div>
                  <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{i.sub}</div>
                </div>
                {!read && <span style={{ width: 8, height: 8, borderRadius: 999, background: AT.accent, flexShrink: 0 }} />}
                <AIcon name="chev" size={15} color={AT.inkSoft} />
              </button>
            );
          })}
        </APanel>
      )}
    </div>
  );
}

Object.assign(window, { AMarketing, ANotifications, AActivityLog });

// ════════════════════════════════════════════════════════════
// ACTIVITY LOG (change log — who did what)
// ════════════════════════════════════════════════════════════
function AActivityLog({ ctx }) {
  const { audit, toast } = ctx;
  const [q, setQ] = React.useState('');
  const [actor, setActor] = React.useState('all');
  const [type, setType] = React.useState('all');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  const actors = Array.from(new Set(audit.map(a => a.actor)));
  const list = audit.filter(a => {
    if (actor !== 'all' && a.actor !== actor) return false;
    if (type !== 'all' && a.type !== type) return false;
    const d = a.ts.slice(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (q) { const s = q.toLowerCase(); return (a.action + ' ' + a.target + ' ' + a.detail + ' ' + a.actor).toLowerCase().includes(s); }
    return true;
  });
  const anyFilter = actor !== 'all' || type !== 'all' || from || to || q;
  const types = window.AUDIT_TYPES || {};

  // group by day
  const groups = {};
  list.forEach(a => { const d = a.ts.slice(0, 10); (groups[d] = groups[d] || []).push(a); });
  const days = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  const fmtDay = (d) => { const today = nowStamp().slice(0, 10); if (d === today) return 'Today'; return d; };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <ASelect label="Member" value={actor} onChange={setActor} options={[{ value: 'all', label: 'All' }, ...actors.map(a => ({ value: a, label: a }))]} />
        <ASelect label="Area" value={type} onChange={setType} options={[{ value: 'all', label: 'All' }, ...Object.keys(types).map(t => ({ value: t, label: types[t].label }))]} />
        <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        {anyFilter && <button onClick={() => { setActor('all'); setType('all'); setFrom(''); setTo(''); setQ(''); }} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.accent, padding: '0 6px' }}>Clear</button>}
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search actions, targets…" />
        <ABtn kind="ghost" onClick={() => toast('Audit log exported to CSV')}><AIcon name="download" size={15} /> Export</ABtn>
      </div>
      <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 14 }}>{list.length} of {audit.length} entries · newest first</div>

      {days.length === 0 ? <AEmpty title="No matching activity" sub="Adjust the filters above." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {days.map(day => (
            <div key={day}>
              <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 10 }}>{fmtDay(day)}</div>
              <APanel style={{ overflow: 'hidden' }}>
                {groups[day].map((a, idx) => {
                  const t = types[a.type] || { icon: 'dashboard', label: a.type };
                  return (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderTop: idx === 0 ? 'none' : `1px solid ${AT.ruleSoft}` }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={t.icon} size={16} color={AT.ink} /></span>
                      <AAvatar name={a.actor} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink }}>
                          <strong>{a.actor}</strong> · {a.action}{a.target ? <span style={{ color: AT.inkSoft }}> — </span> : ''}{a.target && <span style={{ fontFamily: AT.mono, fontSize: 12.5, color: AT.accent }}>{a.target}</span>}
                        </div>
                        {a.detail && <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{a.detail}</div>}
                      </div>
                      <ABadge tone="neutral">{t.label}</ABadge>
                      <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft, width: 44, textAlign: 'right' }}>{a.ts.slice(11)}</span>
                    </div>
                  );
                })}
              </APanel>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
