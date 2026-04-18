import { createClient } from '@/lib/supabase/server'
import type { Producto } from '@/lib/types'

export type ProductListResult = {
  data: Producto[]
  total: number
}

const PAGE_SIZE = 8

type RawProducto = {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  precio?: number | string
  disponible?: boolean
  stock?: number
  categoria_id?: string
  subcategoria_id?: string | null
  imagen_url?: string | null
  recomendacion_medica?: string | null
  aviso_legal?: boolean
  destacado?: boolean
  activo?: boolean
  created_at?: string
}

function normalizeProducto(raw: RawProducto): Producto {
  const availableFromBoolean = typeof raw.disponible === 'boolean' ? raw.disponible : undefined
  const availableFromStock = typeof raw.stock === 'number' ? raw.stock > 0 : undefined

  return {
    id: String(raw.id),
    nombre: String(raw.nombre ?? ''),
    slug: String(raw.slug ?? ''),
    descripcion: raw.descripcion ?? null,
    precio: Number(raw.precio ?? 0),
    disponible: availableFromBoolean ?? availableFromStock ?? true,
    categoria_id: String(raw.categoria_id ?? ''),
    subcategoria_id: raw.subcategoria_id ?? null,
    imagen_url: raw.imagen_url ?? null,
    recomendacion_medica: raw.recomendacion_medica ?? null,
    aviso_legal: Boolean(raw.aviso_legal),
    destacado: Boolean(raw.destacado),
    activo: typeof raw.activo === 'boolean' ? raw.activo : true,
    created_at: String(raw.created_at ?? new Date().toISOString()),
  }
}

export async function getCategoryProducts(params: {
  categoriaSlug: string
  subcategoriaSlug?: string
  brand?: string
  search?: string
  page?: number
}): Promise<ProductListResult> {
  const supabase = await createClient()
  const page = Math.max(params.page ?? 1, 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('productos')
    .select('*, categorias!inner(slug), subcategorias(slug)', { count: 'exact' })
    .eq('activo', true)
    .eq('categorias.slug', params.categoriaSlug)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (params.subcategoriaSlug) {
    query = query.eq('subcategorias.slug', params.subcategoriaSlug)
  }

  if (params.brand) {
    query = query.ilike('nombre', `%${params.brand.replace('-', ' ')}%`)
  }

  if (params.search) {
    query = query.or(`nombre.ilike.%${params.search}%,descripcion.ilike.%${params.search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    return { data: [], total: 0 }
  }

  return {
    data: (data ?? []).map(normalizeProducto),
    total: count ?? 0,
  }
}

export async function getProductBySlug(slug: string): Promise<Producto | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()

  if (error || !data) return null
  return normalizeProducto(data)
}

export { PAGE_SIZE }
