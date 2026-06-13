// admin-screens-4.jsx — Customers / CRM (with the Shhh GDPR angle)

const CRM_SEGMENTS = [
  { id: 'all', label: 'All' },
  { id: 'vip', label: 'VIP' },
  { id: 'repeat', label: 'Repeat' },
  { id: 'marketing', label: 'Marketing opted-in' },
  { id: 'new', label: 'New' },
];

// Account / receivables status shown per customer.
const PAY_STATUS = {
  debtor:   { label: 'Debtor', tone: 'danger', desc: 'Has an unpaid invoice — owes money.' },
  overpaid: { label: 'Overpaid', tone: 'blue', desc: 'Carries a credit balance we owe back.' },
  settled:  { label: 'Settled', tone: 'ok', desc: 'Account balanced — nothing outstanding.' },
};
// "+€" when we owe them (overpaid), plain "€" when they owe us (debtor).
function balanceLabel(c) {
  if (!c || !c.balance) return '€0.00';
  return (c.payStatus === 'overpaid' ? '+' : '') + money(Math.abs(c.balance));
}
function balanceColor(c) {
  return c.payStatus === 'debtor' ? '#B42318' : c.payStatus === 'overpaid' ? AT.accent : AT.inkSoft;
}

function ACustomers({ ctx, params, nav }) {
  const { customers, crmNote, crmToggleTag, crmErase, crmSetMarketing, toast, confirm } = ctx;
  const [q, setQ] = React.useState('');
  const [seg, setSeg] = React.useState('all');
  const [marketFilter, setMarketFilter] = React.useState([]);
  const [tagFilter, setTagFilter] = React.useState([]);
  const [mktConsent, setMktConsent] = React.useState('all');
  const [payFilter, setPayFilter] = React.useState('all');
  const [sort, setSort] = React.useState('ltv');
  const openEmail = params?.email || null;
  const open = openEmail ? customers.find(c => c.email === openEmail) : null;
  const [noteDraft, setNoteDraft] = React.useState('');
  React.useEffect(() => { setNoteDraft(open ? open.note : ''); }, [openEmail]);

  const list = customers.filter(c => {
    if (seg === 'vip' && !c.tags.includes('vip')) return false;
    if (seg === 'repeat' && !c.tags.includes('repeat')) return false;
    if (seg === 'marketing' && !c.marketing) return false;
    if (seg === 'new' && !c.tags.includes('new')) return false;
    if (marketFilter.length && !marketFilter.includes(c.market || c.country)) return false;
    if (tagFilter.length && !tagFilter.every(t => c.tags.includes(t))) return false;
    if (mktConsent === 'yes' && !c.marketing) return false;
    if (mktConsent === 'no' && c.marketing) return false;
    if (payFilter !== 'all' && c.payStatus !== payFilter) return false;
    if (q) { const s = q.toLowerCase(); return c.name.toLowerCase().includes(s) || (c.email || '').toLowerCase().includes(s) || (c.alias || '').toLowerCase().includes(s) || c.city.toLowerCase().includes(s); }
    return true;
  }).sort((a, b) => {
    if (sort === 'orders') return b.orderCount - a.orderCount;
    if (sort === 'recent') return a.lastOrder < b.lastOrder ? 1 : -1;
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'balance') return b.balance - a.balance;
    return b.ltv - a.ltv; // ltv
  });
  const anyFilter = seg !== 'all' || marketFilter.length || tagFilter.length || mktConsent !== 'all' || payFilter !== 'all' || q || sort !== 'ltv';

  const totalLtv = customers.reduce((s, c) => s + c.ltv, 0);
  const marketingCount = customers.filter(c => c.marketing).length;
  const vipCount = customers.filter(c => c.tags.includes('vip')).length;
  const debtors = customers.filter(c => c.payStatus === 'debtor');
  const receivable = debtors.reduce((s, c) => s + c.balance, 0);

  const tagTone = (t) => t === 'vip' ? 'warn' : t === 'repeat' ? 'ok' : t === 'refund-risk' ? 'danger' : t === 'couples' ? 'blue' : 'neutral';
  const ALL_TAGS = ['vip', 'repeat', 'new', 'couples', 'refund-risk'];

  return (
    <div>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
        <AStat label="Customers" value={customers.length} icon="users" />
        <AStat label="Lifetime value" value={money(totalLtv)} delta="all-time, paid orders" icon="bolt" />
        <AStat label="Receivables" value={money(receivable)} delta={debtors.length ? `${debtors.length} debtor${debtors.length > 1 ? 's' : ''} owe us` : 'all settled'} deltaTone={debtors.length ? 'danger' : 'ok'} icon="finance" />
        <AStat label="Marketing opted-in" value={`${marketingCount}/${customers.length}`} delta={`${Math.round(marketingCount / (customers.length || 1) * 100)}% consent`} icon="mail" />
        <AStat label="VIP" value={vipCount} delta="≥ €150 lifetime" deltaTone="warn" icon="tag" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        {CRM_SEGMENTS.map(s => {
          const active = seg === s.id;
          return <button key={s.id} onClick={() => setSeg(s.id)} style={{
            all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
            background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
            border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
          }}>{s.label}</button>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <AMultiSelect label="Market" value={marketFilter} onChange={setMarketFilter} options={MARKETS.filter(m => customers.some(c => (c.market || c.country) === m.id)).map(m => ({ value: m.id, label: m.country, count: customers.filter(c => (c.market || c.country) === m.id).length }))} />
        <AMultiSelect label="Tags" value={tagFilter} onChange={setTagFilter} options={ALL_TAGS.map(t => ({ value: t, label: t, count: customers.filter(c => c.tags.includes(t)).length }))} />
        <ASelect label="Marketing" value={mktConsent} onChange={setMktConsent} options={[{ value: 'all', label: 'All' }, { value: 'yes', label: 'Opted-in' }, { value: 'no', label: 'No consent' }]} />
        <ASelect label="Account" value={payFilter} onChange={setPayFilter} options={[{ value: 'all', label: 'All' }, { value: 'debtor', label: 'Debtor' }, { value: 'overpaid', label: 'Overpaid' }, { value: 'settled', label: 'Settled' }]} />
        <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'ltv', label: 'Lifetime value' }, { value: 'orders', label: 'Order count' }, { value: 'recent', label: 'Most recent' }, { value: 'name', label: 'Name' }, { value: 'balance', label: 'Balance owed' }]} />
        <AFilterReset show={anyFilter} onClear={() => { setSeg('all'); setMarketFilter([]); setTagFilter([]); setMktConsent('all'); setPayFilter('all'); setQ(''); setSort('ltv'); }} />
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search name, alias, email, city…" />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{list.length} of {customers.length}</span>
        <ABtn kind="ghost" onClick={() => toast('Exported customers (marketing-consented only)')}><AIcon name="download" size={15} /> Export</ABtn>
      </div>

      <ATable columns={[
        { label: 'Customer' }, { label: 'Location' }, { label: 'Orders', align: 'center' },
        { label: 'Lifetime value', align: 'right' }, { label: 'Account' }, { label: 'Last order' }, { label: 'Marketing' }, { label: 'Tags' }, { label: '', align: 'right' },
      ]}>
        {list.map(c => (
          <tr key={c.email} style={{ cursor: 'pointer' }} onClick={() => nav('customers', { email: c.email })}>
            <ATd strong>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <AAvatar name={c.name} size={32} />
                <span><span style={{ fontWeight: 700, color: AT.ink }}>{c.erased ? '— erased —' : c.name}</span>{c.business && !c.erased ? <span style={{ marginLeft: 7 }}><ABadge tone={c.reverseCharge ? 'blue' : 'neutral'}>{c.reverseCharge ? 'EU business · 0% VAT' : 'Business'}</ABadge></span> : null}<span style={{ display: 'block', fontSize: 11.5, color: AT.inkSoft }}>{c.erased ? 'data removed' : c.email}</span></span>
              </span>
            </ATd>
            <ATd>{c.city} · {c.country}</ATd>
            <ATd mono align="center">{c.orderCount}</ATd>
            <ATd mono strong align="right">{money(c.ltv)}</ATd>
            <ATd>
              <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                <ABadge tone={PAY_STATUS[c.payStatus].tone}>{PAY_STATUS[c.payStatus].label}</ABadge>
                {c.balance ? <span style={{ fontFamily: AT.mono, fontSize: 11, fontWeight: 700, color: balanceColor(c) }}>{balanceLabel(c)}</span> : null}
              </span>
            </ATd>
            <ATd mono>{c.lastOrder.slice(5, 10)}</ATd>
            <ATd>{c.marketing ? <ABadge tone="ok">Opted-in</ABadge> : <ABadge tone="neutral">No</ABadge>}</ATd>
            <ATd><span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>{c.tags.length ? c.tags.map(t => <ABadge key={t} tone={tagTone(t)}>{t}</ABadge>) : <span style={{ color: AT.inkSoft }}>—</span>}</span></ATd>
            <ATd align="right"><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
          </tr>
        ))}
      </ATable>
      {list.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No customers match" sub="Try another segment or search." /></div>}

      {/* Profile drawer */}
      <ADrawer open={!!open} onClose={() => nav('customers')} width={580}
        title={open ? (open.erased ? 'Erased customer' : open.name) : ''}
        sub={open ? (open.erased ? 'Data removed on GDPR request' : open.alias + ' · since ' + open.since) : ''}
        footer={open && !open.erased && (
          <>
            <ABtn kind="ghost" onClick={() => toast('Customer data exported (JSON)')}><AIcon name="download" size={15} /> Export data</ABtn>
            <ABtn kind="danger" onClick={() => confirm({ title: 'Erase this customer’s data?', body: 'All personal data (name, email, addresses, notes) is permanently removed. Order totals stay as anonymised metrics. This cannot be undone.', confirmLabel: 'Yes, erase data', requireType: 'ERASE', icon: 'trash', tone: 'danger', onConfirm: () => { crmErase(open.email); toast('Personal data erased'); nav('customers'); } })}><AIcon name="trash" size={15} /> Erase (GDPR)</ABtn>
          </>
        )}>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {open.erased ? (
              <div style={{ padding: 18, borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, lineHeight: 1.5 }}>
                This customer exercised their right to erasure. Name, email, addresses and notes were removed. {open.orderCount} historical order(s) remain as anonymised revenue metrics only.
              </div>
            ) : (
              <>
                {/* Header KPIs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <AAvatar name={open.name} size={52} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0 24px', flex: 1 }}>
                    {[['Orders', open.orderCount], ['Lifetime', money(open.ltv)], ['Avg order', money(open.ltv / (open.orderCount || 1))]].map(([l, v]) => (
                      <div key={l}><div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 20, color: AT.ink, letterSpacing: AT.ld }}>{v}</div><div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{l}</div></div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['mail', open.email], ['pin', open.city + ', ' + open.country], ['users', 'Alias: ' + open.alias], ['shield', open.marketing ? 'Marketing: opted-in' : 'Marketing: no consent']].map(([ic, v]) => (
                    <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 9 }}><AIcon name={ic} size={16} color={AT.inkSoft} /><span style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink }}>{v}</span></div>
                  ))}
                </div>

                {/* Business / VAT registration */}
                {open.business && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: AT.radiusSm, border: `1px solid ${open.reverseCharge ? AT.rule : AT.ruleSoft}`, background: AT.surfaceAlt }}>
                    <AIcon name="finance" size={17} color={AT.inkSoft} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: AT.body, fontSize: 13, fontWeight: 700, color: AT.ink }}>{open.company || 'Legal person'}</span>
                        <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.accent }}>VAT {open.vatNo}</span>
                        {open.reverseCharge && <ABadge tone="blue">Reverse charge</ABadge>}
                      </div>
                      <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.45, marginTop: 3 }}>{open.reverseCharge ? 'EU-registered legal person in another member state — invoices are issued at 0% VAT (reverse charge; the buyer self-accounts VAT).' : 'Latvian VAT-registered business — invoiced at the standard 21% VAT.'}</div>
                    </div>
                  </div>
                )}

                {/* Account status & balance */}
                <div style={{ padding: '14px 16px', borderRadius: AT.radiusSm, border: `1px solid ${open.payStatus === 'debtor' ? '#E6B4B0' : AT.rule}`, background: AT.surfaceAlt }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: open.payStatus !== 'settled' ? 11 : 0 }}>
                    <ABadge tone={PAY_STATUS[open.payStatus].tone}>{PAY_STATUS[open.payStatus].label}</ABadge>
                    <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{PAY_STATUS[open.payStatus].desc}</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 20, color: balanceColor(open) }}>{balanceLabel(open)}</span>
                  </div>
                  {open.owed > 0 && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginBottom: 10 }}>Includes {money(open.owed)} from unpaid order(s) awaiting payment.</div>}
                  {open.payStatus !== 'settled' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: `1px solid ${AT.ruleSoft}`, paddingTop: 11 }}>
                      {open.payStatus === 'debtor' ? (
                        <>
                          <ABtn kind="primary" size="sm" onClick={() => toast('Payment reminder emailed to ' + open.name)}>Send payment reminder</ABtn>
                          <ABtn kind="ghost" size="sm" onClick={() => toast(money(open.balance) + ' marked as settled')}>Mark settled</ABtn>
                        </>
                      ) : (
                        <>
                          <ABtn kind="primary" size="sm" onClick={() => toast('Refunded ' + money(Math.abs(open.balance)) + ' to ' + open.name)}>Refund overpayment</ABtn>
                          <ABtn kind="ghost" size="sm" onClick={() => toast(money(Math.abs(open.balance)) + ' kept as store credit')}>Keep as credit</ABtn>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Marketing consent toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: AT.radiusSm, background: AT.surfaceAlt }}>
                  <input type="checkbox" checked={open.marketing} onChange={e => { crmSetMarketing(open.email, e.target.checked); toast(e.target.checked ? 'Marketing consent on' : 'Marketing consent off'); }} />
                  <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>Email marketing consent</span>
                </label>

                {/* Tags */}
                <div>
                  <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 8 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {ALL_TAGS.map(t => {
                      const on = open.tags.includes(t);
                      return <button key={t} onClick={() => crmToggleTag(open.email, t)} style={{
                        all: 'unset', cursor: 'pointer', padding: '5px 11px', borderRadius: 999,
                        background: on ? AT.ink : AT.panel, color: on ? '#fff' : AT.inkSoft,
                        border: `1px solid ${on ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12,
                      }}>{on ? '✓ ' : '+ '}{t}</button>;
                    })}
                  </div>
                </div>

                {/* Order history */}
                <div>
                  <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 8 }}>Order history · {open.orderCount}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {open.orders.slice().sort((a, b) => b.date.localeCompare(a.date)).map(o => (
                      <button key={o.ref} onClick={() => nav('orders', { ref: o.ref })} style={{
                        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        padding: '10px 0', borderTop: `1px solid ${AT.ruleSoft}`,
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontFamily: AT.mono, fontWeight: 700, fontSize: 13, color: AT.ink }}>#{o.ref}</span>
                          <AStatus status={o.status} />
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontFamily: AT.mono, fontSize: 12.5, color: AT.ink }}>{money(o.total)}</span>
                          <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft }}>{o.date.slice(5, 10)}</span>
                          <AIcon name="chev" size={14} color={AT.inkSoft} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal note */}
                <div>
                  <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 8 }}>Internal note</div>
                  <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Private — support only. Never shown to the customer." style={{ ...aInputStyle, height: 'auto', minHeight: 72, padding: 12, lineHeight: 1.5, resize: 'vertical', width: '100%' }} />
                  {noteDraft !== open.note && (
                    <div style={{ marginTop: 8 }}><ABtn kind="primary" size="sm" onClick={() => { crmNote(open.email, noteDraft); toast('Note saved'); }}>Save note</ABtn></div>
                  )}
                </div>

                <div style={{ padding: 14, borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.5 }}>
                  <strong style={{ color: AT.ink }}>Privacy:</strong> profiles are built from order history. Delivery addresses purge 30 days after delivery; only the alias, city and consented marketing data persist. Use <strong style={{ color: AT.ink }}>Erase</strong> to honour a GDPR request.
                </div>
              </>
            )}
          </div>
        )}
      </ADrawer>
    </div>
  );
}

Object.assign(window, { ACustomers });
