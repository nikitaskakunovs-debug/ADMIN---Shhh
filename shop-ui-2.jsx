// shop-ui-2.jsx — Welcome modal + match prompts + gift progress + suggestions

// ─────────────────────────────────────────────────────────────
// WelcomeFlow — the questionary content (reused in modal + inline)
// ─────────────────────────────────────────────────────────────
function WelcomeFlow({ theme, onClose, onApply, dense = false }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [step, setStep] = React.useState(1);
  const [forWho, setForWho] = React.useState([]);
  const [vibe, setVibe] = React.useState([]);

  const togglePill = (set, setter, id) =>
  setter(set.includes(id) ? set.filter((x) => x !== id) : [...set, id]);

  const WHO_OPTS = [
  { id: 'straight', label: 'Straight' },
  { id: 'gay', label: 'Gay' },
  { id: 'lesbian', label: 'Lesbian' },
  { id: 'bipan', label: 'Bi / Pan' },
  { id: 'trans', label: 'Trans-friendly' },
  { id: 'ace', label: 'Asexual' },
  { id: 'rather-not', label: 'Rather not say' },
  { id: 'all', label: 'Show me everything' }];

  const VIBE_OPTS = [
  { id: 'solo', label: 'Solo' },
  { id: 'couples', label: 'With a partner' },
  { id: 'group', label: 'Multiple partners' },
  { id: 'beginners', label: 'First time' },
  { id: 'premium', label: 'Treat myself' },
  { id: 'travel', label: 'Travel-friendly' },
  { id: 'surprise', label: 'Surprise me' }];


  const intentToCat = (vibePicks) => {
    if (vibePicks.includes('beginners')) return 'beginners';
    if (vibePicks.includes('couples') || vibePicks.includes('group')) return 'couples';
    if (vibePicks.includes('premium')) return 'premium';
    if (vibePicks.includes('travel')) return 'travel';
    if (vibePicks.includes('solo')) return 'solo';
    return 'all';
  };

  const apply = () => onApply({ forWho, vibe, cat: intentToCat(vibe) });

  const Pill = ({ active, onClick, children }) =>
  <button onClick={onClick} style={{
    all: 'unset', cursor: 'pointer',
    padding: '10px 14px', borderRadius: theme.radiusPill,
    background: active ? theme.ink : theme.surface,
    color: active ? theme.bg : theme.ink,
    border: `1.5px solid ${active ? theme.ink : theme.rule}`,
    fontFamily: theme.body, fontWeight: 600, fontSize: 13, lineHeight: 1,
    letterSpacing: -0.1,
    display: 'inline-flex', alignItems: 'center', gap: 6
  }}>
      {children}
      {active && <Icon name="check" size={13} color={theme.bg} strokeWidth={2.2} />}
    </button>;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* progress + close */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '4px 0 14px'
      }}>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {[1, 2].map((n) =>
          <div key={n} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: step >= n ? theme.ink : theme.rule
          }} />
          )}
        </div>
        {onClose &&
        <button onClick={onClose} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: theme.body, fontSize: 12, fontWeight: 600,
          color: theme.inkSoft, padding: '4px 8px'
        }}>Skip &rarr;</button>
        }
      </div>

      {/* hero */}
      <div style={{
        fontFamily: theme.body, fontSize: 10, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.accent, marginBottom: 10
      }}>
        {step === 1 ? 'Step 01 \u00b7 You' : 'Step 02 \u00b7 What you\u2019re after'}
      </div>
      <div style={{
        fontFamily: theme.display, fontSize: dense ? 28 : 32, lineHeight: 0.95,
        letterSpacing: theme.letterDisplay, color: theme.ink, fontWeight: 700,
        marginBottom: 8
      }}>
        {step === 1 ?
        <>{t('welcome.heroA','Toys for')} <span style={{ color: theme.accent }}>{t('welcome.heroEveryone','everyone')}</span> 💋 {t('welcome.heroTail','Pick what fits you.')}</> :
        <>Pick what you&rsquo;re <span style={{ color: theme.accent }}>in the mood</span> for.</>}
      </div>
      <div style={{
        fontFamily: theme.body, fontSize: 13, color: theme.inkSoft,
        lineHeight: 1.5, marginBottom: 16
      }}>
        {step === 1 ?
        'Every body, every orientation, every kind of "us." Tap whatever sounds like you — we\u2019ll filter the shop around it.' :
        'Tap what you\u2019re looking for today. We\u2019ll line up the pieces best suited to you.'}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {(step === 1 ? WHO_OPTS : VIBE_OPTS).map((o) =>
        <Pill key={o.id}
        active={(step === 1 ? forWho : vibe).includes(o.id)}
        onClick={() => step === 1 ?
        togglePill(forWho, setForWho, o.id) :
        togglePill(vibe, setVibe, o.id)}>
            {o.label}
          </Pill>
        )}
      </div>

      <div style={{
        padding: '10px 12px', background: theme.surfaceAlt,
        borderRadius: theme.radius, display: 'flex', gap: 10,
        alignItems: 'flex-start', marginBottom: 14
      }}>
        <Icon name="lock" size={14} color={theme.ink} />
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, lineHeight: 1.4 }}>
          <strong style={{ color: theme.ink }}>{t('welcome.privacy','Stays on this device.')}</strong> We don&rsquo;t track. No account, no profile.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {step === 2 &&
        <button onClick={() => setStep(1)} style={{
          all: 'unset', cursor: 'pointer', height: 52, padding: '0 18px',
          borderRadius: theme.radiusPill,
          border: `1.5px solid ${theme.rule}`, background: theme.surface,
          color: theme.ink, fontFamily: theme.body, fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}><Icon name="back" size={20} /></button>
        }
        {step === 1 ?
        <PrimaryButton theme={theme} size="md" onClick={() => setStep(2)}>
            {forWho.length === 0 ? 'Continue' : `Continue \u00b7 ${forWho.length} picked`}
          </PrimaryButton> :

        <PrimaryButton theme={theme} size="md" onClick={apply}>
            Find my picks &nbsp;<Icon name="arrow" size={18} color={theme.bg} />
          </PrimaryButton>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// WelcomeModal — overlay on first visit and on demand
// ─────────────────────────────────────────────────────────────
function WelcomeModal({ theme, open, onClose, onApply }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,15,15,0.45)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '90%', overflowY: 'auto',
        background: theme.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 22px 28px',
        boxShadow: '0 -12px 32px rgba(0,0,0,0.18)',
        position: 'relative'
      }}>
        {/* grabber */}
        <div style={{
          width: 40, height: 4, borderRadius: 4,
          background: theme.rule, margin: '0 auto 14px'
        }} />
        <WelcomeFlow theme={theme} onClose={onClose} onApply={onApply} dense />
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// MatchPromptCard — inline card that triggers the modal
// ─────────────────────────────────────────────────────────────
function MatchPromptCard({ theme, onOpen, hasPicks, compact = false }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  return (
    <div style={{
      borderRadius: theme.radius,
      background: theme.surfaceAlt,
      padding: compact ? '18px 18px 16px' : '22px 22px 20px',
      position: 'relative', overflow: 'hidden',
      border: `1.5px solid ${theme.rule}`,
    }}>
      {/* Hero: visual wizard flow — three big circles wired together,
          obviously a short quiz with a heart-shaped result. */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, marginBottom: 14, maxWidth: 280,
      }}>
        {[
          { num: '1', label: 'You', bg: theme.surface, fg: theme.ink, border: `1.5px solid ${theme.ink}` },
          { num: '2', label: 'Mood', bg: theme.surface, fg: theme.ink, border: `1.5px solid ${theme.ink}` },
          { isHeart: true },
        ].map((s, i, arr) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {s.isHeart ? (
                <div className="shhh-grad" style={{
                  width: 46, height: 46, borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, lineHeight: 1,
                  boxShadow: '0 6px 18px rgba(110,77,248,0.30)',
                }}>💘</div>
              ) : (
                <div style={{
                  width: 46, height: 46, borderRadius: 999,
                  background: s.bg, color: s.fg, border: s.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: theme.display, fontWeight: 800, fontSize: 22,
                  letterSpacing: -0.5,
                }}>{s.num}</div>
              )}
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft,
              }}>{s.isHeart ? 'Match' : s.label}</div>
            </div>
            {i < arr.length - 1 && (
              <div style={{
                flex: 1, height: 2, background: theme.ink, opacity: 0.18,
                marginBottom: 16, position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', right: -2, top: -3, color: theme.ink, opacity: 0.5,
                  fontFamily: 'system-ui', fontSize: 11, lineHeight: 1,
                }}>▶</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        fontFamily: theme.body, fontSize: 10, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.accent, marginBottom: 6,
      }}>{hasPicks ? 'Update your picks' : t('match.kicker','30-second quiz')}</div>
      <div style={{
        fontFamily: theme.display, fontSize: compact ? 22 : 26,
        lineHeight: 1.05, letterSpacing: theme.letterDisplay, fontWeight: 700,
        color: theme.ink, marginBottom: 6, maxWidth: 320,
      }}>
        {hasPicks
          ? 'Want to refine your picks?'
          : <>Tell us a little. <span className="shhh-grad-text">We'll match</span> the toy to you.</>}
      </div>
      <div style={{
        fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.45,
        marginBottom: 14, maxWidth: 320,
      }}>
        Tap a few pills · we curate the catalogue around you. Stays on this device. No account, no tracking.
      </div>
      <button onClick={onOpen} className="shhh-grad" style={{
        cursor: 'pointer', height: 44, padding: '0 18px', borderRadius: 999,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: theme.body, fontWeight: 700, fontSize: 13,
        boxShadow: '0 8px 22px rgba(110,77,248,0.28)',
      }}>
        {hasPicks ? 'Update my picks' : t('match.cta','Start the match · 30 sec')}
        <Icon name="arrow" size={14} color="#fff" />
      </button>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// GiftProgress — progress bar toward complimentary gift
// ─────────────────────────────────────────────────────────────
function GiftProgress({ theme, subtotal, threshold = GIFT_THRESHOLD }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const pct = Math.min(100, subtotal / threshold * 100);
  const reached = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'relative', borderRadius: theme.radius, overflow: 'hidden',
      background: theme.surface,
      border: `1.5px solid ${reached ? theme.accent : theme.rule}`,
      boxShadow: reached ?
      `0 0 0 4px ${theme.accent}1A, 0 8px 20px ${theme.accent}1F` :
      'none',
      transition: 'box-shadow .2s ease, border-color .2s ease'
    }}>
      {/* Top row */}
      <div style={{
        padding: '12px 14px 10px',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        {/* Gift glyph card */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: reached ? theme.accent : theme.surfaceAlt,
          color: reached ? theme.accentInk : theme.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, position: 'relative'
        }}>
          🎁
          {reached &&
          <div style={{
            position: 'absolute', top: -3, right: -3,
            width: 16, height: 16, borderRadius: 999,
            background: theme.ink, color: theme.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
              <Icon name="check" size={10} color={theme.bg} strokeWidth={2.5} />
            </div>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: theme.body, fontSize: 10, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: reached ? theme.accent : theme.inkSoft
          }}>
            {reached ? t('gift.unlocked','🎉 Unlocked') : t('gift.kicker','Free gift')}
            <button onClick={() => setOpen(!open)} aria-label="Info" style={{
              all: 'unset', cursor: 'pointer',
              width: 15, height: 15, borderRadius: 999,
              border: `1.2px solid ${theme.inkSoft}`,
              color: theme.inkSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia, serif', fontSize: 9, fontWeight: 700,
              fontStyle: 'italic', lineHeight: 1, paddingBottom: 1
            }}>i</button>
          </div>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 18,
            color: theme.ink, letterSpacing: theme.letterDisplay, lineHeight: 1.1,
            marginTop: 2
          }}>{t('gift.product','Whisper kit')}</div>
          <div style={{
            fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2
          }}>
            {reached ?
            <>Added to your bag <span style={{ color: theme.ink, fontWeight: 600 }}>· worth €{GIFT_PRODUCT.retailPrice}</span></> :
            <>€{remaining.toFixed(2)} away · spend over €{threshold}</>}
          </div>
        </div>

        <div style={{
          textAlign: 'right', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2
        }}>
          <span style={{
            fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft,
            textDecoration: 'line-through', opacity: 0.7
          }}>€{GIFT_PRODUCT.retailPrice}</span>
          <span style={{
            fontFamily: theme.display, fontSize: 18, fontWeight: 700,
            color: reached ? theme.accent : theme.ink,
            letterSpacing: theme.letterDisplay, lineHeight: 1
          }}>€0</span>
        </div>
      </div>

      {/* Progress track */}
      <div style={{
        height: 8, background: theme.surfaceAlt, position: 'relative'
      }}>
        <div style={{
          height: '100%', width: pct + '%',
          background: reached ?
          `linear-gradient(90deg, ${theme.accent}, ${theme.accent})` :
          theme.ink,
          transition: 'width .35s ease',
          position: 'relative'
        }}>
          {reached &&
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'shhh-cta-flow 3s ease infinite'
          }} />
          }
        </div>
        {/* threshold ticks */}
        {[0.25, 0.5, 0.75].map((t) =>
        <div key={t} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: t * 100 + '%', width: 1,
          background: pct > t * 100 ? 'rgba(255,255,255,0.5)' : theme.rule
        }} />
        )}
      </div>

      {/* Inline explainer */}
      {open &&
      <div style={{
        padding: '12px 14px', display: 'flex', gap: 12,
        alignItems: 'flex-start', borderTop: `1px solid ${theme.rule}`,
        background: theme.surfaceAlt
      }}>
          <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: theme.surface, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${theme.rule}`
        }}>
            <svg viewBox="0 0 100 100" width="68%" height="68%">
              <path d={GIFT_PRODUCT.blob} fill={theme.accent} opacity={0.9} />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
            fontFamily: theme.body, fontWeight: 700, fontSize: 12, color: theme.ink, marginBottom: 4
          }}>What's inside</div>
            <div style={{
            fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, lineHeight: 1.45
          }}>
              Silk pouch · 5 ml water-based lubricant sample · hand-written thank-you note. Body-safe. Recyclable wrap.
            </div>
          </div>
        </div>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// GiftTile — a catalog tile that shows the free gift state
// ─────────────────────────────────────────────────────────────
function GiftTile({ theme, subtotal, threshold = GIFT_THRESHOLD, onClick }) {
  const reached = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
      borderRadius: theme.radius, overflow: 'hidden',
      background: theme.surface, border: `1.5px dashed ${theme.accent}`,
      padding: 16, display: 'flex', alignItems: 'center', gap: 14,
      position: 'relative'
    }}>
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        borderRadius: theme.radiusSm, background: theme.surfaceAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        <svg viewBox="0 0 100 100" width="58%" height="58%">
          <path d={GIFT_PRODUCT.blob} fill={theme.accent} opacity={0.95} />
        </svg>
        <div style={{
          position: 'absolute', top: -8, right: -8,
          padding: '3px 8px', borderRadius: 999,
          background: theme.accent, color: theme.accentInk,
          fontFamily: theme.body, fontWeight: 700, fontSize: 9,
          letterSpacing: 0.4, textTransform: 'uppercase'
        }}>Free</div>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 4
        }}>Complimentary at €{GIFT_THRESHOLD}</div>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 22,
          color: theme.ink, letterSpacing: theme.letterDisplay, lineHeight: 1
        }}>Whisper kit</div>
        <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>
          {reached ?
          'In your bag now \u2014 it\u2019s yours.' :
          `Add €${remaining.toFixed(2)} more to unlock.`}
        </div>
      </div>
    </button>);

}

// ─────────────────────────────────────────────────────────────
// SuggestionBlock — "Also pick this one"
// ─────────────────────────────────────────────────────────────
function SuggestionBlock({ theme, title = 'Also pick this one', excludeIds = [], productId, nav, addToCart, max = 3, onPick }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  let ids = productId && PAIRS[productId] ? PAIRS[productId] : [];
  if (ids.length === 0) {
    // fallback: top-rated by price, exclude
    ids = PRODUCTS.filter((p) => !excludeIds.includes(p.id)).slice(0, max).map((p) => p.id);
  }
  const items = ids.
  map((id) => PRODUCTS.find((p) => p.id === id)).
  filter((p) => p && !excludeIds.includes(p.id)).
  slice(0, max);
  if (items.length === 0) return null;

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{
        padding: '0 20px 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 22,
          color: theme.ink, letterSpacing: theme.letterDisplay
        }}>{title}</div>
        <div style={{
          fontFamily: theme.body, fontSize: 10, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft
        }}>Curated</div>
      </div>
      <div style={{
        padding: '0 20px 8px', display: 'flex', gap: 12,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch'
      }}>
        {items.map((p) =>
        <div key={p.id} style={{
          flex: '0 0 160px', display: 'flex', flexDirection: 'column', gap: 8
        }}>
            <button onClick={() => onPick ? onPick(p.id) : nav('product', { id: p.id })} style={{
            all: 'unset', cursor: 'pointer'
          }}>
              <ProductBlob product={p} theme={theme} />
            </button>
            <div>
              <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 18,
              color: theme.ink, letterSpacing: theme.letterDisplay, lineHeight: 1
            }}>{p.name}</div>
              <div style={{
              fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 4
            }}>€{p.price}</div>
            </div>
            <button onClick={() => addToCart(p.id)} style={{
            all: 'unset', cursor: 'pointer', textAlign: 'center',
            padding: '8px 0', borderRadius: theme.radiusPill,
            background: theme.surfaceAlt, color: theme.ink,
            fontFamily: theme.body, fontWeight: 600, fontSize: 12
          }}>+ Add</button>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, {
  WelcomeFlow, WelcomeModal, MatchPromptCard,
  GiftProgress, GiftTile, SuggestionBlock,
  HeroBanner, LangSwitcher,
  FilterSheet, SortPopover, FilterBar, applyFilters, countActiveFilters
});

// ─────────────────────────────────────────────────────────────
// Filtering — model, helpers, sheet UI
// ─────────────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  cat: 'all',
  priceMin: 0,
  priceMax: 200,
  features: [], // waterproof | rechargeable | quiet | app
  material: [], // silicone | abs
  modes: 0, // minimum modes
  forWho: [], // straight | gay | lesbian | bipan | trans | ace
  vibe: [], // solo | couples | beginners | premium | travel
  brands: [], // Pulse | Velura | Lumen
  colours: [], // nude | black | pink | purple | blue | brown
  inStockOnly: false,
  newOnly: false,
  saleOnly: false
};

const SORT_OPTIONS = [
{ id: 'featured', label: 'Featured', hint: 'Curated picks first' },
{ id: 'price-asc', label: 'Price · low → high', hint: 'Cheapest first' },
{ id: 'price-desc', label: 'Price · high → low', hint: 'Premium first' },
{ id: 'quietest', label: 'Quietest first', hint: 'Lowest dB on top' },
{ id: 'most-modes', label: 'Most modes', hint: 'More rhythms first' },
{ id: 'newest', label: 'Newest first', hint: 'Just landed' }];


function applyFilters(products, filters, sort) {
  let l = products;
  if (filters.cat && filters.cat !== 'all') l = l.filter((p) => p.category === filters.cat);
  if (filters.priceMin > 0) l = l.filter((p) => p.price >= filters.priceMin);
  if (filters.priceMax < 200) l = l.filter((p) => p.price <= filters.priceMax);
  if (filters.features?.includes('waterproof')) l = l.filter((p) => p.waterproof);
  if (filters.features?.includes('rechargeable')) l = l.filter((p) => p.rechargeable);
  if (filters.features?.includes('quiet')) l = l.filter((p) => (p.decibels ?? 99) <= 32);
  if (filters.features?.includes('app')) l = l.filter((p) => p.id === 'glow'); // demo
  if (filters.material?.length) {
    l = l.filter((p) => filters.material.some((m) => (p.material || '').toLowerCase().includes(m)));
  }
  if (filters.modes) l = l.filter((p) => (p.modes ?? 0) >= filters.modes);
  if (filters.vibe?.length) l = l.filter((p) => filters.vibe.includes(p.category));
  if (filters.brands?.length) l = l.filter((p) => filters.brands.includes(p.brand));
  if (filters.colours?.length) l = l.filter((p) => (p.colours || []).some((c) => filters.colours.includes(c)));
  if (filters.inStockOnly) l = l.filter((p) => p.stock !== 'out');
  if (filters.newOnly) l = l.filter((p) => p.badge === 'New');
  if (filters.saleOnly) {
    const saleIds = ((typeof window !== 'undefined' && window.SALE_DEALS) || []).map((s) => s.id);
    l = l.filter((p) => saleIds.includes(p.id));
  }

  switch (sort) {
    case 'price-asc':l = [...l].sort((a, b) => a.price - b.price);break;
    case 'price-desc':l = [...l].sort((a, b) => b.price - a.price);break;
    case 'quietest':l = [...l].sort((a, b) => (a.decibels ?? 99) - (b.decibels ?? 99));break;
    case 'most-modes':l = [...l].sort((a, b) => (b.modes ?? 0) - (a.modes ?? 0));break;
    case 'newest':l = [...l].sort((a, b) => (b.badge === 'New') - (a.badge === 'New'));break;
    default:break;
  }
  return l;
}

function countActiveFilters(filters) {
  let n = 0;
  if (filters.cat && filters.cat !== 'all') n++;
  if (filters.priceMin > 0 || filters.priceMax < 200) n++;
  if (filters.features?.length) n += filters.features.length;
  if (filters.material?.length) n += filters.material.length;
  if (filters.modes) n++;
  if (filters.vibe?.length) n += filters.vibe.length;
  if (filters.forWho?.length) n += filters.forWho.length;
  if (filters.brands?.length) n += filters.brands.length;
  if (filters.colours?.length) n += filters.colours.length;
  if (filters.inStockOnly) n++;
  if (filters.newOnly) n++;
  if (filters.saleOnly) n++;
  return n;
}

// Filter / sort top bar
function FilterBar({ theme, onOpenFilters, onOpenSort, activeCount, sortLabel, productCount, filters, removeFilter, hideCount }) {
  const chips = [];
  if (filters.cat && filters.cat !== 'all') chips.push({ id: 'cat', label: filters.cat, onRemove: () => removeFilter('cat') });
  if (filters.priceMin > 0 || filters.priceMax < 200) chips.push({ id: 'price', label: `€${filters.priceMin}–${filters.priceMax}`, onRemove: () => removeFilter('price') });
  (filters.features || []).forEach((f) => chips.push({ id: 'f-' + f, label: f, onRemove: () => removeFilter('features', f) }));
  (filters.material || []).forEach((m) => chips.push({ id: 'm-' + m, label: m, onRemove: () => removeFilter('material', m) }));
  (filters.vibe || []).forEach((v) => chips.push({ id: 'v-' + v, label: v, onRemove: () => removeFilter('vibe', v) }));
  (filters.brands || []).forEach((b) => chips.push({ id: 'b-' + b, label: b, onRemove: () => removeFilter('brands', b) }));
  (filters.colours || []).forEach((c) => chips.push({ id: 'c-' + c, label: c, onRemove: () => removeFilter('colours', c) }));
  if (filters.newOnly) chips.push({ id: 'new', label: 'Jaunums', onRemove: () => removeFilter('newOnly') });
  if (filters.saleOnly) chips.push({ id: 'sale', label: 'Akcijā', onRemove: () => removeFilter('saleOnly') });
  if (filters.inStockOnly) chips.push({ id: 'stock', label: 'Pieejamās', onRemove: () => removeFilter('inStockOnly') });
  if (filters.modes) chips.push({ id: 'modes', label: `${filters.modes}+ modes`, onRemove: () => removeFilter('modes') });

  return (
    <div>
      <div style={{
        display: 'flex', gap: 8, padding: '0 20px 12px', alignItems: 'center'
      }}>
        <button onClick={onOpenFilters} style={{
          all: 'unset', cursor: 'pointer', flexShrink: 0,
          height: 38, padding: '0 14px', borderRadius: theme.radiusPill,
          background: activeCount > 0 ? theme.ink : theme.surface,
          color: activeCount > 0 ? theme.bg : theme.ink,
          border: activeCount > 0 ? 'none' : `1.5px solid ${theme.rule}`,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: theme.body, fontWeight: 700, fontSize: 13
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Filters
          {activeCount > 0 &&
          <span style={{
            minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
            background: theme.accent, color: theme.accentInk,
            fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>{activeCount}</span>
          }
        </button>
        <button onClick={onOpenSort} style={{
          all: 'unset', cursor: 'pointer', flexShrink: 0,
          height: 38, padding: '0 14px', borderRadius: theme.radiusPill,
          background: theme.surface, color: theme.ink,
          border: `1.5px solid ${theme.rule}`,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: theme.body, fontWeight: 700, fontSize: 13
        }}>
          <span style={{ color: theme.inkSoft, fontWeight: 500 }}>Sort:</span>
          {sortLabel}
          <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
        </button>
        <div style={{ flex: 1 }} />
        {!hideCount && (
          <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft }}>
            {productCount.toString().padStart(2, '0')} pieces
          </div>
        )}
      </div>

      {chips.length > 0 &&
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 12px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch'
      }}>
          {chips.map((chip) =>
        <button key={chip.id} onClick={chip.onRemove} style={{
          all: 'unset', cursor: 'pointer', flexShrink: 0,
          height: 28, padding: '0 8px 0 12px', borderRadius: 999,
          background: theme.surfaceAlt, color: theme.ink,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: theme.body, fontWeight: 600, fontSize: 11,
          textTransform: 'capitalize'
        }}>
              {chip.label}
              <span style={{
            width: 14, height: 14, borderRadius: 999,
            background: theme.ink, color: theme.bg,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, lineHeight: 1
          }}>✕</span>
            </button>
        )}
        </div>
      }
    </div>);

}

// Sort popover (small floating menu)
function SortPopover({ theme, open, value, onChange, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.18)',
      backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'absolute', top: 56 + 80, right: 20,
        minWidth: 240, background: theme.surface,
        border: `1px solid ${theme.rule}`, borderRadius: theme.radius,
        boxShadow: '0 14px 36px rgba(0,0,0,0.16)',
        padding: 6, display: 'flex', flexDirection: 'column', gap: 2
      }}>
        {SORT_OPTIONS.map((o) => {
          const active = value === o.id;
          return (
            <button key={o.id} onClick={() => {onChange(o.id);onClose();}} style={{
              all: 'unset', cursor: 'pointer', textAlign: 'left',
              padding: '10px 12px', borderRadius: theme.radiusSm,
              background: active ? theme.surfaceAlt : 'transparent',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink }}>{o.label}</div>
                <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 1 }}>{o.hint}</div>
              </div>
              {active && <Icon name="check" size={16} color={theme.accent} strokeWidth={2.2} />}
            </button>);

        })}
      </div>
    </div>);

}

// Full filter sheet (bottom modal)
function FilterSheet({ theme, open, onClose, filters, setFilters, productCount }) {
  const [local, setLocal] = React.useState(filters);
  React.useEffect(() => {if (open) setLocal(filters);}, [open, filters]);
  if (!open) return null;

  const togglePill = (key, val) => {
    const arr = local[key] || [];
    setLocal({ ...local, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  const Section = ({ title, hint, children }) =>
  <div style={{
    padding: '16px 20px',
    borderTop: `1px solid ${theme.rule}`
  }}>
      <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginBottom: 12
    }}>
        <div style={{
        fontFamily: theme.body, fontSize: 11, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.ink
      }}>{title}</div>
        {hint && <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>{hint}</div>}
      </div>
      {children}
    </div>;


  const Pill = ({ active, onClick, children }) =>
  <button onClick={onClick} style={{
    all: 'unset', cursor: 'pointer',
    padding: '8px 12px', borderRadius: theme.radiusPill,
    background: active ? theme.ink : theme.surface,
    color: active ? theme.bg : theme.ink,
    border: `1.5px solid ${active ? theme.ink : theme.rule}`,
    fontFamily: theme.body, fontWeight: 600, fontSize: 12,
    letterSpacing: -0.1, display: 'inline-flex', alignItems: 'center', gap: 4
  }}>{children}</button>;


  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,15,15,0.45)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '92%',
        background: theme.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -12px 32px rgba(0,0,0,0.18)'
      }}>
        {/* grabber + header */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{
            width: 40, height: 4, borderRadius: 4,
            background: theme.rule, margin: '0 auto 14px'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 28,
              letterSpacing: theme.letterDisplay, color: theme.ink
            }}>Filters</div>
            <button onClick={onClose} style={{
              all: 'unset', cursor: 'pointer', width: 36, height: 36,
              borderRadius: 999, background: theme.surfaceAlt, color: theme.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}><Icon name="close" size={20} /></button>
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, paddingBottom: 12 }}>
            Refine the catalogue. Combine as many as you like.
          </div>
        </div>

        {/* Scrollable sections */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {/* Category */}
          <Section title="Category">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.map((c) =>
              <Pill key={c.id} active={local.cat === c.id} onClick={() => setLocal({ ...local, cat: c.id })}>
                  {c.label} <span style={{ opacity: 0.55, fontFamily: theme.mono, fontSize: 10 }}>{c.count}</span>
                </Pill>
              )}
            </div>
          </Section>

          {/* Price */}
          <Section title="Price" hint={`€${local.priceMin} – €${local.priceMax === 200 ? '200+' : local.priceMax}`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {[
              { id: 'all', label: 'Any', min: 0, max: 200 },
              { id: 'under', label: 'Under €50', min: 0, max: 50 },
              { id: 'mid', label: '€50 – €100', min: 50, max: 100 },
              { id: 'over', label: 'Over €100', min: 100, max: 200 }].
              map((b) => {
                const active = local.priceMin === b.min && local.priceMax === b.max;
                return (
                  <Pill key={b.id} active={active}
                  onClick={() => setLocal({ ...local, priceMin: b.min, priceMax: b.max })}>
                    {b.label}
                  </Pill>);

              })}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 14px', background: theme.surface,
              border: `1px solid ${theme.rule}`, borderRadius: theme.radius
            }}>
              <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.inkSoft, minWidth: 28 }}>€0</span>
              <input type="range" min="0" max="200" step="10"
              value={local.priceMax}
              onChange={(e) => setLocal({ ...local, priceMax: +e.target.value })}
              style={{ flex: 1, accentColor: theme.accent }} />
              <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.ink, fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                €{local.priceMax === 200 ? '200+' : local.priceMax}
              </span>
            </div>
          </Section>

          {/* Features */}
          <Section title="Features">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
              { id: 'waterproof', label: '💧 Waterproof' },
              { id: 'rechargeable', label: '⚡ Rechargeable' },
              { id: 'quiet', label: '🤫 Whisper-quiet' },
              { id: 'app', label: '📱 App-controlled' }].
              map((f) =>
              <Pill key={f.id} active={(local.features || []).includes(f.id)}
              onClick={() => togglePill('features', f.id)}>{f.label}</Pill>
              )}
            </div>
          </Section>

          {/* Material */}
          <Section title="Material">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['silicone', 'abs'].map((m) =>
              <Pill key={m} active={(local.material || []).includes(m)}
              onClick={() => togglePill('material', m)}>
                  {m === 'silicone' ? 'Medical-grade silicone' : 'Aerospace ABS'}
                </Pill>
              )}
            </div>
          </Section>

          {/* Modes */}
          <Section title="Vibration modes" hint={local.modes ? `${local.modes}+` : 'Any'}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[0, 5, 8, 12].map((n) =>
              <Pill key={n} active={local.modes === n}
              onClick={() => setLocal({ ...local, modes: n })}>
                  {n === 0 ? 'Any' : `${n}+`}
                </Pill>
              )}
            </div>
          </Section>

          {/* For whom */}
          <Section title="Designed for" hint="Multi-select">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
              { id: 'straight', label: 'Straight' },
              { id: 'gay', label: 'Gay' },
              { id: 'lesbian', label: 'Lesbian' },
              { id: 'bipan', label: 'Bi / Pan' },
              { id: 'trans', label: 'Trans-friendly' },
              { id: 'ace', label: 'Asexual' }].
              map((o) =>
              <Pill key={o.id} active={(local.forWho || []).includes(o.id)}
              onClick={() => togglePill('forWho', o.id)}>{o.label}</Pill>
              )}
            </div>
          </Section>

          {/* Vibe */}
          <Section title="Vibe">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
              { id: 'solo', label: 'Solo' },
              { id: 'couples', label: 'With a partner' },
              { id: 'beginners', label: 'First time' },
              { id: 'premium', label: 'Treat myself' },
              { id: 'travel', label: 'Travel-friendly' }].
              map((o) =>
              <Pill key={o.id} active={(local.vibe || []).includes(o.id)}
              onClick={() => togglePill('vibe', o.id)}>{o.label}</Pill>
              )}
            </div>
          </Section>

          {/* Brand */}
          <Section title="Zīmols">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Pulse', 'Velura', 'Lumen'].map((b) =>
              <Pill key={b} active={(local.brands || []).includes(b)}
              onClick={() => togglePill('brands', b)}>{b}</Pill>
              )}
            </div>
          </Section>

          {/* Colour */}
          <Section title="Krāsa">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
              { id: 'nude', label: 'Miesas', hex: '#E2BFA8' },
              { id: 'black', label: 'Melns', hex: '#2B2520' },
              { id: 'pink', label: 'Rozā', hex: '#EC407A' },
              { id: 'purple', label: 'Violets', hex: '#9575CD' },
              { id: 'brown', label: 'Brūns', hex: '#A88572' }].
              map((c) => {
                const active = (local.colours || []).includes(c.id);
                return (
                  <button key={c.id} onClick={() => togglePill('colours', c.id)} style={{
                    all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '7px 13px 7px 8px', borderRadius: theme.radiusPill,
                    background: active ? theme.ink : theme.surface,
                    color: active ? theme.bg : theme.ink,
                    border: `1.5px solid ${active ? theme.ink : theme.rule}`,
                    fontFamily: theme.body, fontSize: 12, fontWeight: 600
                  }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, background: c.hex, boxShadow: `inset 0 0 0 1px ${theme.rule}` }} />
                    {c.label}
                  </button>);

              })}
            </div>
          </Section>

          {/* Availability + flags */}
          <Section title="Pieejamība un akcijas">
            <Pill active={!!local.inStockOnly}
              onClick={() => setLocal({ ...local, inStockOnly: !local.inStockOnly })}>
              ✓ Tikai pieejamās
            </Pill>
            <Pill active={!!local.newOnly}
              onClick={() => setLocal({ ...local, newOnly: !local.newOnly })}>
              🆕 Jaunumi
            </Pill>
            <Pill active={!!local.saleOnly}
              onClick={() => setLocal({ ...local, saleOnly: !local.saleOnly })}>
              🔥 Akcijā
            </Pill>
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px 26px', borderTop: `1px solid ${theme.rule}`,
          display: 'flex', gap: 10, background: theme.surface
        }}>
          <button onClick={() => setLocal(DEFAULT_FILTERS)} style={{
            all: 'unset', cursor: 'pointer', height: 52, padding: '0 18px',
            borderRadius: theme.radiusPill, background: 'transparent',
            border: `1.5px solid ${theme.rule}`, color: theme.ink,
            fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>Clear all</button>
          <PrimaryButton theme={theme} size="md"
          onClick={() => {setFilters(local);onClose();}}>
            Show {applyFilters(PRODUCTS, local, 'featured').length} pieces
          </PrimaryButton>
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// LangSwitcher — small popover with LV / RU / EST / LT / ENG
// ─────────────────────────────────────────────────────────────
const LANGS = [
{ id: 'lv', code: 'LV', label: 'Latviešu', flag: '🇱🇻' },
{ id: 'ru', code: 'RU', label: 'Русский', flag: '🇷🇺' },
{ id: 'lt', code: 'LT', label: 'Lietuvių', flag: '🇱🇹' },
{ id: 'et', code: 'EE', label: 'Eesti', flag: '🇪🇪' },
{ id: 'en', code: 'ENG', label: 'English', flag: '🇬🇧' }];


function LangSwitcher({ theme }) {
  const [open, setOpen] = React.useState(false);
  const { lang, setLang } = useLang();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const current = LANGS.find((l) => l.id === lang) || LANGS[4];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        all: 'unset', cursor: 'pointer',
        height: 32, padding: '0 11px', borderRadius: 999,
        background: '#FFFFFF', color: theme.inkSoft,
        border: `1px solid ${theme.rule}`,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: theme.mono, fontWeight: 700, fontSize: 10,
        letterSpacing: 0.1, textTransform: 'uppercase'
      }}>
        <span style={{ color: "rgb(0, 0, 0)" }}>{current.code}</span>
        <span style={{ opacity: 0.5, fontSize: 9, transform: open ? 'rotate(180deg)' : 'none', color: "rgb(0, 0, 0)" }}>▾</span>
      </button>
      {open &&
      <div style={{
        position: 'absolute', top: 38, right: 0, zIndex: 50,
        minWidth: 110, background: theme.surface,
        border: `1px solid ${theme.rule}`, borderRadius: theme.radius,
        boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
        padding: 4, display: 'flex', flexDirection: 'column', gap: 2
      }}>
          {LANGS.map((l) => {
          const active = lang === l.id;
          return (
            <button key={l.id} onClick={() => {setLang(l.id);setOpen(false);}} style={{
              all: 'unset', cursor: 'pointer',
              padding: '8px 12px', borderRadius: theme.radiusSm,
              display: 'flex', alignItems: 'center', gap: 10,
              background: active ? theme.surfaceAlt : 'transparent',
              fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink
            }}>
                <span style={{ flex: 1 }}>{l.code}</span>
                {active && <Icon name="check" size={14} color={theme.accent} strokeWidth={2.2} />}
              </button>);

        })}
        </div>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// HeroBanner — auto-scrolling product/promo carousel
// ─────────────────────────────────────────────────────────────
function HeroBanner({ theme, items, interval = 3500, onItemClick }) {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = items.length;

  React.useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, interval, paused]);

  if (count === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1/1',
        borderRadius: theme.radius, overflow: 'hidden'
      }}>
      {items.map((item, i) =>
      <div key={i} onClick={() => onItemClick && onItemClick(item, i)} style={{
        position: 'absolute', inset: 0,
        opacity: i === idx ? 1 : 0,
        transform: `scale(${i === idx ? 1 : 1.03})`,
        transition: 'opacity .55s ease, transform .8s ease',
        pointerEvents: i === idx ? 'auto' : 'none',
        cursor: onItemClick ? 'pointer' : 'default'
      }}>
          {item.kind === 'promo' ?
        <div style={{
          width: '100%', height: '100%', padding: 18,
          background: item.bg || theme.ink, color: item.fg || theme.bg,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
        }}>
              {item.deco}
              <div style={{
            fontFamily: theme.body, fontSize: 9, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            opacity: 0.75
          }}>{item.kicker}</div>
              <div>
                <div style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 22,
              letterSpacing: theme.letterDisplay, lineHeight: 1.0,
              marginBottom: 4
            }}>{item.title}</div>
                {item.sub &&
            <div style={{
              fontFamily: theme.body, fontSize: 11, opacity: 0.78, lineHeight: 1.3
            }}>{item.sub}</div>
            }
              </div>
            </div> :

        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <ProductBlob product={item.product} theme={theme} />
              <div style={{
            position: 'absolute', top: 10, right: 10,
            background: theme.ink, color: theme.bg,
            fontFamily: theme.body, fontSize: 9, fontWeight: 700,
            letterSpacing: 0.4, textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 999
          }}>{item.product.badge || 'Shop'}</div>
            </div>
        }
        </div>
      )}

      {/* Dots */}
      {count > 1 &&
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 4, zIndex: 3,
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', borderRadius: 999,
        padding: '4px 8px'
      }}>
          {items.map((_, i) =>
        <button key={i} onClick={(e) => {e.stopPropagation();setIdx(i);}}
        aria-label={`Slide ${i + 1}`} style={{
          all: 'unset', cursor: 'pointer',
          width: i === idx ? 14 : 5, height: 5, borderRadius: 5,
          background: i === idx ? theme.ink : 'rgba(0,0,0,0.25)',
          transition: 'width .3s ease, background .3s ease'
        }} />
        )}
        </div>
      }
    </div>);

}