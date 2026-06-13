-- ============================================================================
-- Shhh — CMS, reviews & returns to the database (run once in the SQL Editor)
--
--   1. cms_overrides — the admin's content edits (pages, banners, strings,
--      SEO) stored as key→data, readable by everyone so VISITORS finally
--      see CMS changes (previously they lived only in the editor's browser).
--   2. Reviews — shoppers submit via submit_review() (always lands as
--      'pending' for moderation; 'verified' is decided SERVER-side by
--      checking the order reference actually exists). The public can read
--      approved reviews only.
--   3. Returns — shoppers open claims via submit_return() (sequential
--      RET- reference, linked to the order when it exists).
--
-- Safe to re-run.
-- ============================================================================

-- ── 1. CMS overrides ──
create table if not exists cms_overrides (
  key        text primary key,          -- 'home', 'faq', '__strings', '__global', …
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table cms_overrides enable row level security;

drop policy if exists "public read" on cms_overrides;
create policy "public read" on cms_overrides for select using (true);

drop policy if exists "admin all" on cms_overrides;
create policy "admin all" on cms_overrides
  for all to authenticated using (true) with check (true);

-- Explicit table grants (Supabase normally adds these by default; explicit
-- keeps the file portable).
grant select on cms_overrides to anon;
grant select, insert, update, delete on cms_overrides to authenticated;

-- ── 2. Reviews ──
drop policy if exists "public read approved" on reviews;
create policy "public read approved" on reviews
  for select to anon using (status = 'approved');

create or replace function submit_review(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prod     uuid;
  v_stars    int := coalesce((p->>'stars')::int, 0);
  v_body     text := trim(coalesce(p->>'body', ''));
  v_name     text := nullif(trim(coalesce(p->>'name', '')), '');
  v_ref      text := upper(regexp_replace(coalesce(p->>'orderRef', ''), '[^A-Z0-9]', '', 'gi'));
  v_verified boolean := false;
begin
  select id into v_prod from products where legacy_id = p->>'product' and status = 'active';
  if v_prod is null then raise exception 'Unknown product'; end if;
  if v_stars < 1 or v_stars > 5 then raise exception 'Stars must be 1–5'; end if;
  if length(v_body) < 3 or length(v_body) > 2000 then raise exception 'Review text length'; end if;

  -- Verified buyer = the quoted order reference really exists (server-checked).
  if v_ref <> '' then
    v_verified := exists (
      select 1 from orders where upper(regexp_replace(ref, '[^A-Z0-9]', '', 'gi')) = v_ref
    );
  end if;

  insert into reviews (product_id, display_name, stars, body, verified, status)
  values (v_prod, coalesce(v_name, 'Anonīms'), v_stars, left(v_body, 2000), v_verified, 'pending');

  return jsonb_build_object('ok', true, 'verified', v_verified);
end
$$;

revoke all on function submit_review(jsonb) from public;
grant execute on function submit_review(jsonb) to anon, authenticated;

-- ── 3. Returns ──
create sequence if not exists shhh_return_ref start 1100;

create or replace function submit_return(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ref    text;
  v_order  uuid;
  v_kind   text := case when p->>'kind' = 'warranty' then 'warranty' else 'return' end;
  v_reason text := left(trim(coalesce(p->>'reason', '')), 200);
  v_desc   text := left(trim(coalesce(p->>'desc', '')), 4000);
begin
  if v_reason = '' and v_desc = '' then raise exception 'Empty claim'; end if;

  select id into v_order from orders where ref = upper(trim(coalesce(p->>'orderRef', '')));

  v_ref := case when v_kind = 'warranty' then 'WAR-' else 'RET-' end || nextval('shhh_return_ref');

  insert into returns (ref, order_id, kind, status, reason, item, channel,
                       customer_name, email, refund_amount, intake)
  values (v_ref, v_order, v_kind, 'open', v_reason,
          nullif(left(trim(coalesce(p->>'item', '')), 200), ''), 'web',
          nullif(left(trim(coalesce(p->>'name', '')), 120), ''),
          nullif(left(trim(coalesce(p->>'email', '')), 200), ''),
          0,
          jsonb_build_object(
            'submittedAt', to_char(now(), 'YYYY-MM-DD HH24:MI'),
            'comment', v_desc,
            'fields', jsonb_build_array(
              jsonb_build_array('Order number', coalesce(p->>'orderRef', '—')),
              jsonb_build_array('Type', v_kind),
              jsonb_build_array('Reason', v_reason)
            ),
            'photos', coalesce(p->'photos', '[]'::jsonb)
          ));

  return jsonb_build_object('ref', v_ref);
end
$$;

revoke all on function submit_return(jsonb) from public;
grant execute on function submit_return(jsonb) to anon, authenticated;
