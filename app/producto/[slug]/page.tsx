import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertCircle, Shield } from 'lucide-react'
import ProductQtySelector from '@/app/producto/[slug]/ProductQtySelector'
import { getProductBySlug, getRelatedProducts } from '@/lib/store-products'

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

  const relacionados = await getRelatedProducts({
    categoriaId: producto.categoria_id,
    excludeId: producto.id,
    limit: 8,
  })

  const imageSrc = producto.imagen_url?.trim() || '/images/placeholder.png'
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
          className="h-50 rounded-2xl border border-[#e5d6c5] bg-cover bg-center md:h-85"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        <section>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                producto.disponible ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-[#F1EFE8] text-[#5F5E5A]'
              }`}
            >
              {producto.disponible ? 'Disponible' : 'Agotado'}
            </span>
            <span className="rounded-full bg-[#EEEDFE] px-2 py-0.5 text-[10px] font-bold text-[#3C3489]">Categoria</span>
          </div>

          <h1 className="font-display text-[18px] font-bold leading-tight text-gray-900">{producto.nombre}</h1>

          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="font-display text-[26px] font-bold text-(--pet-green-dark)">S/ {Number(producto.precio).toFixed(2)}</p>
          </div>

          <p className="mt-4 text-[12.5px] leading-relaxed text-gray-500">
            {producto.descripcion ?? 'Producto veterinario con respaldo profesional para tu mascota.'}
          </p>

          {producto.recomendacion_medica && (
            <div className="mt-5 rounded-xl border-l-[3px] border-[#888780] bg-[#F1EFE8] p-3">
              <p className="flex items-center gap-1 text-[10.5px] font-bold text-[#5F5E5A]">
                <Shield size={12} /> Recomendacion medica
              </p>
              <p className="mt-1 text-[11.5px] italic leading-relaxed text-[#5F5E5A]">{producto.recomendacion_medica}</p>
            </div>
          )}

          {producto.aviso_legal && (
            <div className="mt-3.5 rounded-xl border-l-[3px] border-[#E24B4A] bg-[#FCEBEB] p-3">
              <p className="flex items-center gap-1 text-[10.5px] font-bold text-[#A32D2D]">
                <AlertCircle size={12} /> Aviso legal
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#A32D2D]">Consulte a su veterinario antes de administrar.</p>
            </div>
          )}

          <ProductQtySelector producto={producto} />
        </section>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Productos relacionados</h2>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {relacionados.map((item) => (
              <Link
                key={item.id}
                href={`/producto/${item.slug}`}
                className="min-w-27.5 max-w-27.5 overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div
                  className="h-22.5 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.imagen_url?.trim() || '/images/placeholder.png'})` }}
                />
                <div className="p-2">
                  <p className="line-clamp-2 text-[11px] font-bold leading-tight text-gray-900">{item.nombre}</p>
                  <p className="mt-1 text-[11px] font-bold text-(--pet-green-dark)">S/ {Number(item.precio).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
