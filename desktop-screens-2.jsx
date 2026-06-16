// desktop-screens-2.jsx — Cart, Checkout, Confirmation, Account, Packaging

// ─────────────────────────────────────────────────────────────
// CART — two-column: items + summary
// ─────────────────────────────────────────────────────────────
function DCart({ nav, cart, updateQty, addToCart, subtotal, appliedPromo, setAppliedPromo }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const items = cart.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const baseShip = subtotal > 60 ? 0 : 6;
  const pd = (typeof promoDiscount === 'function' && appliedPromo)
    ? (() => { try { return promoDiscount(appliedPromo, subtotal, baseShip) || {}; } catch (e) { return {}; } })()
    : {};
  const discount = pd.discount || 0;
  const shipping = (subtotal > 60 || pd.freeShipping) ? 0 : 6;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <main>
        <Section>
          <Container>
            <div style={{ padding: '120px 0', textAlign: 'center' }}>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 64,
                letterSpacing: DT.ld, lineHeight: 1, margin: '0 0 14px',
              }}>Empty bag.</h1>
              <p style={{ fontFamily: DT.body, fontSize: 16, color: DT.inkSoft, marginBottom: 28 }}>
                Take a look around. We promise we're not watching.
              </p>
              <PrimaryBtn size="lg" onClick={() => nav('browse')}>Browse the shop</PrimaryBtn>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  const pairs = items.flatMap(i => PAIRS[i.id] || [])
    .filter((id, i, arr) => arr.indexOf(id) === i && !items.find(it => it.id === id))
    .map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).slice(0, 4);

  return (
    <main>
      <Section>
        <Container>
          <div style={{ padding: '40px 0 24px' }}>
            <h1 style={{
              fontFamily: DT.display, fontWeight: 800, fontSize: 64,
              letterSpacing: DT.ld, lineHeight: 1, margin: 0,
            }}>Your bag 🛍️</h1>
          </div>
          <div style={{
            padding: '0 0 80px',
            display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48,
            alignItems: 'flex-start',
          }}>
            <div>
              {/* Gift progress */}
              <div style={{ marginBottom: 24 }}>
                <DGiftProgress subtotal={subtotal} />
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {items.map(i => (
                  <div key={i.id} style={{
                    display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20,
                    padding: 20, background: DT.surface, border: `1px solid ${DT.rule}`,
                    borderRadius: DT.radius, alignItems: 'center',
                  }}>
                    <div style={{ width: 120 }}>
                      <DProductBlob product={i.product} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: DT.display, fontWeight: 700, fontSize: 24,
                        letterSpacing: DT.ld, lineHeight: 1, color: DT.ink,
                      }}>{i.product.name}</div>
                      <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginTop: 4 }}>
                        {i.product.tagline}
                      </div>
                      {i.id === 'gift' && (
                        <div style={{
                          marginTop: 10, padding: '4px 10px', borderRadius: 999,
                          background: DT.accent, color: '#fff', display: 'inline-block',
                          fontFamily: DT.body, fontWeight: 700, fontSize: 11, letterSpacing: 0.4,
                          textTransform: 'uppercase',
                        }}>{t('cart.freeGift', 'Free gift 🎁')}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {i.id === 'gift' ? (
                        <div style={{ fontFamily: DT.mono, fontSize: 18, fontWeight: 700, color: DT.ink }}>
                          <s style={{ color: DT.inkSoft, fontWeight: 400, marginRight: 8 }}>€{i.product.retailPrice}</s>€0
                        </div>
                      ) : (
                        <>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 0,
                            border: `1px solid ${DT.rule}`, borderRadius: 999, padding: 2, marginBottom: 8,
                          }}>
                            <button onClick={() => updateQty(i.id, -1)} aria-label="Samazināt daudzumu" type="button" style={{
                              all: 'unset', cursor: 'pointer', width: 32, height: 32,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: DT.ink,
                            }}><DIcon name="minus" size={16} /></button>
                            <span style={{
                              minWidth: 28, textAlign: 'center', fontFamily: DT.mono,
                              fontSize: 14, color: DT.ink, fontWeight: 700,
                            }}>{i.qty}</span>
                            <button onClick={() => updateQty(i.id, 1)} aria-label="Palielināt daudzumu" type="button" style={{
                              all: 'unset', cursor: 'pointer', width: 32, height: 32,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: DT.ink,
                            }}><DIcon name="plus" size={16} /></button>
                          </div>
                          <div style={{ fontFamily: DT.mono, fontSize: 18, fontWeight: 700, color: DT.ink }}>
                            €{(i.product.price * i.qty).toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              {pairs.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <h3 style={{
                    fontFamily: DT.display, fontWeight: 800, fontSize: 28,
                    letterSpacing: DT.ld, margin: '0 0 16px', lineHeight: 1,
                  }}>Also pick this 💋</h3>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
                  }}>
                    {pairs.map(p => (
                      <div key={p.id} style={{
                        padding: 12, background: DT.surface, border: `1px solid ${DT.rule}`,
                        borderRadius: DT.radius,
                      }}>
                        <button onClick={() => nav('pdp', { id: p.id })} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}>
                          <DProductBlob product={p} />
                          <div style={{
                            marginTop: 10, fontFamily: DT.display, fontWeight: 700, fontSize: 16,
                            letterSpacing: DT.ld, color: DT.ink, lineHeight: 1,
                          }}>{p.name}</div>
                          <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 4 }}>
                            €{p.price}
                          </div>
                        </button>
                        <button onClick={() => addToCart(p.id)} style={{
                          all: 'unset', cursor: 'pointer', marginTop: 10, padding: '6px 0',
                          textAlign: 'center', width: '100%', borderRadius: 999,
                          background: DT.surfaceAlt, color: DT.ink,
                          fontFamily: DT.body, fontWeight: 700, fontSize: 12,
                        }}>+ Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{
              position: 'sticky', top: DT.navHeight + 20,
              padding: 28, background: DT.surface,
              border: `1px solid ${DT.rule}`, borderRadius: DT.radius,
            }}>
              <h3 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 22,
                letterSpacing: DT.ld, margin: '0 0 18px', lineHeight: 1,
              }}>Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft }}>Subtotal</span>
                <span style={{ fontFamily: DT.mono, fontSize: 14, color: DT.ink }}>€{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.accent, fontWeight: 700 }}>
                    Promo {appliedPromo?.code ? '· ' + appliedPromo.code : ''}
                  </span>
                  <span style={{ fontFamily: DT.mono, fontSize: 14, color: DT.accent, fontWeight: 700 }}>−€{discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft }}>Shipping</span>
                <span style={{ fontFamily: DT.mono, fontSize: 14, color: DT.ink }}>
                  {shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              {typeof PromoField === 'function' && (
                <div style={{ marginBottom: 18 }}>
                  <PromoField theme={DTHEME} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} compact />
                </div>
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '14px 0', borderTop: `1px solid ${DT.rule}`, marginBottom: 18,
              }}>
                <span style={{ fontFamily: DT.body, fontSize: 16, fontWeight: 700, color: DT.ink }}>Total</span>
                <span style={{ fontFamily: DT.display, fontSize: 28, fontWeight: 800, color: DT.ink, letterSpacing: DT.ld }}>
                  €{total.toFixed(2)}
                </span>
              </div>
              <PrimaryBtn size="lg" full onClick={() => nav('checkout')}>
                Check out &nbsp;<DIcon name="arrow" size={18} color="#fff" />
              </PrimaryBtn>
              <div style={{
                marginTop: 16,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              }}>
                {[
                  { icon: 'box', t: 'Plain box' },
                  { icon: 'card', t: 'NL Trading Co' },
                  { icon: 'truck', t: 'Latvia next-day' },
                  { icon: 'lock', t: 'TLS 1.3' },
                ].map(t => (
                  <div key={t.t} style={{
                    padding: '8px 10px', borderRadius: DT.radiusSm,
                    background: DT.surfaceAlt, display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: DT.body, fontSize: 11, color: DT.ink,
                  }}>
                    <DIcon name={t.icon} size={14} /> {t.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function DGiftProgress({ subtotal, threshold = GIFT_THRESHOLD }) {
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const reached = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{
      position: 'relative', borderRadius: DT.radius, overflow: 'hidden',
      background: DT.surface,
      border: `1.5px solid ${reached ? DT.accent : DT.rule}`,
      boxShadow: reached ? `0 0 0 4px ${DT.accent}1A` : 'none',
    }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: reached ? DT.accent : DT.surfaceAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>🎁</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: DT.body, fontSize: 11, fontWeight: 700,
            letterSpacing: DT.lc, textTransform: 'uppercase',
            color: reached ? DT.accent : DT.inkSoft, marginBottom: 4,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {reached ? '🎉 Unlocked' : 'Free gift'}
            <button onClick={() => setOpen(!open)} style={{
              all: 'unset', cursor: 'pointer',
              width: 16, height: 16, borderRadius: 999,
              border: `1.2px solid ${DT.inkSoft}`, color: DT.inkSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontStyle: 'italic', fontSize: 10, fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}>i</button>
          </div>
          <div style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 20, color: DT.ink, letterSpacing: DT.ld }}>
            Whisper kit
          </div>
          <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
            {reached ? <>Added to your bag · worth €{GIFT_PRODUCT.retailPrice}</> : <>€{remaining.toFixed(2)} away · spend over €{threshold}</>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: DT.mono, fontSize: 11, color: DT.inkSoft, textDecoration: 'line-through',
          }}>€{GIFT_PRODUCT.retailPrice}</div>
          <div style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 22, color: reached ? DT.accent : DT.ink, letterSpacing: DT.ld }}>
            €0
          </div>
        </div>
      </div>
      <div style={{ height: 6, background: DT.surfaceAlt }}>
        <div style={{
          height: '100%', width: pct + '%',
          background: reached ? DT.accent : DT.ink,
          transition: 'width .3s ease',
        }} />
      </div>
      {open && (
        <div style={{
          padding: 16, borderTop: `1px solid ${DT.rule}`,
          background: DT.surfaceAlt, fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, lineHeight: 1.45,
        }}>
          Silk pouch · 5 ml water-based lubricant sample · hand-written thank-you note.
          Body-safe. Recyclable wrap.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECKOUT — left form, right summary
// ─────────────────────────────────────────────────────────────
function DCheckout({ nav, cart, subtotal, onComplete, forceMode, appliedPromo, setAppliedPromo }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const items = cart.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const [step, setStep] = React.useState(forceMode === 'fast' ? 3 : 1);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [courier, setCourier] = React.useState('omniva');
  const [location, setLocation] = React.useState('omn-riga-1');
  const [paymethod, setPaymethod] = React.useState('apple');
  const [sender, setSender] = React.useState('nl');
  const [anonOpen, setAnonOpen] = React.useState(false);
  const courierObj = COURIERS.find(c => c.id === courier) || COURIERS[0];
  // Expose the contact/delivery details for the order record (same contract
  // as the mobile checkout) so placed orders carry the customer info.
  React.useEffect(() => {
    window.__shhhCheckoutDetails = {
      name: name || '', email: email || '', phone: phone || '',
      courier: courierObj ? courierObj.name : courier,
      location: location || '',
    };
  }, [name, email, phone, courier, location]);

  // ── Marketing tracking (no PII): funnel events + totals snapshot ──
  // (effects run post-render, so discount/shipping/total below are initialized)
  const dckStarted = React.useRef(false);
  React.useEffect(() => {
    if (dckStarted.current || !window.SHHH_TRACK) return;
    dckStarted.current = true;
    window.SHHH_TRACK.checkoutStarted(cart, { subtotal, shipping, discount, total });
  }, []);
  React.useEffect(() => {
    window.__shhhCheckoutTotals = { subtotal, shipping, discount, total };
  }, [subtotal, shipping, discount, total]);
  const dckCourier = React.useRef(true);
  React.useEffect(() => {
    if (dckCourier.current) { dckCourier.current = false; return; }
    if (window.SHHH_TRACK) window.SHHH_TRACK.deliverySelected(courierObj, shipping);
  }, [courier]);
  const dckPay = React.useRef(true);
  React.useEffect(() => {
    if (dckPay.current) { dckPay.current = false; return; }
    if (window.SHHH_TRACK) window.SHHH_TRACK.paymentSelected({ id: paymethod });
  }, [paymethod]);
  const baseShip = subtotal > 60 ? 0 : courierObj.price;
  const pd = React.useMemo(() => {
    if (typeof promoDiscount === 'function' && appliedPromo) {
      try { return promoDiscount(appliedPromo, subtotal, baseShip) || {}; } catch (e) { return {}; }
    }
    return {};
  }, [appliedPromo, subtotal, baseShip]);
  const discount = pd.discount || 0;
  const shipping = (subtotal > 60 || pd.freeShipping) ? 0 : courierObj.price;
  const total = Math.max(0, subtotal - discount + shipping);
  const needsAddress = courierObj.type === 'door';

  if (items.length === 0) {
    return (
      <main><Section><Container>
        <div style={{ padding: '120px 0', textAlign: 'center', fontFamily: DT.body, color: DT.inkSoft }}>
          {t('ck.emptyBag', 'Your bag is empty.')} <button onClick={() => nav('browse')} style={{ all: 'unset', cursor: 'pointer', color: DT.ink, textDecoration: 'underline', marginLeft: 6 }}>{t('ck.goShopping', 'Go shopping →')}</button>
        </div>
      </Container></Section></main>
    );
  }

  const Field = ({ label, hint, value, onChange, placeholder, type = 'text', icon }) => (
    <div style={{
      padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start',
      borderTop: `1px solid ${DT.rule}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: DT.surfaceAlt, color: DT.ink, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DIcon name={icon} size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: DT.body, fontSize: 10, fontWeight: 700,
          letterSpacing: DT.lc, textTransform: 'uppercase',
          color: DT.inkSoft, marginBottom: 2,
        }}>{label}</div>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={{
          width: '100%', boxSizing: 'border-box',
          padding: '4px 0', border: 'none', background: 'transparent',
          fontFamily: DT.body, fontSize: 16, color: DT.ink, fontWeight: 500, outline: 'none',
        }} />
        {hint && (
          <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 4 }}>{hint}</div>
        )}
      </div>
    </div>
  );

  const banks = PAYMENT_METHODS.filter(m => m.kind === 'banklink');

  return (
    <main>
      <Section>
        <Container>
          <div style={{ padding: '40px 0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 12 }}>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 56,
                letterSpacing: DT.ld, lineHeight: 1, margin: 0,
              }}>Checkout</h1>
              <span style={{ fontFamily: DT.mono, fontSize: 13, color: DT.inkSoft }}>
                Step {step} of 3
              </span>
            </div>
            {/* Step bar */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[1, 2, 3].map(n => {
                const active = step === n; const done = step > n;
                return (
                  <button key={n} onClick={() => setStep(n)} style={{
                    all: 'unset', cursor: 'pointer', flex: 1,
                    paddingBottom: 14, borderBottom: `3px solid ${active || done ? DT.ink : DT.rule}`,
                  }}>
                    <div style={{
                      fontFamily: DT.mono, fontSize: 10, fontWeight: 700,
                      color: active || done ? DT.ink : DT.inkSoft, marginBottom: 4, letterSpacing: 0.5,
                    }}>{n.toString().padStart(2, '0')}</div>
                    <div style={{
                      fontFamily: DT.body, fontWeight: 700, fontSize: 13,
                      color: active ? DT.ink : DT.inkSoft, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {n === 1 ? 'Identity' : n === 2 ? 'Delivery' : 'Pay'}
                      {done && <DIcon name="check" size={14} color={DT.accent} sw={2.2} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: '20px 0 80px',
            display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48,
            alignItems: 'flex-start',
          }}>
            <div>
              {step === 1 && (
                <>
                  <div style={{
                    padding: 24, borderRadius: DT.radius,
                    background: DT.ink, color: DT.bg, marginBottom: 24,
                    display: 'flex', alignItems: 'center', gap: 18,
                  }}>
                    <DIcon name="zap" size={24} color={DT.accent} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        Skip the form — just tap pay.
                      </div>
                      <div style={{ fontFamily: DT.body, fontSize: 13, opacity: 0.7 }}>
                        Apple Pay / Google Pay covers your name and address.
                      </div>
                    </div>
                    <PrimaryBtn onClick={() => onComplete('apple')}>⚡ Pay now · €{total.toFixed(2)}</PrimaryBtn>
                  </div>
                  <div style={{
                    background: DT.surface, border: `1.5px solid ${DT.rule}`,
                    borderRadius: DT.radius, overflow: 'hidden',
                  }}>
                    <div style={{ padding: 20 }}>
                      <h3 style={{
                        fontFamily: DT.display, fontWeight: 800, fontSize: 24,
                        letterSpacing: DT.ld, margin: 0, lineHeight: 1,
                      }}>How can we reach you? 💌</h3>
                    </div>
                    <Field label="Alias" icon="ghost" value={name} onChange={setName}
                      placeholder="M. M. (or your real name)"
                      hint="Goes on the parcel label. We don't verify." />
                    <Field label="Email" icon="eyeOff" value={email} onChange={setEmail}
                      placeholder="you+shhh@gmail.com" type="email"
                      hint="One email when it ships. Try a + alias." />
                    <Field label={needsAddress ? 'Phone (required for door)' : 'Phone — optional'}
                      icon="lock" value={phone} onChange={setPhone}
                      placeholder="+371 …" type="tel"
                      hint="Locker delivery? Phone is optional." />
                  </div>

                  <div style={{
                    marginTop: 24,
                    background: DT.surface, border: `1.5px solid ${DT.accent}`,
                    borderRadius: DT.radius, overflow: 'hidden',
                  }}>
                    <button onClick={() => setAnonOpen(!anonOpen)} style={{
                      all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                      padding: 16, display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 999,
                        background: DT.accent, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><DIcon name="ghost" size={18} color="#fff" /></div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>
                          Want to stay anonymous?
                        </div>
                        <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
                          Six things you can do.
                        </div>
                      </div>
                      <div style={{ transform: anonOpen ? 'rotate(180deg)' : 'none', color: DT.inkSoft }}>
                        <DIcon name="chevDown" size={18} />
                      </div>
                    </button>
                    {anonOpen && (
                      <div style={{
                        padding: '4px 20px 20px', display: 'grid',
                        gridTemplateColumns: '1fr 1fr', gap: 14,
                        borderTop: `1px solid ${DT.rule}`,
                      }}>
                        {[
                          ['Parcel locker', 'Omniva / Pastomat — your name only on the locker screen.'],
                          ['Alias name', "We don't verify. \"M. M.\" is a popular pick."],
                          ['+ Email alias', 'you+shhh@gmail.com routes to you, easy to filter.'],
                          ['Tap or banklink', 'Apple Pay / Google Pay / Latvian banklinks — card stays hidden.'],
                          ['"NL Trading Co"', "Bank statement reads NL Trading Co. Nothing recognisable."],
                          ['Skip the phone', 'Optional for locker delivery.'],
                        ].map(([t, b], i) => (
                          <div key={t} style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
                            <div style={{
                              width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                              background: DT.surfaceAlt, color: DT.ink,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: DT.mono, fontWeight: 700, fontSize: 10,
                            }}>{(i + 1).toString().padStart(2, '0')}</div>
                            <div>
                              <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 13, color: DT.ink, marginBottom: 2 }}>{t}</div>
                              <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, lineHeight: 1.45 }}>{b}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 style={{
                    fontFamily: DT.display, fontWeight: 800, fontSize: 28,
                    letterSpacing: DT.ld, margin: '0 0 18px', lineHeight: 1,
                  }}>{t('ck.howSend', 'How shall we send it? 📦')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {COURIERS.map(c => {
                      const active = courier === c.id;
                      return (
                        <button key={c.id} onClick={() => setCourier(c.id)} style={{
                          all: 'unset', cursor: 'pointer',
                          padding: 18, borderRadius: DT.radius,
                          background: DT.surface,
                          border: `1.5px solid ${active ? DT.ink : DT.rule}`,
                          display: 'flex', gap: 14, alignItems: 'center',
                        }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: DT.surfaceAlt, color: DT.ink, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: DT.display, fontWeight: 800, fontSize: 12,
                          }}>{c.id === 'omniva' ? 'OM' : c.id === 'pasts' ? 'LP' : c.id === 'dpd' ? 'DPD' : c.id === 'venipak' ? 'VP' : <DIcon name="truck" size={18} />}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink,
                            }}>{c.name}
                              {c.anonymous && (
                                <span style={{
                                  fontFamily: DT.body, fontSize: 9, fontWeight: 700,
                                  padding: '2px 6px', borderRadius: 4,
                                  background: DT.surfaceAlt, color: DT.inkSoft,
                                  letterSpacing: 0.3, textTransform: 'uppercase',
                                }}>Anon</span>
                              )}
                            </div>
                            <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
                              {c.sub} · {c.eta}
                            </div>
                          </div>
                          <div style={{ fontFamily: DT.mono, fontSize: 14, color: DT.ink, fontWeight: 700, flexShrink: 0 }}>
                            €{c.price.toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {courierObj.locations && (
                    <div style={{ marginTop: 24 }}>
                      <div style={{
                        fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                        letterSpacing: DT.lc, textTransform: 'uppercase',
                        color: DT.inkSoft, marginBottom: 10,
                      }}>Pick a {courierObj.type === 'locker' ? 'locker' : 'pickup point'}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {courierObj.locations.map(loc => {
                          const active = location === loc.id;
                          return (
                            <button key={loc.id} onClick={() => setLocation(loc.id)} style={{
                              all: 'unset', cursor: 'pointer',
                              padding: '14px 16px', borderRadius: DT.radiusSm,
                              background: active ? DT.ink : DT.surface,
                              color: active ? DT.bg : DT.ink,
                              border: `1.5px solid ${active ? DT.ink : DT.rule}`,
                              display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                              <DIcon name="box" size={18} color={active ? DT.bg : DT.inkSoft} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: DT.body, fontSize: 13, fontWeight: 700 }}>{loc.name}</div>
                                <div style={{ fontFamily: DT.body, fontSize: 11, color: active ? DT.bg : DT.inkSoft, opacity: active ? 0.8 : 1, marginTop: 2 }}>
                                  {loc.address}
                                </div>
                              </div>
                              <span style={{ fontFamily: DT.mono, fontSize: 11, color: active ? DT.bg : DT.inkSoft, opacity: active ? 0.8 : 1 }}>{loc.distance}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {typeof SenderLabelChooser === 'function' && (
                    <div style={{ marginTop: 24, marginLeft: -20, marginRight: -20 }}>
                      <SenderLabelChooser theme={DTHEME} value={sender} onChange={setSender} />
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h3 style={{
                    fontFamily: DT.display, fontWeight: 800, fontSize: 28,
                    letterSpacing: DT.ld, margin: '0 0 18px', lineHeight: 1,
                  }}>Pick how you pay 💳</h3>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{
                      fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase',
                      color: DT.ink, marginBottom: 10,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}><DIcon name="zap" size={14} color={DT.accent} /> Tap & pay — fastest</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {['apple', 'google'].map(id => {
                        const active = paymethod === id;
                        return (
                          <button key={id} onClick={() => setPaymethod(id)} style={{
                            all: 'unset', cursor: 'pointer',
                            height: 64, borderRadius: 999,
                            background: '#000', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            border: active ? `3px solid ${DT.accent}` : '3px solid transparent',
                            boxSizing: 'border-box',
                          }}>
                            {id === 'apple'
                              ? <><span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 500, fontSize: 22 }}>Apple Pay</span></>
                              : <><span style={{ fontFamily: 'Roboto, system-ui', fontWeight: 500, fontSize: 19 }}>
                                  <span style={{ color: '#4285F4' }}>G</span>
                                  <span style={{ color: '#EA4335' }}>o</span>
                                  <span style={{ color: '#FBBC05' }}>o</span>
                                  <span style={{ color: '#4285F4' }}>g</span>
                                  <span style={{ color: '#34A853' }}>l</span>
                                  <span style={{ color: '#EA4335' }}>e</span>
                                </span> Pay</>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{
                      fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase',
                      color: DT.ink, marginBottom: 10,
                    }}>🇱🇻 Latvian banklinks</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {banks.map(m => {
                        const active = paymethod === m.id;
                        const initial = { citadele: 'C', swedbank: 'S', seb: 'SEB', luminor: 'L' }[m.bank];
                        return (
                          <button key={m.id} onClick={() => setPaymethod(m.id)} style={{
                            all: 'unset', cursor: 'pointer',
                            padding: 16, borderRadius: DT.radius,
                            background: DT.surface,
                            border: `2px solid ${active ? DT.ink : DT.rule}`,
                            display: 'flex', flexDirection: 'column', gap: 10,
                            boxSizing: 'border-box', minHeight: 100,
                            position: 'relative',
                          }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 8,
                              background: m.color, color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, fontSize: 14,
                            }}>{initial}</div>
                            <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 13, color: DT.ink }}>
                              {m.name.replace(' banklink', '')}
                            </div>
                            <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft }}>Banklink · Anon</div>
                            {active && (
                              <div style={{
                                position: 'absolute', top: 10, right: 10,
                                width: 20, height: 20, borderRadius: 999, background: DT.ink,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}><DIcon name="check" size={12} color={DT.bg} sw={2.2} /></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase',
                      color: DT.ink, marginBottom: 10,
                    }}>Card</div>
                    <button onClick={() => setPaymethod('card')} style={{
                      all: 'unset', cursor: 'pointer', display: 'flex', width: '100%',
                      padding: 18, borderRadius: DT.radius,
                      background: DT.surface,
                      border: `2px solid ${paymethod === 'card' ? DT.ink : DT.rule}`,
                      alignItems: 'center', gap: 16, boxSizing: 'border-box',
                    }}>
                      <div style={{
                        width: 64, height: 40, borderRadius: 6,
                        background: `linear-gradient(135deg, ${DT.ink}, ${DT.inkSoft})`,
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                        padding: 6, color: '#fff',
                      }}>
                        <span style={{ fontFamily: DT.mono, fontSize: 10, fontWeight: 700 }}>•• 42</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>
                          Visa · Mastercard · Amex
                        </div>
                        <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
                          3D Secure. Tokenised.
                        </div>
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: 999,
                        border: `2px solid ${paymethod === 'card' ? DT.ink : DT.rule}`,
                        background: paymethod === 'card' ? DT.ink : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {paymethod === 'card' && <DIcon name="check" size={12} color={DT.bg} sw={2.2} />}
                      </div>
                    </button>
                  </div>

                  {/* Buy now, pay later */}
                  <div style={{ marginTop: 28 }}>
                    <div style={{
                      fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase',
                      color: DT.ink, marginBottom: 10,
                    }}>{t('ck.payBnpl', 'Pērc tagad, maksā vēlāk')}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {PAYMENT_METHODS.filter(m => m.kind === 'bnpl').map(m => {
                        const active = paymethod === m.id;
                        return (
                          <button key={m.id} onClick={() => setPaymethod(m.id)} style={{
                            all: 'unset', cursor: 'pointer',
                            padding: 16, borderRadius: DT.radius, background: DT.surface,
                            border: `2px solid ${active ? DT.ink : DT.rule}`,
                            display: 'flex', alignItems: 'center', gap: 12, boxSizing: 'border-box',
                          }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                              background: m.color || DT.ink, color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: DT.body, fontWeight: 800, fontSize: 16,
                            }}>{m.bank === 'inbank' ? 'i' : 'K'}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 13, color: DT.ink }}>{m.name}</div>
                              <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft, marginTop: 2 }}>{m.sub}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {(paymethod === 'inbank' || paymethod === 'klix') && (
                      <div style={{
                        marginTop: 12, padding: 16, borderRadius: DT.radius,
                        background: DT.surfaceAlt,
                      }}>
                        <div style={{
                          fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                          letterSpacing: DT.lc, textTransform: 'uppercase', color: DT.inkSoft, marginBottom: 10,
                        }}>Provizoriskais maksājuma grafiks</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          {[3, 6, 12, 24].map(months => {
                            const monthly = (total * 1.06) / months; // ~6% est. cost of credit
                            return (
                              <div key={months} style={{
                                flex: 1, padding: '12px 10px', borderRadius: DT.radiusSm,
                                background: DT.surface, border: `1px solid ${DT.rule}`, textAlign: 'center',
                              }}>
                                <div style={{ fontFamily: DT.mono, fontSize: 11, color: DT.inkSoft }}>{months} mēn.</div>
                                <div style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 20, color: DT.ink, letterSpacing: DT.ld, marginTop: 4 }}>
                                  €{monthly.toFixed(2)}
                                </div>
                                <div style={{ fontFamily: DT.body, fontSize: 10, color: DT.inkSoft, marginTop: 2 }}>/ mēn.</div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft, marginTop: 10, lineHeight: 1.4 }}>
                          Aptuvens aprēķins. Galīgo grafiku un GPL apstiprina {paymethod === 'inbank' ? 'Inbank' : 'Klix'} pieteikumā.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank transfer */}
                  <div style={{ marginTop: 28 }}>
                    <div style={{
                      fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase', color: DT.ink, marginBottom: 10,
                    }}>{t('ck.payTransfer', 'Bankas pārskaitījums')}</div>
                    <button onClick={() => setPaymethod('transfer')} style={{
                      all: 'unset', cursor: 'pointer', display: 'flex', width: '100%',
                      padding: 18, borderRadius: DT.radius, background: DT.surface,
                      border: `2px solid ${paymethod === 'transfer' ? DT.ink : DT.rule}`,
                      alignItems: 'center', gap: 16, boxSizing: 'border-box',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: '#3A4A5A', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><DIcon name="box" size={20} color="#fff" /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>
                          Apmaksā pēc rēķina
                        </div>
                        <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
                          Nosūtām rēķinu ar rekvizītiem · sūtām pēc apmaksas
                        </div>
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: 999,
                        border: `2px solid ${paymethod === 'transfer' ? DT.ink : DT.rule}`,
                        background: paymethod === 'transfer' ? DT.ink : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {paymethod === 'transfer' && <DIcon name="check" size={12} color={DT.bg} sw={2.2} />}
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* Action row */}
              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                {step > 1 && (
                  <GhostBtn size="lg" onClick={() => setStep(step - 1)}>← Back</GhostBtn>
                )}
                <div style={{ flex: 1 }} />
                {step < 3 ? (
                  <PrimaryBtn size="lg" onClick={() => setStep(step + 1)}>
                    Continue &nbsp;<DIcon name="arrow" size={18} color="#fff" />
                  </PrimaryBtn>
                ) : (
                  <PrimaryBtn size="lg" onClick={() => onComplete(paymethod)}>
                    {paymethod === 'transfer' ? t('ck.receiveInvoice', 'Saņemt rēķinu') : t('checkout.placeOrder', 'Place order')} · €{total.toFixed(2)}
                  </PrimaryBtn>
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={{
              position: 'sticky', top: DT.navHeight + 20,
              padding: 24, background: DT.surface,
              border: `1px solid ${DT.rule}`, borderRadius: DT.radius,
            }}>
              <h3 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 20,
                letterSpacing: DT.ld, margin: '0 0 14px', lineHeight: 1,
              }}>Order summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 44 }}>
                      <DProductBlob product={i.product} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: DT.body, fontSize: 13, fontWeight: 700, color: DT.ink }}>
                        {i.product.name} <span style={{ color: DT.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: DT.mono, fontSize: 12, color: DT.ink }}>
                      €{(i.id === 'gift' ? 0 : i.product.price * i.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: DT.rule, margin: '14px 0' }} />
              {typeof PromoField === 'function' && (
                <div style={{ marginBottom: 14 }}>
                  <PromoField theme={DTHEME} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} compact />
                </div>
              )}
              <DGiftCardField />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft }}>Subtotal</span>
                <span style={{ fontFamily: DT.mono, fontSize: 13, color: DT.ink }}>€{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: DT.body, fontSize: 12, color: DT.accent, fontWeight: 700 }}>
                    Promo {appliedPromo?.code ? '· ' + appliedPromo.code : ''}
                  </span>
                  <span style={{ fontFamily: DT.mono, fontSize: 13, color: DT.accent, fontWeight: 700 }}>−€{discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft }}>Shipping</span>
                <span style={{ fontFamily: DT.mono, fontSize: 13, color: DT.ink }}>
                  {shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>Total</span>
                <span style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 24, color: DT.ink, letterSpacing: DT.ld }}>
                  €{total.toFixed(2)}
                </span>
              </div>
              <div style={{
                marginTop: 14, padding: '10px 12px', borderRadius: DT.radiusSm,
                background: DT.surfaceAlt, fontFamily: DT.body, fontSize: 11, color: DT.inkSoft,
                lineHeight: 1.4,
              }}>
                <DIcon name="lock" size={12} color={DT.ink} /> &nbsp;TLS 1.3 encrypted · billed as <strong style={{ color: DT.ink }}>NL Trading Co</strong>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// DGiftCardField — redeem a gift card code (validates against GIFT_CARDS)
// ─────────────────────────────────────────────────────────────
function DGiftCardField() {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [result, setResult] = React.useState(null); // {balance} | 'error'
  const apply = () => {
    const card = (window.GIFT_CARDS || {})[code.trim().toUpperCase()];
    setResult(card ? { balance: card.balance } : 'error');
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: DT.body, fontSize: 12, fontWeight: 700, color: DT.ink,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>🎁 Have a gift card?</button>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={code} onChange={e => { setCode(e.target.value); setResult(null); }}
              placeholder="SHHH-GIFT-50" style={{
              flex: 1, height: 40, padding: '0 12px', borderRadius: DT.radiusSm,
              border: `1px solid ${result === 'error' ? '#E0282E' : DT.rule}`,
              background: DT.surface, fontFamily: DT.mono, fontSize: 12, color: DT.ink, outline: 'none',
              textTransform: 'uppercase',
            }} />
            <button onClick={apply} style={{
              all: 'unset', cursor: 'pointer', padding: '0 16px', borderRadius: DT.radiusSm,
              background: DT.ink, color: DT.bg, fontFamily: DT.body, fontWeight: 700, fontSize: 12,
              display: 'inline-flex', alignItems: 'center',
            }}>Apply</button>
          </div>
          {result === 'error' && (
            <div style={{ fontFamily: DT.body, fontSize: 11, color: '#E0282E', marginTop: 6 }}>
              Code not recognised. Try SHHH-GIFT-50.
            </div>
          )}
          {result && result !== 'error' && (
            <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.accent, fontWeight: 700, marginTop: 6 }}>
              ✓ Gift card balance €{result.balance.toFixed(2)} will apply at payment.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DCart, DGiftProgress, DCheckout, DGiftCardField });
