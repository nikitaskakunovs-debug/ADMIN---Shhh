-- ============================================================================
-- Shhh — storefront checkout (run once in the Supabase SQL Editor)
--
-- Lets ANONYMOUS shoppers place orders safely through one controlled
-- database function instead of open table access:
--   * place_order(p): prices every line from the products table (client
--     prices are never trusted), creates/updates the customer by email,
--     writes the order + line items, decrements stock, and returns the
--     order reference. Anyone may call it; it can only do this one thing.
--   * set_order_status(ref, status): lets the storefront's simulated
--     payment flow flip a pending order to paid/cancelled. NOTE: in a real
--     payment setup this transition comes from the payment provider's
--     server webhook, not the browser — replace it when Stripe lands.
--
-- Safe to re-run.
-- ============================================================================

create sequence if not exists shhh_order_ref start 24100;

create or replace function place_order(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ref      text;
  v_customer uuid;
  v_subtotal numeric := 0;
  v_shipping numeric;
  v_total    numeric;
  v_order    uuid;
  v_item     jsonb;
  v_prod     record;
  v_qty      int;
  v_email    text := nullif(trim(coalesce(p->>'email', '')), '');
  v_name     text := nullif(trim(coalesce(p->>'name', '')), '');
  v_market   text := coalesce(nullif(p->>'market', ''), 'LV');
  v_status   text;
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

  -- Price every line from the catalog; unknown ids are ignored except the
  -- free gift ('gift'), which is recorded at €0.
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
  v_total    := v_subtotal + v_shipping;

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
                      subtotal, shipping, discount, total, vat_rate)
  values (v_ref, 'shhh', v_market, v_customer, coalesce(v_name, 'Guest'), v_email, v_status,
          nullif(p->>'payMethod', ''), nullif(p->>'courier', ''), nullif(p->>'locker', ''), 'NL Trading Co',
          v_subtotal, v_shipping, 0, v_total, 0.21)
  returning id into v_order;

  insert into order_items (order_id, product_id, name, unit_price, qty)
  select v_order, product_id, name, unit_price, qty from _lines;

  update products set stock = greatest(0, stock - l.qty)
  from _lines l where products.id = l.product_id;

  return jsonb_build_object('ref', v_ref, 'total', v_total, 'status', v_status);
end
$$;

revoke all on function place_order(jsonb) from public;
grant execute on function place_order(jsonb) to anon, authenticated;

-- Demo payment confirmation/cancellation for the storefront's simulated
-- banklink flow. Only pending orders can change, and only to paid/cancelled.
create or replace function set_order_status(p_ref text, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('paid', 'cancelled') then
    raise exception 'Status not allowed';
  end if;
  update orders set status = p_status where ref = p_ref and status = 'pending';
end
$$;

revoke all on function set_order_status(text, text) from public;
grant execute on function set_order_status(text, text) to anon, authenticated;
