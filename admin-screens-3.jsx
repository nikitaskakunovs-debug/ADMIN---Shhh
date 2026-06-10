/* Shhh Admin — screen 3: Products list + Product detail/editor. */

(function () {
  const { useState, useMemo } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function stockBadge(p) {
    if (p.stock === 0) return <UI.Badge tone="danger">Out of stock</UI.Badge>;
    if (p.stock <= 10) return <UI.Badge tone="warn">{p.stock} left</UI.Badge>;
    return <UI.Badge tone="ok">{p.stock} in stock</UI.Badge>;
  }

  function ProductsScreen() {
    const nav = window.useAdminNav();
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('all');
    const [status, setStatus] = useState('all');

    const rows = useMemo(() => {
      const needle = q.trim().toLowerCase();
      return SHOP_DATA.products.filter(p => {
        if (cat !== 'all' && p.category !== cat) return false;
        if (status !== 'all' && p.status !== status) return false;
        if (!needle) return true;
        return p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)
          || SHOP_BRANDS.name(p.brand).toLowerCase().includes(needle);
      });
    }, [q, cat, status]);

    return (
      <AdminViews.Page title="Products"
        description={`${SHOP_DATA.products.length} products across ${SHOP_BRANDS.brands.length} brands`}
        actions={<UI.Button icon="plus" onClick={() => UI.toast('Product creation is stubbed in this demo', 'danger')}>New product</UI.Button>}>

        <UI.Card pad={16}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <UI.SearchBox value={q} onChange={setQ} placeholder="Search name, SKU, brand…" style={{ width: 260 }} />
            <UI.Select value={cat} onChange={setCat} style={{ width: 170 }} options={[
              { value: 'all', label: 'All categories' },
              ...SHOP_DATA.categories.map(c => ({ value: c.id, label: c.name })),
            ]} />
            <UI.FilterChips value={status} onChange={setStatus} options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]} />
          </div>

          <UI.Table
            rowKey={p => p.id}
            empty="No products match your filters"
            onRowClick={p => nav.navigate('product', { id: p.id })}
            columns={[
              { key: 'name', label: 'Product', render: p => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <UI.Swatch color={p.color} size={36} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: T.faint, fontFamily: T.mono }}>{p.sku}</div>
                  </div>
                </div>
              )},
              { key: 'brand', label: 'Brand', render: p => <span style={{ color: T.sub }}>{SHOP_BRANDS.name(p.brand)}</span> },
              { key: 'category', label: 'Category', render: p => <span style={{ color: T.sub }}>{SHOP_DATA.categoryName(p.category)}</span> },
              { key: 'stock', label: 'Inventory', render: p => stockBadge(p) },
              { key: 'status', label: 'Status', render: p => <UI.StatusBadge status={p.status} /> },
              { key: 'price', label: 'Price', align: 'right', render: p => (
                <span>
                  <b>{D.money(p.price)}</b>
                  {p.compareAt && <span style={{ color: T.faint, textDecoration: 'line-through', marginLeft: 7, fontSize: 12 }}>{D.money(p.compareAt)}</span>}
                </span>
              )},
            ]}
            rows={rows} />
        </UI.Card>
      </AdminViews.Page>
    );
  }

  function ProductScreen({ params }) {
    const nav = window.useAdminNav();
    const product = SHOP_DATA.product(params.id);
    const [form, setForm] = useState(product ? {
      name: product.name, price: String(product.price), stock: String(product.stock), status: product.status,
    } : null);

    if (!product) {
      return (
        <AdminViews.Page title="Product not found" backTo="products" backLabel="Products">
          <UI.EmptyState title="This product doesn't exist" icon="alert" />
        </AdminViews.Page>
      );
    }

    const set = (k, v) => setForm({ ...form, [k]: v });
    const save = () => {
      product.name = form.name.trim() || product.name;
      product.price = Math.max(0, parseFloat(form.price) || product.price);
      product.stock = Math.max(0, parseInt(form.stock, 10) || 0);
      product.status = form.status;
      UI.toast(`Saved ${product.name}`);
    };

    const soldStats = D.topProducts(99).find(t => t.productId === product.id);
    const margin = product.price ? Math.round(((product.price - product.cost) / product.price) * 100) : 0;
    const recentOrders = D.orders.filter(o => o.items.some(it => it.productId === product.id)).slice(0, 5);

    return (
      <AdminViews.Page
        backTo="products" backLabel="Products"
        title={product.name}
        description={<span style={{ fontFamily: T.mono }}>{product.sku}</span>}
        actions={<UI.Button icon="check" onClick={save}>Save changes</UI.Button>}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card title="Details">
              <UI.Field label="Name"><UI.Input value={form.name} onChange={e => set('name', e.target.value)} /></UI.Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <UI.Field label="Price (EUR)"><UI.Input type="number" value={form.price} onChange={e => set('price', e.target.value)} /></UI.Field>
                <UI.Field label="Stock"><UI.Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} /></UI.Field>
                <UI.Field label="Status">
                  <UI.Select value={form.status} onChange={v => set('status', v)} options={[
                    { value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }, { value: 'archived', label: 'Archived' },
                  ]} />
                </UI.Field>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                {product.sizes.map(s => (
                  <span key={s} style={{
                    padding: '4px 12px', borderRadius: 9, border: `1px solid ${T.lineStrong}`,
                    fontSize: 12.5, fontWeight: 600, color: T.sub,
                  }}>{s}</span>
                ))}
              </div>
            </UI.Card>

            <UI.Card title="Recent orders with this product" pad={14}>
              <UI.Table
                rowKey={o => o.id}
                empty="No orders yet"
                onRowClick={o => nav.navigate('order', { id: o.id })}
                columns={[
                  { key: 'id', label: 'Order', render: o => <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{o.id}</span> },
                  { key: 'customerName', label: 'Customer' },
                  { key: 'status', label: 'Status', render: o => <UI.StatusBadge status={o.status} /> },
                  { key: 'createdAt', label: 'When', align: 'right', render: o => <span style={{ color: T.faint }}>{D.timeAgo(o.createdAt)}</span> },
                ]}
                rows={recentOrders} />
            </UI.Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UI.Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <UI.Swatch color={product.color} size={64} radius={16} />
                <div>
                  <div style={{ fontSize: 13, color: T.sub }}>{SHOP_BRANDS.name(product.brand)} · {SHOP_DATA.categoryName(product.category)}</div>
                  <div style={{ marginTop: 6 }}>{stockBadge(product)}</div>
                </div>
              </div>
            </UI.Card>

            <UI.Card title="Performance">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
                <KV k="Units sold" v={soldStats ? soldStats.units : 0} />
                <KV k="Revenue" v={soldStats ? D.money(soldStats.revenue) : D.money(0)} />
                <KV k="Unit cost" v={D.money(product.cost)} />
                <KV k="Margin" v={<UI.Badge tone={margin > 60 ? 'ok' : margin > 40 ? 'accent' : 'warn'}>{margin}%</UI.Badge>} />
                <KV k="Rating" v={product.rating ? '★ ' + product.rating.toFixed(1) : '—'} />
                <KV k="Added" v={product.createdAt} />
              </div>
            </UI.Card>
          </div>
        </div>
      </AdminViews.Page>
    );
  }

  function KV({ k, v }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: T.sub }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
      </div>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Products = ProductsScreen;
  window.AdminScreens.Product = ProductScreen;
})();
