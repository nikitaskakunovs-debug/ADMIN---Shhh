-- ============================================================================
-- Shhh — database schema (PostgreSQL / Supabase-compatible)
--
-- Derived 1:1 from the prototype's hardcoded data:
--   shop-data.jsx    → stores, categories, products
--   shop-brands.jsx  → brands
--   shop-promo.jsx   → promos, campaigns
--   shop-content.jsx → cms_pages, banners, faqs
--   shop-i18n.jsx    → locales, translations
--   admin-data.jsx   → admin users/roles, businesses, markets, orders,
--                      order_items, refunds, payouts, returns (+ messages),
--                      reviews, customers, customer ledger, automations,
--                      audit log
--
-- Conventions:
--   * Money is numeric(10,2), always in EUR (the prototype stores order
--     totals in EUR base and converts for display — keep that).
--   * Order totals are GROSS (VAT-inclusive), matching the prototype.
--   * Human-readable IDs from the prototype (SH-24087, RET-1042, PR-01…)
--     are kept as UNIQUE business references; primary keys are uuids.
--   * "status" fields use CHECK constraints mirroring the prototype's
--     exact value sets so the UI code maps over without translation.
-- ============================================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ─────────────────────────────────────────────────────────────
-- Scope model: businesses × markets  (admin-data.jsx BUSINESSES/MARKETS)
-- One console runs several brands (businesses), each selling into
-- several markets. A "store" is a business × market pair.
-- ─────────────────────────────────────────────────────────────

create table businesses (
  id          text primary key,            -- 'shhh', 'lumen'
  name        text not null,
  tag         text,                        -- 'Intimacy & wellness'
  short       text,                        -- 'S'
  planned     boolean not null default false
);

create table markets (
  id          text primary key,            -- ISO country: 'LV', 'LT', 'EE', 'FI', 'PL'
  country     text not null,
  currency    text not null,               -- 'EUR', 'PLN'
  symbol      text not null,
  fx          numeric(10,4) not null default 1,  -- units of local currency per 1 EUR (display only)
  locale      text not null,               -- 'lv-LV'
  vat_rate    numeric(5,4) not null,       -- 0.21, 0.255 …
  lang        text,
  entity      text,                        -- legal entity invoicing this market
  status      text not null default 'planned' check (status in ('live','planned'))
);

-- Storefront identity (shop-data.jsx `store`). One row per business.
create table store_settings (
  business_id   text primary key references businesses(id),
  name          text not null,
  tagline       text,
  base_currency text not null default 'EUR',
  default_locale text not null default 'en',
  domain        text,
  support_email text,
  home_country  text references markets(id)
);

-- ─────────────────────────────────────────────────────────────
-- Admin users & roles  (admin-data.jsx ADMIN_ROLES / ROLE_NAV)
-- In the prototype "login" is a role picker; here it becomes real
-- accounts. Passwords are handled by the auth provider (e.g. Supabase
-- Auth) — this table stores the profile + role, not credentials.
-- ─────────────────────────────────────────────────────────────

create table admin_roles (
  id          text primary key,            -- 'owner', 'manager', 'sales', …
  label       text not null,
  short       text,
  description text
);

-- Which nav sections each role can open (ROLE_NAV).
create table role_permissions (
  role_id     text not null references admin_roles(id) on delete cascade,
  section     text not null,               -- 'dashboard', 'orders', 'finances', …
  primary key (role_id, section)
);

create table admin_users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text not null,
  role_id     text not null references admin_roles(id),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Catalog  (shop-data.jsx, shop-brands.jsx, products/*.png)
-- ─────────────────────────────────────────────────────────────

create table brands (
  id          text primary key,            -- 'maison-nuit', 'silk-route', …
  name        text not null,
  country     text,                        -- 'FR', 'IT'
  kind        text,                        -- 'In-house label' | 'Partner brand' | 'Consignment'
  margin      text check (margin in ('high','medium','low')),
  blurb       text,
  featured    boolean not null default false  -- admin "brandFeatured" flag
);

create table categories (
  id          text primary key,            -- 'bras', 'briefs', 'sets', …
  name        text not null,
  position    int not null default 0       -- display order
);

create table products (
  id          uuid primary key default gen_random_uuid(),
  legacy_id   text unique,                 -- prototype ids: 'P-1001', 'glow', 'hush-01'
  sku         text not null unique,        -- 'SH-BRA-001'
  name        text not null,
  brand_id    text references brands(id),
  category_id text references categories(id),
  price       numeric(10,2) not null,      -- current selling price (EUR, gross)
  compare_at  numeric(10,2),               -- crossed-out price, null = none
  cost        numeric(10,2),               -- unit cost (margin reporting)
  stock       int not null default 0,
  status      text not null default 'draft' check (status in ('active','draft','archived')),
  color       text,                        -- swatch hex, '#E8C9D8'
  sizes       text[] not null default '{}',-- {'XS','S','M','L','XL'}
  created_at  timestamptz not null default now()
);
-- NOTE: product.rating in the prototype is a stored number; in production
-- compute it from approved reviews instead (avg(stars) where status='approved').

create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,               -- replaces products/*.png static files
  alt         text,
  position    int not null default 0
);

-- ─────────────────────────────────────────────────────────────
-- Customers & CRM  (admin-data.jsx CUSTOMER_PROFILES / CUSTOMER_LEDGER / crm)
-- Discretion model: customers shop under an alias; full names live on
-- the order while active. ltv / balance / order counts are DERIVED from
-- orders + ledger at query time — do not store them.
-- ─────────────────────────────────────────────────────────────

create table customers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  alias       text,                        -- public-facing short name 'M. M.'
  name        text,                        -- full name (purged per retention policy)
  city        text,
  market_id   text references markets(id),
  marketing_opt_in boolean not null default false,
  tags        text[] not null default '{}',-- {'vip','repeat','refund-risk'}
  note        text,                        -- CRM free-text note
  erased      boolean not null default false, -- GDPR erasure flag
  created_at  timestamptz not null default now()  -- "since"
);

-- Manual account adjustments (CUSTOMER_LEDGER): credit notes, overpayments.
-- Signed EUR: positive = customer owes us, negative = we owe the customer.
create table customer_ledger_entries (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  amount      numeric(10,2) not null,
  reason      text,
  created_by  uuid references admin_users(id),
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Payouts  (admin-data.jsx SEED_PAYOUTS)
-- Settlement batches from the payment provider. The prototype links
-- order → payout by date; here it's an explicit foreign key on orders.
-- ─────────────────────────────────────────────────────────────

create table payouts (
  id          uuid primary key default gen_random_uuid(),
  ref         text not null unique,        -- 'PO-2061'
  payout_date date not null,
  gross       numeric(10,2) not null,
  fees        numeric(10,2) not null,
  net         numeric(10,2) not null,
  status      text not null default 'scheduled' check (status in ('scheduled','paid')),
  method      text                         -- 'Citadele settlement'
);

-- ─────────────────────────────────────────────────────────────
-- Orders  (admin-data.jsx SEED_ORDERS / _mkOrder / orderFinance)
-- ─────────────────────────────────────────────────────────────

create table orders (
  id            uuid primary key default gen_random_uuid(),
  ref           text not null unique,      -- 'SH-24087' (also drives invoice no 'INV-24087')
  business_id   text not null references businesses(id),
  market_id     text not null references markets(id),
  customer_id   uuid references customers(id),
  -- snapshots kept on the order even if the customer record changes/is erased:
  alias         text,
  email         text,
  status        text not null default 'pending'
                check (status in ('pending','paid','shipped','delivered','refunded','cancelled')),
  -- payment
  pay_method    text,                      -- 'card','apple','swedbank','transfer', …
  pay_failed    boolean not null default false,
  pay_fail_reason text,                    -- 'Card declined (insufficient funds)'
  txn_id        text,                      -- payment provider transaction id
  payout_id     uuid references payouts(id),
  -- delivery
  courier       text,                      -- 'omniva','dpd','venipak','itella', …
  locker        text,                      -- pickup point label 'Origo, Rīga'
  sender        text,                      -- shipping sender entity
  tracking      text,
  -- B2B / VAT (EU intra-Community reverse charge support)
  company       text,
  vat_no        text,                      -- 'DE312345678'; prefix ≠ 'LV' ⇒ reverse charge
  vies_valid       boolean,                -- VIES validation snapshot (admin-vies.jsx)
  vies_checked_at  timestamptz,
  vies_consult     text,                   -- VIES consultation number
  vies_name        text,
  vies_address     text,
  -- money (EUR, gross / VAT-inclusive; line detail in order_items)
  subtotal      numeric(10,2) not null default 0,
  shipping      numeric(10,2) not null default 0,
  discount      numeric(10,2) not null default 0,
  total         numeric(10,2) not null default 0,
  vat_rate      numeric(5,4),              -- rate applied at purchase time (0 if reverse charge)
  promo_code    text,                      -- code used, if any
  created_at    timestamptz not null default now()
);
create index orders_status_idx   on orders(status);
create index orders_market_idx   on orders(market_id);
create index orders_customer_idx on orders(customer_id);
create index orders_created_idx  on orders(created_at desc);

-- Line items: price and name are SNAPSHOTS at purchase time, deliberately
-- denormalised so later catalog edits never rewrite past orders.
create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id),
  name        text not null,
  unit_price  numeric(10,2) not null,
  qty         int not null check (qty > 0)
);
create index order_items_order_idx on order_items(order_id);

-- Partial/full refunds against an order (prototype: o.refunds[]).
create table refunds (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  amount      numeric(10,2) not null check (amount > 0),
  reason      text,
  created_by  uuid references admin_users(id),
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Returns & warranty claims  (admin-data.jsx SEED_RETURNS)
-- A case with an intake form and a support conversation thread.
-- ─────────────────────────────────────────────────────────────

create table returns (
  id            uuid primary key default gen_random_uuid(),
  ref           text not null unique,      -- 'RET-1042'
  order_id      uuid references orders(id),
  kind          text not null check (kind in ('return','warranty')),
  status        text not null default 'open' check (status in ('open','approved','closed')),
  reason        text,
  item          text,                      -- product name as reported
  channel       text,                      -- 'web' | 'email'
  customer_name text,
  email         text,
  refund_amount numeric(10,2) not null default 0,
  -- intake form snapshot: [['Order number','SH-24041'], …], comment, photos
  intake        jsonb,
  created_at    timestamptz not null default now()
);

create table return_messages (
  id          uuid primary key default gen_random_uuid(),
  return_id   uuid not null references returns(id) on delete cascade,
  sender      text not null check (sender in ('customer','support')),
  via         text not null check (via in ('email','web','note')), -- 'note' = internal
  author      text,                        -- 'Support · Līga'
  body        text not null,
  images      jsonb not null default '[]', -- [{url, name}]
  delivery_status text,                    -- e.g. 'failed' for bounced emails
  created_at  timestamptz not null default now()
);
create index return_messages_return_idx on return_messages(return_id);

-- ─────────────────────────────────────────────────────────────
-- Reviews  (admin-data.jsx SEED_REVIEWS_QUEUE)
-- The admin "queue" = rows where status = 'pending'.
-- ─────────────────────────────────────────────────────────────

create table reviews (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique,                 -- 'RV-501'
  product_id  uuid references products(id) on delete cascade,
  customer_id uuid references customers(id),
  display_name text,                       -- 'Marta', 'anon'
  stars       int not null check (stars between 1 and 5),
  body        text,
  verified    boolean not null default false, -- verified purchase
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at  timestamptz not null default now()
);
create index reviews_product_idx on reviews(product_id);

-- ─────────────────────────────────────────────────────────────
-- Promotions & gift cards  (shop-promo.jsx, admin promos/cards state)
-- ─────────────────────────────────────────────────────────────

create table promos (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique,                 -- 'PR-01'
  code        text not null unique,        -- 'QUIET10'
  type        text not null check (type in ('percent','fixed','shipping')),
  value       numeric(10,2) not null default 0, -- 10 (%), 5 (€), 0 for shipping
  status      text not null default 'scheduled'
              check (status in ('active','scheduled','paused','expired')),
  starts_on   date,
  ends_on     date,                        -- null = no end date
  usage_limit int,                         -- null = unlimited
  used_count  int not null default 0,      -- maintained on redemption
  applies_to  text,                        -- 'Entire order', 'Sleepwear', 'Orders over €80'
  note        text
);

create table gift_cards (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  initial_value numeric(10,2) not null,
  balance     numeric(10,2) not null,
  status      text not null default 'active' check (status in ('active','disabled','spent')),
  customer_id uuid references customers(id),
  expires_on  date,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Marketing  (shop-promo.jsx campaigns + admin-data.jsx SEED_CAMPAIGNS /
-- SEED_AUTOMATIONS). One campaigns table covers both prototype lists;
-- performance numbers are written back by the email/ads integration.
-- ─────────────────────────────────────────────────────────────

create table campaigns (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique,                 -- 'CMP-1' / 'cm-summer'
  name        text not null,
  channel     text,                        -- 'Email', 'Instagram', 'Meta Ads'
  status      text not null default 'draft'
              check (status in ('draft','scheduled','running','active','finished','done')),
  starts_on   date,
  spend       numeric(10,2) not null default 0,
  revenue     numeric(10,2) not null default 0,
  sent        int not null default 0,
  open_rate   numeric(5,2) not null default 0,  -- %
  click_rate  numeric(5,2) not null default 0   -- %
);

create table automations (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique,                 -- 'au-cart'
  name        text not null,               -- 'Abandoned checkout'
  description text,
  enabled     boolean not null default false
);
-- NOTE: automation stats (reach/sessions/orders/conv/sales) in the prototype
-- are hardcoded; in production derive them from events + orders.

-- ─────────────────────────────────────────────────────────────
-- CMS  (shop-content.jsx)
-- ─────────────────────────────────────────────────────────────

create table cms_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,        -- '/', '/about', '/size-guide'
  title       text not null,
  body        text,
  status      text not null default 'draft' check (status in ('published','draft','scheduled')),
  author_id   uuid references admin_users(id),
  updated_at  timestamptz not null default now()
);

create table banners (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  message     text not null,
  placement   text,                        -- 'Top bar — all pages'
  active      boolean not null default false
);

create table faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  position    int not null default 0
);

-- ─────────────────────────────────────────────────────────────
-- Localisation  (shop-i18n.jsx)
-- ─────────────────────────────────────────────────────────────

create table locales (
  code        text primary key,            -- 'en', 'lv', 'ru', 'de'
  name        text not null,
  flag        text,
  enabled     boolean not null default false
);
-- NOTE: "coverage" % is derived: translated keys / total keys for the locale.

create table translations (
  locale      text not null references locales(code) on delete cascade,
  key         text not null,               -- 'cart.title'
  value       text not null,
  primary key (locale, key)
);

-- ─────────────────────────────────────────────────────────────
-- Audit log  (admin-data.jsx SEED_AUDIT) — append-only.
-- ─────────────────────────────────────────────────────────────

create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references admin_users(id),
  actor_label text,                        -- denormalised display name, survives user deletion
  type        text not null check (type in
              ('order','catalog','inventory','customer','promo','review',
               'return','content','brand','settings','finance')),
  action      text not null,               -- 'Marked paid', 'Stock adjust'
  target      text,                        -- 'SH-24085', 'glow', 'SUMMER20'
  detail      text,                        -- '€199 → €189'
  created_at  timestamptz not null default now()
);
create index audit_log_created_idx on audit_log(created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Analytics events (NEW — no prototype equivalent)
-- The dashboard's revenue chart, channels, cities and conversion funnel
-- (REVENUE_THIS, SALES_CHANNELS, SALES_BY_CITY, CONVERSION_FUNNEL) are
-- hardcoded in the prototype. Revenue/cities come straight from orders;
-- the funnel and channel split need raw events like these:
-- ─────────────────────────────────────────────────────────────

create table events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  type        text not null check (type in
              ('visit','view_product','add_to_cart','begin_checkout','purchase')),
  product_id  uuid references products(id),
  order_id    uuid references orders(id),
  channel     text,                        -- 'direct','organic','email','referral'
  market_id   text references markets(id),
  created_at  timestamptz not null default now()
);
create index events_type_created_idx on events(type, created_at);
