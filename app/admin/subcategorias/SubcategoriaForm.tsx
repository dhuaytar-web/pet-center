'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type CategoriaOption = {
  id: string
  nombre: string
}

type SubcategoriaFormProps = {
  categorias: CategoriaOption[]
}

export default function SubcategoriaForm({ categorias }: SubcategoriaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      categoria_id: String(formData.get('categoria_id') ?? ''),
      nombre: String(formData.get('nombre') ?? ''),
      slug: String(formData.get('slug') ?? ''),
    }

    const response = await fetch('/api/admin/subcategorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = (await response.json()) as { error?: string }
      setError(data.error ?? 'No se pudo crear la subcategoria.')
      setLoading(false)
      return
    }

    event.currentTarget.reset()
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Nueva subcategoria</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-slate-700">Categoria</span>
          <select name="categoria_id" required className="w-full rounded-xl border border-cyan-200 px-3 py-2">
            <option value="">Selecciona una categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Nombre</span>
          <input name="nombre" required className="w-full rounded-xl border border-cyan-200 px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Identificador URL</span>
          <input
            name="slug"
            required
            placeholder="ej: antipulgas-premium"
            className="w-full rounded-xl border border-cyan-200 px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Creando...' : 'Crear subcategoria'}
      </button>
    </form>
  )
}
