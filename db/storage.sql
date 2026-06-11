-- ============================================================================
-- Shhh — product photo storage (run once in the Supabase SQL Editor)
--
-- Creates a public storage bucket for product images and the access rules:
-- anyone can VIEW photos (so the storefront can show them), but only
-- signed-in admins can UPLOAD, REPLACE or DELETE them.
--
-- Uploaded files are also recorded as rows in the product_images table
-- (done by the app), which is what the catalog reads.
--
-- Safe to re-run.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "product photos public read"   on storage.objects;
drop policy if exists "product photos admin insert"   on storage.objects;
drop policy if exists "product photos admin update"   on storage.objects;
drop policy if exists "product photos admin delete"   on storage.objects;

create policy "product photos public read" on storage.objects
  for select using (bucket_id = 'product-photos');

create policy "product photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-photos');

create policy "product photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-photos');

create policy "product photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-photos');
