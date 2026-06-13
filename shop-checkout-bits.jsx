// shop-checkout-bits.jsx — Courier picker, payment grid, anonymity tips

// ─────────────────────────────────────────────────────────────
// Bank logos (compact + recognisable, original interpretations)
// ─────────────────────────────────────────────────────────────
function BankBadge({ bank, size = 28 }) {
  const wrap = (color, content) => (
    <div style={{
      width: size, height: size, borderRadius: 7,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', fontWeight: 800,
      fontSize: size * 0.42, letterSpacing: -0.3,
      flexShrink: 0,
    }}>
      {content}
    </div>
  );
  if (bank === 'citadele') return wrap('#00945E', 'C');
  if (bank === 'swedbank') return wrap('#F47000', 'S');
  if (bank === 'seb') return wrap('#418FDE', 'SEB');
  if (bank === 'luminor') return wrap('#5C2D91', 'L');
  return wrap('#666', '€');
}

// ─────────────────────────────────────────────────────────────
// PaymentMethodGrid — radio-style payment picker
// ─────────────────────────────────────────────────────────────
function PaymentMethodGrid({ theme, value, onChange }) {
  const express = PAYMENT_METHODS.filter(m => m.kind === 'express');
  const banklinks = PAYMENT_METHODS.filter(m => m.kind === 'banklink');
  const cards = PAYMENT_METHODS.filter(m => m.kind === 'card');
  const bnpl = PAYMENT_METHODS.filter(m => m.kind === 'bnpl');

  const Row = ({ m }) => {
    const active = value === m.id;
    return (
      <button onClick={() => onChange(m.id)} style={{
        all: 'unset', cursor: 'pointer',
        padding: '14px 14px', borderRadius: theme.radius,
        background: theme.surface,
        border: `1.5px solid ${active ? theme.ink : theme.rule}`,
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        boxSizing: 'border-box',
      }}>
        {m.kind === 'banklink' && <BankBadge bank={m.bank} />}
        {m.kind === 'bnpl' && (
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: m.color || theme.ink, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: theme.body, fontWeight: 800, fontSize: 13,
          }}>{m.bank === 'inbank' ? 'i' : 'K'}</div>
        )}
        {m.kind === 'express' && (
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: '#000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {m.id === 'apple' ? <Icon name="apple" size={16} color="#fff" />
            : <span style={{ fontWeight: 700, fontSize: 11 }}>
                <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span>
              </span>}
          </div>
        )}
        {m.kind === 'card' && (
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: theme.surfaceAlt, color: theme.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="card" size={16} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>{m.name}</span>
            {m.anonymous && (
              <span style={{
                fontFamily: theme.body, fontSize: 9, fontWeight: 700,
                padding: '2px 6px', borderRadius: 4,
                background: theme.surfaceAlt, color: theme.inkSoft,
                letterSpacing: 0.3, textTransform: 'uppercase',
              }}>{t('courier.anon','Anon')}</span>
            )}
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
            {m.sub}
          </div>
        </div>
        <div style={{
          width: 20, height: 20, borderRadius: 999, flexShrink: 0,
          border: `2px solid ${active ? theme.ink : theme.rule}`,
          background: active ? theme.ink : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {active && <Icon name="check" size={12} color={theme.bg} strokeWidth={2.2} />}
        </div>
      </button>
    );
  };

  const Group = ({ label, items }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: theme.body, fontSize: 10, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.inkSoft, marginBottom: 8, padding: '0 2px',
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(m => <Row key={m.id} m={m} />)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 20px 0' }}>
      <Group label="Tap & pay" items={express} />
      <Group label="Banklink — Latvija" items={banklinks} />
      <Group label="Maksā vēlāk / uz nomaksu" items={bnpl} />
      <Group label="Card" items={cards} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CourierPicker — Latvian couriers, parcel locker locations
// ─────────────────────────────────────────────────────────────
function CourierPicker({ theme, courierId, locationId, onCourier, onLocation }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const courier = COURIERS.find(c => c.id === courierId) || COURIERS[0];
  const [showLockers, setShowLockers] = React.useState(false);
  const [lockerQuery, setLockerQuery] = React.useState('');
  const [method, setMethod] = React.useState(courier.type === 'door' ? 'door' : courier.type === 'pickup' ? 'pickup' : 'locker');

  const METHODS = [
    { id: 'locker', label: '📦 Pakomāts' },
    { id: 'pickup', label: '🏪 Izņemšana' },
    { id: 'door',   label: '🚪 Pie durvīm' },
  ];
  const shown = COURIERS.filter(c => c.type === method);

  return (
    <div style={{ padding: '0 20px 0' }}>
      <div style={{
        fontFamily: theme.body, fontSize: 10, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.inkSoft, marginBottom: 8, padding: '0 2px',
      }}>{t('courier.method','Delivery method')}</div>

      {/* Method chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {METHODS.map(m => {
          const on = method === m.id;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center',
              padding: '9px 6px', borderRadius: theme.radiusPill,
              background: on ? theme.ink : theme.surface,
              color: on ? theme.bg : theme.ink,
              border: `1.5px solid ${on ? theme.ink : theme.rule}`,
              fontFamily: theme.body, fontWeight: 700, fontSize: 12,
            }}>{m.label}</button>
          );
        })}
      </div>

      {/* Shared anonymity note */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
        fontFamily: theme.body, fontSize: 11, color: theme.inkSoft,
      }}>
        <Icon name="lock" size={13} color={theme.inkSoft} />
        {method === 'door' ? 'Vārds uz iepakojuma. Pārējais anonīms.' : 'Visi pakomāti ir anonīmi 🔒'}
      </div>

      {/* Compact courier rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {shown.map(c => {
          const active = courierId === c.id;
          return (
            <button key={c.id}
              onClick={() => { onCourier(c.id); setShowLockers(!!c.locations); }}
              style={{
                all: 'unset', cursor: 'pointer',
                padding: '10px 12px', borderRadius: theme.radius,
                background: active ? theme.surfaceAlt : theme.surface,
                border: `1.5px solid ${active ? theme.ink : theme.rule}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
              <div style={{
                width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                background: theme.surface, color: theme.ink,
                border: `1px solid ${theme.rule}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: theme.display, fontWeight: 700, fontSize: 10,
              }}>
                {c.id === 'omniva' ? 'OM' : c.id === 'pasts' ? 'LP' : c.id === 'dpd' ? 'DPD' : c.id === 'venipak' ? 'VP' : <Icon name="truck" size={16} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>{c.name}</span>
                <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginLeft: 8 }}>{c.eta}</span>
              </div>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink, fontWeight: 600, flexShrink: 0 }}>
                €{c.price.toFixed(2)}
              </span>
              {active && (
                <span style={{
                  width: 18, height: 18, borderRadius: 999, background: theme.ink, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="check" size={11} color={theme.bg} strokeWidth={2.4} /></span>
              )}
            </button>
          );
        })}
      </div>

      {courier.locations && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: theme.body, fontSize: 10, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 8,
          }}>Pick a {courier.type === 'locker' ? 'locker' : 'pickup point'}</div>
          <div style={{
            height: 46, borderRadius: theme.radiusPill, background: theme.surfaceAlt,
            border: `1px solid ${theme.rule}`,
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, marginBottom: 8,
          }}>
            <Icon name="search" size={18} color={theme.inkSoft} />
            <input value={lockerQuery} onChange={(e) => setLockerQuery(e.target.value)}
              placeholder="Meklē pakomātu pēc pilsētas vai adreses…"
              style={{
                flex: 1, minWidth: 0, background: 'transparent', border: 'none',
                fontFamily: theme.body, fontSize: 14, color: theme.ink, outline: 'none',
              }} />
            {lockerQuery && (
              <button onClick={() => setLockerQuery('')} aria-label="Notīrīt" style={{
                all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 999,
                background: theme.ink, color: theme.bg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              }}>✕</button>
            )}
          </div>
          {lockerQuery.trim() && (() => {
            const q = lockerQuery.trim().toLowerCase();
            const matches = courier.locations.filter(l =>
              l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
            if (matches.length === 0) {
              return (
                <div style={{
                  padding: '14px', textAlign: 'center', borderRadius: theme.radiusSm,
                  border: `1.5px dashed ${theme.rule}`,
                  fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
                }}>Nav atrasts pakomāts pēc “{lockerQuery}”.</div>
              );
            }
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {matches.map(loc => {
                  const active = locationId === loc.id;
                  return (
                    <button key={loc.id} onClick={() => onLocation(loc.id)} style={{
                      all: 'unset', cursor: 'pointer',
                      padding: '12px 14px', borderRadius: theme.radiusSm,
                      background: active ? theme.ink : theme.surface,
                      color: active ? theme.bg : theme.ink,
                      border: `1.5px solid ${active ? theme.ink : theme.rule}`,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <Icon name="box" size={16} color={active ? theme.bg : theme.inkSoft} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 600 }}>{loc.name}</div>
                        <div style={{
                          fontFamily: theme.body, fontSize: 11,
                          color: active ? theme.bg : theme.inkSoft, opacity: active ? 0.8 : 1, marginTop: 2,
                        }}>{loc.address}</div>
                      </div>
                      <span style={{
                        fontFamily: theme.mono, fontSize: 11,
                        color: active ? theme.bg : theme.inkSoft, opacity: active ? 0.8 : 1,
                      }}>{loc.distance}</span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
          {!lockerQuery.trim() && locationId && (() => {
            const sel = courier.locations.find(l => l.id === locationId);
            if (!sel) return null;
            return (
              <div style={{
                padding: '12px 14px', borderRadius: theme.radiusSm,
                background: theme.ink, color: theme.bg,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name="box" size={16} color={theme.bg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 600 }}>{sel.name}</div>
                  <div style={{ fontFamily: theme.body, fontSize: 11, opacity: 0.8, marginTop: 2 }}>{sel.address}</div>
                </div>
                <Icon name="check" size={16} color={theme.bg} strokeWidth={2.4} />
              </div>
            );
          })()}
        </div>
      )}

      <div style={{
        padding: '12px 14px', background: theme.surfaceAlt,
        borderRadius: theme.radius, display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Icon name="ghost" size={16} color={theme.ink} />
        <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.45 }}>
          {courier.note}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnonymityTips — surfaced next to the contact form
// ─────────────────────────────────────────────────────────────
function AnonymityTips({ theme, expanded: expandedProp = false }) {
  const tT = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [expanded, setExpanded] = React.useState(expandedProp);
  const tips = [
    {
      icon: 'box',
      title: tT('anon.tip1.title','Use a parcel locker'),
      body: tT('anon.tip1.body','Omniva, Pastomat or Venipak — your name only appears on the locker screen, not on a doorstep.'),
    },
    {
      icon: 'ghost',
      title: tT('anon.tip2.title','Use an alias name'),
      body: tT('anon.tip2.body','We don\u2019t verify. Whatever name fits the locker label is fine — "M. M." is a popular pick.'),
    },
    {
      icon: 'eyeOff',
      title: tT('anon.tip3.title','Use a + email alias'),
      body: tT('anon.tip3.body','On Gmail and most providers, you+shhh@yourmail.com routes to you but is easy to filter and delete.'),
    },
    {
      icon: 'apple',
      title: tT('anon.tip4.title','Pay tap-style or by banklink'),
      body: tT('anon.tip4.body','Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor banklinks — we never see your card number.'),
    },
    {
      icon: 'card',
      title: tT('anon.tip5.title','Bank statement reads "NL Trading Co"'),
      body: tT('anon.tip5.body','No mention of us or what you bought. Even a casual reader sees nothing.'),
    },
    {
      icon: 'lock',
      title: tT('anon.tip6.title','Skip the phone number'),
      body: tT('anon.tip6.body','Phone is optional for locker delivery. Courier door delivery is the only mode that needs it.'),
    },
  ];

  return (
    <div style={{
      borderRadius: theme.radius, background: theme.surface,
      border: `1.5px solid ${theme.accent}`,
      overflow: 'hidden',
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: theme.accent, color: theme.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="ghost" size={18} color={theme.accentInk} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{
            fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            color: theme.ink, letterSpacing: -0.1,
          }}>Want to stay anonymous?</div>
          <div style={{
            fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2,
          }}>{expanded ? 'Six things you can do.' : 'Tap for six ways.'}</div>
        </div>
        <div style={{ color: theme.inkSoft, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform .2s ease' }}>
          <Icon name="chev" size={18} />
        </div>
      </button>

      {expanded && (
        <div style={{
          padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12,
          borderTop: `1px solid ${theme.rule}`,
        }}>
          {tips.map((tip, i) => (
            <div key={tip.title} style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: theme.surfaceAlt, color: theme.ink, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: theme.mono, fontWeight: 700, fontSize: 10,
              }}>{(i + 1).toString().padStart(2, '0')}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                  color: theme.ink, marginBottom: 2,
                }}>{tip.title}</div>
                <div style={{
                  fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.45,
                }}>{tip.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BankBadge, PaymentMethodGrid, CourierPicker, AnonymityTips, SenderLabelChooser });

// ─────────────────────────────────────────────────────────────
// SenderLabelChooser — collapsible "what should the parcel sender say?"
// optional, only for users who care to customise it.
// ─────────────────────────────────────────────────────────────
function SenderLabelChooser({ theme, value, onChange }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [open, setOpen] = React.useState(false);
  const current = (PSEUDO_SENDERS.find(s => s.id === value) || PSEUDO_SENDERS[0]);

  return (
    <div style={{
      margin: '0 20px 8px', borderRadius: theme.radius,
      border: `1px solid ${theme.rule}`, background: theme.surface, overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          background: theme.surfaceAlt, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="box" size={16} /></div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{
            fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.ink,
          }}>Mainīt sūtītāja vārdu <span style={{ color: theme.inkSoft, fontWeight: 500 }}>(neobligāti)</span></div>
          <div style={{
            fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2,
          }}>Pašlaik: {current.name}</div>
        </div>
        <span style={{ color: theme.inkSoft, fontSize: 12, transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {open && (
        <div style={{
          padding: '4px 14px 14px', borderTop: `1px solid ${theme.rule}`,
        }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, lineHeight: 1.5,
            padding: '10px 0 12px',
          }}>
            Noklusētais "NL Trading Co" jau neko neatklāj. Izvēlies citu neitrālu vārdu tikai tad, ja vēlies.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PSEUDO_SENDERS.map(s => {
              const active = value === s.id;
              return (
                <button key={s.id} onClick={() => onChange(s.id)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '10px 12px', borderRadius: theme.radiusSm,
                  background: active ? theme.surfaceAlt : 'transparent',
                  border: `1.2px solid ${active ? theme.ink : theme.rule}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                    background: s.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: theme.body, fontWeight: 800, fontSize: 11, letterSpacing: 0.3,
                  }}>{s.logo}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>
                      {s.sub}
                    </div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                    border: `2px solid ${active ? theme.ink : theme.rule}`,
                    background: active ? theme.ink : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <Icon name="check" size={10} color={theme.bg} strokeWidth={2.4} />}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 6,
            background: theme.surfaceAlt, fontFamily: theme.body, fontSize: 11,
            color: theme.inkSoft, lineHeight: 1.45,
          }}>
            None of these affect what's inside, who actually ships it, or your warranty. Purely cosmetic.
          </div>
        </div>
      )}
    </div>
  );
}
