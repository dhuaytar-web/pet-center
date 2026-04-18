import Link from 'next/link'
import { notFound } from 'next/navigation'
import EstadoPedidoForm from '@/app/admin/pedidos/[id]/EstadoPedidoForm'
import { createClient } from '@/lib/supabase/server'

type AdminPedidoDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminPedidoDetailPage({ params }: AdminPedidoDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('id,numero_pedido,nombre_cliente,telefono,total,estado,metodo_pago,notas,created_at')
    .eq('id', id)
    .maybeSingle()

  if (!pedido) notFound()

  const { data: items } = await supabase
    .from('pedido_items')
    .select('id,nombre_producto,precio_unitario,cantidad')
    .eq('pedido_id', id)

  const waText = encodeURIComponent(`Hola ${pedido.nombre_cliente}, sobre tu pedido ${pedido.numero_pedido} de PET CENTER.`)
  const waHref = `https://wa.me/${pedido.telefono.replace(/\D/g, '')}?text=${waText}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Pedido {pedido.numero_pedido}</h1>
        <Link href="/admin/pedidos" className="text-sm font-semibold text-cyan-700 hover:text-cyan-900">
          Volver a pedidos
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Detalle</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <p><span className="font-semibold">Cliente:</span> {pedido.nombre_cliente}</p>
            <p><span className="font-semibold">Telefono:</span> {pedido.telefono}</p>
            <p><span className="font-semibold">Metodo de pago:</span> {pedido.metodo_pago}</p>
            <p><span className="font-semibold">Estado:</span> {pedido.estado}</p>
            <p><span className="font-semibold">Total:</span> S/ {Number(pedido.total).toFixed(2)}</p>
            {pedido.notas && <p><span className="font-semibold">Notas:</span> {pedido.notas}</p>}
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-cyan-800">Items</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-cyan-100">
            <table className="w-full text-sm">
              <thead className="bg-cyan-50 text-left text-cyan-900">
                <tr>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((item) => (
                  <tr key={item.id} className="border-t border-cyan-100">
                    <td className="px-3 py-2">{item.nombre_producto}</td>
                    <td className="px-3 py-2">{item.cantidad}</td>
                    <td className="px-3 py-2">S/ {Number(item.precio_unitario).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-4">
          <EstadoPedidoForm id={pedido.id} estadoActual={pedido.estado} />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center rounded-xl border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
          >
            Contactar por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  )
}
