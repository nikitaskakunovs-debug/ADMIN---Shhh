/* Shhh Admin — application chrome: navigation context, sidebar, topbar,
   page scaffold. Screens consume AdminNav to navigate. */

(function () {
  const { useState, useContext } = React;
  const UI = window.AdminUI, T = UI.T;

  // navigate(screen, params) + route { screen, params } + UI panel toggles
  window.AdminNav = React.createContext(null);
  const useNav = () => useContext(window.AdminNav);
  window.useAdminNav = useNav;

  const NAV = [
    { group: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    ]},
    { group: 'Sales', items: [
      { id: 'orders', label: 'Orders', icon: 'orders', badge: () => AdminData.kpis().pendingCount },
      { id: 'customers', label: 'Customers', icon: 'customers' },
      { id: 'discounts', label: 'Discounts', icon: 'discounts' },
    ]},
    { group: 'Catalog', items: [
      { id: 'products', label: 'Products', icon: 'products' },
    ]},
    { group: 'Insights', items: [
      { id: 'reports', label: 'Reports', icon: 'reports' },
      { id: 'finances', label: 'Finances', icon: 'finances' },
    ]},
    { group: 'Store', items: [
      { id: 'cms', label: 'Content', icon: 'cms' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ]},
  ];
  // screens that highlight a parent nav item
  const NAV_ALIAS = { order: 'orders', product: 'products', customer: 'customers' };

  function NavItem({ item, active, onClick }) {
    const [hover, setHover] = useState(false);
    const badge = item.badge ? item.badge() : null;
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left',
          padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          fontSize: 13.5, fontWeight: active ? 700 : 500,
          color: active ? T.ink : T.sub,
          background: active ? '#fff' : hover ? 'rgba(10,10,10,0.04)' : 'transparent',
          boxShadow: active ? UI.T.shadow : 'none', transition: 'background .12s ease',
        }}>
        <UI.Icon name={item.icon} size={16} color={active ? T.accent : 'currentColor'} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {badge ? (
          <span style={{
            fontSize: 11, fontWeight: 700, background: T.accentSoft, color: T.accent,
            borderRadius: 99, padding: '1px 7px',
          }}>{badge}</span>
        ) : null}
      </button>
    );
  }

  function Sidebar() {
    const nav = useNav();
    const current = NAV_ALIAS[nav.route.screen] || nav.route.screen;
    return (
      <aside style={{
        width: 232, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        display: 'flex', flexDirection: 'column', padding: '18px 14px',
        borderRight: `1px solid ${T.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 10px 18px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: T.ink, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15,
          }}>S</div>
          <div>
            <div className="shhh-grad-text" style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>Shhh</div>
            <div style={{ fontSize: 10.5, color: T.faint, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {NAV.map(g => (
            <div key={g.group} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 12px 6px' }}>{g.group}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {g.items.map(item => (
                  <NavItem key={item.id} item={item} active={current === item.id}
                    onClick={() => nav.navigate(item.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavItem item={{ id: 'help', label: 'Help & guides', icon: 'help' }} active={false} onClick={() => nav.openHelp()} />
          <NavItem item={{ id: 'report', label: 'Report a problem', icon: 'bug' }} active={false} onClick={() => nav.openReport()} />
        </div>
      </aside>
    );
  }

  function Topbar() {
    const nav = useNav();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return (
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
        padding: '14px 28px', position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(244,244,242,0.85)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${T.line}`,
      }}>
        <button onClick={() => nav.openSearch()} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: 340, maxWidth: '40vw',
          padding: '8px 14px', borderRadius: 12, border: `1px solid ${T.lineStrong}`,
          background: '#fff', cursor: 'pointer', color: T.faint, fontSize: 13.5,
        }}>
          <UI.Icon name="search" size={15} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search orders, products, customers…</span>
          <UI.Kbd>{isMac ? '⌘' : 'Ctrl'} K</UI.Kbd>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <UI.Button variant="ghost" size="sm" icon="eye" onClick={() => UI.toast('Storefront preview is not wired in this demo', 'danger')}>
            View store
          </UI.Button>
          <UI.IconButton icon="terminal" title="Devtools (Ctrl+`)" onClick={() => nav.toggleDevtools()} />
          <UI.IconButton icon="help" title="Help" onClick={() => nav.openHelp()} />
          <div style={{ width: 1, height: 24, background: T.line, margin: '0 6px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <UI.Avatar name="Nikita S" size={32} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Nikita</div>
              <div style={{ fontSize: 11, color: T.faint }}>Owner</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  /* Page scaffold: title row + content, consistent paddings across screens. */
  function Page({ title, description, actions, children, backTo, backLabel }) {
    const nav = useNav();
    return (
      <div style={{ padding: '26px 28px 60px', maxWidth: 1240, margin: '0 auto' }}>
        {backTo && (
          <button onClick={() => nav.navigate(backTo)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent',
            color: T.sub, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 10,
          }}>
            <UI.Icon name="arrowLeft" size={14} /> {backLabel || 'Back'}
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h1>
            {description && <div style={{ color: T.sub, fontSize: 14, marginTop: 4 }}>{description}</div>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
        </div>
        {children}
      </div>
    );
  }

  function Shell({ children }) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </div>
    );
  }

  window.AdminViews = { Shell, Sidebar, Topbar, Page, NAV };
})();
