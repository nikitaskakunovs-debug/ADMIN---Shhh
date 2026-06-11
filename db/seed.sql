-- ============================================================================
-- Shhh — seed data
--
-- Loads the prototype's mock data (shop-*.jsx, admin-data.jsx) into the
-- schema from schema.sql, so a fresh database starts life looking like the
-- prototype. Run AFTER schema.sql:
--     psql "$DATABASE_URL" -f db/schema.sql -f db/seed.sql
--
-- Idempotent: every INSERT uses ON CONFLICT DO NOTHING, so re-running it
-- will not create duplicates.
--
-- Two kinds of data live here:
--   1. CONFIGURATION — businesses, markets, roles, catalog, brands, promos,
--      CMS, i18n. This is real starting content you'd keep.
--   2. DEMO RECORDS  — a handful of customers, orders, reviews, returns,
--      payouts and audit entries, clearly marked, so the dashboard isn't
--      empty on day one. In a true production launch you'd skip section 2
--      and let real data accumulate.
--
-- NOTE on a prototype inconsistency: admin-data.jsx's seed orders referenced
-- product codes ('glow','hush-01',…) that were never defined as products.
-- The demo orders below instead reference the REAL catalog products from
-- shop-data.jsx, so foreign keys resolve and totals are meaningful.
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║ SECTION 1 — CONFIGURATION                                     ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── Businesses (admin-data.jsx BUSINESSES) ──
insert into businesses (id, name, tag, short, planned) values
  ('shhh',  'shhh...',    'Intimacy & wellness', 'S', false),
  ('lumen', 'Lumen Care', 'Personal care',       'L', true)
on conflict (id) do nothing;

-- ── Markets (admin-data.jsx MARKETS) ──
insert into markets (id, country, currency, symbol, fx, locale, vat_rate, lang, entity, status) values
  ('LV', 'Latvia',    'EUR', '€',  1.00,  'lv-LV', 0.2100, 'Latvian',    'NL Trading Co',          'live'),
  ('LT', 'Lithuania', 'EUR', '€',  1.00,  'lt-LT', 0.2100, 'Lithuanian', 'NL Trading Co',          'live'),
  ('EE', 'Estonia',   'EUR', '€',  1.00,  'et-EE', 0.2200, 'Estonian',   'NL Trading Co',          'live'),
  ('FI', 'Finland',   'EUR', '€',  1.00,  'fi-FI', 0.2550, 'Finnish',    'NL Trading OY',          'planned'),
  ('PL', 'Poland',    'PLN', 'zł', 4.30,  'pl-PL', 0.2300, 'Polish',     'NL Trading sp. z o.o.',  'planned')
on conflict (id) do nothing;

-- ── Store settings (shop-data.jsx `store`) ──
insert into store_settings (business_id, name, tagline, base_currency, default_locale, domain, support_email, home_country) values
  ('shhh', 'Shhh', 'Quiet luxury intimates', 'EUR', 'en', 'shhh-store.example', 'care@shhh-store.example', 'LV')
on conflict (business_id) do nothing;

-- ── Admin roles (admin-data.jsx ADMIN_ROLES) ──
insert into admin_roles (id, label, short, description) values
  ('owner',      'Owner',          'OW', 'Full access'),
  ('manager',    'Manager',        'MG', 'Operations & reports'),
  ('sales',      'Sales',          'SL', 'Orders, customers & growth'),
  ('accountant', 'Accountant',     'AC', 'Finance & reconciliation'),
  ('support',    'Support',        'SU', 'Orders, reviews, returns'),
  ('fulfilment', 'Fulfilment',     'FU', 'Orders, inventory'),
  ('content',    'Content editor', 'CO', 'CMS, brands, reviews'),
  ('developer',  'Developer',      'DV', 'Read-broad · dev tools')
on conflict (id) do nothing;

-- ── Role → nav permissions (admin-data.jsx ROLE_NAV) ──
insert into role_permissions (role_id, section)
select role_id, unnest(sections) from (values
  ('owner',      array['dashboard','orders','customers','catalog','inventory','promos','marketing','analytics','finances','reviews','returns','content','brands','notifications','activity','settings','devtools','help']),
  ('manager',    array['dashboard','orders','customers','catalog','inventory','promos','marketing','analytics','finances','reviews','returns','content','brands','notifications','activity','help']),
  ('sales',      array['dashboard','orders','customers','catalog','promos','marketing','analytics','reviews','notifications','help']),
  ('accountant', array['dashboard','orders','finances','analytics','returns','notifications','activity','help']),
  ('support',    array['dashboard','orders','customers','reviews','returns','notifications','activity','help']),
  ('fulfilment', array['dashboard','orders','inventory','catalog','notifications','activity','help']),
  ('content',    array['dashboard','marketing','content','brands','reviews','analytics','activity','help']),
  ('developer',  array['dashboard','orders','customers','catalog','inventory','analytics','reviews','returns','content','notifications','activity','devtools','help'])
) as r(role_id, sections)
on conflict do nothing;

-- ── An initial owner account (replace email before going live) ──
insert into admin_users (email, name, role_id) values
  ('owner@shhh-store.example', 'Store Owner', 'owner')
on conflict (email) do nothing;

-- ── Brands (shop-brands.jsx; featured flags from admin brandFeatured) ──
insert into brands (id, name, country, kind, margin, blurb, featured) values
  ('shhh-house',    'Shhh House',    'LV', 'In-house label', 'high',   'Our own line — essentials, loungewear, and the 3-packs that pay the rent.', false),
  ('maison-nuit',   'Maison Nuit',   'FR', 'Partner brand',  'medium', 'Parisian lace specialist. Balconettes, bridal tulle, drama.',               false),
  ('silk-route',    'Silk Route',    'IT', 'Partner brand',  'medium', 'Mulberry silk slips, robes and sleep accessories from Como.',                false),
  ('atelier-anouk', 'Atelier Anouk', 'NL', 'Consignment',    'low',    'Small-batch body care: pillow mists, oils, nothing that stains silk.',       false)
on conflict (id) do nothing;

-- ── Categories (shop-data.jsx categories) ──
insert into categories (id, name, position) values
  ('bras',        'Bras',        1),
  ('briefs',      'Briefs',      2),
  ('sets',        'Sets',        3),
  ('sleepwear',   'Sleepwear',   4),
  ('loungewear',  'Loungewear',  5),
  ('accessories', 'Accessories', 6),
  ('beauty',      'Beauty',      7)
on conflict (id) do nothing;

-- ── Products (shop-data.jsx products — all 20) ──
insert into products (legacy_id, sku, name, brand_id, category_id, price, compare_at, cost, stock, status, color, sizes, created_at) values
  ('P-1001','SH-BRA-001','Whisper Wireless Bra',     'maison-nuit',  'bras',        64,  79,   21, 64,  'active',  '#E8C9D8', '{XS,S,M,L,XL}', '2025-09-14'),
  ('P-1002','SH-BRA-002','Mesh Balconette',          'maison-nuit',  'bras',        72,  null, 24, 31,  'active',  '#1C1C1E', '{S,M,L}',       '2025-10-02'),
  ('P-1003','SH-BRA-003','Second-Skin Triangle Bra', 'silk-route',   'bras',        58,  null, 18, 7,   'active',  '#D9C8B4', '{XS,S,M,L}',    '2025-11-20'),
  ('P-1004','SH-BRF-001','Cloud High-Rise Brief',    'maison-nuit',  'briefs',      28,  36,   8,  142, 'active',  '#F2E6EE', '{XS,S,M,L,XL}', '2025-08-30'),
  ('P-1005','SH-BRF-002','Lace Cheeky',              'silk-route',   'briefs',      32,  null, 9,  88,  'active',  '#7A1F3D', '{S,M,L}',       '2025-09-22'),
  ('P-1006','SH-BRF-003','Seamless Thong 3-Pack',    'shhh-house',   'briefs',      45,  54,   13, 4,   'active',  '#C9CDD6', '{XS,S,M,L}',    '2025-10-18'),
  ('P-1007','SH-SET-001','Midnight Lace Set',        'maison-nuit',  'sets',        118, 139,  38, 22,  'active',  '#0E1230', '{S,M,L}',       '2025-11-05'),
  ('P-1008','SH-SET-002','Blush Satin Set',          'silk-route',   'sets',        104, null, 33, 17,  'active',  '#EFB7C4', '{XS,S,M,L}',    '2025-12-01'),
  ('P-1009','SH-SLP-001','Silk Slip Dress',          'silk-route',   'sleepwear',   148, null, 52, 26,  'active',  '#B9A77E', '{S,M,L}',       '2025-07-19'),
  ('P-1010','SH-SLP-002','Cloud Pyjama Set',         'shhh-house',   'sleepwear',   96,  112,  30, 49,  'active',  '#DCE4EE', '{XS,S,M,L,XL}', '2025-09-08'),
  ('P-1011','SH-SLP-003','Short Silk Robe',          'silk-route',   'sleepwear',   132, null, 44, 12,  'active',  '#3E5740', '{S/M,L/XL}',    '2025-10-27'),
  ('P-1012','SH-LNG-001','Ribbed Lounge Set',        'shhh-house',   'loungewear',  89,  null, 27, 73,  'active',  '#A8927B', '{XS,S,M,L}',    '2025-08-11'),
  ('P-1013','SH-LNG-002','Cashmere Blend Cardigan',  'shhh-house',   'loungewear',  156, 180,  58, 9,   'active',  '#CFC4B6', '{S,M,L}',       '2025-11-12'),
  ('P-1014','SH-ACC-001','Sleep Mask — Mulberry Silk','silk-route',  'accessories', 34,  null, 9,  118, 'active',  '#542A3C', '{One size}',    '2025-06-25'),
  ('P-1015','SH-ACC-002','Scrunchie Trio',           'shhh-house',   'accessories', 22,  null, 5,  0,   'active',  '#E2D5E8', '{One size}',    '2025-09-30'),
  ('P-1016','SH-BTY-001','Pillow Mist — Lavender',   'atelier-anouk','beauty',      29,  null, 7,  54,  'active',  '#9D8FC0', '{100 ml}',      '2025-10-09'),
  ('P-1017','SH-BTY-002','Body Oil — Neroli',        'atelier-anouk','beauty',      42,  48,   12, 37,  'active',  '#D9A05B', '{150 ml}',      '2025-11-28'),
  ('P-1018','SH-SET-003','Bridal Tulle Set',         'maison-nuit',  'sets',        165, null, 55, 11,  'draft',   '#F5F1EA', '{XS,S,M,L}',    '2026-01-15'),
  ('P-1019','SH-LNG-003','Wide-Leg Knit Pant',       'shhh-house',   'loungewear',  78,  null, 24, 41,  'draft',   '#6E6A63', '{XS,S,M,L}',    '2026-02-03'),
  ('P-1020','SH-BRA-004','Velvet Longline Bra',      'maison-nuit',  'bras',        84,  98,   28, 0,   'archived','#2C1A2E', '{S,M,L}',       '2025-03-04')
on conflict (sku) do nothing;

-- ── Product images (products/*.png shipped in the repo) ──
insert into product_images (product_id, url, alt, position)
select id, 'products/halo.png', name, 0 from products where legacy_id = 'P-1007'
on conflict do nothing;
insert into product_images (product_id, url, alt, position)
select id, 'products/glow.png', name, 0 from products where legacy_id = 'P-1009'
on conflict do nothing;
insert into product_images (product_id, url, alt, position)
select id, 'products/hush-01.png', name, 0 from products where legacy_id = 'P-1016'
on conflict do nothing;

-- ── Promos (shop-promo.jsx promos) ──
insert into promos (ref, code, type, value, status, starts_on, ends_on, usage_limit, used_count, applies_to, note) values
  ('PR-01','QUIET10',  'percent',  10, 'active',    '2026-05-01','2026-08-31', null, 412, 'Entire order',     'Newsletter welcome code'),
  ('PR-02','SILKYJUNE','percent',  15, 'active',    '2026-06-01','2026-06-30', 1000, 187, 'Sleepwear',        'June silk campaign'),
  ('PR-03','FREESHIP', 'shipping', 0,  'active',    '2026-01-01', null,        null, 958, 'Orders over €80',  'Evergreen free shipping'),
  ('PR-04','BRIDAL25', 'percent',  25, 'scheduled', '2026-07-01','2026-07-14', 300,  0,   'Sets',             'Bridal capsule launch'),
  ('PR-05','SHHH5',    'fixed',    5,  'active',    '2026-03-15', null,        null, 731, 'Entire order',     'Cart-recovery email code'),
  ('PR-06','VIPNIGHT', 'percent',  20, 'expired',   '2026-04-18','2026-04-20', 264,  264, 'Entire order',     'VIP shopping night'),
  ('PR-07','BEAUTYDUO','fixed',    12, 'paused',    '2026-05-10','2026-09-01', 500,  58,  'Beauty',           'Buy 2 beauty items')
on conflict (code) do nothing;

-- ── Campaigns (shop-promo.jsx campaigns + admin SEED_CAMPAIGNS) ──
insert into campaigns (ref, name, channel, status, starts_on, spend, revenue, sent, open_rate, click_rate) values
  ('CMP-1', 'Summer Silk',           'Email',     'running',  '2026-06-01', 1240, 9860,  0,    0,  0),
  ('CMP-2', 'Bridal Capsule',        'Instagram', 'draft',    '2026-07-01', 0,    0,     0,    0,  0),
  ('CMP-3', 'Quiet Hours Retarget',  'Meta Ads',  'running',  '2026-05-12', 2310, 11470, 0,    0,  0),
  ('CMP-4', 'Spring Refresh',        'Email',     'finished', '2026-03-20', 890,  6120,  0,    0,  0),
  ('cm-summer',  'Summer · SUMMER20', 'Email',    'active',    '2026-05-28', 0,   3120, 4200, 38, 9.1),
  ('cm-couples', 'Couples collection','Email',    'scheduled', '2026-06-09', 0,   0,    0,    0,  0),
  ('cm-spring',  'Spring refresh',    'Email',    'done',      '2026-04-12', 0,   4470, 3850, 41, 8.4)
on conflict (ref) do nothing;

-- ── Automations (admin-data.jsx SEED_AUTOMATIONS) ──
insert into automations (ref, name, description, enabled) values
  ('au-cart',    'Abandoned checkout',          'Discreet email 1h after an unfinished checkout.',     true),
  ('au-winback', 'Win-back (60 days)',          'Re-engage customers who haven''t ordered in 2 months.', true),
  ('au-review',  'Post-delivery review request','Ask for a review 7 days after delivery.',             false),
  ('au-restock', 'Back-in-stock alert',         'Notify customers when a saved item is restocked.',    true)
on conflict (ref) do nothing;

-- ── CMS pages (shop-content.jsx pages) ──
insert into cms_pages (slug, title, body, status, updated_at) values
  ('/',           'Home',               E'Hero: "Quiet luxury, loudly comfortable."\nFeatured: Midnight Lace Set, Silk Slip Dress.\nStrip: free shipping over €80 · 30-day returns · discreet packaging.', 'published', '2026-06-04'),
  ('/about',      'Our Story',          'Shhh started in a Riga attic with one sewing machine and a strong opinion about underwire. We make intimates that whisper, not shout.', 'published', '2026-05-18'),
  ('/size-guide', 'Size Guide',         'Measurement tables for bras, briefs and sleepwear. Includes the "between sizes? size up for sleep, down for lace" rule.', 'published', '2026-04-29'),
  ('/shipping',   'Shipping & Returns', 'Baltics 1–3 days, EU 3–7 days. Free over €80. Returns within 30 days, hygiene seal intact. Discreet, logo-free outer box.', 'published', '2026-06-01'),
  ('/care',       'Silk Care',          'How to wash silk without crying: cold water, pH-neutral soap, never the dryer. Draft — waiting on photography.', 'draft', '2026-06-08'),
  ('/bridal',     'Bridal Capsule',     'Landing page for the July bridal drop. Goes live with BRIDAL25.', 'scheduled', '2026-06-09')
on conflict (slug) do nothing;

-- ── Banners (shop-content.jsx banners) ──
insert into banners (title, message, placement, active) values
  ('Free shipping bar', 'Free shipping on orders over €80 🤫', 'Top bar — all pages',  true),
  ('June silk promo',   'SILKYJUNE — 15% off all sleepwear',   'Home hero ribbon',     true),
  ('Bridal teaser',     'Something white is coming · 01.07',    'Collection footer',    false)
on conflict do nothing;

-- ── FAQs (shop-content.jsx faqs) ──
insert into faqs (question, answer, position) values
  ('Is the packaging discreet?',  'Yes — plain outer box, no brand on the label. The shipping line item says "apparel".', 1),
  ('Can I return briefs?',        'Only with the hygiene seal intact, within 30 days.', 2),
  ('Do you ship outside the EU?', 'Not yet — Baltics and EU only. UK and CH are on the roadmap.', 3),
  ('How do I wash silk pieces?',  'Cold hand wash, pH-neutral soap, air dry flat. Never tumble dry.', 4)
on conflict do nothing;

-- ── Locales (shop-i18n.jsx locales) ──
insert into locales (code, name, flag, enabled) values
  ('en', 'English',  '🇬🇧', true),
  ('lv', 'Latviešu', '🇱🇻', true),
  ('ru', 'Русский',  '🇷🇺', true),
  ('de', 'Deutsch',  '🇩🇪', false)
on conflict (code) do nothing;

-- ── Translations (shop-i18n.jsx strings) ──
insert into translations (locale, key, value) values
  ('en','nav.shop','Shop'),('en','nav.new','New in'),('en','nav.sale','Sale'),
  ('en','cart.title','Your bag'),('en','cart.empty','Your bag is empty — shhh, nobody saw.'),
  ('en','cart.checkout','Checkout'),('en','product.addToCart','Add to bag'),
  ('en','product.sizeGuide','Size guide'),('en','checkout.shipping','Shipping'),
  ('en','checkout.payment','Payment'),('en','footer.newsletter','Quiet drops, no spam. Ever.'),
  ('lv','nav.shop','Veikals'),('lv','nav.new','Jaunumi'),('lv','nav.sale','Izpārdošana'),
  ('lv','cart.title','Tava soma'),('lv','cart.empty','Tava soma ir tukša — kluss, neviens neredzēja.'),
  ('lv','cart.checkout','Noformēt pirkumu'),('lv','product.addToCart','Ielikt somā'),
  ('lv','product.sizeGuide','Izmēru tabula'),('lv','checkout.shipping','Piegāde'),
  ('lv','checkout.payment','Apmaksa'),('lv','footer.newsletter','Klusi jaunumi, bez surogātpasta.'),
  ('ru','nav.shop','Магазин'),('ru','nav.new','Новинки'),('ru','nav.sale','Скидки'),
  ('ru','cart.title','Ваша корзина'),('ru','cart.empty','Корзина пуста — тсс, никто не видел.'),
  ('ru','cart.checkout','Оформить заказ'),('ru','product.addToCart','В корзину'),
  ('ru','product.sizeGuide','Таблица размеров'),('ru','checkout.shipping','Доставка'),
  ('ru','checkout.payment','Оплата'),('ru','footer.newsletter','Тихие новинки, без спама.'),
  ('de','nav.shop','Shop'),('de','nav.new','Neu'),('de','nav.sale','Sale'),
  ('de','cart.title','Deine Tasche'),('de','product.addToCart','In die Tasche')
on conflict (locale, key) do nothing;

-- ╔══════════════════════════════════════════════════════════════╗
-- ║ SECTION 2 — DEMO RECORDS (sample, so the dashboard isn't empty)║
-- ║ Omit this section for a clean production launch.               ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── Customers (subset of admin-data.jsx CUSTOMER_PROFILES) ──
insert into customers (email, alias, name, city, market_id, marketing_opt_in, tags, created_at) values
  ('anna88@inbox.lv',     'Anna',     'Anna B.',     'Rīga',     'LV', true,  '{repeat}',        '2025-11-02'),
  ('s.k@inbox.lv',        'Sintija',  'Sintija K.',  'Liepāja',  'LV', true,  '{vip,repeat}',    '2025-08-14'),
  ('elina.j@gmail.com',   'Elīna',    'Elīna J.',    'Rīga',     'LV', false, '{vip}',           '2025-07-30'),
  ('greta.v@gmail.com',   'Greta',    'Greta V.',    'Vilnius',  'LT', true,  '{new}',           '2026-05-22'),
  ('kati.t@gmail.com',    'Kati',     'Kati T.',     'Tallinn',  'EE', true,  '{repeat}',        '2026-04-28'),
  ('r.kalnins@gmail.com', 'R.',       'R. Kalniņš',  'Rīga',     'LV', false, '{refund-risk}',   '2026-03-02')
on conflict (email) do nothing;

-- Manual ledger adjustments (admin-data.jsx CUSTOMER_LEDGER)
insert into customer_ledger_entries (customer_id, amount, reason)
select id, -14.50, 'Double-charged once; balance carried as store credit' from customers where email = 's.k@inbox.lv'
on conflict do nothing;
insert into customer_ledger_entries (customer_id, amount, reason)
select id, 23.00, 'Outstanding balance after a partial-refund dispute' from customers where email = 'r.kalnins@gmail.com'
on conflict do nothing;

-- ── Payouts (admin-data.jsx SEED_PAYOUTS) ──
insert into payouts (ref, payout_date, gross, fees, net, status, method) values
  ('PO-2061', '2026-06-01', 4820.50, 96.41,  4724.09, 'paid',      'Citadele settlement'),
  ('PO-2054', '2026-05-25', 3910.00, 78.20,  3831.80, 'paid',      'Citadele settlement'),
  ('PO-2047', '2026-05-18', 5230.75, 104.62, 5126.13, 'paid',      'Citadele settlement'),
  ('PO-2068', '2026-06-08', 2140.00, 42.80,  2097.20, 'scheduled', 'Citadele settlement')
on conflict (ref) do nothing;

-- ── Demo orders (referencing REAL catalog products; totals computed below) ──
-- A small, coherent spread across the lifecycle and markets.
insert into orders (ref, business_id, market_id, customer_id, alias, email, status, pay_method, courier, locker, sender, tracking, company, vat_no, vies_valid, vat_rate, promo_code) values
  ('SH-24085', 'shhh', 'LV', (select id from customers where email='anna88@inbox.lv'),   'Anna',   'anna88@inbox.lv',   'paid',      'apple',    'dpd',     'Narvesen, Rīga',    'NL Trading Co', null,          null,                  null,            null, 0.2100, null),
  ('SH-24079', 'shhh', 'LV', (select id from customers where email='s.k@inbox.lv'),      'Sintija','s.k@inbox.lv',     'shipped',   'citadele', 'omniva',  'Akropole, Rīga',    'NL Trading Co', 'OMX240601LV', null,                  null,            null, 0.2100, null),
  ('SH-24060', 'shhh', 'LV', (select id from customers where email='elina.j@gmail.com'), 'Elīna',  'elina.j@gmail.com', 'delivered', 'seb',      'omniva',  'Akropole, Rīga',    'NL Trading Co', null,          'Rīga Wellness SIA',   'LV40103123456', true, 0.2100, 'QUIET10'),
  ('SH-24090', 'shhh', 'LT', (select id from customers where email='greta.v@gmail.com'), 'Greta',  'greta.v@gmail.com', 'pending',   'paysera',  'venipak', 'Akropolis, Vilnius','NL Trading Co', null,          null,                  null,            null, 0.2100, null),
  ('SH-24089', 'shhh', 'EE', (select id from customers where email='kati.t@gmail.com'),  'Kati',   'kati.t@gmail.com',  'paid',      'card',     'omniva',  'Ülemiste, Tallinn', 'NL Trading Co', null,          'Tallinn Retail OÜ',   'EE101234567',   true, 0.2200, null),
  -- A B2B intra-Community reverse-charge order (0% VAT; buyer self-accounts):
  ('SH-24093', 'shhh', 'LV', null,                                                       'Berlin Wellness GmbH', 'procurement@berlin-wellness.de', 'paid', 'transfer', 'dpd', 'Door · München', 'NL Trading Co', null, 'Berlin Wellness GmbH', 'DE312345678', true, 0.0000, null)
on conflict (ref) do nothing;

-- Link the VIES validation snapshot on the reverse-charge order.
update orders set vies_checked_at = '2026-06-02T11:21:30Z', vies_consult = 'WDE7K2P9QX',
       vies_name = 'Berlin Wellness GmbH', vies_address = 'München, DE'
where ref = 'SH-24093';

-- ── Order items (reference real catalog products by legacy_id) ──
-- helper pattern: insert a line by (order ref, product legacy_id, qty)
insert into order_items (order_id, product_id, name, unit_price, qty)
select o.id, p.id, p.name, p.price, v.qty
from (values
  ('SH-24085','P-1007',1), ('SH-24085','P-1004',2),
  ('SH-24079','P-1011',1),
  ('SH-24060','P-1009',1),
  ('SH-24090','P-1001',1), ('SH-24090','P-1004',1),
  ('SH-24089','P-1014',2), ('SH-24089','P-1016',1),
  ('SH-24093','P-1010',6), ('SH-24093','P-1012',4)
) as v(order_ref, legacy_id, qty)
join orders o   on o.ref = v.order_ref
join products p on p.legacy_id = v.legacy_id
on conflict do nothing;

-- Compute order money from the line items (mirrors _mkOrder):
-- subtotal = Σ price·qty; free shipping over €60 else €2.50 (€0 for B2B reverse-charge);
-- total = subtotal − discount + shipping. SH-24060 carries a QUIET10 −10% discount.
update orders o set
  subtotal = li.sub,
  discount = case when o.ref = 'SH-24060' then round(li.sub * 0.10, 2) else 0 end,
  shipping = case when o.vat_no is not null then 0
                  when li.sub > 60 then 0 else 2.50 end
from (select order_id, sum(unit_price * qty) as sub from order_items group by order_id) li
where li.order_id = o.id;
update orders set total = greatest(0, subtotal - discount + shipping);

-- ── Reviews (admin-data.jsx SEED_REVIEWS_QUEUE; mapped to catalog products) ──
-- Status reflects the prototype's moderation: the spam one is 'rejected',
-- the rest 'pending' (they sit in the admin review queue).
insert into reviews (ref, product_id, display_name, stars, body, verified, status, created_at)
select v.ref, p.id, v.display_name, v.stars, v.body, v.verified, v.status, v.created_at
from (values
  ('RV-501', 'P-1016', 'Marta', 5, 'Tieši tik kluss, kā solīts. Diskrēta piegāde uz pakomātu.', true,  'pending',  date '2026-06-02'),
  ('RV-500', 'P-1009', 'A. P.', 4, 'Premium sajūta, bet dārgs. Lietotne dažreiz atvienojas.',    true,  'pending',  date '2026-06-01'),
  ('RV-499', 'P-1001', 'anon',  1, 'spam spam buy followers cheap link',                          false, 'rejected', date '2026-06-01'),
  ('RV-498', 'P-1007', 'Pāris', 5, 'Tālvadība strādā lieliski. Iesakām pāriem!',                  true,  'pending',  date '2026-05-31')
) as v(ref, legacy_id, display_name, stars, body, verified, status, created_at)
join products p on p.legacy_id = v.legacy_id
on conflict (ref) do nothing;

-- ── Returns + threads (admin-data.jsx SEED_RETURNS; abbreviated) ──
insert into returns (ref, order_id, kind, status, reason, item, channel, customer_name, email, refund_amount, created_at) values
  ('RET-1031', (select id from orders where ref='SH-24060'), 'return', 'approved', 'Changed mind', 'Midnight Lace Set', 'web', 'Anna B.', 'anna.b@gmail.com', 34, '2026-05-30')
on conflict (ref) do nothing;

insert into return_messages (return_id, sender, via, author, body, created_at)
select r.id, v.sender, v.via, v.author, v.body, v.created_at
from (values
  ('RET-1031','support','email','Support · Jānis','No problem at all, Anna. Your return is approved — I''ve emailed you a prepaid label. Once it arrives we''ll refund €34 to your original payment method.', timestamptz '2026-05-30 08:30'),
  ('RET-1031','support','note', 'Support · Jānis','Internal: prepaid label DPDLT-2231 generated. Refund queued on receipt.', timestamptz '2026-05-30 08:31')
) as v(return_ref, sender, via, author, body, created_at)
join returns r on r.ref = v.return_ref
on conflict do nothing;

-- ── Audit log (admin-data.jsx SEED_AUDIT) ──
insert into audit_log (actor_label, type, action, target, detail, created_at) values
  ('Owner',          'order',     'Marked paid',     'SH-24085', 'Payment confirmed manually',     '2026-06-02 09:20'),
  ('Fulfilment',     'order',     'Shipped',         'SH-24079', 'Handed to Omniva · OMX240601LV', '2026-06-02 08:12'),
  ('Support',        'review',    'Approved review', 'RV-498',   'Midnight Lace Set · 5★',         '2026-06-01 17:40'),
  ('Content editor', 'content',   'Edited page',     '/care',    'Updated EN translation',         '2026-06-01 16:05'),
  ('Owner',          'catalog',   'Price change',    'P-1009',   '€158 → €148',                    '2026-06-01 11:22'),
  ('Support',        'return',    'Approved return', 'RET-1031', 'Refund €34',                     '2026-05-31 19:50'),
  ('Owner',          'promo',     'Created code',    'QUIET10',  '−10%',                           '2026-05-30 10:30'),
  ('Owner',          'settings',  'Changed setting', 'VAT',      'Rate confirmed 21%',             '2026-05-29 09:00')
on conflict do nothing;
