// shop-app.jsx — ShopApp: orchestrates state and renders the current screen.
// Mobile website layout (header + footer + content), no app-style bottom bar.

function ShopApp({ themeId, cardStyle, heroLayout, checkoutFlow, tone, startScreen = 'home', welcomeTrigger = 0, frameless = false }) {
  const theme = THEMES[themeId];
  const [screen, setScreen] = React.useState(startScreen);
  const [params, setParams] = React.useState({});
  const [cart, setCart] = React.useState([{ id: 'hush-01', qty: 1 }, { id: 'halo', qty: 2 }]);
  const [orders, setOrders] = React.useState([]);
  const [lastOrder, setLastOrder] = React.useState(null);
  const [intent, setIntent] = React.useState({ forWho: [], vibe: [] });
  const [welcomeOpen, setWelcomeOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [favourites, setFavourites] = React.useState([]);
  const [gateAccepted, setGateAccepted] = React.useState(false);
  const [hasLeft, setHasLeft] = React.useState(false);
  const [consentDone, setConsentDone] = React.useState(false);
  const [consentReopen, setConsentReopen] = React.useState(false);
  React.useEffect(() => {
    window.__shhhOpenConsent = () => { setConsentReopen(true); setConsentDone(false); };
    window.__shhhNavLegal = (k) => nav('legal', { key: k });
  }, []);
  const [appliedPromo, setAppliedPromo] = React.useState(null);

  // Auto-apply promo from ?promo= URL param on load.
  React.useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('promo');
      if (p && typeof validatePromo === 'function') {
        const res = validatePromo(p);
        if (res.ok) setAppliedPromo({ code: res.code, ...res.promo });
      }
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    if (welcomeTrigger > 0) setWelcomeOpen(true);
  }, [welcomeTrigger]);

  React.useEffect(() => {
    setScreen(startScreen);
  }, [startScreen]);

  const nav = (s, p) => {
    setMenuOpen(false);
    setScreen(s); setParams(p || {});
    if (typeof updateSEO === 'function') {
      try { updateSEO(s, p || {}, 'lv'); } catch (e) {}
    }
  };

  // Inject site-wide structured data once + set initial page SEO.
  React.useEffect(() => {
    if (typeof injectGlobalSEO === 'function') injectGlobalSEO();
    if (typeof updateSEO === 'function') updateSEO('home', {}, 'lv');
  }, []);

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
    setCart(prev => prev
      .map(p => (p.key || p.id) === key ? { ...p, qty: p.qty + delta } : p)
      .filter(p => p.qty > 0));
  };

  const subtotal = React.useMemo(() => cart.reduce((s, i) => {
    if (i.id === 'gift') return s;
    const prod = PRODUCTS.find(p => p.id === i.id);
    return s + (prod ? prod.price * i.qty : 0);
  }, 0), [cart]);

  React.useEffect(() => {
    const hasGift = cart.some(c => c.id === 'gift');
    if (subtotal >= GIFT_THRESHOLD && !hasGift) {
      setCart(prev => [...prev, { id: 'gift', key: 'gift', qty: 1 }]);
    } else if (subtotal < GIFT_THRESHOLD && hasGift) {
      setCart(prev => prev.filter(c => c.id !== 'gift'));
    }
  }, [subtotal]);

  const toggleFavourite = (id) => {
    setFavourites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const quickBuy = (id, variant) => {
    addToCart(id, variant);
    setScreen('checkout');
    setParams({ mode: 'fast' });
  };

  const placeOrder = (payMethod) => {
    const items = cart;
    const total = items.reduce((s, i) => {
      const prod = i.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === i.id);
      return s + (prod ? prod.price * i.qty : 0);
    }, 0);
    const ref = ('SH' + Math.floor(Math.random() * 90000 + 10000));
    // Bank transfer (offline) → dedicated awaiting-transfer page with invoice + requisites.
    if (payMethod === 'transfer') {
      const order = { ref, items, total, status: 'Gaida apmaksu', payMethod, paid: false, transfer: true, details: window.__shhhCheckoutDetails || null };
      setLastOrder(order);
      setOrders(prev => [order, ...prev]);
      setCart([]);
      setScreen('transferConfirm');
      return;
    }
    // Banklink / BNPL redirect away — simulate a return WITHOUT completing payment
    // (~50% of the time) so the "awaiting payment" state is reachable.
    const pendingMethods = ['citadele', 'swedbank', 'seb', 'luminor', 'klix', 'inbank'];
    const isRedirect = pendingMethods.includes(payMethod);
    if (isRedirect && Math.random() < 0.5) {
      const order = { ref, items, total, status: 'Gaida apmaksu', payMethod, paid: false, details: window.__shhhCheckoutDetails || null };
      setLastOrder(order);
      setScreen('pending');
      return;
    }
    const order = { ref, items, total, status: 'Confirmed · arrives tomorrow', payMethod, paid: true };
    setLastOrder(order);
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setScreen('confirmation');
  };

  // Retry payment from the pending page → succeeds.
  const retryPayment = () => {
    setLastOrder(prev => {
      if (!prev) return prev;
      const done = { ...prev, status: 'Confirmed · arrives tomorrow', paid: true };
      setOrders(o => [done, ...o]);
      return done;
    });
    setCart([]);
    setScreen('confirmation');
  };

  const cancelPendingOrder = () => {
    setLastOrder(null);
    setScreen('cart');
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const favCount = favourites.length;
  // Expose active % promo globally so product cards can show discounted prices.
  if (typeof activePercent === 'function') window.__shhhPct = activePercent(appliedPromo);

  const onApplyIntent = (data) => {
    setIntent({ forWho: data.forWho || [], vibe: data.vibe || [] });
    setWelcomeOpen(false);
    nav('category', { cat: data.cat || 'all' });
  };

  const openWelcome = () => setWelcomeOpen(true);

  // Allow OrderLookupScreen to show the full confirmation page after paying.
  window.__shhhShowConfirmation = (order) => {
    setLastOrder({ ...order, fromLookup: true, paid: true });
    setScreen('confirmation');
  };

  const body = (
    <div style={frameless ? {
      // Real phone: grow with content so the DOCUMENT scrolls (this is what
      // lets iOS Safari collapse its toolbar). 'clip' blocks sideways drift
      // WITHOUT creating a scroll container, so the sticky header keeps
      // working (overflow:hidden would silently disable position:sticky).
      minHeight: '100dvh', background: theme.bg, color: theme.ink,
      fontFamily: theme.body, position: 'relative', overflowX: 'clip',
    } : {
      width: '100%', height: '100%',
      background: theme.bg, color: theme.ink,
      fontFamily: theme.body,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={frameless ? {
        // Flush to the top (browser owns the status-bar area); leave room at
        // the bottom for the fixed nav bar + the home-indicator safe area.
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
      } : {
        position: 'absolute', inset: 0, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingTop: 50, // clear the mock-up's fake status bar + dynamic island
      }}>
        <MobileHeader theme={theme} nav={nav}
          cartCount={cartCount} favCount={favCount}
          openMenu={() => setMenuOpen(true)}
          openWelcome={openWelcome}
          appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />

        <div>
          {screen === 'home' && (
            <HomeScreen theme={theme} nav={nav} tone={tone}
              heroLayout={heroLayout} cardStyle={cardStyle} intent={intent}
              subtotal={subtotal} openWelcome={openWelcome}
              favourites={favourites} toggleFavourite={toggleFavourite}
              quickBuy={quickBuy} />
          )}
          {screen === 'category' && (
            <CategoryScreen theme={theme} nav={nav} cardStyle={cardStyle} params={params}
              intent={intent} openWelcome={openWelcome}
              favourites={favourites} toggleFavourite={toggleFavourite}
              quickBuy={quickBuy} />
          )}
          {screen === 'search' && (
            <SearchScreen theme={theme} nav={nav}
              favourites={favourites} toggleFavourite={toggleFavourite}
              quickBuy={quickBuy} />
          )}
          {screen === 'product' && (
            <ProductScreen theme={theme} nav={nav} params={params} addToCart={addToCart}
              favourites={favourites} toggleFavourite={toggleFavourite}
              quickBuy={quickBuy} />
          )}
          {screen === 'cart' && (
            <CartScreen theme={theme} nav={nav} cart={cart} updateQty={updateQty}
              addToCart={addToCart} subtotal={subtotal}
              appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
          )}
          {screen === 'checkout' && (
            <CheckoutScreen theme={theme} nav={nav} cart={cart} subtotal={subtotal}
              checkoutFlow={checkoutFlow} tone={tone} onComplete={placeOrder}
              forceMode={params?.mode}
              appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
          )}
          {screen === 'pending' && (
            <PendingPaymentScreen theme={theme} nav={nav} lastOrder={lastOrder}
              onRetry={retryPayment} onCancel={cancelPendingOrder} />
          )}
          {screen === 'transferConfirm' && (
            <BankTransferScreen theme={theme} nav={nav} lastOrder={lastOrder} />
          )}
          {screen === 'confirmation' && lastOrder && (
            <ConfirmationScreen theme={theme} nav={nav} lastOrder={lastOrder} tone={tone} />
          )}
          {screen === 'confirmation' && !lastOrder && (
            <div style={{ padding: 40, fontFamily: theme.body, color: theme.inkSoft, textAlign: 'center' }}>
              No order yet — try checking out.
            </div>
          )}
          {screen === 'account' && (
            <AccountScreen theme={theme} nav={nav} orders={orders} params={params}
              favourites={favourites} toggleFavourite={toggleFavourite}
              quickBuy={quickBuy} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
          )}
          {screen === 'packaging' && (
            <PackagingScreen theme={theme} nav={nav} />
          )}
          {screen === 'legal' && (
            <LegalScreen theme={theme} nav={nav} params={params} />
          )}
          {screen === 'content' && (
            <ContentScreen theme={theme} nav={nav} params={params} />
          )}
          {screen === '404' && (
            <NotFoundScreen theme={theme} nav={nav} />
          )}
          {screen === 'catland' && (
            <CategoryLandingScreen theme={theme} nav={nav} params={params} />
          )}
          {screen === 'giftcard' && (
            <GiftCardScreen theme={theme} nav={nav} />
          )}
          {screen === 'sale' && (
            <SaleScreen theme={theme} nav={nav}
              favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
          )}
          {screen === 'occasion' && (
            <OccasionScreen theme={theme} nav={nav} params={params}
              favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />
          )}
          {screen === 'invoice' && (
            <InvoiceScreen theme={theme} nav={nav} />
          )}
          {screen === 'return-form' && (
            <ReturnFormScreen theme={theme} nav={nav} />
          )}
          {screen === 'cancel-order' && (
            <CancelOrderScreen theme={theme} nav={nav} />
          )}
        </div>

        <MobileFooter theme={theme} nav={nav} />
      </div>

      {screen !== 'checkout' && (
        <BottomBar theme={theme} current={screen} onNav={nav} cartCount={cartCount} frameless={frameless} />
      )}

      <MobileMenu theme={theme} open={menuOpen}
        onClose={() => setMenuOpen(false)} nav={nav}
        openWelcome={openWelcome} favCount={favCount} frameless={frameless} />

      <WelcomeModal theme={theme} open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        onApply={onApplyIntent} frameless={frameless} />

      {/* Cookie consent — small banner, shown once on entry */}
      {typeof ConsentBanner === 'function' && (
        <ConsentBanner theme={theme}
          open={!consentDone}
          forceCustomize={consentReopen}
          frameless={frameless}
          onClose={() => { setConsentDone(true); setConsentReopen(false); }} />
      )}
    </div>
  );

  return (
    <LangProvider>
      {frameless ? (
        // Real mobile site: render in normal document flow so the page itself
        // scrolls (lets iOS Safari collapse its toolbar). body grows with content.
        body
      ) : (
        <IOSDevice width={402} height={874} dark={false}>
          {body}
        </IOSDevice>
      )}
    </LangProvider>
  );
}

window.ShopApp = ShopApp;
