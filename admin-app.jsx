/* Shhh Admin — root component: routing, global shortcuts, overlays. */

(function () {
  const { useState, useEffect } = React;
  const UI = window.AdminUI;

  const SCREENS = {
    dashboard: () => <AdminScreens.Dashboard />,
    orders:    () => <AdminScreens.Orders />,
    order:     (params) => <AdminScreens.Order params={params} />,
    products:  () => <AdminScreens.Products />,
    product:   (params) => <AdminScreens.Product params={params} />,
    customers: () => <AdminScreens.Customers />,
    customer:  (params) => <AdminScreens.Customer params={params} />,
    discounts: () => <AdminScreens.Discounts />,
    reports:   () => <AdminScreens.Reports />,
    finances:  () => <AdminScreens.Finances />,
    cms:       () => <AdminScreens.Cms />,
    settings:  () => <AdminScreens.Settings />,
  };

  function AdminApp() {
    const [route, setRoute] = useState({ screen: 'dashboard', params: {} });
    const [searchOpen, setSearchOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [devtoolsOpen, setDevtoolsOpen] = useState(false);

    const nav = {
      route,
      navigate: (screen, params) => {
        setRoute({ screen, params: params || {} });
        window.scrollTo(0, 0);
      },
      openSearch: () => setSearchOpen(true),
      openHelp: () => setHelpOpen(true),
      openReport: () => setReportOpen(true),
      toggleDevtools: () => setDevtoolsOpen(v => !v),
    };

    // global shortcuts: ⌘K / Ctrl+K search, Ctrl+` devtools, ? help
    useEffect(() => {
      const onKey = (e) => {
        const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setSearchOpen(v => !v);
        } else if (e.ctrlKey && e.key === '`') {
          e.preventDefault();
          setDevtoolsOpen(v => !v);
        } else if (e.key === '?' && !typing) {
          setHelpOpen(true);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    const render = SCREENS[route.screen] || SCREENS.dashboard;

    return (
      <window.AdminNav.Provider value={nav}>
        <AdminViews.Shell>
          {render(route.params)}
        </AdminViews.Shell>

        {searchOpen && <AdminSearch.SearchPalette onClose={() => setSearchOpen(false)} />}
        {helpOpen && <AdminHelp.HelpDrawer onClose={() => setHelpOpen(false)} />}
        {reportOpen && <AdminReport.ReportIssueModal route={route} onClose={() => setReportOpen(false)} />}
        {devtoolsOpen && <AdminDevtools.DevtoolsPanel route={route} onClose={() => setDevtoolsOpen(false)} />}
        <UI.ToastHost />
      </window.AdminNav.Provider>
    );
  }

  window.AdminApp = AdminApp;
})();
