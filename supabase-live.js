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

    // Orders are loaded too, into window.LIVE_ORDERS (adminLoad prefers it).
    try { window.LIVE_ORDERS = await this.loadOrders(); }
    catch (e) { console.warn('[shhh] order load failed; using demo orders.', e); }

    this.status = 'live';
    console.info('[shhh] Live catalog loaded from Supabase: ' +
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
};
