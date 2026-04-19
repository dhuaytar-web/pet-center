'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { useToast } from '@/components/ui/Toast'
import type { Producto } from '@/lib/types'

type ProductCardProps = {
  producto: Producto
  compact?: boolean
}

export default function ProductCard({ producto, compact = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [justAdded, setJustAdded] = useState(false)
  const disponible = producto.disponible
  const imageSrc = producto.imagen_url?.trim() || '/images/placeholder.png'
  const hasPromo = compact && producto.destacado
  const listPrice = Number(producto.precio) * 1.2
  const ahorro = listPrice - Number(producto.precio)

  const handleAdd = () => {
    addItem(producto)
    showToast(`${producto.nombre} agregado al carrito`)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <article className={`surface-card flex h-full flex-col rounded-3xl transition-all hover:-translate-y-1 hover:border-[#cf8454] hover:shadow-lg ${compact ? 'p-3.5' : 'p-5'}`}>
      <div className="relative mb-3.5">
        {hasPromo && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-[#d32f2f] px-2 py-1 text-[10px] font-bold text-white">
            -20%
          </span>
        )}
        <div
          className={`aspect-square rounded-2xl border border-[#e5d6c5] bg-cover bg-center ${compact ? 'rounded-xl' : ''}`}
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className={`line-clamp-2 font-semibold text-[#1f1c19] ${compact ? 'text-sm leading-5' : 'text-base'}`}>{producto.nombre}</h3>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
            disponible ? 'bg-[#e6f3ef] text-[#0e6a5f]' : 'bg-[#ece7e1] text-[#6b5a4a]'
          }`}
        >
          {disponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>

      {!compact && producto.aviso_legal && (
        <p className="mt-2 rounded-lg bg-[#fff1e7] px-2 py-1 text-[11px] font-medium text-[#a24c1e]">
          Consulte a su veterinario antes de administrar.
        </p>
      )}

      <div className={`mt-auto flex items-center justify-between ${compact ? 'pt-3' : 'pt-4'}`}>
        <div>
          <p className={`font-bold text-[#1f1c19] ${compact ? 'text-base' : 'text-xl'}`}>S/ {Number(producto.precio).toFixed(2)}</p>
          {hasPromo && (
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xs text-[#7b6c60] line-through">S/ {listPrice.toFixed(2)}</p>
              <p className="text-[11px] font-semibold text-[#8a4b23]">Ahorras S/ {ahorro.toFixed(2)}</p>
            </div>
          )}
        </div>
        <Link
          href={`/producto/${producto.slug}`}
          className={`rounded-xl border border-[#d8c8b4] font-semibold text-[#3c3128] transition-colors hover:border-[#cf8454] hover:bg-[#fff3e6] hover:text-[#8b3d17] ${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'}`}
        >
          Ver detalle
        </Link>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!disponible}
        className={`mt-3 w-full rounded-xl bg-linear-to-r from-[#0b3b36] to-[#11554e] font-semibold text-white transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#cfc7bf] ${compact ? 'px-2.5 py-2 text-xs' : 'px-3 py-2.5 text-sm'}`}
      >
        {disponible ? (justAdded ? 'Agregado' : 'Agregar al carrito') : 'Agotado'}
      </button>
    </article>
  )
}
