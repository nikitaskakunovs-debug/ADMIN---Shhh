/* Shhh — marketing tracking layer (GTM dataLayer + Meta Pixel via GTM).
   All funnel events are pushed to window.dataLayer; GTM maps them to Meta
   Pixel tags (see docs/gtm-setup.md). The app calls window.SHHH_TRACK.*.

   PRIVACY: no PII is ever pushed — no emails, phone numbers, names,
   addresses or payment details. Only product/order/provider/value data.

   PURCHASE RULE: SHHH_TRACK.purchase() is the ONLY purchase emitter; it is
   called strictly on confirmed payment, carries the final paid total
   (server-computed when available) and is deduplicated per order id. */

(function () {
  var getTrackingContext = function () {
    var params = new URLSearchParams(window.location.search);
    return {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search + window.location.hash,
      page_title: document.title,
      currency: 'EUR',
      is_stage: params.get('stage') === '1',
      event_timestamp: new Date().toISOString(),
    };
  };

  // ── GA4 bridge (gtag.js is installed directly with send_page_view off) ──
  // Every funnel event is forwarded to GA4 as its standard ecommerce
  // equivalent, so GA4's built-in funnel/revenue reports work with no GTM
  // configuration. NOTE: do NOT also add GA4 tags inside GTM — that would
  // double-count. The ?stage=1 showroom is excluded.
  var GA4_EVENTS = {
    shhh_page_view: 'page_view',
    shhh_product_selected: 'select_item',
    shhh_view_content: 'view_item',
    shhh_add_to_cart: 'add_to_cart',
    shhh_quick_buy: 'quick_buy',
    shhh_order_form_started: 'begin_checkout',
    shhh_delivery_provider_selected: 'add_shipping_info',
    shhh_payment_provider_selected: 'add_payment_info',
    shhh_order_submitted: 'order_submitted',
    shhh_payment_started: 'payment_started',
    shhh_purchase: 'purchase',
    shhh_payment_cancelled: 'payment_cancelled',
  };
  var forwardToGa4 = function (full) {
    try {
      if (typeof window.gtag !== 'function') return;
      if (full.is_stage) return; // never count showroom traffic
      var name = GA4_EVENTS[full.event];
      if (!name) return;
      var p;
      if (name === 'page_view') {
        p = { page_location: full.page_location, page_title: full.page_title, page_type: full.page_type };
      } else {
        p = { currency: 'EUR' };
        if (full.value != null) p.value = Number(full.value) || 0;
        if (full.items && full.items.length) p.items = full.items;
        else if (full.item_id) p.items = [{ item_id: full.item_id, item_name: full.item_name, item_category: full.item_category, item_brand: full.item_brand, price: full.price, quantity: full.quantity || 1 }];
        if (name === 'purchase') { p.transaction_id = full.order_id; p.shipping = full.shipping; }
        else if (full.order_id) p.order_id = full.order_id;
        if (name === 'add_shipping_info') p.shipping_tier = full.delivery_provider;
        if (name === 'add_payment_info') p.payment_type = full.payment_provider;
      }
      window.gtag('event', name, p);
    } catch (e) {}
  };

  // ── TikTok bridge (pixel loads consent-gated via the cookie banner) ──
  // Standard events per TikTok's pixel guide; purchase = CompletePayment with
  // event_id (= order ref) so a future server-side Events API can dedupe.
  var TT_EVENTS = {
    shhh_view_content: 'ViewContent',
    shhh_add_to_cart: 'AddToCart',
    shhh_order_form_started: 'InitiateCheckout',
    shhh_order_submitted: 'PlaceAnOrder',
    shhh_purchase: 'CompletePayment',
  };
  var ttContents = function (full) {
    var items = (full.items && full.items.length) ? full.items
      : full.item_id ? [{ item_id: full.item_id, item_name: full.item_name, price: full.price, quantity: full.quantity || 1 }]
      : [];
    return items.map(function (i) {
      return { content_id: i.item_id, content_type: 'product', content_name: i.item_name, quantity: i.quantity || 1, price: Number(i.price) || 0 };
    });
  };
  var forwardToTikTok = function (full) {
    try {
      if (!window.ttq || full.is_stage) return;
      if (full.event === 'shhh_page_view') { window.ttq.page(); return; }
      var name = TT_EVENTS[full.event];
      if (!name) return;
      var props = { contents: ttContents(full), currency: 'EUR' };
      if (full.value != null) props.value = Number(full.value) || 0;
      var opts = full.order_id ? { event_id: String(full.order_id) } : undefined;
      window.ttq.track(name, props, opts);
    } catch (e) {}
  };

  var pushToDataLayer = function (payload) {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    // event name first so DevTools object previews show it at a glance
    var full = Object.assign({ event: payload.event }, getTrackingContext(), payload);
    window.dataLayer.push(full);
    forwardToGa4(full);
    forwardToTikTok(full);
  };

  // Consistent item payload for every event (PII-free by construction).
  var buildItemPayload = function (product, cartItem) {
    product = product || {}; cartItem = cartItem || {};
    return {
      item_id: product.code || product.id || cartItem.id || null,
      product_id: product.id || cartItem.id || null,
      item_name: product.name || '',
      product_type: product.ptype || product.type || '',
      item_category: product.category || '',
      item_brand: product.brand || '',
      price: Number(product.price || cartItem.price || 0),
      quantity: Number(cartItem.qty || cartItem.quantity || 1),
      variant_colour: cartItem.colour || cartItem.color || null,
      variant_size: cartItem.size || null,
    };
  };

  // cartItems: [{id, qty, colour, size}] resolved against the live catalog.
  var buildItemsPayload = function (cartItems) {
    var P = window.PRODUCTS || [];
    return (cartItems || []).map(function (ci) {
      var prod = ci.id === 'gift' ? (window.GIFT_PRODUCT || { id: 'gift', name: 'Gift', price: 0 })
        : P.find(function (p) { return p.id === ci.id; });
      return buildItemPayload(prod, ci);
    });
  };

  var metaFields = function (itemsPayload) {
    return {
      content_ids: itemsPayload.map(function (i) { return i.item_id; }).filter(Boolean),
      contents: itemsPayload.map(function (i) {
        return { id: i.item_id, quantity: i.quantity, item_price: i.price };
      }),
      num_items: itemsPayload.reduce(function (s, i) { return s + Number(i.quantity || 0); }, 0),
      content_type: 'product',
    };
  };

  var totalsFields = function (t) {
    t = t || {};
    return {
      subtotal: Number(t.subtotal || 0),
      shipping: Number(t.shipping || 0),
      discount: Number(t.discount || 0),
    };
  };

  window.SHHH_TRACK = {
    _push: pushToDataLayer,
    buildItemPayload: buildItemPayload,
    buildItemsPayload: buildItemsPayload,

    pageView: function (screenName) {
      pushToDataLayer({ event: 'shhh_page_view', page_type: screenName || 'unknown', page_language: 'lv' });
    },

    productSelected: function (product) {
      if (!product) return;
      pushToDataLayer(Object.assign({
        event: 'shhh_product_selected',
        value: Number(product.price || 0),
      }, buildItemPayload(product)));
    },

    viewContent: function (product) {
      if (!product) return;
      var item = buildItemPayload(product);
      pushToDataLayer(Object.assign({
        event: 'shhh_view_content',
        value: item.price,
      }, item, metaFields([item])));
    },

    addToCart: function (product, variant) {
      if (!product) return;
      var item = buildItemPayload(product, variant || {});
      pushToDataLayer(Object.assign({
        event: 'shhh_add_to_cart',
        value: item.price * item.quantity,
      }, item, metaFields([item])));
    },

    quickBuy: function (product) {
      if (!product) return;
      pushToDataLayer(Object.assign({
        event: 'shhh_quick_buy',
        value: Number(product.price || 0),
      }, buildItemPayload(product)));
    },

    checkoutStarted: function (cartItems, totals) {
      var items = buildItemsPayload(cartItems);
      pushToDataLayer(Object.assign({
        event: 'shhh_order_form_started',
        checkout_step: 1,
        value: Number((totals && totals.total) || 0),
        items: items,
      }, totalsFields(totals), metaFields(items)));
    },

    deliverySelected: function (courier, shipping) {
      if (!courier) return;
      pushToDataLayer({
        event: 'shhh_delivery_provider_selected',
        delivery_provider: courier.name || courier.id || null,
        delivery_provider_id: courier.id || null,
        delivery_provider_type: courier.type || null,
        shipping_value: Number(shipping || 0),
      });
    },

    paymentSelected: function (method) {
      if (!method) return;
      var m = typeof method === 'string' ? { id: method } : method;
      pushToDataLayer({
        event: 'shhh_payment_provider_selected',
        payment_provider: m.id || null,
        payment_provider_name: m.name || m.label || null,
        payment_provider_type: m.type || m.kind || null,
      });
    },

    orderSubmitted: function (orderRef, payMethod, cartItems, totals) {
      var items = buildItemsPayload(cartItems);
      pushToDataLayer(Object.assign({
        event: 'shhh_order_submitted',
        order_id: orderRef || null,
        payment_status: 'submitted',
        payment_provider: payMethod || null,
        value: Number((totals && totals.total) || 0),
        purchase_value: Number((totals && totals.total) || 0),
        items: items,
      }, totalsFields(totals), metaFields(items)));
    },

    paymentStarted: function (orderRef, payMethod, cartItems, totals) {
      var items = buildItemsPayload(cartItems);
      pushToDataLayer(Object.assign({
        event: 'shhh_payment_started',
        order_id: orderRef || null,
        payment_status: 'payment_started',
        payment_provider: payMethod || null,
        value: Number((totals && totals.total) || 0),
        purchase_value: Number((totals && totals.total) || 0),
        items: items,
      }, totalsFields(totals), metaFields(items)));
    },

    // THE conversion. Only called on confirmed payment; deduped per order id.
    // value/purchase_value = final amount the customer actually paid
    // (products + shipping − discounts − gift cards). ROAS depends on this.
    // Has a purchase already fired for this dedupe key in this session?
    purchaseFired: function (key) {
      try { return !!sessionStorage.getItem('shhh_purchase_fired_' + key); } catch (e) { return false; }
    },

    purchase: function (opts) {
      opts = opts || {};
      var orderId = opts.orderId;
      if (!orderId) return;
      // dedupeKey ties the primary (server-confirmed) emitter and the
      // confirmation-page safety net to ONE event per order, even though the
      // local ref is later replaced by the server ref.
      var dk = opts.dedupeKey || orderId;
      var key = 'shhh_purchase_fired_' + dk;
      var key2 = 'shhh_purchase_fired_' + orderId;
      try {
        if (sessionStorage.getItem(key) || sessionStorage.getItem(key2)) {
          window.shhhLog && window.shhhLog('[shhh] shhh_purchase for ' + orderId + ' already fired this session — skipped (dedupe).');
          return;
        }
        sessionStorage.setItem(key, '1');
        sessionStorage.setItem(key2, '1');
      } catch (e) {}
      try {
      var items = buildItemsPayload(opts.items || []);
      var paid = Number(opts.paidTotal);
      if (!isFinite(paid)) paid = 0;
      pushToDataLayer(Object.assign({
        event: 'shhh_purchase',
        event_id: orderId,
        order_id: orderId,
        payment_status: 'paid',
        payment_provider: opts.payMethod || null,
        value: paid,
        purchase_value: paid,
        // TODO: business_revenue / net_revenue / commission_revenue need
        // backend support (product costs exist in the DB; margin per order is
        // not exposed to the storefront yet). Do not fake them.
        items: items,
      }, totalsFields(opts.totals), metaFields(items)));
      window.shhhLog && window.shhhLog('[shhh] shhh_purchase pushed to dataLayer: order ' + orderId + ' value €' + paid);
      } catch (e) { console.error('[shhh] shhh_purchase FAILED to push:', e); }
    },

    paymentFailed: function (orderRef, payMethod, total) {
      pushToDataLayer({
        event: 'shhh_payment_failed', order_id: orderRef || null,
        payment_status: 'failed', payment_provider: payMethod || null,
        value: Number(total || 0),
      });
    },

    paymentCancelled: function (orderRef, payMethod, total) {
      pushToDataLayer({
        event: 'shhh_payment_cancelled', order_id: orderRef || null,
        payment_status: 'cancelled', payment_provider: payMethod || null,
        value: Number(total || 0),
      });
    },
  };
})();
