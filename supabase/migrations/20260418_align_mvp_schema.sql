-- PET CENTER MVP schema alignment
-- Date: 2026-04-18
-- Goal: remove obsolete recipe/proof fields and enforce disponibilidad flow.

begin;

-- 1) Ensure subcategorias exists (needed by productos FK)
create table if not exists public.subcategorias (
  id uuid not null default gen_random_uuid(),
  categoria_id uuid not null,
  nombre text not null,
  slug text not null,
  created_at timestamp with time zone not null default now(),
  constraint subcategorias_pkey primary key (id),
  constraint subcategorias_categoria_id_fkey
    foreign key (categoria_id) references public.categorias (id) on delete cascade
) tablespace pg_default;

create unique index if not exists idx_subcategorias_slug on public.subcategorias using btree (slug);

-- 2) Productos: add disponible and remove receta flag
alter table public.productos
  add column if not exists disponible boolean not null default true;

-- Backfill from stock where available
update public.productos
set disponible = (coalesce(stock, 0) > 0)
where disponible is distinct from (coalesce(stock, 0) > 0);

alter table public.productos
  drop column if exists requiere_receta;

-- Keep stock only if you still need internal inventory counts.
-- If not needed anymore, uncomment the next line:
-- alter table public.productos drop column if exists stock;

-- 3) Pedidos: remove old upload fields
alter table public.pedidos
  drop column if exists comprobante_url,
  drop column if exists receta_url;

-- 4) Tighten nullability for relational consistency
alter table public.pedido_items
  alter column pedido_id set not null,
  alter column producto_id set not null;

-- 5) Helpful indexes
create index if not exists idx_productos_categoria_id on public.productos using btree (categoria_id);
create index if not exists idx_productos_subcategoria_id on public.productos using btree (subcategoria_id);
create index if not exists idx_productos_activo on public.productos using btree (activo);
create index if not exists idx_productos_disponible on public.productos using btree (disponible);
create index if not exists idx_pedidos_created_at on public.pedidos using btree (created_at desc);

commit;
