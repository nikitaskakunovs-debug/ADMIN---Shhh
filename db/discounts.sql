-- ============================================================================
-- Shhh — server-side discounts & gift cards (run once in the SQL Editor)
--
-- Fixes the correctness gap where the checkout SHOWED a discount but the
-- recorded order ignored it. After this:
--   * place_order validates the promo code and gift card against the
--     database and computes the discount SERVER-side (clients can't forge
--     totals), records promo_code / gift card usage on the order, bumps the
--     promo's used counter and decrements the gift card balance.
--   * check_gift_card(code) lets the storefront validate a card + show its
--     balance without exposing the gift_cards table publicly.
--   * Demo gift cards are seeded so the flow is testable end to end.
--
-- Safe to re-run.
-- ============================================================================

-- ── Orders carry the gift-card settlement ──
alter table orders add column if not exists gift_card_code text;
alter table orders add column if not exists gift_card_amount numeric(10,2) not null default 0;

-- ── Demo gift cards (same codes as the storefront's old built-ins) ──
insert into gift_cards (code, initial_value, balance, status) values
  ('SHHH-GIFT-50',  50,  50,    'active'),
  ('SHHH-GIFT-100', 100, 72.50, 'active'),
  ('SHHH-LOVE-25',  25,  25,    'active')
on conflict (code) do nothing;

-- ── The storefront's marketing codes, now DB-managed ──
insert into promos (code, type, value, status, note) values
  ('SUMMER20',  'percent',  20, 'active', 'Vasaras atlaide −20%'),
  ('WELCOME10', 'percent',  10, 'active', 'Pirmā pirkuma atlaide −10%'),
  ('AGAIN15',   'percent',  15, 'active', 'Atkārtota pirkuma atlaide −15%'),
  ('MINUS10',   'fixed',    10, 'active', 'Atlaide −€10')
on conflict (code) do nothing;

-- ── Storefront gift-card check (balance lookup by exact code) ──
create or replace function check_gift_card(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_card record;
begin
  select code, balance, initial_value, status into v_card
  from gift_cards where code = upper(trim(coalesce(p_code, '')));
  if v_card is null then return jsonb_build_object('ok', false, 'error', 'unknown'); end if;
  if v_card.status <> 'active' or v_card.balance <= 0 then
    return jsonb_build_object('ok', false, 'error', 'empty');
  end if;
  return jsonb_build_object('ok', true, 'code', v_card.code,
                            'balance', v_card.balance, 'initial', v_card.initial_value);
end
$$;
revoke all on function check_gift_card(text) from public;
grant execute on function check_gift_card(text) to anon, authenticated;

-- ── place_order, now discount- and gift-card-aware ──
create or replace function place_order(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ref       text;
  v_customer  uuid;
  v_subtotal  numeric := 0;
  v_shipping  numeric;
  v_discount  numeric := 0;
  v_total     numeric;
  v_order     uuid;
  v_item      jsonb;
  v_prod      record;
  v_qty       int;
  v_email     text := nullif(trim(coalesce(p->>'email', '')), '');
  v_name      text := nullif(trim(coalesce(p->>'name', '')), '');
  v_market    text := coalesce(nullif(p->>'market', ''), 'LV');
  v_status    text;
  v_promo     record;
  v_promo_code text := upper(trim(coalesce(p->>'promo', '')));
  v_gift      record;
  v_gift_code text := upper(trim(coalesce(p->>'giftCard', '')));
  v_gift_amt  numeric := 0;
begin
  if p->'items' is null or jsonb_typeof(p->'items') <> 'array'
     or jsonb_array_length(p->'items') = 0 then
    raise exception 'No items';
  end if;
  if jsonb_array_length(p->'items') > 50 then
    raise exception 'Too many items';
  end if;
  if not exists (select 1 from markets where id = v_market) then
    v_market := 'LV';
  end if;

  create temp table _lines(product_id uuid, name text, unit_price numeric, qty int) on commit drop;
  for v_item in select * from jsonb_array_elements(p->'items') loop
    v_qty := greatest(1, least(99, coalesce((v_item->>'qty')::int, 1)));
    select id, name, price into v_prod
    from products where legacy_id = v_item->>'id' and status = 'active';
    if found then
      insert into _lines values (v_prod.id, v_prod.name, v_prod.price, v_qty);
      v_subtotal := v_subtotal + v_prod.price * v_qty;
    elsif v_item->>'id' = 'gift' then
      insert into _lines values (null, coalesce(v_item->>'name', 'Dāvana'), 0, 1);
    end if;
  end loop;
  if not exists (select 1 from _lines) then
    raise exception 'No valid items';
  end if;

  v_shipping := case when v_subtotal > 60 then 0 else 2.50 end;

  -- Promo: validated against the promos table, never the client's numbers.
  if v_promo_code <> '' then
    select * into v_promo from promos
    where code = v_promo_code and status = 'active'
      and (starts_on is null or starts_on <= current_date)
      and (ends_on   is null or ends_on   >= current_date)
      and (usage_limit is null or used_count < usage_limit);
    if v_promo is null then
      v_promo_code := null; -- silently ignore an invalid code; order still goes through
    else
      if v_promo.type = 'percent' then
        v_discount := round(v_subtotal * v_promo.value / 100, 2);
      elsif v_promo.type = 'fixed' then
        v_discount := least(v_promo.value, v_subtotal);
      elsif v_promo.type = 'shipping' then
        v_shipping := 0;
      end if;
      update promos set used_count = used_count + 1 where id = v_promo.id;
    end if;
  else
    v_promo_code := null;
  end if;

  v_total := greatest(0, v_subtotal - v_discount + v_shipping);

  -- Gift card: cover up to the remaining total, decrement the balance.
  if v_gift_code <> '' then
    select * into v_gift from gift_cards
    where code = v_gift_code and status = 'active' and balance > 0
    for update;
    -- NB: "record is not null" would be false here (nullable columns), use FOUND
    if found then
      v_gift_amt := least(v_gift.balance, v_total);
      update gift_cards
        set balance = balance - v_gift_amt,
            status  = case when balance - v_gift_amt <= 0 then 'spent' else status end
        where id = v_gift.id;
      v_total := v_total - v_gift_amt;
    else
      v_gift_code := null;
    end if;
  else
    v_gift_code := null;
  end if;

  if v_email is not null then
    insert into customers (email, alias, name, market_id)
    values (v_email, coalesce(v_name, split_part(v_email, '@', 1)), v_name, v_market)
    on conflict (email) do update
      set name  = coalesce(excluded.name, customers.name),
          alias = coalesce(customers.alias, excluded.alias)
    returning id into v_customer;
  end if;

  v_ref    := 'SH-' || nextval('shhh_order_ref');
  v_status := case when coalesce((p->>'paid')::boolean, false) then 'paid' else 'pending' end;

  insert into orders (ref, business_id, market_id, customer_id, alias, email, status,
                      pay_method, courier, locker, sender,
                      subtotal, shipping, discount, total, vat_rate,
                      promo_code, gift_card_code, gift_card_amount)
  values (v_ref, 'shhh', v_market, v_customer, coalesce(v_name, 'Guest'), v_email, v_status,
          nullif(p->>'payMethod', ''), nullif(p->>'courier', ''), nullif(p->>'locker', ''), 'NL Trading Co',
          v_subtotal, v_shipping, v_discount, v_total, 0.21,
          v_promo_code, v_gift_code, v_gift_amt)
  returning id into v_order;

  insert into order_items (order_id, product_id, name, unit_price, qty)
  select v_order, product_id, name, unit_price, qty from _lines;

  update products set stock = greatest(0, stock - l.qty)
  from _lines l where products.id = l.product_id;

  return jsonb_build_object('ref', v_ref, 'total', v_total, 'status', v_status,
                            'discount', v_discount, 'giftApplied', v_gift_amt);
end
$$;

revoke all on function place_order(jsonb) from public;
grant execute on function place_order(jsonb) to anon, authenticated;
