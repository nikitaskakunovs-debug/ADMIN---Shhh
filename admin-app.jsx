// admin-app.jsx — back-office app: state, persistence, router, role gating.

function AdminApp() {
  const initial = adminLoad();
  const [role, setRole] = React.useState(initial.role);
  // ── Browser-style tabs: each tab is an open view {id, screen, params} ──
  const [tabs, setTabs] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('shhh_admin_tabs') || 'null'); if (s && s.tabs && s.tabs.length) return s.tabs; } catch (e) {}
    return [{ id: 't1', screen: 'dashboard', params: {} }];
  });
  const [activeId, setActiveId] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('shhh_admin_tabs') || 'null'); if (s && s.activeId && (s.tabs || []).some(t => t.id === s.activeId)) return s.activeId; } catch (e) {}
    return 't1';
  });
  const [split, setSplit] = React.useState(false);
  const [splitId, setSplitId] = React.useState(null);
  const [focusedPane, setFocusedPane] = React.useState('a'); // which pane nav targets in split mode
  const uid = () => 't' + Date.now() + Math.floor(Math.random() * 1000);
  const activeTab = tabs.find(t => t.id === activeId) || tabs[0];
  const screen = activeTab.screen;
  const params = activeTab.params || {};
  React.useEffect(() => { try { localStorage.setItem('shhh_admin_tabs', JSON.stringify({ tabs, activeId })); } catch (e) {} }, [tabs, activeId]);
  const [orders, setOrders] = React.useState(initial.orders);
  const [brands, setBrands] = React.useState(() => window.BRANDS || []);
  const [stock, setStock] = React.useState(initial.stock);
  const [prices, setPrices] = React.useState(initial.prices);
  const [reviews, setReviews] = React.useState(initial.reviews);
  const [returns, setReturns] = React.useState(initial.returns);
  const [promos, setPromos] = React.useState(initial.promos);
  const [cards, setCards] = React.useState(initial.cards);
  const [brandFeatured, setBrandFeatured] = React.useState(initial.brandFeatured);
  const [crm, setCrm] = React.useState(initial.crm);
  const [audit, setAudit] = React.useState(initial.audit);
  const [cms, setCmsState] = React.useState(initial.cms);
  // Signed in = a real Supabase session (restored before render by the boot
  // script). The old localStorage flag only applies when the site runs
  // without a Supabase connection (e.g. opened as a local file).
  const [signedIn, setSignedIn] = React.useState(() => {
    if (window.SHHH_LIVE && window.SHHH_LIVE.status !== 'fallback') return !!window.SHHH_LIVE.user;
    try { return JSON.parse(localStorage.getItem('shhh_admin_auth') || 'true'); } catch (e) { return true; }
  });
  React.useEffect(() => { try { localStorage.setItem('shhh_admin_auth', JSON.stringify(signedIn)); } catch (e) {} }, [signedIn]);
  const signOut = () => { setSignedIn(false); if (window.SHHH_LIVE) window.SHHH_LIVE.signOut(); };
  // Orders are locked to anonymous users, so the boot loader can't read them.
  // Once signed in, re-fetch them with the authenticated token.
  React.useEffect(() => {
    if (!signedIn) return;
    const live = window.SHHH_LIVE;
    if (!live || !live.session) return;
    let cancelled = false;
    live.loadOrders()
      .then(rows => { if (!cancelled && rows && rows.length) { window.LIVE_ORDERS = rows; setOrders(rows); } })
      .catch(e => console.warn('[shhh] post-login order refresh failed', e));
    return () => { cancelled = true; };
  }, [signedIn]);
  // Multi-business / multi-market scope (persisted). market 'all' = consolidated.
  const [scope, setScope] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('shhh_admin_scope') || 'null'); if (s && s.business) return s; } catch (e) {}
    return { business: 'shhh', market: 'all' };
  });
  React.useEffect(() => { try { localStorage.setItem('shhh_admin_scope', JSON.stringify(scope)); } catch (e) {} }, [scope]);
  // Support email identity & signature (persisted). fromName = the real manager name.
  const [emailSettings, setEmailSettingsState] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('shhh_admin_email') || 'null'); if (s && s.fromName) return s; } catch (e) {}
    return { fromName: 'Olivia Williams', teamLine: 'shhh... Customer Care', signoff: 'Kind regards', footer: 'Discreet adult store · support@shhh.lv · +371 6700 0000' };
  });
  const setEmailSettings = (next) => { setEmailSettingsState(next); try { localStorage.setItem('shhh_admin_email', JSON.stringify(next)); } catch (e) {} };
  // Deployment environment (Production / Staging / Local) — persisted; shown as a header badge.
  const [env, setEnvState] = React.useState(() => { try { return localStorage.getItem('shhh_admin_env') || 'Production'; } catch (e) { return 'Production'; } });
  const setEnv = (e) => { setEnvState(e); try { localStorage.setItem('shhh_admin_env', e); } catch (er) {} };
  // Editable role → sections permissions (mutates the shared ROLE_NAV, persists, re-renders).
  const [, setPermsV] = React.useState(0);
  const setRolePerms = (role, list) => {
    const safe = list.includes('dashboard') ? list : ['dashboard', ...list];
    window.ROLE_NAV[role] = safe;
    try { const map = {}; Object.keys(window.ROLE_NAV).forEach(r => { map[r] = window.ROLE_NAV[r]; }); const universe = Array.from(new Set([].concat.apply([], Object.keys(map).map(r => map[r])))); localStorage.setItem('shhh_admin_roleperms', JSON.stringify({ universe, perms: map })); } catch (e) {}
    log('settings', 'Updated role access', (ADMIN_ROLES[role] || {}).label || role, safe.length + ' sections');
    setPermsV(v => v + 1);
  };
  const [toastMsg, setToastMsg] = React.useState(null);
  const toastTimer = React.useRef(null);
  // Confirmation dialog for critical actions (refunds, deletes, copies, serious changes)
  const [confirmState, setConfirmState] = React.useState(null);
  const confirm = React.useCallback((opts) => setConfirmState(opts || {}), []);
  // Refund flow — richer than confirm: amount + reason + note (correct VAT, totals, etc.)
  const [refundState, setRefundState] = React.useState(null);
  const refund = React.useCallback((order) => setRefundState(order ? { order } : null), []);

  // ── Undo / redo: snapshot-based history over the whole data store ──
  const pendingUndoable = React.useRef(false);
  const dataRef = React.useRef(null);
  dataRef.current = { orders, stock, prices, reviews, returns, promos, cards, brandFeatured, crm, audit, cms };
  const [undoStack, setUndoStack] = React.useState([]);
  const [redoStack, setRedoStack] = React.useState([]);
  const undoRef = React.useRef(undoStack); undoRef.current = undoStack;
  const redoRef = React.useRef(redoStack); redoRef.current = redoStack;
  const checkpoint = React.useCallback((label) => {
    setUndoStack(prev => [...prev.slice(-49), { label: label || 'Change', snap: dataRef.current }]);
    setRedoStack([]);
    pendingUndoable.current = true;
    setTimeout(() => { pendingUndoable.current = false; }, 60); // flag only the toast that fires this tick
  }, []);
  const applySnap = React.useCallback((snap) => {
    setOrders(snap.orders); setStock(snap.stock); setPrices(snap.prices);
    setReviews(snap.reviews); setReturns(snap.returns); setPromos(snap.promos);
    setCards(snap.cards); setBrandFeatured(snap.brandFeatured); setCrm(snap.crm);
    setAudit(snap.audit); setCmsState(snap.cms); try { cmsSave(snap.cms); } catch (e) {}
  }, []);
  const flash = React.useCallback((text) => {
    setToastMsg({ text, undo: false });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);
  const undo = React.useCallback(() => {
    const stack = undoRef.current;
    if (!stack.length) { flash('Nothing to undo'); return; }
    const entry = stack[stack.length - 1];
    setRedoStack(r => [...r.slice(-49), { label: entry.label, snap: dataRef.current }]);
    setUndoStack(stack.slice(0, -1));
    applySnap(entry.snap);
    flash('Undone — ' + entry.label);
  }, [applySnap, flash]);
  const redo = React.useCallback(() => {
    const stack = redoRef.current;
    if (!stack.length) { flash('Nothing to redo'); return; }
    const entry = stack[stack.length - 1];
    setUndoStack(u => [...u.slice(-49), { label: entry.label, snap: dataRef.current }]);
    setRedoStack(stack.slice(0, -1));
    applySnap(entry.snap);
    flash('Redone — ' + entry.label);
  }, [applySnap, flash]);
  // Keyboard: ⌘/Ctrl+Z = undo, ⌘/Ctrl+⇧Z or ⌘/Ctrl+Y = redo (ignored while typing)
  React.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = (e.key || '').toLowerCase();
      if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (k === 'y') { e.preventDefault(); redo(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // Persist
  React.useEffect(() => {
    adminSave({ orders, stock, prices, reviews, returns, role, promos, cards, brandFeatured, crm, audit });
  }, [orders, stock, prices, reviews, returns, role, promos, cards, brandFeatured, crm, audit]);

  React.useEffect(() => { window.scrollTo({ top: 0 }); }, [screen]);

  const toast = (msg) => {
    const undoable = pendingUndoable.current;
    pendingUndoable.current = false;
    setToastMsg({ text: msg, undo: undoable });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), undoable ? 6000 : 2400);
  };

  // Update a specific tab's view. nav() targets the focused pane.
  const setTabView = (id, s, p) => {
    const allowed = ROLE_NAV[role] || [];
    const ns = allowed.includes(s) ? s : 'dashboard';
    setTabs(prev => prev.map(t => t.id === id ? { ...t, screen: ns, params: allowed.includes(s) ? (p || {}) : {} } : t));
  };
  const makeNav = (id) => (s, p) => setTabView(id, s, p);
  const nav = (s, p) => setTabView((split && focusedPane === 'b' && splitId) ? splitId : activeId, s, p);

  // Tab operations
  const openTab = (s, p) => { const id = uid(); setTabs(prev => [...prev, { id, screen: s || 'dashboard', params: p || {} }]); setActiveId(id); setFocusedPane('a'); };
  const selectTab = (id) => { setActiveId(id); setFocusedPane('a'); };
  const closeTab = (id) => setTabs(prev => {
    if (prev.length <= 1) return prev;
    const i = prev.findIndex(t => t.id === id);
    const next = prev.filter(t => t.id !== id);
    if (id === activeId) setActiveId((next[Math.max(0, i - 1)] || next[0]).id);
    if (id === splitId) { setSplitId(null); setSplit(false); }
    return next;
  });
  const reorderTabs = (fromId, toId, after) => setTabs(prev => {
    if (fromId === toId) return prev;
    const arr = prev.slice();
    const fi = arr.findIndex(t => t.id === fromId);
    if (fi === -1) return prev;
    const [moved] = arr.splice(fi, 1);
    let ti = arr.findIndex(t => t.id === toId);
    if (ti === -1) return prev;
    if (after) ti += 1;
    arr.splice(ti, 0, moved);
    return arr;
  });
  const toggleSplit = () => {
    if (split) { setSplit(false); setSplitId(null); setFocusedPane('a'); return; }
    // Need a second tab to compare against; reuse an existing one or open a fresh tab.
    let other = tabs.find(t => t.id !== activeId);
    if (!other) { const id = uid(); const nt = { id, screen: 'dashboard', params: {} }; setTabs(prev => [...prev, nt]); other = nt; }
    setSplitId(other.id); setSplit(true); setFocusedPane('a');
  };

  // When role changes, ensure every tab's screen is permitted
  React.useEffect(() => {
    const allowed = ROLE_NAV[role] || [];
    setTabs(prev => prev.map(t => allowed.includes(t.screen) ? t : { ...t, screen: 'dashboard', params: {} }));
  }, [role]);

  // ── Change log ──────────────────────────────────────────────
  const log = React.useCallback((type, action, target, detail) => {
    const actor = (ADMIN_ROLES[role] || {}).label || role;
    setAudit(prev => [{ id: 'a' + Date.now() + Math.floor(Math.random() * 1000), ts: nowStamp(), actor, type, action, target: target || '', detail: detail || '' }, ...prev]);
  }, [role]);

  // Fire-and-forget order write to the DB; warns (but never blocks) on failure.
  const dbOrder = (promise, what) => {
    if (!window.SHHH_LIVE || !window.SHHH_LIVE.session) return;
    Promise.resolve(promise).catch(e => {
      console.warn('[shhh] order DB write failed', e);
      toast('⚠ ' + (what || 'Order change') + ' not saved to the database: ' + ((e && e.message) || 'unknown error'));
    });
  };
  const updateOrder = (ref, patch) => {
    checkpoint(patch.status ? ('Order #' + ref + ' → ' + ((ORDER_STATUS[patch.status] || {}).en || patch.status)) : 'Order #' + ref + ' edited');
    setOrders(prev => prev.map(o => o.ref === ref ? { ...o, ...patch } : o));
    if (patch.status) { const m = (ORDER_STATUS[patch.status] || {}); log('order', m.en || patch.status, ref, ''); }
    dbOrder(window.SHHH_LIVE && window.SHHH_LIVE.updateOrder(ref, patch), 'Order update');
  };
  // Issue a (full or partial) refund with a reason + note. Marks the order
  // 'refunded' once the cumulative refund covers the total; otherwise records a
  // partial refund and leaves the status as-is.
  const refundOrder = (ref, info) => {
    const o = orders.find(x => x.ref === ref);
    if (!o) return;
    const amount = Math.round((Number(info.amount) || 0) * 100) / 100;
    if (amount <= 0) return;
    const prevRefunded = (o.refunds || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const fully = prevRefunded + amount >= (Number(o.total) || 0) - 0.005;
    const entry = {
      amount, reason: info.reason, reasonLabel: info.reasonLabel || info.reason,
      note: info.note || '', ts: nowStamp(), actor: (ADMIN_ROLES[role] || {}).label || role,
    };
    checkpoint('Refund €' + amount.toFixed(2) + ' on #' + ref);
    setOrders(prev => prev.map(x => x.ref === ref ? { ...x, refunds: [...(x.refunds || []), entry], status: fully ? 'refunded' : x.status } : x));
    log('order', fully ? 'Refunded' : 'Partial refund', ref, '€' + amount.toFixed(2) + ' · ' + (info.reasonLabel || info.reason) + (info.note ? ' — ' + info.note : ''));
    toast((fully ? 'Refunded ' : 'Partially refunded ') + '€' + amount.toFixed(2) + ' on #' + ref);
    const reasonText = (info.reasonLabel || info.reason || '') + (info.note ? ' — ' + info.note : '');
    dbOrder(window.SHHH_LIVE && window.SHHH_LIVE.addRefund(o._id, ref, amount, reasonText, fully), 'Refund');
  };
  const duplicateOrder = (ref, _skipCheckpoint) => {
    if (!_skipCheckpoint) checkpoint('Duplicated order #' + ref);
    const src = orders.find(o => o.ref === ref);
    if (!src) return;
    const newRef = 'SH-' + Math.floor(Math.random() * 90000 + 10000);
    const copy = { ...src, ref: newRef, date: nowStamp(), status: 'pending', tracking: undefined };
    delete copy._id; // a fresh row; its uuid is assigned on insert
    setOrders(prev => [copy, ...prev]);
    log('order', 'Duplicated', ref, '→ ' + newRef);
    dbOrder(window.SHHH_LIVE && window.SHHH_LIVE.insertOrder(copy).then(id => {
      setOrders(prev => prev.map(o => o.ref === newRef ? { ...o, _id: id } : o));
    }), 'Duplicate order');
  };
  const removeOrders = (refs) => { checkpoint('Deleted ' + (refs.length > 1 ? refs.length + ' orders' : 'order #' + refs[0])); setOrders(prev => prev.filter(o => !refs.includes(o.ref))); log('order', 'Deleted', refs.length > 1 ? refs.length + ' orders' : refs[0], ''); dbOrder(window.SHHH_LIVE && window.SHHH_LIVE.deleteOrders(refs), 'Delete order'); };
  // Create a brand: validate, write to the DB, then add it to the live list.
  // Returns a Promise that rejects with a user-facing message on failure.
  const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const addBrand = async (data) => {
    const name = (data.name || '').trim();
    if (!name) throw new Error('Brand name is required.');
    const id = (data.id && data.id.trim()) || slugify(name);
    if (!id) throw new Error('Could not derive a slug — add letters or numbers to the name.');
    if ((brands || []).some(b => b.id === id)) throw new Error('A brand with the slug “' + id + '” already exists.');
    const brand = { id, name, country: (data.country || '').trim().toUpperCase() || null, kind: data.kind || null, margin: data.margin || null, blurb: (data.blurb || '').trim() || null, featured: false };
    if (window.SHHH_LIVE && window.SHHH_LIVE.session) {
      const created = await window.SHHH_LIVE.insertBrand(brand);
      Object.assign(brand, created); // adopt server-canonical row
    } else if (window.SHHH_LIVE && window.SHHH_LIVE.status !== 'fallback') {
      throw new Error('Sign in to add brands.');
    }
    const next = [...brands, brand];
    setBrands(next);
    window.BRANDS = next; // keep the global other screens read in sync
    log('brand', 'Created brand', name, id);
    toast('Brand “' + name + '” added.');
    return brand;
  };
  // Push a product change to the database (signed-in sessions only); the
  // local copy always updates, and a toast warns if the DB write fails.
  const dbSave = (id, patch, what) => {
    if (!window.SHHH_LIVE || !window.SHHH_LIVE.session) return;
    window.SHHH_LIVE.saveProduct(id, patch).catch(e => {
      console.warn('[shhh] DB save failed for ' + id, e);
      toast('⚠ ' + (what || 'Change') + ' saved locally, but the database update failed.');
    });
  };
  const setStockVal = (id, n) => { checkpoint('Stock adjusted'); const prevN = stock[id] ?? 0; setStock(prev => ({ ...prev, [id]: Math.max(0, n) })); const p = (window.PRODUCTS || []).find(x => x.id === id); log('inventory', 'Stock adjust', (p && p.name) || id, `${prevN} → ${Math.max(0, n)}`); dbSave(id, { stock: Math.max(0, n) }, 'Stock'); };
  const setProduct = (id, patch) => {
    checkpoint('Product edited');
    setPrices(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
    const p = (window.PRODUCTS || []).find(x => x.id === id);
    const det = patch.price != null ? ('price → €' + patch.price) : patch.hidden != null ? (patch.hidden ? 'hidden' : 'visible') : 'updated';
    log('catalog', 'Product edit', (p && p.name) || id, det);
    dbSave(id, patch, 'Product edit');
  };
  // Reviews & returns are mutated directly by their screens — wrap so each change is undoable.
  const setReviewsU = (next) => { checkpoint('Review moderation'); setReviews(next); };
  const setReturnsU = (next) => { checkpoint('Return / warranty claim'); setReturns(next); };
  // Append a support/customer message to a claim's email thread (no undo checkpoint).
  const replyToReturn = (id, msg) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, thread: [...(r.thread || []), msg] } : r));
    if (msg.from === 'support') log('return', msg.via === 'note' ? 'Internal note' : 'Replied to customer', id, (msg.body || '').slice(0, 60));
  };
  // CRM mutators
  const crmNote = (email, text) => { checkpoint('Customer note'); setCrm(prev => ({ ...prev, notes: { ...prev.notes, [email]: text } })); log('customer', 'Note saved', email, ''); };
  const crmErase = (email) => { checkpoint('GDPR erase — ' + email); setCrm(prev => ({ ...prev, erased: { ...prev.erased, [email]: true } })); log('customer', 'GDPR erase', email, 'Personal data removed'); };
  const crmSetMarketing = (email, on) => { checkpoint('Marketing consent'); setCrm(prev => ({ ...prev, marketing: { ...(prev.marketing || {}), [email]: on } })); log('customer', 'Marketing consent', email, on ? 'opted-in' : 'opted-out'); };
  const crmToggleTag = (email, tag) => { checkpoint('Customer tag'); setCrm(prev => {
    const cur = (prev.tags && prev.tags[email]);
    const base = cur || ((CUSTOMER_PROFILES[email] || {}).tags || []);
    const next = base.includes(tag) ? base.filter(t => t !== tag) : [...base, tag];
    log('customer', 'Tag ' + (base.includes(tag) ? 'removed' : 'added'), email, tag);
    return { ...prev, tags: { ...prev.tags, [email]: next } };
  }); };
  // Promos / cards / brands — wrap setters so screens log automatically
  const setPromosLogged = (next) => { checkpoint('Promo code change'); setPromos(next); log('promo', 'Updated codes', '', ''); };
  const setCardsLogged = (next) => { checkpoint('Gift card change'); setCards(next); log('promo', 'Updated gift cards', '', ''); };
  const setBrandFeaturedLogged = (next) => { checkpoint('Featured brands'); setBrandFeatured(next); log('brand', 'Featured toggle', '', ''); };
  // CMS: store the full per-language override object and publish to storefront.
  const saveCms = (key, langData) => {
    checkpoint('Content edit — ' + key.replace(/^__/, ''));
    setCmsState(prev => {
      const next = { ...prev, [key]: langData };
      cmsSave(next);
      return next;
    });
    log('content', key === '__strings' ? 'Edited UI strings' : key === '__global' ? 'Edited global SEO' : 'Edited page', key.replace(/^__/, ''), '');
  };

  // Scope orders to the active business + market (consolidated when market === 'all').
  const scopedOrders = orders.filter(o =>
    (o.business || 'shhh') === scope.business &&
    (scope.market === 'all' || (o.market || o.country) === scope.market)
  );

  const ctx = {
    orders: scopedOrders, allOrders: orders, scope, setScope,
    updateOrder, duplicateOrder, removeOrders, refundOrder, refund,
    stock, setStockVal, prices, setProduct,
    reviews, setReviews: setReviewsU, returns, setReturns: setReturnsU, replyToReturn,
    promos, setPromos: setPromosLogged, cards, setCards: setCardsLogged, brandFeatured, setBrandFeatured: setBrandFeaturedLogged,
    brands, addBrand,
    customers: deriveCustomers(scopedOrders, crm), crmNote, crmErase, crmSetMarketing, crmToggleTag,
    audit, log,
    cms, saveCms, toast, confirm, role,
    emailSettings, setEmailSettings, setRolePerms, env, setEnv,
    checkpoint, undo, redo,
    openTab,
  };

  // Nav badges (reflect the active market scope)
  const badges = {
    orders: scopedOrders.filter(o => o.status === 'pending' || o.status === 'paid').length || null,
    reviews: reviews.filter(r => !r.decided).length || null,
    returns: returns.filter(r => r.status === 'open').length || null,
    inventory: (window.PRODUCTS || []).filter(p => (stock[p.id] ?? 0) <= 4).length || null,
  };
  badges.notifications = (badges.orders || 0) + (badges.reviews || 0) + (badges.returns || 0) + (badges.inventory || 0) || null;

  const META = {
    dashboard: { title: 'Dashboard', sub: 'Today at a glance · billed as NL Trading Co' },
    orders: { title: 'Orders', sub: `${scopedOrders.length} orders · ${badges.orders || 0} need action` },
    customers: { title: 'Customers', sub: `${ctx.customers.length} customers · privacy-first CRM` },
    catalog: { title: 'Catalog', sub: `${(window.PRODUCTS || []).length} products` },
    inventory: { title: 'Inventory', sub: 'Stock levels & quick adjustments' },
    promos: { title: 'Promos & gift cards', sub: 'Discount codes and store credit' },
    marketing: { title: 'Marketing', sub: 'Automations & campaigns · consent-based' },
    analytics: { title: 'Reports', sub: 'Sales · margin · customers · marketing · inventory · forecast' },
    finances: { title: 'Finances', sub: 'Revenue, invoices, payouts & VAT' },
    reviews: { title: 'Reviews', sub: 'Moderate customer reviews before they publish' },
    returns: { title: 'Returns & warranty', sub: 'Claims with order ownership verification' },
    content: { title: 'Content', sub: 'Pages, guides, journal & legal' },
    brands: { title: 'Brands', sub: `${(window.BRANDS || []).length} brands in the directory` },
    notifications: { title: 'Notifications', sub: 'Orders, payments, stock, reviews & returns' },
    activity: { title: 'Activity log', sub: 'Every change, who made it, and when' },
    settings: { title: 'Settings', sub: 'Couriers, team, tax, shipping, discretion & more' },
    devtools: { title: 'Developer', sub: 'Bug queue, feature flags, API tokens & environment' },
    help: { title: 'User manual', sub: 'How every section works — start here' },
  };
  const meta = META[screen] || META.dashboard;

  // Map each section to the change-log area it cares about ('all' = store-wide)
  const LOG_SCOPE = {
    dashboard: 'all', orders: 'order', customers: 'customer', catalog: 'catalog',
    inventory: 'inventory', promos: 'promo', marketing: 'all', analytics: 'all',
    finances: 'finance', reviews: 'review', returns: 'return', content: 'content',
    brands: 'brand', notifications: 'all', settings: 'settings', help: 'all', devtools: 'all',
  };

  // Render a screen's body for a given tab, with a pane-scoped nav.
  const renderBody = (scr, prm, navp) => {
    if (scr === 'dashboard') return <ADashboard ctx={ctx} nav={navp} />;
    if (scr === 'orders') return <AOrders ctx={ctx} params={prm} nav={navp} />;
    if (scr === 'customers') return <ACustomers ctx={ctx} params={prm} nav={navp} />;
    if (scr === 'catalog') return <ACatalog ctx={ctx} params={prm} nav={navp} />;
    if (scr === 'inventory') return <AInventory ctx={ctx} />;
    if (scr === 'promos') return <APromos ctx={ctx} />;
    if (scr === 'marketing') return <AMarketing ctx={ctx} />;
    if (scr === 'analytics') return <AAnalytics ctx={ctx} nav={navp} />;
    if (scr === 'finances') return <AFinances ctx={ctx} nav={navp} />;
    if (scr === 'notifications') return <ANotifications ctx={ctx} nav={navp} />;
    if (scr === 'activity') return <AActivityLog ctx={ctx} />;
    if (scr === 'reviews') return <AReviews ctx={ctx} />;
    if (scr === 'returns') return <AReturns ctx={ctx} />;
    if (scr === 'content') return <AContent ctx={ctx} nav={navp} params={prm} />;
    if (scr === 'brands') return <ABrands ctx={ctx} />;
    if (scr === 'settings') return <ASettings ctx={ctx} />;
    if (scr === 'devtools') return <ADevTools ctx={ctx} nav={navp} />;
    if (scr === 'help') return <AHelp ctx={ctx} params={prm} nav={navp} />;
    return null;
  };

  // The body + its section change-log for one tab.
  const paneContent = (tab, navp) => {
    const m = META[tab.screen] || META.dashboard;
    const lt = LOG_SCOPE[tab.screen] || 'all';
    return (
      <React.Fragment>
        {renderBody(tab.screen, tab.params || {}, navp)}
        {tab.screen !== 'activity' && tab.screen !== 'help' && <AChangeLog audit={audit} type={lt} nav={navp} title={lt === 'all' ? 'Recent changes · all areas' : 'Recent changes in ' + m.title} />}
      </React.Fragment>
    );
  };

  // Enrich tabs with a display title + icon for the tab strip.
  const tabInfo = (t) => {
    const p = t.params || {};
    const m = META[t.screen] || {};
    let title = m.title || t.screen;
    if (t.screen === 'orders' && p.ref) title = '#' + p.ref;
    else if (t.screen === 'customers' && p.email) { const c = ctx.customers.find(x => x.email === p.email); title = c ? c.name : p.email; }
    else if (t.screen === 'catalog' && p.id) { const pr = (window.PRODUCTS || []).find(x => x.id === p.id); title = pr ? pr.name : title; }
    else if (t.screen === 'help' && p.topic) { const g = (window.GUIDES || {})[p.topic]; title = g ? g.title : title; }
    else if (t.screen === 'content' && p.openPage) { const cp = (window.CONTENT_PAGES || {})[p.openPage]; title = (cp && cp.title) ? cp.title : title; }
    const icon = ((window.NAV_ITEMS || []).find(n => n.id === t.screen) || {}).icon || 'dashboard';
    return { id: t.id, title, icon };
  };
  const tabList = tabs.map(tabInfo);
  const splitTab = split && splitId ? (tabs.find(t => t.id === splitId) || null) : null;

  if (!signedIn) return <ALogin onSignIn={() => setSignedIn(true)} role={role} setRole={setRole} />;

  const tabBar = <ATabBar tabs={tabList} activeId={activeId} splitId={splitId} split={split}
    onSelect={selectTab} onClose={closeTab} onNew={() => openTab('dashboard')} onToggleSplit={toggleSplit} onReorder={reorderTabs} />;

  // Pane header strip (split mode only) — shows which view + focus state.
  const paneHead = (tab, key, focused) => {
    const m = META[tab.screen] || META.dashboard;
    return (
      <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px', background: focused ? '#FFFFFF' : '#F4F4F2', borderBottom: `1px solid ${AT.rule}` }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: focused ? AT.accent : AT.inkSoft, color: '#fff', fontFamily: AT.mono, fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{key}</span>
        <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 14, color: AT.ink }}>{tabInfo(tab).title}</span>
        <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{m.title}</span>
        {focused && <span style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, color: AT.accent, letterSpacing: AT.lc, textTransform: 'uppercase' }}>· active</span>}
      </div>
    );
  };

  return (
    <AdminShell role={role} setRole={setRole} current={screen} nav={nav}
      pageTitle={meta.title} pageSub={meta.sub} badges={badges} onSignOut={signOut}
      scope={scope} setScope={setScope} tabBar={tabBar} fullBleed={split} meName={emailSettings.fromName} env={env}
      undo={undo} redo={redo} canUndo={undoStack.length > 0} canRedo={redoStack.length > 0}
      undoLabel={undoStack.length ? undoStack[undoStack.length - 1].label : ''}
      redoLabel={redoStack.length ? redoStack[redoStack.length - 1].label : ''}>
      {split && splitTab ? (
        <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
          <div onMouseDown={() => setFocusedPane('a')} style={{ flex: 1, minWidth: 0, overflowY: 'auto', borderRight: `2px solid ${focusedPane === 'a' ? AT.accent : AT.rule}` }}>
            {paneHead(activeTab, 'A', focusedPane === 'a')}
            <div style={{ padding: 24 }}>{paneContent(activeTab, makeNav(activeId))}</div>
          </div>
          <div onMouseDown={() => setFocusedPane('b')} style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
            {paneHead(splitTab, 'B', focusedPane === 'b')}
            <div style={{ padding: 24 }}>{paneContent(splitTab, makeNav(splitId))}</div>
          </div>
        </div>
      ) : (
        paneContent(activeTab, nav)
      )}
      <AToast msg={toastMsg} onUndo={undo} />
      <AConfirm state={confirmState} onClose={() => setConfirmState(null)} />
      <ARefundModal state={refundState} onClose={() => setRefundState(null)} onSubmit={(order, info) => refundOrder(order.ref, info)} />
      <GlobalSearch ctx={ctx} nav={nav} />
      <BugReporter ctx={ctx} screenLabel={meta.title} scope={scope} role={role} />
    </AdminShell>
  );
}

window.AdminApp = AdminApp;
