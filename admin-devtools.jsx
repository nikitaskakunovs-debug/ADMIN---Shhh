/* Shhh Admin — developer panel (Ctrl+` or the terminal icon in the topbar).
   Inspect route/data state and reset local preferences. */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function Row({ k, v }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '3px 0' }}>
        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{k}</span>
        <span style={{ color: '#9EF2B8' }}>{v}</span>
      </div>
    );
  }

  function DevtoolsPanel({ route, onClose }) {
    const [tab, setTab] = useState('state');

    const copyState = () => {
      const snapshot = {
        route,
        counts: {
          products: SHOP_DATA.products.length,
          orders: D.orders.length,
          customers: D.customers.length,
          promos: SHOP_PROMO.promos.length,
          pages: SHOP_CONTENT.pages.length,
        },
        kpis: D.kpis(),
        prefs: { dashLayout: D.prefs.get('dash-layout', null) },
      };
      const text = JSON.stringify(snapshot, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => UI.toast('State copied to clipboard'),
          () => UI.toast('Clipboard unavailable — logged to console', 'danger'));
      }
      console.log('[shhh-admin] state snapshot', snapshot);
    };

    const k = D.kpis();
    const mono = { fontFamily: T.mono, fontSize: 12 };

    return (
      <div style={{
        position: 'fixed', right: 18, bottom: 18, width: 320, zIndex: 350,
        background: '#101014', color: '#E8E8E8', borderRadius: 16,
        boxShadow: T.shadowPop, overflow: 'hidden', animation: 'aConfirmIn .18s ease',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <UI.Icon name="terminal" size={15} color="#9EF2B8" />
          <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>Devtools</span>
          {['state', 'actions'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              border: 'none', cursor: 'pointer', borderRadius: 7, padding: '3px 10px', fontSize: 11.5, fontWeight: 700,
              background: tab === t ? 'rgba(255,255,255,0.14)' : 'transparent', color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>{t}</button>
          ))}
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 2 }}>
            <UI.Icon name="x" size={14} />
          </button>
        </div>

        <div style={{ padding: '12px 14px', ...mono }}>
          {tab === 'state' && (
            <div>
              <Row k="route" v={route.screen + (route.params && route.params.id ? ' · ' + route.params.id : '')} />
              <Row k="products" v={SHOP_DATA.products.length} />
              <Row k="orders" v={D.orders.length} />
              <Row k="customers" v={D.customers.length} />
              <Row k="promos" v={SHOP_PROMO.promos.length} />
              <Row k="revenue30" v={D.money(k.revenue30)} />
              <Row k="pending" v={k.pendingCount} />
              <Row k="react" v={React.version} />
              <Row k="clock (frozen)" v={new Date(D.NOW).toISOString().slice(0, 16).replace('T', ' ')} />
            </div>
          )}
          {tab === 'actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <DevButton label="Copy state snapshot" onClick={copyState} />
              <DevButton label="Log orders to console" onClick={() => { console.table(D.orders.slice(0, 20).map(o => ({ id: o.id, customer: o.customerName, status: o.status, total: o.total }))); UI.toast('First 20 orders logged'); }} />
              <DevButton label="Reset dashboard layout" onClick={() => { D.prefs.set('dash-layout', null); UI.toast('Layout reset — open the dashboard'); }} />
              <DevButton label="Clear prefs & reload" danger onClick={() => { D.prefs.clearAll(); location.reload(); }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  function DevButton({ label, onClick, danger }) {
    return (
      <button onClick={onClick} style={{
        textAlign: 'left', padding: '8px 11px', borderRadius: 9, cursor: 'pointer', fontSize: 12,
        fontFamily: "'Geist Mono', monospace", fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.1)',
        background: danger ? 'rgba(229,72,77,0.16)' : 'rgba(255,255,255,0.05)',
        color: danger ? '#FF9CA0' : '#E8E8E8',
      }}>{label}</button>
    );
  }

  window.AdminDevtools = { DevtoolsPanel };
})();
