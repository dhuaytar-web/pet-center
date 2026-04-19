'use client'

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import { useToast } from '@/components/ui/Toast'
import type { Producto } from '@/lib/types'

type AddToCartButtonProps = {
  producto: Producto
  qty?: number
}

export default function AddToCartButton({ producto, qty = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    addItem(producto, qty)
    showToast(`${producto.nombre} agregado al carrito`)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!producto.disponible}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-(--pet-green) px-4 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-(--pet-green-mid) disabled:cursor-not-allowed disabled:opacity-50"
    >
      {producto.disponible ? (justAdded ? 'Agregado al carrito' : 'Agregar al carrito') : 'Producto agotado'}
    </button>
  )
}
