import Link from 'next/link'
import CatalogSearchBar from '@/components/store/CatalogSearchBar'
import CatalogSortSelect from '@/components/store/CatalogSortSelect'
import Filtros from '@/components/store/Filtros'
import ProductCard from '@/components/store/ProductCard'
import { getCategoryProducts, PAGE_SIZE } from '@/lib/store-products'

const subcategorias = [
  { label: 'Antipulgas', value: 'antipulgas' },
  { label: 'Vitaminas', value: 'vitaminas' },
  { label: 'Cuidado de piel', value: 'cuidado-piel' },
]

type FarmaciaPageProps = {
  searchParams: Promise<{ filtro?: string; q?: string; sort?: string; page?: string }>
}

export default async function FarmaciaPage({ searchParams }: FarmaciaPageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1
  const activeSort = params.sort ?? 'destacados'

  const sortLabelByValue: Record<string, string> = {
    destacados: 'Destacados',
    'precio-mayor': 'Precio: mayor a menor',
    'precio-menor': 'Precio: menor a mayor',
    'mas-vendidos': 'Mas vendidos',
  }

  const activeSortLabel = sortLabelByValue[activeSort] ?? sortLabelByValue.destacados

  const result = await getCategoryProducts({
    categoriaSlug: 'farmacia',
    subcategoriaSlug: params.filtro,
    search: params.q,
    sort: params.sort,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  const buildUrl = (nextPage: number) => {
    const query = new URLSearchParams()
    if (params.filtro) query.set('filtro', params.filtro)
    if (params.q) query.set('q', params.q)
    if (params.sort) query.set('sort', params.sort)
    query.set('page', String(nextPage))
    return `/farmacia?${query.toString()}`
  }

  const buildFilterUrl = (filtro?: string) => {
    const query = new URLSearchParams()
    if (filtro) query.set('filtro', filtro)
    if (params.q) query.set('q', params.q)
    if (params.sort) query.set('sort', params.sort)
    query.set('page', '1')
    return `/farmacia?${query.toString()}`
  }

  const selectedLabel = subcategorias.find((item) => item.value === params.filtro)?.label ?? 'Todos'

  return (
    <div className="bg-[#111418] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-[#2b3a3f] bg-[#161c21] p-5 sm:p-7">
          <div className="absolute -right-10 top-0 h-56 w-56 rounded-full bg-[#f0a400] opacity-95 blur-[1px]" />
          <div className="absolute inset-y-0 left-[32%] w-px bg-white/10" />
          <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="h-52 rounded-2xl bg-linear-to-br from-[#3f4e57] to-[#2b363d]" />
            <div>
              <p className="inline-flex rounded-full bg-[#22303a] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9ed7d0]">
                Categoria perros y gatos
              </p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl">Farmacia veterinaria</h1>
              <p className="mt-2 text-base text-[#bdd0d8] sm:text-lg">
                Antipulgas, vitaminas y cuidado de piel para cada necesidad de tu mascota.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[270px_1fr]">
          <aside className="rounded-2xl border border-[#2b3a3f] bg-[#161c21] p-4 text-[#d9e2e7]">
            <h2 className="text-lg font-bold text-white">Categorias de productos</h2>
            <nav className="mt-3 space-y-1.5">
              <Link
                href={buildFilterUrl(undefined)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  !params.filtro ? 'bg-[#0f766e] text-white' : 'hover:bg-[#212a31]'
                }`}
              >
                <span>Todos</span>
                <span className="text-xs opacity-80">{result.total}</span>
              </Link>
              {subcategorias.map((item) => (
                <Link
                  key={item.value}
                  href={buildFilterUrl(item.value)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    params.filtro === item.value ? 'bg-[#0f766e] text-white' : 'hover:bg-[#212a31]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-70">1</span>
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-[#2b3a3f] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a5ad]">Filtro rapido</h3>
              <div className="mt-3">
                <Filtros
                  basePath="/farmacia"
                  paramName="filtro"
                  opciones={subcategorias}
                  selected={params.filtro}
                  query={params.q}
                  extraParams={{ sort: params.sort }}
                />
              </div>
            </div>
          </aside>

          <div>
            <div className="rounded-2xl border border-[#2b3a3f] bg-[#161c21] p-4">
              <CatalogSearchBar placeholder="Buscar producto en farmacia..." initialValue={params.q ?? ''} />

              <div className="mt-3 flex flex-col gap-2 border-t border-[#2b3a3f] pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-[#b8c7cf]">
                    Mostrando <span className="font-bold text-white">{result.total}</span> productos en <span className="font-bold text-white">{selectedLabel}</span>
                  </p>
                  <span className="rounded-full border border-[#35515b] bg-[#1b252c] px-2.5 py-1 text-[11px] font-semibold text-[#c9d7de]">
                    Orden activo: {activeSortLabel}
                  </span>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-[#b8c7cf]">
                  Orden
                  <CatalogSortSelect initialValue={activeSort} variant="dark" />
                </label>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {result.data.length > 0 ? (
                result.data.map((producto) => <ProductCard key={producto.id} producto={producto} compact />)
              ) : (
                <p className="col-span-full rounded-2xl border border-dashed border-[#32424b] bg-[#161c21] p-6 text-sm text-[#b8c7cf]">
                  No encontramos productos con esos filtros.
                </p>
              )}
            </div>

            <div className="mt-7 flex items-center justify-between">
              <Link
                href={buildUrl(Math.max(1, page - 1))}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                  page <= 1
                    ? 'pointer-events-none border-[#2f3b42] text-[#62747d]'
                    : 'border-[#3c4e57] text-[#d5e1e7] hover:border-[#0f766e] hover:text-white'
                }`}
              >
                Anterior
              </Link>
              <p className="text-sm text-[#9eb0b9]">
                Pagina {Math.min(page, totalPages)} de {totalPages}
              </p>
              <Link
                href={buildUrl(Math.min(totalPages, page + 1))}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                  page >= totalPages
                    ? 'pointer-events-none border-[#2f3b42] text-[#62747d]'
                    : 'border-[#3c4e57] text-[#d5e1e7] hover:border-[#0f766e] hover:text-white'
                }`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
