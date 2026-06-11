// desktop-app.jsx — top-level app, state, router (desktop).
// Wraps everything in LangProvider (default LV) and reuses the mobile
// data/logic + content screens, with desktop layout for the core flow.

// The bundled product photos (hush-01 / glow / halo) ship with a baked-in
// transparency checkerboard (broken source assets), so on desktop we drop the
// image refs and let every surface render the clean monochrome studio blob.
// This only affects the desktop page load — the mobile prototype is untouched.
try { (window.PRODUCTS || []).forEach(p => { if (p.image) delete p.image; }); } catch (e) {}

const D_CONTENT_SCREENS = [
  'content', 'legal', 'catland', 'giftcard', 'sale', 'occasion',
  'brands', 'lookup', 'invoice', 'return-form', 'cancel-order',
];

function DApp() {
  return (
    <LangProvider>
      <DAppInner />
    </LangProvider>
  );
}

function DAppInner() {
  const [screen, setScreen] = React.useState('home');
  const [params, setParams] = React.useState({});
  const [cart, setCart] = React.useState([{ id: 'hush-01', qty: 1 }, { id: 'halo', qty: 2 }]);
  const [orders, setOrders] = React.useState([]);
  const [lastOrder, setLastOrder] = React.useState(null);
  const [intent, setIntent] = React.useState({ forWho: [], vibe: [] });
  const [welcomeOpen, setWelcomeOpen] = React.useState(false);
  const [favourites, setFavourites] = React.useState([]);
  const [appliedPromo, setAppliedPromo] = React.useState(null);
  const [consentDone, setConsentDone] = React.useState(false);
  const [consentReopen, setConsentReopen] = React.useState(false);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [screen, params?.id, params?.key]);

  // nav() accepts both desktop names and the mobile content screens' names.
  const nav = (s, p) => {
    let target = s;
    if (s === 'category') target = 'browse';
    else if (s === 'product') target = 'pdp';
    setScreen(target);
    setParams(p || {});
    if (typeof updateSEO === 'function') {
      try { updateSEO(s, p || {}, window.__shhhLang || 'lv'); } catch (e) {}
    }
  };

  // Cross-cutting hooks the reused modules expect.
  React.useEffect(() => {
    window.__shhhOpenConsent = () => { setConsentReopen(true); setConsentDone(false); };
    window.__shhhNavLegal = (k) => nav('legal', { key: k });
    window.__shhhShowConfirmation = (order) => {
      setLastOrder({ ...order, fromLookup: true, paid: true });
      setScreen('confirmation');
    };
    if (typeof injectGlobalSEO === 'function') injectGlobalSEO();
    if (typeof updateSEO === 'function') updateSEO('home', {}, 'lv');
    window.__shhhLang = window.__shhhLang || 'lv';
    const onLang = (e) => { window.__shhhLang = e.detail || 'lv'; };
    window.addEventListener('shhh-lang-change', onLang);
    // Auto-apply ?promo=
    try {
      const p = new URLSearchParams(window.location.search).get('promo');
      if (p && typeof validatePromo === 'function') {
        const res = validatePromo(p);
        if (res.ok) setAppliedPromo({ code: res.code, ...res.promo });
      }
    } catch (e) {}
  }, []);

  const openWelcome = () => setWelcomeOpen(true);

  const addToCart = (id, variant) => {
    const colour = variant?.colour ?? null;
    const size = variant?.size ?? null;
    const key = id + (colour ? '|' + colour : '') + (size ? '|' + size : '');
    setCart(prev => {
      const ex = prev.find(p => (p.key || p.id) === key);
      if (ex) return prev.map(p => (p.key || p.id) === key ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id, key, colour, size, qty: 1 }];
    });
  };
  const updateQty = (key, delta) => {
    setCart(prev => prev.map(p => (p.key || p.id) === key ? { ...p, qty: p.qty + delta } : p).filter(p => p.qty > 0));
  };
  const toggleFavourite = (id) => {
    setFavourites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const quickBuy = (id, variant) => {
    addToCart(id, variant);
    setScreen('checkout');
    setParams({ mode: 'fast' });
  };

  const subtotal = React.useMemo(() => cart.reduce((s, i) => {
    if (i.id === 'gift') return s;
    const prod = PRODUCTS.find(p => p.id === i.id);
    return s + (prod ? prod.price * i.qty : 0);
  }, 0), [cart]);

  React.useEffect(() => {
    const hasGift = cart.some(c => c.id === 'gift');
    if (subtotal >= GIFT_THRESHOLD && !hasGift) setCart(prev => [...prev, { id: 'gift', key: 'gift', qty: 1 }]);
    else if (subtotal < GIFT_THRESHOLD && hasGift) setCart(prev => prev.filter(c => c.id !== 'gift'));
  }, [subtotal]);

  // Expose active % promo so cards/PDP can show discounted prices.
  if (typeof activePercent === 'function') window.__shhhPct = activePercent(appliedPromo);

  const orderTotal = (items) => {
    const goods = items.reduce((s, i) => {
      const prod = i.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === i.id);
      return s + (prod ? prod.price * i.qty : 0);
    }, 0);
    const baseShip = goods > 60 ? 0 : 6;
    let pd = {};
    if (typeof promoDiscount === 'function' && appliedPromo) {
      try { pd = promoDiscount(appliedPromo, goods, baseShip) || {}; } catch (e) {}
    }
    const shipping = (goods > 60 || pd.freeShipping) ? 0 : 6;
    return Math.max(0, goods - (pd.discount || 0) + shipping);
  };

  const placeOrder = (payMethod) => {
    const items = cart;
    const total = orderTotal(items);
    const ref = ('SH' + Math.floor(Math.random() * 90000 + 10000));
    if (payMethod === 'transfer') {
      const order = { ref, items, total, status: 'Gaida apmaksu', payMethod, paid: false, transfer: true };
      setLastOrder(order);
      setOrders(prev => [order, ...prev]);
      window.__shhhLastTransferOrder = order;
      setCart([]);
      setScreen('transferConfirm');
      return;
    }
    const pendingMethods = ['citadele', 'swedbank', 'seb', 'luminor', 'klix', 'inbank'];
    if (pendingMethods.includes(payMethod) && Math.random() < 0.5) {
      const order = { ref, items, total, status: 'Gaida apmaksu', payMethod, paid: false };
      setLastOrder(order);
      setScreen('pending');
      return;
    }
    const order = { ref, items, total, status: 'Confirmed · arrives tomorrow', payMethod, paid: true };
    setLastOrder(order);
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setAppliedPromo(null);
    setScreen('confirmation');
  };

  const retryPayment = () => {
    setLastOrder(prev => {
      if (!prev) return prev;
      const done = { ...prev, status: 'Confirmed · arrives tomorrow', paid: true };
      setOrders(o => [done, ...o]);
      return done;
    });
    setCart([]);
    setAppliedPromo(null);
    setScreen('confirmation');
  };
  const cancelPendingOrder = () => { setLastOrder(null); setScreen('cart'); };

  const onApplyIntent = (data) => {
    setIntent({ forWho: data.forWho || [], vibe: data.vibe || [] });
    setWelcomeOpen(false);
    nav('browse', { cat: data.cat || 'all' });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const favCount = favourites.length;
  const isContent = D_CONTENT_SCREENS.includes(screen);

  return (
    <div style={{ background: DT.bg, color: DT.ink, minHeight: '100vh', fontFamily: DT.body }}>
      {typeof AnnouncementBar === 'function' && (
        <AnnouncementBar theme={DTHEME} appliedPromo={appliedPromo}
          onApply={(p) => setAppliedPromo && setAppliedPromo(p)} />
      )}
      <TopNav nav={nav} current={screen}
        cartCount={cartCount} favCount={favCount} openWelcome={openWelcome} />

      {screen === 'home' && (
        <DHome nav={nav} subtotal={subtotal} intent={intent} openWelcome={openWelcome}
          favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
      )}
      {screen === 'browse' && (
        <DBrowse nav={nav} params={params}
          favourites={favourites} toggleFavourite={toggleFavourite}
          quickBuy={quickBuy} openWelcome={openWelcome} />
      )}
      {screen === 'search' && (
        <DSearch nav={nav} params={params}
          favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
      )}
      {screen === 'pdp' && (
        <DPDP nav={nav} params={params} addToCart={addToCart}
          favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
      )}
      {screen === 'cart' && (
        <DCart nav={nav} cart={cart} updateQty={updateQty}
          addToCart={addToCart} subtotal={subtotal}
          appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
      )}
      {screen === 'checkout' && (
        <DCheckout nav={nav} cart={cart} subtotal={subtotal} onComplete={placeOrder}
          forceMode={params?.mode}
          appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
      )}
      {screen === 'pending' && (
        <DPending nav={nav} lastOrder={lastOrder} onRetry={retryPayment} onCancel={cancelPendingOrder} />
      )}
      {screen === 'transferConfirm' && typeof BankTransferScreen === 'function' && (
        <DContentFrame width={900}><BankTransferScreen theme={DTHEME} nav={nav} lastOrder={lastOrder} /></DContentFrame>
      )}
      {screen === 'confirmation' && (
        <DConfirmation nav={nav} lastOrder={lastOrder} />
      )}
      {screen === 'account' && (
        <DAccount nav={nav} params={params} orders={orders}
          favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
      )}
      {screen === 'packaging' && (
        <DPackaging nav={nav} />
      )}
      {screen === '404' && typeof NotFoundScreen === 'function' && (
        <DContentFrame width={760}><NotFoundScreen theme={DTHEME} nav={nav} /></DContentFrame>
      )}
      {isContent && (
        <DContentHost screen={screen} params={params} nav={nav}
          favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
      )}

      <DFooter nav={nav} />

      <DWelcomeModal open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)} onApply={onApplyIntent} />

      {typeof ConsentBanner === 'function' && (
        <ConsentBanner theme={DTHEME}
          open={!consentDone}
          forceCustomize={consentReopen}
          onClose={() => { setConsentDone(true); setConsentReopen(false); }} />
      )}
    </div>
  );
}

window.DApp = DApp;
