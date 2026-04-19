import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

async function getDashboardData() {
  const supabase = createAdminClient()
  if (!supabase) {
    return {
      productos: 0,
      pedidos: 0,
      pendientes: 0,
      error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el entorno.',
    }
  }

  const [{ count: productos, error: productosError }, { count: pedidos, error: pedidosError }, { count: pendientes, error: pendientesError }] = await Promise.all([
    supabase.from('productos').select('*', { count: 'exact', head: true }),
    supabase.from('pedidos').select('*', { count: 'exact', head: true }),
    supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
  ])

  const hasError = productosError || pedidosError || pendientesError

  return {
    productos: productos ?? 0,
    pedidos: pedidos ?? 0,
    pendientes: pendientes ?? 0,
    error: hasError ? 'No se pudieron cargar metricas del dashboard.' : null,
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

      {data.error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {data.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Productos</p>
          <p className="mt-1 text-2xl font-bold text-cyan-900">{data.productos}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Pedidos totales</p>
          <p className="mt-1 text-2xl font-bold text-cyan-900">{data.pedidos}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Pendientes</p>
          <p className="mt-1 text-2xl font-bold text-cyan-900">{data.pendientes}</p>
        </article>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/productos" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
          Gestionar productos
        </Link>
        <Link href="/admin/pedidos" className="rounded-xl border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50">
          Ver pedidos
        </Link>
      </div>
    </div>
  )
}
