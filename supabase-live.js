/* Shhh — live data loader.
   Fetches the catalog (products, brands, categories) from Supabase over
   HTTPS and exposes it as the globals the admin app already reads:
   window.PRODUCTS, window.BRANDS, and window.SHOP_DATA overlays.
   If Supabase is unreachable, the app falls back to the built-in demo
   data in shop-data.jsx — the site never breaks. */

window.SHHH_LIVE = {
  url: 'https://oqxbascndwsvnclpbmjg.supabase.co',
  // Publishable key: safe to ship in frontend code. Data access is
  // controlled by Row Level Security (db/security.sql), not by this key.
  key: 'sb_publishable_rKF8ve-MMNXNCqPVmfXzGA_DTcTx4e6',
  status: 'idle', // idle → loading → live | fallback

  async fetch(path) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch(this.url + '/rest/v1/' + path, {
        headers: { apikey: this.key, Authorization: 'Bearer ' + this.key },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + path);
      return await res.json();
    } finally { clearTimeout(timer); }
  },

  async load() {
    this.status = 'loading';
    const [products, brands, categories] = await Promise.all([
      this.fetch('products?select=legacy_id,sku,name,price,compare_at,cost,stock,status,color,sizes,created_at,category_id,brand:brands(id,name)&order=created_at.asc'),
      this.fetch('brands?select=id,name,country,kind,margin,blurb,featured&order=name.asc'),
      this.fetch('categories?select=id,name,position&order=position.asc'),
    ]);

    // Map DB rows → the product shape the admin screens expect.
    window.PRODUCTS = products.map(p => ({
      id: p.legacy_id || p.sku,
      code: p.sku,
      sku: p.sku,
      name: p.name,
      brand: p.brand ? p.brand.name : null,
      brandId: p.brand ? p.brand.id : null,
      category: p.category_id,
      price: Number(p.price),
      compareAt: p.compare_at == null ? null : Number(p.compare_at),
      cost: p.cost == null ? null : Number(p.cost),
      stock: p.stock,
      status: p.status,
      color: p.color,
      sizes: p.sizes || [],
      rating: 0, // derived from reviews once those move to the DB
      createdAt: (p.created_at || '').slice(0, 10),
    }));
    window.BRANDS = brands;

    // Keep the storefront object in sync for anything that reads it.
    if (window.SHOP_DATA) {
      window.SHOP_DATA.products = window.PRODUCTS;
      window.SHOP_DATA.categories = categories.map(c => ({ id: c.id, name: c.name }));
    }

    this.status = 'live';
    console.info('[shhh] Live catalog loaded from Supabase: ' +
      products.length + ' products, ' + brands.length + ' brands, ' + categories.length + ' categories.');
    return { products: products.length, brands: brands.length, categories: categories.length };
  },
};
