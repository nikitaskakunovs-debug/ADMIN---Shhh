/* Shhh — live data loader.
   Fetches the catalog (products, brands, categories) from Supabase over
   HTTPS and exposes it as the globals the admin app already reads:
   window.PRODUCTS, window.BRANDS, and window.SHOP_DATA overlays.
   If Supabase is unreachable, the app falls back to the built-in demo
   data in shop-data.jsx — the site never breaks. */

// ── Debug logging ────────────────────────────────────────────
// Production consoles stay quiet. Enable diagnostics with ?debug=1 (sticky
// for the session) or localStorage.setItem('shhh_debug','1'). Errors are
// never silenced.
(function () {
  var on = false;
  try {
    if (/[?&]debug=1/.test(location.search)) { on = true; sessionStorage.setItem('shhh_debug', '1'); }
    else on = sessionStorage.getItem('shhh_debug') === '1' || localStorage.getItem('shhh_debug') === '1';
  } catch (e) {}
  window.SHHH_DEBUG = on;
  window.shhhLog = function () { if (window.SHHH_DEBUG) console.info.apply(console, arguments); };
  window.shhhWarn = function () { if (window.SHHH_DEBUG) console.warn.apply(console, arguments); };
})();

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
    // binding (same array object) sees the live data too. Guard: when the DB
    // was empty, finalProducts IS window.PRODUCTS — setting length = 0 first
    // would wipe the source before copying it back into itself.
    if (finalProducts !== window.PRODUCTS) {
      if (Array.isArray(window.PRODUCTS)) { window.PRODUCTS.length = 0; Array.prototype.push.apply(window.PRODUCTS, finalProducts); }
      else window.PRODUCTS = finalProducts;
    }

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

    // CMS overrides: hydrate localStorage from the DB BEFORE the app reads it,
    // so admin content edits reach every visitor (not just the editor's
    // browser). DB wins over any stale local copy, key by key.
    try {
      const ov = await this.fetch('cms_overrides?select=key,data');
      if (ov.length) {
        let cur = {};
        try { cur = JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}'); } catch (e) {}
        ov.forEach(r => { cur[r.key] = r.data; });
        localStorage.setItem('shhh_cms_v1', JSON.stringify(cur));
        // Re-apply BOTH override kinds: pages/banners AND UI strings (the
        // string applier already ran at script load, before this hydration).
        if (typeof window.__shhhApplyStrings === 'function') window.__shhhApplyStrings();
        if (typeof window.__shhhApplyCms === 'function') window.__shhhApplyCms();
      }
    } catch (e) { window.shhhWarn && window.shhhWarn('[shhh] CMS overrides load failed', e); }

    // Reviews: approved ones feed the storefront product pages; the full
    // moderation queue (visible once signed in) feeds the admin.
    try {
      const reviews = await this.loadReviews();
      window.LIVE_REVIEWS = reviews;
      if (window.REVIEWS && reviews.length) {
        const approved = reviews.filter(r => r.decided === 'approved');
        approved.forEach(r => {
          const list = window.REVIEWS[r.product] = window.REVIEWS[r.product] || [];
          if (!list.some(x => x._id === r._id)) {
            list.unshift({ _id: r._id, name: r.name, stars: r.stars, date: r.date, body: r.body, verified: r.verified });
          }
        });
      }
    } catch (e) { window.shhhWarn && window.shhhWarn('[shhh] reviews load failed', e); }

    // Returns (admin only — locked to anonymous readers).
    if (this.session) {
      try { window.LIVE_RETURNS = await this.loadReturns(); }
      catch (e) { window.shhhWarn && window.shhhWarn('[shhh] returns load failed', e); }
    }

    // Promo codes: the storefront validates against window.PROMO_CODES — make
    // the DB the source of truth (only live codes, in window, under limit).
    try {
      const promos = await this.fetch('promos?select=code,type,value,status,starts_on,ends_on,usage_limit,used_count,note&status=eq.active');
      const today = new Date().toISOString().slice(0, 10);
      const live = {};
      promos.forEach(pr => {
        if (pr.starts_on && pr.starts_on > today) return;
        if (pr.ends_on && pr.ends_on < today) return;
        if (pr.usage_limit != null && pr.used_count >= pr.usage_limit) return;
        const v = Number(pr.value) || 0;
        live[pr.code] = {
          type: pr.type, value: v,
          label: pr.type === 'percent' ? ('−' + v + '%') : pr.type === 'fixed' ? ('−€' + v) : 'Bezmaksas piegāde',
          desc: pr.note || (pr.type === 'shipping' ? 'Bezmaksas piegāde' : 'Atlaide'),
        };
      });
      if (promos.length) {
        // Mutate the shared object in place so lexical PROMO_CODES sees it.
        const target = window.PROMO_CODES;
        if (target && typeof target === 'object') {
          Object.keys(target).forEach(k => { delete target[k]; });
          Object.assign(target, live);
        } else window.PROMO_CODES = live;
      }
    } catch (e) { window.shhhWarn && window.shhhWarn('[shhh] promo codes load failed', e); }

    // Orders are loaded too, into window.LIVE_ORDERS (adminLoad prefers it).
    try { window.LIVE_ORDERS = await this.loadOrders(); }
    catch (e) { window.shhhWarn && window.shhhWarn('[shhh] order load failed; using demo orders.', e); }

    this.status = 'live';
    window.shhhLog && window.shhhLog('[shhh] Live data loaded from Supabase: ' +
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

  // ── Reviews ──
  async loadReviews() {
    const rows = await this.fetch('reviews?select=id,ref,display_name,stars,body,verified,status,created_at,product:products(legacy_id)&order=created_at.desc&limit=300');
    return rows.map(r => ({
      _id: r.id,
      id: r.ref || r.id,
      product: r.product ? r.product.legacy_id : null,
      name: r.display_name, stars: r.stars, body: r.body,
      date: (r.created_at || '').slice(0, 10), verified: !!r.verified,
      decided: r.status === 'pending' ? undefined : (r.status === 'approved' ? 'approved' : 'rejected'),
    }));
  },

  async submitReview(p) {
    const res = await fetch(this.url + '/rest/v1/rpc/submit_review', {
      method: 'POST', headers: this._headers(true), body: JSON.stringify({ p }),
    });
    if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('Review submit failed (HTTP ' + res.status + '): ' + t.slice(0, 140)); }
    return res.json();
  },

  async setReviewStatus(id, status) {
    if (!this.session) throw new Error('Not signed in.');
    await this._rest('reviews?id=eq.' + encodeURIComponent(id), 'PATCH', { status }, 'return=minimal');
  },

  // ── Returns ──
  async loadReturns() {
    const rows = await this.fetch('returns?select=id,ref,kind,status,reason,item,channel,customer_name,email,refund_amount,intake,created_at,order:orders(ref),return_messages(id,sender,via,author,body,images,delivery_status,created_at)&order=created_at.desc&limit=200');
    return rows.map(r => ({
      _id: r.id,
      id: r.ref,
      ref: r.order ? r.order.ref : null,
      kind: r.kind, status: r.status, reason: r.reason, item: r.item,
      channel: r.channel, customer: r.customer_name, email: r.email,
      refund: Number(r.refund_amount) || 0,
      date: (r.created_at || '').slice(0, 10),
      intake: r.intake || null,
      thread: (r.return_messages || [])
        .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
        .map(m => ({ id: m.id, from: m.sender, via: m.via, author: m.author, body: m.body, images: m.images || [], status: m.delivery_status || undefined, ts: (m.created_at || '').replace('T', ' ').slice(0, 16) })),
    }));
  },

  async submitReturn(p) {
    const res = await fetch(this.url + '/rest/v1/rpc/submit_return', {
      method: 'POST', headers: this._headers(true), body: JSON.stringify({ p }),
    });
    if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('Return submit failed (HTTP ' + res.status + '): ' + t.slice(0, 140)); }
    return res.json(); // { ref }
  },

  async updateReturn(id, patch) {
    if (!this.session) throw new Error('Not signed in.');
    const cols = {};
    if (patch.status !== undefined) cols.status = patch.status;
    if (patch.refund !== undefined) cols.refund_amount = Number(patch.refund) || 0;
    if (!Object.keys(cols).length) return;
    await this._rest('returns?id=eq.' + encodeURIComponent(id), 'PATCH', cols, 'return=minimal');
  },

  async addReturnMessage(returnId, m) {
    if (!this.session) throw new Error('Not signed in.');
    await this._rest('return_messages', 'POST', {
      return_id: returnId, sender: m.from || 'support', via: m.via || 'email',
      author: m.author || null, body: m.body || '', images: m.images || [],
    }, 'return=minimal');
  },

  // ── CMS ──
  async saveCmsOverride(key, data) {
    if (!this.session) throw new Error('Not signed in.');
    await this._rest('cms_overrides?on_conflict=key', 'POST',
      { key, data, updated_at: new Date().toISOString() },
      'resolution=merge-duplicates,return=minimal');
  },

  // ── Gift cards & promos ──
  async checkGiftCard(code) {
    const res = await fetch(this.url + '/rest/v1/rpc/check_gift_card', {
      method: 'POST', headers: this._headers(true), body: JSON.stringify({ p_code: code }),
    });
    if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('Gift card check failed (HTTP ' + res.status + '): ' + t.slice(0, 120)); }
    return res.json(); // { ok, code, balance, initial } | { ok:false, error }
  },

  // Upsert the admin's promo map ({CODE:{type,value,desc,disabled}}) to the DB.
  async savePromos(map) {
    if (!this.session) throw new Error('Not signed in.');
    const rows = Object.keys(map || {}).map(code => ({
      code,
      type: map[code].type || 'percent',
      value: Number(map[code].value) || 0,
      status: map[code].disabled ? 'paused' : 'active',
      note: map[code].desc || null,
    }));
    if (!rows.length) return;
    await this._rest('promos?on_conflict=code', 'POST', rows, 'resolution=merge-duplicates,return=minimal');
  },

  // ── Storefront checkout (anonymous shoppers, via controlled RPCs) ──
  async placeOrder(p) {
    const res = await fetch(this.url + '/rest/v1/rpc/place_order', {
      method: 'POST', headers: this._headers(true), body: JSON.stringify({ p }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error('Order save failed (HTTP ' + res.status + '): ' + t.slice(0, 140));
    }
    return res.json(); // { ref, total, status }
  },

  async setOrderStatus(ref, status) {
    const res = await fetch(this.url + '/rest/v1/rpc/set_order_status', {
      method: 'POST', headers: this._headers(true),
      body: JSON.stringify({ p_ref: ref, p_status: status }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error('Status update failed (HTTP ' + res.status + '): ' + t.slice(0, 140));
    }
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
