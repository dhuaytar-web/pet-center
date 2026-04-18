import Link from 'next/link'
import Filtros from '@/components/store/Filtros'
import ProductCard from '@/components/store/ProductCard'
import { getCategoryProducts, PAGE_SIZE } from '@/lib/store-products'

const marcas = [
  { label: 'ProPlan', value: 'proplan' },
  { label: 'Royal Canin', value: 'royal-canin' },
  { label: 'Hills', value: 'hills' },
  { label: 'Mimaskot', value: 'mimaskot' },
]

type NutricionPageProps = {
  searchParams: Promise<{ marca?: string; q?: string; page?: string }>
}

export default async function NutricionPage({ searchParams }: NutricionPageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1

  const result = await getCategoryProducts({
    categoriaSlug: 'nutricion',
    brand: params.marca,
    search: params.q,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  const buildUrl = (nextPage: number) => {
    const query = new URLSearchParams()
    if (params.marca) query.set('marca', params.marca)
    if (params.q) query.set('q', params.q)
    query.set('page', String(nextPage))
    return `/nutricion?${query.toString()}`
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-cyan-950">Nutricion</h1>
      <p className="mt-2 text-sm text-slate-600">Alimentos premium para perros y gatos en todas sus etapas.</p>

      <form className="mt-6">
        <input
          type="search"
          name="q"
          defaultValue={params.q ?? ''}
          placeholder="Buscar alimento o marca..."
          className="w-full rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500 focus:ring-2"
        />
      </form>

      <div className="mt-4">
        <Filtros
          basePath="/nutricion"
          paramName="marca"
          opciones={marcas}
          selected={params.marca}
          query={params.q}
        />
      </div>

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
