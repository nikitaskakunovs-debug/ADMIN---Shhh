-- ============================================================================
-- Shhh — Row Level Security (run AFTER schema.sql + seed.sql)
--
-- Why this file exists: the site talks to Supabase straight from the
-- browser using the publishable (anon) key. That key is public by design —
-- Row Level Security is what actually protects the data. The rules below:
--
--   1. Enable RLS on EVERY table (with RLS on and no policy, a table is
--      fully locked: anon can neither read nor write it).
--   2. Add read-only policies for the catalog/content tables the public
--      site needs. No table is publicly writable.
--
-- Locked tables (no policy → no public access at all): customers, orders,
-- order_items, refunds, returns, return_messages, reviews, payouts,
-- customer_ledger_entries, gift_cards, admin_users, audit_log, events,
-- campaigns, automations. These become readable only once real admin
-- login (Supabase Auth) is added, via authenticated-role policies.
-- ============================================================================

-- ── 1. Enable RLS everywhere ──
alter table businesses              enable row level security;
alter table markets                 enable row level security;
alter table store_settings          enable row level security;
alter table admin_roles             enable row level security;
alter table role_permissions        enable row level security;
alter table admin_users             enable row level security;
alter table brands                  enable row level security;
alter table categories              enable row level security;
alter table products                enable row level security;
alter table product_images          enable row level security;
alter table customers               enable row level security;
alter table customer_ledger_entries enable row level security;
alter table payouts                 enable row level security;
alter table orders                  enable row level security;
alter table order_items             enable row level security;
alter table refunds                 enable row level security;
alter table returns                 enable row level security;
alter table return_messages         enable row level security;
alter table reviews                 enable row level security;
alter table promos                  enable row level security;
alter table gift_cards              enable row level security;
alter table campaigns               enable row level security;
alter table automations             enable row level security;
alter table cms_pages               enable row level security;
alter table banners                 enable row level security;
alter table faqs                    enable row level security;
alter table locales                 enable row level security;
alter table translations            enable row level security;
alter table audit_log               enable row level security;
alter table events                  enable row level security;

-- ── 2. Public READ-ONLY policies for catalog & content ──
-- (drop+create so this file can be re-run safely)

drop policy if exists "public read" on products;
create policy "public read" on products       for select using (true);
-- NOTE: when the public storefront launches, tighten this to
--   using (status = 'active')
-- and give the logged-in admin a separate authenticated policy.

drop policy if exists "public read" on product_images;
create policy "public read" on product_images for select using (true);

drop policy if exists "public read" on categories;
create policy "public read" on categories     for select using (true);

drop policy if exists "public read" on brands;
create policy "public read" on brands         for select using (true);

drop policy if exists "public read" on promos;
create policy "public read" on promos         for select using (true);

drop policy if exists "public read" on cms_pages;
create policy "public read" on cms_pages      for select using (true);

drop policy if exists "public read" on banners;
create policy "public read" on banners        for select using (true);

drop policy if exists "public read" on faqs;
create policy "public read" on faqs           for select using (true);

drop policy if exists "public read" on locales;
create policy "public read" on locales        for select using (true);

drop policy if exists "public read" on translations;
create policy "public read" on translations   for select using (true);

drop policy if exists "public read" on markets;
create policy "public read" on markets        for select using (true);

drop policy if exists "public read" on businesses;
create policy "public read" on businesses     for select using (true);

drop policy if exists "public read" on store_settings;
create policy "public read" on store_settings for select using (true);

drop policy if exists "public read" on admin_roles;
create policy "public read" on admin_roles    for select using (true);

drop policy if exists "public read" on role_permissions;
create policy "public read" on role_permissions for select using (true);
