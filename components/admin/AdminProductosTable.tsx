'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminProductRow from '@/components/admin/AdminProductRow'
import { useToast } from '@/components/ui/Toast'

type ProductoRow = {
  id: string
  nombre: string
  slug: string
  precio: number
  categoria_id: string
  activo: boolean
  disponible?: boolean
  stock?: number
  descripcion?: string | null
  subcategoria_id?: string | null
  imagen_url?: string | null
  destacado?: boolean
  aviso_legal?: boolean
  recomendacion_medica?: string | null
}

type AdminProductosTableProps = {
  productos: ProductoRow[]
}

function buildErrorMessage(data: unknown) {
  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return 'No se pudo guardar el producto.'
}

export default function AdminProductosTable({ productos }: AdminProductosTableProps) {
  const { showToast } = useToast()
  const [rows, setRows] = useState(productos)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [precio, setPrecio] = useState('0')
  const [stock, setStock] = useState('0')
  const [disponible, setDisponible] = useState(true)
  const [destacado, setDestacado] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setRows(productos)
  }, [productos])

  const selectedProducto = useMemo(() => rows.find((item) => item.id === selectedId) ?? null, [rows, selectedId])

  useEffect(() => {
    if (!selectedProducto) return

    setPrecio(String(Number(selectedProducto.precio ?? 0)))
    setStock(String(Number(selectedProducto.stock ?? 0)))
    setDisponible(typeof selectedProducto.disponible === 'boolean' ? selectedProducto.disponible : Number(selectedProducto.stock ?? 0) > 0)
    setDestacado(Boolean(selectedProducto.destacado))
    setError(null)
    setSuccess(null)
  }, [selectedProducto])

  const saveQuickEdition = useCallback(async () => {
    if (!selectedProducto || saving) return

    const parsedPrecio = Number(precio)
    const parsedStock = Math.max(0, Number(stock))

    if (!Number.isFinite(parsedPrecio) || parsedPrecio < 0) {
      setError('El precio debe ser un numero valido mayor o igual a 0.')
      return
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError('El stock debe ser un numero valido mayor o igual a 0.')
      return
    }

    const payload: ProductoRow = {
      ...selectedProducto,
      precio: parsedPrecio,
      stock: parsedStock,
      disponible,
      destacado,
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const responsePayload = (await response.json().catch(() => null)) as unknown
        throw new Error(buildErrorMessage(responsePayload))
      }

      syncRow(payload)
      setSuccess('Cambios guardados.')
      showToast(`Producto actualizado: ${payload.nombre}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el producto.')
    } finally {
      setSaving(false)
    }
  }, [selectedProducto, saving, precio, stock, disponible, destacado, showToast])

  useEffect(() => {
    if (!selectedProducto) return

    function handleKeyboardShortcuts(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedId(null)
        return
      }

      if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return
      }

      const target = event.target as HTMLElement | null
      if (target?.tagName === 'BUTTON') {
        return
      }

      event.preventDefault()
      void saveQuickEdition()
    }

    window.addEventListener('keydown', handleKeyboardShortcuts)
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [selectedProducto, saveQuickEdition])

  function openDrawer(producto: ProductoRow) {
    setSelectedId(producto.id)
  }

  function syncRow(nextProducto: ProductoRow) {
    setRows((previous) => previous.map((item) => (item.id === nextProducto.id ? nextProducto : item)))
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-sm">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-cyan-50 text-left text-cyan-900">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Disponibilidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((producto) => (
              <AdminProductRow key={producto.id} producto={producto} onOpenDrawer={openDrawer} onProductChange={syncRow} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProducto && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar drawer"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setSelectedId(null)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Edicion rapida</p>
                <h2 className="text-xl font-bold text-slate-900">{selectedProducto.nombre}</h2>
                <p className="mt-1 text-xs text-slate-500">{selectedProducto.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-xl border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <section className="space-y-4 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block text-slate-700">Precio (S/)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={precio}
                      onChange={(event) => setPrecio(event.target.value)}
                      className="w-full rounded-xl border border-cyan-200 px-3 py-2"
                    />
                  </label>

                  <label className="text-sm">
                    <span className="mb-1 block text-slate-700">Stock</span>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      className="w-full rounded-xl border border-cyan-200 px-3 py-2"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    aria-pressed={disponible}
                    onClick={() => setDisponible((previous) => !previous)}
                    className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      disponible ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Disponible</span>
                    <span className="text-xs">{disponible ? 'Si' : 'No'}</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={destacado}
                    onClick={() => setDestacado((previous) => !previous)}
                    className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      destacado ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-300 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Destacado</span>
                    <span className="text-xs">{destacado ? 'Si' : 'No'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs text-cyan-900">
                  Estado rapido: {disponible ? 'Disponible' : 'Agotado'} · {destacado ? 'Destacado' : 'No destacado'}
                </div>

                {error && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {success}
                  </p>
                )}
              </section>
            </div>

            <div className="border-t border-cyan-100 px-5 py-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={saveQuickEdition}
                  disabled={saving}
                  className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-xl border border-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
                >
                  Cerrar
                </button>
                <Link
                  href={`/admin/productos/${selectedProducto.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edicion completa
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
