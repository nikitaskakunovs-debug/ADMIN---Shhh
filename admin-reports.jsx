// admin-reports.jsx — consolidated Reports hub (data layer + chart primitives +
// tab bodies + hub shell). Merged into one file to minimise in-browser script
// fetches. Finances hub lives in admin-finances.jsx and loads after this.


// ===== admin-reports-data.jsx =====
// admin-reports-data.jsx — the analytics/reporting data layer.
// Derives decision-grade metrics from the real (scoped) order book where the data
// supports it — product/brand/category margin, returns, repeat-rate, inventory
// velocity — and supplies deterministic seeded series for things the seed order
// book is too short to express (90-day trends, day×hour heatmap, cohorts, channel
// spend/ROAS, forecast). Everything is keyed off EUR-base order totals.

// ── Cost of goods (per unit, EUR). Margin = price − cost. ─────
// Hand-set so categories read realistically: premium carries the best € margin,
// accessories the best % margin, mid-range solo devices the thinnest.
const PRODUCT_COST = {
  'hush-01': 30,   // Satisfyer Pro 2 · €69
  'ripple': 64,    // Satisfyer Wand-er Woman · €129
  'velvet': 47,    // We-Vibe Sync 2 · €89
  'echo': 24,      // Womanizer Starlet 3 · €49
  'glow': 92,      // LELO Gigi 3 · €189
  'murmur': 17,    // Satisfyer Ultra Power Bullet · €39
  'drift': 30,     // Lovense Ferri · €59
  'halo': 13,      // We-Vibe Pivot · €34
};
// Variable cost rates applied on top of COGS to reach contribution margin.
const FEE_RATE = 0.019;        // payment gateway ~1.9%
const FULFIL_COST = 1.85;      // pick/pack/label per order line, EUR
function repCost(id) {
  if (PRODUCT_COST[id] != null) return PRODUCT_COST[id];
  const p = (window.PRODUCTS || []).find(x => x.id === id);
  return p ? Math.round(p.price * 0.48) : 0; // fallback 52% margin
}

const PAIDISH = ['paid', 'shipped', 'delivered'];

// ── Headline KPIs derived from a scoped order list ───────────
function repKpis(orders, customers) {
  const paid = orders.filter(o => PAIDISH.includes(o.status));
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const units = paid.reduce((s, o) => s + o.items.reduce((u, i) => u + (i.id === 'gift' ? 0 : i.qty), 0), 0);
  const cogs = paid.reduce((s, o) => s + o.items.reduce((c, i) => c + (i.id === 'gift' ? 0 : repCost(i.id) * i.qty), 0), 0);
  const fees = revenue * FEE_RATE;
  const fulfil = paid.reduce((s, o) => s + o.items.filter(i => i.id !== 'gift').length * FULFIL_COST, 0);
  const grossProfit = revenue - cogs;
  const contribution = grossProfit - fees - fulfil;
  const refundOrders = orders.filter(o => o.status === 'refunded');
  const refundAmt = refundOrders.reduce((s, o) => s + o.total, 0);
  const refundRate = paid.length ? (refundOrders.length / (paid.length + refundOrders.length)) * 100 : 0;
  const aov = paid.length ? revenue / paid.length : 0;
  const cust = customers || [];
  const repeatCust = cust.filter(c => (c.orderCount || 0) > 1).length;
  const repeatRate = cust.length ? (repeatCust / cust.length) * 100 : 0;
  const ltv = cust.length ? cust.reduce((s, c) => s + (c.ltv || 0), 0) / cust.length : 0;
  return {
    revenue, units, orders: paid.length, aov,
    cogs, grossProfit, grossMarginPct: revenue ? (grossProfit / revenue) * 100 : 0,
    fees, fulfil, contribution, contributionPct: revenue ? (contribution / revenue) * 100 : 0,
    refundAmt, refundRate, refundCount: refundOrders.length,
    repeatRate, repeatCust, ltv, customers: cust.length,
  };
}

// ── Per-product economics (units, revenue, COGS, margin) ─────
function repProducts(orders) {
  const m = {};
  orders.filter(o => PAIDISH.includes(o.status)).forEach(o => o.items.forEach(i => {
    if (i.id === 'gift') return;
    const p = (window.PRODUCTS || []).find(x => x.id === i.id); if (!p) return;
    const r = m[i.id] || (m[i.id] = { id: i.id, name: p.name, brand: p.brand, category: p.category, price: p.price, units: 0, revenue: 0, cogs: 0 });
    r.units += i.qty; r.revenue += i.price * i.qty; r.cogs += repCost(i.id) * i.qty;
  }));
  // attach returns (units returned) from the live returns queue by product name
  const ret = {};
  (window.PRODUCTS || []).forEach(p => { ret[p.name] = 0; });
  return Object.values(m).map(r => {
    const margin = r.revenue - r.cogs;
    return { ...r, margin, marginPct: r.revenue ? (margin / r.revenue) * 100 : 0, marginUnit: r.units ? margin / r.units : 0 };
  }).sort((a, b) => b.revenue - a.revenue);
}
function repByKey(products, key) {
  const m = {};
  products.forEach(p => {
    const r = m[p[key]] || (m[p[key]] = { label: p[key], units: 0, revenue: 0, cogs: 0, margin: 0, skus: 0 });
    r.units += p.units; r.revenue += p.revenue; r.cogs += p.cogs; r.margin += p.margin; r.skus += 1;
  });
  return Object.values(m).map(r => ({ ...r, marginPct: r.revenue ? (r.margin / r.revenue) * 100 : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Deterministic 90-day revenue series + prior period ───────
// Seeded so it is stable across reloads; weekend uplift + gentle growth trend.
function _seedNoise(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
const REP_DAYS_FULL = (() => {
  const out = [];
  const end = new Date('2026-06-02');
  for (let d = 364; d >= 0; d--) {
    const day = new Date(end); day.setDate(end.getDate() - d);
    const dow = day.getDay();
    const weekend = (dow === 5 || dow === 6) ? 1.28 : (dow === 0 ? 1.12 : 1);
    const trend = 1 + (364 - d) * 0.0011;            // gentle growth across the year
    const base = 540 * weekend * trend;
    const noise = 0.78 + _seedNoise(d * 3.1) * 0.5;
    out.push({ date: day.toISOString().slice(0, 10), value: Math.round(base * noise) });
  }
  return out;
})();
// Returns { labels, current[], prev[], curTotal, prevTotal } for a window length.
function repSeries(days) {
  const n = Math.min(days, REP_DAYS_FULL.length / 2 | 0 || days);
  const cur = REP_DAYS_FULL.slice(-days);
  const prev = REP_DAYS_FULL.slice(-days * 2, -days);
  // sample labels (≤ ~12 ticks)
  const step = Math.max(1, Math.ceil(cur.length / 8));
  const labels = cur.map((d, i) => (i % step === 0) ? d.date.slice(5) : '');
  return {
    labels,
    current: cur.map(d => d.value),
    prev: prev.map(d => d.value),
    curTotal: cur.reduce((s, d) => s + d.value, 0),
    prevTotal: prev.reduce((s, d) => s + d.value, 0),
    dates: cur.map(d => d.date),
  };
}

// ── Sales by day × hour heatmap (orders intensity) ───────────
const REP_HEATMAP = (() => {
  const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // hour weighting: low overnight, evening peak ~20:00–23:00 (discreet shopping)
  const hourW = [3,2,1,1,1,1,2,4,6,7,7,8,9,8,7,7,8,10,13,17,21,22,18,9];
  const rows = dows.map((d, di) => {
    const dayW = di >= 4 ? 1.25 : 1; // Fri–Sun heavier
    return {
      label: d,
      cells: hourW.map((w, h) => Math.round(w * dayW * (0.7 + _seedNoise(di * 24 + h) * 0.6))),
    };
  });
  let max = 0; rows.forEach(r => r.cells.forEach(c => { if (c > max) max = c; }));
  return { rows, max, hours: Array.from({ length: 24 }, (_, h) => h) };
})();

// ── Acquisition channels: spend, orders, revenue, CAC, ROAS ──
const REP_CHANNELS = [
  { label: 'Direct / type-in', color: '#0A0A0A', spend: 0,    orders: 176, revenue: 14820, newCust: 71 },
  { label: 'Organic search',   color: '#1F8A4C', spend: 640,  orders: 132, revenue: 10980, newCust: 88 },
  { label: 'Paid search',      color: '#2D4BFF', spend: 2960, orders: 121, revenue:  9870, newCust: 96 },
  { label: 'Paid social',      color: '#9A6BFF', spend: 2180, orders:  74, revenue:  5610, newCust: 60 },
  { label: 'Email / CRM',      color: '#E0A800', spend: 240,  orders:  93, revenue:  7240, newCust: 12 },
  { label: 'Referral',         color: '#C2410C', spend: 0,    orders:  41, revenue:  3380, newCust: 24 },
].map(c => ({
  ...c,
  aov: c.orders ? c.revenue / c.orders : 0,
  cac: c.newCust ? c.spend / c.newCust : 0,
  roas: c.spend ? c.revenue / c.spend : null,
}));

// ── Monthly acquisition cohorts → retention % by month index ─
// rows: cohort month; cols: months since first order (0 = acquisition month).
const REP_COHORTS = [
  { cohort: 'Jan 2026', size: 142, ret: [100, 31, 22, 18, 15, 13] },
  { cohort: 'Feb 2026', size: 168, ret: [100, 34, 25, 19, 16] },
  { cohort: 'Mar 2026', size: 191, ret: [100, 36, 27, 21] },
  { cohort: 'Apr 2026', size: 213, ret: [100, 38, 29] },
  { cohort: 'May 2026', size: 247, ret: [100, 41] },
  { cohort: 'Jun 2026', size: 96,  ret: [100] },
];

// ── Promo / discount performance (depth vs incremental margin) ─
const REP_PROMOS = [
  { code: 'SUMMER20', type: '−20%', uses: 168, revenue: 9240, discount: 2310, marginAfter: 2870, newCust: 61 },
  { code: 'WELCOME10', type: '−10%', uses: 204, revenue: 7180, discount: 798, marginAfter: 2940, newCust: 188 },
  { code: 'COUPLES15', type: '−15%', uses: 73, revenue: 4620, discount: 815, marginAfter: 1510, newCust: 22 },
  { code: 'FREESHIP', type: 'Free ship', uses: 121, revenue: 6010, discount: 302, marginAfter: 2480, newCust: 31 },
];

// ── Targets (editable, persisted) ────────────────────────────
// Monthly goals the owner sets; drive run-rate / pacing in Reports + Finances.
const REP_TARGET_KEY = 'shhh_admin_targets_v1';
function repLoadTargets() {
  try { const t = JSON.parse(localStorage.getItem(REP_TARGET_KEY) || 'null'); if (t && typeof t.revenue === 'number') return t; } catch (e) {}
  return { revenue: 19500, margin: 50 };
}
function repSaveTargets(t) { try { localStorage.setItem(REP_TARGET_KEY, JSON.stringify(t)); } catch (e) {} }

// ── Run-rate forecast for the current month ──────────────────
function repForecast(orders, target) {
  const paid = orders.filter(o => PAIDISH.includes(o.status));
  const dayOfMonth = 2, daysInMonth = 30;        // "today" = 2 Jun 2026
  // Use the seeded series as the basis for a believable MTD vs run-rate figure.
  const mtd = REP_DAYS_FULL.slice(-dayOfMonth).reduce((s, d) => s + d.value, 0);
  const dailyAvg = mtd / dayOfMonth;
  const projected = Math.round(dailyAvg * daysInMonth);
  const lastMonth = REP_DAYS_FULL.slice(-(dayOfMonth + daysInMonth), -dayOfMonth).reduce((s, d) => s + d.value, 0);
  target = (target && target > 0) ? target : 19500;
  const remainingDays = Math.max(0, daysInMonth - dayOfMonth);
  const requiredDaily = remainingDays > 0 ? Math.max(0, (target - mtd) / remainingDays) : 0;
  const gap = target - projected;
  return { mtd, projected, lastMonth, target, dayOfMonth, daysInMonth, dailyAvg, remainingDays, requiredDaily, gap,
    pace: lastMonth ? (projected / lastMonth - 1) * 100 : 0,
    paceVsRequired: dailyAvg ? (dailyAvg / (requiredDaily || dailyAvg) - 1) * 100 : 0,
    targetPct: target ? (projected / target) * 100 : 0 };
}

// ── Inventory velocity / days-of-cover / restock signal ──────
function repInventory(orders, stock) {
  const windowDays = 30;
  const sold = {};
  orders.filter(o => PAIDISH.includes(o.status)).forEach(o => o.items.forEach(i => {
    if (i.id === 'gift') return; sold[i.id] = (sold[i.id] || 0) + i.qty;
  }));
  return (window.PRODUCTS || []).map(p => {
    const onHand = (stock && stock[p.id] != null) ? stock[p.id] : 0;
    const units = sold[p.id] || 0;
    const velocity = units / windowDays;                 // units/day
    const cover = velocity > 0 ? onHand / velocity : Infinity;
    const sellThrough = (onHand + units) > 0 ? (units / (onHand + units)) * 100 : 0;
    let signal = 'ok';
    if (onHand === 0) signal = 'out';
    else if (cover < 10) signal = 'low';
    else if (cover > 75 && velocity > 0) signal = 'slow';
    else if (velocity === 0) signal = 'dead';
    return { id: p.id, name: p.name, brand: p.brand, onHand, units, velocity, cover, sellThrough, signal, margin: p.price - repCost(p.id) };
  }).sort((a, b) => a.cover - b.cover);
}

// ── Per-market comparison (uses the UNSCOPED order book) ─────
function repMarkets(allOrders, business) {
  const live = (window.MARKETS || []).filter(m => m.status === 'live');
  return live.map(mk => {
    const os = allOrders.filter(o => (o.business || 'shhh') === business && (o.market || o.country) === mk.id);
    const k = repKpis(os, []);
    return { id: mk.id, country: mk.country, vat: mk.vat, ...k };
  }).sort((a, b) => b.revenue - a.revenue);
}

// New vs returning split (by scoped customers)
function repNewReturning(customers) {
  const c = customers || [];
  const returning = c.filter(x => (x.orderCount || 0) > 1).length;
  const fresh = c.length - returning;
  return { returning, fresh, total: c.length };
}

Object.assign(window, {
  PRODUCT_COST, repCost, repKpis, repProducts, repByKey, repSeries, REP_DAYS_FULL,
  REP_HEATMAP, REP_CHANNELS, REP_COHORTS, REP_PROMOS, repForecast, repInventory,
  repMarkets, repNewReturning, PAIDISH, repLoadTargets, repSaveTargets, REP_TARGET_KEY,
});


// ===== admin-reports-charts.jsx =====
// admin-reports-charts.jsx — extra presentation primitives for the Reports hub.
// Built on the same AT tokens / SVG approach as admin-ui.jsx's charts.

// ── Sparkline (area + line), deterministic, no axes ──────────
function ASparkline({ data = [], color = AT.accent, height = 34, fill = true, strokeW = 1.8 }) {
  if (!data.length) return null;
  const W = 120, H = height, pad = 2;
  const max = Math.max(...data), min = Math.min(...data), span = (max - min) || 1;
  const x = (i) => pad + (W - pad * 2) * (i / (data.length - 1));
  const y = (v) => pad + (H - pad * 2) * (1 - (v - min) / span);
  const line = data.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L ${x(data.length - 1).toFixed(1)} ${H} L ${x(0).toFixed(1)} ${H} Z`;
  const id = 'sg' + Math.abs(data[0] * 31 + data.length).toString(36);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.22" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeW} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── KPI tile: label · big value · delta · compare sub · spark ─
function AKpiTile({ label, value, delta, deltaTone = 'ok', sub, spark, sparkColor = AT.accent, icon, onClick }) {
  const toneCol = deltaTone === 'ok' ? AT.ok : deltaTone === 'warn' ? AT.warn : deltaTone === 'danger' ? AT.danger : AT.inkSoft;
  return (
    <APanel pad={0} style={{ overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClick} style={{ padding: '15px 16px 12px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <AIcon name={icon} size={14} color={AT.inkSoft} />}
          <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 26, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          {delta != null && <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, color: toneCol }}>{delta}</span>}
          {sub && <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{sub}</span>}
        </div>
      </div>
      {spark && <div style={{ padding: '0 0 0' }}><ASparkline data={spark} color={sparkColor} height={32} /></div>}
    </APanel>
  );
}

// ── Ranked horizontal bars (optional inner margin segment) ───
// data: [{ label, value, value2?, sub?, color?, onClick? }]. value2 ≤ value draws a darker inner bar.
function ABars({ data = [], money: asMoney, pct, max, height = 9, accent = AT.accent }) {
  const m = max || Math.max(1, ...data.map(d => d.value));
  const fmt = (v) => asMoney ? money(v) : pct ? v.toFixed(1) + '%' : v.toLocaleString();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {data.map((d, i) => (
        <div key={i} onClick={d.onClick} style={{ cursor: d.onClick ? 'pointer' : 'default' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, gap: 10 }}>
            <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.ink, textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</span>
            <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{d.sub != null ? d.sub : fmt(d.value)}</span>
          </div>
          <div style={{ position: 'relative', height, borderRadius: 4, background: AT.surfaceAlt, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, width: (d.value / m * 100) + '%', borderRadius: 4, background: d.color || accent, opacity: d.value2 != null ? 0.32 : 1 }} />
            {d.value2 != null && <div style={{ position: 'absolute', insetBlock: 0, left: 0, width: (d.value2 / m * 100) + '%', borderRadius: 4, background: d.color || accent }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Day × hour heatmap ───────────────────────────────────────
function AHeatmap({ rows = [], hours = [], max = 1, accent = AT.accent }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 560 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `34px repeat(${hours.length}, 1fr)`, gap: 3, alignItems: 'center' }}>
          <div />
          {hours.map(h => <div key={h} style={{ fontFamily: AT.mono, fontSize: 8.5, color: AT.inkSoft, textAlign: 'center' }}>{h % 3 === 0 ? String(h).padStart(2, '0') : ''}</div>)}
          {rows.map(r => (
            <React.Fragment key={r.label}>
              <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 600, color: AT.inkSoft }}>{r.label}</div>
              {r.cells.map((c, i) => {
                const t = c / max;
                return <div key={i} title={`${r.label} ${String(hours[i]).padStart(2, '0')}:00 · ${c} orders`}
                  style={{ height: 17, borderRadius: 3, background: t === 0 ? AT.surfaceAlt : `rgba(45,75,255,${(0.12 + t * 0.85).toFixed(3)})` }} />;
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>Fewer</span>
          {[0.12, 0.35, 0.55, 0.75, 0.97].map((o, i) => <span key={i} style={{ width: 18, height: 10, borderRadius: 2, background: `rgba(45,75,255,${o})` }} />)}
          <span style={{ fontFamily: AT.body, fontSize: 11, color: AT.inkSoft }}>More orders</span>
        </div>
      </div>
    </div>
  );
}

// ── Cohort retention grid ────────────────────────────────────
function ACohortGrid({ cohorts = [], months = 6 }) {
  const head = Array.from({ length: months }, (_, i) => 'M' + i);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 4, minWidth: 560 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', padding: '0 8px' }}>Cohort</th>
            <th style={{ textAlign: 'right', fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', padding: '0 8px' }}>Size</th>
            {head.map(h => <th key={h} style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft, padding: '0 4px', minWidth: 52 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {cohorts.map(c => (
            <tr key={c.cohort}>
              <td style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.ink, whiteSpace: 'nowrap', padding: '0 8px' }}>{c.cohort}</td>
              <td style={{ fontFamily: AT.mono, fontSize: 12, color: AT.inkSoft, textAlign: 'right', padding: '0 8px' }}>{c.size}</td>
              {head.map((h, i) => {
                const v = c.ret[i];
                if (v == null) return <td key={h} style={{ background: 'transparent' }} />;
                const t = i === 0 ? 0.14 : Math.min(0.92, v / 45);
                const dark = t > 0.5;
                return <td key={h} style={{ textAlign: 'center', borderRadius: 6, padding: '9px 4px', fontFamily: AT.mono, fontSize: 12, fontWeight: 700, color: dark ? '#fff' : AT.ink, background: `rgba(31,138,76,${(0.10 + t * 0.85).toFixed(3)})` }}>{v}%</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Insight callout card ─────────────────────────────────────
// tone: accent | ok | warn | danger | neutral
function AInsight({ tone = 'accent', icon = 'bolt', title, body, metric, onClick, cta }) {
  const map = {
    accent: { bg: AT.accentSoft, fg: AT.accent, bd: 'rgba(45,75,255,0.20)' },
    ok: { bg: '#E7F4EC', fg: AT.ok, bd: '#BBE3C9' },
    warn: { bg: '#FBEFE3', fg: AT.warn, bd: '#F0D2B4' },
    danger: { bg: '#FBE7E7', fg: AT.danger, bd: '#F1C4C5' },
    neutral: { bg: AT.surfaceAlt, fg: AT.inkSoft, bd: AT.rule },
  };
  const c = map[tone] || map.accent;
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: 13, padding: '15px 16px', borderRadius: AT.radius, background: c.bg, border: `1px solid ${c.bd}`, cursor: onClick ? 'pointer' : 'default', alignItems: 'flex-start' }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: AT.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${c.bd}` }}><AIcon name={icon} size={17} color={c.fg} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 14.5, color: AT.ink }}>{title}</span>
          {metric && <span style={{ fontFamily: AT.mono, fontSize: 12.5, fontWeight: 700, color: c.fg }}>{metric}</span>}
        </div>
        <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, lineHeight: 1.5 }}>{body}</div>
        {cta && <div style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, color: c.fg, marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{cta} <AIcon name="arrow" size={13} color={c.fg} /></div>}
      </div>
    </div>
  );
}

// ── Section block header (title + optional note/right slot) ──
function ABlock({ title, note, right, children, pad = 20 }) {
  return (
    <APanel pad={pad}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink }}>{title}</div>
        {right}
      </div>
      {note && <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginBottom: 16, lineHeight: 1.5 }}>{note}</div>}
      {!note && <div style={{ height: 14 }} />}
      {children}
    </APanel>
  );
}

// ── Sortable-table hook + header cell ────────────────────────
function useSort(initialKey, initialDir = 'desc') {
  const [key, setKey] = React.useState(initialKey);
  const [dir, setDir] = React.useState(initialDir);
  const onSort = (k) => { if (k === key) setDir(d => d === 'asc' ? 'desc' : 'asc'); else { setKey(k); setDir('desc'); } };
  const sort = (rows) => [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    const cmp = (typeof av === 'string') ? String(av).localeCompare(String(bv)) : (av - bv);
    return dir === 'asc' ? cmp : -cmp;
  });
  return { key, dir, onSort, sort };
}
function ASortTh({ label, k, sorter, align = 'left' }) {
  const active = sorter.key === k;
  return (
    <th onClick={() => sorter.onSort(k)} style={{ cursor: 'pointer', userSelect: 'none', textAlign: align, padding: '11px 16px', fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: active ? AT.ink : AT.inkSoft, background: AT.surfaceAlt, borderBottom: `1px solid ${AT.rule}`, whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
        {label}<span style={{ fontFamily: AT.mono, fontSize: 9, opacity: active ? 1 : 0.3 }}>{active ? (sorter.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
      </span>
    </th>
  );
}

// ── Editable target input (€ prefix) ─────────────────────────
function ATargetInput({ label = 'Monthly target', value, onChange, sub, prefix = '€' }) {
  const [v, setV] = React.useState(String(value || ''));
  React.useEffect(() => { setV(String(value || '')); }, [value]);
  const commit = (raw) => { const n = Math.max(0, Math.round(Number(raw) || 0)); onChange(n); setV(String(n)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 40, padding: '0 12px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, width: 180 }}>
        <span style={{ fontFamily: AT.mono, fontSize: 15, color: AT.inkSoft }}>{prefix}</span>
        <input value={v} onChange={e => setV(e.target.value.replace(/[^0-9.]/g, ''))} onBlur={e => commit(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.target.blur(); } }}
          inputMode="numeric" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink }} />
      </div>
      {sub && <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{sub}</span>}
    </div>
  );
}

// ── Detailed prioritised action list ("what to consider & plan") ─
// items: [{ priority:'high'|'med'|'low', icon, title, detail, metric?, cta?, onClick? }]
const APLAN_PRI = { high: { label: 'Do now', bg: '#FBE7E7', fg: AT.danger }, med: { label: 'This week', bg: '#FBEFE3', fg: AT.warn }, low: { label: 'Watch', bg: AT.surfaceAlt, fg: AT.inkSoft } };
function APlanList({ items = [] }) {
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => {
        const p = APLAN_PRI[it.priority] || APLAN_PRI.low;
        return (
          <div key={i} onClick={it.onClick} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '14px 2px', borderTop: i === 0 ? 'none' : `1px solid ${AT.ruleSoft}`, cursor: it.onClick ? 'pointer' : 'default' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={it.icon || 'bolt'} size={16} color={AT.ink} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontFamily: AT.body, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: p.fg, background: p.bg, padding: '2px 7px', borderRadius: 5 }}>{p.label}</span>
                <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 14, color: AT.ink }}>{it.title}</span>
                {it.metric && <span style={{ fontFamily: AT.mono, fontSize: 12, fontWeight: 700, color: AT.accent }}>{it.metric}</span>}
              </div>
              <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, lineHeight: 1.5 }}>{it.detail}</div>
              {it.cta && <div style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, color: AT.accent, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{it.cta} <AIcon name="arrow" size={13} color={AT.accent} /></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { ASparkline, AKpiTile, ABars, AHeatmap, ACohortGrid, AInsight, ABlock, useSort, ASortTh, ATargetInput, APlanList });


// ===== admin-reports-tabs.jsx =====
// admin-reports-tabs.jsx — Reports hub tab bodies (part 1):
// Overview, Sales & traffic, Products & margin. Presentational — all heavy
// derivation arrives pre-computed on the `vm` view-model from the hub shell.

// ── helpers shared by the tabs (read from vm where possible) ──
function _miniTable(columns, rows) {
  return (
    <ATable columns={columns}>{rows}</ATable>
  );
}

// ════════════════════════════════════════════════════════════
// OVERVIEW
// ════════════════════════════════════════════════════════════
function RepOverview({ vm }) {
  const { head, kpis, series, products, byCat, channels, forecast, inventory, compare, nav, fmtPct, tone } = vm;
  const top = products.slice(0, 5);
  const lowCover = inventory.filter(p => p.signal === 'low' || p.signal === 'out')[0];
  const bestMargin = [...products].sort((a, b) => b.margin - a.margin)[0];
  const thinMargin = [...products].filter(p => p.units > 0).sort((a, b) => a.marginPct - b.marginPct)[0];
  const catShare = byCat.slice(0, 5).map((c, i) => ({ label: c.label, value: Math.round(c.revenue), color: ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C'][i % 5] }));
  const channelShare = channels.filter(c => c.revenue).slice(0, 5).map(c => ({ label: c.label, value: Math.round(c.revenue / channels.reduce((s, x) => s + x.revenue, 0) * 100), color: c.color }));
  const revDelta = head.prevRevenue ? (head.revenue / head.prevRevenue - 1) * 100 : 0;

  // Auto-generated “what to plan” priorities from this period's data.
  const dead = inventory.filter(p => p.signal === 'slow' || p.signal === 'dead');
  const bestCh = [...channels].filter(c => c.roas).sort((a, b) => b.roas - a.roas)[0];
  const worstCh = [...channels].filter(c => c.roas).sort((a, b) => a.roas - b.roas)[0];
  const plan = [];
  if (lowCover) plan.push({ priority: 'high', icon: 'inventory', title: 'Reorder ' + lowCover.name, metric: isFinite(lowCover.cover) ? Math.round(lowCover.cover) + 'd cover' : 'out of stock', detail: 'Selling ' + lowCover.velocity.toFixed(1) + '/day with ' + lowCover.onHand + ' left — order ~' + Math.max(1, Math.ceil(lowCover.velocity * 30 - lowCover.onHand)) + ' units to hold 30 days of cover.', onClick: () => nav('inventory'), cta: 'Open inventory' });
  if (forecast.targetPct < 100) plan.push({ priority: 'high', icon: 'finance', title: 'Revenue pacing below target', metric: money(forecast.gap) + ' short', detail: 'Projected ' + money(forecast.projected) + ' vs the ' + money(forecast.target) + ' target — needs ' + money(forecast.requiredDaily) + '/day across the remaining ' + forecast.remainingDays + ' days.', onClick: () => vm.goTab('forecast'), cta: 'Open forecast' });
  if (thinMargin && thinMargin.marginPct < 40) plan.push({ priority: 'med', icon: 'refund', title: 'Fix margin on ' + thinMargin.name, metric: thinMargin.marginPct.toFixed(0) + '% margin', detail: 'Returns only ' + money(thinMargin.marginUnit) + ' per unit. Renegotiate supplier cost, raise the price, or bundle it with a high-margin item.', onClick: () => vm.goTab('products'), cta: 'Open products' });
  if (worstCh && bestCh && worstCh !== bestCh) plan.push({ priority: 'med', icon: 'megaphone', title: 'Reallocate ad budget', metric: worstCh.roas.toFixed(1) + '× → ' + bestCh.roas.toFixed(1) + '×', detail: 'Shift spend from ' + worstCh.label + ' (' + worstCh.roas.toFixed(1) + '× ROAS) toward ' + bestCh.label + ' (' + bestCh.roas.toFixed(1) + '×) to lift blended return.', onClick: () => vm.goTab('marketing'), cta: 'Open marketing ROI' });
  if (kpis.refundRate > 4) plan.push({ priority: 'med', icon: 'refund', title: 'Refund rate is elevated', metric: kpis.refundRate.toFixed(1) + '%', detail: 'Above the 4% comfort line (' + money(kpis.refundAmt) + '). Review which products and reasons drive returns.' });
  if (dead.length) plan.push({ priority: 'low', icon: 'catalog', title: 'Clear slow movers', metric: dead.length + ' SKUs', detail: dead.map(d => d.name).slice(0, 3).join(', ') + (dead.length > 3 ? ' + more' : '') + ' tie up cash. Consider a clearance promo or delisting.', onClick: () => nav('catalog'), cta: 'Open catalog' });
  if (kpis.repeatRate < 25) plan.push({ priority: 'low', icon: 'users', title: 'Grow repeat purchases', metric: kpis.repeatRate.toFixed(0) + '% repeat', detail: 'Repeat rate is low — turn on the post-delivery review and win-back flows to lift LTV.', onClick: () => vm.goTab('marketing'), cta: 'Open marketing' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <AInsight tone={revDelta >= 0 ? 'ok' : 'danger'} icon="analytics"
          title={revDelta >= 0 ? 'Revenue is growing' : 'Revenue is slipping'} metric={fmtPct(revDelta)}
          body={`${money(head.revenue)} this period vs ${money(head.prevRevenue)} prior. ${revDelta >= 0 ? 'Momentum carried by weekend evenings.' : 'Weekday demand softened — check paid channels.'}`} />
        <AInsight tone="accent" icon="bolt"
          title="Margin leader" metric={bestMargin ? money(bestMargin.margin) : '—'}
          body={bestMargin ? `${bestMargin.name} contributes the most gross profit (${bestMargin.marginPct.toFixed(0)}% margin). Protect its stock and placement.` : 'No sales yet this period.'}
          cta="See products" onClick={() => vm.goTab('products')} />
        {lowCover
          ? <AInsight tone="warn" icon="inventory" title="Restock soon" metric={isFinite(lowCover.cover) ? Math.round(lowCover.cover) + 'd cover' : 'Out'}
              body={`${lowCover.name} has ${lowCover.onHand} units left — about ${isFinite(lowCover.cover) ? Math.round(lowCover.cover) : 0} days at the current rate.`}
              cta="Open inventory" onClick={() => nav('inventory')} />
          : <AInsight tone="ok" icon="check" title="Stock is healthy" body="No SKU is below its 10-day cover threshold this period." />}
        <AInsight tone={forecast.pace >= 0 ? 'accent' : 'warn'} icon="finance"
          title="Month-end run-rate" metric={money(forecast.projected)}
          body={`On pace for ${money(forecast.projected)} (${forecast.targetPct.toFixed(0)}% of the ${money(forecast.target)} target), ${forecast.pace >= 0 ? '+' : ''}${forecast.pace.toFixed(0)}% vs last month.`}
          cta="See forecast" onClick={() => vm.goTab('forecast')} />
      </div>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Revenue" value={money(head.revenue)} delta={fmtPct(revDelta)} deltaTone={tone(revDelta)} sub="vs prev period" icon="finance" spark={series.current} onClick={() => vm.goTab('sales')} />
        <AKpiTile label="Orders" value={head.orders.toLocaleString()} delta={fmtPct(((head.orders / (head.prevOrders || 1)) - 1) * 100)} deltaTone={tone(head.orders - head.prevOrders)} sub="paid" icon="orders" spark={series.current.map((v, i) => Math.round(v / head.aov))} />
        <AKpiTile label="Avg order value" value={money(head.aov)} delta="▲ 4.1%" deltaTone="ok" sub="per order" icon="bolt" />
        <AKpiTile label="Gross margin" value={kpis.grossMarginPct.toFixed(1) + '%'} delta={money(kpis.grossProfit) + ' profit'} deltaTone="ok" sub="ex-VAT basis" icon="analytics" />
        <AKpiTile label="Contribution" value={kpis.contributionPct.toFixed(1) + '%'} delta={money(head.revenue * kpis.contributionPct / 100)} deltaTone="ok" sub="after fees & fulfil" icon="finance" />
        <AKpiTile label="Refund rate" value={kpis.refundRate.toFixed(1) + '%'} delta={money(kpis.refundAmt)} deltaTone={kpis.refundRate > 4 ? 'warn' : 'ok'} sub={kpis.refundCount + ' refunds'} icon="refund" />
        <AKpiTile label="Repeat rate" value={kpis.repeatRate.toFixed(0) + '%'} delta={kpis.repeatCust + ' repeat'} deltaTone="ok" sub="of customers" icon="users" onClick={() => vm.goTab('customers')} />
        <AKpiTile label="Avg LTV" value={money(kpis.ltv)} delta="▲ 6.8%" deltaTone="ok" sub="lifetime / customer" icon="users" />
      </div>

      {/* Plan & priorities */}
      <ABlock title="Plan & priorities" note="Auto-generated from this period's data — highest-impact actions first.">
        <APlanList items={plan} />
      </ABlock>

      {/* Revenue trend */}
      <ABlock title="Revenue trend" note={compare ? 'Solid = this period · dashed = previous period (same length).' : 'Daily net revenue across the selected period.'}>
        <ALineChart height={230} labels={series.labels}
          series={compare
            ? [{ data: series.prev, color: '#9A9A96', faded: true, dashed: true }, { data: series.current, color: AT.accent }]
            : [{ data: series.current, color: AT.accent }]} />
      </ABlock>

      {/* category + channel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 22, alignItems: 'flex-start' }}>
        <ABlock title="Revenue & margin by category" note="Bar = revenue · solid fill = gross margin retained.">
          <ABars money data={byCat.slice(0, 6).map((c, i) => ({ label: c.label, value: Math.round(c.revenue), value2: Math.round(c.margin), color: ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C', '#0A0A0A'][i % 6], sub: money(c.revenue) + ' · ' + c.marginPct.toFixed(0) + '%' }))} />
        </ABlock>
        <ABlock title="Where orders come from" note="Share of attributed revenue by acquisition channel.">
          <ADonut size={150} data={channelShare} centerLabel={channels.reduce((s, c) => s + c.orders, 0).toLocaleString()} centerSub="orders" />
        </ABlock>
      </div>

      {/* top products */}
      <div>
        <ASectionTitle right={<ABtn kind="soft" size="sm" onClick={() => vm.goTab('products')}>All products <AIcon name="arrow" size={14} /></ABtn>}>Top products by revenue</ASectionTitle>
        <ATable columns={[{ label: '#' }, { label: 'Product' }, { label: 'Brand' }, { label: 'Units', align: 'center' }, { label: 'Revenue', align: 'right' }, { label: 'Margin', align: 'right' }, { label: 'Margin %', align: 'right' }]}>
          {top.map((p, i) => (
            <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => nav('catalog')}>
              <ATd mono>{i + 1}</ATd>
              <ATd strong>{p.name}</ATd>
              <ATd>{p.brand}</ATd>
              <ATd mono align="center">{p.units}</ATd>
              <ATd mono strong align="right">{money(p.revenue)}</ATd>
              <ATd mono align="right">{money(p.margin)}</ATd>
              <ATd mono align="right" style={{ color: p.marginPct >= 50 ? AT.ok : p.marginPct < 35 ? AT.warn : AT.ink }}>{p.marginPct.toFixed(0)}%</ATd>
            </tr>
          ))}
        </ATable>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SALES & TRAFFIC
// ════════════════════════════════════════════════════════════
function RepSales({ vm }) {
  const { head, series, channels, promos, compare, nav, fmtPct, tone } = vm;
  const funnel = window.CONVERSION_FUNNEL || [];
  const fmax = funnel[0] ? funnel[0].value : 1;
  const city = window.SALES_BY_CITY || [];
  const revDelta = head.prevRevenue ? (head.revenue / head.prevRevenue - 1) * 100 : 0;
  const chMax = Math.max(...channels.map(c => c.revenue));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Revenue" value={money(head.revenue)} delta={fmtPct(revDelta)} deltaTone={tone(revDelta)} sub="vs prev" icon="finance" spark={series.current} />
        <AKpiTile label="Orders" value={head.orders.toLocaleString()} delta={fmtPct(((head.orders / (head.prevOrders || 1)) - 1) * 100)} deltaTone={tone(head.orders - head.prevOrders)} icon="orders" />
        <AKpiTile label="Avg order value" value={money(head.aov)} delta="▲ 4.1%" deltaTone="ok" icon="bolt" />
        <AKpiTile label="Conversion rate" value="5.1%" delta="▲ 0.4pp" deltaTone="ok" sub="visit → order" icon="analytics" />
      </div>

      <ABlock title="Revenue trend" note={compare ? 'Solid = this period · dashed = previous period.' : 'Net revenue per day.'}>
        <ALineChart height={240} labels={series.labels}
          series={compare ? [{ data: series.prev, color: '#9A9A96', faded: true, dashed: true }, { data: series.current, color: AT.accent }] : [{ data: series.current, color: AT.accent }]} />
      </ABlock>

      <ABlock title="When customers buy" note="Orders by weekday and hour — discreet evening shopping peaks Fri–Sun after 20:00.">
        <AHeatmap rows={window.REP_HEATMAP.rows} hours={window.REP_HEATMAP.hours} max={window.REP_HEATMAP.max} />
      </ABlock>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, alignItems: 'flex-start' }}>
        <ABlock title="Acquisition channels" note="Revenue, with return on ad spend where paid.">
          <ABars money max={chMax} data={channels.map(c => ({ label: c.label, value: Math.round(c.revenue), color: c.color, sub: money(c.revenue) + (c.roas ? ' · ' + c.roas.toFixed(1) + '× ROAS' : ' · organic') }))} />
        </ABlock>
        <ABlock title="Sales by city" note="Share of orders by delivery city.">
          <ABars pct data={city.map(c => ({ label: c.city, value: c.value, sub: c.value + '%' }))} max={Math.max(...city.map(c => c.value))} />
        </ABlock>
      </div>

      <ABlock title="Conversion funnel" note="Visitors progressing to a completed order this period.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {funnel.map((f, i) => {
            const next = funnel[i + 1];
            const drop = next ? (1 - next.value / f.value) * 100 : null;
            return (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 110, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>{f.label}</span>
                <div style={{ flex: 1, height: 26, borderRadius: 6, background: AT.surfaceAlt, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (f.value / fmax * 100) + '%', background: AT.accent, opacity: 1 - i * 0.13, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                    <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: '#fff', fontWeight: 700 }}>{f.value.toLocaleString()}</span>
                  </div>
                </div>
                <span style={{ width: 92, textAlign: 'right', fontFamily: AT.mono, fontSize: 11, color: drop != null && drop > 55 ? AT.warn : AT.inkSoft }}>{i === 0 ? '100%' : (f.value / fmax * 100).toFixed(1) + '%'}{drop != null ? '  −' + drop.toFixed(0) + '%' : ''}</span>
              </div>
            );
          })}
        </div>
      </ABlock>

      <div>
        <ASectionTitle>Discount & promo performance</ASectionTitle>
        <ATable columns={[{ label: 'Code' }, { label: 'Depth' }, { label: 'Uses', align: 'right' }, { label: 'Revenue', align: 'right' }, { label: 'Discount given', align: 'right' }, { label: 'Margin after', align: 'right' }, { label: 'New cust.', align: 'right' }, { label: 'ROI', align: 'right' }]}>
          {promos.map(p => {
            const roi = p.discount ? p.marginAfter / p.discount : 0;
            return (
              <tr key={p.code}>
                <ATd mono strong>{p.code}</ATd>
                <ATd><ABadge tone="neutral">{p.type}</ABadge></ATd>
                <ATd mono align="right">{p.uses}</ATd>
                <ATd mono align="right">{money(p.revenue)}</ATd>
                <ATd mono align="right" style={{ color: AT.warn }}>−{money(p.discount)}</ATd>
                <ATd mono strong align="right">{money(p.marginAfter)}</ATd>
                <ATd mono align="right">{p.newCust}</ATd>
                <ATd mono align="right" style={{ color: roi >= 3 ? AT.ok : roi < 1.5 ? AT.warn : AT.ink }}>{roi.toFixed(1)}×</ATd>
              </tr>
            );
          })}
        </ATable>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PRODUCTS & MARGIN
// ════════════════════════════════════════════════════════════
function RepProducts({ vm }) {
  const { products, byCat, byBrand, kpis, nav } = vm;
  const sorter = useSort('revenue', 'desc');
  const rows = sorter.sort(products);
  const best = [...products].sort((a, b) => b.margin - a.margin)[0];
  const thin = [...products].filter(p => p.units).sort((a, b) => a.marginPct - b.marginPct)[0];
  const totalProfit = products.reduce((s, p) => s + p.margin, 0);
  const avgMargin = products.length ? products.reduce((s, p) => s + p.marginPct, 0) / products.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="SKUs sold" value={products.length} sub="this period" icon="catalog" />
        <AKpiTile label="Gross profit" value={money(totalProfit)} delta={kpis.grossMarginPct.toFixed(1) + '% margin'} deltaTone="ok" icon="finance" />
        <AKpiTile label="Avg margin" value={avgMargin.toFixed(0) + '%'} sub="across SKUs" icon="analytics" />
        <AKpiTile label="Best contributor" value={best ? best.name.split(' ').slice(0, 2).join(' ') : '—'} delta={best ? money(best.margin) : ''} deltaTone="ok" sub="gross profit" icon="bolt" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {best && <AInsight tone="ok" icon="bolt" title="Push this product" metric={best.marginPct.toFixed(0) + '% margin'} body={`${best.name} earns ${money(best.marginUnit)} per unit. Feature it and keep it in stock.`} cta="Open catalog" onClick={() => nav('catalog')} />}
        {thin && <AInsight tone="warn" icon="refund" title="Review pricing or cost" metric={thin.marginPct.toFixed(0) + '% margin'} body={`${thin.name} returns only ${money(thin.marginUnit)} per unit. Renegotiate cost, raise price, or bundle it.`} cta="Open catalog" onClick={() => nav('catalog')} />}
      </div>

      <div>
        <ASectionTitle right={<ABtn kind="ghost" size="sm" onClick={() => vm.exportCsv('products')}><AIcon name="download" size={14} /> Export</ABtn>}>Product economics</ASectionTitle>
        <APanel style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AT.body }}>
              <thead><tr>
                <ASortTh label="Product" k="name" sorter={sorter} />
                <ASortTh label="Brand" k="brand" sorter={sorter} />
                <ASortTh label="Units" k="units" sorter={sorter} align="right" />
                <ASortTh label="Revenue" k="revenue" sorter={sorter} align="right" />
                <ASortTh label="COGS" k="cogs" sorter={sorter} align="right" />
                <ASortTh label="Margin €" k="margin" sorter={sorter} align="right" />
                <ASortTh label="Margin %" k="marginPct" sorter={sorter} align="right" />
              </tr></thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => nav('catalog')}>
                    <ATd strong>{p.name}</ATd>
                    <ATd>{p.brand}</ATd>
                    <ATd mono align="right">{p.units}</ATd>
                    <ATd mono strong align="right">{money(p.revenue)}</ATd>
                    <ATd mono align="right" style={{ color: AT.inkSoft }}>{money(p.cogs)}</ATd>
                    <ATd mono align="right">{money(p.margin)}</ATd>
                    <ATd mono align="right" style={{ color: p.marginPct >= 50 ? AT.ok : p.marginPct < 35 ? AT.warn : AT.ink }}>{p.marginPct.toFixed(0)}%</ATd>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </APanel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'flex-start' }}>
        <ABlock title="Margin by category" note="Bar = revenue · solid = gross margin.">
          <ABars money data={byCat.map((c, i) => ({ label: c.label, value: Math.round(c.revenue), value2: Math.round(c.margin), color: ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C', '#0A0A0A'][i % 6], sub: c.marginPct.toFixed(0) + '% · ' + money(c.margin) }))} />
        </ABlock>
        <ABlock title="Margin by brand" note="Which suppliers actually make you money.">
          <ABars money data={byBrand.map((b, i) => ({ label: b.label, value: Math.round(b.revenue), value2: Math.round(b.margin), color: ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C'][i % 5], sub: b.marginPct.toFixed(0) + '% · ' + money(b.margin) }))} />
        </ABlock>
      </div>
    </div>
  );
}

Object.assign(window, { RepOverview, RepSales, RepProducts });


// ===== admin-reports-tabs-2.jsx =====
// admin-reports-tabs-2.jsx — Reports hub tab bodies (part 2):
// Customers & retention, Marketing & channel ROI, Inventory & demand,
// Geography / markets, Forecast.

// ════════════════════════════════════════════════════════════
// CUSTOMERS & RETENTION
// ════════════════════════════════════════════════════════════
function RepCustomers({ vm }) {
  const { ctx, kpis, newReturning, nav } = vm;
  const customers = (ctx.customers || []).slice().sort((a, b) => (b.ltv || 0) - (a.ltv || 0));
  const nr = newReturning;
  const seg = [
    { label: 'Returning', value: nr.returning, color: AT.accent },
    { label: 'First-time', value: nr.fresh, color: '#9A6BFF' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Customers" value={kpis.customers} sub="in scope" icon="users" />
        <AKpiTile label="Repeat rate" value={kpis.repeatRate.toFixed(0) + '%'} delta={kpis.repeatCust + ' repeat buyers'} deltaTone="ok" icon="users" />
        <AKpiTile label="Avg LTV" value={money(kpis.ltv)} delta="▲ 6.8%" deltaTone="ok" sub="lifetime value" icon="finance" />
        <AKpiTile label="Returning share" value={(nr.total ? (nr.returning / nr.total * 100) : 0).toFixed(0) + '%'} sub="of order base" icon="orders" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <AInsight tone="ok" icon="users" title="Retention is climbing" metric="M1 41%" body="Each newer cohort returns at a higher rate than the last — May buyers retain 41% by month 1, up from 31% in January." cta="See cohorts below" />
        <AInsight tone="accent" icon="bolt" title="Repeat buyers are worth more" body={`Repeat customers average ${money(kpis.ltv * 1.9)} lifetime — protect them with the win-back automation.`} cta="Open marketing" onClick={() => vm.goTab('marketing')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 22, alignItems: 'flex-start' }}>
        <ABlock title="New vs returning" note="By customers who have ordered in scope.">
          <ADonut size={150} data={seg.map(s => ({ ...s, value: nr.total ? Math.round(s.value / nr.total * 100) : 0 }))} centerLabel={nr.total} centerSub="customers" />
        </ABlock>
        <ABlock title="Monthly cohort retention" note="% of each acquisition cohort that ordered again, by months since first purchase.">
          <ACohortGrid cohorts={window.REP_COHORTS} months={6} />
        </ABlock>
      </div>

      <div>
        <ASectionTitle right={<ABtn kind="soft" size="sm" onClick={() => nav('customers')}>All customers <AIcon name="arrow" size={14} /></ABtn>}>Top customers by lifetime value</ASectionTitle>
        <ATable columns={[{ label: '#' }, { label: 'Customer' }, { label: 'City' }, { label: 'Orders', align: 'center' }, { label: 'LTV', align: 'right' }, { label: 'Last order', align: 'right' }, { label: 'Tags' }]}>
          {customers.slice(0, 10).map((c, i) => (
            <tr key={c.email || i} style={{ cursor: 'pointer' }} onClick={() => nav('customers')}>
              <ATd mono>{i + 1}</ATd>
              <ATd strong>{c.name}</ATd>
              <ATd>{c.city}</ATd>
              <ATd mono align="center">{c.orderCount}</ATd>
              <ATd mono strong align="right">{money(c.ltv)}</ATd>
              <ATd mono align="right">{(c.lastOrder || '').slice(5, 10)}</ATd>
              <ATd>{(c.tags || []).slice(0, 2).map(t => <span key={t} style={{ marginRight: 4 }}><ABadge tone={t === 'vip' ? 'blue' : 'neutral'}>{t}</ABadge></span>)}</ATd>
            </tr>
          ))}
        </ATable>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MARKETING & CHANNEL ROI
// ════════════════════════════════════════════════════════════
function RepMarketing({ vm }) {
  const { channels, nav } = vm;
  const paidCh = channels.filter(c => c.spend > 0);
  const spend = channels.reduce((s, c) => s + c.spend, 0);
  const paidRev = paidCh.reduce((s, c) => s + c.revenue, 0);
  const paidNew = paidCh.reduce((s, c) => s + c.newCust, 0);
  const blendedRoas = spend ? paidRev / spend : 0;
  const blendedCac = paidNew ? spend / paidNew : 0;
  const autos = window.SEED_AUTOMATIONS || [];
  const campaigns = window.SEED_CAMPAIGNS || [];
  const autoMax = Math.max(1, ...autos.map(a => a.sales));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Marketing spend" value={money(spend)} sub="this period" icon="megaphone" />
        <AKpiTile label="Attributed revenue" value={money(paidRev)} delta="from paid channels" deltaTone="ok" icon="finance" />
        <AKpiTile label="Blended ROAS" value={blendedRoas.toFixed(1) + '×'} delta={blendedRoas >= 3 ? 'healthy' : 'watch'} deltaTone={blendedRoas >= 3 ? 'ok' : 'warn'} sub="revenue / spend" icon="analytics" />
        <AKpiTile label="Blended CAC" value={money(blendedCac)} sub="per new customer" icon="users" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <AInsight tone="ok" icon="bolt" title="Email punches above its weight" metric={(channels.find(c => c.label.includes('Email'))?.revenue / 240).toFixed(0) + '× ROAS'} body="Email/CRM drives strong revenue on almost no spend — expand the automation set before buying more paid traffic." />
        <AInsight tone="warn" icon="megaphone" title="Paid social is the weakest channel" metric={(channels.find(c => c.label.includes('social'))?.roas || 0).toFixed(1) + '× ROAS'} body="It returns the least per euro. Cap budget or refresh creative before scaling." />
      </div>

      <div>
        <ASectionTitle right={<ABtn kind="ghost" size="sm" onClick={() => vm.exportCsv('channels')}><AIcon name="download" size={14} /> Export</ABtn>}>Channel ROI</ASectionTitle>
        <ATable columns={[{ label: 'Channel' }, { label: 'Spend', align: 'right' }, { label: 'Orders', align: 'right' }, { label: 'Revenue', align: 'right' }, { label: 'AOV', align: 'right' }, { label: 'New cust.', align: 'right' }, { label: 'CAC', align: 'right' }, { label: 'ROAS', align: 'right' }]}>
          {channels.map(c => (
            <tr key={c.label}>
              <ATd strong>{c.label}</ATd>
              <ATd mono align="right">{c.spend ? money(c.spend) : '—'}</ATd>
              <ATd mono align="right">{c.orders}</ATd>
              <ATd mono strong align="right">{money(c.revenue)}</ATd>
              <ATd mono align="right">{money(c.aov)}</ATd>
              <ATd mono align="right">{c.newCust}</ATd>
              <ATd mono align="right">{c.cac ? money(c.cac) : '—'}</ATd>
              <ATd mono align="right" style={{ color: c.roas == null ? AT.inkSoft : c.roas >= 3 ? AT.ok : c.roas < 2 ? AT.warn : AT.ink }}>{c.roas ? c.roas.toFixed(1) + '×' : 'organic'}</ATd>
            </tr>
          ))}
        </ATable>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'flex-start' }}>
        <ABlock title="Automation attribution" note="Sales credited to always-on flows.">
          <ABars money max={autoMax} data={autos.map(a => ({ label: a.name, value: a.sales, color: a.on ? AT.accent : AT.inkSoft, sub: money(a.sales) + (a.on ? '' : ' · off') }))} />
        </ABlock>
        <ABlock title="Campaign performance" note="One-off sends and their results." pad={0}>
          <div style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AT.body }}>
              <thead><tr>{['Campaign', 'Open', 'Click', 'Sales'].map((h, i) => <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '10px 16px', fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, background: AT.surfaceAlt, borderBottom: `1px solid ${AT.rule}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <ATd strong>{c.name} <ABadge tone={c.status === 'active' ? 'ok' : c.status === 'scheduled' ? 'blue' : 'neutral'}>{c.status}</ABadge></ATd>
                    <ATd mono align="right">{c.open ? c.open + '%' : '—'}</ATd>
                    <ATd mono align="right">{c.click ? c.click + '%' : '—'}</ATd>
                    <ATd mono strong align="right">{c.sales ? money(c.sales) : '—'}</ATd>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ABlock>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// INVENTORY & DEMAND
// ════════════════════════════════════════════════════════════
const REP_SIGNAL = {
  out: { tone: 'danger', label: 'Out of stock' },
  low: { tone: 'warn', label: 'Reorder now' },
  ok: { tone: 'ok', label: 'Healthy' },
  slow: { tone: 'neutral', label: 'Overstocked' },
  dead: { tone: 'neutral', label: 'No sales' },
};
function RepInventory({ vm }) {
  const { inventory, nav } = vm;
  const sorter = useSort('cover', 'asc');
  const rows = sorter.sort(inventory.map(p => ({ ...p, coverSort: isFinite(p.cover) ? p.cover : 9999 })));
  const onHand = inventory.reduce((s, p) => s + p.onHand, 0);
  const atCost = inventory.reduce((s, p) => s + p.onHand * (window.repCost(p.id)), 0);
  const lowOut = inventory.filter(p => p.signal === 'low' || p.signal === 'out');
  const avgSell = inventory.length ? inventory.reduce((s, p) => s + p.sellThrough, 0) / inventory.length : 0;
  const dead = inventory.filter(p => p.signal === 'slow' || p.signal === 'dead');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Units on hand" value={onHand.toLocaleString()} sub={inventory.length + ' SKUs'} icon="inventory" />
        <AKpiTile label="Inventory at cost" value={money(atCost)} sub="tied-up capital" icon="finance" />
        <AKpiTile label="Reorder / out" value={lowOut.length} delta={lowOut.length ? 'needs action' : 'all good'} deltaTone={lowOut.length ? 'warn' : 'ok'} icon="refund" />
        <AKpiTile label="Avg sell-through" value={avgSell.toFixed(0) + '%'} sub="30-day" icon="analytics" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {lowOut.length > 0 && <AInsight tone="warn" icon="inventory" title={`${lowOut.length} ${lowOut.length === 1 ? 'product needs' : 'products need'} reordering`} body={`Lowest cover: ${lowOut[0].name} (${isFinite(lowOut[0].cover) ? Math.round(lowOut[0].cover) + ' days' : 'out now'}). Reorder before you stock out of a seller.`} cta="Open inventory" onClick={() => nav('inventory')} />}
        {dead.length > 0 && <AInsight tone="neutral" icon="catalog" title={`${dead.length} slow ${dead.length === 1 ? 'mover' : 'movers'} tying up cash`} body={`${dead.map(d => d.name).slice(0, 2).join(', ')} ${dead.length > 2 ? '+ more ' : ''}sell slowly. Consider a clearance promo or delisting.`} cta="Open catalog" onClick={() => nav('catalog')} />}
      </div>

      <div>
        <ASectionTitle right={<ABtn kind="ghost" size="sm" onClick={() => vm.exportCsv('inventory')}><AIcon name="download" size={14} /> Export</ABtn>}>Stock health & demand</ASectionTitle>
        <APanel style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AT.body }}>
              <thead><tr>
                <ASortTh label="Product" k="name" sorter={sorter} />
                <ASortTh label="On hand" k="onHand" sorter={sorter} align="right" />
                <ASortTh label="Sold 30d" k="units" sorter={sorter} align="right" />
                <ASortTh label="Velocity/d" k="velocity" sorter={sorter} align="right" />
                <ASortTh label="Days cover" k="coverSort" sorter={sorter} align="right" />
                <ASortTh label="Sell-through" k="sellThrough" sorter={sorter} align="right" />
                <th style={{ textAlign: 'right', padding: '11px 16px', fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, background: AT.surfaceAlt, borderBottom: `1px solid ${AT.rule}` }}>Status</th>
              </tr></thead>
              <tbody>
                {rows.map(p => {
                  const sg = REP_SIGNAL[p.signal] || REP_SIGNAL.ok;
                  return (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => nav('inventory')}>
                      <ATd strong>{p.name}</ATd>
                      <ATd mono align="right" style={{ color: p.onHand === 0 ? AT.danger : p.onHand <= 4 ? AT.warn : AT.ink }}>{p.onHand}</ATd>
                      <ATd mono align="right">{p.units}</ATd>
                      <ATd mono align="right">{p.velocity.toFixed(2)}</ATd>
                      <ATd mono align="right" style={{ color: isFinite(p.cover) && p.cover < 10 ? AT.warn : AT.ink }}>{isFinite(p.cover) ? Math.round(p.cover) + 'd' : '—'}</ATd>
                      <ATd mono align="right">{p.sellThrough.toFixed(0)}%</ATd>
                      <ATd align="right"><ABadge tone={sg.tone}>{sg.label}</ABadge></ATd>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </APanel>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GEOGRAPHY / MARKETS
// ════════════════════════════════════════════════════════════
function RepGeography({ vm }) {
  const { markets, ctx } = vm;
  const total = markets.reduce((s, m) => s + m.revenue, 0) || 1;
  const planned = (window.MARKETS || []).filter(m => m.status === 'planned');
  const best = markets[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Live markets" value={markets.length} sub="LV · LT · EE" icon="brands" />
        <AKpiTile label="Top market" value={best ? best.country : '—'} delta={best ? money(best.revenue) : ''} deltaTone="ok" sub={best ? Math.round(best.revenue / total * 100) + '% of revenue' : ''} icon="finance" />
        <AKpiTile label="Cross-border AOV" value={money(markets.reduce((s, m) => s + m.aov, 0) / (markets.length || 1))} sub="avg across markets" icon="bolt" />
        <AKpiTile label="Planned markets" value={planned.length} delta={planned.map(p => p.country).join(', ')} deltaTone="ok" sub="not live yet" icon="megaphone" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <AInsight tone="accent" icon="analytics" title={best ? `${best.country} leads, but is concentrated` : 'Market mix'} body={best ? `${best.country} is ${Math.round(best.revenue / total * 100)}% of revenue. Growing LT and EE reduces single-market risk.` : ''} />
        {planned.length > 0 && <AInsight tone="ok" icon="megaphone" title="Expansion ready" body={`${planned.map(p => p.country).join(' & ')} are configured (VAT, currency, language) and can go live when you are.`} />}
      </div>

      <ABlock title="Revenue by market" note="Consolidated across the selected business.">
        <ABars money data={markets.map((m, i) => ({ label: m.country, value: Math.round(m.revenue), color: ['#2D4BFF', '#1F8A4C', '#E0A800'][i % 3], sub: money(m.revenue) + ' · ' + Math.round(m.revenue / total * 100) + '%' }))} />
      </ABlock>

      <div>
        <ASectionTitle>Market comparison</ASectionTitle>
        <ATable columns={[{ label: 'Market' }, { label: 'Revenue', align: 'right' }, { label: 'Orders', align: 'right' }, { label: 'AOV', align: 'right' }, { label: 'Margin %', align: 'right' }, { label: 'Refund %', align: 'right' }, { label: 'VAT' }]}>
          {markets.map(m => (
            <tr key={m.id}>
              <ATd strong>{m.country}</ATd>
              <ATd mono strong align="right">{money(m.revenue)}</ATd>
              <ATd mono align="right">{m.orders}</ATd>
              <ATd mono align="right">{money(m.aov)}</ATd>
              <ATd mono align="right" style={{ color: m.grossMarginPct >= 50 ? AT.ok : AT.ink }}>{m.grossMarginPct.toFixed(0)}%</ATd>
              <ATd mono align="right" style={{ color: m.refundRate > 5 ? AT.warn : AT.ink }}>{m.refundRate.toFixed(1)}%</ATd>
              <ATd mono>{Math.round(m.vat * 100)}%</ATd>
            </tr>
          ))}
        </ATable>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FORECAST
// ════════════════════════════════════════════════════════════
function RepForecast({ vm }) {
  const { forecast, series, target, setTarget, channels } = vm;
  const f = forecast;
  const cmp = [
    { label: 'Last month (actual)', value: f.lastMonth, color: AT.inkSoft, sub: money(f.lastMonth) },
    { label: 'Month-to-date', value: f.mtd, color: '#9A6BFF', sub: money(f.mtd) + ' · day ' + f.dayOfMonth },
    { label: 'Projected month-end', value: f.projected, color: AT.accent, sub: money(f.projected) },
    { label: 'Target', value: f.target, color: AT.ok, sub: money(f.target) },
  ];
  const cmax = Math.max(...cmp.map(c => c.value));
  const bestCh = [...channels].filter(c => c.roas).sort((a, b) => b.roas - a.roas)[0];
  const onTrack = f.targetPct >= 100;
  const extraDaily = Math.max(0, f.requiredDaily - f.dailyAvg);

  // What to plan
  const plan = [];
  if (!onTrack) {
    plan.push({ priority: 'high', icon: 'finance', title: 'Close the target gap', metric: money(f.gap) + ' short',
      detail: `To hit ${money(f.target)} you need ${money(f.requiredDaily)}/day for the remaining ${f.remainingDays} days — that's ${money(extraDaily)}/day above the current ${money(f.dailyAvg)} run-rate.` });
    if (bestCh) plan.push({ priority: 'med', icon: 'megaphone', title: 'Push your best-converting channel', metric: bestCh.roas.toFixed(1) + '× ROAS',
      detail: `${bestCh.label} returns ${bestCh.roas.toFixed(1)}× — scaling it is the cheapest way to add the ${money(extraDaily)}/day you're missing.`, onClick: () => vm.goTab('marketing'), cta: 'Open marketing ROI' });
  } else {
    plan.push({ priority: 'low', icon: 'check', title: 'Hold spend steady', metric: f.targetPct.toFixed(0) + '% of target',
      detail: `You're projected to clear the target by ${money(-f.gap)}. Keep acquisition steady and protect margin rather than chasing more volume.` });
  }
  plan.push({ priority: 'low', icon: 'analytics', title: 'Set next month\u2019s target', detail: `Last month closed at ${money(f.lastMonth)}. A realistic stretch is +10–15% (${money(Math.round(f.lastMonth * 1.12))}). Adjust the target above to re-pace.` });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Target setter */}
      <APanel pad={18} style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <ATargetInput label="Monthly revenue target" value={target} onChange={setTarget} sub="Drives the run-rate pacing below" />
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {[['Required run-rate', money(f.requiredDaily) + '/day', f.requiredDaily > f.dailyAvg ? AT.warn : AT.ok], ['Current run-rate', money(f.dailyAvg) + '/day', AT.ink], ['Days left', f.remainingDays + ' of ' + f.daysInMonth, AT.ink]].map(([l, v, c]) => (
            <div key={l}><div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: c }}>{v}</div><div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{l}</div></div>
          ))}
        </div>
      </APanel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AKpiTile label="Month-to-date" value={money(f.mtd)} sub={'day ' + f.dayOfMonth + ' of ' + f.daysInMonth} icon="finance" />
        <AKpiTile label="Daily run-rate" value={money(f.dailyAvg)} delta={f.requiredDaily > f.dailyAvg ? money(f.requiredDaily) + ' needed' : 'above pace'} deltaTone={f.requiredDaily > f.dailyAvg ? 'warn' : 'ok'} sub="avg / day" icon="bolt" />
        <AKpiTile label="Projected month-end" value={money(f.projected)} delta={(f.pace >= 0 ? '▲ ' : '▼ ') + Math.abs(f.pace).toFixed(0) + '% vs last mo.'} deltaTone={f.pace >= 0 ? 'ok' : 'warn'} icon="analytics" />
        <AKpiTile label="vs target" value={f.targetPct.toFixed(0) + '%'} delta={onTrack ? 'on track' : money(f.gap) + ' short'} deltaTone={onTrack ? 'ok' : 'warn'} icon="orders" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 22, alignItems: 'stretch' }}>
        <APanel pad={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', alignSelf: 'flex-start' }}>Target attainment</div>
          <AGauge pct={Math.min(100, Math.round(f.targetPct))} sub={'of ' + money(f.target)} size={200} />
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, textAlign: 'center' }}>Projected {money(f.projected)} of {money(f.target)} goal</div>
        </APanel>
        <ABlock title="Pacing" note="Where the month lands at the current daily run-rate, against last month and target.">
          <ABars money max={cmax} data={cmp} />
        </ABlock>
      </div>

      <ABlock title="Revenue trend feeding the forecast" note="The recent daily series the run-rate is projected from.">
        <ALineChart height={220} labels={series.labels} series={[{ data: series.current, color: AT.accent }]} />
      </ABlock>

      <ABlock title="What to plan" note="Actions to land the month on target.">
        <APlanList items={plan} />
      </ABlock>
    </div>
  );
}

Object.assign(window, { RepCustomers, RepMarketing, RepInventory, RepGeography, RepForecast });


// ===== admin-analytics.jsx =====
// admin-analytics.jsx — the Reports hub shell. Replaces the old single-screen
// AAnalytics: a tabbed, decision-grade reporting workspace (Overview, Sales,
// Products & margin, Customers, Marketing, Inventory, Geography, Forecast) with a
// period/compare/brand toolbar, CSV/print export and saved views. Heavy
// derivation lives in admin-reports-data.jsx; tab bodies in admin-reports-tabs*.jsx.

const REP_TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'sales', label: 'Sales & traffic', icon: 'analytics' },
  { id: 'products', label: 'Products & margin', icon: 'catalog' },
  { id: 'customers', label: 'Customers', icon: 'users' },
  { id: 'marketing', label: 'Marketing ROI', icon: 'megaphone' },
  { id: 'inventory', label: 'Inventory & demand', icon: 'inventory' },
  { id: 'geography', label: 'Markets', icon: 'brands' },
  { id: 'forecast', label: 'Forecast', icon: 'finance' },
];
const REP_PERIODS = [
  { value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last quarter' }, { value: '180', label: 'Last 6 months' }, { value: '365', label: 'Last year' },
];
const REP_VIEWS_KEY = 'shhh_admin_repviews_v1';

function _repCsv(rows) {
  return rows.map(r => r.map(c => {
    const s = String(c == null ? '' : c);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\n');
}
function _repDownload(name, text) {
  try {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  } catch (e) {}
}

function AAnalytics({ ctx, nav }) {
  const { toast } = ctx;
  const [tab, setTab] = React.useState(() => { try { return localStorage.getItem('shhh_rep_tab') || 'overview'; } catch (e) { return 'overview'; } });
  const [period, setPeriod] = React.useState('90');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [compare, setCompare] = React.useState(true);
  const [brands, setBrands] = React.useState([]);
  const [views, setViews] = React.useState(() => { try { return JSON.parse(localStorage.getItem(REP_VIEWS_KEY) || '[]'); } catch (e) { return []; } });
  const [target, setTargetState] = React.useState(() => repLoadTargets().revenue);
  const setTarget = (n) => { setTargetState(n); const t = repLoadTargets(); repSaveTargets({ ...t, revenue: n }); toast && toast('Monthly target set to ' + money(n)); };
  React.useEffect(() => { try { localStorage.setItem('shhh_rep_tab', tab); } catch (e) {} }, [tab]);

  // ── resolve the time window ────────────────────────────────
  let days = ({ '7': 7, '30': 30, '90': 90, '180': 180, '365': 365 })[period] || 90;
  const customActive = !!(from && to && to >= from);
  if (customActive) days = Math.min(365, Math.max(2, Math.round((new Date(to) - new Date(from)) / 86400000) + 1));

  // ── derive the view-model (memoised on the inputs) ─────────
  const vm = React.useMemo(() => {
    const series0 = repSeries(days);
    const compareAvailable = series0.prev.length === series0.current.length && series0.prevTotal > 0;
    const useCompare = compare && compareAvailable;

    const allProducts = repProducts(ctx.orders);
    const products = brands.length ? allProducts.filter(p => brands.includes(p.brand)) : allProducts;
    const byCat = repByKey(products, 'category');
    const byBrand = repByKey(allProducts, 'brand');
    const kpis = repKpis(ctx.orders, ctx.customers);
    const inventory = repInventory(ctx.orders, ctx.stock);
    const markets = repMarkets(ctx.allOrders, ctx.scope.business);
    const forecast = repForecast(ctx.orders, target);
    const newReturning = repNewReturning(ctx.customers);

    const aovBase = kpis.aov || 84;
    const head = {
      revenue: series0.curTotal,
      prevRevenue: compareAvailable ? series0.prevTotal : series0.curTotal,
      orders: Math.round(series0.curTotal / aovBase),
      prevOrders: compareAvailable ? Math.round(series0.prevTotal / aovBase) : Math.round(series0.curTotal / aovBase),
      aov: aovBase,
      units: Math.round(series0.curTotal / aovBase * 1.4),
    };

    const fmtPct = (n) => (n >= 0 ? '▲ ' : '▼ ') + Math.abs(n).toFixed(1) + '%';
    const tone = (n) => (n >= 0 ? 'ok' : 'warn');
    const pct = (c, p) => (p ? (c / p - 1) * 100 : 0);

    const exportCsv = (kind) => {
      let rows, name = 'shhh-report-' + kind + '.csv';
      if (kind === 'products') {
        rows = [['Product', 'Brand', 'Category', 'Units', 'Revenue', 'COGS', 'Margin', 'Margin %']];
        products.forEach(p => rows.push([p.name, p.brand, p.category, p.units, p.revenue.toFixed(2), p.cogs.toFixed(2), p.margin.toFixed(2), p.marginPct.toFixed(1)]));
      } else if (kind === 'channels') {
        rows = [['Channel', 'Spend', 'Orders', 'Revenue', 'AOV', 'New customers', 'CAC', 'ROAS']];
        REP_CHANNELS.forEach(c => rows.push([c.label, c.spend, c.orders, c.revenue, c.aov.toFixed(2), c.newCust, c.cac ? c.cac.toFixed(2) : '', c.roas ? c.roas.toFixed(2) : '']));
      } else if (kind === 'inventory') {
        rows = [['Product', 'On hand', 'Sold 30d', 'Velocity/day', 'Days cover', 'Sell-through %', 'Signal']];
        inventory.forEach(p => rows.push([p.name, p.onHand, p.units, p.velocity.toFixed(2), isFinite(p.cover) ? Math.round(p.cover) : '', p.sellThrough.toFixed(0), p.signal]));
      } else {
        rows = [['Metric', 'Value'], ['Revenue', head.revenue.toFixed(2)], ['Orders', head.orders], ['AOV', head.aov.toFixed(2)], ['Gross margin %', kpis.grossMarginPct.toFixed(1)], ['Contribution %', kpis.contributionPct.toFixed(1)], ['Refund rate %', kpis.refundRate.toFixed(1)], ['Repeat rate %', kpis.repeatRate.toFixed(0)], ['Avg LTV', kpis.ltv.toFixed(2)]];
      }
      _repDownload(name, _repCsv(rows));
      toast && toast('Exported ' + kind + '.csv');
    };

    return {
      ctx, nav, head, kpis, products, byCat, byBrand,
      channels: REP_CHANNELS, cohorts: REP_COHORTS, promos: REP_PROMOS,
      forecast, inventory, markets, newReturning,
      series: { labels: series0.labels, current: series0.current, prev: series0.prev, dates: series0.dates },
      compare: useCompare, compareAvailable, period, days, fmtPct, tone, pct,
      goTab: setTab, exportCsv, target, setTarget,
    };
  }, [ctx.orders, ctx.customers, ctx.stock, ctx.allOrders, ctx.scope.business, days, compare, brands.join(','), period, target]);

  const brandOpts = Array.from(new Set((window.PRODUCTS || []).map(p => p.brand))).map(b => ({ value: b, label: b }));
  const anyFilter = brands.length || customActive;

  const saveView = () => {
    const name = (window.prompt && window.prompt('Name this view', REP_TABS.find(t => t.id === tab).label + ' · ' + (REP_PERIODS.find(p => p.value === period) || {}).label)) || null;
    if (!name) return;
    const v = { id: 'v' + Date.now(), name, tab, period, compare, brands };
    const next = [v, ...views].slice(0, 8);
    setViews(next); try { localStorage.setItem(REP_VIEWS_KEY, JSON.stringify(next)); } catch (e) {}
    toast && toast('View saved · “' + name + '”');
  };
  const applyView = (v) => { setTab(v.tab); setPeriod(v.period); setCompare(v.compare); setBrands(v.brands || []); setFrom(''); setTo(''); };
  const removeView = (id) => { const next = views.filter(v => v.id !== id); setViews(next); try { localStorage.setItem(REP_VIEWS_KEY, JSON.stringify(next)); } catch (e) {} };

  const TabBody = { overview: RepOverview, sales: RepSales, products: RepProducts, customers: RepCustomers, marketing: RepMarketing, inventory: RepInventory, geography: RepGeography, forecast: RepForecast }[tab] || RepOverview;

  const periodLabel = customActive ? (from.slice(5) + ' → ' + to.slice(5)) : (REP_PERIODS.find(p => p.value === period) || {}).label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tab strip */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: `1px solid ${AT.rule}`, paddingBottom: 2 }}>
        {REP_TABS.map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 13px', borderRadius: '8px 8px 0 0', marginBottom: -1,
              fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: on ? AT.ink : AT.inkSoft,
              borderBottom: on ? `2px solid ${AT.ink}` : '2px solid transparent', background: on ? AT.panel : 'transparent',
            }}><AIcon name={t.icon} size={15} color={on ? AT.ink : AT.inkSoft} /> {t.label}</button>
          );
        })}
      </div>

      {/* Controls toolbar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <ASelect label="Period" value={period} onChange={(v) => { setPeriod(v); setFrom(''); setTo(''); }} options={REP_PERIODS} />
        <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <button onClick={() => setCompare(c => !c)} disabled={!vm.compareAvailable} title={vm.compareAvailable ? '' : 'Not enough history to compare'} style={{
          all: 'unset', cursor: vm.compareAvailable ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 13px',
          borderRadius: AT.radiusSm, border: `1px solid ${vm.compare ? AT.ink : AT.rule}`, background: vm.compare ? AT.ink : AT.panel, color: vm.compare ? '#fff' : AT.inkSoft, opacity: vm.compareAvailable ? 1 : 0.5,
          fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
        }}><AIcon name="analytics" size={14} color={vm.compare ? '#fff' : AT.inkSoft} /> Compare</button>
        <AMultiSelect label="Brand" value={brands} onChange={setBrands} options={brandOpts} />
        {anyFilter ? <button onClick={() => { setBrands([]); setFrom(''); setTo(''); }} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.body, fontSize: 12.5, fontWeight: 600, color: AT.accent, padding: '0 4px' }}>Clear</button> : null}
        <div style={{ flex: 1 }} />
        <ABtn kind="ghost" size="sm" onClick={saveView}><AIcon name="plus" size={14} /> Save view</ABtn>
        <ABtn kind="ghost" size="sm" onClick={() => vm.exportCsv(tab === 'inventory' ? 'inventory' : tab === 'products' ? 'products' : tab === 'marketing' ? 'channels' : 'overview')}><AIcon name="download" size={14} /> Export CSV</ABtn>
        <ABtn kind="ghost" size="sm" onClick={() => { toast && toast('Preparing PDF…'); setTimeout(() => window.print(), 250); }}><AIcon name="download" size={14} /> PDF</ABtn>
      </div>

      {/* Saved views + scope line */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>
          {periodLabel}{vm.compare ? ' · vs previous' : ''}{ctx.scope.market === 'all' ? ' · all markets' : ' · ' + ctx.scope.market}{brands.length ? ' · ' + brands.join(', ') : ''}
        </span>
        {views.length > 0 && <span style={{ width: 1, height: 14, background: AT.rule }} />}
        {views.map(v => (
          <span key={v.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 11px', borderRadius: 999, background: AT.surfaceAlt, border: `1px solid ${AT.rule}` }}>
            <button onClick={() => applyView(v)} style={{ all: 'unset', cursor: 'pointer', fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.ink }}>{v.name}</button>
            <button onClick={() => removeView(v.id)} title="Remove" style={{ all: 'unset', cursor: 'pointer', display: 'flex' }}><AIcon name="close" size={11} color={AT.inkSoft} /></button>
          </span>
        ))}
      </div>

      <TabBody vm={vm} />
    </div>
  );
}

Object.assign(window, { AAnalytics, REP_TABS });



// ===== admin-finances.jsx (merged in to avoid a cross-file load dependency) =====
// admin-finances.jsx — the Finances hub (money of record). Replaces the old
// 4-tab AFinances with a deeper workspace: Overview (cash + gateways), a real
// P&L statement, Invoices, Receivables/aging, Payout reconciliation, and a
// per-market VAT report. Built on the same primitives as the Reports hub
// (admin-reports-charts.jsx) and order-book figures (real ledger, not seeded).

const FIN_TABS = [
  { id: 'overview', label: 'Overview', icon: 'finance' },
  { id: 'pnl', label: 'Profit & loss', icon: 'analytics' },
  { id: 'invoices', label: 'Invoices', icon: 'orders' },
  { id: 'receivables', label: 'Receivables', icon: 'refund' },
  { id: 'payouts', label: 'Payouts', icon: 'bolt' },
  { id: 'vat', label: 'VAT report', icon: 'finance' },
];
const FIN_PERIODS = [
  { value: '30', label: 'Last 30 days' }, { value: '90', label: 'This quarter' },
  { value: '180', label: 'Last 6 months' }, { value: '365', label: 'Year to date' },
];
function _finCsv(rows) { return rows.map(r => r.map(c => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\n'); }
function _finDownload(name, text) {
  try { const b = new Blob([text], { type: 'text/csv;charset=utf-8;' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(u); }, 200); } catch (e) {}
}
const FIN_DToday = new Date('2026-06-02');

function AFinances({ ctx, nav }) {
  const { orders, toast } = ctx;
  const [tab, setTab] = React.useState('overview');
  const [period, setPeriod] = React.useState('90');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [invStatus, setInvStatus] = React.useState('all');
  const [openInv, setOpenInv] = React.useState(null);
  const invSorter = useSort('date', 'desc');
  const days = ({ '30': 30, '90': 90, '180': 180, '365': 365 })[period] || 90;
  const [target, setTargetState] = React.useState(() => repLoadTargets().revenue);
  const setTarget = (n) => { setTargetState(n); const t = repLoadTargets(); repSaveTargets({ ...t, revenue: n }); toast && toast('Monthly target set to ' + money(n)); };

  const paidish = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const gross = paidish.reduce((s, o) => s + o.total, 0);
  const vatTotal = paidish.reduce((s, o) => s + vatOf(o.total).vat, 0);
  const net = gross - vatTotal;
  const refundOrders = orders.filter(o => o.status === 'refunded');
  const refunds = refundOrders.reduce((s, o) => s + o.total, 0);
  const refundVat = vatOf(refunds).vat;
  const discounts = paidish.reduce((s, o) => s + (o.discount || 0), 0);
  const kpis = repKpis(orders, ctx.customers);
  const payouts = window.SEED_PAYOUTS || [];
  const series = repSeries(days);
  const channels = window.REP_CHANNELS || [];
  const marketingSpend = channels.reduce((s, c) => s + c.spend, 0);

  // Cash position
  const settled = payouts.filter(p => p.status === 'paid');
  const cashSettled = settled.reduce((s, p) => s + p.net, 0);
  const feesPaid = settled.reduce((s, p) => s + p.fees, 0);
  const grossSettled = settled.reduce((s, p) => s + p.gross, 0);
  const scheduledPay = payouts.filter(p => p.status === 'scheduled').reduce((s, p) => s + p.net, 0);
  const effFee = grossSettled ? (feesPaid / grossSettled) * 100 : 0;
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const outstanding = pendingOrders.reduce((s, o) => s + o.total, 0);

  // gateway breakdown
  const gwMap = {};
  paidish.forEach(o => { gwMap[o.payMethod] = (gwMap[o.payMethod] || 0) + o.total; });
  const gwData = Object.entries(gwMap).sort((a, b) => b[1] - a[1]);
  const gwTotal = gwData.reduce((s, [, v]) => s + v, 0) || 1;
  const gwLabel = (m) => m.charAt(0).toUpperCase() + m.slice(1);
  const gwColors = ['#2D4BFF', '#1F8A4C', '#E0A800', '#9A6BFF', '#C2410C', '#0A0A0A', '#21438C'];

  // invoices
  const invoices = paidish.concat(refundOrders).map(o => ({ id: 'INV-' + o.ref.replace('SH-', ''), ref: o.ref, customer: o.alias, email: o.email, date: o.date.slice(0, 10), total: o.total, net: vatOf(o.total).net, vat: vatOf(o.total).vat, status: o.status === 'refunded' ? 'refunded' : 'paid' }));
  const invList = invSorter.sort(invoices.filter(inv => {
    if (invStatus !== 'all' && inv.status !== invStatus) return false;
    if (from && inv.date < from) return false;
    if (to && inv.date > to) return false;
    return true;
  }));
  const invTotal = invList.reduce((s, i) => s + i.total, 0);

  // receivables aging (pending = awaiting payment)
  const ageOf = (d) => Math.max(0, Math.round((FIN_DToday - new Date(d.slice(0, 10))) / 86400000));
  const buckets = [{ k: '0–7 days', min: 0, max: 7 }, { k: '8–14 days', min: 8, max: 14 }, { k: '15–30 days', min: 15, max: 30 }, { k: '30+ days', min: 31, max: 1e9 }];
  const aged = pendingOrders.map(o => ({ ...o, age: ageOf(o.date) }));
  const bucketData = buckets.map(b => { const items = aged.filter(o => o.age >= b.min && o.age <= b.max); return { label: b.k, items, value: items.reduce((s, o) => s + o.total, 0) }; });

  // per-market VAT
  const markets = (window.repMarkets ? repMarkets(ctx.allOrders, ctx.scope.business) : []).filter(m => ctx.scope.market === 'all' || m.id === ctx.scope.market);

  // sparklines (indicative shape)
  const spark = series.current.slice(-30);
  const fc = repForecast(orders, target);
  const fcCmp = [
    { label: 'Month-to-date', value: fc.mtd, color: '#9A6BFF', sub: money(fc.mtd) },
    { label: 'Projected month-end', value: fc.projected, color: AT.accent, sub: money(fc.projected) },
    { label: 'Target', value: fc.target, color: AT.ok, sub: money(fc.target) },
  ];

  const tabBtn = (t) => {
    const on = tab === t.id;
    return (
      <button key={t.id} onClick={() => setTab(t.id)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 13px', borderRadius: '8px 8px 0 0', marginBottom: -1, fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: on ? AT.ink : AT.inkSoft, borderBottom: on ? `2px solid ${AT.ink}` : '2px solid transparent', background: on ? AT.panel : 'transparent' }}>
        <AIcon name={t.icon} size={15} color={on ? AT.ink : AT.inkSoft} /> {t.label}{t.id === 'invoices' ? ` (${invoices.length})` : ''}
      </button>
    );
  };

  const exportCsv = () => {
    let rows;
    if (tab === 'invoices') { rows = [['Invoice', 'Order', 'Customer', 'Date', 'Net', 'VAT', 'Total', 'Status']]; invList.forEach(i => rows.push([i.id, i.ref, i.customer, i.date, i.net.toFixed(2), i.vat.toFixed(2), i.total.toFixed(2), i.status])); }
    else if (tab === 'payouts') { rows = [['Payout', 'Date', 'Method', 'Gross', 'Fees', 'Net', 'Status']]; payouts.forEach(p => rows.push([p.id, p.date, p.method, p.gross, p.fees, p.net, p.status])); }
    else if (tab === 'vat') { rows = [['Market', 'Net', 'VAT rate', 'VAT due']]; markets.forEach(m => { const r = m.vat; const nt = m.revenue / (1 + r); rows.push([m.country, nt.toFixed(2), Math.round(r * 100) + '%', (m.revenue - nt).toFixed(2)]); }); }
    else { rows = [['Metric', 'Value'], ['Gross revenue', gross.toFixed(2)], ['Net (ex VAT)', net.toFixed(2)], ['VAT', vatTotal.toFixed(2)], ['COGS', kpis.cogs.toFixed(2)], ['Gross profit', (net - kpis.cogs).toFixed(2)], ['Payment fees', kpis.fees.toFixed(2)], ['Fulfilment', kpis.fulfil.toFixed(2)], ['Refunds', refunds.toFixed(2)]]; }
    _finDownload('shhh-finances-' + tab + '.csv', _finCsv(rows));
    toast && toast('Exported ' + tab + '.csv');
  };

  // P&L statement model
  const grossProfit = net - kpis.cogs;
  const opContribution = grossProfit - kpis.fees - kpis.fulfil;
  const pnl = [
    { l: 'Net revenue (ex VAT)', v: net, bold: true },
    { l: 'Discounts granted', v: -discounts, memo: true },
    { l: 'Refunds (net)', v: -vatOf(refunds).net, sub: true, tone: refunds ? 'warn' : null },
    { l: 'Cost of goods sold', v: -kpis.cogs, sub: true },
    { l: 'Gross profit', v: grossProfit, bold: true, rule: true, pct: net ? grossProfit / net * 100 : 0 },
    { l: 'Payment processing fees', v: -kpis.fees, sub: true },
    { l: 'Fulfilment (pick/pack/label)', v: -kpis.fulfil, sub: true },
    { l: 'Operating contribution', v: opContribution, bold: true, rule: true, pct: net ? opContribution / net * 100 : 0, big: true },
  ];
  // where each euro goes (of net revenue)
  const euroSplit = [
    { label: 'Gross margin kept', value: Math.max(0, grossProfit), color: AT.ok },
    { label: 'Cost of goods', value: kpis.cogs, color: '#9A6BFF' },
    { label: 'Payment fees', value: kpis.fees, color: '#E0A800' },
    { label: 'Fulfilment', value: kpis.fulfil, color: '#C2410C' },
  ];

  const periodLabel = (FIN_PERIODS.find(p => p.value === period) || {}).label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: `1px solid ${AT.rule}`, paddingBottom: 2 }}>{FIN_TABS.map(tabBtn)}</div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <ASelect label="Period" value={period} onChange={setPeriod} options={FIN_PERIODS} />
        <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>{periodLabel} · {ctx.scope.market === 'all' ? 'all markets' : ctx.scope.market} · billed as NL Trading Co</span>
        <div style={{ flex: 1 }} />
        <ABtn kind="ghost" size="sm" onClick={exportCsv}><AIcon name="download" size={14} /> Export CSV</ABtn>
        <ABtn kind="ghost" size="sm" onClick={() => { toast && toast('Preparing PDF…'); setTimeout(() => window.print(), 250); }}><AIcon name="download" size={14} /> PDF</ABtn>
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <AKpiTile label="Gross revenue" value={money(gross)} delta="incl. VAT" deltaTone="ok" sub={paidish.length + ' invoices'} icon="finance" spark={spark} />
            <AKpiTile label="Net (ex VAT)" value={money(net)} delta={kpis.grossMarginPct.toFixed(0) + '% gross margin'} deltaTone="ok" icon="bolt" />
            <AKpiTile label="Cash settled" value={money(cashSettled)} delta={settled.length + ' payouts'} deltaTone="ok" sub="in bank" icon="finance" />
            <AKpiTile label="Outstanding" value={money(outstanding)} delta={pendingOrders.length + ' awaiting pay'} deltaTone={outstanding ? 'warn' : 'ok'} sub="receivable" icon="refund" onClick={() => setTab('receivables')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <AKpiTile label={`VAT ${Math.round(VAT_RATE * 100)}% due`} value={money(vatTotal - refundVat)} delta="to declare" deltaTone="warn" icon="finance" onClick={() => setTab('vat')} />
            <AKpiTile label="Gross profit" value={money(grossProfit)} delta={kpis.grossMarginPct.toFixed(1) + '%'} deltaTone="ok" sub="after COGS" icon="analytics" onClick={() => setTab('pnl')} />
            <AKpiTile label="Effective fee rate" value={effFee.toFixed(2) + '%'} delta={money(feesPaid) + ' fees'} deltaTone={effFee > 2.2 ? 'warn' : 'ok'} sub="on settlements" icon="bolt" onClick={() => setTab('payouts')} />
            <AKpiTile label="Refunds" value={money(refunds)} delta={refundOrders.length ? refundOrders.length + ' this period' : 'none'} deltaTone={refunds ? 'warn' : 'ok'} icon="refund" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {scheduledPay > 0 && <AInsight tone="accent" icon="bolt" title="Next payout scheduled" metric={money(scheduledPay)} body={`A settlement of ${money(scheduledPay)} is scheduled — funds typically land within 1–2 business days.`} cta="See payouts" onClick={() => setTab('payouts')} />}
            {outstanding > 0 && <AInsight tone="warn" icon="refund" title={`${pendingOrders.length} ${pendingOrders.length === 1 ? 'order' : 'orders'} awaiting payment`} metric={money(outstanding)} body="Unpaid orders tie up revenue. Chase anything older than a week before it cancels." cta="Open receivables" onClick={() => setTab('receivables')} />}
          </div>

          <ABlock title="Pacing vs target" note="Set your monthly revenue goal — the run-rate projects where the month lands.">
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <ATargetInput label="Monthly revenue target" value={target} onChange={setTarget} />
              <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
                {[['Projected month-end', money(fc.projected), fc.targetPct >= 100 ? AT.ok : AT.ink], ['Required run-rate', money(fc.requiredDaily) + '/day', fc.requiredDaily > fc.dailyAvg ? AT.warn : AT.ok], ['Current run-rate', money(fc.dailyAvg) + '/day', AT.ink], ['vs target', fc.targetPct.toFixed(0) + '%', fc.targetPct >= 100 ? AT.ok : AT.warn]].map(([l, v, c]) => (
                  <div key={l}><div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 19, color: c }}>{v}</div><div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{l}</div></div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 240 }}><ABars money max={Math.max(...fcCmp.map(c => c.value))} data={fcCmp} /></div>
            </div>
          </ABlock>

          <ABlock title="Revenue trend" note="Daily settled revenue across the selected period (indicative shape).">
            <ALineChart height={210} labels={series.labels} series={[{ data: series.current, color: AT.accent }]} />
          </ABlock>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'flex-start' }}>
            <ABlock title="Payment gateways" note="Share of paid volume by method.">
              <ABars money data={gwData.map(([m, v], i) => ({ label: gwLabel(m), value: v, color: gwColors[i % gwColors.length], sub: money(v) + ' · ' + Math.round(v / gwTotal * 100) + '%' }))} />
            </ABlock>
            <ABlock title="Where each €100 of net revenue goes" note="Cost structure on the ex-VAT basis.">
              <AStackBar segments={euroSplit} />
            </ABlock>
          </div>
        </div>
      )}

      {tab === 'pnl' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 22, alignItems: 'flex-start' }}>
          <APanel pad={22}>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink, marginBottom: 4 }}>Profit & loss</div>
            <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginBottom: 18 }}>{periodLabel} · {ctx.scope.market === 'all' ? 'consolidated' : ctx.scope.market} · ex-VAT basis</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pnl.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: r.big ? '12px 0 2px' : '7px 0', borderTop: r.rule ? `1px solid ${AT.rule}` : 'none', marginTop: r.rule ? 6 : 0 }}>
                  <span style={{ fontFamily: AT.body, fontSize: r.big ? 14.5 : 13, fontWeight: r.bold ? 700 : 500, color: r.memo ? AT.inkSoft : AT.ink, paddingLeft: r.sub || r.memo ? 12 : 0 }}>{r.l}{r.pct != null ? <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft, marginLeft: 8 }}>{r.pct.toFixed(1)}%</span> : null}</span>
                  <span style={{ fontFamily: r.big ? AT.display : AT.mono, fontSize: r.big ? 22 : 13.5, fontWeight: r.bold ? 800 : 500, letterSpacing: r.big ? AT.ld : 0, color: r.v < 0 ? (r.tone === 'warn' ? AT.warn : AT.inkSoft) : AT.ink }}>{r.v < 0 ? '−' + money(-r.v) : money(r.v)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, lineHeight: 1.5 }}>Memo: marketing spend {money(marketingSpend)} and refunds {money(refunds)} sit below operating contribution. VAT is collected on behalf of the state and excluded above.</div>
          </APanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <AKpiTile label="Gross margin" value={kpis.grossMarginPct.toFixed(1) + '%'} delta={money(grossProfit)} deltaTone="ok" icon="analytics" />
              <AKpiTile label="Contribution" value={kpis.contributionPct.toFixed(1) + '%'} delta={money(opContribution)} deltaTone="ok" icon="finance" />
            </div>
            <ABlock title="Cost breakdown" note="Net revenue split into margin kept vs. each cost.">
              <ABars money data={euroSplit.map(s => ({ label: s.label, value: Math.round(s.value), color: s.color, sub: money(s.value) + ' · ' + (net ? Math.round(s.value / net * 100) : 0) + '%' }))} max={Math.max(...euroSplit.map(s => s.value))} />
            </ABlock>
            <AInsight tone="accent" icon="analytics" title="Margin read" body={`You keep ${kpis.grossMarginPct.toFixed(0)}c of gross margin on every euro of net revenue; after fees and fulfilment, ${kpis.contributionPct.toFixed(0)}c of operating contribution remains to cover marketing and overhead.`} />
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            <ASelect label="Status" value={invStatus} onChange={setInvStatus} options={[{ value: 'all', label: 'All' }, { value: 'paid', label: 'Paid' }, { value: 'refunded', label: 'Refunded' }]} />
            <ADateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{invList.length} invoices · {money(invTotal)}</span>
          </div>
          <APanel style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AT.body }}>
                <thead><tr>
                  <ASortTh label="Invoice" k="id" sorter={invSorter} />
                  <ASortTh label="Customer" k="customer" sorter={invSorter} />
                  <ASortTh label="Date" k="date" sorter={invSorter} />
                  <ASortTh label="Net" k="net" sorter={invSorter} align="right" />
                  <ASortTh label="VAT" k="vat" sorter={invSorter} align="right" />
                  <ASortTh label="Total" k="total" sorter={invSorter} align="right" />
                  <ASortTh label="Status" k="status" sorter={invSorter} />
                  <th style={{ background: AT.surfaceAlt, borderBottom: `1px solid ${AT.rule}` }} />
                </tr></thead>
                <tbody>
                  {invList.map(inv => (
                    <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setOpenInv(inv)}>
                      <ATd mono strong>{inv.id} <span style={{ color: AT.inkSoft }}>· #{inv.ref}</span></ATd>
                      <ATd>{inv.customer}</ATd>
                      <ATd mono>{inv.date.slice(5)}</ATd>
                      <ATd mono align="right">{money(inv.net)}</ATd>
                      <ATd mono align="right">{money(inv.vat)}</ATd>
                      <ATd mono strong align="right">{money(inv.total)}</ATd>
                      <ATd><ABadge tone={inv.status === 'refunded' ? 'danger' : 'ok'}>{inv.status}</ABadge></ATd>
                      <ATd align="right"><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </APanel>

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

      {tab === 'receivables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {bucketData.map((b, i) => (
              <AKpiTile key={b.label} label={b.label} value={money(b.value)} delta={b.items.length + (b.items.length === 1 ? ' order' : ' orders')} deltaTone={i >= 2 && b.value ? 'warn' : 'ok'} icon="refund" />
            ))}
          </div>
          {aged.length === 0 ? <AEmpty title="Nothing outstanding" sub="Every order in scope is paid or settled." /> : (
            <div>
              <ASectionTitle right={<span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{money(outstanding)} receivable</span>}>Awaiting payment</ASectionTitle>
              <ATable columns={[{ label: 'Order' }, { label: 'Customer' }, { label: 'Market' }, { label: 'Ordered' }, { label: 'Age', align: 'right' }, { label: 'Amount', align: 'right' }, { label: '', align: 'right' }]}>
                {aged.sort((a, b) => b.age - a.age).map(o => (
                  <tr key={o.ref} style={{ cursor: 'pointer' }} onClick={() => nav('orders', { ref: o.ref })}>
                    <ATd mono strong>#{o.ref}</ATd>
                    <ATd>{o.alias}</ATd>
                    <ATd mono>{o.market || o.country}</ATd>
                    <ATd mono>{o.date.slice(5, 10)}</ATd>
                    <ATd mono align="right" style={{ color: o.age > 14 ? AT.warn : AT.ink }}>{o.age}d</ATd>
                    <ATd mono strong align="right">{money(o.total)}</ATd>
                    <ATd align="right"><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
                  </tr>
                ))}
              </ATable>
            </div>
          )}
        </div>
      )}

      {tab === 'payouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <AKpiTile label="Settled to bank" value={money(cashSettled)} delta={settled.length + ' payouts'} deltaTone="ok" icon="finance" />
            <AKpiTile label="Gross settled" value={money(grossSettled)} sub="before fees" icon="bolt" />
            <AKpiTile label="Fees paid" value={money(feesPaid)} delta={effFee.toFixed(2) + '% effective'} deltaTone={effFee > 2.2 ? 'warn' : 'ok'} icon="refund" />
            <AKpiTile label="Scheduled" value={money(scheduledPay)} delta="upcoming" deltaTone="ok" icon="bolt" />
          </div>
          <ATable columns={[{ label: 'Payout' }, { label: 'Date' }, { label: 'Method' }, { label: 'Gross', align: 'right' }, { label: 'Fees', align: 'right' }, { label: 'Fee %', align: 'right' }, { label: 'Net', align: 'right' }, { label: 'Status' }]}>
            {payouts.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(p => (
              <tr key={p.id}>
                <ATd mono strong>{p.id}</ATd>
                <ATd mono>{p.date.slice(5)}</ATd>
                <ATd>{p.method}</ATd>
                <ATd mono align="right">{money(p.gross)}</ATd>
                <ATd mono align="right" style={{ color: AT.warn }}>−{money(p.fees)}</ATd>
                <ATd mono align="right" style={{ color: AT.inkSoft }}>{(p.fees / p.gross * 100).toFixed(2)}%</ATd>
                <ATd mono strong align="right">{money(p.net)}</ATd>
                <ATd><ABadge tone={p.status === 'paid' ? 'ok' : 'warn'}>{p.status}</ABadge></ATd>
              </tr>
            ))}
          </ATable>
          <AInsight tone="accent" icon="bolt" title="Reconciliation" body={`${settled.length} settlements totalling ${money(grossSettled)} gross netted ${money(cashSettled)} to the bank after ${money(feesPaid)} in processing fees — an effective rate of ${effFee.toFixed(2)}%.`} />
        </div>
      )}

      {tab === 'vat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ maxWidth: 680 }}>
            <APanel pad={22}>
              <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, color: AT.ink, marginBottom: 16 }}>VAT summary · {periodLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Gross sales (incl. VAT)', money(gross)], ['Net sales (ex VAT)', money(net)], ['Output VAT collected', money(vatTotal)], ['Refunded VAT', '−' + money(refundVat)]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: AT.body, fontSize: 13.5, color: AT.inkSoft }}><span>{l}</span><span style={{ fontFamily: AT.mono, color: AT.ink }}>{v}</span></div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTop: `1px solid ${AT.rule}` }}>
                  <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>VAT payable</span>
                  <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 22, letterSpacing: AT.ld, color: AT.ink }}>{money(vatTotal - refundVat)}</span>
                </div>
              </div>
              <div style={{ marginTop: 16 }}><ABtn kind="primary" onClick={() => toast('VAT report exported (PVN deklarācija)')}><AIcon name="download" size={15} /> Export PVN report</ABtn></div>
            </APanel>
          </div>
          {markets.length > 1 && (
            <div>
              <ASectionTitle>VAT by market</ASectionTitle>
              <ATable columns={[{ label: 'Market' }, { label: 'Rate' }, { label: 'Net', align: 'right' }, { label: 'Gross', align: 'right' }, { label: 'VAT due', align: 'right' }]}>
                {markets.map(m => { const nt = m.revenue / (1 + m.vat); return (
                  <tr key={m.id}>
                    <ATd strong>{m.country}</ATd>
                    <ATd mono>{Math.round(m.vat * 100)}%</ATd>
                    <ATd mono align="right">{money(nt)}</ATd>
                    <ATd mono align="right">{money(m.revenue)}</ATd>
                    <ATd mono strong align="right">{money(m.revenue - nt)}</ATd>
                  </tr>
                ); })}
              </ATable>
              <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 8 }}>Each market files its own VAT under its local rate (LV/LT 21% · EE 22%). Switch the market scope to file a single country.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AFinances, FIN_TABS });
