// shop-screens-2.jsx — Checkout, Confirmation, Account, Packaging info

// ─────────────────────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────────────────────
function CheckoutScreen({ theme, nav, cart, subtotal: subtotalProp, checkoutFlow, tone, onComplete, forceMode, appliedPromo, setAppliedPromo }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const items = cart.map(c => ({
    ...c,
    product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const subtotal = subtotalProp != null
    ? subtotalProp
    : items.reduce((s, i) => s + (i.id === 'gift' ? 0 : i.product.price * i.qty), 0);
  const [mode, setMode] = React.useState(forceMode || (checkoutFlow === 'single' ? 'fast' : 'standard'));
  const [step, setStep] = React.useState(1);
  const [contact, setContact] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [courier, setCourier] = React.useState('omniva');
  const [location, setLocation] = React.useState('omn-riga-1');
  const [address, setAddress] = React.useState({ line1: '', city: '', postal: '' });
  const [paymethod, setPaymethod] = React.useState('apple');

  // Keep entered contact + delivery info available to the order so a
  // "Gaida apmaksu" order remembers it (name, email, courier, locker).
  React.useEffect(() => {
    const courierObj = (window.COURIERS || []).find(c => c.id === courier);
    const loc = courierObj && courierObj.locations ? courierObj.locations.find(l => l.id === location) : null;
    window.__shhhCheckoutDetails = {
      name: name || '', email: contact || '', phone: phone || '',
      courier: courierObj ? courierObj.name : '',
      courierType: courierObj ? courierObj.type : '',
      location: loc ? loc.name : (courierObj && courierObj.type === 'door' ? 'Durvju piegāde' : ''),
      address: address.line1 ? `${address.line1}, ${address.city} ${address.postal}` : '',
    };
  }, [name, contact, phone, courier, location, address]);
  const [bnplMonths, setBnplMonths] = React.useState(12);
  const [bnplInfo, setBnplInfo] = React.useState(null);
  const [pseudoSender, setPseudoSender] = React.useState('nl');
  const [savingsOpen, setSavingsOpen] = React.useState(false);
  const copy = DISCRETION_COPY[tone] || DISCRETION_COPY.playful;
  const courierObj = COURIERS.find(c => c.id === courier) || COURIERS[0];
  const baseShip = subtotal > 60 ? 0 : courierObj.price;
  const pd = (typeof promoDiscount === 'function' && appliedPromo)
    ? promoDiscount(appliedPromo, subtotal, baseShip)
    : { discount: 0, freeShipping: false };
  const shipping = pd.freeShipping ? 0 : baseShip;
  const grossTotal = Math.max(0, subtotal - pd.discount + shipping);
  const [giftCode, setGiftCode] = React.useState('');
  const [giftCard, setGiftCard] = React.useState(null); // { code, balance }
  const [giftErr, setGiftErr] = React.useState('');
  const giftApplied = giftCard ? Math.min(giftCard.balance, grossTotal) : 0;
  const total = Math.max(0, grossTotal - giftApplied);
  const giftRemaining = giftCard ? Math.max(0, giftCard.balance - giftApplied) : 0;

  const applyGift = () => {
    const code = giftCode.trim().toUpperCase();
    const live = window.SHHH_LIVE;
    if (live && live.status !== 'fallback') {
      // Real balance from the database (the server re-checks at order time too).
      live.checkGiftCard(code).then(r => {
        if (!r || !r.ok) { setGiftErr(t('ck.invalidCode', 'Nederīgs vai neeksistējošs kods')); setGiftCard(null); return; }
        setGiftErr('');
        setGiftCard({ code: r.code, balance: Number(r.balance), initial: Number(r.initial) });
      }).catch(() => { setGiftErr(t('ck.invalidCode', 'Nederīgs vai neeksistējošs kods')); setGiftCard(null); });
      return;
    }
    const card = (window.GIFT_CARDS || {})[code];
    if (!card) { setGiftErr(t('ck.invalidCode', 'Nederīgs vai neeksistējošs kods')); setGiftCard(null); return; }
    if (card.balance <= 0) { setGiftErr('Šai kartei nav atlikuma'); setGiftCard(null); return; }
    setGiftErr('');
    setGiftCard({ code, balance: card.balance, initial: card.initial });
  };
  // Expose the applied card so the order submission can settle it server-side.
  React.useEffect(() => { window.__shhhGiftCard = giftCard ? { code: giftCard.code } : null; }, [giftCard]);

  // ── Marketing tracking (no PII): totals snapshot + funnel events ──
  React.useEffect(() => {
    window.__shhhCheckoutTotals = { subtotal, shipping, discount: pd.discount || 0, gift: giftApplied, total };
  }, [subtotal, shipping, pd.discount, giftApplied, total]);
  const trackedStart = React.useRef(false);
  React.useEffect(() => {
    if (trackedStart.current || !window.SHHH_TRACK) return;
    trackedStart.current = true;
    window.SHHH_TRACK.checkoutStarted(cart, { subtotal, shipping, discount: pd.discount || 0, total });
  }, []);
  const firstCourier = React.useRef(true);
  React.useEffect(() => {
    if (firstCourier.current) { firstCourier.current = false; return; }
    if (window.SHHH_TRACK) window.SHHH_TRACK.deliverySelected(courierObj, shipping);
  }, [courier]);
  const firstPay = React.useRef(true);
  React.useEffect(() => {
    if (firstPay.current) { firstPay.current = false; return; }
    if (window.SHHH_TRACK) window.SHHH_TRACK.paymentSelected({ id: paymethod });
  }, [paymethod]);

  const needsAddress = courierObj.type === 'door';

  // Sync external default if it changes via tweaks
  React.useEffect(() => {
    setMode(checkoutFlow === 'single' ? 'fast' : 'standard');
  }, [checkoutFlow]);

  // Empty cart? bounce
  if (items.length === 0) {
    return (
      <div>
        <TopBar theme={theme} title="Checkout" onBack={() => nav('cart')} />
        <div style={{ padding: 40, textAlign: 'center', fontFamily: theme.body, color: theme.inkSoft }}>
          Your bag is empty.
        </div>
      </div>
    );
  }

  const TrustRow = () => (
    <div style={{
      margin: '0 20px 18px', padding: '12px 14px',
      borderRadius: theme.radiusSm, background: theme.surfaceAlt,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <Icon name="lock" size={18} color={theme.ink} />
      <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.ink, lineHeight: 1.35 }}>
        Encrypted. <span style={{ color: theme.inkSoft }}>Billed as <strong style={{ color: theme.ink }}>NL Trading Co</strong>.</span>
      </span>
    </div>
  );

  const Summary = () => (
    <div style={{
      margin: '0 20px 18px', padding: 16, borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.rule}`,
    }}>
      {items.map(i => (
        <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
          <div style={{ width: 36, height: 36, flexShrink: 0 }}>
            <ProductBlob product={i.product} theme={theme} size="sm" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink }}>
              {i.product.name} <span style={{ color: theme.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
            </div>
          </div>
          <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.ink }}>
            €{i.product.price * i.qty}
          </span>
        </div>
      ))}
      <div style={{ height: 1, background: theme.rule, margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>
        <span>{t('cart.shipping', 'Shipping')}</span><span style={{ fontFamily: theme.mono, color: theme.ink }}>{shipping === 0 ? 'Free' : `€${shipping}`}</span>
      </div>
      {appliedPromo && pd.discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, color: theme.accent, marginTop: 4 }}>
          <span>{t('ck.discount', 'Atlaide')} · {appliedPromo.code}</span><span style={{ fontFamily: theme.mono }}>−€{pd.discount.toFixed(2)}</span>
        </div>
      )}
      {giftApplied > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>
          <span>🎁 Dāvanu karte</span><span style={{ fontFamily: theme.mono, color: theme.accent }}>−€{giftApplied.toFixed(2)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 14, color: theme.ink, fontWeight: 600, marginTop: 6 }}>
        <span>{t('cart.total', 'Total')}</span><span style={{ fontFamily: theme.mono }}>€{total.toFixed(2)}</span>
      </div>
      {giftApplied > 0 && giftRemaining >= 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 4 }}>
          <span>Atlikums uz kartes</span><span style={{ fontFamily: theme.mono }}>€{giftRemaining.toFixed(2)}</span>
        </div>
      )}
    </div>
  );

  const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{
        fontFamily: theme.body, fontSize: 11, fontWeight: 600,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.inkSoft, display: 'block', marginBottom: 6,
      }}>{label}</span>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box', height: 48,
          padding: '0 16px', borderRadius: theme.radiusSm,
          border: `1.5px solid ${theme.rule}`, background: theme.surface,
          fontFamily: theme.body, fontSize: 15, color: theme.ink,
          outline: 'none',
        }}
      />
    </label>
  );

  const ExpressPay = () => (
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ApplePayButton theme={theme} onClick={onComplete} />
        <GooglePayButton theme={theme} onClick={onComplete} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 4px' }}>
        <div style={{ flex: 1, height: 1, background: theme.rule }} />
        <span style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, letterSpacing: 0.6 }}>
          OR PAY BY CARD
        </span>
        <div style={{ flex: 1, height: 1, background: theme.rule }} />
      </div>
    </div>
  );

  const Contact = () => (
    <div style={{ padding: '0 20px 8px' }}>
      <Field label={t('ck.fieldAlias', 'Alias name for the parcel')} value={name} onChange={setName}
        placeholder="M. M. (or your real name — your call)" />
      <Field label={t('ck.fieldEmail', 'Email for tracking')} value={contact} onChange={setContact}
        placeholder="you+shhh@gmail.com" type="email" />
      <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginBottom: 12, marginTop: -4 }}>
        One email when it ships. Deleted 30 days after delivery. Try a + alias.
      </div>
      <Field label={needsAddress ? t('ck.phoneDoor', 'Phone (required for door)') : t('ck.phoneLocker', 'Phone (optional — for locker SMS)')}
        value={phone} onChange={setPhone}
        placeholder="+371 …" type="tel" />
    </div>
  );

  const Address = () => (
    <div style={{ padding: '0 20px 8px' }}>
      <Field label={t('ck.fieldStreet', 'Street + house')} value={address.line1}
        onChange={v => setAddress({ ...address, line1: v })}
        placeholder="Brīvības iela 68" />
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1.4 }}>
          <Field label={t('ck.fieldCity', 'City')} value={address.city}
            onChange={v => setAddress({ ...address, city: v })}
            placeholder="Rīga" />
        </div>
        <div style={{ flex: 1 }}>
          <Field label={t('ck.fieldPostal', 'Postal')} value={address.postal}
            onChange={v => setAddress({ ...address, postal: v })}
            placeholder="LV-1011" />
        </div>
      </div>
    </div>
  );

  const PaymentSelect = () => (
    <PaymentMethodGrid theme={theme} value={paymethod} onChange={setPaymethod} />
  );

  const ShippingPick = () => (
    <>
      <CourierPicker theme={theme} courierId={courier} locationId={location}
        onCourier={setCourier} onLocation={setLocation} />
      {needsAddress && (
        <div style={{ paddingTop: 14 }}>
          <Address />
        </div>
      )}
    </>
  );

  const Anonymity = () => (
    <div style={{ padding: '0 20px 16px' }}>
      <AnonymityTips theme={theme} />
    </div>
  );

  // Compact summary + full price breakdown for the pay step
  const SummaryChip = () => {
    const [showItems, setShowItems] = React.useState(false);
    return (
    <div style={{ margin: '0 20px 14px' }}>
      <details style={{
        borderRadius: theme.radius, background: theme.surface,
        border: `1px solid ${theme.rule}`, overflow: 'hidden',
      }}>
        <summary style={{
          cursor: 'pointer', listStyle: 'none',
          padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            fontFamily: theme.body, fontSize: 14, fontWeight: 700, color: theme.ink, flex: 1,
          }}>{t('ck.orderSummary', 'Pasūtījums')} · {items.reduce((s, i) => s + i.qty, 0)} {t('ck.itemsWord', 'preces')}</span>
          <span style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink,
            letterSpacing: theme.letterDisplay,
          }}>€{total.toFixed(2)}</span>
          <span style={{ color: theme.inkSoft, fontSize: 13 }}>▾</span>
        </summary>

        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${theme.rule}` }}>
          {/* Avatars + edit — tap to reveal full item list */}
          <button onClick={(e) => { e.preventDefault(); setShowItems(v => !v); }} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {items.slice(0, 4).map((i, idx) => (
                <div key={i.key || i.id} style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: theme.surfaceAlt, border: `2px solid ${theme.bg}`,
                  marginLeft: idx === 0 ? 0 : -10, overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: '100%', height: '100%' }}>
                    <ProductBlob product={i.product} theme={theme} size="sm" />
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: theme.ink, color: theme.bg, marginLeft: -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: theme.mono, fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>+{items.length - 4}</div>
              )}
            </div>
            <span style={{
              fontFamily: theme.body, fontSize: 12, fontWeight: 600, color: theme.inkSoft,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {showItems ? t('ck.hideItems', 'Slēpt') : t('ck.showItems', 'Skatīt preces')}
              <span style={{
                width: 15, height: 15, borderRadius: 999, border: `1.2px solid ${theme.inkSoft}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, fontStyle: 'italic', fontFamily: 'Georgia, serif',
              }}>i</span>
            </span>
            <div style={{ flex: 1 }} />
            <span onClick={(e) => { e.stopPropagation(); nav('cart'); }} style={{
              cursor: 'pointer', fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: theme.accent,
            }}>Labot</span>
          </button>

          {/* Expandable item list */}
          {showItems && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: '0 0 16px', marginTop: -4,
            }}>
              {items.map(i => (
                <div key={i.key || i.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                    background: theme.surfaceAlt,
                  }}>
                    <ProductBlob product={i.product} theme={theme} size="sm" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.ink }}>{i.product.name}</div>
                    <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 1 }}>
                      {[i.colour, i.size].filter(Boolean).join(' · ')}{(i.colour || i.size) ? ' · ' : ''}× {i.qty}
                    </div>
                  </div>
                  <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.ink, fontWeight: 600, flexShrink: 0 }}>
                    €{(i.product.price * i.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ height: 1, background: theme.rule }} />
            </div>
          )}

          {/* Price breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.inkSoft }}>
              <span>Preces ({items.reduce((s, i) => s + i.qty, 0)})</span>
              <span style={{ fontFamily: theme.mono, color: theme.ink }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.inkSoft }}>
              <span>{t('cart.shipping', 'Piegāde')} · {courierObj.name}</span>
              <span style={{ fontFamily: theme.mono, color: theme.ink }}>{shipping === 0 ? t('cart.free', 'Bezmaksas') : `€${shipping.toFixed(2)}`}</span>
            </div>
            {appliedPromo && pd.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.accent }}>
                <span>{t('ck.discount', 'Atlaide')} · {appliedPromo.code}</span>
                <span style={{ fontFamily: theme.mono }}>−€{pd.discount.toFixed(2)}</span>
              </div>
            )}
            {giftApplied > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.inkSoft }}>
                <span>🎁 Dāvanu karte</span>
                <span style={{ fontFamily: theme.mono, color: theme.accent }}>−€{giftApplied.toFixed(2)}</span>
              </div>
            )}
            <div style={{ height: 1, background: theme.rule, margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>{t('cart.total', 'Kopā jāmaksā')}</span>
              <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 22, color: theme.ink, letterSpacing: theme.letterDisplay }}>€{total.toFixed(2)}</span>
            </div>
            {(pd.discount > 0 || giftApplied > 0) && (
              <div style={{
                marginTop: 6, padding: '6px 10px', borderRadius: 8,
                background: theme.accent + '14', textAlign: 'center',
                fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: theme.accent,
              }}>✓ Tu ietaupi €{(pd.discount + giftApplied).toFixed(2)}</div>
            )}
            {giftCard && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>
                <span>Atlikums uz kartes pēc pirkuma</span>
                <span style={{ fontFamily: theme.mono }}>€{giftRemaining.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </details>
    </div>
  );
  };

  // Bank tile (visual grid item)
  const BankTile = ({ m }) => {
    const active = paymethod === m.id;
    const initials = {
      citadele: 'Cit', swedbank: 'Swed', seb: 'SEB', luminor: 'Lumi',
    };
    return (
      <button onClick={() => setPaymethod(m.id)} style={{
        all: 'unset', cursor: 'pointer',
        padding: 14, borderRadius: theme.radius,
        background: theme.surface,
        border: `2px solid ${active ? theme.ink : theme.rule}`,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
        boxSizing: 'border-box', minHeight: 96,
        position: 'relative',
      }}>
        <BankBadge bank={m.bank} size={36} />
        <div>
          <div style={{
            fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink,
          }}>{m.name.replace(' banklink', '')}</div>
          <div style={{
            fontFamily: theme.body, fontSize: 10, color: theme.inkSoft, marginTop: 2,
          }}>Banklink · Anon</div>
        </div>
        {active && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            width: 20, height: 20, borderRadius: 999, background: theme.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={12} color={theme.bg} strokeWidth={2.2} />
          </div>
        )}
      </button>
    );
  };

  // Gift-card redemption block (used in Pay step)
  const GiftCardInner = () => (
    <div>
      {!giftCard ? (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={giftCode} onChange={e => { setGiftCode(e.target.value); setGiftErr(''); }}
              placeholder="SHHH-GIFT-50" style={{
                flex: 1, minWidth: 0, boxSizing: 'border-box', height: 48, padding: '0 14px',
                borderRadius: theme.radiusSm, border: `1.5px solid ${giftErr ? theme.accent : theme.rule}`,
                background: theme.surface, fontFamily: theme.mono, fontSize: 14,
                color: theme.ink, outline: 'none', textTransform: 'uppercase',
              }} />
            <button onClick={applyGift} style={{
              all: 'unset', cursor: 'pointer', padding: '0 18px', height: 48,
              borderRadius: theme.radiusSm, background: theme.ink, color: theme.bg,
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>Pielietot</button>
          </div>
          {giftErr && <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.accent, marginTop: 6 }}>{giftErr}</div>}
          <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 8 }}>
            Demo kodi: SHHH-GIFT-50 · SHHH-GIFT-100 · SHHH-LOVE-25
          </div>
        </>
      ) : (
        <div style={{
          padding: 14, borderRadius: theme.radius,
          background: theme.surface, border: `1.5px solid ${theme.accent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: theme.mono, fontSize: 13, fontWeight: 700, color: theme.ink }}>{giftCard.code}</span>
            <button onClick={() => { setGiftCard(null); setGiftCode(''); }} style={{
              all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 12,
              color: theme.inkSoft, textDecoration: 'underline',
            }}>{t('ck.remove', 'Noņemt')}</button>
          </div>
          {/* Balance bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: theme.inkSoft }}>Kartes atlikums</span>
            <span style={{ fontFamily: theme.mono, color: theme.ink, fontWeight: 700 }}>€{giftCard.balance.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: theme.inkSoft }}>Izmantots šim pasūtījumam</span>
            <span style={{ fontFamily: theme.mono, color: theme.accent, fontWeight: 700 }}>−€{giftApplied.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, paddingTop: 6, borderTop: `1px solid ${theme.rule}` }}>
            <span style={{ color: theme.ink, fontWeight: 700 }}>Atlikums pēc pirkuma</span>
            <span style={{ fontFamily: theme.mono, color: theme.ink, fontWeight: 700 }}>€{giftRemaining.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );

  // Unified savings block: promo code + gift card in one clean card.
  const SavingsBlock = () => {
    const open = savingsOpen, setOpen = setSavingsOpen;
    const hasAny = !!appliedPromo || !!giftCard;
    return (
    <div style={{ padding: '0 20px 18px' }}>
      <div style={{
        borderRadius: theme.radius, border: `1px solid ${hasAny ? theme.accent : theme.rule}`,
        background: theme.surface, overflow: 'hidden',
      }}>
        <button onClick={() => setOpen(o => !o)} style={{
          all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
          padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>🏷️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.ink,
            }}>{t('ck.promoOrGift', 'Promo kods vai dāvanu karte')}</span>
            {/* Applied chips visible when collapsed */}
            {!open && (appliedPromo || giftCard) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {appliedPromo && (
                  <span style={{
                    fontFamily: theme.body, fontSize: 10, fontWeight: 700, color: theme.accentInk,
                    background: theme.accent, padding: '3px 8px', borderRadius: 999,
                  }}>✓ {appliedPromo.code}</span>
                )}
                {giftCard && (
                  <span style={{
                    fontFamily: theme.body, fontSize: 10, fontWeight: 700, color: theme.accentInk,
                    background: theme.accent, padding: '3px 8px', borderRadius: 999,
                  }}>🎁 {giftCard.code}</span>
                )}
              </div>
            )}
          </div>
          <span style={{ color: theme.inkSoft, fontSize: 12, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
        </button>
        {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: `1px solid ${theme.rule}` }}>
          {/* Promo */}
          <div style={{ paddingTop: 14 }}>
            <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, color: theme.inkSoft, marginBottom: 8 }}>
              Promo kods
            </div>
            {typeof PromoField === 'function' && (
              <PromoField theme={theme} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} />
            )}
          </div>
          <div style={{ height: 1, background: theme.rule }} />
          {/* Gift card */}
          <div>
            <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, color: theme.inkSoft, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              🎁 Dāvanu karte
            </div>
            {GiftCardInner()}
          </div>
        </div>
        )}
      </div>
    </div>
  );
  };

  // New Pay step layout
  const PayStep = () => {
    const banks = PAYMENT_METHODS.filter(m => m.kind === 'banklink');
    return (
      <div style={{ padding: '0 20px 8px' }}>
        <SummaryChip />
        {SavingsBlock()}

        {total < 0.01 ? (
          <div style={{
            padding: 16, borderRadius: theme.radius, background: theme.surfaceAlt,
            display: 'flex', alignItems: 'center', gap: 12, marginTop: 4,
          }}>
            <span style={{ fontSize: 22 }}>🎁</span>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, lineHeight: 1.45 }}>
              Dāvanu karte sedz visu summu — papildu maksājums nav vajadzīgs. Apstiprini pasūtījumu zemāk.
            </div>
          </div>
        ) : (
        <>
        <div style={{
          fontFamily: theme.display, fontSize: 24, lineHeight: 1,
          letterSpacing: theme.letterDisplay, color: theme.ink, fontWeight: 700,
          marginBottom: 12, marginTop: 6,
        }}>{t('ck.payTitle', 'Maksāšanas veids 💳')}</div>

        {(() => {
          const banks = PAYMENT_METHODS.filter(m => m.kind === 'banklink');
          const groupOf = (pm) =>
            pm === 'apple' || pm === 'google' ? 'tap'
            : pm === 'card' ? 'card'
            : pm === 'inbank' || pm === 'klix' ? 'bnpl'
            : pm === 'transfer' ? 'transfer'
            : 'bank';
          const openGroup = groupOf(paymethod);
          const GROUPS = [
            { id: 'tap',  icon: '⚡', label: 'Tap & pay', hint: 'Apple Pay · Google Pay' },
            { id: 'bank', icon: '🏦', label: 'Banklink', hint: 'Citadele · Swedbank · SEB · Luminor' },
            { id: 'bnpl', icon: '📅', label: t('ck.payBnpl', 'Maksā vēlāk'), hint: 'Inbank · Klix' },
            { id: 'card', icon: '💳', label: t('ck.payCard', 'Karte'), hint: 'Visa · Mastercard · Amex' },
            { id: 'transfer', icon: '🧾', label: t('ck.payTransfer', 'Bankas pārskaitījums'), hint: t('ck.payTransferHint', 'Apmaksā pēc rēķina saņemšanas') },
          ];
          const Row = ({ g, children }) => {
            const isOpen = openGroup === g.id;
            return (
              <div style={{
                borderRadius: theme.radius, overflow: 'hidden',
                border: `1.5px solid ${isOpen ? theme.ink : theme.rule}`,
                background: theme.surface, marginBottom: 8,
              }}>
                <button onClick={() => {
                  if (g.id === 'tap') setPaymethod('apple');
                  else if (g.id === 'bank') setPaymethod('citadele');
                  else if (g.id === 'bnpl') setPaymethod('inbank');
                  else if (g.id === 'transfer') setPaymethod('transfer');
                  else setPaymethod('card');
                }} style={{
                  all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 20, width: 24, textAlign: 'center', flexShrink: 0 }}>{g.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>{g.label}</div>
                    <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 1 }}>{g.hint}</div>
                  </div>
                  <span style={{
                    width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                    border: `2px solid ${isOpen ? theme.ink : theme.rule}`,
                    background: isOpen ? theme.ink : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{isOpen && <Icon name="check" size={11} color={theme.bg} strokeWidth={2.4} />}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${theme.rule}` }}>
                    <div style={{ paddingTop: 12 }}>{children}</div>
                  </div>
                )}
              </div>
            );
          };
          return (
            <>
              {/* Tap & pay */}
              <Row g={GROUPS[0]}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['apple', 'google'].map(pm => (
                    <button key={pm} onClick={() => setPaymethod(pm)} style={{
                      all: 'unset', cursor: 'pointer', flex: 1, height: 56, borderRadius: theme.radiusPill,
                      background: '#000', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      border: paymethod === pm ? `3px solid ${theme.accent}` : '3px solid transparent',
                      boxSizing: 'border-box',
                    }}>
                      {pm === 'apple'
                        ? <><Icon name="apple" size={20} color="#fff" /><span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 500, fontSize: 18 }}>Pay</span></>
                        : <span style={{ fontFamily: 'Roboto, system-ui', fontWeight: 500, fontSize: 16 }}>
                            <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#4285F4' }}>g</span><span style={{ color: '#34A853' }}>l</span><span style={{ color: '#EA4335' }}>e</span> <span style={{ color: '#fff' }}>Pay</span>
                          </span>}
                    </button>
                  ))}
                </div>
              </Row>

              {/* Banklink */}
              <Row g={GROUPS[1]}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {banks.map(m => <BankTile key={m.id} m={m} />)}
                </div>
              </Row>

              {/* BNPL */}
              <Row g={GROUPS[2]}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {PAYMENT_METHODS.filter(m => m.kind === 'bnpl').map(m => {
                    const active = paymethod === m.id;
                    return (
                      <button key={m.id} onClick={() => setPaymethod(m.id)} style={{
                        all: 'unset', cursor: 'pointer', padding: 12, borderRadius: theme.radius,
                        background: theme.surface, boxSizing: 'border-box',
                        border: `2px solid ${active ? theme.ink : theme.rule}`,
                        display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
                      }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8, background: m.color, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: theme.body, fontWeight: 800, fontSize: 15,
                        }}>{m.bank === 'inbank' ? 'i' : 'K'}</div>
                        <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
                          {m.bank === 'inbank' ? 'Inbank' : 'Klix'}
                        </div>
                        {active && <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 999, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={11} color={theme.bg} strokeWidth={2.2} /></div>}
                      </button>
                    );
                  })}
                </div>
                {(paymethod === 'inbank' || paymethod === 'klix') && (
                  <div style={{ marginTop: 10, padding: 14, borderRadius: theme.radius, background: theme.surfaceAlt }}>
                    <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10 }}>Nomaksas kalkulators</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {[3, 6, 12, 24, 36].map(mo => {
                        const on = bnplMonths === mo;
                        return (
                          <button key={mo} onClick={() => setBnplMonths(mo)} style={{
                            all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '8px 0',
                            borderRadius: theme.radiusSm, background: on ? theme.ink : theme.surface,
                            color: on ? theme.bg : theme.ink, border: `1.5px solid ${on ? theme.ink : theme.rule}`,
                            fontFamily: theme.body, fontWeight: 700, fontSize: 12,
                          }}>{mo}</button>
                        );
                      })}
                    </div>
                    {(() => {
                      const apr = paymethod === 'inbank' ? 0.149 : 0;
                      const months = bnplMonths;
                      const monthly = apr > 0 ? (total * (apr / 12)) / (1 - Math.pow(1 + apr / 12, -months)) : total / months;
                      return (
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>{months} mēneši{apr > 0 ? ' · ' + (apr * 100).toFixed(1) + '% GPL' : ' · 0% bez procentiem'}</div>
                            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 26, color: theme.ink, letterSpacing: theme.letterDisplay, lineHeight: 1.1 }}>€{monthly.toFixed(2)}<span style={{ fontSize: 14, color: theme.inkSoft }}>/mēn.</span></div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>Kopā</div>
                            <div style={{ fontFamily: theme.mono, fontSize: 14, color: theme.ink, fontWeight: 600 }}>€{(monthly * months).toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })()}
                    <button onClick={() => setBnplInfo(paymethod)} style={{
                      all: 'unset', cursor: 'pointer', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: theme.accent,
                    }}>
                      <span style={{ width: 16, height: 16, borderRadius: 999, border: `1.4px solid ${theme.accent}`, color: theme.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 10, fontWeight: 700 }}>i</span>
                      Kas ir {paymethod === 'inbank' ? 'Inbank sadali daļās' : 'Klix'} maksājums?
                    </button>
                  </div>
                )}
              </Row>

              {/* Card */}
              <Row g={GROUPS[3]}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 34, borderRadius: 6,
                    background: `linear-gradient(135deg, ${theme.ink}, ${theme.inkSoft})`,
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 4, color: theme.bg,
                  }}><span style={{ fontFamily: theme.mono, fontSize: 10, fontWeight: 600 }}>•• 42</span></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>Visa · Mastercard · Amex</div>
                    <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>3D Secure · tokenizēts</div>
                  </div>
                </div>
              </Row>

              {/* Bankas pārskaitījums */}
              <Row g={GROUPS[4]}>
                <div style={{ fontFamily: theme.body, fontSize: 12.5, color: theme.inkSoft, lineHeight: 1.5 }}>
                  Pēc pasūtījuma iesniegšanas saņemsi rēķinu ar rekvizītiem. Apstrādi sākam pēc maksājuma saņemšanas (parasti 1 darba diena).
                </div>
              </Row>
            </>
          );
        })()}

        {/* Footer security line */}
        <div style={{
          marginTop: 6, padding: '10px 12px', borderRadius: theme.radiusSm,
          background: theme.surfaceAlt,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="lock" size={14} color={theme.ink} />
          <span style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>
            {t('ck.secureLine', '🔒 Šifrēts · TLS 1.3 · izrakstā "NL Trading Co"')}
          </span>
        </div>
        </>
        )}
      </div>
    );
  };

  // Fast (one-page) flow
  const FastFlow = () => (
    <div>
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          fontFamily: theme.display, fontSize: 28, lineHeight: 1,
          letterSpacing: theme.letterDisplay, color: theme.ink, fontWeight: 700,
          marginBottom: 6,
        }}>One tap and you're done. ⚡</div>
        <div style={{
          fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.45,
          marginBottom: 12,
        }}>Apple&nbsp;Pay / Google&nbsp;Pay automātiski nodod tavu <strong style={{ color: theme.ink }}>vārdu, e-pastu un adresi</strong> — nekas nav jāraksta. Tev jāizvēlas tikai piegādes veids.</div>
        <div style={{
          padding: '10px 12px', borderRadius: theme.radiusSm, background: theme.surfaceAlt,
          display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4,
        }}>
          <span style={{ fontSize: 13, marginTop: 1 }}>🔒</span>
          <span style={{ fontFamily: theme.body, fontSize: 11.5, color: theme.inkSoft, lineHeight: 1.45 }}>
            Vēlies anonimitāti vai maksāt ar banku? Izvēlies <button onClick={() => setMode('standard')} style={{
              all: 'unset', cursor: 'pointer', color: theme.accent, fontWeight: 700, textDecoration: 'underline',
            }}>Standarta</button> — ievadi aliasu un maksā ar banklink, karti vai BNPL.
          </span>
        </div>
      </div>

      {/* Order summary breakdown */}
      <SummaryChip />

      {/* Savings — promo + gift card unified */}
      {SavingsBlock()}

      {/* Delivery method FIRST — choose where it goes */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 8,
        }}>Send it to</div>
      </div>
      <ShippingPick />

      {/* Pay buttons LAST — one tap to confirm */}
      <div style={{ padding: '18px 20px 16px' }}>
        {total < 0.01 ? (
          <div style={{
            padding: 16, borderRadius: theme.radius, background: theme.surfaceAlt,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>🎁</span>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, lineHeight: 1.45 }}>
              Dāvanu karte sedz visu summu — papildu maksājums nav vajadzīgs.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ApplePayButton theme={theme} onClick={onComplete} />
            <GooglePayButton theme={theme} onClick={onComplete} />
          </div>
        )}
      </div>
    </div>
  );

  // Interactive step bar — clickable to jump
  const Steps = () => (
    <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
      {[1, 2, 3].map(n => {
        const active = step === n;
        const done = step > n;
        return (
          <button key={n} onClick={() => setStep(n)} style={{
            all: 'unset', cursor: 'pointer',
            flex: 1, display: 'flex', flexDirection: 'column', gap: 6,
            position: 'relative',
          }}>
            <div style={{
              height: 4, borderRadius: 2,
              background: active || done ? theme.ink : theme.rule,
              transition: 'background .2s ease',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
                color: active || done ? theme.ink : theme.inkSoft,
              }}>{n.toString().padStart(2, '0')}</span>
              <span style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                letterSpacing: 0.3, textTransform: 'uppercase',
                color: active ? theme.ink : done ? theme.inkSoft : theme.inkSoft,
              }}>
                {n === 1 ? t('checkout.identity','Identity') : n === 2 ? t('checkout.delivery','Delivery') : t('checkout.pay','Pay')}
              </span>
              {done && <Icon name="check" size={12} color={theme.accent} strokeWidth={2.2} />}
            </div>
          </button>
        );
      })}
    </div>
  );

  // Mode toggle — ⚡ Fast vs Standard, always visible
  const ModeToggle = () => (
    <div style={{ padding: '0 20px 14px' }}>
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: theme.surfaceAlt, borderRadius: theme.radiusPill,
      }}>
        {[
          { id: 'fast', label: t('checkout.fast','⚡ Fast checkout'), sub: '1 tap' },
          { id: 'standard', label: t('checkout.standard','Standard'), sub: '3 steps' },
        ].map(o => {
          const active = mode === o.id;
          return (
            <button key={o.id} onClick={() => setMode(o.id)} style={{
              all: 'unset', cursor: 'pointer',
              flex: 1, padding: '10px 12px', borderRadius: theme.radiusPill,
              background: active ? theme.surface : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                color: active ? theme.ink : theme.inkSoft,
              }}>{o.label}</div>
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 500,
                color: active ? theme.inkSoft : theme.inkSoft, opacity: active ? 1 : 0.7,
                marginTop: 1,
              }}>{o.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Identity step — fresh layout with grouped card + inline tips
  const IdentityStep = () => (
    <div style={{ padding: '0 20px' }}>
      {/* Express skip */}
      <div style={{
        padding: 14, borderRadius: theme.radius,
        background: theme.ink, color: theme.bg,
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
        position: 'relative', overflow: 'hidden',
      }}>
        <Icon name="zap" size={20} color={theme.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13 }}>
            Skip the form
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 11, opacity: 0.7, marginTop: 1 }}>
            Tap Apple Pay / Google Pay & we'll grab the rest from them. Ņem vērā: tiek izmantots tavs <strong>īstais</strong> maka vārds un adrese (nav anonīmi).
          </div>
        </div>
        <button onClick={() => setMode('fast')} style={{
          all: 'unset', cursor: 'pointer',
          padding: '8px 14px', borderRadius: theme.radiusPill,
          background: theme.accent, color: theme.accentInk,
          fontFamily: theme.body, fontWeight: 700, fontSize: 12,
        }}>⚡ Go fast</button>
      </div>

      {/* Identity card */}
      <div style={{
        borderRadius: theme.radius, background: theme.surface,
        border: `1.5px solid ${theme.rule}`, overflow: 'hidden',
        marginBottom: 16,
      }}>
        {[
          {
            label: t('ck.alias', 'Alias'),
            value: name, set: setName,
            placeholder: 'M. M. (or your real name)',
            hint: t('ck.aliasHint', 'Goes on the parcel label. We don\u2019t verify.'),
            icon: 'ghost',
            type: 'text',
          },
          {
            label: t('ck.email', 'Email'),
            value: contact, set: setContact,
            placeholder: 'you+shhh@gmail.com',
            hint: t('ck.emailHint', 'One email when it ships. Try a + alias.'),
            icon: 'eyeOff',
            type: 'email',
          },
          {
            label: needsAddress ? t('ck.phoneDoor', 'Phone (required for door)') : t('ck.phoneOpt', 'Phone — optional'),
            value: phone, set: setPhone,
            placeholder: '+371 …',
            hint: needsAddress
              ? t('ck.phoneHintDoor', 'Courier needs to call you if no one\u2019s home.')
              : t('ck.phoneHintLocker', 'Lockers send an SMS code. Leave blank to use email only.'),
            icon: 'lock',
            type: 'tel',
          },
        ].map((f, i) => (
          <div key={f.label} style={{
            padding: '12px 14px',
            borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: theme.surfaceAlt, color: theme.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 4,
            }}>
              <Icon name={f.icon} size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 2,
              }}>{f.label}</div>
              <input
                type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '4px 0', border: 'none', background: 'transparent',
                  fontFamily: theme.body, fontSize: 15, color: theme.ink, fontWeight: 500,
                  outline: 'none',
                }}
              />
              <div style={{
                fontFamily: theme.body, fontSize: 11, color: theme.inkSoft,
                marginTop: 2, lineHeight: 1.4,
              }}>{f.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 14 }}>
        <AnonymityTips theme={theme} />
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <TopBar theme={theme}
        title={mode === 'fast' ? 'Fast checkout' : `Checkout · ${step}/3`}
        onBack={() => {
          if (mode === 'fast' || step === 1) nav('cart');
          else setStep(step - 1);
        }} />
      <ModeToggle />

      {mode === 'fast' ? (
        <FastFlow />
      ) : (
        <>
          <Steps />
          {step === 1 && <IdentityStep />}
          {step === 2 && (
            <>
              <ShippingPick />
              <div style={{
                margin: '14px 20px 8px', padding: 14,
                background: theme.surface, border: `1px solid ${theme.rule}`,
                borderRadius: theme.radius,
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {/* Mini box illustration */}
                  <div style={{
                    width: 72, height: 64, flexShrink: 0, borderRadius: 10,
                    background: '#F3EEFF', position: 'relative', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 100 90" width="74%" height="74%">
                      <path d="M20 32 L50 20 L80 32 L80 66 L50 78 L20 66 Z" fill="#C9A878" stroke={theme.ink} strokeWidth="2.4" strokeLinejoin="round" />
                      <path d="M20 32 L50 44 L80 32" fill="none" stroke={theme.ink} strokeWidth="2" />
                      <path d="M50 44 L50 78" fill="none" stroke={theme.ink} strokeWidth="2" />
                      <rect x="36" y="50" width="28" height="6" fill={theme.ink} opacity="0.18" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                      color: '#15803D', marginBottom: 6,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: '#22C55E' }} />
                      100% diskrēti
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {[
                        ['📦', 'Tukša brūna kaste — bez logo'],
                        ['🏷️', 'Sūtītājs: NL Trading Co'],
                        ['💳', 'Izrakstā: NL Trading Co'],
                      ].map(([e, txt]) => (
                        <div key={txt} style={{
                          display: 'flex', alignItems: 'center', gap: 7,
                          fontFamily: theme.body, fontSize: 12, color: theme.ink,
                        }}>
                          <span style={{ fontSize: 12, width: 16, textAlign: 'center', flexShrink: 0 }}>{e}</span>
                          {txt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {step === 3 && PayStep()}
        </>
      )}

      <div style={{
        margin: '24px 0 0', position: 'sticky', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 26px', background: theme.bg, borderTop: `1px solid ${theme.rule}`, boxShadow: '0 -12px 24px -8px rgba(0,0,0,0.08)',
      }}>
        {mode === 'fast' ? (
          <PrimaryButton theme={theme} onClick={onComplete}>
            {total < 0.01 ? '🎁 Apstiprināt pasūtījumu · €0' : `Confirm & pay · €${total.toFixed(2)}`}
          </PrimaryButton>
        ) : step < 3 ? (
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={{
                all: 'unset', cursor: 'pointer', height: 56, padding: '0 20px',
                borderRadius: theme.radiusPill, border: `1.5px solid ${theme.rule}`,
                color: theme.ink, fontFamily: theme.body, fontWeight: 700, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}><Icon name="back" size={18} /> Atpakaļ</button>
            )}
            <PrimaryButton theme={theme} onClick={() => setStep(step + 1)} style={{ flex: 1 }}>
              {t('checkout.continue','Continue')} &nbsp;<Icon name="arrow" size={18} color="#fff" />
            </PrimaryButton>
          </div>
        ) : (
          total < 0.01 ? (
            <PrimaryButton theme={theme} onClick={onComplete}>
              🎁 Apstiprināt pasūtījumu · €0 (dāvanu karte)
            </PrimaryButton>
          ) :
          paymethod === 'apple' ? <ApplePayButton theme={theme} onClick={onComplete} />
          : paymethod === 'google' ? <GooglePayButton theme={theme} onClick={onComplete} />
          : (() => {
              const m = PAYMENT_METHODS.find(x => x.id === paymethod);
              const giftNote = giftApplied > 0 ? ` (−€${giftApplied.toFixed(2)} dāvanu karte)` : '';
              const label = m && m.kind === 'banklink'
                ? `Pay with ${m.name.replace(' banklink', '')} · €${total.toFixed(2)}`
                : m && m.kind === 'transfer'
                ? `Iesniegt pasūtījumu · €${total.toFixed(2)}`
                : `${t('checkout.placeOrder','Place order')} · €${total.toFixed(2)}${giftNote}`;
              return <PrimaryButton theme={theme} onClick={() => onComplete(paymethod)}>{label}</PrimaryButton>;
            })()
        )}
      </div>

      {bnplInfo && (
        <div onClick={() => setBnplInfo(null)} style={{
          position: 'absolute', inset: 0, zIndex: 200,
          background: 'rgba(15,15,15,0.55)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxHeight: '88%', overflowY: 'auto',
            background: theme.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '14px 22px 30px',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: theme.rule, margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <h3 style={{
                fontFamily: theme.display, fontWeight: 700, fontSize: 24,
                letterSpacing: theme.letterDisplay, color: theme.ink, margin: 0, lineHeight: 1.1,
              }}>{bnplInfo === 'inbank' ? 'Inbank Sadali daļās – bez pārmaksas' : 'Klix by Citadele – maksā vēlāk'}</h3>
              <button onClick={() => setBnplInfo(null)} aria-label="Aizvērt" style={{
                all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999,
                background: theme.surfaceAlt, color: theme.ink, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name="close" size={18} /></button>
            </div>
            <p style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.6, margin: '0 0 18px' }}>
              {bnplInfo === 'inbank'
                ? 'Inbank maksājumu metode "Sadali daļās" ļauj sadalīt pirkuma summu 3 vienādos maksājumos bez pārmaksas – bez procentiem, līguma maksas un pirmās iemaksas.'
                : 'Klix by Citadele "Maksā vēlāk" ļauj sadalīt pirkumu ērtos ikmēneša maksājumos. Pieteikšanās aizņem mazāk par minūti, lēmums – uzreiz.'}
            </p>
            <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink, marginBottom: 8 }}>Kā pieteikties?</div>
            <ul style={{ margin: '0 0 18px', paddingLeft: 18, fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.7 }}>
              <li>Pievieno produktus iepirkumu grozam</li>
              <li>Izvēlies {bnplInfo === 'inbank' ? 'Inbank Sadali daļās' : 'Klix maksā vēlāk'}</li>
              <li>Apstiprini darījumu</li>
              <li>Saņem preci</li>
              <li>Pirmo maksājumu veic nākamajā mēnesī</li>
            </ul>
            <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink, marginBottom: 8 }}>Nosacījumi:</div>
            <ul style={{ margin: '0 0 18px', paddingLeft: 18, fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.7 }}>
              {bnplInfo === 'inbank' ? (
                <>
                  <li>Pirkuma summa: 75 € līdz 2500 €</li>
                  <li>Maksā 3 vienādās daļās</li>
                  <li>0 € papildu maksas</li>
                  <li>Pirmais maksājums – pēc mēneša</li>
                </>
              ) : (
                <>
                  <li>Pirkuma summa: 10 € līdz 5000 €</li>
                  <li>Elastīgs maksājumu grafiks</li>
                  <li>Bez slēptām maksām</li>
                  <li>Pirmais maksājums – pēc mēneša</li>
                </>
              )}
            </ul>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.6, marginBottom: 10 }}>
              Vairāk par šo maksājuma metodi lasīt{' '}
              <a href={bnplInfo === 'inbank' ? 'https://inbank.lv/documents/lv/lv/pdf/pay_later_conditions.pdf' : 'https://klix.app/lv/pay-later/'}
                target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, fontWeight: 700 }}>šeit</a>.
            </div>
            <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.55, marginBottom: 18 }}>
              {bnplInfo === 'inbank'
                ? 'Ja rodas jautājumi par maksājuma metodi, sazinies ar Inbank Latvia, +371 66 939 000, info@inbank.lv, inbank.lv'
                : 'Ja rodas jautājumi par maksājuma metodi, sazinies ar Klix, +371 67 881 212, support@klix.app, klix.app'}
            </div>
            <button onClick={() => { setBnplInfo(null); nav('content', { key: 'payment-methods' }); }} style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.accent,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>Visas maksājumu metodes →</button>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────
function ConfirmationScreen({ theme, nav, lastOrder, tone }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const items = lastOrder.items.map(c => ({
    ...c,
    product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  // Pet names for items, chosen with affection.
  const petNames = ['🍑', '🍌', '🌶️', '🍒', '🔥', '💋', '✨', '🫦'];

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '6px 20px 10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => nav('home')} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
        }}><Icon name="close" size={22} /></button>
      </div>

      {/* Confetti emoji burst */}
      <div style={{ padding: '20px 24px 6px', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {['🍑', '🍌', '🌶️', '🍒', '🔥', '💋', '✨', '💜', '🍑', '🍌'].map((e, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: (i * 11 + 3) + '%',
              top: (i % 2 === 0 ? 4 : 56) + (i * 2) + 'px',
              fontSize: 20 + (i % 3) * 4,
              transform: `rotate(${(i % 5) * 18 - 36}deg)`,
              opacity: 0.85,
            }}>{e}</span>
          ))}
        </div>
        <div style={{
          width: 80, height: 80, borderRadius: 999,
          background: 'linear-gradient(135deg, #FF4FB8 0%, #B14BE8 50%, #2D4BFF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, position: 'relative', zIndex: 1,
          boxShadow: '0 10px 30px rgba(110,77,248,0.30)',
        }}>
          <span style={{ fontSize: 38, lineHeight: 1 }}>🍑</span>
        </div>
        <div style={{
          fontFamily: theme.display, fontSize: 48, lineHeight: 0.92,
          letterSpacing: theme.letterDisplay, color: theme.ink,
          fontWeight: 700, marginBottom: 12, position: 'relative', zIndex: 1,
        }}>
          {t('conf.title','On its way to')} <span className="shhh-grad-text">{t('conf.titleYou','you')}</span>. 🍌🍑
        </div>
        <div style={{
          fontFamily: theme.body, fontSize: 15, color: theme.inkSoft, lineHeight: 1.55,
          position: 'relative', zIndex: 1, marginBottom: 8,
        }}>
          One discreet email when it ships. Plain box. Bank statement reads
          <strong style={{ color: theme.ink }}> "NL Trading Co"</strong>. The rest? Between you and your imagination. 😏
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          borderRadius: 999, background: theme.surfaceAlt, color: theme.ink,
          fontFamily: theme.body, fontSize: 12, fontWeight: 700, position: 'relative', zIndex: 1,
        }}>
          {t('conf.secret','🤫 Your secret is safe with us')}
        </div>
      </div>

      {/* Order chip */}
      <div style={{
        margin: '20px 20px 18px', padding: '16px 18px',
        background: theme.ink, color: theme.bg, borderRadius: theme.radius,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -20, bottom: -20, fontSize: 80, opacity: 0.08,
        }}>🍑</div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: theme.body, fontSize: 10, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', opacity: 0.7 }}>
            Your secret ref
          </div>
          <div style={{ fontFamily: theme.mono, fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            #{lastOrder.ref}
          </div>
        </div>
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{ fontFamily: theme.body, fontSize: 10, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', opacity: 0.7 }}>
            Arrives
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            Tomorrow 🔥
          </div>
        </div>
      </div>

      {/* Timeline — flirty labels */}
      <div style={{ padding: '0 24px 24px' }}>
        {[
          { label: 'Order placed', sub: 'Just now — good choice 😉', emoji: '💋', done: true },
          { label: 'Plain box packed', sub: 'Before 4pm today — wrapped in tissue, no logos', emoji: '📦', done: false },
          { label: 'On its way to you', sub: 'Tonight — sneaking through the night', emoji: '🚚', done: false },
          { label: 'Arriving 🍑', sub: 'Tomorrow — ready when you are', emoji: '🍑', done: false },
        ].map((s, i, arr) => (
          <div key={s.label} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: s.done ? theme.accent : theme.surface,
                border: `2px solid ${s.done ? theme.accent : theme.rule}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>{s.done ? '✓' : ''}</div>
              {i < arr.length - 1 && (
                <div style={{
                  flex: 1, width: 2, background: theme.rule, marginTop: 4, minHeight: 24,
                }} />
              )}
            </div>
            <div style={{ paddingBottom: 18, flex: 1 }}>
              <div style={{
                fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>{s.label} <span>{s.emoji}</span></div>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Item list — with pet emoji */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 10,
        }}>Coming soon, just for you 🍌🍑</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((i, idx) => (
            <div key={i.id} style={{
              display: 'flex', gap: 12, alignItems: 'center',
              padding: 12, background: theme.surface,
              border: `1px solid ${theme.rule}`, borderRadius: theme.radius,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -4, right: -4, fontSize: 22, opacity: 0.18,
                transform: 'rotate(15deg)',
              }}>{petNames[idx % petNames.length]}</div>
              <div style={{ width: 56, height: 56, flexShrink: 0 }}>
                <ProductBlob product={i.product} theme={theme} size="sm" />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>
                  {i.product.name} {petNames[idx % petNames.length]}
                  {' '}<span style={{ color: theme.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
                </div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                  {i.product.tagline}
                </div>
              </div>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink, fontWeight: 700, position: 'relative' }}>
                {i.id === 'gift' ? '🎁 FREE' : `€${i.product.price * i.qty}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => { window.__shhhInvoice = lastOrder; nav('invoice'); }} className="shhh-grad" style={{
          cursor: 'pointer', height: 52, borderRadius: theme.radiusPill,
          fontFamily: theme.body, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>📄 Lejupielādēt rēķinu</button>
        {lastOrder.fromLookup ? (
          <PrimaryButton theme={theme} onClick={() => { window.__shhhLookupRef = lastOrder.ref; nav('content', { key: 'order-lookup' }); }}>
            Atpakaļ uz Mani pasūtījumi
          </PrimaryButton>
        ) : (
          <PrimaryButton theme={theme} onClick={() => nav('content', { key: 'how-it-ships' })}>
            See how the box arrives 📦
          </PrimaryButton>
        )}
        <GhostButton theme={theme} onClick={() => nav('home')}>
          Keep shopping 🍒
        </GhostButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACCOUNT / ORDER HISTORY
// ─────────────────────────────────────────────────────────────
function AccountScreen({ theme, nav, orders, params, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [view, setView] = React.useState(params?.tab || 'orders'); // orders | favourites | bag
  const favProducts = favourites.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '6px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 34,
          color: theme.ink, letterSpacing: theme.letterDisplay,
          fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1,
        }}>{t("account.title", "You")}</div>
        <Wordmark theme={theme} size={18} />
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          padding: '14px 16px', borderRadius: theme.radius,
          background: theme.surfaceAlt, display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <Icon name="ghost" size={22} color={theme.ink} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: theme.ink }}>
              Viesa režīms
            </div>
            <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
              Bez konta, bez profila — vēsture netiek glabāta pēc piegādes.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 8 }}>
        {[
          ['orders', t('account.orders', 'Pasūtījumi')],
          ['favourites', `${t('account.wishlist', 'Vēlmes')}${favProducts.length ? ' · ' + favProducts.length : ''}`],
          ['bag', t('account.bag', 'Tava soma')],
        ].map(([id, label]) => (
          <button key={id} onClick={() => id === 'bag' ? nav('cart') : setView(id)} style={{
            all: 'unset', cursor: 'pointer', padding: '8px 14px',
            borderRadius: theme.radiusPill,
            background: view === id ? theme.ink : 'transparent',
            color: view === id ? theme.bg : theme.ink,
            border: view === id ? 'none' : `1.5px solid ${theme.rule}`,
            fontFamily: theme.body, fontWeight: 600, fontSize: 13,
          }}>{label}</button>
        ))}
      </div>

      {view === 'orders' && (
        <div style={{ padding: '12px 20px 20px' }}>
          <button onClick={() => nav('content', { key: 'order-lookup' })} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            padding: 16, borderRadius: theme.radius, border: `1px solid ${theme.rule}`,
            background: theme.surface, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: theme.radiusSm, flexShrink: 0,
              background: theme.surfaceAlt, color: theme.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="box" size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>
                Meklēt pasūtījumu
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                Ievadi pasūtījuma numuru, lai redzētu statusu, apmaksu vai atgrieztu preci.
              </div>
            </div>
            <Icon name="chev" size={18} color={theme.inkSoft} />
          </button>
        </div>
      )}

      {view === 'favourites' && (
        <div style={{ padding: '12px 20px 20px' }}>
          {favProducts.length === 0 ? (
            <div style={{
              padding: 28, textAlign: 'center',
              borderRadius: theme.radius, border: `1.5px dashed ${theme.rule}`,
              fontFamily: theme.body, fontSize: 13, color: theme.inkSoft,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>♡</div>
              Tap the heart on anything you like. We'll keep them here for later.
            </div>
          ) : (
            <>
              <WishlistShareBar theme={theme} favourites={favourites} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {favProducts.map(p => (
                  <ProductCard key={p.id} product={p} theme={theme} variant="image"
                    onClick={() => nav('product', { id: p.id })}
                    isFavourite={true}
                    onFavourite={toggleFavourite}
                    onQuickBuy={quickBuy} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {view === 'settings' && (
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: 'box', label: t('acc.discreetPack', 'Discreet packaging'), sub: t('acc.discreetPackSub', 'On — outer box is unmarked') },
            { icon: 'card', label: t('acc.anonBilling', 'Anonymous billing'), sub: t('acc.anonBillingSub', 'On — appears as "NL Trading Co"') },
            { icon: 'eyeOff', label: t('acc.autoHide', 'Auto-hide order history'), sub: t('acc.autoHideSub', 'After 30 days post-delivery') },
            { icon: 'lock', label: t('acc.biometric', 'Biometric on launch'), sub: t('acc.biometricSub', 'Off — tap to enable') },
          ].map(s => (
            <div key={s.label} style={{
              padding: 14, borderRadius: theme.radius, background: theme.surface,
              border: `1px solid ${theme.rule}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: theme.radiusSm,
                background: theme.surfaceAlt, color: theme.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={s.icon} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: theme.ink }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                  {s.sub}
                </div>
              </div>
              <Icon name="chev" size={16} color={theme.inkSoft} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DISCREET PACKAGING INFO
// ─────────────────────────────────────────────────────────────
function PackagingScreen({ theme, nav }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar theme={theme} title="How it arrives" onBack={() => nav('home')} />

      {/* Hero card showing the box */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          aspectRatio: '4/3', background: theme.surfaceAlt,
          borderRadius: theme.radius, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `repeating-linear-gradient(135deg, transparent 0 14px, ${theme.ink}08 14px 15px)`,
          }} />
          {/* an honest brown cardboard box drawing */}
          <svg viewBox="0 0 200 160" width="78%" height="78%">
            <g>
              <path d="M30 50 L100 30 L170 50 L170 130 L100 150 L30 130 Z"
                fill="#C9A878" stroke={theme.ink} strokeWidth="2" strokeLinejoin="round" />
              <path d="M30 50 L100 70 L170 50" fill="none" stroke={theme.ink} strokeWidth="2" />
              <path d="M100 70 L100 150" fill="none" stroke={theme.ink} strokeWidth="2" />
              <path d="M100 70 L100 30" fill="none" stroke={theme.ink} strokeWidth="1.2" strokeDasharray="3 3" />
              {/* tape */}
              <rect x="60" y="85" width="80" height="10" fill={theme.ink} opacity="0.15" />
            </g>
          </svg>
          <div style={{
            position: 'absolute', top: 14, left: 16,
            fontFamily: theme.mono, fontSize: 10, color: theme.ink, opacity: 0.6,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>Actual outer box</div>
        </div>
      </div>

      <div style={{ padding: '0 22px 22px' }}>
        <div style={{
          fontFamily: theme.display, fontSize: 36, lineHeight: 1,
          letterSpacing: theme.letterDisplay, color: theme.ink,
          fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
          marginBottom: 10,
        }}>Plain. On purpose.</div>
        <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.5 }}>
          No logos. No product names. Nothing on the outside that would make a neighbour, a flatmate,
          or a courier raise an eyebrow. Inside, your order is wrapped in unmarked tissue paper.
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: 'box', title: 'Outer box', body: 'A blank brown shipping carton. The return address reads "NL Trading Co, Amsterdam".' },
          { icon: 'card', title: 'Bank statement', body: 'Your card is charged by "NL Trading Co". Not by us, not by anything that could be searched.' },
          { icon: 'truck', title: 'Delivery options', body: 'Pick-up point, locker, or to your door. Couriers don\u2019t see what\u2019s inside.' },
          { icon: 'eye', title: 'Email + SMS', body: 'One shipping email. No marketing follow-ups. We don\u2019t SMS.' },
          { icon: 'leaf', title: 'What\u2019s inside', body: 'Product, soft pouch, USB-C cable, one-page guide. Recyclable paper, no plastic.' },
        ].map(s => (
          <div key={s.title} style={{
            padding: 14, borderRadius: theme.radius, background: theme.surface,
            border: `1px solid ${theme.rule}`, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: theme.radiusSm,
              background: theme.surfaceAlt, color: theme.ink, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={s.icon} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: theme.ink, marginBottom: 4 }}>
                {s.title}
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.45 }}>
                {s.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <PrimaryButton theme={theme} onClick={() => nav('category')}>
          Browse the shop
        </PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { CheckoutScreen, ConfirmationScreen, PendingPaymentScreen, AccountScreen, PackagingScreen, WishlistShareBar });

// ─────────────────────────────────────────────────────────────
// PENDING PAYMENT — banklink/BNPL started but not finished
// ─────────────────────────────────────────────────────────────
function PendingPaymentScreen({ theme, nav, lastOrder, onRetry, onCancel }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  if (!lastOrder) {
    return <div style={{ padding: 40, fontFamily: theme.body, color: theme.inkSoft, textAlign: 'center' }}>Nav pasūtījuma.</div>;
  }
  const items = lastOrder.items.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const pm = (window.PAYMENT_METHODS || []).find(m => m.id === lastOrder.payMethod);
  const pmName = pm ? pm.name.replace(' banklink', '') : 'banka';
  const today = new Date().toLocaleDateString('lv-LV');

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '14px 20px 6px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>Pasūtījums nr.</div>
          <div style={{ fontFamily: theme.mono, fontSize: 15, fontWeight: 700, color: theme.ink }}>#{lastOrder.ref}</div>
          <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>Iesniegts: {today}</div>
        </div>
        <button onClick={onCancel} style={{
          all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 12, fontWeight: 600,
          color: theme.inkSoft, textDecoration: 'underline', paddingTop: 4,
        }}>Atcelt pasūtījumu</button>
      </div>

      <div style={{ padding: '10px 20px 0' }}>
        <div style={{
          padding: '14px 16px', borderRadius: theme.radius,
          background: '#FFF6E5', border: '1px solid #F0C97A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>⏳</span>
            <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: '#9A6B00', letterSpacing: theme.letterDisplay }}>
              Gaida apmaksu
            </span>
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 12.5, color: '#7A5600', lineHeight: 1.5 }}>
            Maksāšanas veids: <strong>{pmName}</strong>. Pasūtījuma apstrādi un piegādes datuma aprēķinu sākam uzreiz pēc maksājuma saņemšanas.
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton theme={theme} onClick={onRetry}>
          Apmaksāt · €{lastOrder.total.toFixed(2)}
        </PrimaryButton>
        <button onClick={() => nav('checkout')} style={{
          all: 'unset', cursor: 'pointer', textAlign: 'center', padding: '8px 0',
          fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.accent,
        }}>Mainīt maksājuma veidu</button>
      </div>

      {/* Saved contact + delivery — order "remembers" what was entered */}
      {lastOrder.details && (lastOrder.details.name || lastOrder.details.email || lastOrder.details.location || lastOrder.details.courier) && (
        <div style={{ padding: '6px 20px 0' }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps,
            textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8,
          }}>Piegāde un kontakti</div>
          <div style={{ borderRadius: theme.radius, border: `1px solid ${theme.rule}`, background: theme.surface, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lastOrder.details.name && <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink }}>👤 {lastOrder.details.name}</div>}
            {lastOrder.details.email && <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink }}>✉️ {lastOrder.details.email}</div>}
            {lastOrder.details.phone && <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink }}>📞 {lastOrder.details.phone}</div>}
            {(lastOrder.details.location || lastOrder.details.courier) && (
              <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink }}>📦 {lastOrder.details.courier}{lastOrder.details.location ? ' · ' + lastOrder.details.location : ''}{lastOrder.details.address ? ' · ' + lastOrder.details.address : ''}</div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '14px 24px 8px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps,
          textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 12,
        }}>Pasūtījuma statuss</div>
        {[
          { l: 'Iesniegts', s: today, done: true },
          { l: 'Apstiprināts', s: 'Pēc maksājuma saņemšanas', done: false },
        ].map((st, i, arr) => (
          <div key={st.l} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 14, height: 14, borderRadius: 999,
                background: st.done ? '#1F8A4C' : 'transparent',
                border: `2px solid ${st.done ? '#1F8A4C' : theme.rule}`, marginTop: 3,
              }} />
              {i < arr.length - 1 && <div style={{ flex: 1, width: 2, background: theme.rule, marginTop: 3, minHeight: 22 }} />}
            </div>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: st.done ? theme.ink : theme.inkSoft }}>{st.l}</div>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{st.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps,
          textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10,
        }}>Preces</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(i => (
            <div key={i.key || i.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                <ProductBlob product={i.product} theme={theme} size="sm" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink }}>
                  {i.product.name} <span style={{ color: theme.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
                </div>
              </div>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink }}>
                {i.id === 'gift' ? '€0' : `€${(i.product.price * i.qty).toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: theme.rule, margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 15, fontWeight: 700, color: theme.ink }}>
          <span>Kopā</span><span style={{ fontFamily: theme.mono }}>€{lastOrder.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WishlistShareBar — discreet, anonymous wishlist sharing
// ─────────────────────────────────────────────────────────────
function WishlistShareBar({ theme, favourites = [] }) {
  const [copied, setCopied] = React.useState(false);
  // Build an anonymous share link from favourite ids (no name, no account).
  const code = (favourites || []).join('-') || 'empty';
  const link = `https://shhh.lv/v/${btoa(code).replace(/=/g, '').slice(0, 14)}`;

  const doCopy = () => {
    try {
      navigator.clipboard && navigator.clipboard.writeText(link);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const doShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Mans vēlmju saraksts', text: 'Skaties, kas man iekritis acīs 👀', url: link }).catch(() => {});
    } else {
      doCopy();
    }
  };

  return (
    <div style={{
      marginBottom: 16, padding: 16, borderRadius: theme.radius,
      background: theme.ink, color: theme.bg, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -24, top: -24, width: 110, height: 110,
        borderRadius: 999, background: theme.accent, opacity: 0.85,
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 8,
        }}>Dalies ar sarakstu 🎁</div>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 20,
          letterSpacing: theme.letterDisplay, lineHeight: 1.1, marginBottom: 6, maxWidth: '78%',
        }}>Norādi partnerim, ko vēlies</div>
        <div style={{ fontFamily: theme.body, fontSize: 12, opacity: 0.75, lineHeight: 1.45, marginBottom: 14, maxWidth: '82%' }}>
          Anonīma saite — bez tava vārda un konta. Tikai saraksts.
        </div>

        {/* Link box */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          background: 'rgba(255,255,255,0.10)', borderRadius: theme.radiusPill,
          padding: '8px 8px 8px 14px',
        }}>
          <span style={{
            flex: 1, fontFamily: theme.mono, fontSize: 12, color: theme.bg,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{link}</span>
          <button onClick={doCopy} style={{
            all: 'unset', cursor: 'pointer', flexShrink: 0,
            padding: '7px 14px', borderRadius: theme.radiusPill,
            background: theme.bg, color: theme.ink,
            fontFamily: theme.body, fontWeight: 700, fontSize: 12,
          }}>{copied ? '✓ Nokopēts' : 'Kopēt'}</button>
        </div>

        {/* Share targets */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={doShare} className="shhh-grad" style={{
            cursor: 'pointer', flex: 1, height: 42, borderRadius: theme.radiusPill,
            fontFamily: theme.body, fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>Dalīties</button>
          <a href={`https://wa.me/?text=${encodeURIComponent('Mans vēlmju saraksts 👀 ' + link)}`}
            target="_blank" rel="noopener noreferrer" style={{
            textDecoration: 'none', cursor: 'pointer',
            width: 42, height: 42, borderRadius: 999, flexShrink: 0,
            background: 'rgba(255,255,255,0.12)', color: theme.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>💬</a>
          <a href={`mailto:?subject=${encodeURIComponent('Mans vēlmju saraksts')}&body=${encodeURIComponent(link)}`}
            style={{
            textDecoration: 'none', cursor: 'pointer',
            width: 42, height: 42, borderRadius: 999, flexShrink: 0,
            background: 'rgba(255,255,255,0.12)', color: theme.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="eyeOff" size={18} color={theme.bg} /></a>
        </div>
      </div>
    </div>
  );
}
