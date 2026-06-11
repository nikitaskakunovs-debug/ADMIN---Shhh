// desktop-screens-1.jsx — Home, Browse, PDP, Cart

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function DHome({ nav, subtotal, intent, openWelcome, favourites, toggleFavourite, quickBuy }) {
  const featured = PRODUCTS.slice(0, 4);
  const all = PRODUCTS;
  const isFav = (id) => favourites.includes(id);

  const trust = [
    { n: '01', icon: 'lock', title: 'You pay', body: 'Apple Pay / Google Pay / Latvian banklink. Card details never reach us.' },
    { n: '02', icon: 'box', title: 'We pack', body: 'A plain brown box. No logo, no product name. Unmarked tissue inside.' },
    { n: '03', icon: 'card', title: 'Bank statement', body: 'Charge reads "NL Trading Co". Searchable by nothing recognisable.' },
    { n: '04', icon: 'truck', title: 'Courier drops it', body: 'Locker, pickup point or your door — Omniva, DPD, Pastomat, Venipak.' },
    { n: '05', icon: 'eyeOff', title: 'We forget', body: 'Order data deleted 30 days after delivery. Zero marketing follow-up.' },
  ];

  return (
    <main>
      {/* Hero */}
      <Section bg={DT.bgAlt}>
        <Container>
          <div style={{
            padding: '64px 0 72px',
            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56,
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                letterSpacing: DT.lc, textTransform: 'uppercase',
                color: DT.inkSoft, marginBottom: 24,
              }}>Adult shop · for every body</div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 88,
                letterSpacing: DT.ld, lineHeight: 0.92,
                color: DT.ink, margin: 0, marginBottom: 24,
              }}>
                Quietly <span className="shhh-grad-text">loud.</span>{'\n'}For everyone.
              </h1>
              <p style={{
                fontFamily: DT.body, fontSize: 17, lineHeight: 1.55,
                color: DT.inkSoft, maxWidth: 520, margin: '0 0 32px',
              }}>
                A discreet shop for grown-ups of every kind. Plain box, anonymous billing,
                next-day shipping across the Baltics — and a small free gift if you spend €80.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <PrimaryBtn size="lg" onClick={() => nav('browse')}>
                  Browse the shop &nbsp;<DIcon name="arrow" size={18} color="#fff" />
                </PrimaryBtn>
                <GhostBtn size="lg" onClick={openWelcome}>
                  💘 Take the 30-sec match
                </GhostBtn>
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              maxWidth: 460,
            }}>
              {featured.map((p, i) => (
                <div key={p.id} style={{
                  transform: i % 2 === 1 ? 'translateY(24px)' : 'none',
                }}>
                  <button onClick={() => nav('pdp', { id: p.id })} style={{
                    all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                  }}>
                    <DProductBlob product={p} tint={p.swatches[0]} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Shop by category — mirrors the mobile product-type showcase */}
      <Section>
        <Container>
          <div style={{ padding: '64px 0 8px' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24,
            }}>
              <h2 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 44,
                letterSpacing: DT.ld, lineHeight: 1, margin: 0,
              }}>Shop by category 🍒</h2>
              <button onClick={() => nav('browse', { cat: 'all' })} style={{
                all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>All categories <DIcon name="arrow" size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Vibratori un stimulatori', bg: '#FCE4EC', fg: '#7A2E4A', landing: 'solo', blobColor: '#F48FB1', blob: 'M50,8 C60,8 66,18 66,42 C66,76 60,92 50,92 C40,92 34,76 34,42 C34,18 40,8 50,8 Z', span: 2 },
                { label: 'Anālie stimulatori', bg: '#EDE7F6', fg: '#4A3A6B', landing: 'couples', blobColor: '#B39DDB' },
                { label: 'Erotiskā veļa', bg: '#FCE4EC', fg: '#7A2E4A', landing: 'beginners', blobColor: '#F06292' },
                { label: 'Dildo', bg: '#FFF3E0', fg: '#6B4A1F', landing: 'premium', blobColor: '#CE93D8' },
                { label: 'Lubrikanti', bg: '#FFF8E1', fg: '#6B5A1F', landing: 'travelGear', blobColor: '#FFB74D' },
                { label: 'Prezervatīvi', bg: '#FFFDE7', fg: '#5A5520', landing: 'travel', blobColor: '#FFD54F' },
                { label: 'Masturbatori', bg: '#EDE7F6', fg: '#4A3A6B', landing: 'premiumGear', blobColor: '#9575CD' },
                { label: 'Fetišs un BDSM', bg: '#EDE7F6', fg: '#4A3A6B', landing: 'bdsm', blobColor: '#7E57C2' },
              ].map((tile, i) => (
                <button key={i} onClick={() => nav('catland', { cat: tile.landing })} style={{
                  all: 'unset', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  gridColumn: tile.span === 2 ? 'span 2' : 'span 1',
                  minHeight: 150, borderRadius: DT.radius, background: tile.bg,
                  padding: '22px 22px', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontFamily: DT.display, fontWeight: 800,
                    fontSize: tile.span === 2 ? 30 : 22,
                    letterSpacing: DT.ld, color: tile.fg, lineHeight: 1.05,
                    maxWidth: '70%', position: 'relative', zIndex: 2,
                  }}>{tile.label}</span>
                  <svg viewBox="0 0 100 100" style={{
                    position: 'absolute', right: -6, bottom: -10,
                    width: tile.span === 2 ? '32%' : '46%', height: '70%', zIndex: 1,
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.16))',
                  }}>
                    <path d={tile.blob || 'M50,10 C72,10 88,28 88,52 C88,72 72,90 50,90 C28,90 12,72 12,52 C12,28 28,10 50,10 Z'}
                      fill={tile.blobColor} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured row */}
      <Section>
        <Container>
          <div style={{
            padding: '72px 0 24px',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          }}>
            <h2 style={{
              fontFamily: DT.display, fontWeight: 800, fontSize: 56,
              letterSpacing: DT.ld, lineHeight: 1, margin: 0,
            }}>Featured 🌶️</h2>
            <button onClick={() => nav('browse')} style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>See all <DIcon name="arrow" size={16} /></button>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            paddingBottom: 24,
          }}>
            {featured.map(p => (
              <DProductCard key={p.id} product={p}
                onClick={() => nav('pdp', { id: p.id })}
                isFavourite={isFav(p.id)}
                onFavourite={toggleFavourite}
                onQuickBuy={quickBuy} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Sale — "Akcijas" rail, mirrors mobile */}
      {(() => {
        const saleItems = PRODUCTS.filter(p => (p.oldPrice && p.oldPrice > p.price) || p.clearance);
        if (saleItems.length === 0) return null;
        return (
          <Section>
            <Container>
              <div style={{ padding: '56px 0 0' }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24,
                }}>
                  <h2 style={{
                    fontFamily: DT.display, fontWeight: 800, fontSize: 44,
                    letterSpacing: DT.ld, lineHeight: 1, margin: 0,
                  }}>Akcijas 🔥</h2>
                  <button onClick={() => nav('sale')} style={{
                    all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.accent,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>Visas akcijas <DIcon name="arrow" size={16} color={DT.accent} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  {saleItems.map(p => (
                    <DProductCard key={p.id} product={p}
                      onClick={() => nav('pdp', { id: p.id })}
                      isFavourite={isFav(p.id)}
                      onFavourite={toggleFavourite}
                      onQuickBuy={quickBuy} />
                  ))}
                </div>
              </div>
            </Container>
          </Section>
        );
      })()}

      {/* Discretion strip */}
      <Section>
        <Container>
          <div style={{ padding: '72px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 36, gap: 24,
            }}>
              <div>
                <div style={{
                  fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                  letterSpacing: DT.lc, textTransform: 'uppercase',
                  color: DT.accent, marginBottom: 14,
                }}>Discretion, end to end</div>
                <h2 style={{
                  fontFamily: DT.display, fontWeight: 800, fontSize: 56,
                  letterSpacing: DT.ld, lineHeight: 1, margin: 0,
                }}>How it stays a secret. 🤫</h2>
              </div>
              <GhostBtn onClick={() => nav('packaging')}>See the box</GhostBtn>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
            }}>
              {trust.map(s => (
                <div key={s.n} style={{
                  padding: 24, borderRadius: DT.radius,
                  background: DT.surface, border: `1px solid ${DT.rule}`,
                }}>
                  <div style={{
                    fontFamily: DT.mono, fontSize: 11, fontWeight: 700,
                    color: DT.inkSoft, marginBottom: 14, letterSpacing: 0.5,
                  }}>{s.n}</div>
                  <div style={{ color: DT.ink, marginBottom: 12 }}>
                    <DIcon name={s.icon} size={22} />
                  </div>
                  <div style={{
                    fontFamily: DT.body, fontWeight: 700, fontSize: 16, color: DT.ink, marginBottom: 8,
                  }}>{s.title}</div>
                  <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, lineHeight: 1.45 }}>
                    {s.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Full set */}
      <Section bg={DT.bgAlt}>
        <Container>
          <div style={{ padding: '72px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 32,
            }}>
              <h2 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 56,
                letterSpacing: DT.ld, lineHeight: 1, margin: 0,
              }}>The full set 💋</h2>
              <div style={{ fontFamily: DT.mono, fontSize: 12, color: DT.inkSoft, letterSpacing: 0.4 }}>
                {all.length.toString().padStart(2, '0')} pieces
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            }}>
              {all.map(p => (
                <DProductCard key={p.id} product={p}
                  onClick={() => nav('pdp', { id: p.id })}
                  isFavourite={isFav(p.id)}
                  onFavourite={toggleFavourite}
                  onQuickBuy={quickBuy} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Popular brands */}
      <Section>
        <Container>
          <div style={{ padding: '72px 0 0' }}>
            <h2 style={{
              fontFamily: DT.display, fontWeight: 800, fontSize: 44,
              letterSpacing: DT.ld, lineHeight: 1, margin: '0 0 24px',
            }}>Popular brands</h2>
            {typeof PopularBrandsBlock === 'function'
              ? <PopularBrandsBlock theme={DTHEME} nav={nav} />
              : null}
            <div style={{ marginTop: 14 }}>
              <button onClick={() => nav('brands')} style={{
                all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>All 269 brands <DIcon name="arrow" size={16} /></button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Social proof */}
      <Section>
        <Container>
          <div style={{ padding: '72px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 44,
                letterSpacing: DT.ld, lineHeight: 1, margin: 0,
              }}>Quietly loved 💬</h2>
              <div style={{ fontFamily: DT.mono, fontSize: 12, color: DT.inkSoft }}>
                ★ 4.8 · 2 400+ atsauksmes
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {(FEATURED_TESTIMONIALS || []).slice(0, 3).map((r, i) => (
                <div key={i} style={{
                  padding: 28, borderRadius: DT.radius,
                  background: DT.surface, border: `1px solid ${DT.rule}`,
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <div style={{ color: DT.accent, fontSize: 15, letterSpacing: 2 }}>
                    {'★'.repeat(r.stars)}<span style={{ color: DT.rule }}>{'★'.repeat(5 - r.stars)}</span>
                  </div>
                  <div style={{ fontFamily: DT.body, fontSize: 15, color: DT.ink, lineHeight: 1.55, flex: 1 }}>
                    “{r.body}”
                  </div>
                  <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft }}>
                    <strong style={{ color: DT.ink }}>{r.name}</strong> · {r.city} · ✓ Apstiprināts pirkums
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <button onClick={() => nav('content', { key: 'reviews' })} style={{
                all: 'unset', cursor: 'pointer', fontFamily: DT.body, fontSize: 14, fontWeight: 700, color: DT.accent,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>Lasīt visas atsauksmes <DIcon name="arrow" size={16} color={DT.accent} /></button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Match prompt + Free gift dual */}
      <Section>
        <Container>
          <div style={{
            padding: '72px 0',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
          }}>
            <div style={{
              padding: 40, borderRadius: 28,
              background: DT.ink, color: DT.bg,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: -40, top: -40,
                width: 200, height: 200, borderRadius: 999, background: DT.accent, opacity: 0.85,
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: DT.lc, textTransform: 'uppercase',
                  color: DT.accent, marginBottom: 14,
                }}>Find your match</div>
                <h3 style={{
                  fontFamily: DT.display, fontWeight: 800, fontSize: 36,
                  letterSpacing: DT.ld, lineHeight: 1, margin: '0 0 12px',
                  maxWidth: 380,
                }}>Tell us a little. We'll do the matching.</h3>
                <p style={{
                  fontFamily: DT.body, fontSize: 14, opacity: 0.7, lineHeight: 1.5,
                  maxWidth: 360, margin: '0 0 24px',
                }}>
                  Pick your orientation and what you're into. 30 seconds. Stays on your device.
                </p>
                <button onClick={openWelcome} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '12px 20px', borderRadius: 999,
                  background: DT.bg, color: DT.ink,
                  fontFamily: DT.body, fontWeight: 700, fontSize: 14,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>Take the 30-sec match 💘 <DIcon name="arrow" size={16} /></button>
              </div>
            </div>

            <div style={{
              padding: 40, borderRadius: 28,
              background: DT.surface, border: `1.5px dashed ${DT.accent}`,
              display: 'flex', gap: 24, alignItems: 'center',
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: 18, background: DT.surfaceAlt, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 100 100" width="60%" height="60%">
                  <path d={GIFT_PRODUCT.blob} fill={DT.accent} />
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: DT.lc, textTransform: 'uppercase',
                  color: DT.accent, marginBottom: 10,
                }}>Free at €{GIFT_THRESHOLD}</div>
                <h3 style={{
                  fontFamily: DT.display, fontWeight: 800, fontSize: 32,
                  letterSpacing: DT.ld, margin: '0 0 8px', lineHeight: 1,
                }}>Whisper kit · on us</h3>
                <p style={{
                  fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, lineHeight: 1.5, margin: '0 0 14px',
                }}>
                  Silk pouch · 5 ml water-based lubricant sample · hand-written thank-you note.
                  Worth €{GIFT_PRODUCT.retailPrice} — yours when your order tops €{GIFT_THRESHOLD}.
                </p>
                <div style={{
                  fontFamily: DT.mono, fontSize: 11, color: DT.ink, letterSpacing: 0.4,
                }}>
                  {subtotal >= GIFT_THRESHOLD ? '✓ In your bag' : `€${(GIFT_THRESHOLD - subtotal).toFixed(2)} away`}
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
// BROWSE — sidebar filters + grid
// ─────────────────────────────────────────────────────────────
function DBrowse({ nav, params, favourites, toggleFavourite, quickBuy, openWelcome }) {
  const [filters, setFilters] = React.useState({ ...DEFAULT_FILTERS, cat: params?.cat || 'all' });
  const [sort, setSort] = React.useState('featured');
  const isFav = (id) => favourites.includes(id);
  React.useEffect(() => { if (params?.cat) setFilters(f => ({ ...f, cat: params.cat })); }, [params?.cat]);

  const list = React.useMemo(() => applyFilters(PRODUCTS, filters, sort), [filters, sort]);
  const togglePill = (key, val) => {
    const arr = filters[key] || [];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  };

  const SidebarSection = ({ title, children }) => (
    <div style={{ borderTop: `1px solid ${DT.rule}`, padding: '20px 0' }}>
      <div style={{
        fontFamily: DT.body, fontSize: 11, fontWeight: 700,
        letterSpacing: DT.lc, textTransform: 'uppercase',
        color: DT.ink, marginBottom: 14,
      }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );

  return (
    <main>
      <Section>
        <Container>
          <div style={{
            padding: '40px 0 20px',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                letterSpacing: DT.lc, textTransform: 'uppercase',
                color: DT.inkSoft, marginBottom: 10,
              }}>Catalogue</div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 68,
                letterSpacing: DT.ld, lineHeight: 1, margin: 0,
              }}>Browse 🍒</h1>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 18,
              fontFamily: DT.body, fontSize: 13, color: DT.inkSoft,
            }}>
              <span>{list.length} pieces</span>
              <span style={{ width: 1, height: 18, background: DT.rule }} />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                fontFamily: DT.body, fontSize: 13, fontWeight: 600, color: DT.ink,
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}>
                {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>Sort: {o.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{
            padding: '20px 0 80px',
            display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48,
          }}>
            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: DT.navHeight + 20, alignSelf: 'flex-start' }}>
              <SidebarSection title="Category">
                {CATEGORIES.map(c => (
                  <DPill key={c.id} active={filters.cat === c.id}
                    onClick={() => setFilters({ ...filters, cat: c.id })}>
                    {c.label} <span style={{ opacity: 0.55, fontFamily: DT.mono, fontSize: 10, marginLeft: 4 }}>{c.count}</span>
                  </DPill>
                ))}
              </SidebarSection>
              <SidebarSection title={`Price · €${filters.priceMin} – €${filters.priceMax === 200 ? '200+' : filters.priceMax}`}>
                <input type="range" min="0" max="200" step="10"
                  value={filters.priceMax}
                  onChange={e => setFilters({ ...filters, priceMax: +e.target.value })}
                  style={{ width: '100%', accentColor: DT.accent }} />
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all',   l: 'Any',   min: 0,   max: 200 },
                    { id: 'u50',   l: '<€50',  min: 0,   max: 50 },
                    { id: 'mid',   l: '€50–100', min: 50, max: 100 },
                    { id: 'over',  l: '>€100', min: 100, max: 200 },
                  ].map(b => (
                    <DPill key={b.id}
                      active={filters.priceMin === b.min && filters.priceMax === b.max}
                      onClick={() => setFilters({ ...filters, priceMin: b.min, priceMax: b.max })}>{b.l}</DPill>
                  ))}
                </div>
              </SidebarSection>
              <SidebarSection title="Features">
                {[
                  { id: 'waterproof', l: '💧 Waterproof' },
                  { id: 'rechargeable', l: '⚡ Rechargeable' },
                  { id: 'quiet', l: '🤫 Whisper-quiet' },
                  { id: 'app', l: '📱 App-controlled' },
                ].map(f => (
                  <DPill key={f.id} active={(filters.features || []).includes(f.id)}
                    onClick={() => togglePill('features', f.id)}>{f.l}</DPill>
                ))}
              </SidebarSection>
              <SidebarSection title="Material">
                {[
                  { id: 'silicone', l: 'Medical-grade silicone' },
                  { id: 'abs', l: 'Aerospace ABS' },
                ].map(m => (
                  <DPill key={m.id} active={(filters.material || []).includes(m.id)}
                    onClick={() => togglePill('material', m.id)}>{m.l}</DPill>
                ))}
              </SidebarSection>
              <SidebarSection title="Modes">
                {[0, 5, 8, 12].map(n => (
                  <DPill key={n} active={filters.modes === n}
                    onClick={() => setFilters({ ...filters, modes: n })}>{n === 0 ? 'Any' : `${n}+`}</DPill>
                ))}
              </SidebarSection>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} style={{
                all: 'unset', cursor: 'pointer', marginTop: 18,
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                color: DT.inkSoft, textDecoration: 'underline',
              }}>Clear all</button>
            </aside>

            {/* Grid */}
            <div>
              {list.length === 0 ? (
                <div style={{
                  padding: 60, textAlign: 'center', borderRadius: DT.radius,
                  border: `1.5px dashed ${DT.rule}`,
                }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🫥</div>
                  <div style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 16, color: DT.ink, marginBottom: 6 }}>
                    Nothing matches.
                  </div>
                  <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginBottom: 18 }}>
                    Try removing a filter or two.
                  </div>
                  <PrimaryBtn onClick={() => setFilters(DEFAULT_FILTERS)}>Clear all filters</PrimaryBtn>
                </div>
              ) : (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
                }}>
                  {list.map(p => (
                    <DProductCard key={p.id} product={p}
                      onClick={() => nav('pdp', { id: p.id })}
                      isFavourite={isFav(p.id)}
                      onFavourite={toggleFavourite}
                      onQuickBuy={quickBuy} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// PDP — split layout
// ─────────────────────────────────────────────────────────────
function DPDP({ nav, params, addToCart, favourites, toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const product = PRODUCTS.find(p => p.id === params?.id) || PRODUCTS[0];
  const [swatch, setSwatch] = React.useState(0);
  const [sizeIdx, setSizeIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('about');
  const isFav = favourites.includes(product.id);
  const images = product.swatches;
  const total = images.length;
  const idx = PRODUCTS.findIndex(p => p.id === product.id);
  const prev = PRODUCTS[(idx - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(idx + 1) % PRODUCTS.length];

  const tags = [];
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label;
  if (catLabel) tags.push(catLabel);
  if ((product.material || '').toLowerCase().includes('silicone')) tags.push('Silicone');
  if ((product.material || '').toLowerCase().includes('abs')) tags.push('ABS');
  if (product.waterproof) tags.push('💧 Waterproof');
  if (product.rechargeable) tags.push('⚡ Rechargeable');
  if ((product.decibels ?? 99) <= 32) tags.push('🤫 Whisper-quiet');
  if (product.modes) tags.push(`🎚 ${product.modes} modes`);
  if (product.category === 'travel') tags.push('✈️ Travel-friendly');
  if (product.category === 'couples') tags.push('💋 With a partner');

  const pairs = (PAIRS[product.id] || []).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <main>
      <Section>
        <Container>
          <div style={{
            padding: '24px 0 12px',
            fontFamily: DT.body, fontSize: 13, color: DT.inkSoft,
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <button onClick={() => nav('home')} style={{
              all: 'unset', cursor: 'pointer', color: DT.inkSoft,
            }}>Home</button>
            <span style={{ opacity: 0.4 }}>›</span>
            <button onClick={() => nav('browse')} style={{
              all: 'unset', cursor: 'pointer', color: DT.inkSoft,
            }}>Shop</button>
            <span style={{ opacity: 0.4 }}>›</span>
            <span style={{ color: DT.ink, fontWeight: 600 }}>{product.name}</span>
          </div>

          <div style={{
            padding: '20px 0 64px',
            display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56,
          }}>
            {/* Gallery */}
            <div>
              <div style={{ position: 'relative' }}>
                <DProductBlob product={product} tint={images[swatch]} />
                {total > 1 && (
                  <>
                    <button onClick={() => setSwatch((swatch - 1 + total) % total)} style={{
                      all: 'unset', cursor: 'pointer', position: 'absolute',
                      top: '50%', left: 20, transform: 'translateY(-50%)',
                      width: 48, height: 48, borderRadius: 999,
                      background: 'rgba(255,255,255,0.92)', color: DT.ink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    }}><DIcon name="chev" size={20} sw={2} color="currentColor" /><span style={{ transform: 'rotate(180deg)' }} /></button>
                    <button onClick={() => setSwatch((swatch + 1) % total)} style={{
                      all: 'unset', cursor: 'pointer', position: 'absolute',
                      top: '50%', right: 20, transform: 'translateY(-50%)',
                      width: 48, height: 48, borderRadius: 999,
                      background: 'rgba(255,255,255,0.92)', color: DT.ink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    }}><DIcon name="chev" size={20} sw={2} /></button>
                    <div style={{
                      position: 'absolute', top: 20, right: 76,
                      padding: '4px 10px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.92)', color: DT.ink,
                      fontFamily: DT.mono, fontSize: 11, fontWeight: 700,
                    }}>{(swatch + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}</div>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {images.map((c, i) => (
                  <button key={i} onClick={() => setSwatch(i)} style={{
                    all: 'unset', cursor: 'pointer',
                    width: 76, height: 76, borderRadius: 12,
                    background: c, opacity: i === swatch ? 1 : 0.6,
                    boxShadow: i === swatch ? `0 0 0 2px ${DT.ink}` : 'none',
                  }} />
                ))}
              </div>
            </div>

            {/* Detail */}
            <div>
              <div style={{
                fontFamily: DT.body, fontSize: 12, fontWeight: 700,
                letterSpacing: DT.lc, textTransform: 'uppercase',
                color: DT.inkSoft, marginBottom: 14,
              }}>{catLabel || product.category} · {product.brand || product.id}</div>
              <h1 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 64,
                letterSpacing: DT.ld, lineHeight: 0.95, margin: 0,
              }}>{product.name}</h1>
              {product.ptype && (
                <div style={{ fontFamily: DT.body, fontSize: 16, color: DT.ink, fontWeight: 600, marginTop: 12 }}>
                  {product.ptype}
                </div>
              )}
              <div style={{
                fontFamily: DT.body, fontSize: 15, color: DT.inkSoft, marginTop: 6,
              }}>{product.tagline}</div>

              {/* Price block */}
              {(() => {
                const hasOld = product.oldPrice && product.oldPrice > product.price;
                const pct = hasOld ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
                const klix = (product.price / 4).toFixed(2);
                return (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: DT.display, fontWeight: 800, fontSize: 38,
                        letterSpacing: DT.ld, color: hasOld ? DT.accent : DT.ink,
                      }}>€{product.price}</span>
                      {hasOld && (
                        <span style={{ fontFamily: DT.mono, fontSize: 18, color: DT.inkSoft, textDecoration: 'line-through' }}>€{product.oldPrice}</span>
                      )}
                      {hasOld && (
                        <span style={{
                          fontFamily: DT.body, fontSize: 12, fontWeight: 700, color: '#fff',
                          background: '#E0282E', padding: '3px 8px', borderRadius: 6,
                        }}>−{pct}%</span>
                      )}
                    </div>
                    <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, marginTop: 6 }}>
                      vai 4× €{klix} ar Klix · <span style={{ opacity: 0.8 }}>cena ar PVN</span>
                    </div>
                  </div>
                );
              })()}

              {/* Rating + stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                <button onClick={() => setTab('reviews')} style={{
                  all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: DT.accent, fontSize: 15, letterSpacing: 1 }}>
                    {'★'.repeat(Math.round(product.rating || 4.7))}{'☆'.repeat(5 - Math.round(product.rating || 4.7))}
                  </span>
                  <span style={{ fontFamily: DT.body, fontSize: 14, fontWeight: 700, color: DT.ink }}>{product.rating || 4.7}</span>
                  <span style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft, textDecoration: 'underline' }}>({product.reviewCount || 128} atsauksmes)</span>
                </button>
                {(() => {
                  const stock = typeof product.stock === 'number' ? product.stock : 8;
                  const low = stock <= 4;
                  return (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: DT.body, fontSize: 13, fontWeight: 700,
                      color: low ? '#C2410C' : '#15803D',
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: low ? '#EA580C' : '#22C55E' }} />
                      {low ? `Atlicis ${stock} gab.` : 'Pieejams'}
                    </span>
                  );
                })()}
              </div>

              {/* Code + brand */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: DT.body, fontSize: 13 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: DT.inkSoft, minWidth: 56 }}>Kods:</span>
                  <span style={{ color: DT.ink, fontFamily: DT.mono, fontWeight: 600 }}>{product.code || product.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: DT.inkSoft, minWidth: 56 }}>{t('pdp.brand', 'Zīmols:')}</span>
                  {(() => {
                    const brandName = product.brand || 'Shhh';
                    const bm = (window.BRANDS || []).find(x => x.name === brandName);
                    return (
                      <button onClick={() => bm && nav('content', { key: 'brand-' + bm.id })} style={{
                        all: 'unset', cursor: bm ? 'pointer' : 'default', color: DT.accent, fontWeight: 700,
                      }}>{brandName}</button>
                    );
                  })()}
                </div>
              </div>

              {/* Colour + size */}
              <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: DT.lc, textTransform: 'uppercase', color: DT.inkSoft, minWidth: 56,
                }}>{t('pdp.colour', 'Krāsa')}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {images.map((c, i) => (
                    <button key={i} onClick={() => setSwatch(i)}
                      aria-label={(product.colourNames || [])[i] || ('Krāsa ' + (i + 1))} style={{
                      all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999, background: c,
                      boxShadow: swatch === i ? `0 0 0 1.5px ${DT.bg}, 0 0 0 3px ${DT.ink}` : 'none',
                      border: `1px solid ${DT.rule}`,
                    }} />
                  ))}
                  {(product.colourNames || [])[swatch] && (
                    <span style={{ fontFamily: DT.body, fontSize: 14, color: DT.ink, fontWeight: 600, marginLeft: 4 }}>
                      {product.colourNames[swatch]}
                    </span>
                  )}
                </div>
              </div>
              {(product.sizes || []).length > 1 && (
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    fontFamily: DT.body, fontSize: 11, fontWeight: 700,
                    letterSpacing: DT.lc, textTransform: 'uppercase', color: DT.inkSoft, minWidth: 56,
                  }}>{t('pdp.size', 'Izmērs')}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.sizes.map((s, i) => {
                      const on = sizeIdx === i;
                      return (
                        <button key={i} onClick={() => setSizeIdx(i)} style={{
                          all: 'unset', cursor: 'pointer', minWidth: 44, textAlign: 'center',
                          padding: '8px 12px', borderRadius: 999,
                          background: on ? DT.ink : DT.surface, color: on ? DT.bg : DT.ink,
                          border: `1.5px solid ${on ? DT.ink : DT.rule}`,
                          fontFamily: DT.body, fontWeight: 700, fontSize: 13,
                        }}>{s}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filter tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24 }}>
                {tags.map((t, i) => (
                  <span key={i} style={{
                    padding: '6px 12px', borderRadius: 999,
                    background: DT.surface, border: `1px solid ${DT.rule}`,
                    fontFamily: DT.body, fontSize: 12, fontWeight: 600, color: DT.ink,
                  }}>{t}</span>
                ))}
              </div>

              {/* Spec strip */}
              <div style={{
                marginTop: 32, padding: 20, borderRadius: DT.radius,
                background: DT.surfaceAlt,
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20,
              }}>
                {[
                  ['Modes', product.modes],
                  ['Sound', product.decibels + ' dB'],
                  ['Weight', product.weight],
                  ['Waterproof', product.waterproof ? 'IPX7' : '—'],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{
                      fontFamily: DT.body, fontSize: 10, fontWeight: 700,
                      letterSpacing: DT.lc, textTransform: 'uppercase',
                      color: DT.inkSoft, marginBottom: 6,
                    }}>{l}</div>
                    <div style={{
                      fontFamily: DT.display, fontSize: 22, fontWeight: 700,
                      color: DT.ink, letterSpacing: DT.ld, lineHeight: 1,
                    }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Qty + CTAs */}
              <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: `1.5px solid ${DT.rule}`, borderRadius: 999, padding: 3, height: 56, boxSizing: 'border-box',
                }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                    all: 'unset', cursor: 'pointer', width: 38, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: DT.ink,
                  }}><DIcon name="minus" size={18} /></button>
                  <span style={{ minWidth: 28, textAlign: 'center', fontFamily: DT.mono, fontSize: 15, fontWeight: 700, color: DT.ink }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{
                    all: 'unset', cursor: 'pointer', width: 38, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: DT.ink,
                  }}><DIcon name="plus" size={18} /></button>
                </div>
                <GhostBtn size="lg"
                  onClick={() => {
                    const variant = { colour: (product.colourNames || [])[swatch], size: (product.sizes || [])[sizeIdx] };
                    for (let i = 0; i < qty; i++) addToCart(product.id, variant);
                    nav('cart');
                  }}
                  style={{ flex: 1 }}>
                  {t('pdp.addToCart', 'Add to bag')}
                </GhostBtn>
                <PrimaryBtn size="lg"
                  onClick={() => quickBuy(product.id, { colour: (product.colourNames || [])[swatch], size: (product.sizes || [])[sizeIdx] })}
                  style={{ flex: 1.2, whiteSpace: 'nowrap' }}>
                  ⚡ Buy now · €{product.price}
                </PrimaryBtn>
                <button onClick={() => toggleFavourite(product.id)} style={{
                  all: 'unset', cursor: 'pointer',
                  width: 56, height: 56, borderRadius: 999,
                  background: isFav ? DT.ink : DT.surface, color: isFav ? DT.bg : DT.ink,
                  border: `1.5px solid ${isFav ? DT.ink : DT.rule}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DIcon name={isFav ? 'heartF' : 'heart'} size={22} color={isFav ? DT.accent : 'currentColor'} />
                </button>
              </div>

              {/* Trust lines */}
              <div style={{
                marginTop: 22, padding: 14, borderRadius: DT.radiusSm,
                background: DT.surfaceAlt, display: 'flex', gap: 12, alignItems: 'center',
              }}>
                <DIcon name="lock" size={16} color={DT.ink} />
                <span style={{ fontFamily: DT.body, fontSize: 12, color: DT.inkSoft }}>
                  Plain box · billed as <strong style={{ color: DT.ink }}>NL Trading Co</strong> · ships next day across the Baltics
                </span>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex', gap: 28, marginTop: 36,
                borderBottom: `1px solid ${DT.rule}`,
              }}>
                {[['about', t('pdp.tabAbout', 'About')], ['care', t('pdp.tabCare', 'Care')], ['howto', t('pdp.tabHowto', 'Lietošana')], ['ship', t('pdp.tabShipping', 'Shipping')], ['reviews', t('pdp.tabReviews', 'Reviews')]].map(([id, l]) => (
                  <button key={id} onClick={() => setTab(id)} style={{
                    all: 'unset', cursor: 'pointer', padding: '12px 0',
                    fontFamily: DT.body, fontWeight: 700, fontSize: 14,
                    color: tab === id ? DT.ink : DT.inkSoft,
                    borderBottom: tab === id ? `2px solid ${DT.ink}` : '2px solid transparent',
                    marginBottom: -1,
                  }}>{l}</button>
                ))}
              </div>
              <div style={{
                padding: '20px 0', fontFamily: DT.body, fontSize: 14, color: DT.inkSoft, lineHeight: 1.6,
              }}>
                {tab === 'about' && (
                  <>{product.desc} Lab-tested {product.material.toLowerCase()}. Rechargeable via USB-C. Ships in a plain box with batteries and a soft pouch.</>
                )}
                {tab === 'care' && (
                  <>Rinse with warm water and a drop of mild soap. Air dry. Store in the pouch provided. Compatible with water-based lubricants only.</>
                )}
                {tab === 'ship' && (
                  <>Next-day shipping if you order by 4pm local time. Ships in an unmarked outer carton — no logos, no product names. Tracking is sent to one email. We delete it 30 days after delivery.</>
                )}
                {tab === 'howto' && (() => {
                  const usage = (typeof PRODUCT_USAGE !== 'undefined' && PRODUCT_USAGE[product.id]) || null;
                  const steps = usage && Array.isArray(usage.steps) ? usage.steps
                    : (typeof USAGE_GENERAL !== 'undefined' && Array.isArray(USAGE_GENERAL) ? USAGE_GENERAL : []);
                  return (
                    <div>
                      <div style={{ marginBottom: steps.length ? 16 : 0 }}>
                        Pirms pirmās lietošanas noskalo ar siltu ūdeni un maigām ziepēm. Lieto kopā ar ūdens bāzes lubrikantu,
                        sāc ar zemāko intensitāti un palielini pēc patikas. Pēc lietošanas notīri un izžāvē pirms uzglabāšanas.
                      </div>
                      {steps.length > 0 && (
                        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {steps.slice(0, 6).map((s, i) => (
                            <li key={i} style={{ lineHeight: 1.5 }}>{typeof s === 'string' ? s : (s.text || s.title || '')}</li>
                          ))}
                        </ol>
                      )}
                      <div style={{
                        marginTop: 18, padding: 16, borderRadius: DT.radiusSm, background: DT.surfaceAlt,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 999, background: DT.ink, color: DT.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>▶</div>
                        <div style={{ fontSize: 13, color: DT.ink }}>
                          <strong>Video instrukcija</strong> · 1:20 — kā lietot un kopt soli pa solim.
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {tab === 'reviews' && (() => {
                  const list = (typeof REVIEWS !== 'undefined' && REVIEWS[product.id]) || [];
                  const stats = (typeof reviewStats === 'function') ? reviewStats(product.id) : { count: list.length, avg: product.rating || 4.7 };
                  return (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <span style={{ fontFamily: DT.display, fontWeight: 800, fontSize: 40, color: DT.ink, letterSpacing: DT.ld }}>
                          {stats.avg || product.rating || 4.7}
                        </span>
                        <div>
                          <div style={{ color: DT.accent, fontSize: 16, letterSpacing: 1 }}>{'★'.repeat(Math.round(stats.avg || 5))}</div>
                          <div style={{ fontFamily: DT.body, fontSize: 13, color: DT.inkSoft }}>{stats.count || list.length} atsauksmes</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {list.map((r, i) => (
                          <div key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${DT.rule}`, paddingTop: i === 0 ? 0 : 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                              <span style={{ fontFamily: DT.body, fontWeight: 700, fontSize: 14, color: DT.ink }}>{r.name}</span>
                              <span style={{ fontFamily: DT.mono, fontSize: 11, color: DT.inkSoft }}>{r.date}</span>
                            </div>
                            <div style={{ color: DT.accent, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>{'★'.repeat(r.stars)}</div>
                            <div style={{ fontSize: 14, color: DT.ink, lineHeight: 1.5 }}>{r.body}</div>
                            <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft, marginTop: 6 }}>✓ Apstiprināts pirkums</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Goes well with */}
      {pairs.length > 0 && (
        <Section bg={DT.bgAlt}>
          <Container>
            <div style={{ padding: '64px 0' }}>
              <h2 style={{
                fontFamily: DT.display, fontWeight: 800, fontSize: 44,
                letterSpacing: DT.ld, margin: '0 0 28px', lineHeight: 1,
              }}>{t('pdp.goesWellWith', 'Goes well with 💘')}</h2>
              <div style={{
                display: 'grid', gridTemplateColumns: `repeat(${Math.min(pairs.length, 4)}, 1fr)`, gap: 24,
              }}>
                {pairs.map(p => (
                  <DProductCard key={p.id} product={p}
                    onClick={() => nav('pdp', { id: p.id })}
                    isFavourite={favourites.includes(p.id)}
                    onFavourite={toggleFavourite}
                    onQuickBuy={quickBuy} />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Prev / next */}
      <Section>
        <Container>
          <div style={{
            padding: '40px 0',
            display: 'flex', justifyContent: 'space-between', gap: 24,
            borderTop: `1px solid ${DT.rule}`,
          }}>
            <button onClick={() => nav('pdp', { id: prev.id })} style={{
              all: 'unset', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <DIcon name="chev" size={20} color="currentColor" />
              <span style={{
                transform: 'rotate(180deg)', display: 'inline-block',
              }} />
              <div>
                <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft, letterSpacing: DT.lc, textTransform: 'uppercase' }}>Previous</div>
                <div style={{ fontFamily: DT.display, fontWeight: 700, fontSize: 22, letterSpacing: DT.ld }}>{prev.name}</div>
              </div>
            </button>
            <button onClick={() => nav('pdp', { id: next.id })} style={{
              all: 'unset', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: DT.body, fontSize: 11, color: DT.inkSoft, letterSpacing: DT.lc, textTransform: 'uppercase' }}>Next</div>
                <div style={{ fontFamily: DT.display, fontWeight: 700, fontSize: 22, letterSpacing: DT.ld }}>{next.name}</div>
              </div>
              <DIcon name="chev" size={20} />
            </button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

Object.assign(window, { DHome, DBrowse, DPDP });
