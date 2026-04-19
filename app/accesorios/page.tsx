import Link from 'next/link'
import CatalogSearchBar from '@/components/store/CatalogSearchBar'
import CatalogSortSelect from '@/components/store/CatalogSortSelect'
import ProductCard from '@/components/store/ProductCard'
import { getCategoryProducts, PAGE_SIZE } from '@/lib/store-products'

type AccesoriosPageProps = {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>
}

export default async function AccesoriosPage({ searchParams }: AccesoriosPageProps) {
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
    categoriaSlug: 'accesorios',
    search: params.q,
    sort: params.sort,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  const buildUrl = (nextPage: number) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.sort) query.set('sort', params.sort)
    query.set('page', String(nextPage))
    return `/accesorios?${query.toString()}`
  }

  return (
    <div className="page-shell">
      <section className="page-hero p-6 sm:p-8">
        <p className="tag-pill">Catalogo accesorios</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Accesorios para bienestar diario</h1>
        <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Correas, camas, juguetes y accesorios funcionales para una rutina comoda y segura.
        </p>

        <div className="mt-6">
          <CatalogSearchBar placeholder="Buscar accesorio..." initialValue={params.q ?? ''} />
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-bold text-slate-900">{result.total}</span> productos
            </p>
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              Orden activo: {activeSortLabel}
            </span>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            Orden
            <CatalogSortSelect initialValue={activeSort} variant="light" />
          </label>
        </div>
      </section>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {result.data.length > 0 ? (
          result.data.map((producto) => <ProductCard key={producto.id} producto={producto} />)
        ) : (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-700">
            No encontramos productos con esos filtros.
          </p>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Link
          href={buildUrl(Math.max(1, page - 1))}
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            page <= 1
              ? 'pointer-events-none border-slate-200 text-slate-400'
              : 'border-slate-300 text-slate-800 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-900'
          }`}
        >
          Anterior
        </Link>
        <p className="text-sm font-medium text-slate-600">
          Pagina {Math.min(page, totalPages)} de {totalPages}
        </p>
        <Link
          href={buildUrl(Math.min(totalPages, page + 1))}
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            page >= totalPages
              ? 'pointer-events-none border-slate-200 text-slate-400'
              : 'border-slate-300 text-slate-800 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-900'
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}
