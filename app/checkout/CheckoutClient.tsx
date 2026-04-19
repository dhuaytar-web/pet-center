'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import CheckoutStepper from '@/components/store/CheckoutStepper'
import { useCart } from '@/lib/CartContext'

type MetodoPago = 'yape' | 'plin' | 'efectivo_tienda'

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('yape')

  const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS ?? 'Av. Bolognesi 123, Tacna, Peru'
  const yape = process.env.NEXT_PUBLIC_STORE_YAPE ?? '912345678'
  const plin = process.env.NEXT_PUBLIC_STORE_PLIN ?? '912345678'

  const hasItems = items.length > 0
  const total = useMemo(() => subtotal, [subtotal])
  const hasLegalWarnings = useMemo(() => items.some((item) => item.producto.aviso_legal), [items])

  const canContinueFromStep1 = nombre.trim().length > 0 && telefono.trim().length > 0

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!hasItems) {
      setError('Tu carrito esta vacio.')
      return
    }

    const nombre_cliente = nombre.trim()
    const telefono_cliente = telefono.trim()
    const notas_cliente = notas.trim()

    if (!nombre_cliente || !telefono_cliente) {
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
          telefono: telefono_cliente,
          notas: notas_cliente || null,
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
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <CheckoutStepper step={step} />

        {step === 1 && (
          <div className="grid gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[10.5px] font-bold text-gray-400">Nombre completo</span>
              <input
                name="nombre_cliente"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] outline-none ring-(--pet-green) focus:ring-2"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block text-[10.5px] font-bold text-gray-400">Telefono / WhatsApp</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-500">+51</span>
                <input
                  name="telefono"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-[12px] outline-none ring-(--pet-green) focus:ring-2"
                />
              </div>
            </label>

            <label className="text-sm">
              <span className="mb-1 block text-[10.5px] font-bold text-gray-400">Notas (opcional)</span>
              <textarea
                name="notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] outline-none ring-(--pet-green) focus:ring-2"
              />
            </label>

            <button
              type="button"
              disabled={!canContinueFromStep1}
              onClick={() => setStep(2)}
              className="mt-2 rounded-xl bg-(--pet-green) px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="rounded-xl border-[1.5px] border-[#9FE1CB] bg-[#E1F5EE] p-3">
              <p className="text-[11.5px] font-bold text-(--pet-green-dark)">Recojo en tienda</p>
              <p className="mt-1 text-[11px] leading-relaxed text-(--pet-green-mid)">{storeAddress}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700"
              >
                ← Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl bg-(--pet-green) px-4 py-3 text-sm font-bold text-white"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${metodoPago === 'yape' ? 'border-(--pet-green) bg-[#E1F5EE]' : 'border-gray-200'}`}>
                <input type="radio" name="metodo_pago" checked={metodoPago === 'yape'} onChange={() => setMetodoPago('yape')} />
                Yape
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${metodoPago === 'plin' ? 'border-(--pet-green) bg-[#E1F5EE]' : 'border-gray-200'}`}>
                <input type="radio" name="metodo_pago" checked={metodoPago === 'plin'} onChange={() => setMetodoPago('plin')} />
                Plin
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${metodoPago === 'efectivo_tienda' ? 'border-(--pet-green) bg-[#E1F5EE]' : 'border-gray-200'}`}>
                <input type="radio" name="metodo_pago" checked={metodoPago === 'efectivo_tienda'} onChange={() => setMetodoPago('efectivo_tienda')} />
                Efectivo en tienda
              </label>
            </div>

            {metodoPago !== 'efectivo_tienda' && (
              <div className="rounded-xl border border-[#FAC775] bg-[#FAEEDA] p-3">
                <p className="text-center text-[10px] text-[#854F0B]">Envia S/ {total.toFixed(2)} a este {metodoPago === 'yape' ? 'Yape' : 'Plin'}:</p>
                <p className="font-display mt-1 text-center text-[16px] font-bold tracking-wide text-[#633806]">
                  {metodoPago === 'yape' ? yape : plin}
                </p>
              </div>
            )}

            {metodoPago === 'efectivo_tienda' && (
              <div className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-center text-[11px] text-gray-600">
                Paga al momento de recoger en tienda.
              </div>
            )}

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700"
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading || !hasItems}
                className="flex-1 rounded-xl bg-(--pet-green) px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        )}
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
