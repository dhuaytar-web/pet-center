'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type ProductoFormProps = {
  id?: string
  initialValues?: {
    nombre?: string
    slug?: string
    descripcion?: string | null
    precio?: number
    activo?: boolean
    disponible?: boolean
    aviso_legal?: boolean
    recomendacion_medica?: string | null
  }
}

export default function ProductoForm({ id, initialValues }: ProductoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      id,
      nombre: String(formData.get('nombre') ?? ''),
      slug: String(formData.get('slug') ?? ''),
      descripcion: String(formData.get('descripcion') ?? ''),
      precio: Number(formData.get('precio') ?? 0),
      activo: formData.get('activo') === 'on',
      disponible: formData.get('disponible') === 'on',
      aviso_legal: formData.get('aviso_legal') === 'on',
      recomendacion_medica: String(formData.get('recomendacion_medica') ?? ''),
    }

    const method = id ? 'PATCH' : 'POST'
    const response = await fetch('/api/admin/productos', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = (await response.json()) as { error?: string }
      setError(data.error ?? 'No se pudo guardar el producto.')
      setLoading(false)
      return
    }

    router.replace('/admin/productos')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-slate-700">Nombre</span>
          <input
            name="nombre"
            required
            defaultValue={initialValues?.nombre ?? ''}
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Slug</span>
          <input
            name="slug"
            required
            defaultValue={initialValues?.slug ?? ''}
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Precio</span>
          <input
            type="number"
            name="precio"
            min={0}
            step="0.01"
            required
            defaultValue={initialValues?.precio ?? 0}
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-slate-700">Descripcion</span>
          <textarea
            rows={4}
            name="descripcion"
            defaultValue={initialValues?.descripcion ?? ''}
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-slate-700">Recomendacion medica</span>
          <textarea
            rows={3}
            name="recomendacion_medica"
            defaultValue={initialValues?.recomendacion_medica ?? ''}
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl bg-cyan-50 p-3 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="activo" defaultChecked={initialValues?.activo ?? true} />
          Activo
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="disponible" defaultChecked={initialValues?.disponible ?? true} />
          Disponible
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="aviso_legal" defaultChecked={initialValues?.aviso_legal ?? false} />
          Aviso legal
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Guardando...' : 'Guardar producto'}
      </button>
    </form>
  )
}
