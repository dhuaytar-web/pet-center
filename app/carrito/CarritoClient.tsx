'use client'

import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function CarritoClient() {
  const { items, subtotal, setQty, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 p-6">
        <p className="text-sm text-cyan-900">Tu carrito esta vacio.</p>
        <Link
          href="/farmacia"
          className="mt-4 inline-flex rounded-xl border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        {items.map((item) => (
          <article key={item.producto.id} className="flex items-center gap-2 border-b border-gray-100 py-2.5 last:border-0">
            <div
              className="h-11.5 w-11.5 shrink-0 rounded-xl border border-[#e5d6c5] bg-cover bg-center"
              style={{ backgroundImage: `url(${item.producto.imagen_url?.trim() || '/images/placeholder.png'})` }}
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[12px] font-bold text-gray-900">{item.producto.nombre}</h2>
              <p className="text-[11px] text-gray-400">x{item.cantidad} · S/ {Number(item.producto.precio).toFixed(2)}</p>

              <div className="mt-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQty(item.producto.id, item.cantidad - 1)}
                  className="h-6 w-6 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700"
                >
                  -
                </button>
                <span className="min-w-5 text-center text-xs font-bold text-gray-700">{item.cantidad}</span>
                <button
                  type="button"
                  onClick={() => setQty(item.producto.id, item.cantidad + 1)}
                  className="h-6 w-6 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-display text-[13px] font-bold text-(--pet-green-dark)">
                S/ {(Number(item.producto.precio) * item.cantidad).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.producto.id)}
                className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#FCEBEB] text-xs font-bold text-[#A32D2D]"
                aria-label="Eliminar producto"
              >
                x
              </button>
            </div>

            {item.producto.aviso_legal && (
              <p className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
                Consulte a su veterinario antes de administrar.
              </p>
            )}
          </article>
        ))}
      </section>

      <aside className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-gray-400">Total</span>
          <span className="font-display text-[16px] font-bold text-(--pet-green-dark)">S/ {subtotal.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full justify-center rounded-xl bg-(--pet-green) px-4 py-3.5 text-sm font-bold text-white hover:bg-(--pet-green-mid)"
        >
          Continuar al checkout
        </Link>

        <Link href="/farmacia" className="mt-3 block text-center text-[13px] font-semibold text-(--pet-green)">
          Seguir comprando
        </Link>
      </aside>
    </div>
  )
}
