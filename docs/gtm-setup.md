# GTM + Meta Pixel setup — Shhh storefront

The site (desktop.html + mobile.html) pushes a complete funnel into
`window.dataLayer`. This document is the GTM-side configuration to map those
events to Meta Pixel. **One web container serves both pages.**

## 0. Container ID

`desktop.html` and `mobile.html` contain the standard GTM snippet, head
script + body noscript, wired to container **`GTM-NKLPLDSZ`** (installed).

If Meta gives a domain-verification meta tag, add it inside `<head>` of both
files.

## 1. dataLayer events emitted by the site

| Event | When | Meta mapping |
|---|---|---|
| `shhh_page_view` | initial load + every SPA screen change | PageView |
| `shhh_product_selected` | product card clicked | optional custom `ProductSelected` |
| `shhh_view_content` | product detail opened | **ViewContent** |
| `shhh_add_to_cart` | product added to bag | **AddToCart** |
| `shhh_quick_buy` | quick-buy used | optional custom |
| `shhh_order_form_started` | checkout entered (once) | **InitiateCheckout** |
| `shhh_delivery_provider_selected` | courier changed | optional custom |
| `shhh_payment_provider_selected` | payment method changed | optional custom |
| `shhh_order_submitted` | order created (NOT paid) | optional custom `OrderSubmitted` — **never Purchase** |
| `shhh_payment_started` | payment flow begins | optional custom `PaymentStarted` — **never Purchase** |
| `shhh_purchase` | **payment confirmed only** | **Purchase** |
| `shhh_payment_cancelled` | pending order cancelled | optional custom |

Every event also carries: `page_location`, `page_path`, `page_title`,
`currency` (`EUR`), `is_stage`, `event_timestamp`.

Commerce events carry (when applicable): `value`, `purchase_value`,
`subtotal`, `shipping`, `discount`, `order_id`, `payment_status`,
`payment_provider`, `delivery_provider(_id/_type)`, `items[]`,
`content_ids[]`, `contents[]`, `num_items`, `content_type='product'`,
and per-item `item_id`, `product_id`, `item_name`, `product_type`,
`item_category`, `item_brand`, `price`, `quantity`, `variant_colour`,
`variant_size`.

**No PII is ever pushed** (no emails, phones, names, addresses, payment
details) — the tracking layer (`shop-tracking.js`) cannot emit them by
construction.

## 2. GTM Data Layer Variables to create

`value`, `currency`, `purchase_value`, `order_id`, `payment_status`,
`payment_provider`, `payment_provider_type`, `delivery_provider`,
`delivery_provider_id`, `delivery_provider_type`, `product_id`, `item_id`,
`item_name`, `product_type`, `item_category`, `item_brand`,
`variant_colour`, `variant_size`, `quantity`, `price`, `items`,
`content_ids`, `contents`, `num_items`, `content_type`, `is_stage`,
`subtotal`, `shipping`, `discount`.

(`business_revenue` / `net_revenue` / `commission_revenue` are NOT emitted
yet — needs backend support; see TODO at the bottom.)

## 3. Triggers (Custom Event, exact names)

One Custom Event trigger per event name in the table above. For every
**conversion** trigger (ViewContent, AddToCart, InitiateCheckout, Purchase)
add the condition: **`is_stage` does not equal `true`** — this excludes the
design showroom (`?stage=1`).

## 4. Meta Pixel tags

1. **Meta base + PageView** — trigger `shhh_page_view` (covers SPA
   navigation; do NOT also use GTM's built-in All Pages or PageView fires
   twice).
2. **ViewContent** — trigger `shhh_view_content`; params: value, currency,
   content_ids, contents, content_type.
3. **AddToCart** — trigger `shhh_add_to_cart`; same params.
4. **InitiateCheckout** — trigger `shhh_order_form_started`; params: value,
   currency, content_ids, contents, content_type, num_items.
5. **Purchase** — trigger `shhh_purchase` ONLY, with conditions:
   - `payment_status` equals `paid`
   - `value` greater than 0
   - `currency` equals `EUR`
   - `is_stage` does not equal `true`
   Params: value, currency, content_ids, contents, content_type, num_items,
   order_id, payment_provider. Use `event_id` (= order_id) as the Meta
   event ID for deduplication with any future server-side Conversions API.

## 5. ROAS guarantees built into the site

- `value`/`purchase_value` on `shhh_purchase` is the **final amount the
  customer paid**: server-computed by the database order function —
  products + shipping − promo discount − gift card. Not subtotal, not unit
  price, not a count.
- Purchase fires **only** on confirmed payment: instant-success payments and
  pending→paid retries. It does NOT fire on form submit, bank-transfer
  order creation, pending pages, cancellation or failure.
- Duplicate protection: a sessionStorage guard per `order_id` — refreshing
  the confirmation page cannot re-fire it.

## 6. Testing (GTM Preview + Meta Test Events)

1. Load `/desktop.html` and `/mobile.html` → container loads, one PageView.
2. Click a product card → `shhh_product_selected` + `shhh_view_content`.
3. Add to bag → `shhh_add_to_cart` with correct price.
4. Enter checkout → `shhh_order_form_started` once, items populated.
5. Change courier → `shhh_delivery_provider_selected` (no address data).
6. Change payment method → `shhh_payment_provider_selected`.
7. Pay with card/Apple Pay → `shhh_order_submitted` → `shhh_payment_started`
   → `shhh_purchase` once, with order_id (SH-…) and the paid total.
8. Bank transfer order → submitted fires, **no Purchase**.
9. Banklink pending page → no Purchase; Retry → Purchase once; Cancel →
   `shhh_payment_cancelled`.
10. Refresh confirmation → no second Purchase.
11. `?stage=1` → events carry `is_stage:true` → conversion tags must not fire.

## 7. Google Analytics 4 — INSTALLED (G-P5RN3NFJ7J, consent-gated gtag.js)

GA4 is wired **directly in code**, NOT through GTM, and **only loads after
cookie consent** (GDPR):
- The cookie banner (`shop-consent.jsx`, `TRACKING.ga4 = 'G-P5RN3NFJ7J'`)
  injects gtag.js when the visitor grants the *analytics* category, with
  `send_page_view: false`; saved consent re-arms it on every later visit.
- `shop-tracking.js` forwards every funnel event to GA4 as its standard
  ecommerce equivalent automatically (`?stage=1` excluded; `purchase`
  carries `transaction_id` = order ref for dedup). Events before consent
  are not sent to GA4 — by design.
- The same consent config has dormant slots for Microsoft Clarity, the
  Meta Pixel, Google Ads and TikTok — drop the real IDs in `TRACKING`
  when available (Meta can alternatively stay in GTM; pick ONE path).
- The agency prototype's placeholder IDs (Crocus GA4 `G-4WC2LJ49LH`,
  a stray Clarity + Meta Pixel) have been removed — visitor data no
  longer leaks to third-party accounts.

⚠️ **Do NOT also create GA4 tags inside GTM** — events would double-count.
GTM is for the Meta Pixel only. Remaining GA4 step: in GA4 Admin → Events,
mark `purchase` as a key event.

The active event map (implemented in code, for reference):

| Trigger (custom event) | GA4 event | Key parameters |
|---|---|---|
| `shhh_page_view` | `page_view` | page_location, page_title |
| `shhh_product_selected` | `select_item` | items |
| `shhh_view_content` | `view_item` | value, currency, items |
| `shhh_add_to_cart` | `add_to_cart` | value, currency, items |
| `shhh_order_form_started` | `begin_checkout` | value, currency, items |
| `shhh_delivery_provider_selected` | `add_shipping_info` | shipping_tier = `delivery_provider` |
| `shhh_payment_provider_selected` | `add_payment_info` | payment_type = `payment_provider` |
| `shhh_order_submitted` | custom `order_submitted` | value, currency, order_id |
| `shhh_payment_started` | custom `payment_started` | value, currency, order_id |
| `shhh_purchase` | **`purchase`** | **transaction_id = `order_id`**, value, currency, shipping, items |
| `shhh_payment_cancelled` | custom `payment_cancelled` | order_id |

Notes:
- `purchase` REQUIRES `transaction_id` — map it from the `order_id`
  dataLayer variable. GA4 dedupes repeat purchases by transaction_id.
- Apply the same `is_stage ≠ true` condition to the GA4 ecommerce/conversion
  triggers as for Meta (§3) — or reuse the same triggers.
- Mark `purchase` as a key event in GA4 Admin → Events.
- Pass `items` via the `items` dataLayer variable (no remapping needed).

### Google Ads (when campaigns start)
Add a **Google Ads Conversion Tracking** tag (`AW-…`) triggered by
`shhh_purchase`, with Conversion Value = `value`, currency EUR,
Transaction ID = `order_id` (prevents double-counted conversions). Link
GA4 ↔ Google Ads in GA4 Admin for audience sharing.

## TODO (needs backend)

- `business_revenue` / `net_revenue` / `commission_revenue`: product costs
  exist in the database (`products.cost`), but per-order margin isn't
  exposed to the storefront. When wanted: extend the order function to
  return it, then add to the purchase payload as custom parameters.
- When a real payment provider (Stripe/Montonio) lands, move the Purchase
  signal server-side (webhook → Conversions API) and use `event_id` for
  browser/server dedup.
