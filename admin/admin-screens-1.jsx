// admin-screens-1.jsx — Dashboard + Orders (the priority module)

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function ADashboard({ ctx, nav }) {
  const { orders, stock, reviews, returns } = ctx;
  const paidish = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const revenue = paidish.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const toShip = orders.filter(o => o.status === 'paid').length;
  const aov = paidish.length ? revenue / paidish.length : 0;
  const lowStock = Object.entries(stock).filter(([, n]) => n <= 4);
  const pendingReviews = reviews.filter(r => !r.decided).length;
  const openReturns = returns.filter(r => r.status === 'open').length;

  // Top products by units across paidish orders
  const unitMap = {};
  paidish.forEach(o => o.items.forEach(i => { if (i.id !== 'gift') unitMap[i.id] = (unitMap[i.id] || 0) + i.qty; }));
  const top = Object.entries(unitMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const statusCounts = orders.reduce((m, o) => { m[o.status] = (m[o.status] || 0) + 1; return m; }, {});
  const itemsPerOrder = orders.length ? (orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0) / orders.length) : 0;
  const refundRate = orders.length ? (statusCounts.refunded || 0) / orders.length * 100 : 0;
  const thisTotal = REVENUE_THIS.reduce((s, n) => s + n, 0);
  const prevTotal = REVENUE_PREV.reduce((s, n) => s + n, 0);

  const statusSegments = [
    { label: 'Paid + fulfilled', value: (statusCounts.paid || 0) + (statusCounts.shipped || 0) + (statusCounts.delivered || 0), color: '#1F8A4C' },
    { label: 'Awaiting payment', value: statusCounts.pending || 0, color: '#E0A800' },
    { label: 'Refunded', value: statusCounts.refunded || 0, color: '#C2410C' },
    { label: 'Cancelled', value: statusCounts.cancelled || 0, color: '#9A9A96' },
  ];

  // Revenue by market (EUR base) — drives the consolidated breakdown widget
  const mktMap = {};
  paidish.forEach(o => { const k = o.market || o.country || 'LV'; mktMap[k] = (mktMap[k] || 0) + o.total; });
  const mktRows = MARKETS.filter(m => mktMap[m.id]).map(m => ({ id: m.id, country: m.country, value: mktMap[m.id] })).sort((a, b) => b.value - a.value);
  const mktMax = mktRows.reduce((mx, r) => Math.max(mx, r.value), 0) || 1;
  const mktTotal = mktRows.reduce((s, r) => s + r.value, 0);

  // ── Widget registry ─────────────────────────────────────────
  // Each widget is a self-contained card the operator can show / hide / reorder.
  // `span` is out of 12 grid columns.
  const REG = {
    onboard: {
      title: 'Getting started', icon: 'bolt', span: 12,
      node: <AGettingStarted nav={nav} role={ctx.role} />,
    },
    kpis: {
      title: 'Key metrics', icon: 'dashboard', span: 12,
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <AStat label="Revenue (7d)" value={money(thisTotal)} delta={`▲ ${(((thisTotal - prevTotal) / prevTotal) * 100).toFixed(1)}% vs last week`} icon="bolt" />
          <AStat label="Orders" value={orders.length} delta={`${toShip} to fulfil`} deltaTone="warn" icon="orders" />
          <AStat label="Avg order" value={money(aov)} delta="▲ 4.1%" icon="dashboard" />
          <AStat label="Awaiting payment" value={pending} delta={pending ? 'Needs a nudge' : 'All settled'} deltaTone={pending ? 'warn' : 'ok'} icon="refund" />
        </div>
      ),
    },
    revenue: {
      title: 'Revenue chart', icon: 'analytics', span: 7,
      node: (
        <APanel pad={20} style={{ height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink }}>Revenue</div>
            <div style={{ display: 'flex', gap: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}><span style={{ width: 10, height: 3, borderRadius: 2, background: AT.accent }} /> This week <strong style={{ marginLeft: 2 }}>{money(thisTotal)}</strong></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}><span style={{ width: 10, height: 3, borderRadius: 2, background: '#9A9A96' }} /> Last week {money(prevTotal)}</span>
            </div>
          </div>
          <ALineChart height={220}
            series={[
              { data: REVENUE_PREV, color: '#9A9A96', faded: true, dashed: true },
              { data: REVENUE_THIS, color: AT.accent },
            ]}
            labels={REVENUE_DAYS} />
        </APanel>
      ),
    },
    overview: {
      title: 'Orders & overview', icon: 'orders', span: 5,
      node: (
        <APanel pad={20} style={{ display: 'flex', flexDirection: 'column', gap: 18, height: '100%', boxSizing: 'border-box' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>Orders status</span>
              <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft }}>{orders.length} total</span>
            </div>
            <AStackBar segments={statusSegments} />
          </div>
          <div style={{ height: 1, background: AT.rule }} />
          <div>
            <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 12 }}>Overview · this month</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
              {[
                ['Total revenue', money(revenue)],
                ['Avg order', money(aov)],
                ['Items / order', itemsPerOrder.toFixed(1)],
                ['Processing time', '16 min'],
                ['Pending orders', pending],
                ['Refund rate', refundRate.toFixed(1) + '%'],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink, letterSpacing: AT.ld }}>{v}</div>
                  <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </APanel>
      ),
    },
    channels: {
      title: 'Sales by channel', icon: 'finance', span: 4,
      node: (
        <APanel pad={20} style={{ height: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 16, color: AT.ink }}>Sales by channel</div>
          <ADonut data={SALES_CHANNELS} centerLabel="100%" centerSub="attributed" />
        </APanel>
      ),
    },
    target: {
      title: 'Monthly target', icon: 'bolt', span: 4,
      node: (
        <APanel pad={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 8, color: AT.ink, alignSelf: 'flex-start' }}>Monthly target</div>
          <AGauge pct={Math.min(100, Math.round(thisTotal / 500))} sub="of €25k goal" />
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, textAlign: 'center', marginTop: 4 }}>You earned <strong style={{ color: AT.ink }}>{money(REVENUE_THIS[REVENUE_THIS.length - 1])}</strong> today — ahead of yesterday.</div>
        </APanel>
      ),
    },
    bymarket: {
      title: 'Sales by market', icon: 'finance', span: 4,
      node: (
        <APanel pad={20} style={{ height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>Sales by market</div>
            <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{mktRows.length} active</span>
          </div>
          {mktRows.length === 0 ? (
            <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>No paid orders in this scope yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mktRows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{ width: 28, height: 20, borderRadius: 5, background: AT.surfaceAlt, color: AT.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: AT.mono, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{r.id}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{r.country}</span>
                      <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.ink, fontWeight: 700 }}>{money(r.value)}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: AT.surfaceAlt, overflow: 'hidden' }}>
                      <div style={{ width: (r.value / mktMax * 100) + '%', height: '100%', borderRadius: 999, background: AT.accent }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft, width: 34, textAlign: 'right', flexShrink: 0 }}>{mktTotal ? Math.round(r.value / mktTotal * 100) : 0}%</span>
                </div>
              ))}
            </div>
          )}
        </APanel>
      ),
    },
    attention: {
      title: 'Needs attention', icon: 'bell', span: 4,
      node: (
        <APanel pad={18} style={{ height: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 8, color: AT.ink }}>Needs attention</div>
          {[
            { l: 'Orders to fulfil', n: toShip, go: () => nav('orders'), tone: 'warn' },
            { l: 'Awaiting payment', n: pending, go: () => nav('orders'), tone: 'warn' },
            { l: 'Reviews to moderate', n: pendingReviews, go: () => nav('reviews'), tone: 'blue' },
            { l: 'Open return/warranty', n: openReturns, go: () => nav('returns'), tone: 'danger' },
            { l: 'Low-stock SKUs', n: lowStock.length, go: () => nav('inventory'), tone: 'danger' },
          ].map(row => (
            <button key={row.l} onClick={row.go} style={{
              all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 0', borderTop: `1px solid ${AT.ruleSoft}`,
            }}>
              <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink }}>{row.l}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ABadge tone={row.n ? row.tone : 'ok'}>{row.n || '—'}</ABadge>
                <AIcon name="chev" size={15} color={AT.inkSoft} />
              </span>
            </button>
          ))}
        </APanel>
      ),
    },
    top: {
      title: 'Top sellers', icon: 'catalog', span: 12,
      node: (
        <div>
          <ASectionTitle right={<ABtn kind="soft" size="sm" onClick={() => nav('orders')}>Recent orders <AIcon name="arrow" size={14} /></ABtn>}>Top sellers</ASectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {top.map(([id, units]) => {
              const p = (window.PRODUCTS || []).find(x => x.id === id);
              if (!p) return null;
              return (
                <APanel key={id} pad={16} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{p.brand}</span>
                    <ABadge tone="blue">{units} sold</ABadge>
                  </div>
                  <div style={{ fontFamily: AT.display, fontWeight: 700, fontSize: 16, color: AT.ink, letterSpacing: AT.ld, lineHeight: 1.1 }}>{p.name}</div>
                  <div style={{ fontFamily: AT.mono, fontSize: 13, color: AT.ink, fontWeight: 700 }}>{money(p.price)}</div>
                </APanel>
              );
            })}
          </div>
        </div>
      ),
    },
  };
  const ALL_IDS = Object.keys(REG);
  const DEFAULT_LAYOUT = ['onboard', 'kpis', 'revenue', 'overview', 'channels', 'bymarket', 'attention', 'top'];

  return <ADashGrid REG={REG} allIds={ALL_IDS} defaultLayout={DEFAULT_LAYOUT} />;
}

// ── Customisable dashboard grid: drag to reorder, add / remove widgets ──
const DASH_STORE_KEY = 'shhh_admin_dash_v3';
function ADashGrid({ REG, allIds, defaultLayout }) {
  const [layout, setLayout] = React.useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(DASH_STORE_KEY) || 'null');
      if (Array.isArray(s)) { const f = s.filter(id => REG[id]); if (f.length) return f; }
    } catch (e) {}
    return defaultLayout;
  });
  React.useEffect(() => { try { localStorage.setItem(DASH_STORE_KEY, JSON.stringify(layout)); } catch (e) {} }, [layout]);

  const [armed, setArmed] = React.useState(null);   // widget whose handle is grabbed → draggable
  const [dragId, setDragId] = React.useState(null);
  const [over, setOver] = React.useState(null);     // { id, after }
  const [addOpen, setAddOpen] = React.useState(false);
  const addRef = React.useRef(null);

  React.useEffect(() => {
    if (!addOpen) return;
    const onDoc = (e) => { if (addRef.current && !addRef.current.contains(e.target)) setAddOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [addOpen]);

  const hidden = allIds.filter(id => !layout.includes(id));
  const remove = (id) => setLayout(prev => prev.filter(x => x !== id));
  const add = (id) => { setLayout(prev => [...prev, id]); setAddOpen(false); };
  const reset = () => setLayout(defaultLayout);

  const onCellDragOver = (e, id) => {
    if (!dragId) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const after = e.clientX > r.left + r.width / 2;
    setOver(o => (o && o.id === id && o.after === after) ? o : { id, after });
  };
  const onCellDrop = (e, id) => {
    e.preventDefault();
    setLayout(prev => {
      if (!dragId) return prev;
      const a = prev.filter(x => x !== dragId);
      let idx = a.indexOf(id);
      if (idx === -1) return prev;
      if (over && over.after) idx += 1;
      a.splice(idx, 0, dragId);
      return a;
    });
    setDragId(null); setOver(null); setArmed(null);
  };
  const endDrag = () => { setDragId(null); setOver(null); setArmed(null); };

  const tool = {
    all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 11px', borderRadius: 8, border: `1px solid ${AT.rule}`, background: AT.panel,
    color: AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
  };

  return (
    <div>
      {/* Customise toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>
          <AIcon name="grip" size={15} color={AT.inkSoft} /> Drag a card by its handle to rearrange · hover to remove
        </span>
        <div style={{ flex: 1 }} />
        <div ref={addRef} style={{ position: 'relative' }}>
          <button onClick={() => setAddOpen(o => !o)} style={{ ...tool, background: hidden.length ? AT.accentSoft : AT.panel, borderColor: hidden.length ? AT.accent : AT.rule, color: hidden.length ? AT.accent : AT.inkSoft }}>
            <AIcon name="plus" size={15} color={hidden.length ? AT.accent : AT.inkSoft} /> Add widget {hidden.length ? `(${hidden.length})` : ''}
          </button>
          {addOpen && (
            <div style={{ position: 'absolute', top: 42, right: 0, zIndex: 60, width: 240, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 5, boxShadow: '0 16px 40px rgba(0,0,0,0.16)' }}>
              {hidden.length === 0 ? (
                <div style={{ padding: '12px 12px', fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>All widgets are on the dashboard.</div>
              ) : hidden.map(id => (
                <button key={id} onClick={() => add(id)} style={{
                  all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 7,
                  fontFamily: AT.body, fontSize: 13, color: AT.ink,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={REG[id].icon} size={15} color={AT.ink} /></span>
                  <span style={{ flex: 1 }}>{REG[id].title}</span>
                  <AIcon name="plus" size={14} color={AT.accent} />
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={reset} style={tool}><AIcon name="refund" size={14} color={AT.inkSoft} /> Reset</button>
      </div>

      {/* Widget grid */}
      {layout.length === 0 ? (
        <AEmpty title="Your dashboard is empty" sub="Use “Add widget” to choose what you want to see." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {layout.map(id => {
            const w = REG[id];
            if (!w) return null;
            const isDragging = dragId === id;
            const isOver = over && over.id === id && dragId && dragId !== id;
            return (
              <div key={id}
                className="dash-cell"
                draggable={armed === id}
                onDragStart={(e) => { setDragId(id); try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); } catch (err) {} }}
                onDragEnd={endDrag}
                onDragOver={(e) => onCellDragOver(e, id)}
                onDrop={(e) => onCellDrop(e, id)}
                style={{
                  gridColumn: `span ${w.span}`, position: 'relative',
                  opacity: isDragging ? 0.4 : 1,
                  outline: isOver ? `2px solid ${AT.accent}` : '2px solid transparent',
                  outlineOffset: 4, borderRadius: AT.radius, transition: 'opacity .12s',
                }}>
                {/* hover chrome: drag handle + remove */}
                <div className="dash-chrome" style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 8, display: 'flex', gap: 4,
                  opacity: 0, transition: 'opacity .12s', pointerEvents: 'none',
                }}>
                  <span
                    title="Drag to move"
                    onMouseDown={() => setArmed(id)}
                    onMouseUp={() => setArmed(null)}
                    style={{ cursor: 'grab', width: 26, height: 26, borderRadius: 7, background: AT.panel, border: `1px solid ${AT.rule}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                    <AIcon name="grip" size={15} color={AT.inkSoft} />
                  </span>
                  <button
                    title="Remove from dashboard"
                    onClick={() => remove(id)}
                    style={{ all: 'unset', cursor: 'pointer', width: 26, height: 26, borderRadius: 7, background: AT.panel, border: `1px solid ${AT.rule}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                    <AIcon name="close" size={14} color={AT.danger} />
                  </button>
                </div>
                {w.node}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────
const ORDER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Awaiting payment' },
  { id: 'paid', label: 'To fulfil' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'refunded', label: 'Refunded' },
  { id: 'cancelled', label: 'Cancelled' },
];

// Derived payment status (independent of fulfilment lifecycle)
function orderPayStatus(o) {
  if (o.payFailed) return 'failed';
  if (o.status === 'cancelled') return 'cancelled';
  const rf = (o.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  if (rf > 0.005) return rf >= (Number(o.total) || 0) - 0.005 ? 'refunded' : 'partial';
  if (o.status === 'pending') return 'awaiting';
  return 'paid';
}
const ORDER_PAY_STATUS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'awaiting', label: 'Awaiting payment' },
  { value: 'failed', label: 'Failed' },
  { value: 'partial', label: 'Partially refunded' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'cancelled', label: 'Cancelled' },
];
const PAY_STATUS_TONE = { paid: 'ok', awaiting: 'warn', failed: 'danger', partial: 'warn', refunded: 'danger', cancelled: 'neutral' };
const PAY_METHOD_LABEL = { swedbank: 'Swedbank', card: 'Card', apple: 'Apple Pay', applepay: 'Apple Pay', transfer: 'Bank transfer', paypal: 'PayPal', klarna: 'Klarna' };
const payMethodLabel = (m) => PAY_METHOD_LABEL[m] || (m ? m.charAt(0).toUpperCase() + m.slice(1) : m);
const AMOUNT_BANDS = [
  { value: 'all', label: 'Any amount' },
  { value: 'lt50', label: 'Under €50' },
  { value: '50-200', label: '€50 – €200' },
  { value: '200-500', label: '€200 – €500' },
  { value: 'gt500', label: 'Over €500' },
];
function inAmountBand(total, band) {
  total = Number(total) || 0;
  if (band === 'lt50') return total < 50;
  if (band === '50-200') return total >= 50 && total < 200;
  if (band === '200-500') return total >= 200 && total < 500;
  if (band === 'gt500') return total >= 500;
  return true;
}

// ── Order export (CSV · Excel · PDF) ─────────────────────────
function orderTypeLabel(o) { return /door/i.test(o.locker || '') ? 'Shipping' : 'Pickup'; }
function ordersExportRows(list) {
  return list.map(o => {
    const rf = (o.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return {
      'Order': o.ref,
      'Invoice': orderInvoiceNo(o),
      'Date': o.date,
      'Market': o.market || o.country || 'LV',
      'Customer': o.alias || '',
      'Email': o.email || '',
      'Company': o.company || '',
      'VAT number': o.vatNo || '',
      'Type': orderTypeLabel(o),
      'Courier': o.courier || '',
      'Items': o.items.reduce((s, i) => s + i.qty, 0),
      'Payment method': payMethodLabel(o.payMethod),
      'Payment status': (ORDER_PAY_STATUS.find(s => s.value === orderPayStatus(o)) || {}).label || orderPayStatus(o),
      'Reverse charge': isReverseCharge(o) ? 'Yes' : 'No',
      'Total (EUR)': (Number(o.total) || 0).toFixed(2),
      'Refunded (EUR)': rf.toFixed(2),
      'Status': (o.status || '').charAt(0).toUpperCase() + (o.status || '').slice(1),
    };
  });
}
function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { try { document.body.removeChild(a); } catch (e) {} URL.revokeObjectURL(url); }, 800);
}
function _esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function _stamp() { const d = new Date(); return d.toISOString().slice(0, 10); }
function exportOrdersCSV(list, name) {
  const rows = ordersExportRows(list);
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const cell = (v) => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const csv = [headers.map(cell).join(','), ...rows.map(r => headers.map(h => cell(r[h])).join(','))].join('\r\n');
  _triggerDownload(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), (name || 'orders') + '-' + _stamp() + '.csv');
}
function exportOrdersXLS(list, name) {
  const rows = ordersExportRows(list);
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const thead = '<tr>' + headers.map(h => '<th style="background:#0F0F0E;color:#fff;text-align:left;padding:6px 10px;border:1px solid #cccccc;font-family:Arial">' + _esc(h) + '</th>').join('') + '</tr>';
  const tbody = rows.map(r => '<tr>' + headers.map(h => '<td style="border:1px solid #dddddd;padding:5px 9px;font-family:Arial;mso-number-format:\'\\@\'">' + _esc(r[h]) + '</td>').join('') + '</tr>').join('');
  const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Orders</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>' + thead + tbody + '</table></body></html>';
  _triggerDownload(new Blob([html], { type: 'application/vnd.ms-excel' }), (name || 'orders') + '-' + _stamp() + '.xls');
}
function exportOrdersPDF(list, name) {
  const rows = ordersExportRows(list);
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const thead = '<tr>' + headers.map(h => '<th>' + _esc(h) + '</th>').join('') + '</tr>';
  const tbody = rows.map(r => '<tr>' + headers.map(h => '<td>' + _esc(r[h]) + '</td>').join('') + '</tr>').join('');
  const css = 'body{font-family:Arial,Helvetica,sans-serif;color:#0A0A0A;margin:24px}h1{font-size:18px;margin:0 0 4px}.sub{color:#666;font-size:12px;margin:0 0 16px}table{border-collapse:collapse;width:100%;font-size:10px}th{background:#0F0F0E;color:#fff;text-align:left;padding:6px 8px}td{border-bottom:1px solid #e3e3e3;padding:5px 8px}tr:nth-child(even) td{background:#f6f6f4}@page{size:A4 landscape;margin:12mm}';
  const doc = '<!doctype html><html><head><meta charset="utf-8"><title>' + _esc(name || 'Orders') + '</title><style>' + css + '</style></head><body><h1>Orders export</h1><p class="sub">' + rows.length + ' orders · generated ' + _stamp() + '</p><table><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></body></html>';
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);
  const idoc = iframe.contentWindow.document;
  idoc.open(); idoc.write(doc); idoc.close();
  const go = () => { try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) {} setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) {} }, 1500); };
  setTimeout(go, 350);
}
const ORDER_EXPORTS = { xls: exportOrdersXLS, csv: exportOrdersCSV, pdf: exportOrdersPDF };

// Export dropdown — exports the currently filtered orders in the chosen format.
function AExportMenu({ list, toast }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const run = (fmt, label) => { setOpen(false); ORDER_EXPORTS[fmt](list); if (toast) toast(fmt === 'pdf' ? 'Opening print dialog for ' + list.length + ' orders…' : 'Exported ' + list.length + ' orders to ' + label); };
  const opts = [['xls', 'Excel', '.xls', 'finance'], ['csv', 'CSV', '.csv', 'list'], ['pdf', 'PDF', '.pdf', 'content']];
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)} style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 12px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>
        <AIcon name="download" size={15} color={AT.ink} /> Export <span style={{ color: AT.inkSoft, fontFamily: AT.mono, fontSize: 11 }}>{list.length}</span>
        <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><AIcon name="chevDown" size={13} color={AT.inkSoft} /></span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 60, minWidth: 200, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, boxShadow: '0 14px 40px rgba(0,0,0,0.16)', overflow: 'hidden', padding: 5 }}>
          <div style={{ padding: '7px 10px 6px', fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft }}>Download {list.length} order{list.length === 1 ? '' : 's'}</div>
          {opts.map(([fmt, label, ext, ic]) => (
            <button key={fmt} onClick={() => run(fmt, label)} style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, fontFamily: AT.body, fontSize: 13, color: AT.ink }}
              onMouseEnter={e => e.currentTarget.style.background = AT.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: AT.surfaceAlt, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={ic} size={15} color={AT.ink} /></span>
              <span style={{ flex: 1 }}><span style={{ fontWeight: 700 }}>{label}</span> <span style={{ color: AT.inkSoft, fontFamily: AT.mono, fontSize: 11 }}>{ext}</span></span>
              <AIcon name="download" size={14} color={AT.inkSoft} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AOrders({ ctx, params, nav }) {
  const { orders, updateOrder, duplicateOrder, removeOrders, toast, confirm, checkpoint, refund, openTab } = ctx;
  const openIn = (s, p) => (openTab ? openTab(s, p) : nav(s, p)); // cross-screen CTAs open a NEW tab, keeping this order open
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [payFilter, setPayFilter] = React.useState('all');
  const [payStatusFilter, setPayStatusFilter] = React.useState('all');
  const [vatFilter, setVatFilter] = React.useState('all');
  const [amountFilter, setAmountFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [courierFilter, setCourierFilter] = React.useState([]);
  const [sort, setSort] = React.useState('newest');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const ORDERS_PAGE = 20;
  const [visibleCount, setVisibleCount] = React.useState(ORDERS_PAGE);
  const loadMoreRef = React.useRef(null);
  // ── Saved filter views (named presets, pinned as tabs · editable) ──
  const VIEWS_KEY = 'shhh_admin_views_orders';
  const [views, setViews] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem(VIEWS_KEY) || 'null'); if (Array.isArray(s)) return s; } catch (e) {}
    return [
      { id: 'v_fulfil', name: 'To fulfil', f: { filter: 'paid', payFilter: 'all', typeFilter: 'all', courierFilter: [], sort: 'newest', from: '', to: '', q: '' } },
      { id: 'v_await', name: 'Awaiting payment', f: { filter: 'pending', payFilter: 'all', typeFilter: 'all', courierFilter: [], sort: 'newest', from: '', to: '', q: '' } },
    ];
  });
  React.useEffect(() => { try { localStorage.setItem(VIEWS_KEY, JSON.stringify(views)); } catch (e) {} }, [views]);
  const curFilters = () => ({ filter, payFilter, payStatusFilter, vatFilter, amountFilter, typeFilter, courierFilter: courierFilter.slice(), sort, from, to, q });
  const applyFilters = (f) => { setFilter(f.filter || 'all'); setPayFilter(f.payFilter || 'all'); setPayStatusFilter(f.payStatusFilter || 'all'); setVatFilter(f.vatFilter || 'all'); setAmountFilter(f.amountFilter || 'all'); setTypeFilter(f.typeFilter || 'all'); setCourierFilter(f.courierFilter || []); setSort(f.sort || 'newest'); setFrom(f.from || ''); setTo(f.to || ''); setQ(f.q || ''); };
  const [tab, setTab] = React.useState('items');
  const [selected, setSelected] = React.useState([]);
  const openRef = params?.ref || null;
  const open = openRef ? orders.find(o => o.ref === openRef) : null;
  React.useEffect(() => { setTab('items'); }, [openRef]);
  // Detail: fixed header + scrollable body with section-shortcut jumps
  const detailScrollRef = React.useRef(null);
  const [secActive, setSecActive] = React.useState('od-items');
  const goToSection = (id) => { const c = detailScrollRef.current; if (!c) return; const el = c.querySelector('#' + id); if (el) { const top = Math.max(0, el.offsetTop - 14); try { c.scrollTo({ top, behavior: 'smooth' }); } catch (e) {} c.scrollTop = top; } setSecActive(id); };
  React.useEffect(() => { setSecActive('od-items'); if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0; }, [openRef]);

  const orderType = (o) => /door/i.test(o.locker || '') ? 'Shipping' : 'Pickup';
  const payMethods = Array.from(new Set(orders.map(o => o.payMethod)));
  const couriers = Array.from(new Set(orders.map(o => o.courier).filter(Boolean)));

  const list = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (payFilter !== 'all' && o.payMethod !== payFilter) return false;
    if (payStatusFilter !== 'all' && orderPayStatus(o) !== payStatusFilter) return false;
    if (vatFilter !== 'all' && (vatFilter === 'reverse') !== !!isReverseCharge(o)) return false;
    if (amountFilter !== 'all' && !inAmountBand(o.total, amountFilter)) return false;
    if (typeFilter !== 'all' && orderType(o).toLowerCase() !== typeFilter) return false;
    if (courierFilter.length && !courierFilter.includes(o.courier)) return false;
    const d = o.date.slice(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (q) {
      const s = q.toLowerCase();
      return o.ref.toLowerCase().includes(s) || (o.alias || '').toLowerCase().includes(s) || (o.email || '').toLowerCase().includes(s);
    }
    return true;
  }).sort((a, b) => {
    if (sort === 'oldest') return a.date < b.date ? -1 : 1;
    if (sort === 'total-d') return b.total - a.total;
    if (sort === 'total-a') return a.total - b.total;
    return a.date < b.date ? 1 : -1; // newest
  });
  const anyFilter = payFilter !== 'all' || payStatusFilter !== 'all' || vatFilter !== 'all' || amountFilter !== 'all' || typeFilter !== 'all' || courierFilter.length || from || to || q || sort !== 'newest';
  // Pagination: show 20, load 20 more as the sentinel scrolls into view
  React.useEffect(() => { setVisibleCount(ORDERS_PAGE); }, [filter, payFilter, payStatusFilter, vatFilter, amountFilter, typeFilter, courierFilter.join(','), from, to, q, sort]);
  const visible = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;
  const loadMore = () => setVisibleCount(c => Math.min(list.length, c + ORDERS_PAGE));
  React.useEffect(() => {
    if (open) return;
    const onScroll = () => {
      const el = loadMoreRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) + 320) setVisibleCount(c => (c < list.length ? Math.min(list.length, c + ORDERS_PAGE) : c));
    };
    window.addEventListener('scroll', onScroll, true);
    const t = setTimeout(onScroll, 60);
    return () => { window.removeEventListener('scroll', onScroll, true); clearTimeout(t); };
  }, [list.length, visibleCount, open]);

  const setStatus = (ref, status, msg) => { updateOrder(ref, { status }); toast(msg); };
  const askRefund = (o) => refund(o);
  const askCancel = (o) => confirm({
    title: 'Cancel this order?',
    body: `Order #${o.ref} will be marked cancelled and the customer should no longer expect it. This is hard to walk back.`,
    confirmLabel: 'Yes, cancel order', icon: 'x', tone: 'danger',
    onConfirm: () => setStatus(o.ref, 'cancelled', `Order #${o.ref} cancelled`),
  });
  const toggleSel = (ref) => setSelected(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref]);
  const allVisibleSelected = list.length > 0 && list.every(o => selected.includes(o.ref));
  const toggleAll = () => setSelected(allVisibleSelected ? [] : list.map(o => o.ref));

  const bulkExport = () => { exportOrdersCSV(orders.filter(o => selected.includes(o.ref)), 'orders-selected'); toast(`Exported ${selected.length} order${selected.length > 1 ? 's' : ''} to CSV`); };
  const bulkPrint = () => { toast(`Sent ${selected.length} packing slip${selected.length > 1 ? 's' : ''} to print`); };
  const bulkDuplicate = () => confirm({
    title: `Duplicate ${selected.length} order${selected.length > 1 ? 's' : ''}?`,
    body: 'Each selected order is copied as a new pending order. The originals are left untouched.',
    confirmLabel: 'Yes, duplicate', icon: 'catalog', tone: 'primary',
    onConfirm: () => { checkpoint(`Duplicated ${selected.length} order${selected.length > 1 ? 's' : ''}`); selected.forEach(r => duplicateOrder(r, true)); toast(`Duplicated ${selected.length} order${selected.length > 1 ? 's' : ''}`); setSelected([]); },
  });
  const bulkDelete = () => confirm({
    title: `Delete ${selected.length} order${selected.length > 1 ? 's' : ''}?`,
    body: 'This permanently removes the selected orders from the console. This cannot be undone.',
    confirmLabel: 'Yes, delete', requireType: 'DELETE', icon: 'trash', tone: 'danger',
    onConfirm: () => { removeOrders(selected); toast(`Deleted ${selected.length} order${selected.length > 1 ? 's' : ''}`); setSelected([]); },
  });

  const actionsFor = (o) => {
    const a = [];
    if (o.status === 'pending') { a.push(['Mark as paid', () => setStatus(o.ref, 'paid', `Order #${o.ref} marked paid`), 'primary']); a.push(['Cancel', () => askCancel(o), 'danger']); }
    else if (o.status === 'paid') { a.push(['Fulfil & ship', () => setStatus(o.ref, 'shipped', `Order #${o.ref} marked shipped`), 'primary']); a.push(['Refund', () => askRefund(o), 'danger']); }
    else if (o.status === 'shipped') { a.push(['Mark delivered', () => setStatus(o.ref, 'delivered', `Order #${o.ref} delivered`), 'primary']); a.push(['Refund', () => askRefund(o), 'danger']); }
    else if (o.status === 'delivered') { a.push(['Refund', () => askRefund(o), 'danger']); }
    return a;
  };

  // Tracking timeline steps by status
  const timeline = (o) => {
    const steps = [
      { k: 'pending', l: 'Order placed' },
      { k: 'paid', l: 'Payment confirmed' },
      { k: 'packed', l: 'Packed (plain box)' },
      { k: 'shipped', l: 'Handed to courier' },
      { k: 'delivered', l: 'Delivered' },
    ];
    const rank = { pending: 0, paid: 1, packed: 2, shipped: 3, delivered: 4 };
    const cur = o.status === 'paid' ? 1 : o.status === 'shipped' ? 3 : o.status === 'delivered' ? 4 : 0;
    return steps.map((s, i) => ({ ...s, done: i <= cur }));
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{
      all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22,
      fontFamily: AT.body, fontWeight: 700, fontSize: 13.5,
      color: tab === id ? AT.ink : AT.inkSoft,
      borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent',
    }}>{label}</button>
  );
  const labelStyle = { fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 3 };
  // Shared detail-card helpers (consistent titled cards across every section)
  const dCard = { background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 16 };
  const dIcon = { width: 30, height: 30, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
  const dHead = (icon, title, sub, badge) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 13, borderBottom: `1px solid ${AT.ruleSoft}` }}>
      {icon ? <span style={dIcon}><AIcon name={icon} size={15} color={AT.ink} /></span> : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{title}</div>
        {sub ? <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 1 }}>{sub}</div> : null}
      </div>
      {badge}
    </div>
  );

  // Saved-view actions
  const FILTER_DEFAULTS = { filter: 'all', payFilter: 'all', payStatusFilter: 'all', vatFilter: 'all', amountFilter: 'all', typeFilter: 'all', courierFilter: [], sort: 'newest', from: '', to: '', q: '' };
  const curStr = JSON.stringify(curFilters());
  const matched = views.find(v => JSON.stringify({ ...FILTER_DEFAULTS, ...v.f }) === curStr);
  const hasFilters = curStr !== JSON.stringify(FILTER_DEFAULTS);
  const saveCurrentView = () => confirm({ title: 'Save this view', body: 'Pin the current filters as a named tab you can return to.', prompt: { label: 'View name', placeholder: 'e.g. Unfulfilled · DPD', required: true }, confirmLabel: 'Save view', tone: 'primary', icon: 'plus', onConfirm: (name) => { const id = 'v' + Date.now(); setViews(p => [...p, { id, name: (name || '').trim(), f: curFilters() }]); toast('View “' + name.trim() + '” saved'); } });
  const renameView = (v) => confirm({ title: 'Rename view', prompt: { label: 'View name', placeholder: v.name, required: true }, confirmLabel: 'Rename', tone: 'primary', icon: 'content', onConfirm: (name) => setViews(p => p.map(x => x.id === v.id ? { ...x, name: (name || '').trim() || x.name } : x)) });
  const updateView = (v) => { setViews(p => p.map(x => x.id === v.id ? { ...x, f: curFilters() } : x)); toast('“' + v.name + '” updated to current filters'); };
  const deleteView = (v) => confirm({ title: 'Delete “' + v.name + '”?', body: 'This saved view will be removed. Your orders are not affected.', confirmLabel: 'Delete view', icon: 'trash', tone: 'danger', onConfirm: () => { setViews(p => p.filter(x => x.id !== v.id)); toast('View deleted'); } });

  const stTone = { pending: AT.warn, paid: AT.accent, shipped: AT.accent, delivered: AT.ok, refunded: AT.danger, cancelled: AT.inkSoft };
  return (
    <div style={open ? { display: 'flex', gap: 18, alignItems: 'flex-start' } : undefined}>
      {open && (
        <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 90, maxHeight: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${AT.ruleSoft}`, display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <button onClick={() => nav('orders')} title="Back to all orders" style={{ all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 8, background: AT.surfaceAlt, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><AIcon name="arrow" size={15} color={AT.ink} /></span></button>
            <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.ink }}>All orders</span>
            <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft, marginLeft: 'auto' }}>{list.length}</span>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {list.map(o => {
              const rsel = o.ref === openRef;
              const rom = o.market || o.country || 'LV';
              return (
                <button key={o.ref} onClick={() => nav('orders', { ref: o.ref })} style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: `1px solid ${AT.ruleSoft}`, background: rsel ? AT.accentSoft : 'transparent', boxShadow: rsel ? `inset 3px 0 0 ${AT.accent}` : 'none' }}>
                  <AAvatar name={o.alias} size={30} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontFamily: AT.mono, fontWeight: 700, fontSize: 12, color: rsel ? AT.accent : AT.ink }}>#{o.ref}</span>
                      <span style={{ fontFamily: AT.mono, fontSize: 12, fontWeight: 600, color: AT.ink }}>{fmtMoney(o.total, rom)}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 3, alignItems: 'center' }}>
                      <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.alias}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: stTone[o.status] || AT.inkSoft }} /><span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{o.date.slice(5, 10)}</span></span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div style={open ? { flex: 1, minWidth: 0 } : undefined}>
      {!open && (<React.Fragment>
      {/* Saved views (editable, pinned tabs) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${AT.ruleSoft}` }}>
        <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginRight: 2 }}>Views</span>
        {views.map(v => {
          const on = matched && matched.id === v.id;
          return (
            <span key={v.id} style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: `1px solid ${on ? AT.accent : AT.rule}`, background: on ? AT.accentSoft : AT.panel, overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <button onClick={() => applyFilters(v.f)} style={{ all: 'unset', cursor: 'pointer', padding: '6px 6px 6px 13px', fontFamily: AT.body, fontWeight: 600, fontSize: 12.5, color: on ? AT.accent : AT.ink, whiteSpace: 'nowrap' }}>{v.name}</button>
              {on ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 5, gap: 1 }}>
                  <button onClick={() => updateView(v)} title="Update to current filters" style={{ all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: AT.accent }}><AIcon name="refund" size={12} color={AT.accent} /></button>
                  <button onClick={() => renameView(v)} title="Rename" style={{ all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: AT.accent }}><AIcon name="content" size={12} color={AT.accent} /></button>
                  <button onClick={() => deleteView(v)} title="Delete view" style={{ all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: AT.danger }}><AIcon name="close" size={12} color={AT.danger} /></button>
                </span>
              ) : <span style={{ paddingRight: 8 }} />}
            </span>
          );
        })}
        {!matched && hasFilters && (
          <button onClick={saveCurrentView} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: `1px dashed ${AT.accent}`, color: AT.accent, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}><AIcon name="plus" size={13} color={AT.accent} /> Save current as view</button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {ORDER_FILTERS.map(f => {
          const active = filter === f.id;
          const n = f.id === 'all' ? orders.length : orders.filter(o => o.status === f.id).length;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
              background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
              border: `1px solid ${active ? AT.ink : AT.rule}`,
              fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
            }}>{f.label} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>
          );
        })}
        <div style={{ flex: 1 }} />
        <AExportMenu list={list} toast={toast} />
        <ASearch value={q} onChange={setQ} placeholder="Search ref, alias, email…" />
      </div>

      {/* Secondary filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <ASelect label="Payment" value={payStatusFilter} onChange={setPayStatusFilter} options={ORDER_PAY_STATUS.map(s => ({ value: s.value, label: s.label, count: s.value === 'all' ? undefined : orders.filter(o => orderPayStatus(o) === s.value).length }))} />
        <ASelect label="Method" value={payFilter} onChange={setPayFilter} options={[{ value: 'all', label: 'All' }, ...payMethods.map(m => ({ value: m, label: payMethodLabel(m), count: orders.filter(o => o.payMethod === m).length }))]} />
        <ASelect label="Type" value={typeFilter} onChange={setTypeFilter} options={[{ value: 'all', label: 'All' }, { value: 'shipping', label: 'Shipping' }, { value: 'pickup', label: 'Pickup' }]} />
        <AMultiSelect label="Courier" value={courierFilter} onChange={setCourierFilter} options={couriers.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1), count: orders.filter(o => o.courier === c).length }))} />
        <ASelect label="VAT" value={vatFilter} onChange={setVatFilter} options={[{ value: 'all', label: 'All' }, { value: 'standard', label: 'Standard VAT', count: orders.filter(o => !isReverseCharge(o)).length }, { value: 'reverse', label: 'Reverse charge', count: orders.filter(o => isReverseCharge(o)).length }]} />
        <ASelect label="Amount" value={amountFilter} onChange={setAmountFilter} options={AMOUNT_BANDS.map(b => ({ value: b.value, label: b.label }))} />
        <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'total-d', label: 'Total ↓' }, { value: 'total-a', label: 'Total ↑' }]} />
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}><strong style={{ color: AT.ink, fontWeight: 700 }}>{list.length}</strong> of {orders.length}</span>
      </div>

      {/* Active filters — what you're seeing right now (removable) */}
      {(() => {
        const fmtD = (s) => s ? s.slice(5).replace('-', '/') : '…';
        const chips = [];
        if (filter !== 'all') chips.push({ k: 'f', label: 'Status', val: (ORDER_FILTERS.find(x => x.id === filter) || {}).label, onX: () => setFilter('all') });
        if (payStatusFilter !== 'all') chips.push({ k: 'ps', label: 'Payment', val: (ORDER_PAY_STATUS.find(x => x.value === payStatusFilter) || {}).label, onX: () => setPayStatusFilter('all') });
        if (payFilter !== 'all') chips.push({ k: 'pm', label: 'Method', val: payMethodLabel(payFilter), onX: () => setPayFilter('all') });
        if (typeFilter !== 'all') chips.push({ k: 'ty', label: 'Type', val: typeFilter === 'shipping' ? 'Shipping' : 'Pickup', onX: () => setTypeFilter('all') });
        courierFilter.forEach(c => chips.push({ k: 'co_' + c, label: 'Courier', val: c.charAt(0).toUpperCase() + c.slice(1), onX: () => setCourierFilter(courierFilter.filter(x => x !== c)) }));
        if (vatFilter !== 'all') chips.push({ k: 'vat', label: 'VAT', val: vatFilter === 'reverse' ? 'Reverse charge' : 'Standard VAT', onX: () => setVatFilter('all') });
        if (amountFilter !== 'all') chips.push({ k: 'amt', label: 'Amount', val: (AMOUNT_BANDS.find(x => x.value === amountFilter) || {}).label, onX: () => setAmountFilter('all') });
        if (from || to) chips.push({ k: 'date', label: 'Date', val: fmtD(from) + ' → ' + fmtD(to), onX: () => { setFrom(''); setTo(''); } });
        if (q) chips.push({ k: 'q', label: 'Search', val: '“' + q + '”', onX: () => setQ('') });
        if (sort !== 'newest') chips.push({ k: 'sort', label: 'Sort', val: ({ oldest: 'Oldest', 'total-d': 'Total ↓', 'total-a': 'Total ↑' })[sort], onX: () => setSort('newest') });
        if (chips.length === 0) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16, padding: '10px 12px', background: AT.surfaceAlt, borderRadius: AT.radiusSm, border: `1px solid ${AT.ruleSoft}` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft }}><AIcon name="filter" size={13} color={AT.inkSoft} />Filters</span>
            {chips.map(c => (
              <span key={c.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 28, padding: '0 4px 0 11px', borderRadius: 999, background: AT.panel, border: `1px solid ${AT.rule}` }}>
                <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{c.label}:</span>
                <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, color: AT.ink }}>{c.val}</span>
                <button onClick={c.onX} title={'Remove ' + c.label + ' filter'} style={{ all: 'unset', cursor: 'pointer', width: 19, height: 19, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: AT.inkSoft, background: AT.surfaceAlt }}><AIcon name="close" size={11} color={AT.inkSoft} /></button>
              </span>
            ))}
            <button onClick={() => { setFilter('all'); setPayFilter('all'); setPayStatusFilter('all'); setVatFilter('all'); setAmountFilter('all'); setTypeFilter('all'); setCourierFilter([]); setFrom(''); setTo(''); setQ(''); setSort('newest'); }} style={{ all: 'unset', cursor: 'pointer', marginLeft: 2, fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.accent }}>Clear all</button>
            {!matched && hasFilters && (
              <button onClick={saveCurrentView} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto', fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.ink }}><AIcon name="plus" size={13} color={AT.ink} /> Save as view</button>
            )}
          </div>
        );
      })()}

      <ATable columns={[
        { label: <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} /> },
        { label: 'Order' }, { label: 'Date' }, { label: 'Market' }, { label: 'Customer' }, { label: 'Type' }, { label: 'Items' },
        { label: 'Payment' }, { label: 'Total', align: 'right' }, { label: 'Status' }, { label: '' },
      ]}>
        {visible.map(o => {
          const sel = selected.includes(o.ref);
          const om = o.market || o.country || 'LV';
          return (
            <tr key={o.ref} style={{ cursor: 'pointer', background: sel ? AT.accentSoft : undefined }}>
              <ATd><input type="checkbox" checked={sel} onClick={e => e.stopPropagation()} onChange={() => toggleSel(o.ref)} /></ATd>
              <ATd mono strong onClick={() => nav('orders', { ref: o.ref })}>#{o.ref}<span style={{ display: 'block', fontWeight: 400, fontSize: 10.5, color: AT.inkSoft }}>{orderInvoiceNo(o)}</span></ATd>
              <ATd mono onClick={() => nav('orders', { ref: o.ref })}>{o.date.slice(5)}</ATd>
              <ATd onClick={() => nav('orders', { ref: o.ref })}><span title={marketById(om).country} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 20, padding: '0 6px', borderRadius: 5, background: AT.surfaceAlt, color: AT.ink, fontFamily: AT.mono, fontSize: 11, fontWeight: 700 }}>{om}</span></ATd>
              <ATd onClick={() => nav('orders', { ref: o.ref })}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  <AAvatar name={o.alias} size={28} />
                  <span><span style={{ fontWeight: 700, color: AT.ink }}>{o.alias}</span><span style={{ display: 'block', fontSize: 11.5, color: AT.inkSoft }}>{o.email}</span></span>
                </span>
              </ATd>
              <ATd onClick={() => nav('orders', { ref: o.ref })}><ABadge tone={orderType(o) === 'Shipping' ? 'blue' : 'neutral'}>{orderType(o)}</ABadge></ATd>
              <ATd onClick={() => nav('orders', { ref: o.ref })}>{o.items.reduce((s, i) => s + i.qty, 0)}</ATd>
              <ATd style={{ textTransform: 'capitalize' }} onClick={() => nav('orders', { ref: o.ref })}>{payMethodLabel(o.payMethod)}{o.payFailed ? <span style={{ display: 'block', fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, color: AT.danger, marginTop: 2, textTransform: 'none' }}>Payment failed</span> : null}</ATd>
              <ATd mono strong align="right" onClick={() => nav('orders', { ref: o.ref })}>{fmtMoney(o.total, om)}</ATd>
              <ATd onClick={() => nav('orders', { ref: o.ref })}><AStatus status={o.status} />{(() => { const rf = (o.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0); const rem = (Number(o.total) || 0) - rf; return rf > 0.005 && rem > 0.005 ? <span style={{ display: 'block', fontFamily: AT.body, fontSize: 10.5, fontWeight: 600, color: AT.warn, marginTop: 3 }}>Partially refunded</span> : null; })()}</ATd>
              <ATd align="right" onClick={() => nav('orders', { ref: o.ref })}><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
            </tr>
          );
        })}
      </ATable>
      {list.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No orders match" sub="Try a different status or search." /></div>}

      {/* Infinite-scroll sentinel + footer (auto-loads on scroll; click to load manually) */}
      {list.length > 0 && (
        <div ref={loadMoreRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 0 6px' }}>
          {hasMore ? (
            <button onClick={loadMore} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 16px', borderRadius: 999, border: `1px solid ${AT.rule}`, background: AT.panel, fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.ink }}>
              <span style={{ width: 13, height: 13, borderRadius: 999, border: `2px solid ${AT.rule}`, borderTopColor: AT.accent, display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Load more · <span style={{ color: AT.inkSoft }}>showing {visible.length} of {list.length}</span>
            </button>
          ) : (list.length > ORDERS_PAGE ? <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>All {list.length} orders loaded</span> : null)}
        </div>
      )}

      {/* Bulk action toolbar */}
      {selected.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: 'calc(50% + 124px)', transform: 'translateX(-50%)', zIndex: 120,
          background: AT.ink, color: '#fff', borderRadius: 12, padding: '8px 8px 8px 16px',
          display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 14px 40px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, marginRight: 6 }}>{selected.length} selected</span>
          {[['download', 'Export', bulkExport], ['content', 'Print', bulkPrint], ['catalog', 'Duplicate', bulkDuplicate], ['trash', 'Delete', bulkDelete]].map(([ic, l, fn]) => (
            <button key={l} onClick={fn} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 8, fontFamily: AT.body, fontWeight: 600, fontSize: 13, color: l === 'Delete' ? '#FF8A8A' : '#fff' }}><AIcon name={ic} size={15} color={l === 'Delete' ? '#FF8A8A' : '#fff'} /> {l}</button>
          ))}
          <button onClick={() => setSelected([])} style={{ all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}><AIcon name="x" size={16} color="#fff" /></button>
        </div>
      )}

      </React.Fragment>)}

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, overflow: 'hidden', position: 'sticky', top: 90, height: 'calc(100vh - 110px)' }}>
          {/* Detail header — fixed: identity, all CTAs, section shortcuts */}
          <div style={{ flexShrink: 0, borderBottom: `1px solid ${AT.rule}`, background: AT.panel }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 20px 11px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 21, letterSpacing: AT.ld, color: AT.ink }}>#{open.ref}</span>
                  <AStatus status={open.status} />
                  {(() => { const rf = (open.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0); const rem = (Number(open.total) || 0) - rf; return rf > 0.005 && rem > 0.005 ? <ABadge tone="warn">Partially refunded</ABadge> : null; })()}
                  {open.tracking && <ABadge tone="blue">Tracking {open.tracking}</ABadge>}
                  {isReverseCharge(open) && <ViesChip order={open} />}
                </div>
                <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginTop: 3 }}>{open.date} · {open.alias} · {orderInvoiceNo(open)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button onClick={() => toast('Order printed')} style={miniTool}><AIcon name="content" size={15} /> Print</button>
                <button onClick={() => confirm({ title: 'Duplicate this order?', body: `Order #${open.ref} will be copied as a new pending order. The original stays as it is.`, confirmLabel: 'Yes, duplicate', icon: 'catalog', tone: 'primary', onConfirm: () => { duplicateOrder(open.ref); toast('Order duplicated'); } })} style={miniTool}><AIcon name="catalog" size={15} /> Duplicate</button>
                {actionsFor(open).map(([l, fn, kind]) => (<ABtn key={l} kind={kind} size="sm" onClick={() => { fn(); }}>{l}</ABtn>))}
                <button onClick={() => nav('orders')} title="Close" style={{ all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999, background: AT.surfaceAlt, color: AT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="close" size={18} /></button>
              </div>
            </div>
            {/* Section shortcuts (jump to block) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 20px 12px', flexWrap: 'wrap' }}>
              {[['od-items', 'Items'], ['od-payment', 'Payment & refunds'], ['od-delivery', 'Delivery'], ['od-docs', 'Documents']].map(([sid, lbl]) => {
                const on = secActive === sid;
                return <button key={sid} onClick={() => goToSection(sid)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '6px 13px', borderRadius: 999, border: `1px solid ${on ? AT.ink : AT.rule}`, background: on ? AT.ink : AT.panel, color: on ? '#fff' : AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{lbl}</button>;
              })}
            </div>
          </div>
          <div ref={detailScrollRef} style={{ flex: 1, overflowY: 'auto', padding: 22, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div id="od-items" style={{ ...dCard, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {dHead('orders', 'Items', open.items.reduce((s, i) => s + i.qty, 0) + ' unit' + (open.items.reduce((s, i) => s + i.qty, 0) === 1 ? '' : 's') + ' · ' + open.items.length + ' line' + (open.items.length === 1 ? '' : 's'))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {open.items.map(i => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${AT.ruleSoft}` }}>
                      <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>{i.name} <span style={{ color: AT.inkSoft, fontWeight: 400 }}>× {i.qty}</span></span>
                      <span style={{ fontFamily: AT.mono, fontSize: 13, color: AT.ink }}>{i.id === 'gift' ? '€0' : money(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[['Subtotal', money(open.subtotal)], ...(open.discount ? [['Discount', '−' + money(open.discount)]] : []), ['Shipping', open.shipping === 0 ? 'Free' : money(open.shipping)]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>
                      <span>{l}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, marginTop: 4, borderTop: `1px solid ${AT.rule}` }}>
                    <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>Total <span style={{ fontWeight: 400, fontSize: 11.5, color: AT.inkSoft }}>{isReverseCharge(open) ? 'incl. 0% VAT' : 'incl. VAT'}</span></span>
                    <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink }}>{money(open.total)}</span>
                  </div>
                </div>
              </div>

            {(() => {
              const F = orderFinance(open, window.SEED_PAYOUTS);
              const om = open.market || open.country || 'LV';
              const mk = marketById(om);
              const payTone = { captured: 'ok', refunded: 'danger', partial: 'warn', unpaid: 'warn', cancelled: 'neutral' }[F.payState] || 'neutral';
              const payLabel = { captured: 'Captured', refunded: 'Refunded', partial: 'Partially refunded', unpaid: 'Awaiting payment', cancelled: 'Cancelled' }[F.payState] || F.payState;
              const cardStyle = { border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, padding: 16 };
              const cardHead = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 };
              const cardIcon = { width: 34, height: 34, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
              const rowKV = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', fontFamily: AT.body, fontSize: 13 };
              return (
                <div id="od-payment" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Invoice */}
                  <div style={cardStyle}>
                    <div style={cardHead}>
                      <span style={cardIcon}><AIcon name="finance" size={17} color={AT.ink} /></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Invoice</div>
                        <div style={{ fontFamily: AT.mono, fontSize: 12, color: AT.accent }}>{F.invoice}</div>
                        {F.business && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 1 }}>{open.company ? open.company + ' · ' : ''}VAT {F.vatNo}</div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                        <ABadge tone={F.payState === 'refunded' ? 'danger' : F.payState === 'partial' ? 'warn' : F.payState === 'captured' ? 'ok' : 'warn'}>{F.payState === 'captured' ? 'Paid' : F.payState === 'refunded' ? 'Refunded' : F.payState === 'partial' ? 'Partially refunded' : 'Draft'}</ABadge>
                        {F.reverseCharge && <ABadge tone="blue">Reverse charge</ABadge>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 8 }}>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>Net{F.reverseCharge ? '' : ' (ex VAT)'}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{fmtMoney(F.net, om)}</span></div>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>{F.reverseCharge ? 'VAT 0% · reverse charge' : `VAT ${(mk.vat * 100).toFixed(mk.vat * 100 % 1 ? 1 : 0)}% · ${mk.id}`}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{fmtMoney(F.vat, om)}</span></div>
                      <div style={{ ...rowKV, paddingTop: 8, borderTop: `1px solid ${AT.ruleSoft}` }}><span style={{ fontWeight: 700, color: AT.ink }}>{F.reverseCharge ? 'Total (0% VAT)' : 'Total incl. VAT'}</span><span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink }}>{fmtMoney(F.gross, om)}</span></div>
                      {F.refunded > 0.005 && (
                        <>
                          <div style={{ ...rowKV, color: AT.danger }}><span>Refunded</span><span style={{ fontFamily: AT.mono }}>−{fmtMoney(F.refunded, om)}</span></div>
                          <div style={{ ...rowKV, paddingTop: 8, borderTop: `1px solid ${AT.ruleSoft}` }}><span style={{ fontWeight: 700, color: AT.ink }}>{F.partial ? 'Net charged' : 'Net charged'}</span><span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>{fmtMoney(F.remaining, om)}</span></div>
                        </>
                      )}
                    </div>
                    {F.reverseCharge && (
                      <div style={{ marginTop: 10, padding: '9px 11px', borderRadius: AT.radiusSm, background: AT.accentSoft, fontFamily: AT.body, fontSize: 11.5, lineHeight: 1.45, color: '#21438C' }}>
                        Reverse charge — VAT to be accounted by the recipient. Intra-Community supply (Art. 196, Dir. 2006/112/EC). Customer EU VAT No. <strong>{F.vatNo}</strong>.
                      </div>
                    )}
                    {F.reverseCharge && <ViesPanel order={open} ctx={ctx} />}
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button onClick={() => toast('Invoice ' + F.invoice + ' downloaded')} style={miniTool}><AIcon name="download" size={15} /> Download PDF</button>
                      <button onClick={() => toast('Invoice sent to ' + open.email)} style={miniTool}><AIcon name="mail" size={15} /> Send to customer</button>
                    </div>
                  </div>

                  {/* Payment */}
                  <div style={cardStyle}>
                    <div style={cardHead}>
                      <span style={cardIcon}><AIcon name="plug" size={17} color={AT.ink} /></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Payment</div>
                        <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, textTransform: 'capitalize' }}>{open.payMethod}</div>
                      </div>
                      <ABadge tone={payTone}>{payLabel}</ABadge>
                    </div>
                    <div style={{ borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 8 }}>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>Gateway</span><span style={{ color: AT.ink, textTransform: 'capitalize' }}>{open.payMethod}</span></div>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>Transaction</span><span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.ink }}>{F.txn}</span></div>
                      <div style={{ ...rowKV, color: AT.inkSoft }}><span>Charged</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{['captured', 'refunded', 'partial'].includes(F.payState) ? fmtMoney(F.gross, om) : '—'}</span></div>
                      {F.refunded > 0.005 && <div style={{ ...rowKV, color: AT.danger }}><span>Refunded</span><span style={{ fontFamily: AT.mono }}>−{fmtMoney(F.refunded, om)}</span></div>}
                    </div>
                    {open.status === 'pending' && <div style={{ marginTop: 12 }}><ABtn kind="primary" size="sm" onClick={() => { setStatus(open.ref, 'paid', `Order #${open.ref} marked paid`); }}>Mark as paid</ABtn></div>}
                  </div>

                  {/* Refunds — correct VAT / total / overcharge mistakes */}
                  {(() => {
                    const refunds = open.refunds || [];
                    const refundedTotal = refunds.reduce((s, r) => s + (Number(r.amount) || 0), 0);
                    const remaining = Math.max(0, (Number(open.total) || 0) - refundedTotal);
                    const canRefund = remaining > 0.005 && ['paid', 'shipped', 'delivered'].includes(open.status);
                    return (
                      <div style={cardStyle}>
                        <div style={cardHead}>
                          <span style={cardIcon}><AIcon name="refund" size={17} color={AT.ink} /></span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Refunds</div>
                            <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>Repay the customer for a VAT, total or pricing mistake</div>
                          </div>
                          {refundedTotal > 0 && <ABadge tone={remaining <= 0.005 ? 'danger' : 'warn'}>{remaining <= 0.005 ? 'Fully refunded' : 'Partially refunded'}</ABadge>}
                        </div>
                        {refunds.length > 0 ? (
                          <div style={{ borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 4 }}>
                            {refunds.map((r, i) => (
                              <div key={i} style={{ display: 'flex', gap: 11, padding: '9px 0', borderBottom: i < refunds.length - 1 ? `1px solid ${AT.ruleSoft}` : 'none' }}>
                                <span style={{ fontFamily: AT.mono, fontWeight: 700, fontSize: 13, color: AT.danger, minWidth: 64 }}>−{fmtMoney(r.amount, om)}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.ink }}>{r.reasonLabel || r.reason}</div>
                                  {r.note && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 1, lineHeight: 1.4 }}>{r.note}</div>}
                                  <div style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft, marginTop: 2 }}>{r.ts}{r.actor ? ' · ' + r.actor : ''}</div>
                                </div>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 9, marginTop: 2, borderTop: `1px solid ${AT.rule}`, fontFamily: AT.body, fontSize: 13 }}>
                              <span style={{ fontWeight: 700, color: AT.ink }}>Total refunded</span>
                              <span style={{ fontFamily: AT.mono, fontWeight: 700, color: AT.danger }}>−{fmtMoney(refundedTotal, om)}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: '10px 12px', borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>No refunds on this order. If the VAT, a total or a price was wrong, issue a partial or full refund here.</div>
                        )}
                        {canRefund && (
                          <div style={{ marginTop: 14 }}>
                            <ABtn kind="danger" size="sm" onClick={() => askRefund(open)} style={{ background: AT.danger, color: '#fff', borderColor: AT.danger }}>
                              {refundedTotal > 0 ? 'Issue another refund' : 'Issue a refund'}
                            </ABtn>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Payout */}
                  <div style={cardStyle}>
                    <div style={cardHead}>
                      <span style={cardIcon}><AIcon name="finance" size={17} color={AT.ink} /></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>Payout / settlement</div>
                        <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>When these funds reach your bank</div>
                      </div>
                      {F.payout && <ABadge tone={F.payout.status === 'paid' ? 'ok' : 'warn'}>{F.payout.status}</ABadge>}
                    </div>
                    {F.payout ? (
                      <button onClick={() => { openIn('finances'); toast('Open Finances → Payouts for ' + F.payout.id); }} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: AT.radiusSm, background: AT.surfaceAlt, width: '100%', boxSizing: 'border-box' }}>
                        <span style={{ fontFamily: AT.mono, fontWeight: 700, fontSize: 13, color: AT.accent }}>{F.payout.id}</span>
                        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{F.payout.method} · {F.payout.date}</span>
                        <div style={{ flex: 1 }} />
                        <AIcon name="arrow" size={15} color={AT.inkSoft} />
                      </button>
                    ) : (
                      <div style={{ padding: '10px 12px', borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Not settled yet — this order isn't paid, so it isn't part of a payout batch.</div>
                    )}
                  </div>
                </div>
              );
            })()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ ...dCard, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {dHead('users', 'Customer', null, <button onClick={() => openIn('customers', { email: open.email })} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: AT.body, fontWeight: 700, fontSize: 12, color: AT.accent }}>Profile <AIcon name="chev" size={13} color={AT.accent} /></button>)}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AAvatar name={open.alias} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14.5, color: AT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{open.company || open.alias}</div>
                    <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{open.email}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 13 }}>
                  {[['Payment', open.payMethod], ['Country', open.country], ...(open.vatNo ? [['VAT number', open.vatNo]] : []), ['Order ref', '#' + open.ref]].map(([l, v]) => (
                    <div key={l} style={{ minWidth: 0 }}>
                      <div style={labelStyle}>{l}</div>
                      <div style={{ fontFamily: (l === 'VAT number' || l === 'Order ref') ? AT.mono : AT.body, fontSize: 13, color: AT.ink, textTransform: l === 'Payment' ? 'capitalize' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div id="od-delivery" style={{ ...dCard, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {dHead('truck', 'Delivery & tracking', orderType(open), open.tracking ? <ABadge tone="blue">{open.tracking}</ABadge> : null)}
                {/* Map placeholder */}
                <div style={{ position: 'relative', height: 150, borderRadius: AT.radiusSm, overflow: 'hidden', border: `1px solid ${AT.rule}`, background: '#E8ECEF' }}>
                  <svg viewBox="0 0 400 150" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <rect width="400" height="150" fill="#E8ECEF" />
                    {[30, 70, 110].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#D2D8DC" strokeWidth="1" />)}
                    {[80, 160, 240, 320].map(x => <line key={x} x1={x} x2={x} y1="0" y2="150" stroke="#D2D8DC" strokeWidth="1" />)}
                    <path d="M40 120 Q160 60 360 40" fill="none" stroke={AT.accent} strokeWidth="2.5" strokeDasharray="6 5" />
                    <circle cx="40" cy="120" r="5" fill={AT.ink} />
                    <circle cx="360" cy="40" r="6" fill={AT.accent} />
                  </svg>
                  <span style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: AT.body, fontSize: 11, color: AT.inkSoft, background: 'rgba(255,255,255,0.85)', padding: '2px 7px', borderRadius: 5 }}>{open.locker}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Courier', open.courier], ['Pickup / address', open.locker], ['Tracking', open.tracking || '—'], ['Parcel sender', open.sender]].map(([l, v]) => (
                    <div key={l}><div style={labelStyle}>{l}</div><div style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, textTransform: l === 'Courier' ? 'capitalize' : 'none' }}>{v}</div></div>
                  ))}
                </div>
                {/* Timeline */}
                <div>
                  <div style={{ ...labelStyle, marginBottom: 10 }}>Progress</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {timeline(open).map((s, i, arr) => (
                      <div key={s.k} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ width: 16, height: 16, borderRadius: 999, background: s.done ? AT.accent : AT.panel, border: `2px solid ${s.done ? AT.accent : AT.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.done && <AIcon name="check" size={9} color="#fff" sw={3} />}</span>
                          {i < arr.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 22, background: s.done ? AT.accent : AT.rule }} />}
                        </div>
                        <div style={{ paddingBottom: 14 }}>
                          <div style={{ fontFamily: AT.body, fontSize: 13.5, fontWeight: s.done ? 700 : 500, color: s.done ? AT.ink : AT.inkSoft }}>{s.l}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div id="od-docs" style={{ ...dCard, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dHead('content', 'Documents', 'Plain-pack — no product names or logos')}
                {[
                  ['Invoice (PDF)', 'Billed as NL Trading Co — no product names', 'download'],
                  ['Shipping label', `${open.courier} · ${orderType(open)}`, 'truck'],
                  ['Packing slip', 'Plain — no logos or item descriptions', 'content'],
                  ['Customs note', open.country === 'LV' ? 'Not required (domestic)' : 'CN22', 'pkg'],
                ].map(([l, sub, ic]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}` }}>
                    <span style={{ width: 38, height: 38, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={ic} size={18} color={AT.ink} /></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13.5, color: AT.ink }}>{l}</div>
                      <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{sub}</div>
                    </div>
                    <ABtn kind="ghost" size="sm" onClick={() => toast(`${l} generated`)}>Generate</ABtn>
                  </div>
                ))}
                <div style={{ padding: 14, borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.5 }}>
                  Customer PII is automatically deleted 30 days after delivery — only anonymised order metrics are retained.
                </div>

                {/* Change log for this order */}
                {(() => {
                  const entries = (ctx.audit || []).filter(a => a.target === open.ref);
                  return (
                    <div>
                      <div style={{ ...labelStyle, marginBottom: 10 }}>Change log</div>
                      {entries.length === 0 ? (
                        <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>No recorded actions yet for this order.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          {entries.map((a, i, arr) => (
                            <div key={a.id} style={{ display: 'flex', gap: 12 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ width: 9, height: 9, borderRadius: 999, background: AT.accent, marginTop: 5 }} />
                                {i < arr.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 18, background: AT.rule }} />}
                              </div>
                              <div style={{ paddingBottom: 12 }}>
                                <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink }}><strong>{a.actor}</strong> · {a.action}{a.detail ? ' — ' + a.detail : ''}</div>
                                <div style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{a.ts}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
const miniTool = { all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 8, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 };

Object.assign(window, { ADashboard, AOrders });
