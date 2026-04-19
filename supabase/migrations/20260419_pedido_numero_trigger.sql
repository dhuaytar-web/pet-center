-- PET CENTER: numero de pedido PET-YYYY-NNN
-- Date: 2026-04-19

begin;

create or replace function public.generar_numero_pedido()
returns trigger as $$
declare
  anio text := to_char(now(), 'YYYY');
  seq int;
begin
  if new.numero_pedido is not null and new.numero_pedido <> '' then
    return new;
  end if;

  select coalesce(max(substring(numero_pedido from 'PET-\d{4}-(\d+)$')::int), 0) + 1
    into seq
  from public.pedidos
  where numero_pedido like ('PET-' || anio || '-%');

  new.numero_pedido := 'PET-' || anio || '-' || lpad(seq::text, 3, '0');
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_numero_pedido on public.pedidos;

create trigger trigger_numero_pedido
before insert on public.pedidos
for each row
execute function public.generar_numero_pedido();

commit;
