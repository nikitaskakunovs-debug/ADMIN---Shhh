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
      // Session-aware: uses the signed-in token when present (so reads of
      // RLS-protected tables like orders work), else the public anon key.
      const res = await fetch(this.url + '/rest/v1/' + path, {
        headers: this._headers(false),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + path);
      return await res.json();
    } finally { clearTimeout(timer); }
  },

  async load() {
    this.status = 'loading';
    const [products, brands, categories] = await Promise.all([
      this.fetch('products?select=legacy_id,sku,name,price,compare_at,cost,stock,status,color,sizes,created_at,category_id,brand:brands(id,name),product_images(url,position)&order=created_at.asc'),
      this.fetch('brands?select=id,name,country,kind,margin,blurb,featured&order=name.asc'),
      this.fetch('categories?select=id,name,position&order=position.asc'),
    ]);

    // The admin lives under /admin/, so relative image paths need a hop up.
    const inAdmin = location.pathname.indexOf('/admin') !== -1;
    const fixImg = (u) => (u && inAdmin && !/^(https?:)?\//.test(u)) ? '../' + u : u;

    // Merge DB truth over the built-in presentation data (keyed by legacy id):
    // the DB owns existence, price, stock, status, naming, brand, category and
    // photos; the code keeps rich presentation fields (desc, swatches, blob…).
    const demo = (window.PRODUCTS && window.PRODUCTS.length) ? window.PRODUCTS : [];
    const demoById = {}; demo.forEach(d => { demoById[d.id] = d; });
    // Safe presentation defaults so products that have no built-in design data
    // (e.g. admin-created, or seeded without a storefront match) never crash the
    // storefront, which assumes these fields always exist.
    const DEFAULTS = {
      colours: [], swatches: ['#CBB9AE'], colourNames: ['Default'], sizes: [],
      blob: 'M50,8 C74,8 92,26 92,50 C92,74 74,92 50,92 C26,92 8,74 8,50 C8,26 26,8 50,8 Z',
      desc: '', tagline: '', ptype: '', material: '—', weight: '', length: '',
      modes: 0, decibels: 0, waterproof: false, rechargeable: false,
      rating: 0, reviewCount: 0, badge: '', oldPrice: null, image: null, images: [],
    };
    let finalProducts;
    if (products.length) {
      finalProducts = products.map(p => {
        const dbImages = (p.product_images || []).slice().sort((a, b) => (a.position || 0) - (b.position || 0)).map(i => i.url);
        const base = Object.assign({}, DEFAULTS, demoById[p.legacy_id] || {});
        const merged = Object.assign({}, base, {
          id: p.legacy_id || p.sku, code: p.sku, sku: p.sku, name: p.name,
          price: Number(p.price), stock: p.stock, status: p.status,
          compareAt: p.compare_at == null ? null : Number(p.compare_at),
          oldPrice: p.compare_at == null ? base.oldPrice : Number(p.compare_at),
          cost: p.cost == null ? (base.cost != null ? base.cost : null) : Number(p.cost),
          createdAt: (p.created_at || '').slice(0, 10),
        });
        if (p.brand) { merged.brand = p.brand.name; merged.brandId = p.brand.id; }
        if (p.category_id) merged.category = p.category_id;
        if (p.color) merged.color = p.color;
        if (p.sizes && p.sizes.length) merged.sizes = p.sizes; else if (!merged.sizes) merged.sizes = [];
        // Keep colour-name labels aligned with the swatch count to avoid gaps.
        if (!Array.isArray(merged.swatches) || !merged.swatches.length) merged.swatches = DEFAULTS.swatches.slice();
        if (!Array.isArray(merged.colourNames) || merged.colourNames.length < merged.swatches.length) {
          merged.colourNames = merged.swatches.map((_, i) => (merged.colourNames && merged.colourNames[i]) || 'Colour ' + (i + 1));
        }
        if (!Array.isArray(merged.colours)) merged.colours = [];
        const images = dbImages.length ? dbImages : (base.images || (base.image ? [base.image] : []));
        merged.images = images.map(fixImg);
        merged.image = merged.images[0] || null;
        if (merged.rating == null) merged.rating = 0;
        return merged;
      });
    } else {
      finalProducts = demo; // empty DB → keep built-in demo catalog
    }
    // Mutate the shared array in place so the storefront's lexical PRODUCTS
    // binding (same array object) sees the live data too.
    if (Array.isArray(window.PRODUCTS)) { window.PRODUCTS.length = 0; Array.prototype.push.apply(window.PRODUCTS, finalProducts); }
    else window.PRODUCTS = finalProducts;

    // Brands: the DB drives the admin's brand directory. The storefront keeps
    // its own full static directory (window.BRANDS there is presentation).
    if (inAdmin) window.BRANDS = brands;

    // Categories: keep order/extras of the built-ins, add any DB categories
    // that actually have products, drop empty built-ins. Every entry carries a
    // live `count` (the storefront calls c.count.toString(), so it must exist).
    const usedCats = new Set(finalProducts.map(p => p.category).filter(Boolean));
    const countByCat = {};
    finalProducts.forEach(p => { if (p.category) countByCat[p.category] = (countByCat[p.category] || 0) + 1; });
    const catCount = (id) => id === 'all' ? finalProducts.length : (countByCat[id] || 0);
    const catList = [];
    (window.CATEGORIES || []).forEach(c => { if (c.id === 'all' || usedCats.has(c.id)) catList.push(Object.assign({}, c, { count: catCount(c.id) })); });
    const known = new Set(catList.map(c => c.id));
    categories.forEach(c => { if (usedCats.has(c.id) && !known.has(c.id)) catList.push({ id: c.id, label: c.name, count: catCount(c.id) }); });
    if (Array.isArray(window.CATEGORIES)) { window.CATEGORIES.length = 0; Array.prototype.push.apply(window.CATEGORIES, catList); }
    else window.CATEGORIES = catList;

    // Legacy overlay for anything reading SHOP_DATA (the old admin fallback).
    if (window.SHOP_DATA) {
      window.SHOP_DATA.products = finalProducts;
      window.SHOP_DATA.categories = categories.map(c => ({ id: c.id, name: c.name }));
    }

    // Orders are loaded too, into window.LIVE_ORDERS (adminLoad prefers it).
    try { window.LIVE_ORDERS = await this.loadOrders(); }
    catch (e) { console.warn('[shhh] order load failed; using demo orders.', e); }

    this.status = 'live';
    console.info('[shhh] Live data loaded from Supabase: ' +
      products.length + ' products, ' + brands.length + ' brands, ' + categories.length + ' categories' +
      (window.LIVE_ORDERS ? ', ' + window.LIVE_ORDERS.length + ' orders' : '') + '.');
    return { products: products.length, brands: brands.length, categories: categories.length };
  },

  // ── Orders: load and map DB rows → the UI order shape (_mkOrder-compatible) ──
  async loadOrders() {
    const rows = await this.fetch(
      'orders?select=id,ref,status,pay_method,pay_failed,pay_fail_reason,courier,locker,sender,tracking,company,vat_no,subtotal,shipping,discount,total,created_at,business_id,market_id,alias,email,' +
      'order_items(qty,unit_price,name,product:products(legacy_id)),' +
      'refunds(amount,reason,created_at)' +
      '&order=created_at.desc');
    return rows.map(o => ({
      _id: o.id,                       // DB uuid (used by write-back; not shown in UI)
      ref: o.ref,
      date: (o.created_at || '').replace('T', ' ').slice(0, 16),
      status: o.status,
      payMethod: o.pay_method,
      payFailed: !!o.pay_failed,
      payFailReason: o.pay_fail_reason || undefined,
      courier: o.courier, locker: o.locker, sender: o.sender, tracking: o.tracking || undefined,
      company: o.company || undefined, vatNo: o.vat_no || undefined,
      business: o.business_id || 'shhh',
      market: o.market_id || 'LV', country: o.market_id || 'LV',
      alias: o.alias, email: o.email,
      items: (o.order_items || []).map(i => ({
        id: i.product ? i.product.legacy_id : null,
        name: i.name, price: Number(i.unit_price), qty: i.qty,
      })),
      subtotal: Number(o.subtotal) || 0,
      shipping: Number(o.shipping) || 0,
      discount: Number(o.discount) || 0,
      total: Number(o.total) || 0,
      refunds: (o.refunds || []).map(r => ({
        amount: Number(r.amount), reason: r.reason, reasonLabel: r.reason,
        note: '', ts: (r.created_at || '').replace('T', ' ').slice(0, 16), actor: '',
      })),
    }));
  },

  // Map UI order patch keys → DB columns (only the ones an operator edits).
  _orderCols(patch) {
    const m = { status: 'status', tracking: 'tracking', courier: 'courier',
      locker: 'locker', sender: 'sender', payMethod: 'pay_method',
      company: 'company', vatNo: 'vat_no' };
    const cols = {};
    Object.keys(patch).forEach(k => { if (m[k] !== undefined) cols[m[k]] = patch[k]; });
    return cols;
  },

  async _rest(path, method, body, prefer) {
    const res = await fetch(this.url + '/rest/v1/' + path, {
      method,
      headers: Object.assign(this._headers(!!body), prefer ? { Prefer: prefer } : {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(method + ' ' + path.split('?')[0] + ' failed (HTTP ' + res.status + '): ' + t.slice(0, 140));
    }
    return res;
  },

  // Update an order by ref. No-op if not signed in or nothing maps to a column.
  async updateOrder(ref, patch) {
    if (!this.session) throw new Error('Not signed in.');
    const cols = this._orderCols(patch);
    if (!Object.keys(cols).length) return;
    await this._rest('orders?ref=eq.' + encodeURIComponent(ref), 'PATCH', cols, 'return=minimal');
  },

  // Record a refund; also flips the order to 'refunded' when fully covered.
  // Orders restored from older local sessions carry no DB uuid, so fall back
  // to resolving it by ref — and fail loudly if the order isn't in the DB.
  async addRefund(orderUuid, ref, amount, reason, fully) {
    if (!this.session) throw new Error('Not signed in.');
    let id = orderUuid;
    if (!id) {
      const rows = await this.fetch('orders?select=id&ref=eq.' + encodeURIComponent(ref));
      if (!rows.length) throw new Error('Order ' + ref + ' exists only in this browser — it is not in the database.');
      id = rows[0].id;
    }
    await this._rest('refunds', 'POST',
      { order_id: id, amount: Math.round((Number(amount) || 0) * 100) / 100, reason: reason || null },
      'return=minimal');
    if (fully) await this._rest('orders?ref=eq.' + encodeURIComponent(ref), 'PATCH', { status: 'refunded' }, 'return=minimal');
  },

  async deleteOrders(refs) {
    if (!this.session) throw new Error('Not signed in.');
    if (!refs || !refs.length) return;
    const list = refs.map(r => encodeURIComponent(r)).join(',');
    // order_items / refunds are removed by ON DELETE CASCADE.
    await this._rest('orders?ref=in.(' + list + ')', 'DELETE', null, 'return=minimal');
  },

  // Insert a duplicated order (header + line items) and return its new uuid.
  async insertOrder(order) {
    if (!this.session) throw new Error('Not signed in.');
    const res = await this._rest('orders', 'POST', {
      ref: order.ref, business_id: order.business || 'shhh', market_id: order.market || order.country || 'LV',
      alias: order.alias, email: order.email, status: order.status || 'pending',
      pay_method: order.payMethod, courier: order.courier, locker: order.locker, sender: order.sender,
      company: order.company || null, vat_no: order.vatNo || null,
      subtotal: order.subtotal || 0, shipping: order.shipping || 0, discount: order.discount || 0, total: order.total || 0,
    }, 'return=representation');
    const created = (await res.json())[0];
    const items = (order.items || []).filter(i => i.id).map(i => ({
      order_id: created.id, product_id: null, name: i.name, unit_price: i.price, qty: i.qty,
    }));
    // Resolve product uuids by legacy_id, then insert line items.
    if (items.length) {
      const ids = order.items.map(i => i.id).filter(Boolean);
      const prods = await this.fetch('products?select=id,legacy_id&legacy_id=in.(' + ids.map(encodeURIComponent).join(',') + ')');
      const byLegacy = {}; prods.forEach(p => { byLegacy[p.legacy_id] = p.id; });
      order.items.forEach((i, n) => { if (items[n]) items[n].product_id = byLegacy[i.id] || null; });
      await this._rest('order_items', 'POST', items, 'return=minimal');
    }
    return created.id;
  },

  // Upload a product photo to Storage and record it in product_images.
  // Returns the new public image URL.
  async uploadProductPhoto(file, legacyId) {
    if (!this.session) throw new Error('Not signed in.');
    if (!file) throw new Error('No file selected.');
    if (file.size > 6 * 1024 * 1024) throw new Error('Image is larger than 6 MB.');
    const ext = ((file.name || '').split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = encodeURIComponent(legacyId) + '/' + Date.now() + '.' + ext;
    const up = await fetch(this.url + '/storage/v1/object/product-photos/' + path, {
      method: 'POST',
      headers: {
        apikey: this.key, Authorization: 'Bearer ' + this.session.access_token,
        'x-upsert': 'true', 'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    if (!up.ok) {
      const t = await up.text().catch(() => '');
      throw new Error('Upload failed (HTTP ' + up.status + '): ' + t.slice(0, 140));
    }
    const publicUrl = this.url + '/storage/v1/object/public/product-photos/' + path;
    // Link it to the product (first image = position 0).
    const rows = await this.fetch('products?select=id&legacy_id=eq.' + encodeURIComponent(legacyId));
    if (rows.length) {
      const existing = await this.fetch('product_images?select=id&product_id=eq.' + rows[0].id);
      await this._rest('product_images', 'POST',
        { product_id: rows[0].id, url: publicUrl, position: existing.length },
        'return=minimal');
    }
    return publicUrl;
  },

  // Insert a new catalog product. Returns the created DB row.
  async insertProduct(p) {
    if (!this.session) throw new Error('Not signed in.');
    const res = await this._rest('products', 'POST', {
      legacy_id: p.id, sku: p.code, name: p.name,
      brand_id: p.brandId || null, category_id: p.category || null,
      price: Number(p.price) || 0, stock: Math.max(0, Number(p.stock) || 0),
      status: 'active', sizes: p.sizes || [],
    }, 'return=representation');
    return (await res.json())[0];
  },

  // Insert a new brand. Returns the created row (mapped for window.BRANDS).
  async insertBrand(brand) {
    if (!this.session) throw new Error('Not signed in.');
    const row = {
      id: brand.id, name: brand.name,
      country: brand.country || null, kind: brand.kind || null,
      margin: brand.margin || null, blurb: brand.blurb || null,
      featured: !!brand.featured,
    };
    const res = await this._rest('brands', 'POST', row, 'return=representation');
    return (await res.json())[0];
  },
};
