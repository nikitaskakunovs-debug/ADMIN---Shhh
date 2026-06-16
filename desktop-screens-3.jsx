// desktop-screens-3.jsx — Confirmation, Account, Packaging, Welcome modal

// ─────────────────────────────────────────────────────────────
// CONFIRMATION
// ─────────────────────────────────────────────────────────────
function DConfirmation({ nav, lastOrder }) {
  // Safety net: a PAID order on the confirmation page always emits
  // shhh_purchase (deduped per order; lookup views excluded).
  React.useEffect(() => {
    const o = lastOrder;
    if (!o || !o.paid || o.fromLookup || !window.SHHH_TRACK) return;
    const timer = setTimeout(() => {
      const tt = o.totals || { total: o.total };
      window.SHHH_TRACK.purchase({
        orderId: o.dbRef || o.ref, dedupeKey: o.ref, payMethod: o.payMethod,
        items: o.items || [], paidTotal: tt.total != null ? tt.total : o.total, totals: tt,
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [lastOrder && lastOrder.ref]);
  if (!lastOrder) {
    return (
      <main><Section><Container>
        <div style={{ padding: '120px 0', textAlign: 'center', fontFamily: DT.body, color: DT.inkSoft }}>
          No order yet.
        </div>
      </Container></Section></main>
    );
  }
  const items = lastOrder.items.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);

  return (
    <main>
      <Section>
        <Container>
          <div style={{
            padding: '64px 0',
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56,
          }}>
            <div>
              <div className="shhh-grad" style={{
                width: 80, height: 80, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 28,
              }}>
                <DIcon name="check" size={40} color="#fff" sw={2.5} />
              </div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 80,
                letterSpacing: DT.ld, lineHeight: 0.92, margin: '0 0 18px',
              }}>It's on its way. ✨</h1>
              <p style={{
                fontFamily: DT.body, fontSize: 17, color: DT.inkSoft, lineHeight: 1.55, margin: '0 0 32px',
                maxWidth: 520,
              }}>
                You'll get one email when it ships. Nothing else. Your data is deleted 30 days after delivery.
              </p>
              <div style={{
                padding: 20, borderRadius: DT.radius,
                background: DT.ink, color: DT.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
                marginBottom: 32,
              }}>
                <div>
                  <div style={{ fontFamily: DT.body, fontSize: 10, fontWeight: 700, letterSpacing: DT.lc, textTransform: 'uppercase', opacity: 0.6 }}>
                    Order ref
                  </div>
                  <div style={{ fontFamily: DT.mono, fontSize: 22, fontWeight: 700, marginTop: 4 }}>
                    #{lastOrder.ref}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: DT.body, fontSize: 10, fontWeight: 700, letterSpacing: DT.lc, textTransform: 'uppercase', opacity: 0.6 }}>
                    Arrives
                  </div>
                  <div style={{ fontFamily: DT.body, fontSize: 17, fontWeight: 700, marginTop: 4 }}>
                    Tomorrow
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: DT.body, fontSize: 10, fontWeight: 700, letterSpacing: DT.lc, textTransform: 'uppercase', opacity: 0.6 }}>
                    Total
                  </div>
                  <div style={{ fontFamily: DT.mono, fontSize: 22, fontWeight: 700, marginTop: 4 }}>
                    €{lastOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <PrimaryBtn size="lg" onClick={() => nav('packaging')}>See how the box arrives</PrimaryBtn>
                <GhostBtn size="lg" onClick={() => nav('home')}>Back to the shop</GhostBtn>
              </div>
            </div>

            <div>
              <div style={{
                padding: 24, borderRadius: DT.radius,
                background: DT.surface, border: `1px solid ${DT.rule}`,
                marginBottom: 24,
              }}>
                <h3 style={{
                  fontFamily: DT.display, fontWeight: 800, fontSize: 22,
                  letterSpacing: DT.ld, margin: '0 0 18px', lineHeight: 1,
                }}>Status</h3>
                {[
                  { l: 'Order placed', s: 'Just now', done: true },
                  { l: 'Plain box packed', s: 'Before 4 pm today', done: false },
                  { l: 'On its way', s: 'Tonight', done: false },
                  { l: 'Arriving', s: 'Tomorrow', done: false },
                ].map((s, i, arr) => (
                  <div key={s.l} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: 999,
                        background: s.done ? DT.ink : 'transparent',
                        border: `2px solid ${s.done ? DT.ink : DT.rule}`,
                        marginTop: 4,
                      }} />
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, width: 2, background: DT.rule, marginTop: 4, minHeight: 24 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: 20, flex: 1 }}>
                      <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>{s.l}</div>
                      <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>{s.s}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: 20, borderRadius: DT.radius,
                background: DT.surface, border: `1px solid ${DT.rule}`,
              }}>
                <div style={{
                  fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: DT.lc, textTransform: 'uppercase',
                  color: DT.inkSoft, marginBottom: 14,
                }}>What's coming</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(i => (
                    <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48 }}><DProductBlob product={i.product} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 13, color: DT.ink }}>
                          {i.product.name} <span style={{ color: DT.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// ACCOUNT — Orders + Favourites + Settings
// ─────────────────────────────────────────────────────────────
function DAccount({ nav, params, orders, favourites, toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const [view, setView] = React.useState(params?.tab || 'orders');
  const favProducts = favourites.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <main>
      <Section>
        <Container>
          <div style={{ padding: '40px 0 24px' }}>
            <h1 style={{
              fontFamily: DT.display, fontWeight: 800, fontSize: 64,
              letterSpacing: DT.ld, lineHeight: 1, margin: 0,
            }}>You</h1>
            <div style={{
              padding: 18, borderRadius: DT.radius, background: DT.surfaceAlt,
              display: 'flex', gap: 14, alignItems: 'center', marginTop: 24,
            }}>
              <DIcon name="ghost" size={22} color={DT.ink} />
              <div>
                <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14 }}>Guest mode</div>
                <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, marginTop: 2 }}>
                  No account, no profile, no history kept after delivery.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {[['orders', 'Orders'], ['favourites', `Favourites${favProducts.length ? ' · ' + favProducts.length : ''}`], ['settings', 'Settings']].map(([id, l]) => (
                <button key={id} onClick={() => setView(id)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '10px 18px', borderRadius: 999,
                  background: view === id ? DT.ink : 'transparent',
                  color: view === id ? DT.bg : DT.ink,
                  border: view === id ? 'none' : `1.5px solid ${DT.rule}`,
                  fontFamily: DT.body, fontWeight: 700, fontSize: 14,
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: '12px 0 80px' }}>
            {view === 'orders' && (
              orders.length === 0 ? (
                <div style={{
                  padding: 40, textAlign: 'center', borderRadius: DT.radius,
                  border: `1.5px dashed ${DT.rule}`, maxWidth: 560,
                  fontFamily: DT.body, fontSize: 14, color: DT.inkSoft,
                }}>
                  No orders yet on this device. Use an order ref to look one up.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}>
                  {orders.map(o => (
                    <button key={o.ref} onClick={() => nav('confirmation')} style={{
                      all: 'unset', cursor: 'pointer',
                      padding: 18, borderRadius: DT.radius,
                      background: DT.surface, border: `1px solid ${DT.rule}`,
                      display: 'flex', alignItems: 'center', gap: 16,
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 10,
                        background: DT.surfaceAlt, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: DT.ink,
                      }}><DIcon name="box" size={24} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: DT.mono, fontSize: 12, color: DT.inkSoft }}>#{o.ref}</div>
                        <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 16, color: DT.ink, marginTop: 2 }}>
                          {o.items.length} pieces · €{o.total.toFixed(2)}
                        </div>
                        <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginTop: 2 }}>{o.status}</div>
                      </div>
                      <DIcon name="chev" size={18} color={DT.inkSoft} />
                    </button>
                  ))}
                </div>
              )
            )}

            {view === 'favourites' && (
              favProducts.length === 0 ? (
                <div style={{
                  padding: 40, textAlign: 'center', borderRadius: DT.radius,
                  border: `1.5px dashed ${DT.rule}`, maxWidth: 560,
                  fontFamily: DT.body, fontSize: 14, color: DT.inkSoft,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>♡</div>
                  Tap the heart on anything you like. We'll keep them here.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  {favProducts.map(p => (
                    <DProductCard key={p.id} product={p}
                      onClick={() => nav('pdp', { id: p.id })}
                      isFavourite={true}
                      onFavourite={toggleFavourite}
                      onQuickBuy={quickBuy} />
                  ))}
                </div>
              )
            )}

            {view === 'settings' && (
              <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'box', l: t('acc.discreetPack', 'Discreet packaging'), s: t('acc.discreetPackSub', 'On — outer box is unmarked') },
                  { icon: 'card', l: t('acc.anonBilling', 'Anonymous billing'), s: t('acc.anonBillingSub', 'On — appears as "NL Trading Co"') },
                  { icon: 'eyeOff', l: t('acc.autoHide', 'Auto-hide order history'), s: t('acc.autoHideSub', 'After 30 days post-delivery') },
                  { icon: 'lock', l: t('acc.biometric', 'Biometric on launch'), s: t('acc.biometricSub', 'Off — tap to enable') },
                ].map(s => (
                  <div key={s.l} style={{
                    padding: 16, borderRadius: DT.radius, background: DT.surface,
                    border: `1px solid ${DT.rule}`,
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: DT.surfaceAlt, color: DT.ink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <DIcon name={s.icon} size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>{s.l}</div>
                      <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginTop: 2 }}>{s.s}</div>
                    </div>
                    <DIcon name="chev" size={16} color={DT.inkSoft} />
                  </div>
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
// PACKAGING
// ─────────────────────────────────────────────────────────────
function DPackaging({ nav }) {
  const detail = [
    { icon: 'box', t: 'Outer box', b: 'A blank brown shipping carton. Return address reads "NL Trading Co, Rīga".' },
    { icon: 'card', t: 'Bank statement', b: 'Charged by "NL Trading Co". Nothing recognisable or searchable.' },
    { icon: 'truck', t: 'Delivery options', b: 'Locker, pickup point, or to your door across the Baltics.' },
    { icon: 'eyeOff', t: 'Email + SMS', b: 'One shipping email. No marketing. We don\'t SMS.' },
    { icon: 'ghost', t: 'Inside the box', b: 'Product, soft pouch, USB-C cable, one-page guide. Recyclable paper, no plastic.' },
    { icon: 'lock', t: 'Data deletion', b: 'Order data purged 30 days after delivery. Audited quarterly.' },
  ];

  return (
    <main>
      <Section bg={DT.bgAlt}>
        <Container>
          <div style={{
            padding: '72px 0',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                letterSpacing: DT.lc, textTransform: 'uppercase',
                color: DT.inkSoft, marginBottom: 20,
              }}>How it arrives</div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 88,
                letterSpacing: DT.ld, lineHeight: 0.92, margin: '0 0 24px',
              }}>Plain. On purpose.</h1>
              <p style={{
                fontFamily: DT.body, fontSize: 17, color: DT.inkSoft, lineHeight: 1.55, margin: 0,
                maxWidth: 520,
              }}>
                No logos. No product names. Nothing on the outside that would make a neighbour,
                a flatmate or a courier raise an eyebrow. Inside, your order is wrapped in unmarked tissue paper.
              </p>
            </div>
            <div style={{
              aspectRatio: '4/3', borderRadius: DT.radius,
              background: DT.surface, border: `1px solid ${DT.rule}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <svg viewBox="0 0 200 160" width="70%" height="70%">
                <path d="M30 50 L100 30 L170 50 L170 130 L100 150 L30 130 Z"
                  fill="#C9A878" stroke={DT.ink} strokeWidth="2" strokeLinejoin="round" />
                <path d="M30 50 L100 70 L170 50" fill="none" stroke={DT.ink} strokeWidth="2" />
                <path d="M100 70 L100 150" fill="none" stroke={DT.ink} strokeWidth="2" />
                <rect x="60" y="85" width="80" height="10" fill={DT.ink} opacity="0.15" />
              </svg>
              <div style={{
                position: 'absolute', top: 20, left: 20,
                fontFamily: DT.mono, fontSize: 10, color: DT.ink, opacity: 0.5,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>Actual outer box</div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div style={{ padding: '72px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {detail.map(s => (
                <div key={s.t} style={{
                  padding: 28, borderRadius: DT.radius,
                  background: DT.surface, border: `1px solid ${DT.rule}`,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: DT.surfaceAlt, color: DT.ink, marginBottom: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <DIcon name={s.icon} size={22} />
                  </div>
                  <div style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 22, letterSpacing: DT.ld, lineHeight: 1.1, marginBottom: 10 }}>
                    {s.t}
                  </div>
                  <div style={{ fontFamily: DT.body, fontSize: 14, color: DT.inkSoft, lineHeight: 1.5 }}>
                    {s.b}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
              <PrimaryBtn size="lg" onClick={() => nav('browse')}>
                Browse the shop &nbsp;<DIcon name="arrow" size={18} color="#fff" />
              </PrimaryBtn>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// WELCOME MODAL (desktop, centered)
// ─────────────────────────────────────────────────────────────
function DWelcomeModal({ open, onClose, onApply }) {
  const [step, setStep] = React.useState(1);
  const [forWho, setForWho] = React.useState([]);
  const [vibe, setVibe] = React.useState([]);
  if (!open) return null;

  const togglePill = (arr, set, id) =>
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);

  const WHO = [
    { id: 'straight', l: 'Straight' }, { id: 'gay', l: 'Gay' }, { id: 'lesbian', l: 'Lesbian' },
    { id: 'bipan', l: 'Bi / Pan' }, { id: 'trans', l: 'Trans-friendly' }, { id: 'ace', l: 'Asexual' },
    { id: 'rather-not', l: 'Rather not say' }, { id: 'all', l: 'Show me everything' },
  ];
  const VIBE = [
    { id: 'solo', l: 'Solo' }, { id: 'couples', l: 'With a partner' }, { id: 'group', l: 'Multiple partners' },
    { id: 'beginners', l: 'First time' }, { id: 'premium', l: 'Treat myself' }, { id: 'travel', l: 'Travel-friendly' },
    { id: 'surprise', l: 'Surprise me' },
  ];
  const intentToCat = (v) => {
    if (v.includes('beginners')) return 'beginners';
    if (v.includes('couples') || v.includes('group')) return 'couples';
    if (v.includes('premium')) return 'premium';
    if (v.includes('travel')) return 'travel';
    if (v.includes('solo')) return 'solo';
    return 'all';
  };
  const apply = () => onApply({ forWho, vibe, cat: intentToCat(vibe) });

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(15,15,15,0.55)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto',
        background: DT.bg, borderRadius: 28, padding: 36,
        boxShadow: '0 30px 60px rgba(0,0,0,0.30)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {[1, 2].map(n => (
              <div key={n} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: step >= n ? DT.ink : DT.rule,
              }} />
            ))}
          </div>
          <button onClick={() => onApply({ forWho: [], vibe: [], cat: 'all' })} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: DT.body, fontSize: 12, fontWeight: 700,
            color: DT.inkSoft, padding: '4px 8px',
          }}>Skip →</button>
        </div>

        <div style={{
          fontFamily: DT.body, fontSize: 11, fontWeight: 700,
          letterSpacing: DT.lc, textTransform: 'uppercase',
          color: DT.accent, marginBottom: 12,
        }}>{step === 1 ? 'Step 01 · You' : 'Step 02 · What you\'re after'}</div>
        <h2 style={{
          fontFamily: DT.display, fontWeight: 800, fontSize: 36,
          letterSpacing: DT.ld, lineHeight: 1, margin: '0 0 12px',
        }}>
          {step === 1
            ? <>Toys for <span className="shhh-grad-text">everyone</span> 💋 Pick what fits you.</>
            : <>Pick what you're <span className="shhh-grad-text">in the mood</span> for. 🔥</>}
        </h2>
        <p style={{
          fontFamily: DT.body, fontSize: 14, color: DT.inkSoft, lineHeight: 1.55, margin: '0 0 24px',
        }}>
          {step === 1
            ? 'Every body, every orientation, every kind of "us." Tap whatever sounds like you — we\'ll filter the shop around it.'
            : 'Tap what you\'re looking for today. We\'ll line up the pieces best suited to you.'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {(step === 1 ? WHO : VIBE).map(o => {
            const active = (step === 1 ? forWho : vibe).includes(o.id);
            return (
              <button key={o.id} onClick={() => step === 1
                ? togglePill(forWho, setForWho, o.id)
                : togglePill(vibe, setVibe, o.id)} style={{
                all: 'unset', cursor: 'pointer',
                padding: '10px 14px', borderRadius: 999,
                background: active ? DT.ink : DT.surface,
                color: active ? DT.bg : DT.ink,
                border: `1.5px solid ${active ? DT.ink : DT.rule}`,
                fontFamily: DT.body, fontWeight: 600, fontSize: 13,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {o.l}
                {active && <DIcon name="check" size={12} color={DT.bg} sw={2.2} />}
              </button>
            );
          })}
        </div>

        <div style={{
          padding: '12px 14px', background: DT.surfaceAlt,
          borderRadius: DT.radius, marginBottom: 24,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <DIcon name="lock" size={16} color={DT.ink} />
          <div style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft, lineHeight: 1.4 }}>
            <strong style={{ color: DT.ink }}>Stays on this device.</strong> We don't track. No account, no profile.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {step === 2 && (
            <GhostBtn size="md" onClick={() => setStep(1)}>← Back</GhostBtn>
          )}
          <div style={{ flex: 1 }} />
          {step === 1 ? (
            <PrimaryBtn size="md" onClick={() => setStep(2)}>
              {forWho.length === 0 ? 'Continue' : `Continue · ${forWho.length} picked`}
            </PrimaryBtn>
          ) : (
            <PrimaryBtn size="md" onClick={apply}>
              Find my picks &nbsp;<DIcon name="arrow" size={16} color="#fff" />
            </PrimaryBtn>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DConfirmation, DAccount, DPackaging, DWelcomeModal });
