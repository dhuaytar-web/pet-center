import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type ProductoRow = {
  id: string
  nombre: string
  precio: number
  activo: boolean
  disponible?: boolean
  stock?: number
}

export default async function AdminProductosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('id,nombre,precio,activo,disponible,stock')
    .order('created_at', { ascending: false })

  const productos: ProductoRow[] = (data as ProductoRow[] | null) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
        <Link href="/admin/productos/new" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
          Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-cyan-50 text-left text-cyan-900">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Disponibilidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const disponible =
                typeof producto.disponible === 'boolean' ? producto.disponible : (producto.stock ?? 0) > 0
              return (
                <tr key={producto.id} className="border-t border-cyan-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{producto.nombre}</td>
                  <td className="px-4 py-3 text-slate-700">S/ {Number(producto.precio).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${producto.activo ? 'bg-cyan-100 text-cyan-800' : 'bg-rose-100 text-rose-700'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/productos/${producto.id}`} className="text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                      Editar
                    </Link>
                  </td>
                </tr>
              )
            })}
            {productos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
