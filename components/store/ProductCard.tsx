'use client'

import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import type { Producto } from '@/lib/types'

type ProductCardProps = {
  producto: Producto
}

export default function ProductCard({ producto }: ProductCardProps) {
  const { addItem } = useCart()
  const disponible = producto.disponible
  const imageSrc = producto.imagen_url?.trim() || '/images/placeholder.svg'

  return (
    <article className="flex h-full flex-col rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div
        className="mb-4 aspect-square rounded-2xl border border-cyan-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />

      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{producto.nombre}</h3>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
            disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {disponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>

      {producto.aviso_legal && (
        <p className="mt-2 rounded-lg bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
          Consulte a su veterinario antes de administrar.
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4">
        <p className="text-base font-bold text-cyan-800">S/ {Number(producto.precio).toFixed(2)}</p>
        <Link
          href={`/producto/${producto.slug}`}
          className="rounded-xl border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-900 transition-colors hover:bg-cyan-50"
        >
          Ver detalle
        </Link>
      </div>

      <button
        type="button"
        onClick={() => addItem(producto)}
        disabled={!disponible}
        className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300 bg-cyan-600 hover:bg-cyan-700"
      >
        {disponible ? 'Agregar al carrito' : 'Agotado'}
      </button>
    </article>
  )
}
