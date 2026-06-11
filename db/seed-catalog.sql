-- ============================================================================
-- Shhh — real storefront catalog (run once in the Supabase SQL Editor)
--
-- Loads the ACTUAL products the storefront sells (from shop-data.jsx) into
-- the database, so the shop and the admin manage one shared catalog:
--   * 5 brands, 5 categories, 8 products (ids match the demo orders:
--     hush-01, glow, halo, echo, velvet, murmur, drift, ripple)
--   * photo links for the three products that ship with images
--   * the earlier lingerie placeholder products are demoted to 'draft'
--     (hidden from the storefront, still visible in the admin)
--   * the public read rule on products is tightened: anonymous visitors
--     see only 'active' products; signed-in admins still see everything
--
-- Safe to re-run.
-- ============================================================================

-- ── Brands ──
insert into brands (id, name, kind) values
  ('satisfyer', 'Satisfyer', 'Partner brand'),
  ('we-vibe',   'We-Vibe',   'Partner brand'),
  ('womanizer', 'Womanizer', 'Partner brand'),
  ('lelo',      'LELO',      'Partner brand'),
  ('lovense',   'Lovense',   'Partner brand')
on conflict (id) do nothing;

-- ── Categories (storefront chips; 'all' is virtual, not stored) ──
insert into categories (id, name, position) values
  ('solo',      'Solo',      10),
  ('couples',   'Couples',   11),
  ('beginners', 'Beginners', 12),
  ('premium',   'Premium',   13),
  ('travel',    'Travel',    14)
on conflict (id) do nothing;

-- ── Products ──
insert into products (legacy_id, sku, name, brand_id, category_id, price, compare_at, stock, status, color, sizes) values
  ('hush-01', '23108133021', 'Satisfyer Pro 2',              'satisfyer', 'solo',      69,  null, 7,  'active', '#E2BFA8', '{9 cm}'),
  ('ripple',  '23108133045', 'Satisfyer Wand-er Woman',      'satisfyer', 'solo',      129, null, 3,  'active', '#7E2E2E', '{18 cm,21 cm,24 cm}'),
  ('velvet',  '23108133067', 'We-Vibe Sync 2',               'we-vibe',   'couples',   89,  119,  12, 'active', '#D2A18A', '{12 cm}'),
  ('echo',    '23108133089', 'Womanizer Starlet 3',          'womanizer', 'beginners', 49,  null, 9,  'active', '#EAC4AA', '{11 cm}'),
  ('glow',    '23108133102', 'LELO Gigi 3',                  'lelo',      'premium',   189, 229,  2,  'active', '#3A3633', '{18 cm,20 cm}'),
  ('murmur',  '23108133124', 'Satisfyer Ultra Power Bullet', 'satisfyer', 'solo',      39,  null, 14, 'active', '#D2A18A', '{8 cm}'),
  ('drift',   '23108133146', 'Lovense Ferri',                'lovense',   'travel',    59,  null, 4,  'active', '#A88572', '{13 cm}'),
  ('halo',    '23108133168', 'We-Vibe Pivot',                'we-vibe',   'couples',   34,  null, 6,  'active', '#7E2E2E', '{S,M,L}')
on conflict (sku) do nothing;

-- ── Photos shipped with the site (relative to the site root) ──
insert into product_images (product_id, url, alt, position)
select p.id, v.url, p.name, 0
from (values
  ('hush-01', 'products/hush-01.png'),
  ('glow',    'products/glow.png'),
  ('halo',    'products/halo.png')
) as v(legacy_id, url)
join products p on p.legacy_id = v.legacy_id
where not exists (select 1 from product_images i where i.product_id = p.id and i.url = v.url);

-- ── Demote the lingerie placeholder catalog to drafts ──
update products set status = 'draft'
where legacy_id like 'P-10%' and status = 'active';

-- ── Storefront visitors see only active products ──
drop policy if exists "public read" on products;
drop policy if exists "public read active" on products;
create policy "public read active" on products
  for select to anon using (status = 'active');
-- (signed-in admins keep full visibility via the "admin all" policy)
