'use client'

import { useCart } from '@/lib/CartContext'
import type { Producto } from '@/lib/types'

type AddToCartButtonProps = {
  producto: Producto
}

export default function AddToCartButton({ producto }: AddToCartButtonProps) {
  const { addItem } = useCart()

  return (
    <button
      type="button"
      onClick={() => addItem(producto)}
      disabled={!producto.disponible}
      className="mt-6 w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {producto.disponible ? 'Agregar al carrito' : 'Producto agotado'}
    </button>
  )
}
