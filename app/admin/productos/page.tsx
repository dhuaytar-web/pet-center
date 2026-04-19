import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminProductosTable from '@/components/admin/AdminProductosTable'

type ProductoRow = {
  id: string
  nombre: string
  slug: string
  precio: number
  categoria_id: string
  activo: boolean
  disponible?: boolean
  stock?: number
  descripcion?: string | null
  subcategoria_id?: string | null
  imagen_url?: string | null
  destacado?: boolean
  aviso_legal?: boolean
  recomendacion_medica?: string | null
}

export default async function AdminProductosPage() {
  const supabase = createAdminClient()
  if (!supabase) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Falta configurar SUPABASE_SERVICE_ROLE_KEY para mostrar el panel administrativo.
        </p>
      </div>
    )
  }

  const { data, error } = await supabase
    .from('productos')
    .select('id,nombre,slug,precio,categoria_id,activo,disponible,stock,descripcion,subcategoria_id,imagen_url,destacado,aviso_legal,recomendacion_medica')
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

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudieron cargar productos: {error.message}
        </p>
      )}

      <AdminProductosTable productos={productos} />
    </div>
  )
}
