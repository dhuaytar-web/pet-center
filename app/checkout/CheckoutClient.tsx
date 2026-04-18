'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { useCart } from '@/lib/CartContext'

type MetodoPago = 'yape' | 'plin' | 'efectivo_tienda'

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('yape')

  const hasItems = items.length > 0
  const total = useMemo(() => subtotal, [subtotal])
  const hasLegalWarnings = useMemo(() => items.some((item) => item.producto.aviso_legal), [items])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!hasItems) {
      setError('Tu carrito esta vacio.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const nombre_cliente = String(formData.get('nombre_cliente') ?? '').trim()
    const telefono = String(formData.get('telefono') ?? '').trim()
    const notas = String(formData.get('notas') ?? '').trim()

    if (!nombre_cliente || !telefono) {
      setError('Completa nombre y telefono para continuar.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente,
          telefono,
          notas: notas || null,
          metodo_pago: metodoPago,
          metodo_entrega: 'recojo_tienda',
          total,
          items: items.map((item) => ({
            producto_id: item.producto.id,
            nombre_producto: item.producto.nombre,
            precio_unitario: Number(item.producto.precio),
            cantidad: item.cantidad,
          })),
        }),
      })

      const payload = (await response.json()) as { numero_pedido?: string; error?: string }
      if (!response.ok || !payload.numero_pedido) {
        throw new Error(payload.error ?? 'No se pudo registrar el pedido.')
      }

      clearCart()
      router.push(`/checkout/confirmacion?pedido=${encodeURIComponent(payload.numero_pedido)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al crear pedido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Datos del cliente</h2>

        <div className="mt-4 grid gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Nombre completo</span>
            <input
              name="nombre_cliente"
              required
              className="w-full rounded-xl border border-cyan-200 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Telefono / WhatsApp</span>
            <input
              name="telefono"
              required
              className="w-full rounded-xl border border-cyan-200 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Notas (opcional)</span>
            <textarea
              name="notas"
              rows={3}
              className="w-full rounded-xl border border-cyan-200 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl bg-cyan-50 p-4">
          <p className="text-sm font-semibold text-cyan-900">Metodo de pago</p>

          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="metodo_pago"
                value="yape"
                checked={metodoPago === 'yape'}
                onChange={() => setMetodoPago('yape')}
              />
              Yape
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="metodo_pago"
                value="plin"
                checked={metodoPago === 'plin'}
                onChange={() => setMetodoPago('plin')}
              />
              Plin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="metodo_pago"
                value="efectivo_tienda"
                checked={metodoPago === 'efectivo_tienda'}
                onChange={() => setMetodoPago('efectivo_tienda')}
              />
              Efectivo en tienda
            </label>
          </div>

          {metodoPago !== 'efectivo_tienda' && (
            <p className="mt-3 text-xs text-cyan-900">
              Realiza el pago y la duena lo validara manualmente desde su app antes de confirmar.
            </p>
          )}
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !hasItems}
          className="mt-6 w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? 'Procesando pedido...' : 'Confirmar pedido'}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Resumen</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item.producto.id} className="space-y-1">
              <div className="flex justify-between gap-2">
                <span className="line-clamp-1">{item.producto.nombre} x{item.cantidad}</span>
                <span className="font-semibold">S/ {(Number(item.producto.precio) * item.cantidad).toFixed(2)}</span>
              </div>
              {item.producto.aviso_legal && (
                <p className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600">
                  Consulte a su veterinario antes de administrar.
                </p>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-cyan-100 pt-3 text-sm">
          <span className="text-slate-600">Total</span>
          <span className="text-base font-bold text-cyan-900">S/ {total.toFixed(2)}</span>
        </div>

        {hasLegalWarnings && (
          <p className="mt-3 rounded-lg bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
            Este pedido incluye productos con aviso legal. Recomendamos consulta veterinaria.
          </p>
        )}
      </aside>
    </div>
  )
}
