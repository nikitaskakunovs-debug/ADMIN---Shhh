/* Shhh Admin — data layer.
   Deterministically generates orders & customers from the storefront catalog,
   plus formatting helpers and metric aggregations used by every screen. */

(function () {
  // --- deterministic RNG so the demo data is stable across reloads ---
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260610);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const ri = (min, max) => min + Math.floor(rnd() * (max - min + 1));

  const FIRST = ['Elīna', 'Marta', 'Sofia', 'Anna', 'Liene', 'Katrīna', 'Emma', 'Laura', 'Alise', 'Dace', 'Olga', 'Maija', 'Greta', 'Hanna', 'Paula', 'Nora', 'Ilze', 'Vera', 'Lotte', 'Mia'];
  const LAST = ['Bērziņa', 'Ozola', 'Kalniņa', 'Jansone', 'Liepa', 'Vītola', 'Krūmiņa', 'Tamm', 'Kask', 'Saar', 'Petrova', 'Novak', 'Keller', 'Lehto', 'Virtanen', 'Weber'];
  const COUNTRIES = ['LV', 'LV', 'LV', 'EE', 'LT', 'FI', 'DE', 'SE'];
  const CITIES = { LV: ['Riga', 'Jūrmala', 'Liepāja'], EE: ['Tallinn', 'Tartu'], LT: ['Vilnius', 'Kaunas'], FI: ['Helsinki', 'Espoo'], DE: ['Berlin', 'Hamburg'], SE: ['Stockholm', 'Malmö'] };
  const PAYMENTS = ['Card', 'Card', 'Card', 'Apple Pay', 'PayPal', 'Klarna'];
  const STATUSES = ['fulfilled', 'fulfilled', 'fulfilled', 'fulfilled', 'paid', 'paid', 'pending', 'refunded', 'cancelled'];
  const DAY = 24 * 3600 * 1000;
  const NOW = new Date('2026-06-10T14:30:00').getTime();

  // --- customers ---
  const customers = [];
  for (let i = 0; i < 28; i++) {
    const first = pick(FIRST), last = pick(LAST);
    const country = pick(COUNTRIES);
    customers.push({
      id: 'C-' + (2001 + i),
      name: first + ' ' + last,
      email: (first + '.' + last).toLowerCase().replace(/[āēīūļņķšžč]/g, c => ({ ā: 'a', ē: 'e', ī: 'i', ū: 'u', ļ: 'l', ņ: 'n', ķ: 'k', š: 's', ž: 'z', č: 'c' }[c] || c)) + '@example.com',
      country,
      city: pick(CITIES[country]),
      marketing: rnd() > 0.35,
      since: new Date(NOW - ri(20, 700) * DAY).toISOString().slice(0, 10),
    });
  }

  // --- orders ---
  const sellable = window.SHOP_DATA.products.filter(p => p.status === 'active');
  const orders = [];
  for (let i = 0; i < 96; i++) {
    const itemCount = ri(1, 3);
    const items = [];
    const usedIds = {};
    for (let j = 0; j < itemCount; j++) {
      const p = pick(sellable);
      if (usedIds[p.id]) continue;
      usedIds[p.id] = true;
      items.push({ productId: p.id, name: p.name, sku: p.sku, qty: ri(1, 2), price: p.price, size: pick(p.sizes) });
    }
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const discount = rnd() < 0.3 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal - discount >= 80 ? 0 : 4.9;
    const customer = pick(customers);
    const createdAt = NOW - ri(0, 59) * DAY - ri(0, 23) * 3600 * 1000;
    const status = pick(STATUSES);
    orders.push({
      id: '#' + (3500 - i),
      customerId: customer.id,
      customerName: customer.name,
      country: customer.country,
      items,
      subtotal,
      discount,
      discountCode: discount ? pick(['QUIET10', 'SHHH5', 'SILKYJUNE']) : null,
      shipping,
      total: Math.round((subtotal - discount + shipping) * 100) / 100,
      payment: pick(PAYMENTS),
      status,
      createdAt,
      note: rnd() < 0.12 ? pick(['Gift wrap, please!', 'Leave at the door.', 'Birthday gift — no invoice in the box.', 'Call before delivery.']) : null,
    });
  }
  orders.sort((a, b) => b.createdAt - a.createdAt);

  // --- helpers ---
  const money = (n) => '€' + Number(n).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyShort = (n) => n >= 1000 ? '€' + (n / 1000).toFixed(1) + 'k' : '€' + Math.round(n);
  const shortDate = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const fullDate = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeAgo = (ts) => {
    const m = Math.max(1, Math.round((NOW - ts) / 60000));
    if (m < 60) return m + 'm ago';
    const h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.round(h / 24);
    return d === 1 ? 'yesterday' : d + 'd ago';
  };

  const revenueOrders = () => orders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');

  // revenue per day for the last n days → [{ ts, label, value, count }]
  function revenueByDay(n) {
    const out = [];
    for (let d = n - 1; d >= 0; d--) {
      const dayStart = new Date(NOW - d * DAY); dayStart.setHours(0, 0, 0, 0);
      const a = dayStart.getTime(), b = a + DAY;
      const dayOrders = revenueOrders().filter(o => o.createdAt >= a && o.createdAt < b);
      out.push({ ts: a, label: shortDate(a), value: Math.round(dayOrders.reduce((s, o) => s + o.total, 0)), count: dayOrders.length });
    }
    return out;
  }

  function topProducts(n) {
    const tally = {};
    revenueOrders().forEach(o => o.items.forEach(it => {
      tally[it.productId] = tally[it.productId] || { productId: it.productId, name: it.name, units: 0, revenue: 0 };
      tally[it.productId].units += it.qty;
      tally[it.productId].revenue += it.qty * it.price;
    }));
    return Object.values(tally).sort((a, b) => b.revenue - a.revenue).slice(0, n);
  }

  function salesByCategory() {
    const tally = {};
    revenueOrders().forEach(o => o.items.forEach(it => {
      const p = window.SHOP_DATA.product(it.productId);
      const cat = p ? p.category : 'other';
      tally[cat] = (tally[cat] || 0) + it.qty * it.price;
    }));
    return Object.keys(tally)
      .map(id => ({ id, name: window.SHOP_DATA.categoryName(id), value: Math.round(tally[id]) }))
      .sort((a, b) => b.value - a.value);
  }

  function customerOrders(customerId) {
    return orders.filter(o => o.customerId === customerId);
  }

  function lowStock(threshold) {
    return window.SHOP_DATA.products
      .filter(p => p.status === 'active' && p.stock <= threshold)
      .sort((a, b) => a.stock - b.stock);
  }

  // KPI snapshot for the dashboard / reports
  function kpis() {
    const last30 = revenueByDay(30), prev = revenueByDay(60).slice(0, 30);
    const sum = arr => arr.reduce((s, d) => s + d.value, 0);
    const cnt = arr => arr.reduce((s, d) => s + d.count, 0);
    const rev30 = sum(last30), revPrev = sum(prev) || 1;
    const ord30 = cnt(last30), ordPrev = cnt(prev) || 1;
    return {
      revenue30: rev30,
      revenueDelta: Math.round(((rev30 - revPrev) / revPrev) * 100),
      orders30: ord30,
      ordersDelta: Math.round(((ord30 - ordPrev) / ordPrev) * 100),
      aov: ord30 ? Math.round(rev30 / ord30) : 0,
      pendingCount: orders.filter(o => o.status === 'pending' || o.status === 'paid').length,
      refunds30: orders.filter(o => o.status === 'refunded' && o.createdAt > NOW - 30 * DAY).length,
    };
  }

  // simple persistence for UI preferences (dashboard layout etc.)
  const prefs = {
    get(key, fallback) {
      try { const v = localStorage.getItem('shhh-admin:' + key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('shhh-admin:' + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    },
    clearAll() {
      try {
        Object.keys(localStorage).filter(k => k.indexOf('shhh-admin:') === 0).forEach(k => localStorage.removeItem(k));
      } catch (e) { /* ignore */ }
    },
  };

  window.AdminData = {
    NOW, DAY,
    orders, customers,
    money, moneyShort, shortDate, fullDate, timeAgo,
    revenueByDay, topProducts, salesByCategory, customerOrders, lowStock, kpis,
    prefs,
  };
})();
