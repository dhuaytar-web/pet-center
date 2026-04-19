'use client'

import { useState } from 'react'
import AddToCartButton from '@/app/producto/[slug]/AddToCartButton'
import type { Producto } from '@/lib/types'

type ProductQtySelectorProps = {
  producto: Producto
  compact?: boolean
}

export default function ProductQtySelector({ producto, compact = false }: ProductQtySelectorProps) {
  const [qty, setQty] = useState(1)

  const decrease = () => setQty((prev) => Math.max(1, prev - 1))
  const increase = () => setQty((prev) => Math.min(99, prev + 1))

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrease}
          className="h-8 w-8 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700"
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <span className="min-w-6 text-center text-sm font-bold text-gray-800">{qty}</span>
        <button
          type="button"
          onClick={increase}
          className="h-8 w-8 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrease}
          className="h-8 w-8 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700"
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <span className="min-w-6 text-center text-sm font-bold text-gray-800">{qty}</span>
        <button
          type="button"
          onClick={increase}
          className="h-8 w-8 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <AddToCartButton producto={producto} qty={qty} />
    </div>
  )
}
