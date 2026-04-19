import { createAdminClient } from '@/lib/supabase/admin'
import AdminPedidosTable from '@/components/admin/AdminPedidosTable'

type PedidoRow = {
  id: string
  numero_pedido: string
  nombre_cliente: string
  telefono: string
  total: number
  estado: 'pendiente' | 'confirmado' | 'listo' | 'entregado' | 'cancelado'
  created_at: string
}

export default async function AdminPedidosPage() {
  const supabase = createAdminClient()
  if (!supabase) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Falta configurar SUPABASE_SERVICE_ROLE_KEY para mostrar el panel administrativo.
        </p>
      </div>
    )
  }

  const { data, error } = await supabase
    .from('pedidos')
    .select('id,numero_pedido,nombre_cliente,telefono,total,estado,created_at')
    .order('created_at', { ascending: false })

  const pedidos = (data as PedidoRow[] | null) ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudieron cargar pedidos: {error.message}
        </p>
      )}

      <AdminPedidosTable pedidos={pedidos} />
    </div>
  )
}
