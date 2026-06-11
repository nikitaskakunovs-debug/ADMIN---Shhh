// admin-screens-2.jsx — Catalog, Inventory, Promos & gift cards

function effPrice(ctx, p) { const o = ctx.prices[p.id] || {}; return o.price != null ? o.price : p.price; }
function effOld(ctx, p) { const o = ctx.prices[p.id] || {}; return o.oldPrice != null ? o.oldPrice : (p.oldPrice || ''); }
function effHidden(ctx, p) { const o = ctx.prices[p.id] || {}; return !!o.hidden; }
function effCat(ctx, p) { const o = ctx.prices[p.id] || {}; return o.category != null ? o.category : p.category; }
function stockTone(n) { return n <= 0 ? 'danger' : n <= 4 ? 'warn' : 'ok'; }
function stockLabel(n) { return n <= 0 ? 'Out of stock' : n <= 4 ? 'Low' : 'In stock'; }

// ─────────────────────────────────────────────────────────────
// CATALOG (Products + Categories tabs, grid/list, variants)
// ─────────────────────────────────────────────────────────────
function ACatalog({ ctx, params, nav }) {
  const { stock, toast, confirm } = ctx;
  const [view, setView] = React.useState('list');      // list | grid
  const [tab, setTab] = React.useState('products');    // products | categories
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [brandFilter, setBrandFilter] = React.useState([]);
  const [stockFilter, setStockFilter] = React.useState('all');
  const [visFilter, setVisFilter] = React.useState('all');
  const [sort, setSort] = React.useState('name');
  const openId = params?.id || null;
  const openP = openId ? (window.PRODUCTS || []).find(p => p.id === openId) : null;

  // Editable category labels (prototype-local)
  const [cats, setCats] = React.useState(() => (window.CATEGORIES || []).filter(c => c.id !== 'all').map(c => ({ ...c })));
  const [catDraft, setCatDraft] = React.useState(null);

  const [draft, setDraft] = React.useState(null);
  const [newDraft, setNewDraft] = React.useState(null); // create-product form
  const [, bumpCatalog] = React.useState(0);
  const createProduct = async () => {
    const n = newDraft;
    if (n.busy) return;
    if (!n.name.trim()) { toast('Product name is required'); return; }
    const id = n.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) + '-' + Date.now().toString(36).slice(-4);
    const brandObj = (ctx.brands || window.BRANDS || []).find(b => b.id === n.brand);
    const product = {
      id, name: n.name.trim(), brand: brandObj ? brandObj.name : '', brandId: brandObj ? brandObj.id : null,
      category: n.category, code: (n.code || '').trim() || ('SH-NEW-' + Date.now().toString(36).toUpperCase()),
      price: +n.price || 0, stock: Math.max(0, +n.stock || 0), status: 'active', sizes: [], swatches: ['#1A1A19'],
    };
    const live = window.SHHH_LIVE;
    if (live && live.status !== 'fallback') {
      if (!live.session) { toast('⚠ Sign in to add products.'); return; }
      setNewDraft({ ...n, busy: true });
      try { await live.insertProduct(product); }
      catch (e) { console.warn('[shhh] product insert failed', e); toast('⚠ Could not save the product: ' + ((e && e.message) || 'unknown error')); setNewDraft({ ...n, busy: false }); return; }
    } else {
      // No database connection (local preview): keep the old browser-only path.
      try { const cp = JSON.parse(localStorage.getItem('shhh_admin_customproducts') || '[]'); cp.push(product); localStorage.setItem('shhh_admin_customproducts', JSON.stringify(cp)); } catch (e) {}
    }
    if (window.PRODUCTS) window.PRODUCTS.push(product);
    ctx.setStockVal(id, product.stock);
    if (ctx.log) ctx.log('catalog', 'Created product', product.name, product.brand);
    toast(product.name + ' created');
    setNewDraft(null); bumpCatalog(v => v + 1);
  };
  React.useEffect(() => {
    if (openP) {
      const colours = openP.colourNames || (openP.swatches || []).map((_, i) => 'Colour ' + (i + 1));
      const sizes = openP.sizes || [];
      const variants = [];
      (colours.length ? colours : ['Default']).forEach((cl, ci) => {
        (sizes.length ? sizes : ['One size']).forEach((sz, si) => {
          variants.push({ colour: cl, size: sz, sku: (openP.code || openP.id).toUpperCase() + '-' + ci + si, stock: Math.max(0, Math.round((stock[openP.id] ?? 0) / Math.max(1, (colours.length || 1) * (sizes.length || 1)))) });
        });
      });
      setDraft({ category: effCat(ctx, openP), price: effPrice(ctx, openP), oldPrice: effOld(ctx, openP), stock: stock[openP.id] ?? 0, hidden: effHidden(ctx, openP), badge: (ctx.prices[openP.id] || {}).badge ?? (openP.badge || ''), variants });
    } else setDraft(null);
  }, [openId]);

  const allBrands = Array.from(new Set((window.PRODUCTS || []).map(p => p.brand).filter(Boolean))).sort();
  const list = (window.PRODUCTS || []).filter(p => {
    if (cat !== 'all' && effCat(ctx, p) !== cat) return false;
    if (brandFilter.length && !brandFilter.includes(p.brand)) return false;
    if (q) { const s = q.toLowerCase(); if (!(p.name.toLowerCase().includes(s) || (p.brand || '').toLowerCase().includes(s) || (p.code || '').includes(s))) return false; }
    const n = stock[p.id] ?? 0;
    if (stockFilter === 'in' && n <= 4) return false;
    if (stockFilter === 'low' && !(n > 0 && n <= 4)) return false;
    if (stockFilter === 'out' && n > 0) return false;
    if (visFilter === 'visible' && effHidden(ctx, p)) return false;
    if (visFilter === 'hidden' && !effHidden(ctx, p)) return false;
    if (visFilter === 'sale' && !effOld(ctx, p)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price') return effPrice(ctx, a) - effPrice(ctx, b);
    if (sort === 'price-d') return effPrice(ctx, b) - effPrice(ctx, a);
    if (sort === 'stock') return (stock[a.id] ?? 0) - (stock[b.id] ?? 0);
    if (sort === 'stock-d') return (stock[b.id] ?? 0) - (stock[a.id] ?? 0);
    return a.name.localeCompare(b.name);
  });
  const anyFilter = cat !== 'all' || brandFilter.length || stockFilter !== 'all' || visFilter !== 'all' || q || sort !== 'name';

  const save = () => {
    ctx.setProduct(openP.id, { category: draft.category, price: +draft.price, oldPrice: draft.oldPrice === '' ? null : +draft.oldPrice, hidden: draft.hidden, badge: draft.badge });
    ctx.setStockVal(openP.id, draft.variants && draft.variants.length > 1 ? draft.variants.reduce((s, v) => s + (+v.stock || 0), 0) : +draft.stock);
    toast(`${openP.name} saved`);
    nav('catalog');
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{
      all: 'unset', cursor: 'pointer', padding: '9px 2px', marginRight: 22,
      fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft,
      borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent',
    }}>{label}</button>
  );
  const viewBtn = (id, ic) => (
    <button onClick={() => setView(id)} style={{ all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: AT.radiusSm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: view === id ? AT.ink : AT.panel, color: view === id ? '#fff' : AT.ink, border: `1px solid ${view === id ? AT.ink : AT.rule}` }}><AIcon name={ic} size={16} color={view === id ? '#fff' : AT.ink} /></button>
  );

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 18 }}>
        {tabBtn('products', `Products (${(window.PRODUCTS || []).length})`)}
        {tabBtn('categories', `Categories (${cats.length})`)}
      </div>

      {tab === 'products' && (
        <div>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            <ASelect label="Category" value={cat} onChange={setCat} options={[{ value: 'all', label: 'All' }, ...cats.map(c => ({ value: c.id, label: c.label }))]} />
            <AMultiSelect label="Brand" value={brandFilter} onChange={setBrandFilter} options={allBrands.map(b => ({ value: b, label: b, count: (window.PRODUCTS || []).filter(p => p.brand === b).length }))} />
            <ASelect label="Stock" value={stockFilter} onChange={setStockFilter} options={[{ value: 'all', label: 'All' }, { value: 'in', label: 'In stock' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }]} />
            <ASelect label="Show" value={visFilter} onChange={setVisFilter} options={[{ value: 'all', label: 'All' }, { value: 'visible', label: 'Visible' }, { value: 'hidden', label: 'Hidden' }, { value: 'sale', label: 'On sale' }]} />
            <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'name', label: 'Name' }, { value: 'price', label: 'Price ↑' }, { value: 'price-d', label: 'Price ↓' }, { value: 'stock', label: 'Stock ↑' }, { value: 'stock-d', label: 'Stock ↓' }]} />
            <AFilterReset show={anyFilter} onClear={() => { setCat('all'); setBrandFilter([]); setStockFilter('all'); setVisFilter('all'); setQ(''); setSort('name'); }} />
            <div style={{ flex: 1 }} />
            <ASearch value={q} onChange={setQ} placeholder="Search product, brand, code…" />
            <span style={{ display: 'inline-flex', gap: 4 }}>{viewBtn('list', 'list')}{viewBtn('grid', 'grid')}</span>
            <ABtn kind="primary" onClick={() => setNewDraft({ name: '', brand: '', category: (cats[0] && cats[0].id) || 'solo', code: '', price: '', stock: '0' })}><AIcon name="plus" size={15} /> Add</ABtn>
          </div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 12 }}>{list.length} of {(window.PRODUCTS || []).length} products</div>

          {view === 'list' ? (
            <ATable columns={[
              { label: 'Product' }, { label: 'Brand' }, { label: 'Category' }, { label: 'Code' },
              { label: 'Price', align: 'right' }, { label: 'Stock', align: 'right' }, { label: 'Status' }, { label: '' },
            ]}>
              {list.map(p => {
                const n = stock[p.id] ?? 0; const price = effPrice(ctx, p); const old = effOld(ctx, p);
                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => nav('catalog', { id: p.id })}>
                    <ATd strong onClick={() => nav('catalog', { id: p.id })}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 30, height: 30, borderRadius: 6, background: AT.surfaceAlt, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="0 0 100 100" width="20" height="20"><path d={p.blob} fill={AT.ink} /></svg></span>
                        <span>{p.name}{effHidden(ctx, p) && <ABadge tone="neutral"> hidden</ABadge>}</span>
                      </div>
                    </ATd>
                    <ATd onClick={() => nav('catalog', { id: p.id })}>{p.brand}</ATd>
                    <ATd style={{ textTransform: 'capitalize' }} onClick={() => nav('catalog', { id: p.id })}>{((window.CATEGORIES || []).find(c => c.id === effCat(ctx, p)) || {}).label || effCat(ctx, p)}</ATd>
                    <ATd mono onClick={() => nav('catalog', { id: p.id })}>{p.code}</ATd>
                    <ATd mono strong align="right" onClick={() => nav('catalog', { id: p.id })}>{money(price)}{old ? <span style={{ color: AT.inkSoft, fontWeight: 400, textDecoration: 'line-through', marginLeft: 6 }}>{money(old)}</span> : null}</ATd>
                    <ATd mono strong align="right" onClick={() => nav('catalog', { id: p.id })}>{n}</ATd>
                    <ATd onClick={() => nav('catalog', { id: p.id })}><ABadge tone={stockTone(n)}>{stockLabel(n)}</ABadge></ATd>
                    <ATd align="right" onClick={() => nav('catalog', { id: p.id })}><AIcon name="chev" size={16} color={AT.inkSoft} /></ATd>
                  </tr>
                );
              })}
            </ATable>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
              {list.map(p => {
                const n = stock[p.id] ?? 0; const price = effPrice(ctx, p); const old = effOld(ctx, p);
                return (
                  <button key={p.id} onClick={() => nav('catalog', { id: p.id })} style={{ all: 'unset', cursor: 'pointer' }}>
                    <APanel style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ aspectRatio: '1/1', background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <svg viewBox="0 0 100 100" width="48%" height="48%"><path d={p.blob} fill={AT.ink} /></svg>
                        <span style={{ position: 'absolute', top: 10, left: 10 }}><ABadge tone={stockTone(n)}>{stockLabel(n)}</ABadge></span>
                        {effHidden(ctx, p) && <span style={{ position: 'absolute', top: 10, right: 10 }}><ABadge tone="neutral">hidden</ABadge></span>}
                      </div>
                      <div style={{ padding: 12 }}>
                        <div style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft, textTransform: 'uppercase' }}>{p.brand}</div>
                        <div style={{ fontFamily: AT.display, fontWeight: 700, fontSize: 15, color: AT.ink, letterSpacing: AT.ld, lineHeight: 1.15, margin: '3px 0 6px' }}>{p.name}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: AT.mono, fontSize: 13.5, fontWeight: 700, color: AT.ink }}>{money(price)}{old ? <span style={{ color: AT.inkSoft, fontWeight: 400, textDecoration: 'line-through', marginLeft: 5, fontSize: 11.5 }}>{money(old)}</span> : null}</span>
                          <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft }}>{n} pcs</span>
                        </div>
                      </div>
                    </APanel>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <ABtn kind="primary" onClick={() => setCatDraft({ isNew: true, id: '', label: '', idx: -1 })}><AIcon name="plus" size={15} /> Add category</ABtn>
          </div>
          <ATable columns={[{ label: '#' }, { label: 'Category' }, { label: 'Slug' }, { label: 'Products', align: 'center' }, { label: 'Order' }, { label: '', align: 'right' }]}>
            {cats.map((c, i) => {
              const count = (window.PRODUCTS || []).filter(p => effCat(ctx, p) === c.id).length;
              return (
                <tr key={c.id}>
                  <ATd mono>{i + 1}</ATd>
                  <ATd strong>{c.label}</ATd>
                  <ATd mono>{c.id}</ATd>
                  <ATd mono align="center">{count}</ATd>
                  <ATd>
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      <button disabled={i === 0} onClick={() => setCats(prev => { const a = prev.slice(); [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; })} style={{ ...btnSq, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                      <button disabled={i === cats.length - 1} onClick={() => setCats(prev => { const a = prev.slice(); [a[i + 1], a[i]] = [a[i], a[i + 1]]; return a; })} style={{ ...btnSq, opacity: i === cats.length - 1 ? 0.3 : 1 }}>↓</button>
                    </span>
                  </ATd>
                  <ATd align="right">
                    <span style={{ display: 'inline-flex', gap: 6 }}>
                      <ABtn kind="ghost" size="sm" onClick={() => setCatDraft({ isNew: false, id: c.id, label: c.label, idx: i })}>Rename</ABtn>
                      <ABtn kind="ghost" size="sm" onClick={() => confirm({ title: `Delete the “${c.label}” category?`, body: 'Products keep their data but lose this category assignment. This cannot be undone.', confirmLabel: 'Yes, delete', icon: 'trash', tone: 'danger', onConfirm: () => { setCats(prev => prev.filter((_, j) => j !== i)); toast(`${c.label} removed`); } })}>Delete</ABtn>
                    </span>
                  </ATd>
                </tr>
              );
            })}
          </ATable>

          <ADrawer open={!!catDraft} onClose={() => setCatDraft(null)} width={420}
            title={catDraft ? (catDraft.isNew ? 'Add category' : 'Rename category') : ''}
            footer={catDraft && (<><ABtn kind="ghost" onClick={() => setCatDraft(null)}>Cancel</ABtn><ABtn kind="primary" onClick={() => {
              const label = (catDraft.label || '').trim(); if (!label) { toast('Name required'); return; }
              if (catDraft.isNew) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-'); setCats(prev => [...prev, { id, label }]); toast(`${label} added`); }
              else { setCats(prev => prev.map((c, j) => j === catDraft.idx ? { ...c, label } : c)); toast('Category renamed'); }
              setCatDraft(null);
            }}>Save</ABtn></>)}>
            {catDraft && <AField label="Category name"><AInput value={catDraft.label} onChange={e => setCatDraft({ ...catDraft, label: e.target.value })} /></AField>}
          </ADrawer>
        </div>
      )}

      {/* Create product */}
      <ADrawer open={!!newDraft} onClose={() => setNewDraft(null)} width={460} title="Add a product" sub="Create a new catalogue item"
        footer={newDraft && (<><ABtn kind="ghost" onClick={() => setNewDraft(null)}>Cancel</ABtn><ABtn kind="primary" onClick={createProduct} disabled={!!newDraft.busy}><AIcon name="plus" size={15} /> {newDraft.busy ? 'Creating…' : 'Create product'}</ABtn></>)}>
        {newDraft && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AField label="Product name"><AInput value={newDraft.name} onChange={e => setNewDraft({ ...newDraft, name: e.target.value })} placeholder="e.g. Lelo Sona 2" /></AField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <AField label="Brand"><select value={newDraft.brand} onChange={e => setNewDraft({ ...newDraft, brand: e.target.value })} style={{ ...aInputStyle, cursor: 'pointer' }}><option value="">— No brand —</option>{(ctx.brands || window.BRANDS || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></AField>
              <AField label="Category"><select value={newDraft.category} onChange={e => setNewDraft({ ...newDraft, category: e.target.value })} style={{ ...aInputStyle, cursor: 'pointer' }}>{(window.CATEGORIES || []).filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></AField>
              <AField label="Price incl. VAT (€)"><AInput type="number" value={newDraft.price} onChange={e => setNewDraft({ ...newDraft, price: e.target.value })} placeholder="0.00" /></AField>
              <AField label="Initial stock"><AInput type="number" value={newDraft.stock} onChange={e => setNewDraft({ ...newDraft, stock: e.target.value })} /></AField>
            </div>
            <AField label="SKU / code" hint="Leave blank to auto-generate"><AInput value={newDraft.code} onChange={e => setNewDraft({ ...newDraft, code: e.target.value })} /></AField>
          </div>
        )}
      </ADrawer>

      {/* Product editor */}
      <ADrawer open={!!openP && !!draft} onClose={() => nav('catalog')} width={560}
        title={openP ? openP.name : ''} sub={openP ? openP.brand + ' · ' + openP.code : ''}
        footer={openP && (<><ABtn kind="ghost" onClick={() => nav('catalog')}>Cancel</ABtn><ABtn kind="primary" onClick={save}>Save changes</ABtn></>)}>
        {openP && draft && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" width="46" height="46"><path d={openP.blob} fill={AT.ink} /></svg>
              </div>
              <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, lineHeight: 1.5 }}>{openP.ptype}<br />{openP.material} · {openP.modes} modes · {openP.decibels} dB</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <AField label="Category"><select value={draft.category || ''} onChange={e => setDraft({ ...draft, category: e.target.value })} style={{ ...aInputStyle, cursor: 'pointer' }}>{(window.CATEGORIES || []).filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></AField>
              <div />
              <AField label="Price incl. VAT (€)"><AInput type="number" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} /></AField>
              <AField label="Compare-at / old (€)" hint="Blank = no sale"><AInput type="number" value={draft.oldPrice} onChange={e => setDraft({ ...draft, oldPrice: e.target.value })} /></AField>
              <AField label="Badge" hint="e.g. Bestseller, New"><AInput value={draft.badge} onChange={e => setDraft({ ...draft, badge: e.target.value })} /></AField>
              <div style={{ alignSelf: 'flex-end', fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, paddingBottom: 8 }}>
                Net {money(vatOf(+draft.price || 0).net)} · VAT {money(vatOf(+draft.price || 0).vat)}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: AT.radiusSm, background: AT.surfaceAlt }}>
              <input type="checkbox" checked={!draft.hidden} onChange={e => setDraft({ ...draft, hidden: !e.target.checked })} />
              <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>Visible in storefront</span>
            </label>

            {/* Variants matrix */}
            <div>
              <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase', marginBottom: 10 }}>Variants ({draft.variants.length})</div>
              <div style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.3fr 0.9fr', background: AT.surfaceAlt, padding: '8px 12px', fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft }}>
                  <span>Colour</span><span>Size</span><span>SKU</span><span style={{ textAlign: 'right' }}>Stock</span>
                </div>
                {draft.variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.3fr 0.9fr', padding: '8px 12px', alignItems: 'center', borderTop: `1px solid ${AT.ruleSoft}` }}>
                    <span style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink }}>{v.colour}</span>
                    <span style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>{v.size}</span>
                    <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft }}>{v.sku}</span>
                    <input type="number" value={v.stock} onChange={e => setDraft({ ...draft, variants: draft.variants.map((x, j) => j === i ? { ...x, stock: e.target.value } : x) })} style={{ width: '100%', boxSizing: 'border-box', textAlign: 'right', height: 30, padding: '0 8px', borderRadius: 6, border: `1px solid ${AT.rule}`, fontFamily: AT.mono, fontSize: 12.5, color: AT.ink, outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, marginTop: 8 }}>Total on hand: <strong style={{ color: AT.ink }}>{draft.variants.reduce((s, v) => s + (+v.stock || 0), 0)}</strong> units</div>
            </div>
          </div>
        )}
      </ADrawer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────
function AInventory({ ctx }) {
  const { stock, toast } = ctx;
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [brandFilter, setBrandFilter] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sort, setSort] = React.useState('stock');
  const cats = (window.CATEGORIES || []).filter(c => c.id !== 'all');
  const allBrands = Array.from(new Set((window.PRODUCTS || []).map(p => p.brand).filter(Boolean))).sort();

  let list = (window.PRODUCTS || []).filter(p => {
    const n = stock[p.id] ?? 0;
    if (cat !== 'all' && p.category !== cat) return false;
    if (brandFilter.length && !brandFilter.includes(p.brand)) return false;
    if (statusFilter === 'in' && n <= 4) return false;
    if (statusFilter === 'low' && !(n > 0 && n <= 4)) return false;
    if (statusFilter === 'out' && n > 0) return false;
    if (q) { const s = q.toLowerCase(); if (!(p.name.toLowerCase().includes(s) || (p.brand || '').toLowerCase().includes(s) || (p.code || '').includes(s))) return false; }
    return true;
  });
  list.sort((a, b) => {
    if (sort === 'stock-d') return (stock[b.id] ?? 0) - (stock[a.id] ?? 0);
    if (sort === 'name') return a.name.localeCompare(b.name);
    return (stock[a.id] ?? 0) - (stock[b.id] ?? 0); // stock asc
  });
  const anyFilter = cat !== 'all' || brandFilter.length || statusFilter !== 'all' || q || sort !== 'stock';
  const totalUnits = Object.values(stock).reduce((s, n) => s + n, 0);
  const lowCount = (window.PRODUCTS || []).filter(p => (stock[p.id] ?? 0) <= 4).length;

  const adjust = (id, d) => { const cur = ctx.stock[id] ?? 0; ctx.setStockVal(id, Math.max(0, cur + d)); };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 22 }}>
        <AStat label="Total units" value={totalUnits} icon="inventory" />
        <AStat label="Low / out SKUs" value={lowCount} delta={lowCount ? 'Reorder soon' : 'Healthy'} deltaTone={lowCount ? 'warn' : 'ok'} icon="bolt" />
        <AStat label="SKUs" value={(window.PRODUCTS || []).length} icon="catalog" />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <ASelect label="Category" value={cat} onChange={setCat} options={[{ value: 'all', label: 'All' }, ...cats.map(c => ({ value: c.id, label: c.label }))]} />
        <AMultiSelect label="Brand" value={brandFilter} onChange={setBrandFilter} options={allBrands.map(b => ({ value: b, label: b, count: (window.PRODUCTS || []).filter(p => p.brand === b).length }))} />
        <ASelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All' }, { value: 'in', label: 'In stock' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out of stock' }]} />
        <ASelect label="Sort" value={sort} onChange={setSort} options={[{ value: 'stock', label: 'Stock ↑' }, { value: 'stock-d', label: 'Stock ↓' }, { value: 'name', label: 'Name' }]} />
        <AFilterReset show={anyFilter} onClear={() => { setCat('all'); setBrandFilter([]); setStatusFilter('all'); setQ(''); setSort('stock'); }} />
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Search product, brand, code…" />
        <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, whiteSpace: 'nowrap' }}>{list.length} of {(window.PRODUCTS || []).length}</span>
      </div>
      <ATable columns={[{ label: 'Product' }, { label: 'Code' }, { label: 'Status' }, { label: 'On hand', align: 'center' }, { label: 'Adjust', align: 'right' }]}>
        {list.map(p => {
          const n = stock[p.id] ?? 0;
          return (
            <tr key={p.id}>
              <ATd strong>{p.name}<div style={{ fontWeight: 400, fontSize: 11.5, color: AT.inkSoft }}>{p.brand}</div></ATd>
              <ATd mono>{p.code}</ATd>
              <ATd><ABadge tone={stockTone(n)}>{stockLabel(n)}</ABadge></ATd>
              <ATd mono strong align="center" style={{ fontSize: 16 }}>{n}</ATd>
              <ATd align="right">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => adjust(p.id, -1)} style={btnSq}>–</button>
                  <button onClick={() => adjust(p.id, 1)} style={btnSq}>+</button>
                  <button onClick={() => { ctx.setStockVal(p.id, n + 20); toast(`+20 added to ${p.name}`); }} style={{ ...btnSq, width: 'auto', padding: '0 10px', fontSize: 12, fontWeight: 700 }}>+20</button>
                </span>
              </ATd>
            </tr>
          );
        })}
      </ATable>
      {list.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No SKUs match" sub="Try another filter or search." /></div>}
    </div>
  );
}
const btnSq = { all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 7, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, boxSizing: 'border-box' };

// ─────────────────────────────────────────────────────────────
// PROMOS & GIFT CARDS
// ─────────────────────────────────────────────────────────────
function APromos({ ctx }) {
  const { toast, promos, setPromos, cards, setCards, confirm } = ctx;
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [drawer, setDrawer] = React.useState(null); // {mode:'promo'|'card', code, draft}
  const typeLabel = { percent: 'Percent', fixed: 'Fixed €', shipping: 'Free shipping' };

  const promoEntries = Object.entries(promos).filter(([code, p]) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (statusFilter === 'active' && p.disabled) return false;
    if (statusFilter === 'disabled' && !p.disabled) return false;
    if (q) { const s = q.toLowerCase(); if (!(code.toLowerCase().includes(s) || (p.desc || '').toLowerCase().includes(s))) return false; }
    return true;
  });
  const anyFilter = typeFilter !== 'all' || statusFilter !== 'all' || q;

  const openPromo = (code) => {
    const p = code ? promos[code] : { type: 'percent', value: 10, desc: '', disabled: false };
    setDrawer({ mode: 'promo', code: code || '', isNew: !code, draft: { code: code || '', type: p.type, value: p.value, desc: p.desc || '', disabled: !!p.disabled } });
  };
  const savePromo = () => {
    const d = drawer.draft; const code = (d.code || '').trim().toUpperCase();
    if (!code) { toast('Code required'); return; }
    setPromos({ ...promos, [code]: { type: d.type, value: +d.value || 0, label: d.type === 'percent' ? '−' + d.value + '%' : d.type === 'fixed' ? '−€' + d.value : 'Free shipping', desc: d.desc, disabled: d.disabled } });
    toast(`${code} saved`); setDrawer(null);
  };
  const togglePromo = (code) => { setPromos({ ...promos, [code]: { ...promos[code], disabled: !promos[code].disabled } }); toast(`${code} ${promos[code].disabled ? 'enabled' : 'disabled'}`); };

  const openCard = () => setDrawer({ mode: 'card', draft: { code: 'SHHH-', amount: 50 } });
  const saveCard = () => {
    const d = drawer.draft; const code = (d.code || '').trim().toUpperCase();
    if (!code) { toast('Code required'); return; }
    setCards({ ...cards, [code]: { initial: +d.amount || 0, balance: +d.amount || 0 } });
    toast(`Gift card ${code} issued`); setDrawer(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[['all', 'All'], ['percent', 'Percent'], ['fixed', 'Fixed €'], ['shipping', 'Free shipping']].map(([id, l]) => {
            const active = typeFilter === id;
            const n = id === 'all' ? Object.keys(promos).length : Object.values(promos).filter(p => p.type === id).length;
            return <button key={id} onClick={() => setTypeFilter(id)} style={{
              all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999,
              background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink,
              border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
            }}>{l} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 11, marginLeft: 4 }}>{n}</span></button>;
          })}
          <ASelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'disabled', label: 'Disabled' }]} />
          <ASearch value={q} onChange={setQ} placeholder="Search code or description…" />
          <AFilterReset show={anyFilter} onClear={() => { setTypeFilter('all'); setStatusFilter('all'); setQ(''); }} />
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{promoEntries.length} of {Object.keys(promos).length}</span>
          <ABtn kind="primary" size="md" onClick={() => openPromo(null)}><AIcon name="plus" size={15} /> New code</ABtn>
        </div>
        <ATable columns={[{ label: 'Code' }, { label: 'Type' }, { label: 'Value' }, { label: 'Label' }, { label: 'Status' }, { label: '', align: 'right' }]}>
          {promoEntries.map(([code, p]) => (
            <tr key={code} style={{ cursor: 'pointer' }} onClick={() => openPromo(code)}>
              <ATd mono strong>{code}</ATd>
              <ATd>{typeLabel[p.type] || p.type}</ATd>
              <ATd mono>{p.type === 'percent' ? p.value + '%' : p.type === 'fixed' ? money(p.value) : '—'}</ATd>
              <ATd>{p.desc}</ATd>
              <ATd><ABadge tone={p.disabled ? 'neutral' : 'ok'}>{p.disabled ? 'Disabled' : 'Active'}</ABadge></ATd>
              <ATd align="right">
                <span style={{ display: 'inline-flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <ABtn kind="ghost" size="sm" onClick={() => openPromo(code)}>Edit</ABtn>
                  <ABtn kind="ghost" size="sm" onClick={() => togglePromo(code)}>{p.disabled ? 'Enable' : 'Disable'}</ABtn>
                </span>
              </ATd>
            </tr>
          ))}
        </ATable>
        {promoEntries.length === 0 && <div style={{ marginTop: 12 }}><AEmpty title="No codes match" sub="Try another filter or search." /></div>}
      </div>

      <div>
        <ASectionTitle right={<ABtn kind="primary" size="sm" onClick={openCard}><AIcon name="plus" size={15} /> Issue card</ABtn>}>Gift cards</ASectionTitle>
        <ATable columns={[{ label: 'Code' }, { label: 'Initial', align: 'right' }, { label: 'Balance', align: 'right' }, { label: 'Status' }, { label: '', align: 'right' }]}>
          {Object.entries(cards).map(([code, c]) => (
            <tr key={code}>
              <ATd mono strong>{code}</ATd>
              <ATd mono align="right">{money(c.initial)}</ATd>
              <ATd mono strong align="right">{money(c.balance)}</ATd>
              <ATd><ABadge tone={c.balance > 0 ? 'ok' : 'neutral'}>{c.balance > 0 ? 'Active' : 'Used'}</ABadge></ATd>
              <ATd align="right">
                <span style={{ display: 'inline-flex', gap: 6 }}>
                  <ABtn kind="ghost" size="sm" onClick={() => confirm({ title: `Reset ${code} balance?`, body: `This restores the gift card to its full value of ${money(c.initial)}, overwriting the current balance of ${money(c.balance)}.`, confirmLabel: 'Yes, reset balance', icon: 'refund', tone: 'primary', onConfirm: () => { setCards({ ...cards, [code]: { ...c, balance: c.initial } }); toast(`${code} balance reset to ${money(c.initial)}`); } })}>Reset</ABtn>
                  <ABtn kind="ghost" size="sm" onClick={() => confirm({ title: `Void ${code}?`, body: `This sets the gift card balance to €0. Any remaining ${money(c.balance)} of store credit is lost and this cannot be undone.`, confirmLabel: 'Yes, void card', icon: 'trash', tone: 'danger', onConfirm: () => { setCards({ ...cards, [code]: { ...c, balance: 0 } }); toast(`${code} voided`); } })}>Void</ABtn>
                </span>
              </ATd>
            </tr>
          ))}
        </ATable>
      </div>

      {/* Editor drawer */}
      <ADrawer open={!!drawer} onClose={() => setDrawer(null)} width={460}
        title={drawer ? (drawer.mode === 'card' ? 'Issue gift card' : drawer.isNew ? 'New promo code' : 'Edit ' + drawer.code) : ''}
        footer={drawer && (<><ABtn kind="ghost" onClick={() => setDrawer(null)}>Cancel</ABtn><ABtn kind="primary" onClick={drawer.mode === 'card' ? saveCard : savePromo}>Save</ABtn></>)}>
        {drawer && drawer.mode === 'promo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AField label="Code"><AInput value={drawer.draft.code} onChange={e => setDrawer({ ...drawer, draft: { ...drawer.draft, code: e.target.value } })} style={{ textTransform: 'uppercase', fontFamily: AT.mono }} /></AField>
            <AField label="Type">
              <div style={{ display: 'flex', gap: 8 }}>
                {[['percent', 'Percent'], ['fixed', 'Fixed €'], ['shipping', 'Free ship']].map(([id, l]) => (
                  <button key={id} onClick={() => setDrawer({ ...drawer, draft: { ...drawer.draft, type: id } })} style={{
                    all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '9px 0', borderRadius: AT.radiusSm,
                    background: drawer.draft.type === id ? AT.ink : AT.panel, color: drawer.draft.type === id ? '#fff' : AT.ink,
                    border: `1px solid ${drawer.draft.type === id ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5,
                  }}>{l}</button>
                ))}
              </div>
            </AField>
            {drawer.draft.type !== 'shipping' && (
              <AField label={drawer.draft.type === 'percent' ? 'Percent (%)' : 'Amount (€)'}><AInput type="number" value={drawer.draft.value} onChange={e => setDrawer({ ...drawer, draft: { ...drawer.draft, value: e.target.value } })} /></AField>
            )}
            <AField label="Description"><AInput value={drawer.draft.desc} onChange={e => setDrawer({ ...drawer, draft: { ...drawer.draft, desc: e.target.value } })} /></AField>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={!drawer.draft.disabled} onChange={e => setDrawer({ ...drawer, draft: { ...drawer.draft, disabled: !e.target.checked } })} />
              <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink, fontWeight: 600 }}>Active</span>
            </label>
          </div>
        )}
        {drawer && drawer.mode === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AField label="Card code"><AInput value={drawer.draft.code} onChange={e => setDrawer({ ...drawer, draft: { ...drawer.draft, code: e.target.value } })} style={{ textTransform: 'uppercase', fontFamily: AT.mono }} /></AField>
            <AField label="Amount (€)">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[25, 50, 75, 100, 150].map(a => (
                  <button key={a} onClick={() => setDrawer({ ...drawer, draft: { ...drawer.draft, amount: a } })} style={{
                    all: 'unset', cursor: 'pointer', padding: '9px 14px', borderRadius: AT.radiusSm,
                    background: +drawer.draft.amount === a ? AT.ink : AT.panel, color: +drawer.draft.amount === a ? '#fff' : AT.ink,
                    border: `1px solid ${+drawer.draft.amount === a ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 700, fontSize: 13,
                  }}>€{a}</button>
                ))}
              </div>
            </AField>
          </div>
        )}
      </ADrawer>
    </div>
  );
}

Object.assign(window, { ACatalog, AInventory, APromos });
