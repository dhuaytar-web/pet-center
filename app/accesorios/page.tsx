import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import { getCategoryProducts, PAGE_SIZE } from '@/lib/store-products'

type AccesoriosPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AccesoriosPage({ searchParams }: AccesoriosPageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1

  const result = await getCategoryProducts({
    categoriaSlug: 'accesorios',
    search: params.q,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  const buildUrl = (nextPage: number) => {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    query.set('page', String(nextPage))
    return `/accesorios?${query.toString()}`
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-cyan-950">Accesorios</h1>
      <p className="mt-2 text-sm text-slate-600">Correas, camas, juguetes y todo para su comodidad diaria.</p>

      <form className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={params.q ?? ''}
          placeholder="Buscar accesorio..."
          className="w-full rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500 focus:ring-2"
        />
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {result.data.length > 0 ? (
          result.data.map((producto) => <ProductCard key={producto.id} producto={producto} />)
        ) : (
          <p className="col-span-full rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 p-6 text-sm text-cyan-900">
            No encontramos productos con esos filtros.
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link
          href={buildUrl(Math.max(1, page - 1))}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
            page <= 1
              ? 'pointer-events-none border-slate-200 text-slate-400'
              : 'border-cyan-200 text-cyan-900 hover:bg-cyan-50'
          }`}
        >
          Anterior
        </Link>
        <p className="text-sm text-slate-600">
          Pagina {Math.min(page, totalPages)} de {totalPages}
        </p>
        <Link
          href={buildUrl(Math.min(totalPages, page + 1))}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
            page >= totalPages
              ? 'pointer-events-none border-slate-200 text-slate-400'
              : 'border-cyan-200 text-cyan-900 hover:bg-cyan-50'
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}
