'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type EstadoPedidoFormProps = {
  id: string
  estadoActual: 'pendiente' | 'confirmado' | 'listo' | 'entregado' | 'cancelado'
}

const estados = ['pendiente', 'confirmado', 'listo', 'entregado', 'cancelado'] as const

export default function EstadoPedidoForm({ id, estadoActual }: EstadoPedidoFormProps) {
  const router = useRouter()
  const [estado, setEstado] = useState(estadoActual)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/admin/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    setSaving(false)
    router.refresh()
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
    </div>
  )
}
