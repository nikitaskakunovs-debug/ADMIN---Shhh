// desktop-screens-4.jsx — Search, Pending payment, and the host that mounts
// the reused mobile content/brand/legal/giftcard/order-lookup screens in a
// desktop column. The heavy content + logic comes straight from the mobile
// modules (shop-content, shop-brands, shop-invoice, shop-returns, shop-cancel,
// shop-chrome LegalScreen) — only the surrounding layout is desktop.

// ─────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────
function DSearch({ nav, params, favourites, toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const [q, setQ] = React.useState(params?.q || '');
  React.useEffect(() => { setQ(params?.q || ''); }, [params?.q]);
  const isFav = (id) => (favourites || []).includes(id);

  const query = q.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!query) return [];
    return PRODUCTS.filter(p => [
      p.name, p.ptype, p.brand, p.tagline, p.category, p.material,
    ].filter(Boolean).some(v => v.toLowerCase().includes(query)));
  }, [query]);

  const suggestions = ['Satisfyer', 'We-Vibe', 'LELO', 'couples', 'beginners', 'waterproof', 'quiet'];

  return (
    <main>
      <Section>
        <Container>
          <div style={{ padding: '40px 0 20px' }}>
            <div style={{
              fontFamily: DT.body, fontSize: 12, fontWeight: 700,
              letterSpacing: DT.lc, textTransform: 'uppercase',
              color: DT.inkSoft, marginBottom: 10,
            }}>{t('search.title', 'Search')}</div>
            <form onSubmit={(e) => { e.preventDefault(); }} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              height: 64, padding: '0 22px', borderRadius: 999,
              background: DT.surfaceAlt, maxWidth: 720,
            }}>
              <DIcon name="search" size={22} color={DT.inkSoft} />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)}
                placeholder={t('nav.search', 'Search the catalogue…')} style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontFamily: DT.display, fontSize: 24, fontWeight: 600, color: DT.ink,
                letterSpacing: DT.ld,
              }} />
              {q && (
                <button type="button" onClick={() => setQ('')} style={{
                  all: 'unset', cursor: 'pointer', color: DT.inkSoft,
                }}><DIcon name="close" size={20} /></button>
              )}
            </form>
            {!query && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
                {suggestions.map(s => (
                  <DPill key={s} onClick={() => setQ(s)}>{s}</DPill>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '8px 0 80px' }}>
            {query && (
              <div style={{
                fontFamily: DT.body, fontSize: 14, color: DT.inkSoft, marginBottom: 24,
              }}>{results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”</div>
            )}
            {query && results.length === 0 ? (
              <div style={{
                padding: 60, textAlign: 'center', borderRadius: DT.radius,
                border: `1.5px dashed ${DT.rule}`, maxWidth: 560,
              }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>🫥</div>
                <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 16, color: DT.ink, marginBottom: 6 }}>
                  Nothing found.
                </div>
                <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginBottom: 18 }}>
                  Try a brand, a category, or browse everything.
                </div>
                <PrimaryBtn onClick={() => nav('browse', { cat: 'all' })}>Browse the shop</PrimaryBtn>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {results.map(p => (
                  <DProductCard key={p.id} product={p}
                    onClick={() => nav('pdp', { id: p.id })}
                    isFavourite={isFav(p.id)}
                    onFavourite={toggleFavourite}
                    onQuickBuy={quickBuy} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// PENDING PAYMENT — banklink/BNPL started but not finished
// ─────────────────────────────────────────────────────────────
function DPending({ nav, lastOrder, onRetry, onCancel }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  if (!lastOrder) {
    return (
      <main><Section><Container>
        <div style={{ padding: '120px 0', textAlign: 'center', fontFamily: DT.body, color: DT.inkSoft }}>
          No pending order.
        </div>
      </Container></Section></main>
    );
  }
  const method = (PAYMENT_METHODS || []).find(m => m.id === lastOrder.payMethod);
  return (
    <main>
      <Section>
        <Container>
          <div style={{
            padding: '64px 0',
            display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'flex-start',
          }}>
            <div>
              <div style={{
                width: 80, height: 80, borderRadius: 999, marginBottom: 28,
                background: '#FBE9A8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 38,
              }}>⏳</div>
              <div style={{
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                letterSpacing: DT.lc, textTransform: 'uppercase',
                color: DT.inkSoft, marginBottom: 14,
              }}>Gaida apmaksu · Awaiting payment</div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 64,
                letterSpacing: DT.ld, lineHeight: 0.95, margin: '0 0 18px',
              }}>Almost there.</h1>
              <p style={{
                fontFamily: DT.body, fontSize: 17, color: DT.inkSoft, lineHeight: 1.55,
                margin: '0 0 28px', maxWidth: 480,
              }}>
                You came back from {method ? method.name : 'the bank'} before the payment confirmed.
                Your bag is held. Finish the payment to lock in next-day delivery, or cancel and
                return to your bag.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <PrimaryBtn size="lg" onClick={onRetry}>
                  Retry payment · €{lastOrder.total.toFixed(2)}
                </PrimaryBtn>
                <GhostBtn size="lg" onClick={onCancel}>Cancel & edit bag</GhostBtn>
              </div>
            </div>
            <div style={{
              padding: 24, borderRadius: DT.radius,
              background: DT.surface, border: `1px solid ${DT.rule}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <h3 style={{
                  fontFamily: DT.display, fontWeight: 800, fontSize: 22, letterSpacing: DT.ld, margin: 0,
                }}>Order {lastOrder.ref ? '#SH-' + String(lastOrder.ref).replace(/^SH-?/, '') : ''}</h3>
                <span style={{
                  fontFamily: DT.body, fontSize: 11, fontWeight: 700, padding: '4px 10px',
                  borderRadius: 999, background: '#FBE9A8', color: '#7A5A00',
                }}>Pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Status', 'Awaiting bank confirmation'],
                  ['Method', method ? method.name : '—'],
                  ['Total', '€' + lastOrder.total.toFixed(2)],
                  ['Billed as', 'NL Trading Co'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft }}>{l}</span>
                    <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.ink, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 16, padding: '10px 12px', borderRadius: DT.radiusSm,
                background: DT.surfaceAlt, fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, lineHeight: 1.4,
              }}>
                No money has left your account until the bank confirms. Pending orders auto-cancel after 24 h.
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTENT HOST — dispatch reused mobile screens into a desktop column
// ─────────────────────────────────────────────────────────────
function DContentHost({ screen, params, nav, favourites, toggleFavourite, quickBuy }) {
  const theme = DTHEME;
  // Wide screens get more room; reading/legal/forms stay in a tighter column.
  const wide = ['sale', 'brands', 'catland', 'occasion'].includes(screen);

  let inner = null;
  if (screen === 'content' && typeof ContentScreen === 'function') {
    inner = <ContentScreen theme={theme} nav={nav} params={params} />;
  } else if (screen === 'legal' && typeof LegalScreen === 'function') {
    inner = <LegalScreen theme={theme} nav={nav} params={params} />;
  } else if (screen === 'catland' && typeof CategoryLandingScreen === 'function') {
    inner = <CategoryLandingScreen theme={theme} nav={nav} params={params} />;
  } else if (screen === 'giftcard' && typeof GiftCardScreen === 'function') {
    inner = <GiftCardScreen theme={theme} nav={nav} />;
  } else if (screen === 'sale' && typeof SaleScreen === 'function') {
    inner = <SaleScreen theme={theme} nav={nav}
      favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />;
  } else if (screen === 'occasion' && typeof OccasionScreen === 'function') {
    inner = <OccasionScreen theme={theme} nav={nav} params={params}
      favourites={favourites} toggleFavourite={toggleFavourite} quickBuy={quickBuy} />;
  } else if (screen === 'brands' && typeof BrandsIndexScreen === 'function') {
    inner = <BrandsIndexScreen theme={theme} nav={nav} />;
  } else if (screen === 'lookup' && typeof OrderLookupScreen === 'function') {
    inner = <OrderLookupScreen theme={theme} nav={nav} />;
  } else if (screen === 'invoice' && typeof InvoiceScreen === 'function') {
    inner = <InvoiceScreen theme={theme} nav={nav} />;
  } else if (screen === 'return-form' && typeof ReturnFormScreen === 'function') {
    inner = <ReturnFormScreen theme={theme} nav={nav} />;
  } else if (screen === 'cancel-order' && typeof CancelOrderScreen === 'function') {
    inner = <CancelOrderScreen theme={theme} nav={nav} />;
  } else if (screen === 'transferConfirm' && typeof BankTransferScreen === 'function') {
    inner = <BankTransferScreen theme={theme} nav={nav} lastOrder={window.__shhhLastTransferOrder} />;
  } else {
    inner = (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: DT.body, color: DT.inkSoft }}>
        This page is not available.
      </div>
    );
  }

  return <DContentFrame width={wide ? 1180 : 900}>{inner}</DContentFrame>;
}

Object.assign(window, { DSearch, DPending, DContentHost });
