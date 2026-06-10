/* Shhh Admin — global search palette (⌘K / Ctrl+K). Searches orders,
   products, customers and admin screens. */

(function () {
  const { useState, useEffect, useMemo, useRef } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function buildResults(q) {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const out = [];

    AdminViews.NAV.forEach(g => g.items.forEach(item => {
      if (item.label.toLowerCase().includes(needle)) {
        out.push({ kind: 'Screen', icon: item.icon, title: item.label, subtitle: 'Go to screen', screen: item.id });
      }
    }));

    SHOP_DATA.products.forEach(p => {
      if (p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)) {
        out.push({ kind: 'Product', icon: 'products', title: p.name, subtitle: `${p.sku} · ${D.money(p.price)}`, screen: 'product', params: { id: p.id }, color: p.color });
      }
    });

    D.customers.forEach(c => {
      if (c.name.toLowerCase().includes(needle) || c.email.includes(needle)) {
        out.push({ kind: 'Customer', icon: 'customers', title: c.name, subtitle: c.email, screen: 'customer', params: { id: c.id } });
      }
    });

    D.orders.forEach(o => {
      if (o.id.toLowerCase().includes(needle) || o.customerName.toLowerCase().includes(needle)) {
        out.push({ kind: 'Order', icon: 'orders', title: o.id + ' — ' + o.customerName, subtitle: `${D.money(o.total)} · ${o.status}`, screen: 'order', params: { id: o.id } });
      }
    });

    SHOP_PROMO.promos.forEach(p => {
      if (p.code.toLowerCase().includes(needle)) {
        out.push({ kind: 'Discount', icon: 'discounts', title: p.code, subtitle: SHOP_PROMO.typeLabel(p) + ' · ' + p.status, screen: 'discounts' });
      }
    });

    return out.slice(0, 12);
  }

  function SearchPalette({ onClose }) {
    const nav = window.useAdminNav();
    const [q, setQ] = useState('');
    const [sel, setSel] = useState(0);
    const inputRef = useRef(null);
    const results = useMemo(() => buildResults(q), [q]);

    useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);
    useEffect(() => { setSel(0); }, [q]);

    const go = (r) => {
      if (!r) return;
      nav.navigate(r.screen, r.params || {});
      onClose();
    };

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
      else if (e.key === 'Enter') go(results[sel]);
    };

    return (
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', backdropFilter: 'blur(3px)',
        zIndex: 300, display: 'flex', justifyContent: 'center', paddingTop: '14vh',
      }}>
        <div onClick={e => e.stopPropagation()} onKeyDown={onKey} style={{
          width: 580, maxWidth: 'calc(100vw - 32px)', alignSelf: 'flex-start',
          background: '#fff', borderRadius: 18, boxShadow: T.shadowPop, overflow: 'hidden',
          animation: 'aConfirmIn .18s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: `1px solid ${T.line}` }}>
            <UI.Icon name="search" size={18} color={T.faint} />
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search orders, products, customers, screens…"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15.5, background: 'transparent' }} />
            <UI.Kbd>esc</UI.Kbd>
          </div>

          <div style={{ maxHeight: '52vh', overflowY: 'auto', padding: results.length ? 8 : 0 }}>
            {q.trim() === '' && (
              <div style={{ padding: '26px 20px', fontSize: 13.5, color: T.faint, textAlign: 'center' }}>
                Try “silk”, an order number like “#3490”, a customer's name, or “reports”.
              </div>
            )}
            {q.trim() !== '' && results.length === 0 && (
              <UI.EmptyState title="Nothing found" hint={`No matches for "${q}" — even the quiet ones.`} icon="search" />
            )}
            {results.map((r, i) => (
              <div key={r.kind + r.title + i}
                onMouseEnter={() => setSel(i)} onClick={() => go(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 11, cursor: 'pointer',
                  background: sel === i ? T.accentSoft : 'transparent',
                }}>
                {r.color
                  ? <UI.Swatch color={r.color} size={30} />
                  : <div style={{
                      width: 30, height: 30, borderRadius: 9, background: 'rgba(10,10,10,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.sub,
                    }}><UI.Icon name={r.icon} size={15} /></div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: T.faint }}>{r.subtitle}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.kind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  window.AdminSearch = { SearchPalette };
})();
