-- ============================================================================
-- Shhh — admin write access (run AFTER security.sql)
--
-- Gives signed-in users (Supabase Auth "authenticated" role) full
-- read/write access to every table, while the public anon key stays
-- read-only on catalog/content and locked out of everything else.
--
-- This is the simplest safe model for a single-owner store: anyone who can
-- log in is staff. When you add more staff with different roles later,
-- replace these with per-role policies (matching admin_roles /
-- role_permissions, e.g. accountants can't edit the catalog).
--
-- Safe to re-run (drop + create).
-- ============================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'businesses','markets','store_settings','admin_roles','role_permissions',
    'admin_users','brands','categories','products','product_images',
    'customers','customer_ledger_entries','payouts','orders','order_items',
    'refunds','returns','return_messages','reviews','promos','gift_cards',
    'campaigns','automations','cms_pages','banners','faqs','locales',
    'translations','audit_log','events'
  ] loop
    execute format('drop policy if exists "admin all" on %I', t);
    execute format(
      'create policy "admin all" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
