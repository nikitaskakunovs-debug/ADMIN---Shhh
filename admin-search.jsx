// admin-search.jsx — global command palette (⌘K). Searches every section,
// labels each result with where it lives, deep-links straight to the item.
// Depends on AT, AIcon, ABadge, ROLE_NAV, fmtMoney, marketById (globals).

function _norm(s) { return (s == null ? '' : String(s)).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

// Build grouped results for a query, respecting the role's allowed sections.
function buildSearchResults(query, ctx, nav) {
  const q = _norm(query).trim();
  const allowed = window.ROLE_NAV[ctx.role] || window.ROLE_NAV.owner;
  const can = (s) => allowed.includes(s);
  const groups = [];
  if (!q) return groups;
  const terms = q.split(/\s+/).filter(Boolean);
  const hit = (hay) => { const h = _norm(hay); return terms.every(t => h.includes(t)); };
  const PRODUCTS = window.PRODUCTS || [];
  const ORDER_STATUS = window.ORDER_STATUS || {};
  const money = (v, m) => (window.fmtMoney ? window.fmtMoney(v, m) : '€' + (v || 0).toFixed(2));

  // ── Orders ──
  if (can('orders')) {
    const rows = ctx.orders.filter(o => hit([o.ref, o.alias, o.email, o.market, o.payMethod, o.courier].join(' '))).slice(0, 6);
    if (rows.length) groups.push({ label: 'Orders', section: 'orders', icon: 'orders', screen: 'orders', total: ctx.orders.filter(o => hit([o.ref, o.alias, o.email].join(' '))).length, items: rows.map(o => ({
      icon: 'orders', title: '#' + o.ref,
      sub: (o.alias || 'Customer') + ' · ' + money(o.total, o.market || o.country) + ' · ' + ((ORDER_STATUS[o.status] || {}).en || o.status),
      go: () => nav('orders', { ref: o.ref }),
    })) });
  }
  // ── Customers ──
  if (can('customers')) {
    const rows = ctx.customers.filter(c => hit([c.name, c.email, c.alias, c.city, (c.tags || []).join(' ')].join(' '))).slice(0, 6);
    if (rows.length) groups.push({ label: 'Customers', section: 'customers', icon: 'users', screen: 'customers', total: rows.length, items: rows.map(c => ({
      icon: 'users', title: c.name,
      sub: (c.email || c.alias) + ' · ' + c.city + ' · ' + c.orderCount + ' orders',
      go: () => nav('customers', { email: c.email }),
    })) });
  }
  // ── Products (Catalog) ──
  if (can('catalog') || can('inventory')) {
    const rows = PRODUCTS.filter(p => hit([p.name, p.brand, p.code, p.category].join(' '))).slice(0, 6);
    if (rows.length) groups.push({ label: 'Products', section: 'catalog', icon: 'catalog', screen: 'catalog', total: rows.length, items: rows.map(p => ({
      icon: 'catalog', title: p.name,
      sub: (p.brand || '') + (p.code ? ' · ' + p.code : '') + ' · in stock: ' + (ctx.stock[p.id] ?? 0),
      go: () => nav(can('catalog') ? 'catalog' : 'inventory', { id: p.id }),
    })) });
  }
  // ── Promo codes ──
  if (can('promos')) {
    const rows = Object.entries(ctx.promos || {}).filter(([code, p]) => hit([code, p.desc, p.type].join(' '))).slice(0, 5);
    if (rows.length) groups.push({ label: 'Promo codes', section: 'promos', icon: 'promos', screen: 'promos', total: rows.length, items: rows.map(([code, p]) => ({
      icon: 'promos', title: code,
      sub: (p.desc || p.type) + (p.disabled ? ' · disabled' : ' · active'),
      go: () => nav('promos'),
    })) });
    // Gift cards
    const cards = Object.entries(ctx.cards || {}).filter(([code, c]) => hit([code, (c.balance != null ? 'gift card' : '')].join(' '))).slice(0, 4);
    if (cards.length) groups.push({ label: 'Gift cards', section: 'promos', icon: 'promos', screen: 'promos', total: cards.length, items: cards.map(([code, c]) => ({
      icon: 'promos', title: code, sub: 'Gift card · balance ' + money(c.balance != null ? c.balance : c, 'LV'),
      go: () => nav('promos'),
    })) });
  }
  // ── Brands ──
  if (can('brands') || can('catalog')) {
    const rows = (window.BRANDS || []).filter(b => hit(b.name)).slice(0, 6);
    if (rows.length && can('brands')) groups.push({ label: 'Brands', section: 'brands', icon: 'brands', screen: 'brands', total: rows.length, items: rows.map(b => ({
      icon: 'brands', title: b.name, sub: PRODUCTS.filter(p => p.brand === b.name).length + ' products',
      go: () => nav('brands'),
    })) });
  }
  // ── Content pages ──
  if (can('content')) {
    const CP = window.CONTENT_PAGES || {};
    const keys = Object.keys(CP).filter(k => hit([k, CP[k].title, CP[k].sub, CP[k].kicker].join(' '))).slice(0, 6);
    if (keys.length) groups.push({ label: 'Content pages', section: 'content', icon: 'content', screen: 'content', total: keys.length, items: keys.map(k => ({
      icon: 'content', title: CP[k].title || k,
      sub: (CP[k].kicker ? CP[k].kicker + ' · ' : '') + '/' + k,
      go: () => nav('content', { openPage: k }),
    })) });
  }
  // ── Reviews ──
  if (can('reviews')) {
    const pname = (id) => (PRODUCTS.find(p => p.id === id) || {}).name || id;
    const rows = (ctx.reviews || []).filter(r => hit([r.name, r.body, pname(r.product), r.stars + ''].join(' '))).slice(0, 4);
    if (rows.length) groups.push({ label: 'Reviews', section: 'reviews', icon: 'reviews', screen: 'reviews', total: rows.length, items: rows.map(r => ({
      icon: 'reviews', title: r.name + ' · ' + r.stars + '★',
      sub: pname(r.product) + (r.decided ? ' · ' + r.decided : ' · pending'),
      go: () => nav('reviews'),
    })) });
  }
  // ── Returns ──
  if (can('returns')) {
    const rows = (ctx.returns || []).filter(r => hit([r.id, r.ref, r.item, r.reason, r.kind].join(' '))).slice(0, 4);
    if (rows.length) groups.push({ label: 'Returns & warranty', section: 'returns', icon: 'returns', screen: 'returns', total: rows.length, items: rows.map(r => ({
      icon: 'returns', title: (r.kind === 'warranty' ? 'Warranty' : 'Return') + ' · ' + (r.id || r.ref),
      sub: (r.item || '') + ' · ' + r.status,
      go: () => nav('returns'),
    })) });
  }
  // ── Help guides ──
  const G = window.GUIDES || {};
  const guides = Object.keys(G).filter(id => hit([G[id].title, G[id].blurb, G[id].area].join(' '))).slice(0, 4);
  if (guides.length) groups.push({ label: 'Help & guides', section: 'help', icon: 'list', screen: 'help', total: guides.length, items: guides.map(id => ({
    icon: G[id].icon, title: G[id].title, sub: 'Guide · ' + G[id].area,
    go: () => nav('help', { topic: id }),
  })) });
  // ── Go to (sections) ──
  const navItems = (window.NAV_ITEMS || []).filter(it => can(it.id) && hit(it.label)).slice(0, 5);
  if (navItems.length) groups.push({ label: 'Go to', section: null, icon: 'arrow', items: navItems.map(it => ({
    icon: it.icon, title: it.label, sub: 'Open section', go: () => nav(it.id),
  })) });

  return groups;
}

// Sections you can jump to with no query (role-aware).
function jumpDestinations(ctx, nav) {
  const allowed = window.ROLE_NAV[ctx.role] || window.ROLE_NAV.owner;
  return (window.NAV_ITEMS || []).filter(it => allowed.includes(it.id)).map(it => ({
    icon: it.icon, title: it.label, sub: 'Open section', go: () => nav(it.id),
  }));
}

const RECENT_KEY = 'shhh_admin_search_recent';
function loadRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; } }
function pushRecent(q) {
  if (!q || !q.trim()) return;
  let r = loadRecent().filter(x => x !== q);
  r.unshift(q); r = r.slice(0, 6);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch (e) {}
}

function GlobalSearch({ ctx, nav }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const [recent, setRecent] = React.useState(loadRecent);

  // ⌘K / Ctrl+K opens; "/" opens when not typing in a field.
  React.useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && (k === 'k' || k === 'K')) { e.preventDefault(); setOpen(o => !o); }
      else if (k === '/' && !typing && !open) { e.preventDefault(); setOpen(true); }
      else if (k === 'Escape' && open) { setOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  React.useEffect(() => { window.__openAdminSearch = () => setOpen(true); return () => { delete window.__openAdminSearch; }; }, []);
  React.useEffect(() => { if (open) { setQ(''); setActive(0); setRecent(loadRecent()); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);

  const groups = React.useMemo(() => buildSearchResults(q, ctx, nav), [q, ctx, nav]);
  const jumps = React.useMemo(() => jumpDestinations(ctx, nav), [ctx, nav]);
  // Flat list of selectable rows for keyboard nav.
  const flat = [];
  if (q) groups.forEach(g => g.items.forEach(it => flat.push(it)));
  else jumps.forEach(it => flat.push(it));
  const total = flat.length;

  const choose = (it) => { if (!it) return; pushRecent(q); setOpen(false); it.go(); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(total - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[active]); }
  };
  React.useEffect(() => { setActive(0); }, [q]);
  // Keep active row visible without scrollIntoView.
  React.useEffect(() => {
    const c = listRef.current; if (!c) return;
    const el = c.querySelector('[data-active="1"]'); if (!el) return;
    const top = el.offsetTop, bot = top + el.offsetHeight;
    if (top < c.scrollTop) c.scrollTop = top - 8;
    else if (bot > c.scrollTop + c.clientHeight) c.scrollTop = bot - c.clientHeight + 8;
  }, [active, q]);

  if (!open) return null;
  let rowIdx = -1;
  const Row = (it, key) => {
    rowIdx += 1; const idx = rowIdx; const on = idx === active;
    return (
      <button key={key} data-active={on ? '1' : '0'} onMouseEnter={() => setActive(idx)} onClick={() => choose(it)} style={{
        all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: AT.radiusSm,
        background: on ? AT.accentSoft : 'transparent',
      }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: on ? AT.accent : AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={it.icon} size={15} color={on ? '#fff' : AT.ink} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: AT.body, fontWeight: 600, fontSize: 13.5, color: AT.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
          {it.sub && <span style={{ display: 'block', fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.sub}</span>}
        </span>
        {on && <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.accent, border: `1px solid ${AT.accent}`, borderRadius: 5, padding: '2px 6px', flexShrink: 0 }}>↵ open</span>}
      </button>
    );
  };

  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }} style={{
      position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,20,19,0.45)',
      backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '12vh 20px 20px',
    }}>
      <div style={{ width: 640, maxWidth: '100%', maxHeight: '72vh', background: AT.panel, borderRadius: 16, boxShadow: '0 30px 90px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', borderBottom: `1px solid ${AT.rule}` }}>
          <AIcon name="search" size={19} color={AT.inkSoft} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Search orders, customers, products, codes, pages…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: AT.body, fontSize: 16, color: AT.ink }} />
          <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft, border: `1px solid ${AT.rule}`, borderRadius: 5, padding: '2px 7px' }}>Esc</span>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {!q ? (
            <div>
              {recent.length > 0 && (
                <div style={{ marginBottom: 6 }}>
                  <div style={searchGroupLabel}>Recent searches</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 14px 10px' }}>
                    {recent.map((r, i) => (
                      <button key={i} onClick={() => setQ(r)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, border: `1px solid ${AT.rule}`, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12.5, color: AT.ink }}>
                        <AIcon name="search" size={12} color={AT.inkSoft} /> {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={searchGroupLabel}>Jump to</div>
              {jumps.map((it, i) => Row(it, 'j' + i))}
            </div>
          ) : total === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: AT.body, fontSize: 14, fontWeight: 600, color: AT.ink, marginBottom: 4 }}>No results for “{q}”</div>
              <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Try an order number, a customer name, a product, or a promo code.</div>
            </div>
          ) : (
            groups.map((g, gi) => (
              <div key={gi} style={{ marginBottom: 4 }}>
                <div style={{ ...searchGroupLabel, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <AIcon name={g.icon} size={12} color={AT.inkSoft} />
                  <span style={{ flex: 1 }}>{g.label}</span>
                  {g.total > g.items.length && <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft, textTransform: 'none', letterSpacing: 0 }}>{g.items.length} of {g.total}</span>}
                </div>
                {g.items.map((it, ii) => Row(it, gi + '-' + ii))}
                {g.screen && g.total > g.items.length && (
                  <button onClick={() => { pushRecent(q); setOpen(false); nav(g.screen); }} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px 10px 56px', fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.accent }}>
                    See all {g.total} in {g.label} <AIcon name="arrow" size={13} color={AT.accent} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 16px', borderTop: `1px solid ${AT.rule}`, background: AT.surfaceAlt }}>
          <span style={searchHint}><b style={searchKbd}>↑</b><b style={searchKbd}>↓</b> navigate</span>
          <span style={searchHint}><b style={searchKbd}>↵</b> open</span>
          <span style={searchHint}><b style={searchKbd}>esc</b> close</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>Results respect your current market scope</span>
        </div>
      </div>
    </div>
  );
}
const searchGroupLabel = { fontFamily: AT.body, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: AT.inkSoft, padding: '10px 14px 4px' };
const searchHint = { display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft };
const searchKbd = { fontFamily: AT.mono, fontSize: 10.5, fontWeight: 700, color: AT.ink, background: AT.panel, border: `1px solid ${AT.rule}`, borderRadius: 4, padding: '1px 5px' };

Object.assign(window, { GlobalSearch, buildSearchResults });
