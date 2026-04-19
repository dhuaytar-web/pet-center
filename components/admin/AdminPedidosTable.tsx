'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import EstadoPedidoForm from '@/app/admin/pedidos/[id]/EstadoPedidoForm'
import type { Pedido } from '@/lib/types'

type PedidoSummaryRow = Pick<Pedido, 'id' | 'numero_pedido' | 'nombre_cliente' | 'telefono' | 'total' | 'estado' | 'created_at'>

type PedidoItemRow = {
  id: string
  nombre_producto: string
  precio_unitario: number
  cantidad: number
}

type PedidoDetalle = PedidoSummaryRow & {
  metodo_pago: Pedido['metodo_pago']
  metodo_entrega: Pedido['metodo_entrega']
  notas: string | null
  pedido_items: PedidoItemRow[]
}

type AdminPedidosTableProps = {
  pedidos: PedidoSummaryRow[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AdminPedidosTable({ pedidos }: AdminPedidosTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<PedidoDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPedido = useMemo(() => pedidos.find((pedido) => pedido.id === selectedId) ?? null, [pedidos, selectedId])

  useEffect(() => {
    if (!selectedId) {
      setDetalle(null)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function loadDetalle() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/pedidos/${selectedId}`, { signal: controller.signal })
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(payload?.error ?? 'No se pudo cargar el pedido.')
        }

        const payload = (await response.json()) as { pedido: PedidoDetalle }
        setDetalle(payload.pedido)
      } catch (cause) {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'No se pudo cargar el pedido.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadDetalle()

    return () => controller.abort()
  }, [selectedId])

  async function refreshSelectedPedido() {
    if (!selectedId) return

    try {
      const response = await fetch(`/api/admin/pedidos/${selectedId}`)
      if (!response.ok) return
      const payload = (await response.json()) as { pedido: PedidoDetalle }
      setDetalle(payload.pedido)
    } catch {
      // Keep the current drawer state if refresh fails.
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-sm">
        <table className="w-full min-w-190 text-sm">
          <thead className="bg-cyan-50 text-left text-cyan-900">
            <tr>
              <th className="px-4 py-3">N. pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Telefono</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-t border-cyan-100">
                <td className="px-4 py-3 font-medium text-slate-900">{pedido.numero_pedido}</td>
                <td className="px-4 py-3">{pedido.nombre_cliente}</td>
                <td className="px-4 py-3">{pedido.telefono}</td>
                <td className="px-4 py-3">S/ {Number(pedido.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">{pedido.estado}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{new Date(pedido.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(pedido.id)}
                      className="text-xs font-semibold text-cyan-700 hover:text-cyan-900"
                    >
                      Ver en drawer
                    </button>
                    <Link href={`/admin/pedidos/${pedido.id}`} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                      Página
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Cerrar drawer" className="absolute inset-0 bg-slate-950/40" onClick={() => setSelectedId(null)} />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Detalle de pedido</p>
                <h2 className="text-xl font-bold text-slate-900">{selectedPedido?.numero_pedido ?? 'Pedido'}</h2>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-xl border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50">
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {loading && (
                <div className="space-y-4">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
                </div>
              )}

              {error && !loading && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </p>
              )}

              {!loading && !error && detalle && (
                <div className="space-y-5">
                  <section className="grid gap-3 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cliente</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{detalle.nombre_cliente}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Telefono</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{detalle.telefono}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pago</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{detalle.metodo_pago}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Entrega</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{detalle.metodo_entrega}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(detalle.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">S/ {Number(detalle.total).toFixed(2)}</p>
                    </div>
                    {detalle.notas && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notas</p>
                        <p className="mt-1 text-sm text-slate-700">{detalle.notas}</p>
                      </div>
                    )}
                  </section>

                  <section className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-800">Items</h3>
                      <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">
                        {detalle.estado}
                      </span>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl border border-cyan-100">
                      <table className="w-full text-sm">
                        <thead className="bg-cyan-50 text-left text-cyan-900">
                          <tr>
                            <th className="px-3 py-2">Producto</th>
                            <th className="px-3 py-2">Cant.</th>
                            <th className="px-3 py-2">Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalle.pedido_items.map((item) => (
                            <tr key={item.id} className="border-t border-cyan-100">
                              <td className="px-3 py-2 font-medium text-slate-900">{item.nombre_producto}</td>
                              <td className="px-3 py-2 text-slate-700">{item.cantidad}</td>
                              <td className="px-3 py-2 text-slate-700">S/ {Number(item.precio_unitario).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="grid gap-4 lg:grid-cols-[1fr_260px]">
                    <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Cambiar estado</p>
                      <div className="mt-3 max-w-sm">
                        <EstadoPedidoForm id={detalle.id} estadoActual={detalle.estado} onSaved={() => refreshSelectedPedido()} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Acciones</p>
                      <a
                        href={`https://wa.me/${detalle.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${detalle.nombre_cliente}, revisamos tu pedido ${detalle.numero_pedido}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        WhatsApp directo
                      </a>
                      <Link
                        href={`/admin/pedidos/${detalle.id}`}
                        className="mt-2 inline-flex w-full justify-center rounded-xl border border-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
                      >
                        Abrir página completa
                      </Link>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}