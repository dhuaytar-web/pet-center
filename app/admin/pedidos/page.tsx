import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()
  const { data } = await supabase
    .from('pedidos')
    .select('id,numero_pedido,nombre_cliente,telefono,total,estado,created_at')
    .order('created_at', { ascending: false })

  const pedidos = (data as PedidoRow[] | null) ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>

      <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-cyan-50 text-left text-cyan-900">
            <tr>
              <th className="px-4 py-3">N. pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Telefono</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-t border-cyan-100">
                <td className="px-4 py-3 font-medium text-slate-900">{pedido.numero_pedido}</td>
                <td className="px-4 py-3">{pedido.nombre_cliente}</td>
                <td className="px-4 py-3">{pedido.telefono}</td>
                <td className="px-4 py-3">S/ {Number(pedido.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">{pedido.estado}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{new Date(pedido.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${pedido.id}`} className="text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}

            {pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
