import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/app/producto/[slug]/AddToCartButton'
import { getProductBySlug } from '@/lib/store-products'

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const producto = await getProductBySlug(slug)

  if (!producto) {
    return {
      title: 'Producto no encontrado | PET CENTER',
    }
  }

  return {
    title: `${producto.nombre} | PET CENTER Tacna`,
    description:
      producto.descripcion ?? 'Producto veterinario disponible en PET CENTER, Tacna. Compra online y recoge en tienda.',
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const producto = await getProductBySlug(slug)

  if (!producto) {
    notFound()
  }

  const imageSrc = producto.imagen_url?.trim() || '/images/placeholder.svg'
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion ?? 'Producto veterinario en PET CENTER',
    image: [imageSrc],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: Number(producto.precio).toFixed(2),
      availability: producto.disponible ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <Link href="/farmacia" className="text-sm font-medium text-cyan-700 hover:text-cyan-900">
        {'<- '}Volver al catalogo
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div
          className="h-80 rounded-3xl border border-cyan-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        <section>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              producto.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {producto.disponible ? 'Disponible' : 'Agotado'}
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">{producto.nombre}</h1>
          <p className="mt-2 text-2xl font-bold text-cyan-800">S/ {Number(producto.precio).toFixed(2)}</p>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            {producto.descripcion ?? 'Producto veterinario con respaldo profesional para tu mascota.'}
          </p>

          {producto.recomendacion_medica && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Recomendacion medica</p>
              <p className="mt-1">{producto.recomendacion_medica}</p>
            </div>
          )}

          {producto.aviso_legal && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
              Consulte a su veterinario antes de administrar.
            </p>
          )}

          <AddToCartButton producto={producto} />
        </section>
      </div>
    </div>
  )
}
