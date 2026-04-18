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
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-3">
        {items.map((item) => (
          <article key={item.producto.id} className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{item.producto.nombre}</h2>
                <p className="mt-1 text-sm text-cyan-800">S/ {Number(item.producto.precio).toFixed(2)}</p>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.producto.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Quitar
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <label htmlFor={`qty-${item.producto.id}`} className="text-xs text-slate-600">
                Cantidad
              </label>
              <input
                id={`qty-${item.producto.id}`}
                type="number"
                min={1}
                max={99}
                value={item.cantidad}
                onChange={(e) => setQty(item.producto.id, Number(e.target.value) || 1)}
                className="w-20 rounded-lg border border-cyan-200 px-2 py-1 text-sm"
              />
            </div>

            {item.producto.aviso_legal && (
              <p className="mt-3 rounded-lg bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
                Consulte a su veterinario antes de administrar.
              </p>
            )}
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Resumen</h3>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-cyan-900">S/ {subtotal.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full justify-center rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          Ir al checkout
        </Link>
      </aside>
    </div>
  )
}
