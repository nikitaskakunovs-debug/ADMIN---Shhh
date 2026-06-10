// admin-data.jsx — back-office mock data + persistence.
// Reuses the storefront's PRODUCTS / BRANDS / PROMO_CODES / GIFT_CARDS as the
// source of truth; seeds orders, returns and a review queue, and persists any
// admin edits to localStorage so the prototype feels real across reloads.

const ADMIN_STORE_KEY = 'shhh_admin_v11';

// ── Roles & per-role navigation ──────────────────────────────
const ADMIN_ROLES = {
  owner:      { label: 'Owner',          short: 'OW', desc: 'Full access' },
  manager:    { label: 'Manager',        short: 'MG', desc: 'Operations & reports' },
  sales:      { label: 'Sales',          short: 'SL', desc: 'Orders, customers & growth' },
  accountant: { label: 'Accountant',     short: 'AC', desc: 'Finance & reconciliation' },
  support:    { label: 'Support',        short: 'SU', desc: 'Orders, reviews, returns' },
  fulfilment: { label: 'Fulfilment',     short: 'FU', desc: 'Orders, inventory' },
  content:    { label: 'Content editor', short: 'CO', desc: 'CMS, brands, reviews' },
  developer:  { label: 'Developer',      short: 'DV', desc: 'Read-broad · dev tools' },
};

// Which nav sections each role can open.
const ROLE_NAV = {
  owner:      ['dashboard','orders','customers','catalog','inventory','promos','marketing','analytics','finances','reviews','returns','content','brands','notifications','activity','settings','devtools','help'],
  manager:    ['dashboard','orders','customers','catalog','inventory','promos','marketing','analytics','finances','reviews','returns','content','brands','notifications','activity','help'],
  sales:      ['dashboard','orders','customers','catalog','promos','marketing','analytics','reviews','notifications','help'],
  accountant: ['dashboard','orders','finances','analytics','returns','notifications','activity','help'],
  support:    ['dashboard','orders','customers','reviews','returns','notifications','activity','help'],
  fulfilment: ['dashboard','orders','inventory','catalog','notifications','activity','help'],
  content:    ['dashboard','marketing','content','brands','reviews','analytics','activity','help'],
  developer:  ['dashboard','orders','customers','catalog','inventory','analytics','reviews','returns','content','notifications','activity','devtools','help'],
};
// Apply persisted per-role permission overrides (edited in Settings → Team & roles),
// MERGING in any sections shipped after the override was saved so new features stay reachable.
const SEED_ROLE_NAV = JSON.parse(JSON.stringify(ROLE_NAV));
const CUR_SECTION_UNIVERSE = Array.from(new Set([].concat.apply([], Object.keys(SEED_ROLE_NAV).map(r => SEED_ROLE_NAV[r]))));
try {
  const raw = JSON.parse(localStorage.getItem('shhh_admin_roleperms') || 'null');
  if (raw) {
    const savedPerms = raw.perms || raw; // support legacy flat map
    // Legacy saves have no universe; assume they predate this release's additions (devtools).
    const savedUniverse = raw.universe || CUR_SECTION_UNIVERSE.filter(s => s !== 'devtools');
    const newSections = CUR_SECTION_UNIVERSE.filter(s => savedUniverse.indexOf(s) === -1);
    Object.keys(savedPerms).forEach(r => {
      if (!Array.isArray(savedPerms[r])) return;
      const list = savedPerms[r].slice();
      // Re-add genuinely new sections only where the seed grants them to this role.
      newSections.forEach(s => { if ((SEED_ROLE_NAV[r] || []).indexOf(s) !== -1 && list.indexOf(s) === -1) list.push(s); });
      ROLE_NAV[r] = list;
    });
  }
} catch (e) {}
// 'dashboard' is always accessible; never let a role be locked out entirely.
Object.keys(ROLE_NAV).forEach(r => { if (!ROLE_NAV[r].includes('dashboard')) ROLE_NAV[r].unshift('dashboard'); });
// Merge admin-created products into the live catalogue.
try { const _cp = JSON.parse(localStorage.getItem('shhh_admin_customproducts') || 'null'); if (Array.isArray(_cp) && window.PRODUCTS) _cp.forEach(p => { if (p && p.id && !window.PRODUCTS.some(x => x.id === p.id)) window.PRODUCTS.push(p); }); } catch (e) {}

// ── Multi-business / multi-market scope model ────────────────
// One console runs several brands (businesses), each selling into several
// markets (countries). A "store" is a business × market. Reporting screens
// can run consolidated ("All markets"); operations run inside one market.
const BUSINESSES = [
  { id: 'shhh',  name: 'shhh...',     tag: 'Intimacy & wellness', short: 'S' },
  { id: 'lumen', name: 'Lumen Care',  tag: 'Personal care',       short: 'L', planned: true },
];
// fx = units of local currency per 1 EUR (display only; order totals stored in EUR base).
const MARKETS = [
  { id: 'LV', country: 'Latvia',    currency: 'EUR', symbol: '€',  fx: 1,    locale: 'lv-LV', vat: 0.21,  lang: 'Latvian',    entity: 'NL Trading Co',      status: 'live' },
  { id: 'LT', country: 'Lithuania', currency: 'EUR', symbol: '€',  fx: 1,    locale: 'lt-LT', vat: 0.21,  lang: 'Lithuanian', entity: 'NL Trading Co',      status: 'live' },
  { id: 'EE', country: 'Estonia',   currency: 'EUR', symbol: '€',  fx: 1,    locale: 'et-EE', vat: 0.22,  lang: 'Estonian',   entity: 'NL Trading Co',      status: 'live' },
  { id: 'FI', country: 'Finland',   currency: 'EUR', symbol: '€',  fx: 1,    locale: 'fi-FI', vat: 0.255, lang: 'Finnish',    entity: 'NL Trading OY',      status: 'planned' },
  { id: 'PL', country: 'Poland',    currency: 'PLN', symbol: 'zł', fx: 4.30, locale: 'pl-PL', vat: 0.23,  lang: 'Polish',     entity: 'NL Trading sp. z o.o.', status: 'planned' },
];
function marketById(id) { return MARKETS.find(m => m.id === id) || MARKETS[0]; }
function businessById(id) { return BUSINESSES.find(b => b.id === id) || BUSINESSES[0]; }

// ── Order ⇄ invoice ⇄ payout linking ─────────────────────────
// The order is the hub: every paid order has an invoice and settles into a payout batch.
function orderInvoiceNo(o) { return 'INV-' + String(o.ref || '').replace('SH-', ''); }
function orderTxnId(o) { return 'txn_' + String(o.ref || '').replace(/[^0-9]/g, '') + (o.payMethod ? '_' + o.payMethod.slice(0, 3) : ''); }
// Which payout batch settled (or will settle) this order's funds.
function payoutForOrder(o, payouts) {
  payouts = payouts || (typeof window !== 'undefined' && window.SEED_PAYOUTS) || [];
  if (!['paid', 'shipped', 'delivered', 'refunded'].includes(o.status)) return null;
  const od = (o.date || '').slice(0, 10);
  const onOrAfter = payouts.filter(p => p.date >= od).sort((a, b) => a.date < b.date ? -1 : 1);
  if (onOrAfter.length) return onOrAfter[0];
  return payouts.slice().sort((a, b) => a.date < b.date ? 1 : -1)[0] || null;
}
// EU intra-Community reverse charge: a VAT-registered legal person in another
// EU member state (VAT number prefix ≠ LV) buying from the LV store is invoiced
// at 0% VAT — the buyer self-accounts the VAT. Latvian (LV…) numbers and
// consumers without a VAT number are charged the normal rate.
function vatCountry(vatNo) { return String(vatNo || '').trim().slice(0, 2).toUpperCase(); }
function isReverseCharge(o) {
  const cc = vatCountry(o && o.vatNo);
  return /^[A-Z]{2}$/.test(cc) && cc !== 'LV';
}
// Everything an operator needs about an order's money, in one object.
function orderFinance(o, payouts) {
  const rc = isReverseCharge(o);
  const v = rc ? { gross: Number(o.total) || 0, net: Number(o.total) || 0, vat: 0 } : vatOf(o.total);
  const settled = ['paid', 'shipped', 'delivered'].includes(o.status);
  const payout = payoutForOrder(o, payouts);
  const refunded = (o.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const remaining = Math.max(0, (Number(o.total) || 0) - refunded);
  const partial = refunded > 0.005 && remaining > 0.005;
  let payState = 'unpaid';
  if (o.status === 'refunded' || (refunded > 0.005 && remaining <= 0.005)) payState = 'refunded';
  else if (partial) payState = 'partial';
  else if (settled) payState = 'captured';
  else if (o.status === 'cancelled') payState = 'cancelled';
  return {
    invoice: orderInvoiceNo(o), txn: orderTxnId(o),
    net: v.net, vat: v.vat, gross: v.gross, payState,
    refunded, remaining, partial,
    payout, payoutStatus: payout ? payout.status : (settled ? 'scheduled' : '—'),
    reverseCharge: rc, business: !!(o && o.vatNo), vatNo: (o && o.vatNo) || null, vatNoCountry: rc ? vatCountry(o.vatNo) : null,
  };
}
// Format a EUR-base amount for a given market's currency.
function fmtMoney(eur, marketId) {
  const m = marketById(marketId);
  const v = (Number(eur) || 0) * (m.fx || 1);
  if (m.currency === 'EUR') return '€' + v.toFixed(2);
  if (m.symbol === 'zł') return v.toFixed(2) + ' zł';
  try { return new Intl.NumberFormat(m.locale, { style: 'currency', currency: m.currency }).format(v); }
  catch (e) { return m.symbol + v.toFixed(2); }
}

// ── Helpers ──────────────────────────────────────────────────
function money(n) { return '€' + (Number(n) || 0).toFixed(2); }

// Latvia standard VAT. Stored order totals are GROSS (VAT-inclusive).
const VAT_RATE = 0.21;
function vatOf(gross) { const net = (Number(gross) || 0) / (1 + VAT_RATE); return { gross: Number(gross) || 0, net, vat: (Number(gross) || 0) - net }; }

const ORDER_STATUS = {
  pending:   { label: 'Gaida apmaksu', en: 'Awaiting payment', bg: '#FBE9A8', fg: '#7A5A00', dot: '#E0A800' },
  paid:      { label: 'Apmaksāts',     en: 'Paid',             bg: '#DDE9FF', fg: '#21438C', dot: '#2D4BFF' },
  shipped:   { label: 'Nosūtīts',      en: 'Shipped',          bg: '#E3F0E6', fg: '#1F6B3B', dot: '#1F8A4C' },
  delivered: { label: 'Piegādāts',     en: 'Delivered',        bg: '#E6E6E3', fg: '#3A3A38', dot: '#0A0A0A' },
  refunded:  { label: 'Atmaksāts',     en: 'Refunded',         bg: '#F3E0E0', fg: '#9A2A2A', dot: '#C2410C' },
  cancelled: { label: 'Atcelts',       en: 'Cancelled',        bg: '#EDEDEA', fg: '#8A8A86', dot: '#9A9A96' },
};

function _p(id) { return (window.PRODUCTS || []).find(p => p.id === id); }
function _line(id, qty) { const p = _p(id); return { id, name: p ? p.name : id, price: p ? p.price : 0, qty }; }

function _mkOrder(o) {
  const items = o.items.map(([id, q]) => _line(id, q));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = o.shipping != null ? o.shipping : (subtotal > 60 ? 0 : 2.5);
  const discount = o.discount || 0;
  const total = Math.max(0, subtotal - discount + shipping);
  return { ...o, business: o.business || 'shhh', market: o.market || o.country || 'LV', items, subtotal, shipping, discount, total };
}

// Deterministic filler orders (older history) so the list paginates past the first page.
function _genFillerOrders(n) {
  const names = ['Līga', 'Jānis', 'Emīls', 'Kārlis', 'Rūta', 'Dāvis', 'Elza', 'Mārtiņš', 'Ieva', 'Roberts', 'Sofija', 'Niklāvs', 'Alise', 'Eduards', 'Marta', 'Pēteris', 'Laura', 'Gustavs', 'Anete', 'Toms'];
  const methods = ['swedbank', 'card', 'apple', 'transfer', 'citadele', 'seb'];
  const couriers = ['omniva', 'dpd', 'venipak', 'itella', 'unisend'];
  const lockers = ['Origo, Rīga', 'Narvesen, Rīga', 'Door · Rīga', 'Akropole, Rīga', 'Spice, Rīga', 'Door · Liepāja', 'Door · Daugavpils', 'Stockmann, Rīga'];
  const markets = ['LV', 'LV', 'LV', 'LT', 'EE'];
  const statuses = ['pending', 'paid', 'shipped', 'delivered', 'delivered', 'shipped', 'cancelled'];
  const prods = ['glow', 'hush-01', 'echo', 'velvet', 'halo', 'drift', 'murmur', 'ripple'];
  const out = [];
  let seed = 9876;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  for (let i = 0; i < n; i++) {
    const day = 1 + Math.floor(rnd() * 27);
    const mon = rnd() < 0.5 ? '05' : '04';
    const date = '2026-' + mon + '-' + String(day).padStart(2, '0') + ' ' + String(8 + Math.floor(rnd() * 10)).padStart(2, '0') + ':' + String(Math.floor(rnd() * 60)).padStart(2, '0');
    const nItems = 1 + Math.floor(rnd() * 2);
    const items = [];
    for (let k = 0; k < nItems; k++) items.push([pick(prods), 1 + Math.floor(rnd() * 2)]);
    out.push({
      ref: 'SH-' + (23000 - i), date, status: pick(statuses),
      payMethod: pick(methods), courier: pick(couriers), locker: pick(lockers), sender: 'NL Trading Co',
      alias: pick(names), email: 'shopper' + (1000 + i) + '@gmail.com', country: pick(markets), items,
    });
  }
  return out;
}

// ── Seed orders (spread across the lifecycle) ────────────────
const SEED_ORDERS = [
  { ref: 'SH-24087', date: '2026-06-02 09:14', status: 'pending',  payMethod: 'swedbank', courier: 'omniva',  locker: 'Origo, Rīga',          sender: 'NL Trading Co', alias: 'M. M.',     email: 'm.m+shhh@gmail.com', country: 'LV', items: [['glow',1]] },
  { ref: 'SH-24085', date: '2026-06-02 08:40', status: 'paid',     payMethod: 'apple',    courier: 'dpd',     locker: 'Narvesen, Rīga',       sender: 'NL Trading Co', alias: 'Anna',      email: 'anna88@inbox.lv',    country: 'LV', items: [['hush-01',1],['halo',2]] },
  { ref: 'SH-24082', date: '2026-06-02 07:55', status: 'paid',     payMethod: 'card',     courier: 'omniva',  locker: 'Stockmann, Rīga',      sender: 'Rīga Distribution', alias: 'K.',   email: 'k.berzins@gmail.com',country: 'LV', items: [['echo',1]] },
  { ref: 'SH-24079', date: '2026-06-01 21:30', status: 'shipped',  payMethod: 'citadele', courier: 'omniva',  locker: 'Maxima, Jūrmala',      sender: 'NL Trading Co', alias: 'Līga',      email: 'liga+s@gmail.com',   country: 'LV', items: [['ripple',1]], tracking: 'OMX240601LV' },
  { ref: 'SH-24071', date: '2026-06-01 18:02', status: 'shipped',  payMethod: 'google',   courier: 'venipak', locker: 'Spice, Rīga',          sender: 'Baltic Parcel', alias: 'Pāris',     email: 'paris.rga@gmail.com',country: 'LV', items: [['velvet',1],['halo',1]], tracking: 'VEN240601' },
  { ref: 'SH-24066', date: '2026-06-01 12:48', status: 'delivered',payMethod: 'apple',    courier: 'pasts',   locker: 'Galvenais pasts',      sender: 'NL Trading Co', alias: 'Sintija',   email: 's.k@inbox.lv',       country: 'LV', items: [['murmur',1],['drift',1]] },
  { ref: 'SH-24060', date: '2026-05-31 20:15', status: 'delivered',payMethod: 'seb',      courier: 'omniva',  locker: 'Akropole, Rīga',       sender: 'NL Trading Co', alias: 'Elīna',     email: 'elina.j@gmail.com',  country: 'LV', items: [['glow',1]], discount: 37.8, company: 'Rīga Wellness SIA', vatNo: 'LV40103123456' },
  { ref: 'SH-24052', date: '2026-05-31 15:20', status: 'delivered',payMethod: 'klix',     courier: 'dpd',     locker: 'Door · Rīga',          sender: 'NL Trading Co', alias: 'T.',        email: 't.ozols@gmail.com',  country: 'LV', items: [['hush-01',1]], company: 'Berlin Wellness GmbH', vatNo: 'DE312345678' },
  { ref: 'SH-24041', date: '2026-05-30 11:05', status: 'refunded', payMethod: 'card',     courier: 'omniva',  locker: 'Origo, Rīga',          sender: 'NL Trading Co', alias: 'R.',        email: 'r.kalnins@gmail.com',country: 'LV', items: [['echo',1]] },
  { ref: 'SH-24033', date: '2026-05-30 09:42', status: 'cancelled',payMethod: 'swedbank', courier: 'omniva',  locker: 'Stockmann, Rīga',      sender: 'NL Trading Co', alias: 'J. B.',     email: 'jb@inbox.lv',        country: 'LV', items: [['drift',1]] },
  { ref: 'SH-24028', date: '2026-05-29 19:30', status: 'delivered',payMethod: 'apple',    courier: 'venipak', locker: 'Valki, Valmiera',      sender: 'NL Trading Co', alias: 'Kristaps',  email: 'k.v@gmail.com',      country: 'LV', items: [['drift',1],['murmur',1]] },
  { ref: 'SH-24019', date: '2026-05-29 14:11', status: 'delivered',payMethod: 'inbank',   courier: 'dpd',     locker: 'Maxima, Cēsis',        sender: 'NL Trading Co', alias: 'N.',        email: 'n.liepa@gmail.com',  country: 'LV', items: [['velvet',1]] },
  { ref: 'SH-24008', date: '2026-05-28 22:48', status: 'delivered',payMethod: 'seb',      courier: 'omniva',  locker: 'Mežaparks, Rīga',      sender: 'NL Trading Co', alias: 'D.',        email: 'd.m@inbox.lv',       country: 'LV', items: [['glow',1],['halo',1]] },
  { ref: 'SH-23998', date: '2026-05-28 10:20', status: 'delivered',payMethod: 'google',   courier: 'pasts',   locker: 'Liepāja centrālais',   sender: 'NL Trading Co', alias: 'V.',        email: 'v.k@gmail.com',      country: 'LV', items: [['echo',1],['murmur',1],['halo',1]] },
  // ── Lithuania (LT) ──
  { ref: 'SH-24090', date: '2026-06-02 10:02', status: 'pending',  payMethod: 'paysera',  courier: 'venipak', locker: 'Akropolis, Vilnius',   sender: 'NL Trading Co', alias: 'Greta',     email: 'greta.v@gmail.com',  country: 'LT', items: [['glow',1],['halo',1]] },
  { ref: 'SH-24081', date: '2026-06-01 17:40', status: 'paid',     payMethod: 'card',     courier: 'omniva',  locker: 'Ozas, Vilnius',        sender: 'NL Trading Co', alias: 'T.',        email: 't.kaz@inbox.lt',     country: 'LT', items: [['hush-01',1]], company: 'UAB Vilnius Studio', vatNo: 'LT100012345678' },
  { ref: 'SH-24073', date: '2026-06-01 13:12', status: 'shipped',  payMethod: 'apple',    courier: 'dpd',     locker: 'Mega, Kaunas',         sender: 'NL Trading Co', alias: 'Rūta',      email: 'ruta.k@gmail.com',   country: 'LT', items: [['velvet',1]], tracking: 'DPDLT240601' },
  { ref: 'SH-24050', date: '2026-05-31 11:08', status: 'delivered',payMethod: 'card',     courier: 'venipak', locker: 'Door · Klaipėda',      sender: 'NL Trading Co', alias: 'M.',        email: 'm.jon@gmail.com',    country: 'LT', items: [['echo',1],['drift',1]] },
  // ── Estonia (EE) ──
  { ref: 'SH-24089', date: '2026-06-02 09:48', status: 'paid',     payMethod: 'card',     courier: 'omniva',  locker: 'Ülemiste, Tallinn',    sender: 'NL Trading OÜ', alias: 'Kati',      email: 'kati.t@gmail.com',   country: 'EE', items: [['murmur',1],['halo',2]], company: 'Tallinn Retail OÜ', vatNo: 'EE101234567' },
  { ref: 'SH-24064', date: '2026-06-01 09:30', status: 'shipped',  payMethod: 'apple',    courier: 'itella',  locker: 'Kristiine, Tallinn',   sender: 'NL Trading OÜ', alias: 'R.',        email: 'r.saar@inbox.ee',    country: 'EE', items: [['glow',1]], tracking: 'ITLEE240601' },
  { ref: 'SH-24039', date: '2026-05-30 15:55', status: 'delivered',payMethod: 'card',     courier: 'omniva',  locker: 'Lõunakeskus, Tartu',   sender: 'NL Trading OÜ', alias: 'P.',        email: 'p.tamm@gmail.com',   country: 'EE', items: [['ripple',1]] },
  // ── B2B intra-Community reverse charge (reverse PVN · 0% VAT, buyer self-accounts) ──
  { ref: 'SH-24093', date: '2026-06-02 11:20', status: 'paid',     payMethod: 'transfer', courier: 'dpd',     locker: 'Door · München',        sender: 'NL Trading Co', alias: 'Berlin Wellness GmbH', email: 'procurement@berlin-wellness.de', country: 'LV', items: [['glow',6],['halo',12]], company: 'Berlin Wellness GmbH', vatNo: 'DE312345678', shipping: 0, vies: { valid: true, checkedAt: '2026-06-02T11:21:30Z', consult: 'WDE7K2P9QX', name: 'Berlin Wellness GmbH', address: 'München, DE', source: 'VIES · ec.europa.eu' } },
  { ref: 'SH-24088', date: '2026-06-02 09:35', status: 'shipped',  payMethod: 'transfer', courier: 'venipak', locker: 'Door · Vilnius',         sender: 'NL Trading Co', alias: 'UAB Vilnius Studio',   email: 'orders@vilniusstudio.lt',       country: 'LV', items: [['velvet',10],['echo',5]], company: 'UAB Vilnius Studio', vatNo: 'LT100012345678', shipping: 0, tracking: 'VENLT240602', vies: { valid: true, checkedAt: '2026-02-12T09:02:00Z', consult: 'WLT4M8A1ZK', name: 'UAB Vilnius Studio', address: 'Vilnius, LT', source: 'VIES · ec.europa.eu' } },
  { ref: 'SH-24074', date: '2026-06-01 14:05', status: 'delivered',payMethod: 'transfer', courier: 'itella',  locker: 'Door · Tallinn',         sender: 'NL Trading Co', alias: 'Tallinn Retail OÜ',    email: 'pirkumi@tallinnretail.ee',      country: 'LV', items: [['hush-01',8],['drift',8]], company: 'Tallinn Retail OÜ', vatNo: 'EE101234567', shipping: 0 },
  { ref: 'SH-24057', date: '2026-05-31 13:40', status: 'pending',  payMethod: 'transfer', courier: 'dpd',     locker: 'Door · Warszawa',        sender: 'NL Trading Co', alias: 'Warsaw Boutique Sp. z o.o.', email: 'zakupy@warsawboutique.pl', country: 'LV', items: [['murmur',9],['glow',3]], company: 'Warsaw Boutique Sp. z o.o.', vatNo: 'PL5260012345', shipping: 0 },
  // ── Failed / declined payments (still awaiting a successful charge) ──
  { ref: 'SH-24091', date: '2026-06-02 10:48', status: 'pending', payMethod: 'card',     courier: 'omniva',  locker: 'Stockmann, Rīga',       sender: 'shhh', alias: 'Elīna',  email: 'elina.b@gmail.com',  country: 'LV', items: [['glow',1]], payFailed: true, payFailReason: 'Card declined (insufficient funds)' },
  { ref: 'SH-24069', date: '2026-06-01 16:22', status: 'pending', payMethod: 'card',     courier: 'dpd',     locker: 'Door · Rīga',           sender: 'shhh', alias: 'Toms',   email: 't.kalnins@gmail.com', country: 'LV', items: [['velvet',1],['halo',2]], payFailed: true, payFailReason: '3-D Secure not completed' },
].concat(_genFillerOrders(56));

// Lightweight placeholder image (data URL) for seeded chat attachments.
function _img(label, bg) {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='360' height='270'><rect width='100%' height='100%' fill='" + (bg || '#E7E5E0') + "'/><text x='50%' y='50%' font-family='sans-serif' font-size='17' fill='#7a7a73' text-anchor='middle' dominant-baseline='middle'>" + label + "</text></svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const SEED_RETURNS = [
  { id: 'RET-1042', ref: 'SH-24041', kind: 'return', reason: 'Nepatika sajūta', item: 'Womanizer Starlet 3', status: 'open', date: '2026-06-01', refund: 49,
    customer: 'Marta Ozola', email: 'marta.o@gmail.com', channel: 'web',
    intake: { submittedAt: '2026-06-01 09:12', fields: [
      ['Order number', 'SH-24041'], ['Product', 'Womanizer Starlet 3'], ['Type', 'Return (changed mind / not suitable)'],
      ['Reason', 'Suction weaker than expected'], ['Condition', 'Opened · tested once'], ['Purchased', '2026-05-24'],
      ['Within 14 days?', 'Yes'], ['Desired resolution', 'Refund to original payment'],
    ], comment: 'The suction feels much weaker than expected and it’s not for me. Box is unopened apart from one test.',
      photos: [{ url: _img('Upload · item + box', '#EDE7F5'), name: 'item-box.jpg' }] },
    thread: [
      { id: 'm2', from: 'support', via: 'email', author: 'Support · Līga', ts: '2026-06-01 10:40', body: 'Hi Marta, thanks for the details, and sorry it wasn’t the right fit. We can take it back within 14 days. Could you confirm the box has all the original parts?', images: [] },
      { id: 'm3', from: 'customer', via: 'email', author: 'Marta Ozola', ts: '2026-06-01 12:05', body: 'Yes, everything is in the original packaging. Here’s another photo.', images: [{ url: _img('Email · packaging', '#EAF0F6'), name: 'packaging.jpg' }] },
    ] },
  { id: 'RET-1039', ref: 'SH-23998', kind: 'warranty', reason: 'Neuzlādējas', item: 'Satisfyer Ultra Power Bullet', status: 'open', date: '2026-05-31', refund: 0,
    customer: 'K. Vītols', email: 'k.v@gmail.com', channel: 'email',
    thread: [
      { id: 'm1', from: 'customer', via: 'email', author: 'K. Vītols', ts: '2026-05-31 18:22', body: 'The bullet stopped charging after about two weeks. The light doesn’t come on at all when I plug in the magnetic cable. It’s within warranty — what are my options?', images: [{ url: _img('Email · charging cable', '#E6F0EA'), name: 'cable.jpg' }] },
      { id: 'm2', from: 'support', via: 'email', author: 'Support · Līga', ts: '2026-06-01 09:05', status: 'failed', body: 'Thanks for the photo. The cable looks seated correctly. Could you try a different USB adapter and let me know if the light reacts? If not, we’ll ship a replacement under warranty — no charge.', images: [] },
    ] },
  { id: 'RET-1031', ref: 'SH-24008', kind: 'return', reason: 'Pārdomāju', item: 'We-Vibe Pivot', status: 'approved', date: '2026-05-30', refund: 34,
    customer: 'Anna B.', email: 'anna.b@gmail.com', channel: 'web',
    intake: { submittedAt: '2026-05-29 20:14', fields: [
      ['Order number', 'SH-24008'], ['Product', 'We-Vibe Pivot'], ['Type', 'Return (changed mind)'],
      ['Reason', 'Changed my mind'], ['Condition', 'Sealed · unopened'], ['Within 14 days?', 'Yes'],
      ['Desired resolution', 'Refund'],
    ], comment: 'Changed my mind, still sealed.', photos: [] },
    thread: [
      { id: 'm2', from: 'support', via: 'email', author: 'Support · Jānis', ts: '2026-05-30 08:30', body: 'No problem at all, Anna. Your return is approved — I’ve emailed you a prepaid label. Once it arrives we’ll refund €34 to your original payment method.', images: [] },
      { id: 'm3', from: 'support', via: 'note', author: 'Support · Jānis', ts: '2026-05-30 08:31', body: 'Internal: prepaid label DPDLT-2231 generated. Refund queued on receipt.', images: [] },
    ] },
  { id: 'RET-1024', ref: 'SH-23901', kind: 'warranty', reason: 'Motora troksnis', item: 'LELO Gigi 3', status: 'closed', date: '2026-05-27', refund: 189,
    customer: 'R. Saar', email: 'r.saar@inbox.ee', channel: 'email',
    thread: [
      { id: 'm1', from: 'customer', via: 'email', author: 'R. Saar', ts: '2026-05-25 15:40', body: 'The motor on my Gigi 3 makes a loud rattling noise on the highest setting. Video still attached.', images: [{ url: _img('Email · motor', '#F2E7E7'), name: 'motor.jpg' }] },
      { id: 'm2', from: 'support', via: 'email', author: 'Support · Jānis', ts: '2026-05-26 10:02', body: 'Thank you — that’s clearly a defect. As it’s under warranty we’ll replace the unit. Please confirm your shipping address.', images: [] },
      { id: 'm3', from: 'customer', via: 'email', author: 'R. Saar', ts: '2026-05-26 11:20', body: 'Confirmed, same address as the order. Thanks for the quick help!', images: [] },
      { id: 'm4', from: 'support', via: 'email', author: 'Support · Jānis', ts: '2026-05-27 09:00', body: 'Replacement shipped (tracking ITLEE240527). Closing this claim — reach out any time if the new unit has issues.', images: [] },
    ] },
];

const SEED_REVIEWS_QUEUE = [
  { id: 'RV-501', product: 'hush-01', name: 'Marta', stars: 5, body: 'Tieši tik kluss, kā solīts. Diskrēta piegāde uz pakomātu.', date: '2026-06-02', verified: true },
  { id: 'RV-500', product: 'glow', name: 'A. P.', stars: 4, body: 'Premium sajūta, bet dārgs. Lietotne dažreiz atvienojas.', date: '2026-06-01', verified: true },
  { id: 'RV-499', product: 'echo', name: 'anon', stars: 1, body: 'spam spam buy followers cheap link', date: '2026-06-01', verified: false },
  { id: 'RV-498', product: 'velvet', name: 'Pāris', stars: 5, body: 'Tālvadība strādā lieliski. Iesakām pāriem!', date: '2026-05-31', verified: true },
];

// ── Customer profiles (enrich what we derive from orders) ────
// Discretion note: customers shop under an alias; full delivery names exist
// only while an order is active and are purged 30 days after delivery.
const CUSTOMER_PROFILES = {
  'm.m+shhh@gmail.com':   { name: 'M. M.',          city: 'Rīga',     since: '2026-05-10', marketing: false, tags: ['new'] },
  'anna88@inbox.lv':      { name: 'Anna B.',        city: 'Rīga',     since: '2025-11-02', marketing: true,  tags: ['repeat'] },
  'k.berzins@gmail.com':  { name: 'K. Bērziņš',     city: 'Jūrmala',  since: '2026-01-18', marketing: true,  tags: [] },
  'liga+s@gmail.com':     { name: 'Līga',           city: 'Jūrmala',  since: '2025-09-21', marketing: false, tags: ['repeat'] },
  'paris.rga@gmail.com':  { name: 'A. & R.',        city: 'Rīga',     since: '2025-12-05', marketing: true,  tags: ['couples'] },
  's.k@inbox.lv':         { name: 'Sintija K.',     city: 'Liepāja',  since: '2025-08-14', marketing: true,  tags: ['vip', 'repeat'] },
  'elina.j@gmail.com':    { name: 'Elīna J.',       city: 'Rīga',     since: '2025-07-30', marketing: false, tags: ['vip'] },
  't.ozols@gmail.com':    { name: 'T. Ozols',       city: 'Cēsis',    since: '2026-02-11', marketing: true,  tags: [] },
  'r.kalnins@gmail.com':  { name: 'R. Kalniņš',     city: 'Rīga',     since: '2026-03-02', marketing: false, tags: ['refund-risk'] },
  'jb@inbox.lv':          { name: 'J. B.',          city: 'Daugavpils', since: '2026-04-09', marketing: false, tags: [] },
  'k.v@gmail.com':        { name: 'Kristaps V.',    city: 'Valmiera', since: '2025-10-17', marketing: true,  tags: ['repeat'] },
  'greta.v@gmail.com':    { name: 'Greta V.',       city: 'Vilnius',  since: '2026-05-22', marketing: true,  tags: ['new'] },
  't.kaz@inbox.lt':       { name: 'T. Kaz.',        city: 'Vilnius',  since: '2026-03-14', marketing: false, tags: [] },
  'ruta.k@gmail.com':     { name: 'Rūta K.',        city: 'Kaunas',   since: '2025-12-19', marketing: true,  tags: ['repeat'] },
  'm.jon@gmail.com':      { name: 'M. Jon.',        city: 'Klaipėda', since: '2026-02-02', marketing: false, tags: [] },
  'kati.t@gmail.com':     { name: 'Kati T.',        city: 'Tallinn',  since: '2026-04-28', marketing: true,  tags: ['repeat'] },
  'r.saar@inbox.ee':      { name: 'R. Saar',        city: 'Tallinn',  since: '2025-11-30', marketing: false, tags: ['vip'] },
  'p.tamm@gmail.com':     { name: 'P. Tamm',        city: 'Tartu',    since: '2026-01-09', marketing: true,  tags: [] },
  'n.liepa@gmail.com':    { name: 'N. Liepa',       city: 'Cēsis',    since: '2025-06-25', marketing: true,  tags: ['vip', 'repeat'] },
  'd.m@inbox.lv':         { name: 'D. M.',          city: 'Rīga',     since: '2025-12-29', marketing: false, tags: [] },
  'v.k@gmail.com':        { name: 'V. K.',          city: 'Liepāja',  since: '2025-05-19', marketing: true,  tags: ['vip', 'repeat'] },
};

// Manual account adjustments (credit notes / overpayments / outstanding balances)
// not captured by order status alone. Signed EUR: positive = extra owed to us
// (manual debit), negative = credit we owe the customer (overpayment / store credit).
const CUSTOMER_LEDGER = {
  's.k@inbox.lv':        -14.50, // double-charged once; balance carried as store credit
  'v.k@gmail.com':        -8.00, // goodwill credit after a delayed delivery
  'r.kalnins@gmail.com':  23.00, // outstanding balance after a partial-refund dispute
};

// Derive a CRM list from orders so it always matches order history.
function deriveCustomers(orders, crm) {
  crm = crm || {};
  const map = {};
  orders.forEach(o => {
    const key = o.email || o.alias;
    if (!map[key]) {
      const prof = CUSTOMER_PROFILES[key] || {};
      map[key] = {
        email: o.email, alias: o.alias, name: prof.name || o.alias,
        city: prof.city || '—', country: o.country || 'LV', market: o.market || o.country || 'LV',
        since: prof.since || o.date.slice(0, 10),
        marketing: prof.marketing || false,
        tags: (crm.tags && crm.tags[key]) || prof.tags || [],
        orders: [], ltv: 0, owed: 0, vatNo: null, company: null, lastOrder: o.date, firstOrder: o.date,
      };
    }
    const c = map[key];
    if (crm.marketing && crm.marketing[key] !== undefined) c.marketing = crm.marketing[key];
    c.orders.push(o);
    if (o.vatNo && !c.vatNo) { c.vatNo = o.vatNo; c.company = o.company || c.company; }
    if (['paid', 'shipped', 'delivered'].includes(o.status)) c.ltv += o.total;
    if (o.status === 'pending') c.owed += o.total; // invoiced, awaiting payment = receivable
    if (o.date > c.lastOrder) c.lastOrder = o.date;
    if (o.date < c.firstOrder) c.firstOrder = o.date;
  });
  return Object.values(map).map(c => {
    const adj = CUSTOMER_LEDGER[c.email] || 0;
    const balance = Math.round(((c.owed || 0) + adj) * 100) / 100;
    const payStatus = balance > 0.005 ? 'debtor' : balance < -0.005 ? 'overpaid' : 'settled';
    return {
      ...c,
      orderCount: c.orders.length,
      owed: Math.round((c.owed || 0) * 100) / 100,
      balance, payStatus,
      business: !!c.vatNo,
      reverseCharge: !!(c.vatNo && c.vatNo.slice(0, 2).toUpperCase() !== 'LV'),
      note: (crm.notes && crm.notes[c.email]) || '',
      erased: !!(crm.erased && crm.erased[c.email]),
    };
  }).sort((a, b) => b.ltv - a.ltv);
}

// ── Mock revenue series for the dashboard (deterministic) ────
const REVENUE_THIS = [3120, 2840, 4210, 3890, 5230, 6120, 4780];
const REVENUE_PREV = [2680, 3010, 2950, 3520, 4080, 4460, 5020];
const REVENUE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SALES_CHANNELS = [
  { label: 'Direct', value: 41, color: '#2D4BFF' },
  { label: 'Organic search', value: 28, color: '#1F8A4C' },
  { label: 'Email', value: 18, color: '#E0A800' },
  { label: 'Referral', value: 13, color: '#9A6BFF' },
];
const SALES_BY_CITY = [
  { city: 'Rīga', value: 62 }, { city: 'Jūrmala', value: 14 }, { city: 'Liepāja', value: 11 },
  { city: 'Cēsis', value: 8 }, { city: 'Valmiera', value: 5 },
];
const CONVERSION_FUNNEL = [
  { label: 'Visited', value: 8420 }, { label: 'Viewed product', value: 4310 },
  { label: 'Added to bag', value: 1280 }, { label: 'Checkout', value: 612 }, { label: 'Purchased', value: 428 },
];

// Marketing automations + campaigns
const SEED_AUTOMATIONS = [
  { id: 'au-cart', name: 'Abandoned checkout', desc: 'Discreet email 1h after an unfinished checkout.', on: true, reach: 1203, sessions: 450, orders: 24, conv: 5.3, sales: 1240 },
  { id: 'au-winback', name: 'Win-back (60 days)', desc: 'Re-engage customers who haven’t ordered in 2 months.', on: true, reach: 860, sessions: 210, orders: 11, conv: 5.2, sales: 690 },
  { id: 'au-review', name: 'Post-delivery review request', desc: 'Ask for a review 7 days after delivery.', on: false, reach: 0, sessions: 0, orders: 0, conv: 0, sales: 0 },
  { id: 'au-restock', name: 'Back-in-stock alert', desc: 'Notify customers when a saved item is restocked.', on: true, reach: 320, sessions: 140, orders: 18, conv: 12.9, sales: 980 },
];
const SEED_CAMPAIGNS = [
  { id: 'cm-summer', name: 'Summer · SUMMER20', status: 'active', sent: 4200, open: 38, click: 9.1, sales: 3120, date: '2026-05-28' },
  { id: 'cm-couples', name: 'Couples collection', status: 'scheduled', sent: 0, open: 0, click: 0, sales: 0, date: '2026-06-09' },
  { id: 'cm-spring', name: 'Spring refresh', status: 'done', sent: 3850, open: 41, click: 8.4, sales: 4470, date: '2026-04-12' },
];

// Audit / activity log — seed of historical entries (newest first).
const SEED_AUDIT = [
  { id: 'a9', ts: '2026-06-02 09:20', actor: 'Owner', type: 'order', action: 'Marked paid', target: 'SH-24085', detail: 'Payment confirmed manually' },
  { id: 'a8', ts: '2026-06-02 08:12', actor: 'Fulfilment', type: 'order', action: 'Shipped', target: 'SH-24079', detail: 'Handed to Omniva · OMX240601LV' },
  { id: 'a7', ts: '2026-06-01 17:40', actor: 'Support', type: 'review', action: 'Approved review', target: 'RV-498', detail: 'We-Vibe Pivot · 5★' },
  { id: 'a6', ts: '2026-06-01 16:05', actor: 'Content editor', type: 'content', action: 'Edited page', target: 'faq', detail: 'Updated EN translation' },
  { id: 'a5', ts: '2026-06-01 11:22', actor: 'Owner', type: 'catalog', action: 'Price change', target: 'glow', detail: '€199 → €189' },
  { id: 'a4', ts: '2026-05-31 19:50', actor: 'Support', type: 'return', action: 'Approved return', target: 'RET-1031', detail: 'Refund €34' },
  { id: 'a3', ts: '2026-05-31 14:10', actor: 'Fulfilment', type: 'inventory', action: 'Stock adjust', target: 'hush-01', detail: '+20 units' },
  { id: 'a2', ts: '2026-05-30 10:30', actor: 'Owner', type: 'promo', action: 'Created code', target: 'SUMMER20', detail: '−20%' },
  { id: 'a1', ts: '2026-05-29 09:00', actor: 'Owner', type: 'settings', action: 'Changed setting', target: 'VAT', detail: 'Rate confirmed 21%' },
];
const AUDIT_TYPES = {
  order: { label: 'Orders', icon: 'orders' }, catalog: { label: 'Catalog', icon: 'catalog' },
  inventory: { label: 'Inventory', icon: 'inventory' }, customer: { label: 'Customers', icon: 'users' },
  promo: { label: 'Promos', icon: 'promos' }, review: { label: 'Reviews', icon: 'reviews' },
  return: { label: 'Returns', icon: 'returns' }, content: { label: 'Content', icon: 'content' },
  brand: { label: 'Brands', icon: 'brands' }, settings: { label: 'Settings', icon: 'settings' },
  finance: { label: 'Finance', icon: 'finance' },
};
function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Finance: payouts ledger (mock)
const SEED_PAYOUTS = [
  { id: 'PO-2061', date: '2026-06-01', gross: 4820.50, fees: 96.41, net: 4724.09, status: 'paid', method: 'Citadele settlement' },
  { id: 'PO-2054', date: '2026-05-25', gross: 3910.00, fees: 78.20, net: 3831.80, status: 'paid', method: 'Citadele settlement' },
  { id: 'PO-2047', date: '2026-05-18', gross: 5230.75, fees: 104.62, net: 5126.13, status: 'paid', method: 'Citadele settlement' },
  { id: 'PO-2068', date: '2026-06-08', gross: 2140.00, fees: 42.80, net: 2097.20, status: 'scheduled', method: 'Citadele settlement' },
];

// ── State load / save ────────────────────────────────────────
function adminLoad() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(ADMIN_STORE_KEY) || '{}'); } catch (e) {}
  const orders = (saved.orders && saved.orders.length) ? saved.orders : SEED_ORDERS.map(_mkOrder);
  const stock = saved.stock || (window.PRODUCTS || []).reduce((m, p) => { m[p.id] = typeof p.stock === 'number' ? p.stock : 8; return m; }, {});
  const prices = saved.prices || {};
  const reviews = saved.reviews || SEED_REVIEWS_QUEUE;
  const returns = saved.returns || SEED_RETURNS;
  const role = saved.role || 'owner';
  // Editable promos / gift cards / brand featured flags (seeded from storefront data)
  const promos = saved.promos || JSON.parse(JSON.stringify(window.PROMO_CODES || {}));
  const cards = saved.cards || JSON.parse(JSON.stringify(window.GIFT_CARDS || {}));
  const brandFeatured = saved.brandFeatured || ['satisfyer', 'lelo', 'we-vibe', 'womanizer', 'durex'].reduce((m, x) => { m[x] = true; return m; }, {});
  const crm = saved.crm || { notes: {}, erased: {}, tags: {} };
  const audit = saved.audit || SEED_AUDIT;
  const cms = cmsLoad();
  return { orders, stock, prices, reviews, returns, role, promos, cards, brandFeatured, crm, audit, cms };
}
function adminSave(state) {
  try { localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ── CMS overrides (shared with the storefront via 'shhh_cms_v1') ──
function cmsLoad() { try { return JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}'); } catch (e) { return {}; } }
function cmsSave(ov) {
  try { localStorage.setItem('shhh_cms_v1', JSON.stringify(ov)); } catch (e) {}
  // Apply live so the admin's own preview + any open storefront reflect it.
  if (typeof window.__shhhApplyCms === 'function') window.__shhhApplyCms();
}

Object.assign(window, {
  ADMIN_STORE_KEY, ADMIN_ROLES, ROLE_NAV, ORDER_STATUS,
  money, adminLoad, adminSave, cmsLoad, cmsSave, SEED_ORDERS, _mkOrder,
  CUSTOMER_PROFILES, deriveCustomers,
  REVENUE_THIS, REVENUE_PREV, REVENUE_DAYS, SALES_CHANNELS,
  SALES_BY_CITY, CONVERSION_FUNNEL, SEED_AUTOMATIONS, SEED_CAMPAIGNS, SEED_PAYOUTS,
  SEED_AUDIT, AUDIT_TYPES, nowStamp,
  VAT_RATE, vatOf,
  BUSINESSES, MARKETS, marketById, businessById, fmtMoney,
  orderInvoiceNo, orderTxnId, payoutForOrder, orderFinance, isReverseCharge, vatCountry,
});
