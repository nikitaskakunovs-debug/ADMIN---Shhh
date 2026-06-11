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
  session: null,  // { access_token, refresh_token, expires_at, user }
  user: null,

  // ── Auth (Supabase GoTrue over HTTPS) ────────────────────────
  _saveSession(s) {
    this.session = s; this.user = s ? s.user : null;
    try {
      if (s) localStorage.setItem('shhh_sb_session', JSON.stringify(s));
      else localStorage.removeItem('shhh_sb_session');
    } catch (e) {}
  },

  async _authPost(path, body) {
    const res = await fetch(this.url + '/auth/v1/' + path, {
      method: 'POST',
      headers: { apikey: this.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.msg || data.error_description || data.message || ('HTTP ' + res.status));
    return data;
  },

  async signIn(email, password) {
    const data = await this._authPost('token?grant_type=password', { email, password });
    data.expires_at = Math.floor(Date.now() / 1000) + (data.expires_in || 3600);
    this._saveSession(data);
    return data.user;
  },

  async signOut() {
    const s = this.session;
    this._saveSession(null);
    if (s) {
      try {
        await fetch(this.url + '/auth/v1/logout', {
          method: 'POST',
          headers: { apikey: this.key, Authorization: 'Bearer ' + s.access_token },
        });
      } catch (e) {}
    }
  },

  // Restore (and refresh if stale) a saved session. Returns user or null.
  async restoreSession() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem('shhh_sb_session') || 'null'); } catch (e) {}
    if (!s || !s.refresh_token) return null;
    const fresh = s.expires_at && s.expires_at > Math.floor(Date.now() / 1000) + 60;
    if (fresh) { this.session = s; this.user = s.user; return s.user; }
    try {
      const data = await this._authPost('token?grant_type=refresh_token', { refresh_token: s.refresh_token });
      data.expires_at = Math.floor(Date.now() / 1000) + (data.expires_in || 3600);
      this._saveSession(data);
      return data.user;
    } catch (e) {
      this._saveSession(null);
      return null;
    }
  },

  _headers(json) {
    const h = { apikey: this.key, Authorization: 'Bearer ' + (this.session ? this.session.access_token : this.key) };
    if (json) h['Content-Type'] = 'application/json';
    return h;
  },

  // ── Writes (require a signed-in session + RLS policies) ─────
  // Patch a product by its prototype id ('P-1001'). UI field names are
  // mapped to DB columns here, in one place.
  async saveProduct(legacyId, patch) {
    if (!this.session) throw new Error('Not signed in — change kept locally only.');
    const cols = {};
    if (patch.price    !== undefined) cols.price = Number(patch.price) || 0;
    if (patch.oldPrice !== undefined) cols.compare_at = patch.oldPrice === '' || patch.oldPrice == null ? null : Number(patch.oldPrice);
    if (patch.stock    !== undefined) cols.stock = Math.max(0, Number(patch.stock) || 0);
    if (patch.category !== undefined) cols.category_id = patch.category;
    if (patch.name     !== undefined) cols.name = patch.name;
    if (patch.hidden   !== undefined) cols.status = patch.hidden ? 'draft' : 'active';
    if (!Object.keys(cols).length) return;
    const res = await fetch(this.url + '/rest/v1/products?legacy_id=eq.' + encodeURIComponent(legacyId), {
      method: 'PATCH',
      headers: Object.assign(this._headers(true), { Prefer: 'return=minimal' }),
      body: JSON.stringify(cols),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error('Save failed (HTTP ' + res.status + '): ' + t.slice(0, 140));
    }
  },

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
