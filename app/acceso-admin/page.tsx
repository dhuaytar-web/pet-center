import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceso Administrador | PET CENTER',
  description: 'Ingreso para administradores de tienda PET CENTER.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccesoAdminPage() {
  return (
    <main className="container-pet py-12">
      <section className="mx-auto max-w-2xl rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Portal interno</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Acceso para administradores</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Esta entrada es exclusiva para personal de tienda. Desde aqui podras gestionar productos, pedidos y
          operaciones diarias del e-commerce.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/login"
            className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
          >
            Ir al panel administrativo
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-cyan-200 px-5 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-cyan-50"
          >
            Volver a la tienda
          </Link>
        </div>
      </section>
    </main>
  )
}
