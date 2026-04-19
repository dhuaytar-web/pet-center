'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const forbidden = searchParams.get('forbidden') === '1'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const next = searchParams.get('next') || '/admin'
    router.replace(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Acceso administrador</h1>
      <p className="mt-2 text-sm text-slate-600">Ingresa con tu correo y contrasena de Supabase Auth.</p>

      {forbidden && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          Tu cuenta no tiene permisos de administracion.
        </p>
      )}

      <div className="mt-6 grid gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Correo</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-cyan-200 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Contrasena</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-cyan-200 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Ingresando...' : 'Ingresar al panel'}
      </button>
    </form>
  )
}
