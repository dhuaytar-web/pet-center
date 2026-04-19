'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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

type ToggleField = 'activo' | 'disponible'

type PendingState = {
  activo: boolean
  disponible: boolean
}

function buildErrorMessage(data: unknown) {
  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return 'No se pudo actualizar el producto.'
}

type AdminProductRowProps = {
  producto: ProductoRow
  onOpenDrawer?: (producto: ProductoRow) => void
  onProductChange?: (producto: ProductoRow) => void
}

export default function AdminProductRow({ producto, onOpenDrawer, onProductChange }: AdminProductRowProps) {
  const [current, setCurrent] = useState(producto)
  const [pending, setPending] = useState<PendingState>({ activo: false, disponible: false })
  const [error, setError] = useState<string | null>(null)
  const requestIdsRef = useRef<Record<ToggleField, number>>({ activo: 0, disponible: 0 })

  useEffect(() => {
    setCurrent(producto)
    setPending({ activo: false, disponible: false })
    setError(null)
    requestIdsRef.current = { activo: 0, disponible: 0 }
  }, [producto])

  const disponible = typeof current.disponible === 'boolean' ? current.disponible : (current.stock ?? 0) > 0

  async function toggleField(field: ToggleField) {
    if (pending[field]) return

    const requestId = requestIdsRef.current[field] + 1
    requestIdsRef.current[field] = requestId

    const snapshot = current
    const nextValue = !Boolean(snapshot[field])
    const optimisticProduct = { ...snapshot, [field]: nextValue }

    setCurrent(optimisticProduct)
    setPending((previous) => ({ ...previous, [field]: true }))
    setError(null)

    try {
      const response = await fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticProduct),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as unknown
        throw new Error(buildErrorMessage(payload))
      }

      onProductChange?.(optimisticProduct)
    } catch (cause) {
      if (requestIdsRef.current[field] !== requestId) return

      setCurrent(snapshot)
      setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el producto.')
    } finally {
      if (requestIdsRef.current[field] === requestId) {
        setPending((previous) => ({ ...previous, [field]: false }))
      }
    }
  }

  return (
    <tr className={`border-t border-cyan-100 ${pending.activo || pending.disponible ? 'bg-amber-50/40' : ''} ${error ? 'bg-rose-50/40' : ''}`}>
      <td className="px-4 py-3 align-top font-medium text-slate-900">
        <div className="max-w-[18rem]">
          <button
            type="button"
            onClick={() => onOpenDrawer?.(current)}
            className="text-left font-semibold text-slate-900 hover:text-cyan-700"
          >
            {current.nombre}
          </button>
          <p className="mt-0.5 text-xs text-slate-500">{current.slug}</p>
          {error && <p className="mt-1 text-xs font-medium text-rose-700">{error}</p>}
        </div>
      </td>
      <td className="px-4 py-3 align-top text-slate-700">S/ {Number(current.precio).toFixed(2)}</td>
      <td className="px-4 py-3 align-top">
        <button
          type="button"
          onClick={() => toggleField('disponible')}
          disabled={pending.disponible}
          aria-pressed={disponible}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
            disponible ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current opacity-70" />
          {pending.disponible ? 'Actualizando...' : disponible ? 'Disponible' : 'Agotado'}
        </button>
      </td>
      <td className="px-4 py-3 align-top">
        <button
          type="button"
          onClick={() => toggleField('activo')}
          disabled={pending.activo}
          aria-pressed={current.activo}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
            current.activo ? 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          }`}
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current opacity-70" />
          {pending.activo ? 'Actualizando...' : current.activo ? 'Activo' : 'Inactivo'}
        </button>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenDrawer?.(current)}
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-900"
          >
            Edicion rapida
          </button>
          <Link href={`/admin/productos/${current.id}`} className="text-xs font-semibold text-cyan-700 hover:text-cyan-900">
            Editar
          </Link>
        </div>
      </td>
    </tr>
  )
}