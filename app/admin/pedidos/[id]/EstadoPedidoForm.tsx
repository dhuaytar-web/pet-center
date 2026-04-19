'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type EstadoPedidoFormProps = {
  id: string
  estadoActual: 'pendiente' | 'confirmado' | 'listo' | 'entregado' | 'cancelado'
  onSaved?: () => void | Promise<void>
}

const estados = ['pendiente', 'confirmado', 'listo', 'entregado', 'cancelado'] as const

export default function EstadoPedidoForm({ id, estadoActual, onSaved }: EstadoPedidoFormProps) {
  const router = useRouter()
  const [estado, setEstado] = useState(estadoActual)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)

    const response = await fetch(`/api/admin/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setError(payload?.error ?? 'No se pudo guardar el estado.')
      setSaving(false)
      return
    }

    setSaving(false)
    if (onSaved) {
      await onSaved()
    } else {
      router.refresh()
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Actualizar estado</p>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value as typeof estado)}
        className="w-full rounded-xl border border-cyan-200 px-3 py-2 text-sm"
      >
        {estados.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {saving ? 'Guardando...' : 'Guardar estado'}
      </button>
      {error && <p className="text-xs font-medium text-rose-700">{error}</p>}
    </div>
  )
}
