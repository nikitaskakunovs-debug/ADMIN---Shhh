// shop-screens-1.jsx — Home, Category, Product Detail, Cart

// ─────────────────────────────────────────────────────────────
// HOME / LANDING
// ─────────────────────────────────────────────────────────────
function HomeScreen({ theme, nav, tone, heroLayout, cardStyle, intent, subtotal, openWelcome, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [trustOpen, setTrustOpen] = React.useState(false);
  const copy = DISCRETION_COPY[tone] || DISCRETION_COPY.playful;
  const featured = PRODUCTS.slice(0, 4);
  const all = PRODUCTS;
  const hasPicks = !!(intent && (intent.forWho?.length || intent.vibe?.length));
  const isFav = (id) => favourites.includes(id);

  const Hero = () => {
    if (heroLayout === 'stacked') {
      return (
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{
            background: theme.surfaceAlt, borderRadius: theme.radius,
            padding: '28px 22px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              fontFamily: theme.display, fontSize: 44, lineHeight: 0.95,
              letterSpacing: theme.letterDisplay, color: theme.ink,
              fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
              marginBottom: 14,
            }}>{copy.tagline}</div>
            <div style={{
              fontFamily: theme.body, fontSize: 14, lineHeight: 1.4, color: theme.inkSoft,
              maxWidth: 280, marginBottom: 20,
            }}>{copy.sub}</div>
            <PrimaryButton theme={theme} onClick={() => nav('category')} full={false}>
              {copy.cta} <Icon name="arrow" size={18} color={theme.bg} />
            </PrimaryButton>
          </div>
        </div>
      );
    }
    if (heroLayout === 'fullbleed') {
      const p = featured[1];
      return (
        <div style={{ padding: '0 0 24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 380, background: p.swatches[2],
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(135deg, transparent 0 18px, ${p.swatches[1]}10 18px 19px)`,
              }} />
              <svg viewBox="0 0 100 100" width="80%" height="80%" style={{
                position: 'absolute', left: '20%', top: '10%',
              }}>
                <path d={p.blob} fill={p.swatches[0]} />
              </svg>
            </div>
            <div style={{ padding: '20px 20px 0' }}>
              <div style={{
                fontFamily: theme.display, fontSize: 44, lineHeight: 0.95,
                letterSpacing: theme.letterDisplay, color: theme.ink,
                fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
                marginBottom: 10,
              }}>{copy.tagline}</div>
              <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.4, marginBottom: 18 }}>
                {copy.sub}
              </div>
              <PrimaryButton theme={theme} onClick={() => nav('category')}>{copy.cta}</PrimaryButton>
            </div>
          </div>
        </div>
      );
    }
    // editorial split
    const p = featured[0];
    return (
      <div style={{ padding: '4px 20px 28px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: theme.display, fontSize: 42, lineHeight: 0.92,
              letterSpacing: theme.letterDisplay, color: theme.ink,
              fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
              marginBottom: 12,
            }}>{copy.tagline}</div>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.4, marginBottom: 14, flex: 1 }}>
              {copy.sub}
            </div>
            <button onClick={() => nav('category')} style={{
              all: 'unset', cursor: 'pointer', alignSelf: 'flex-start',
              padding: '10px 18px', borderRadius: theme.radiusPill,
              background: theme.accent, color: theme.accentInk,
              fontFamily: theme.body, fontWeight: 600, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>{copy.cta} <Icon name="arrow" size={14} color={theme.accentInk} /></button>
          </div>
          <div style={{ width: 160, flexShrink: 0 }}>
            <HeroBanner theme={theme}
              items={[
                ...PRODUCTS.slice(0, 3).map(prod => ({ kind: 'product', product: prod })),
                {
                  kind: 'promo', kicker: 'Free at €80',
                  title: 'Whisper kit on us', sub: 'Add €80 to unlock',
                  bg: theme.ink, fg: theme.bg,
                  deco: <div style={{
                    position: 'absolute', right: -20, top: -20,
                    width: 110, height: 110, borderRadius: 999,
                    background: theme.accent, opacity: 0.85,
                  }} />,
                },
                {
                  kind: 'promo', kicker: 'Find your match',
                  title: 'Pick what fits you', sub: '30 sec · stays on device',
                  bg: theme.accent, fg: theme.accentInk,
                  deco: <div style={{
                    position: 'absolute', right: -30, bottom: -30,
                    width: 130, height: 130, borderRadius: 999,
                    background: theme.ink, opacity: 0.18,
                  }} />,
                },
              ]}
              onItemClick={(item) => {
                if (item.kind === 'product') nav('product', { id: item.product.id });
                else if (item.title.includes('match')) openWelcome && openWelcome();
                else nav('cart');
              }} />
          </div>
        </div>
      </div>
    );
  };

  const TrustStrip = () => {
    const steps = [
      { n: '01', icon: 'lock', title: t('trust.s1.title','You pay'), body: '', body: t('trust.s1.body','') },
      { n: '02', icon: 'box', title: t('trust.s2.title','We pack'), body: t('trust.s2.body','A plain brown box. No logo, no product name, no return label.') },
      { n: '03', icon: 'card', title: t('trust.s3.title','Bank statement'), body: t('trust.s3.body','Charge appears as "NL Trading Co" — nothing searchable.') },
      { n: '04', icon: 'truck', title: t('trust.s4.title','Courier drops it'), body: t('trust.s4.body','Sender reads NL Trading Co. To your door, locker, or pick-up point.') },
      { n: '05', icon: 'eyeOff', title: t('trust.s5.title','We forget'), body: t('trust.s5.body','Order data is deleted 30 days after delivery. No marketing emails. Ever.') },
    ];
    return (
      <div style={{ margin: '0 20px 28px' }}>
        <div style={{
          borderRadius: theme.radius, overflow: 'hidden',
          border: `1px solid ${theme.rule}`, background: theme.surface,
        }}>
          {/* Header — always visible, tap to expand */}
          <button onClick={() => setTrustOpen(o => !o)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', width: '100%',
            boxSizing: 'border-box', alignItems: 'center', gap: 12, padding: '16px 16px',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999, flexShrink: 0,
              background: theme.ink, color: theme.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🤫</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.accent, marginBottom: 2,
              }}>{t("home.trustKicker", "Discretion, end to end")}</div>
              <div style={{
                fontFamily: theme.display, fontSize: 20, lineHeight: 1.05,
                letterSpacing: theme.letterDisplay, color: theme.ink, fontWeight: 700,
              }}>{t("home.trustTitle", "How it stays a secret. 🤫")}</div>
            </div>
            <span style={{
              color: theme.inkSoft, fontSize: 14, flexShrink: 0,
              transform: trustOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease',
            }}>▾</span>
          </button>

          {/* Expandable steps */}
          {trustOpen && (
            <div style={{ borderTop: `1px solid ${theme.rule}` }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 16px',
                  borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
                  position: 'relative',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 999,
                    background: theme.ink, color: theme.bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: theme.mono, fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
                  }}>{s.n}</div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ color: theme.inkSoft }}><Icon name={s.icon} size={15} /></span>
                      <span style={{
                        fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink,
                        letterSpacing: -0.1,
                      }}>{s.title}</span>
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.45 }}>
                      {s.body}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => nav('packaging')} style={{
                all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                padding: '14px 16px', borderTop: `1px solid ${theme.rule}`,
                background: theme.surfaceAlt,
                fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>{t('home.trustTitle','Kā tas pienāk')} — pilns skaidrojums <Icon name="arrow" size={15} color={theme.accent} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <Hero />

      {/* Shop by category — second block */}
      <CategoryShowcase theme={theme}
        onPick={(cat) => nav('category', { cat })}
        nav={nav} />

      {/* Sale strip — high-value, near the top */}
      {(() => {
        const saleItems = PRODUCTS.filter(p => (p.oldPrice && p.oldPrice > p.price) || p.clearance);
        if (saleItems.length === 0) return null;
        return (
          <div style={{ padding: '0 0 28px' }}>
            <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{
                fontFamily: theme.display, fontWeight: 700, fontSize: 26,
                color: theme.ink, letterSpacing: theme.letterDisplay,
              }}>{t('home.saleTitle', 'Akcijas 🔥')}</div>
              <button onClick={() => nav('sale')} style={{
                all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 13,
                color: theme.accent, fontWeight: 700,
              }}>{t('home.allSales', 'Visas akcijas →')}</button>
            </div>
            <div style={{
              display: 'flex', gap: 14, padding: '0 20px', overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}>
              {saleItems.map(p => (
                <div key={p.id} style={{ flex: '0 0 180px' }}>
                  <ProductCard product={p} theme={theme} variant={cardStyle}
                    onClick={() => nav('product', { id: p.id })}
                    isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Featured / Bestsellers — curated */}
      <div style={{ padding: '0 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 26,
          color: theme.ink, letterSpacing: theme.letterDisplay,
          fontStyle: theme.italic ? 'italic' : 'normal',
        }}>{t("home.featured", "Featured 🌶️")}</div>
        <button onClick={() => nav('category')} style={{
          all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 13,
          color: theme.inkSoft, fontWeight: 500,
        }}>{t("home.seeAll", "See all")} &rarr;</button>
      </div>
      <div style={{
        padding: '12px 20px 32px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        {featured.map(p => (
          <ProductCard key={p.id} product={p} theme={theme} variant={cardStyle}
            onClick={() => nav('product', { id: p.id })}
            isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
        ))}
      </div>

      {/* Personalization: show Picked-for-you if quiz taken, else Match prompt — never both */}
      {hasPicks ? (
        <div style={{ padding: '0 20px 28px' }}>
          <button onClick={() => nav('category')} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            padding: '14px 16px', borderRadius: theme.radius,
            background: theme.accent, color: theme.accentInk,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon name="zap" size={20} color={theme.accentInk} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, letterSpacing: -0.1 }}>
                Tev izvēlēts
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                Balstīts uz tavām atbildēm. Tap, lai redzētu.
              </div>
            </div>
            <Icon name="arrow" size={18} color={theme.accentInk} />
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 20px 28px' }}>
          <MatchPromptCard theme={theme} onOpen={openWelcome} hasPicks={hasPicks} />
        </div>
      )}

      {/* How it stays a secret — trust, now lower */}
      <TrustStrip />

      {/* Free gift tile */}
      <div style={{ padding: '20px 20px 24px' }}>
        <GiftTile theme={theme} subtotal={subtotal || 0} onClick={() => nav('cart')} />
      </div>

      {/* Popular brands */}
      <div style={{ paddingBottom: 8 }}>
        <PopularBrandsBlock theme={theme} nav={nav} />
      </div>

      {/* Social proof strip — trust close near the bottom */}
      <div style={{ padding: '12px 20px 28px' }}>
        <div style={{
          padding: 20, borderRadius: theme.radius, background: theme.surfaceAlt,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 30, color: theme.ink, letterSpacing: theme.letterDisplay }}>4.8</span>
            <div>
              <div style={{ color: '#E0A800', fontSize: 14, letterSpacing: 1 }}>★★★★★</div>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>2 400+ atsauksmes</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['“Diskrēta kaste, ātra piegāde — tieši kā solīts.”', 'Anna, Rīga'],
              ['“Pasūtīju vakarā, saņēmu nākamajā dienā pakomātā.”', 'M., Liepāja'],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`, paddingTop: i === 0 ? 0 : 10 }}>
                <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, lineHeight: 1.4 }}>{q}</div>
                <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 3 }}>{a} · ✓ Apstiprināts pirkums</div>
              </div>
            ))}
          </div>
          <button onClick={() => nav('content', { key: 'reviews' })} style={{
            all: 'unset', cursor: 'pointer', marginTop: 14,
            fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
          }}>{t('home.allReviews', 'Lasīt visas atsauksmes →')}</button>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CategoryShowcase — pastel "shop by category" tile grid
// ─────────────────────────────────────────────────────────────
const SHOWCASE_TILES = [
  { cat: 'solo',      label: 'Vibratori un stimulatori', bg: '#FCE4EC', fg: '#7A2E4A', img: 'products/glow.png', span: 2, landing: 'solo', blob: 'M50,8 C60,8 66,18 66,42 C66,76 60,92 50,92 C40,92 34,76 34,42 C34,18 40,8 50,8 Z', blobColor: '#F48FB1' },
  { cat: 'couples',   label: 'Anālie stimulatori', bg: '#EDE7F6', fg: '#4A3A6B', img: 'products/halo.png', span: 1, landing: 'couples', blobColor: '#B39DDB' },
  { cat: 'beginners', label: 'Erotiskā veļa', bg: '#FCE4EC', fg: '#7A2E4A', span: 1, landing: 'beginners', blobColor: '#F06292' },
  { cat: 'premium',   label: 'Dildo', bg: '#FFF3E0', fg: '#6B4A1F', img: 'products/glow.png', span: 1, landing: 'premium', blobColor: '#CE93D8' },
  { cat: 'travel',    label: 'Lubrikanti', bg: '#FFF8E1', fg: '#6B5A1F', span: 1, landing: 'travelGear', blobColor: '#FFB74D' },
  { cat: 'all',       label: 'Prezervatīvi', bg: '#FFFDE7', fg: '#5A5520', span: 1, landing: 'travel', blobColor: '#FFD54F' },
  { cat: 'solo',      label: 'Masturbatori', bg: '#EDE7F6', fg: '#4A3A6B', span: 1, landing: 'premiumGear', blobColor: '#9575CD' },
  { cat: 'couples',   label: 'Fetišs un BDSM', bg: '#EDE7F6', fg: '#4A3A6B', img: 'products/hush-01.png', span: 1, landing: 'bdsm', blobColor: '#7E57C2' },
];

function CategoryShowcase({ theme, onPick, active, nav }) {
  return (
    <div style={{ padding: '0 20px 18px' }}>
      <div style={{
        fontFamily: theme.body, fontSize: 11, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.inkSoft, marginBottom: 12,
      }}>Shop by category 🍒</div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {SHOWCASE_TILES.map((tile, i) => (
          <button key={i} onClick={() => {
            if (tile.landing && nav) nav('catland', { cat: tile.landing });
            else onPick(tile.cat);
          }} style={{
            all: 'unset', cursor: 'pointer', position: 'relative', overflow: 'hidden',
            gridColumn: tile.span === 2 ? 'span 2' : 'span 1',
            minHeight: tile.span === 2 ? 120 : 104,
            borderRadius: 18, background: tile.bg,
            padding: '16px 16px', boxSizing: 'border-box',
            display: 'flex', alignItems: 'flex-start',
            boxShadow: (tile.cat !== 'all' && active === tile.cat) ? `0 0 0 2px ${theme.ink}` : 'none',
            transition: 'box-shadow .15s ease',
          }}>
            <span style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: tile.span === 2 ? 22 : 18,
              letterSpacing: theme.letterDisplay, color: tile.fg, lineHeight: 1.05,
              maxWidth: tile.img ? '62%' : '90%', position: 'relative', zIndex: 2,
            }}>{tile.label}</span>

            {/* Product visual */}
            {tile.img ? (
              <img src={tile.img} alt="" style={{
                position: 'absolute', right: -6, bottom: -6,
                width: '52%', height: '78%', objectFit: 'contain',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
                zIndex: 1,
              }} />
            ) : (
              <svg viewBox="0 0 100 100" style={{
                position: 'absolute', right: -8, bottom: -12,
                width: '46%', height: '70%', zIndex: 1,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.16))',
              }}>
                <path d={tile.blob || 'M50,10 C72,10 88,28 88,52 C88,72 72,90 50,90 C28,90 12,72 12,52 C12,28 28,10 50,10 Z'}
                  fill={tile.blobColor} />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORY / BROWSE
// ─────────────────────────────────────────────────────────────
function CategoryScreen({ theme, nav, cardStyle, params, intent, openWelcome, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [filters, setFilters] = React.useState({ ...DEFAULT_FILTERS, cat: params?.cat || 'all' });
  const [sort, setSort] = React.useState('featured');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  React.useEffect(() => {
    if (params?.cat) setFilters(f => ({ ...f, cat: params.cat }));
  }, [params?.cat]);
  const hasPicks = !!(intent && (intent.forWho?.length || intent.vibe?.length));
  const isFav = (id) => favourites.includes(id);

  const list = React.useMemo(() => {
    let l = applyFilters(PRODUCTS, filters, sort);
    if (params?.q) {
      const q = params.q.toLowerCase();
      l = l.filter(p =>
        p.name.toLowerCase().includes(q)
        || p.tagline.toLowerCase().includes(q)
        || (p.material || '').toLowerCase().includes(q)
      );
    }
    return l;
  }, [filters, sort, params?.q]);
  const activeCount = countActiveFilters(filters);
  const sortLabel = (SORT_OPTIONS.find(s => s.id === sort) || SORT_OPTIONS[0]).label.split(' · ')[0];

  const removeFilter = (key, val) => {
    if (key === 'cat') setFilters({ ...filters, cat: 'all' });
    else if (key === 'price') setFilters({ ...filters, priceMin: 0, priceMax: 200 });
    else if (key === 'modes') setFilters({ ...filters, modes: 0 });
    else if (key === 'inStockOnly') setFilters({ ...filters, inStockOnly: false });
    else if (key === 'newOnly') setFilters({ ...filters, newOnly: false });
    else if (key === 'saleOnly') setFilters({ ...filters, saleOnly: false });
    else if (val) setFilters({ ...filters, [key]: filters[key].filter(x => x !== val) });
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 34,
          color: theme.ink, letterSpacing: theme.letterDisplay,
          fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1,
        }}>{t("browse.title", "Browse 🍒")}</div>
        <button onClick={() => nav('home')} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
        }}><Icon name="close" size={22} /></button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 20px 16px' }}>
        <button onClick={() => nav('search')} style={{
          all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%',
          height: 44, borderRadius: theme.radiusPill, background: theme.surfaceAlt,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
        }}>
          <Icon name="search" size={18} color={theme.inkSoft} />
          <span style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft }}>
            Meklē pēc nosaukuma, noskaņas, materiāla…
          </span>
        </button>
      </div>

      {/* Shop-by-category showcase */}
      <CategoryShowcase theme={theme} onPick={(cat) => setFilters({ ...filters, cat })} active={filters.cat} nav={nav} />

      {/* Quick category chips (kept for fast nav) */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 20px 14px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        {CATEGORIES.map(c => {
          const active = filters.cat === c.id;
          return (
            <button key={c.id} onClick={() => setFilters({ ...filters, cat: c.id })} style={{
              all: 'unset', cursor: 'pointer', flexShrink: 0,
              padding: '8px 14px', borderRadius: theme.radiusPill,
              background: active ? theme.ink : 'transparent',
              color: active ? theme.bg : theme.ink,
              border: active ? 'none' : `1.5px solid ${theme.rule}`,
              fontFamily: theme.body, fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              <span style={{ opacity: 0.6, fontFamily: theme.mono, fontSize: 11 }}>
                {(c.count || 0).toString().padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter / sort bar */}
      <FilterBar theme={theme}
        onOpenFilters={() => setFiltersOpen(true)}
        onOpenSort={() => setSortOpen(true)}
        activeCount={activeCount}
        sortLabel={sortLabel}
        productCount={list.length}
        filters={filters}
        removeFilter={removeFilter} />

      {/* Match prompt — inline in browse */}
      <div style={{ padding: '0 20px 16px' }}>
        <MatchPromptCard theme={theme} onOpen={openWelcome} hasPicks={hasPicks} compact />
      </div>

      {/* Product grid */}
      {list.length === 0 ? (
        <div style={{
          margin: '0 20px 24px', padding: 28, textAlign: 'center',
          borderRadius: theme.radius, border: `1.5px dashed ${theme.rule}`,
        }}>
          <div style={{ fontSize: 22, marginBottom: 10 }}>🫥</div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, fontWeight: 600, marginBottom: 4 }}>
            Nothing matches those filters yet.
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginBottom: 14 }}>
            Try removing one or two and we'll find something for you.
          </div>
          <button onClick={() => setFilters(DEFAULT_FILTERS)} style={{
            all: 'unset', cursor: 'pointer', padding: '8px 14px',
            borderRadius: theme.radiusPill, background: theme.ink, color: theme.bg,
            fontFamily: theme.body, fontWeight: 700, fontSize: 12,
          }}>Clear all filters</button>
        </div>
      ) : (
        <div style={{
          padding: '0 20px 24px',
          display: cardStyle === 'textled' ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: '1fr 1fr', gap: cardStyle === 'textled' ? 10 : 16,
        }}>
          {list.map(p => (
            <ProductCard key={p.id} product={p} theme={theme} variant={cardStyle}
              onClick={() => nav('product', { id: p.id })}
              isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
          ))}
        </div>
      )}

      {/* Sheet + popover overlays */}
      <FilterSheet theme={theme} open={filtersOpen} onClose={() => setFiltersOpen(false)}
        filters={filters} setFilters={setFilters} productCount={list.length} />
      <SortPopover theme={theme} open={sortOpen} value={sort}
        onChange={setSort} onClose={() => setSortOpen(false)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT DETAIL
// ─────────────────────────────────────────────────────────────
function ProductScreen({ theme, nav, params, addToCart, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const product = PRODUCTS.find(p => p.id === params?.id) || PRODUCTS[0];
  const [swatch, setSwatch] = React.useState(0);
  const [imgIdx, setImgIdx] = React.useState(0);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const pickColour = (i) => { setSwatch(i); setImgIdx(0); };
  const [sizeIdx, setSizeIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [savedToast, setSavedToast] = React.useState(false);
  const [flowToast, setFlowToast] = React.useState(null);
  React.useEffect(() => {
    if (params?.toast) {
      setFlowToast(params.toast);
      const id = setTimeout(() => setFlowToast(null), 2200);
      return () => clearTimeout(id);
    }
  }, [params?.id, params?.toast]);
  const [addedSheet, setAddedSheet] = React.useState(null);
  const [pairPrompt, setPairPrompt] = React.useState(null);
  const heroRef = React.useRef(null);
  const [tab, setTab] = React.useState('about');
  const [localReviews, setLocalReviews] = React.useState([]);
  const isFav = favourites.includes(product.id);
  return (
    <div style={{ paddingBottom: 120, position: 'relative' }}>
      {flowToast && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          zIndex: 70, padding: '12px 18px', borderRadius: 14,
          background: theme.ink, color: theme.bg,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: theme.body, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999, background: '#22C55E', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icon name="check" size={14} color="#fff" strokeWidth={2.6} /></span>
          {flowToast}
        </div>
      )}
      {savedToast && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, padding: '10px 18px', borderRadius: 999,
          background: theme.ink, color: theme.bg,
          fontFamily: theme.body, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>{t('pdp.saved', 'Saglabāts ♥')}</div>
      )}
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 20px 10px',
      }}>
        <button onClick={() => nav('home')} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          borderRadius: 999, background: theme.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.ink, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}><Icon name="back" size={22} /></button>
        <button onClick={() => { toggleFavourite && toggleFavourite(product.id); if (!isFav) { setSavedToast(true); setTimeout(() => setSavedToast(false), 1800); } }} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          borderRadius: 999, background: isFav ? theme.ink : theme.surface,
          color: isFav ? theme.bg : theme.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          {isFav
            ? <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 20C12 20 4 14.5 4 9C4 6.5 5.79 5 8 5C9.5 5 11 6 12 7.5C13 6 14.5 5 16 5C18.21 5 20 6.5 20 9C20 14.5 12 20 12 20Z" fill={theme.accent} /></svg>
            : <Icon name="heart" size={20} />}
        </button>
      </div>

      {/* Hero — per-product image carousel (cycles through colour variants) */}
      {/* Hero — per-colour photo gallery (colour = variant axis, gallery = photo axis) */}
      {(() => {
        const VIEW_LABELS = ['Priekšpuse', 'Sānskats', 'Tuvplāns', 'Komplektā', 'Mērogs'];
        const VIEW_TF = ['scale(1)', 'scale(1.18) translateY(4%)', 'scale(1.5)', 'scale(0.82) rotate(-8deg)', 'scale(0.92) rotate(6deg)'];
        const colourTint = product.swatches[swatch];
        const photos = VIEW_LABELS.length; // 5 photos per colour
        const showPrev = () => setImgIdx((imgIdx - 1 + photos) % photos);
        const showNext = () => setImgIdx((imgIdx + 1) % photos);
        const ArrowBtn = ({ side, onClick }) => (
          <button onClick={onClick} aria-label={side === 'left' ? 'Iepriekšējais foto' : 'Nākamais foto'} style={{
            all: 'unset', cursor: 'pointer',
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [side]: 12, zIndex: 3,
            width: 40, height: 40, borderRadius: 999,
            background: 'rgba(255,255,255,0.92)', color: theme.ink,
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d={side === 'left' ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        );
        return (
          <div style={{ padding: '0 20px 14px' }}>
            <div ref={heroRef} style={{ position: 'relative', borderRadius: theme.radius, overflow: 'hidden' }}>
              {/* the photo view: zoom/angle transform makes each of the 5 visibly distinct */}
              <div style={{ transform: VIEW_TF[imgIdx], transformOrigin: 'center', transition: 'transform .3s ease' }}>
                <ProductBlob product={product} theme={theme} size="lg" tint={colourTint} />
              </div>
              <ArrowBtn side="left" onClick={showPrev} />
              <ArrowBtn side="right" onClick={showNext} />
              {/* view label + counter */}
              <div style={{
                position: 'absolute', top: 16, right: 32,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.92)', color: theme.ink,
                fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
                letterSpacing: 0.5, zIndex: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>{(imgIdx + 1)} / {photos}</div>
              <div style={{
                position: 'absolute', top: 16, left: 16,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.92)', color: theme.ink,
                fontFamily: theme.body, fontSize: 10, fontWeight: 700, zIndex: 3,
              }}>{VIEW_LABELS[imgIdx]}</div>
              {/* Status badge stack (bottom-left of gallery) */}
              <div style={{
                position: 'absolute', bottom: 14, left: 14, zIndex: 3,
                display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start',
              }}>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span style={{ padding: '4px 9px', borderRadius: 6, background: '#E0282E', color: '#fff', fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>−{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                )}
                {product.isNew && (
                  <span style={{ padding: '4px 9px', borderRadius: 6, background: '#1F8A4C', color: '#fff', fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>{t('pdp.badgeNew', 'Jaunums')}</span>
                )}
                {product.clearance && (
                  <span style={{ padding: '4px 9px', borderRadius: 6, background: '#E07B00', color: '#fff', fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>{t('pdp.badgeSale', 'Izpārdošana')}</span>
                )}
                {product.badge === 'Bestseller' && (
                  <span style={{ padding: '4px 9px', borderRadius: 6, background: theme.ink, color: theme.bg, fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>{t('pdp.badgeBestseller', 'Bestsellers')}</span>
                )}
                {product.stock === 'low' && (
                  <span style={{ padding: '4px 9px', borderRadius: 6, background: '#fff', color: '#E0282E', border: '1px solid #E0282E', fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>Atlicis 2 gab.</span>
                )}
              </div>
            </div>
            {/* Thumbnail strip — the 5 photos of the selected colour */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
              {VIEW_LABELS.map((lbl, i) => (
                <button key={i} onClick={() => setImgIdx(i)} aria-label={lbl} style={{
                  all: 'unset', cursor: 'pointer', flexShrink: 0,
                  width: 56, height: 56, borderRadius: theme.radiusSm, overflow: 'hidden',
                  position: 'relative',
                  boxShadow: i === imgIdx ? `0 0 0 2px ${theme.ink}` : `0 0 0 1px ${theme.rule}`,
                }}>
                  <div style={{ transform: VIEW_TF[i], transformOrigin: 'center' }}>
                    <ProductBlob product={product} theme={theme} size="sm" tint={colourTint} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Title block */}
      <div style={{ padding: '0 22px 18px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 600,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 6,
        }}>{(window.CATEGORIES?.find(c => c.id === product.category)?.label || product.category)} · {product.brand || product.id}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <div style={{
            fontFamily: theme.display, fontSize: 34, lineHeight: 1.0,
            letterSpacing: theme.letterDisplay, color: theme.ink,
            fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
            flex: 1, minWidth: 0,
          }}>{product.name}</div>
        </div>
        {product.ptype && (
          <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.ink, fontWeight: 600, marginTop: 6 }}>
            {product.ptype}
          </div>
        )}
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginTop: 4 }}>
          {product.tagline}
        </div>

        {/* Price block */}
        {(() => {
          const hasOld = product.oldPrice && product.oldPrice > product.price;
          const pct = hasOld ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
          const klix = (product.price / 4).toFixed(2);
          return (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: theme.display, fontWeight: 800, fontSize: 32,
                  letterSpacing: theme.letterDisplay,
                  color: hasOld ? theme.accent : theme.ink,
                }}>€{product.price}</span>
                {hasOld && (
                  <span style={{ fontFamily: theme.mono, fontSize: 16, color: theme.inkSoft, textDecoration: 'line-through' }}>€{product.oldPrice}</span>
                )}
                {hasOld && (
                  <span style={{
                    fontFamily: theme.body, fontSize: 12, fontWeight: 700, color: '#fff',
                    background: '#E0282E', padding: '3px 8px', borderRadius: 6,
                  }}>−{pct}%</span>
                )}
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>
                vai 4× €{klix} ar Klix · <span style={{ opacity: 0.8 }}>cena ar PVN</span>
              </div>
            </div>
          );
        })()}

        {/* Review summary + stock signal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setTab('reviews')} style={{
            all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: theme.accent, fontSize: 14, letterSpacing: 1 }}>{'★'.repeat(Math.round(product.rating || 4.7))}{'☆'.repeat(5 - Math.round(product.rating || 4.7))}</span>
            <span style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.ink }}>{product.rating || 4.7}</span>
            <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, textDecoration: 'underline' }}>({product.reviewCount || 128} atsauksmes)</span>
          </button>
          {(() => {
            const stock = product.stock ?? 8;
            const low = stock <= 4;
            return (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: theme.body, fontSize: 12, fontWeight: 700,
                color: low ? '#C2410C' : '#15803D',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: low ? '#EA580C' : '#22C55E' }} />
                {low ? `Atlicis ${stock} gab.` : 'Pieejams'}
              </span>
            );
          })()}
        </div>
        <div style={{
          marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6,
          fontFamily: theme.body, fontSize: 13,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: theme.inkSoft, minWidth: 56 }}>Kods:</span>
            <span style={{ color: theme.ink, fontFamily: theme.mono, fontWeight: 600 }}>{product.code || product.id}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: theme.inkSoft, minWidth: 56 }}>{t('pdp.brand', 'Zīmols:')}</span>
            {(() => {
              const brandName = product.brand || 'Shhh';
              const bm = (window.BRANDS || []).find(x => x.name === brandName);
              return (
                <button onClick={() => bm && nav('content', { key: 'brand-' + bm.id })} style={{
                  all: 'unset', cursor: bm ? 'pointer' : 'default',
                  color: theme.accent, fontWeight: 700,
                }}>{brandName}</button>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Swatches */}
      <div style={{ padding: '0 22px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 600,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, minWidth: 56,
        }}>{t('pdp.colour', 'Krāsa')}</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {product.swatches.map((c, i) => (
            <button key={i} onClick={() => pickColour(i)} aria-label={(product.colourNames || [])[i] || ('Krāsa ' + (i+1))} style={{
              all: 'unset', cursor: 'pointer', width: 30, height: 30,
              borderRadius: 999, background: c,
              boxShadow: swatch === i ? `0 0 0 1.5px ${theme.bg}, 0 0 0 3px ${theme.ink}` : 'none',
              border: `1px solid ${theme.rule}`,
            }} />
          ))}
          {(product.colourNames || [])[swatch] && (
            <span style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, fontWeight: 600, marginLeft: 4 }}>
              {product.colourNames[swatch]}
            </span>
          )}
        </div>
      </div>

      {/* Size selector */}
      {(product.sizes || []).length > 1 && (
        <div style={{ padding: '0 22px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 600,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, minWidth: 56,
          }}>{t('pdp.size', 'Izmērs')}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.sizes.map((s, i) => {
              const on = sizeIdx === i;
              return (
                <button key={i} onClick={() => setSizeIdx(i)} style={{
                  all: 'unset', cursor: 'pointer', minWidth: 44, textAlign: 'center',
                  padding: '8px 12px', borderRadius: theme.radiusPill,
                  background: on ? theme.ink : theme.surface,
                  color: on ? theme.bg : theme.ink,
                  border: `1.5px solid ${on ? theme.ink : theme.rule}`,
                  fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                }}>{s}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tags — every filter that applies to this product */}
      {(() => {
        const tags = [];
        const catLabel = CATEGORIES.find(c => c.id === product.category)?.label;
        if (catLabel) tags.push({ icon: null, label: catLabel });
        if ((product.material || '').toLowerCase().includes('silicone'))
          tags.push({ icon: null, label: 'Silicone' });
        if ((product.material || '').toLowerCase().includes('abs'))
          tags.push({ icon: null, label: 'ABS' });
        if (product.waterproof) tags.push({ emoji: '💧', label: 'Waterproof' });
        if (product.rechargeable) tags.push({ emoji: '⚡', label: 'Rechargeable' });
        if ((product.decibels ?? 99) <= 32) tags.push({ emoji: '🤫', label: 'Whisper-quiet' });
        if (product.id === 'glow') tags.push({ emoji: '📱', label: 'App-controlled' });
        if (product.modes) tags.push({ emoji: '🎚', label: product.modes + ' modes' });
        if (product.category === 'travel') tags.push({ emoji: '✈️', label: 'Travel-friendly' });
        if (product.category === 'beginners') tags.push({ emoji: '🌸', label: 'First time' });
        if (product.category === 'premium') tags.push({ emoji: '✨', label: 'Treat myself' });
        if (product.category === 'couples') tags.push({ emoji: '💋', label: 'With a partner' });

        return (
          <div style={{
            padding: '0 22px 18px',
            display: 'flex', flexWrap: 'wrap', gap: 6,
          }}>
            {tags.map((tag, i) => (
              <button key={i} onClick={() => nav('category', { tag: tag.label })} style={{
                all: 'unset', cursor: 'pointer',
                padding: '6px 10px', borderRadius: theme.radiusPill,
                background: theme.surface, color: theme.ink,
                border: `1px solid ${theme.rule}`,
                fontFamily: theme.body, fontWeight: 600, fontSize: 11,
                letterSpacing: -0.1,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                {tag.emoji && <span style={{ fontSize: 12 }}>{tag.emoji}</span>}
                {tag.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Spec strip */}
      <div style={{
        margin: '0 20px 20px', padding: 16, borderRadius: theme.radius,
        background: theme.surface, border: `1px solid ${theme.rule}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        {[
          { label: t('pdp.modes', 'Modes'), val: product.modes },
          { label: t('pdp.sound', 'Sound'), val: product.decibels + ' dB' },
          { label: t('pdp.weight', 'Weight'), val: product.weight },
          { label: t('pdp.waterproof', 'Waterproof'), val: product.waterproof ? 'IPX7' : '—' },
        ].map(s => (
          <div key={s.label}>
            <div style={{
              fontFamily: theme.body, fontSize: 10, fontWeight: 600,
              letterSpacing: theme.letterCaps, textTransform: 'uppercase',
              color: theme.inkSoft, marginBottom: 4,
            }}>{s.label}</div>
            <div style={{
              fontFamily: theme.display, fontSize: 22, color: theme.ink,
              letterSpacing: theme.letterDisplay, fontWeight: 700,
              fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1,
            }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 22px 12px', display: 'flex', gap: 18, borderBottom: `1px solid ${theme.rule}`, margin: '0 0 16px' }}>
        {[['about', t('pdp.tabAbout', 'About')], ['care', t('pdp.tabCare', 'Care')], ['howto', t('pdp.tabHowto', 'Lietošana')], ['ship', t('pdp.tabShip', 'Shipping')], ['reviews', t('pdp.tabReviews', 'Reviews')]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            all: 'unset', cursor: 'pointer', padding: '10px 0',
            fontFamily: theme.body, fontWeight: 600, fontSize: 14,
            color: tab === id ? theme.ink : theme.inkSoft,
            borderBottom: tab === id ? `2px solid ${theme.ink}` : '2px solid transparent',
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>
      <div style={{ padding: '0 22px 28px', fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55 }}>
        {tab === 'about' && (() => {
          const full = `${product.desc} Lab-tested ${product.material.toLowerCase()}. Rechargeable via USB-C. Ships in a plain box, with batteries and a soft pouch.`;
          return (
            <div>
              <div style={{
                display: '-webkit-box',
                WebkitLineClamp: aboutOpen ? 'unset' : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{full}</div>
              <button onClick={() => setAboutOpen(o => !o)} style={{
                all: 'unset', cursor: 'pointer', marginTop: 8,
                fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
              }}>{aboutOpen ? t('pdp.readLess', 'Rādīt mazāk') : t('pdp.readMore', 'Lasīt vairāk')}</button>
            </div>
          );
        })()}
        {tab === 'care' && (
          <>Rinse with warm water and a drop of mild soap. Air dry. Store in the pouch provided.
          Compatible with water-based lubricants only. Avoid silicone-based lubricants.</>
        )}
        {tab === 'howto' && (() => {
          const u = (window.PRODUCT_USAGE || {})[product.id];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Video block */}
              <div style={{
                aspectRatio: '16/9', borderRadius: theme.radius, overflow: 'hidden',
                background: theme.surfaceAlt, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${theme.rule}`,
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `repeating-linear-gradient(135deg, transparent 0 16px, ${theme.ink}06 16px 17px)`,
                }} />
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 999, margin: '0 auto 8px',
                    background: theme.ink, color: theme.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill={theme.bg} /></svg>
                  </div>
                  <div style={{ fontFamily: theme.body, fontSize: 12, fontWeight: 600, color: theme.inkSoft }}>
                    Video pamācība · {product.name}
                  </div>
                  <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, opacity: 0.7, marginTop: 2 }}>
                    1:24 · klusa, bez skaņas
                  </div>
                </div>
              </div>

              {/* Text steps */}
              <div>
                <div style={{
                  fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                  color: theme.inkSoft, marginBottom: 10,
                }}>Soli pa solim</div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {(u ? u.steps : [
                    'Pirms pirmās lietošanas nomazgā ar siltu ūdeni un maigām ziepēm.',
                    'Uzlādē pilnībā vai ievieto baterijas.',
                    'Uzklāj ūdens bāzes lubrikantu.',
                    'Ieslēdz un izvēlies sev tīkamāko režīmu.',
                    'Pēc lietošanas notīri un uzglabā maisiņā.',
                  ]).map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '7px 0' }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                        background: theme.ink, color: theme.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
                      }}>{i + 1}</span>
                      <span style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5 }}>{s}</span>
                    </li>
                  ))}
                </ol>
                {u && u.tip && (
                  <div style={{
                    marginTop: 12, padding: '10px 12px', borderRadius: theme.radiusSm,
                    background: theme.surfaceAlt, display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 14 }}>💡</span>
                    <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.ink, lineHeight: 1.45 }}>{u.tip}</span>
                  </div>
                )}
                <button onClick={() => nav('content', { key: 'usage' })} style={{
                  all: 'unset', cursor: 'pointer', marginTop: 12,
                  fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>{t('pdp.fullInstructions', 'Pilnās instrukcijas')} <Icon name="arrow" size={14} color={theme.accent} /></button>
              </div>
            </div>
          );
        })()}
        {tab === 'ship' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {[
                { icon: 'truck', t: 'Piegāde nākamajā dienā', s: 'Pasūti līdz 16:00 — nosūtām tajā pašā dienā' },
                { icon: 'box', t: 'Neapzīmēta kaste', s: 'Bez logo, bez produkta nosaukuma, bez mūsu vārda' },
                { icon: 'eyeOff', t: 'Diskrēta izsekošana', s: 'Viens e-pasts · datus dzēšam 30 dienas pēc piegādes · bez mārketinga' },
              ].map((x, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: theme.radius,
                  background: theme.surfaceAlt,
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                    background: theme.bg, color: theme.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={x.icon} size={19} />
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>{x.t}</div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{x.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'reviews' && (() => {
          const base = (window.REVIEWS || {})[product.id] || [];
          const list = [...localReviews, ...base];
          const all = list.length ? list : base;
          const avg = all.length ? Math.round(all.reduce((s, x) => s + x.stars, 0) / all.length * 10) / 10 : 0;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {all.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 30, color: theme.ink, letterSpacing: theme.letterDisplay }}>{avg}</span>
                  <div>
                    <div style={{ color: theme.accent, fontSize: 14, letterSpacing: 1 }}>
                      {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>{all.length} atsauksmes</div>
                  </div>
                </div>
              )}
              {all.map((r, i) => (
                <div key={i} style={{
                  padding: 14, borderRadius: theme.radius, background: theme.surface,
                  border: `1px solid ${theme.rule}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {r.name}
                      {r.verified && <span style={{
                        fontFamily: theme.body, fontSize: 9, fontWeight: 700, padding: '2px 6px',
                        borderRadius: 4, background: theme.surfaceAlt, color: theme.inkSoft,
                      }}>✓ Verificēts</span>}
                    </span>
                    <span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft }}>{r.date}</span>
                  </div>
                  <div style={{ color: theme.accent, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>
                    {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                  </div>
                  <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5 }}>{r.body}</div>
                </div>
              ))}
              {all.length === 0 && <span>{t('pdp.noReviews', 'Vēl nav atsauksmju. Esi pirmais!')}</span>}
              <ReviewForm theme={theme} productName={product.name}
                onSubmitted={(rev) => {
                  setLocalReviews(prev => [rev, ...prev]);
                  // Send to the database for moderation (admin review queue).
                  if (window.SHHH_LIVE && window.SHHH_LIVE.status !== 'fallback') {
                    window.SHHH_LIVE.submitReview({
                      product: product.id, name: rev.name, stars: rev.stars,
                      body: rev.body, orderRef: rev.orderRef || '',
                    }).then(r => console.info('[shhh] review submitted for moderation', r))
                      .catch(e => console.warn('[shhh] review DB submit failed', e));
                  }
                }} />
            </div>
          );
        })()}
      </div>

      {/* Also pick this one — complementary picks */}
      <div style={{ paddingBottom: 12 }}>
        <SuggestionBlock theme={theme} title={t('pdp.goesWith','Goes well with 💘')}
          productId={product.id} excludeIds={[product.id]}
          nav={nav} addToCart={addToCart}
          onPick={(targetId) => setPairPrompt({ id: targetId, added: false })} />
      </div>

      {/* Sticky CTA — in-flow, sits below content */}
      <div style={{
        position: 'sticky', bottom: 84, left: 0, right: 0, marginTop: 16,
        padding: '12px 20px 14px', background: theme.bg, borderTop: `1px solid ${theme.rule}`, boxShadow: '0 -12px 24px -8px rgba(0,0,0,0.08)', zIndex: 6,
      }}>
        {/* Quantity + dimensions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1.5px solid ${theme.rule}`, borderRadius: theme.radiusPill, padding: 2 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="−" style={{
              all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
            }}><Icon name="minus" size={16} /></button>
            <span style={{ minWidth: 28, textAlign: 'center', fontFamily: theme.mono, fontSize: 15, fontWeight: 700, color: theme.ink }}>{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.stock ?? 9, q + 1))} aria-label="+" style={{
              all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
            }}><Icon name="plus" size={16} /></button>
          </div>
          {(() => {
            const sizeLabel = (product.sizes || [])[sizeIdx] || product.length;
            return sizeLabel && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>
                Izmērs: <strong style={{ color: theme.ink }}>{sizeLabel}</strong>
              </div>
            );
          })()}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <GhostButton theme={theme} size="lg"
            onClick={() => { const v = { colour: (product.colourNames||[])[swatch], size: (product.sizes||[])[sizeIdx] }; for (let i = 0; i < qty; i++) addToCart(product.id, v); setAddedSheet(v); }}
            full={false}
            style={{ flex: 1 }}>
            {t("pdp.addToBag", "Add to bag")}
          </GhostButton>
          <PrimaryButton theme={theme}
            onClick={() => { const v = { colour: (product.colourNames||[])[swatch], size: (product.sizes||[])[sizeIdx] }; for (let i = 0; i < qty; i++) addToCart(product.id, v); (quickBuy ? quickBuy(product.id, v) : nav('checkout')); }}
            full={false}
            style={{ flex: 1.4, whiteSpace: 'nowrap', padding: '0 16px' }}>
            {t("pdp.buyNow", "⚡ Buy")} · €{(product.price * qty)}
          </PrimaryButton>
        </div>

        {/* Delivery estimate */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
          fontFamily: theme.body, fontSize: 12, color: theme.ink, fontWeight: 600,
        }}>
          <span style={{ fontSize: 14 }}>🚚</span>
          Saņem <strong>rīt</strong>, ja pasūti līdz 16:00
        </div>

        {/* Trust microcopy */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6,
          fontFamily: theme.body, fontSize: 11, color: theme.inkSoft,
        }}>
          <span>🔒 Diskrēta piegāde</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{t('pdp.anonPayment', 'Anonīms maksājums')}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>30 dienu atgriešana</span>
        </div>
      </div>

      {addedSheet && (
        <div onClick={() => setAddedSheet(null)} style={{
          position: 'absolute', inset: 0, zIndex: 60,
          background: 'rgba(15,15,15,0.45)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: theme.bg,
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '16px 20px 28px',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: theme.rule, margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, background: '#22C55E', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}><Icon name="check" size={18} color="#fff" strokeWidth={2.4} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 15, color: theme.ink }}>
                  Pievienots grozam
                </div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                  {product.name}{[addedSheet.colour, addedSheet.size].filter(Boolean).length ? ' · ' + [addedSheet.colour, addedSheet.size].filter(Boolean).join(' · ') : ''} × {qty}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => { setAddedSheet(null); nav('category'); }} style={{
                all: 'unset', cursor: 'pointer', height: 52, borderRadius: theme.radiusPill,
                border: `1.5px solid ${theme.ink}`, color: theme.ink,
                fontFamily: theme.body, fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{t('pdp.continueShopping', 'Turpināt iepirkties')}</button>
              <PrimaryButton theme={theme} size="lg" onClick={() => { setAddedSheet(null); nav('cart'); }}>
                Skatīt grozu →
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {pairPrompt && (
        <div style={{
          position: 'absolute', left: 12, right: 12, bottom: 96, zIndex: 60,
          background: theme.bg, borderRadius: 20,
          border: `1px solid ${theme.rule}`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
          padding: '14px 16px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%' }}>
            {!pairPrompt.added ? (
              <>
                <button onClick={() => { const tgt = pairPrompt.id; setPairPrompt(null); nav('product', { id: tgt }); }}
                  aria-label="Aizvērt" style={{
                  all: 'unset', cursor: 'pointer', position: 'absolute', top: 10, right: 10,
                  width: 28, height: 28, borderRadius: 999, background: theme.surfaceAlt, color: theme.inkSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="close" size={15} /></button>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, paddingRight: 28 }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                    <ProductBlob product={product} theme={theme} size="sm" tint={product.swatches[swatch]} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>
                      Vai pievienot {product.name} grozam?
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                      {(() => { const tp = PRODUCTS.find(p => p.id === pairPrompt.id); return tp ? `Pirms aplūkot ${tp.name}, vai vēlaties to pievienot grozam?` : 'Lai nezaudētu izvēlēto, pievieno to grozam.'; })()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { const tgt = pairPrompt.id; setPairPrompt(null); nav('product', { id: tgt }); }} style={{
                    all: 'unset', cursor: 'pointer', flex: 1, height: 44, borderRadius: theme.radiusPill,
                    border: `1.5px solid ${theme.rule}`, color: theme.inkSoft,
                    fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>Izlaist</button>
                  <button onClick={() => {
                    const v = { colour: (product.colourNames||[])[swatch], size: (product.sizes||[])[sizeIdx] };
                    for (let i = 0; i < qty; i++) addToCart(product.id, v);
                    const tgt = pairPrompt.id; setPairPrompt(null);
                    nav('product', { id: tgt, toast: product.name + ' pievienots grozam ✓' });
                  }} className="shhh-grad" style={{
                    cursor: 'pointer', flex: 1.5, height: 44, borderRadius: theme.radiusPill,
                    fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{t('pdp.addToCart', 'Pievienot grozam')}</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 6 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 999, background: '#22C55E', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}><Icon name="check" size={18} color="#fff" strokeWidth={2.4} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 15, color: theme.ink }}>
                      {product.name} pievienots grozam
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
                      {(() => { const tp = PRODUCTS.find(p => p.id === pairPrompt.id); return tp ? 'Apskati ' + tp.name + ' tālāk.' : 'Turpini iepirkties.'; })()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  <PrimaryButton theme={theme} size="lg" onClick={() => {
                    const tgt = pairPrompt.id; setPairPrompt(null); nav('product', { id: tgt });
                  }}>{(() => { const tp = PRODUCTS.find(p => p.id === pairPrompt.id); return 'Skatīt ' + (tp ? tp.name : 'produktu') + ' →'; })()}</PrimaryButton>
                  <button onClick={() => { setPairPrompt(null); nav('cart'); }} style={{
                    all: 'unset', cursor: 'pointer', height: 48, borderRadius: theme.radiusPill,
                    border: `1.5px solid ${theme.rule}`, color: theme.ink,
                    fontFamily: theme.body, fontWeight: 700, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{t('pdp.viewCart', 'Skatīt grozu')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function CartScreen({ theme, nav, cart, updateQty, addToCart, subtotal: subtotalProp, appliedPromo, setAppliedPromo }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const items = cart.map(c => ({
    ...c,
    product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const subtotal = subtotalProp != null
    ? subtotalProp
    : items.reduce((s, i) => s + (i.id === 'gift' ? 0 : i.product.price * i.qty), 0);
  const pd = (typeof promoDiscount === 'function' && appliedPromo)
    ? promoDiscount(appliedPromo, subtotal, subtotal > 60 ? 0 : 6)
    : { discount: 0, freeShipping: false };
  const shipping = (subtotal > 60 || pd.freeShipping) ? 0 : 6;
  const total = Math.max(0, subtotal - pd.discount + shipping);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 20px 10px',
      }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 34,
          color: theme.ink, letterSpacing: theme.letterDisplay,
          fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1,
        }}>{t("cart.title", "Your bag 🛍️")}</div>
        <button onClick={() => nav('home')} style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
        }}><Icon name="close" size={22} /></button>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div style={{
            fontFamily: theme.display, fontSize: 28, color: theme.ink,
            fontStyle: theme.italic ? 'italic' : 'normal', fontWeight: 700,
            letterSpacing: theme.letterDisplay, marginBottom: 8,
          }}>Empty.</div>
          <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, marginBottom: 24 }}>
            Take a look around. We promise we&rsquo;re not watching.
          </div>
          <PrimaryButton theme={theme} onClick={() => nav('category')} full={false}>
            Browse the shop
          </PrimaryButton>
        </div>
      ) : (
        <>
          {/* Free gift progress */}
          <div style={{ padding: '0 20px 14px' }}>
            <GiftProgress theme={theme} subtotal={subtotal} />
          </div>

          <div style={{ padding: '6px 20px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map(i => (
              <div key={i.key || i.id} style={{
                display: 'flex', gap: 14, alignItems: 'center',
                padding: 12, background: theme.surface,
                border: `1px solid ${theme.rule}`, borderRadius: theme.radius,
              }}>
                <div style={{ width: 76, height: 76, flexShrink: 0 }}>
                  <ProductBlob product={i.product} theme={theme} size="sm" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: theme.display, fontSize: 20, color: theme.ink,
                    letterSpacing: theme.letterDisplay, fontWeight: 700,
                    fontStyle: theme.italic ? 'italic' : 'normal', lineHeight: 1,
                  }}>{i.product.name}</div>
                  <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>
                    {(i.colour || i.size)
                      ? [i.colour, i.size].filter(Boolean).join(' · ')
                      : i.product.tagline}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    {i.id === 'gift' ? (
                      <span style={{
                        fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                        padding: '4px 10px', borderRadius: theme.radiusPill,
                        background: theme.accent, color: theme.accentInk,
                        letterSpacing: 0.4, textTransform: 'uppercase',
                      }}>{t('cart.freeGift', 'Free gift 🎁')}</span>
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                        borderRadius: theme.radiusPill, border: `1px solid ${theme.rule}`,
                        padding: 2,
                      }}>
                        <button onClick={() => updateQty(i.key || i.id, -1)} style={{
                          all: 'unset', cursor: 'pointer', width: 26, height: 26,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
                        }}><Icon name="minus" size={14} /></button>
                        <span style={{
                          minWidth: 22, textAlign: 'center', fontFamily: theme.mono,
                          fontSize: 12, color: theme.ink, fontWeight: 600,
                        }}>{i.qty}</span>
                        <button onClick={() => updateQty(i.key || i.id, 1)} style={{
                          all: 'unset', cursor: 'pointer', width: 26, height: 26,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
                        }}><Icon name="plus" size={14} /></button>
                      </div>
                    )}
                    <span style={{ fontFamily: theme.mono, fontSize: 14, color: theme.ink, fontWeight: 600 }}>
                      {i.id === 'gift'
                        ? <><s style={{ color: theme.inkSoft, fontWeight: 400, marginRight: 6 }}>€{i.product.retailPrice}</s>€0</>
                        : <>€{i.product.price * i.qty}</>}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <div style={{ padding: '0 20px 16px' }}>
            <button onClick={() => nav('category', { cat: 'all' })} style={{
              all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
              height: 46, borderRadius: theme.radiusPill,
              border: `1.5px solid ${theme.ink}`, color: theme.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            }}>
              <Icon name="plus" size={16} color={theme.ink} /> Turpināt iepirkties
            </button>
          </div>

          {/* Promo code */}
          {typeof PromoField === 'function' && (
            <div style={{ padding: '0 20px 16px' }}>
              <PromoField theme={theme} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} compact />
            </div>
          )}

          {/* Promo */}
          <div style={{
            margin: '0 20px 16px', padding: '12px 14px',
            border: `1.5px dashed ${theme.rule}`, borderRadius: theme.radius,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name="zap" size={18} color={theme.accent} />
            <div style={{ flex: 1, fontFamily: theme.body, fontSize: 13, color: theme.ink }}>
              {subtotal > 60 ? 'You unlocked free shipping ✦' : `Spend €{60 - subtotal} more for free shipping`}
            </div>
          </div>

          {/* Trust mini-row */}
          <div style={{
            margin: '0 20px 16px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            {[
              { icon: 'box', text: 'Plain box' },
              { icon: 'card', text: 'Billed as "NL Trading Co"' },
            ].map(t => (
              <div key={t.text} style={{
                padding: '10px 12px', borderRadius: theme.radiusSm,
                background: theme.surfaceAlt, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icon name={t.icon} size={16} color={theme.ink} />
                <span style={{ fontFamily: theme.body, fontSize: 11, color: theme.ink, fontWeight: 500 }}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          {/* Also pick this one */}
          <div style={{ paddingBottom: 16 }}>
            <SuggestionBlock theme={theme} title={t('sug.alsoPick','Also pick this one 💋')}
              excludeIds={items.map(i => i.id)}
              nav={nav} addToCart={addToCart} />
          </div>

          {/* Summary + checkout — sticky to bottom above tab bar */}
          <div style={{
            position: 'sticky', bottom: 84, left: 0, right: 0, marginTop: 8,
            padding: '14px 20px 16px', background: theme.bg, borderTop: `1px solid ${theme.rule}`, boxShadow: '0 -12px 24px -4px rgba(0,0,0,0.12)', zIndex: 6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>{t('cart.subtotal', 'Subtotal')}</span>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink }}>€{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>{t('cart.shipping', 'Shipping')}</span>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink }}>
                {shipping === 0 ? 'Free' : `€${shipping}`}
              </span>
            </div>
            {appliedPromo && pd.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.accent, fontWeight: 600 }}>{t('cart.discount', 'Atlaide')} · {appliedPromo.code}</span>
                <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.accent }}>−€{pd.discount.toFixed(2)}</span>
              </div>
            )}
            <PrimaryButton theme={theme} onClick={() => nav('checkout')}>
              {t("cart.checkout", "Check out")} &nbsp;·&nbsp; €{total.toFixed(2)}
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { HomeScreen, CategoryScreen, ProductScreen, CartScreen, SearchScreen });

// ─────────────────────────────────────────────────────────────
// SEARCH — dedicated screen with live results, no-results + suggestions
// ─────────────────────────────────────────────────────────────
function SearchScreen({ theme, nav, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const [q, setQ] = React.useState('');
  const isFav = (id) => (favourites || []).includes(id);
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const norm = (s) => (s || '').toLowerCase();
  const query = q.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!query) return [];
    return PRODUCTS.filter(p =>
      norm(p.name).includes(query) ||
      norm(p.tagline).includes(query) ||
      norm(p.material).includes(query) ||
      norm(p.category).includes(query) ||
      norm(p.desc).includes(query)
    );
  }, [query]);

  // Also search brands and content/info pages so search finds everything.
  const brandResults = React.useMemo(() => {
    if (!query) return [];
    const B = window.BRANDS || [];
    return B.filter(b => norm(b.name).includes(query)).slice(0, 12);
  }, [query]);
  const pageResults = React.useMemo(() => {
    if (!query) return [];
    const CP = window.CONTENT_PAGES || {};
    return Object.keys(CP).filter(k => !k.startsWith('brand-')).map(k => ({ key: k, ...CP[k] }))
      .filter(p => p.title && (norm(p.title).includes(query) || norm(p.sub).includes(query)))
      .slice(0, 6);
  }, [query]);
  const hasAny = results.length > 0 || brandResults.length > 0 || pageResults.length > 0;
  const POPULAR = ['Vibrators', 'Silikons', 'Klusais', 'Pāriem', 'Ūdensizturīgs'];
  const TRENDING = PRODUCTS.slice(0, 4);
  // Gift-card intent: surface a shortcut to the gift card page
  const giftIntent = /gift|dāv|davanu|davan|voucher|karte|balance|atlik/i.test(query);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Search bar */}
      <div style={{ padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => nav('category')} aria-label="Atpakaļ" style={{
          all: 'unset', cursor: 'pointer', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.ink,
        }}><Icon name="back" size={24} /></button>
        <div style={{
          flex: 1, height: 44, borderRadius: theme.radiusPill, background: theme.surfaceAlt,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        }}>
          <Icon name="search" size={18} color={theme.inkSoft} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Meklē…" style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none',
              fontFamily: theme.body, fontSize: 15, color: theme.ink, outline: 'none', padding: 0,
            }} />
          {q && (
            <button onClick={() => setQ('')} aria-label="Notīrīt" style={{
              all: 'unset', cursor: 'pointer', width: 20, height: 20, borderRadius: 999,
              background: theme.ink, color: theme.bg, fontSize: 11,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Empty (no query) — popular + trending */}
      {!query && (
        <div style={{ padding: '8px 20px' }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 12,
          }}>Populārākie meklējumi</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {POPULAR.map(term => (
              <button key={term} onClick={() => setQ(term)} style={{
                all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                background: theme.surface, border: `1.5px solid ${theme.rule}`,
                fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.ink,
              }}>{term}</button>
            ))}
          </div>
          <button onClick={() => nav('category')} style={{
            all: 'unset', cursor: 'pointer', marginBottom: 28,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
          }}>Meklēt vairāk <Icon name="arrow" size={15} color={theme.accent} /></button>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 12,
          }}>Tendences 🔥</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {TRENDING.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} variant="image"
                onClick={() => nav('product', { id: p.id })}
                isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
            ))}
          </div>
        </div>
      )}

      {/* Gift-card shortcut */}
      {query && giftIntent && (
        <div style={{ padding: '0 20px 16px' }}>
          <button onClick={() => nav('giftcard')} style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            padding: 16, borderRadius: theme.radius, background: theme.ink, color: theme.bg,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 26 }}>🎁</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14 }}>Dāvanu karte</div>
              <div style={{ fontFamily: theme.body, fontSize: 12, opacity: 0.75, marginTop: 2 }}>Pērc, sūti vai pārbaudi atlikumu →</div>
            </div>
            <Icon name="arrow" size={18} color={theme.bg} />
          </button>
        </div>
      )}

      {/* Brand + page results */}
      {query && (brandResults.length > 0 || pageResults.length > 0) && (
        <div style={{ padding: '0 20px 16px' }}>
          {brandResults.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 10,
              }}>Zīmoli</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {brandResults.map(b => (
                  <button key={b.id} onClick={() => nav('content', { key: 'brand-' + b.id })} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: theme.radiusSm,
                    background: theme.surface, border: `1px solid ${theme.rule}`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: theme.surfaceAlt,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: theme.display, fontWeight: 800, fontSize: 14, color: theme.ink,
                    }}>{b.name[0].toUpperCase()}</div>
                    <span style={{ flex: 1, fontFamily: theme.body, fontSize: 14, fontWeight: 600, color: theme.ink }}>{b.name}</span>
                    <span style={{ color: theme.inkSoft }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {pageResults.length > 0 && (
            <div>
              <div style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 10,
              }}>Lapas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pageResults.map(p => (
                  <button key={p.key} onClick={() => nav('content', { key: p.key })} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: theme.radiusSm,
                    background: theme.surface, border: `1px solid ${theme.rule}`,
                  }}>
                    <span style={{ flex: 1, fontFamily: theme.body, fontSize: 14, fontWeight: 600, color: theme.ink }}>{p.title}</span>
                    <span style={{ color: theme.inkSoft }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginBottom: 14,
          }}>{results.length} {results.length === 1 ? 'rezultāts' : 'rezultāti'} · "{q}"</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {results.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} variant="image"
                onClick={() => nav('product', { id: p.id })}
                isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && !hasAny && !giftIntent && (
        <div style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🫥</div>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 24,
            letterSpacing: theme.letterDisplay, color: theme.ink, marginBottom: 8,
          }}>Nekas neatbilst "{q}"</div>
          <div style={{
            fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.5,
            marginBottom: 24, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto',
          }}>Pārbaudi rakstību vai izmēģini kādu no šiem:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
            {POPULAR.map(term => (
              <button key={term} onClick={() => setQ(term)} style={{
                all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                background: theme.surface, border: `1.5px solid ${theme.rule}`,
                fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.ink,
              }}>{term}</button>
            ))}
          </div>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 12, textAlign: 'left',
          }}>Tev varētu patikt</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {TRENDING.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} variant="image"
                onClick={() => nav('product', { id: p.id })}
                isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
