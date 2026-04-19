import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Producto } from '@/lib/types'

export type ProductListResult = {
  data: Producto[]
  total: number
}

const PAGE_SIZE = 8

export type CatalogSort = 'destacados' | 'precio-menor' | 'precio-mayor' | 'mas-vendidos'

const DEFAULT_CATALOG_SORT: CatalogSort = 'destacados'

type FallbackProduct = Producto & {
  categoriaSlug: 'farmacia' | 'nutricion' | 'accesorios'
  brand?: string
  salesCount?: number
}

const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: 'demo-farmacia-1',
    nombre: 'Antipulgas Spot On 4 kg a 10 kg',
    slug: 'antipulgas-spot-on-4kg-10kg',
    descripcion: 'Proteccion mensual practica para perros pequeños y medianos.',
    precio: 49.9,
    disponible: true,
    categoria_id: 'farmacia',
    subcategoria_id: 'antipulgas',
    imagen_url: null,
    recomendacion_medica: 'Aplicar segun el peso indicado por el fabricante.',
    aviso_legal: true,
    destacado: true,
    activo: true,
    created_at: '2026-04-18T00:00:00.000Z',
    categoriaSlug: 'farmacia',
    salesCount: 22,
  },
  {
    id: 'demo-farmacia-2',
    nombre: 'Shampoo Dermatologico Canino',
    slug: 'shampoo-dermatologico-canino',
    descripcion: 'Limpieza suave para piel sensible y mantos delicados.',
    precio: 38,
    disponible: true,
    categoria_id: 'farmacia',
    subcategoria_id: 'cuidado-piel',
    imagen_url: null,
    recomendacion_medica: 'Ideal para rutinas de higiene con recomendacion veterinaria.',
    aviso_legal: false,
    destacado: true,
    activo: true,
    created_at: '2026-04-17T00:00:00.000Z',
    categoriaSlug: 'farmacia',
    salesCount: 15,
  },
  {
    id: 'demo-farmacia-3',
    nombre: 'Vitaminas para perros adultos',
    slug: 'vitaminas-perros-adultos',
    descripcion: 'Apoyo nutricional diario para energia y bienestar general.',
    precio: 32,
    disponible: true,
    categoria_id: 'farmacia',
    subcategoria_id: 'vitaminas',
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: false,
    activo: true,
    created_at: '2026-04-16T00:00:00.000Z',
    categoriaSlug: 'farmacia',
    salesCount: 10,
  },
  {
    id: 'demo-nutricion-1',
    nombre: 'ProPlan Adulto Raza Mediana',
    slug: 'proplan-adulto-raza-mediana',
    descripcion: 'Alimento balanceado para perros adultos con alta digestibilidad.',
    precio: 129,
    disponible: true,
    categoria_id: 'nutricion',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: true,
    activo: true,
    created_at: '2026-04-15T00:00:00.000Z',
    categoriaSlug: 'nutricion',
    brand: 'proplan',
    salesCount: 35,
  },
  {
    id: 'demo-nutricion-2',
    nombre: 'Royal Canin Puppy Medium',
    slug: 'royal-canin-puppy-medium',
    descripcion: 'Crecimiento saludable para cachorros de talla mediana.',
    precio: 145,
    disponible: true,
    categoria_id: 'nutricion',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: true,
    activo: true,
    created_at: '2026-04-14T00:00:00.000Z',
    categoriaSlug: 'nutricion',
    brand: 'royal canin',
    salesCount: 31,
  },
  {
    id: 'demo-nutricion-3',
    nombre: 'Hills Sensitive Stomach',
    slug: 'hills-sensitive-stomach',
    descripcion: 'Formula pensada para perros con digestion sensible.',
    precio: 158,
    disponible: true,
    categoria_id: 'nutricion',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: false,
    activo: true,
    created_at: '2026-04-13T00:00:00.000Z',
    categoriaSlug: 'nutricion',
    brand: 'hills',
    salesCount: 12,
  },
  {
    id: 'demo-accesorios-1',
    nombre: 'Collar Reflectivo Ajustable',
    slug: 'collar-reflectivo-ajustable',
    descripcion: 'Mayor visibilidad y comodidad para paseos nocturnos.',
    precio: 24,
    disponible: true,
    categoria_id: 'accesorios',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: false,
    activo: true,
    created_at: '2026-04-12T00:00:00.000Z',
    categoriaSlug: 'accesorios',
    salesCount: 11,
  },
  {
    id: 'demo-accesorios-2',
    nombre: 'Cama Ortopedica Mediana',
    slug: 'cama-ortopedica-mediana',
    descripcion: 'Descanso firme y confortable para perros de todas las edades.',
    precio: 89,
    disponible: true,
    categoria_id: 'accesorios',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: true,
    activo: true,
    created_at: '2026-04-11T00:00:00.000Z',
    categoriaSlug: 'accesorios',
    salesCount: 24,
  },
  {
    id: 'demo-accesorios-3',
    nombre: 'Juguete Dental para Perros',
    slug: 'juguete-dental-perros',
    descripcion: 'Ayuda a entretener y mantener una rutina de juego activa.',
    precio: 19,
    disponible: true,
    categoria_id: 'accesorios',
    subcategoria_id: null,
    imagen_url: null,
    recomendacion_medica: null,
    aviso_legal: false,
    destacado: false,
    activo: true,
    created_at: '2026-04-10T00:00:00.000Z',
    categoriaSlug: 'accesorios',
    salesCount: 17,
  },
]

function fallbackProductToProducto(producto: FallbackProduct): Producto {
  const { categoriaSlug, brand, salesCount, ...cleanedProduct } = producto
  return cleanedProduct
}

function normalizeCatalogSort(sort?: string): CatalogSort {
  if (sort === 'precio-menor') return 'precio-menor'
  if (sort === 'precio-mayor') return 'precio-mayor'
  if (sort === 'mas-vendidos') return 'mas-vendidos'
  return DEFAULT_CATALOG_SORT
}

function sortProductos(items: Producto[], sort: CatalogSort, salesCountById = new Map<string, number>()) {
  const copy = [...items]

  switch (sort) {
    case 'precio-menor':
      return copy.sort((a, b) => Number(a.precio) - Number(b.precio))
    case 'precio-mayor':
      return copy.sort((a, b) => Number(b.precio) - Number(a.precio))
    case 'mas-vendidos':
      return copy.sort((a, b) => {
        const soldA = salesCountById.get(a.id) ?? 0
        const soldB = salesCountById.get(b.id) ?? 0
        if (soldA !== soldB) return soldB - soldA
        return Number(new Date(b.created_at)) - Number(new Date(a.created_at))
      })
    case 'destacados':
    default:
      return copy.sort((a, b) => {
        if (a.destacado !== b.destacado) {
          return Number(b.destacado) - Number(a.destacado)
        }
        return Number(new Date(b.created_at)) - Number(new Date(a.created_at))
      })
  }
}

async function getSalesCountByProductIds(supabase: SupabaseClient, productIds: string[]) {
  const salesCountById = new Map<string, number>()

  if (productIds.length === 0) return salesCountById

  const { data, error } = await supabase
    .from('pedido_items')
    .select('producto_id,cantidad,pedidos!inner(estado)')
    .in('producto_id', productIds)
    .in('pedidos.estado', ['confirmado', 'listo', 'entregado'])

  if (error || !data) {
    return salesCountById
  }

  for (const row of data as Array<{ producto_id: string; cantidad: number | string | null }>) {
    const cantidad = Number(row.cantidad ?? 0)
    const previous = salesCountById.get(row.producto_id) ?? 0
    salesCountById.set(row.producto_id, previous + (Number.isFinite(cantidad) ? cantidad : 0))
  }

  return salesCountById
}

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

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function matchesSearch(producto: Producto, search?: string) {
  if (!search) return true
  const normalized = search.toLowerCase()
  return (
    producto.nombre.toLowerCase().includes(normalized) ||
    (producto.descripcion ?? '').toLowerCase().includes(normalized)
  )
}

function matchesBrand(producto: FallbackProduct, brand?: string) {
  if (!brand) return true
  const normalizedBrand = brand.replace('-', ' ').toLowerCase()
  return producto.brand?.toLowerCase().includes(normalizedBrand) || producto.nombre.toLowerCase().includes(normalizedBrand)
}

function getFallbackProducts(params: {
  categoriaSlug: string
  subcategoriaSlug?: string
  brand?: string
  search?: string
  sort?: string
  page?: number
}): ProductListResult {
  const sort = normalizeCatalogSort(params.sort)
  const page = Math.max(params.page ?? 1, 1)
  const from = (page - 1) * PAGE_SIZE
  const filtered = FALLBACK_PRODUCTS.filter((producto) => {
    if (producto.categoriaSlug !== params.categoriaSlug) return false
    if (params.subcategoriaSlug && producto.subcategoria_id !== params.subcategoriaSlug) return false
    if (!matchesBrand(producto, params.brand)) return false
    if (!matchesSearch(producto, params.search)) return false
    return producto.activo
  })

  const salesCountById = new Map(filtered.map((producto) => [producto.id, Number(producto.salesCount ?? 0)]))
  const sortedItems = sortProductos(filtered.map((producto) => fallbackProductToProducto(producto)), sort, salesCountById)
  const pageItems = sortedItems.slice(from, from + PAGE_SIZE)

  return {
    data: pageItems,
    total: filtered.length,
  }
}

export async function getCategoryProducts(params: {
  categoriaSlug: string
  subcategoriaSlug?: string
  brand?: string
  search?: string
  sort?: string
  page?: number
}): Promise<ProductListResult> {
  const sort = normalizeCatalogSort(params.sort)

  if (!isSupabaseConfigured()) {
    return getFallbackProducts({ ...params, sort })
  }

  const page = Math.max(params.page ?? 1, 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return getFallbackProducts({ ...params, sort })
  }

  let query = supabase
    .from('productos')
    .select('*, categorias!inner(slug), subcategorias(slug)', { count: 'exact' })
    .eq('activo', true)
    .eq('categorias.slug', params.categoriaSlug)

  if (params.subcategoriaSlug) {
    query = query.eq('subcategorias.slug', params.subcategoriaSlug)
  }

  if (params.brand) {
    query = query.ilike('nombre', `%${params.brand.replace('-', ' ')}%`)
  }

  if (params.search) {
    query = query.or(`nombre.ilike.%${params.search}%,descripcion.ilike.%${params.search}%`)
  }

  if (sort === 'mas-vendidos') {
    const { data, count, error } = await query
    if (error) {
      return getFallbackProducts({ ...params, sort })
    }

    const normalizedData = (data ?? []).map(normalizeProducto)
    const salesCountById = await getSalesCountByProductIds(
      supabase,
      normalizedData.map((producto) => producto.id)
    )
    const sortedData = sortProductos(normalizedData, sort, salesCountById)

    return {
      data: sortedData.slice(from, to + 1),
      total: count ?? normalizedData.length,
    }
  }

  if (sort === 'precio-menor') {
    query = query.order('precio', { ascending: true }).order('created_at', { ascending: false })
  } else if (sort === 'precio-mayor') {
    query = query.order('precio', { ascending: false }).order('created_at', { ascending: false })
  } else {
    query = query.order('destacado', { ascending: false }).order('created_at', { ascending: false })
  }

  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) {
    return getFallbackProducts({ ...params, sort })
  }

  return {
    data: (data ?? []).map(normalizeProducto),
    total: count ?? 0,
  }
}

export async function getProductBySlug(slug: string): Promise<Producto | null> {
  if (!isSupabaseConfigured()) {
    const fallback = FALLBACK_PRODUCTS.find((producto) => producto.slug === slug && producto.activo)
    if (!fallback) return null
    return fallbackProductToProducto(fallback)
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    const fallback = FALLBACK_PRODUCTS.find((producto) => producto.slug === slug && producto.activo)
    if (!fallback) return null
    return fallbackProductToProducto(fallback)
  }

  const { data, error } = await supabase.from('productos').select('*').eq('slug', slug).eq('activo', true).maybeSingle()

  if (error || !data) {
    const fallback = FALLBACK_PRODUCTS.find((producto) => producto.slug === slug && producto.activo)
    if (!fallback) return null
    return fallbackProductToProducto(fallback)
  }
  return normalizeProducto(data)
}

export async function getRelatedProducts(params: {
  categoriaId: string
  excludeId: string
  limit?: number
}): Promise<Producto[]> {
  const limit = Math.max(1, Math.min(params.limit ?? 8, 12))

  if (!isSupabaseConfigured()) {
    return FALLBACK_PRODUCTS
      .filter((producto) => producto.categoria_id === params.categoriaId && producto.id !== params.excludeId && producto.activo)
      .slice(0, limit)
      .map((producto) => fallbackProductToProducto(producto))
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return FALLBACK_PRODUCTS
      .filter((producto) => producto.categoria_id === params.categoriaId && producto.id !== params.excludeId && producto.activo)
      .slice(0, limit)
      .map((producto) => fallbackProductToProducto(producto))
  }

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .eq('categoria_id', params.categoriaId)
    .neq('id', params.excludeId)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return FALLBACK_PRODUCTS
      .filter((producto) => producto.categoria_id === params.categoriaId && producto.id !== params.excludeId && producto.activo)
      .slice(0, limit)
      .map((producto) => fallbackProductToProducto(producto))
  }

  return (data ?? []).map(normalizeProducto)
}

export { PAGE_SIZE }
