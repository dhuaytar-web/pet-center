import SubcategoriaForm from '@/app/admin/subcategorias/SubcategoriaForm'
import { createAdminClient } from '@/lib/supabase/admin'

type CategoriaRow = {
  id: string
  nombre: string
}

type SubcategoriaRow = {
  id: string
  nombre: string
  slug: string
  categoria_id: string
}

export default async function AdminSubcategoriasPage() {
  const supabase = createAdminClient()

  if (!supabase) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Subcategorias</h1>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Falta configurar SUPABASE_SERVICE_ROLE_KEY para usar el panel administrativo.
        </p>
      </div>
    )
  }

  const [{ data: categorias, error: categoriasError }, { data: subcategorias, error: subcategoriasError }] = await Promise.all([
    supabase.from('categorias').select('id,nombre').eq('activo', true).order('orden', { ascending: true }),
    supabase.from('subcategorias').select('id,nombre,slug,categoria_id').order('nombre', { ascending: true }),
  ])

  if (categoriasError || subcategoriasError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Subcategorias</h1>
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudieron cargar las subcategorias. Revisa permisos/tablas en Supabase.
        </p>
      </div>
    )
  }

  const categoriasList = (categorias as CategoriaRow[] | null) ?? []
  const subcategoriasList = (subcategorias as SubcategoriaRow[] | null) ?? []
  const categoriasById = new Map(categoriasList.map((categoria) => [categoria.id, categoria.nombre]))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Subcategorias</h1>

      <SubcategoriaForm categorias={categoriasList} />

      <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-sm">
        <table className="w-full min-w-160 text-sm">
          <thead className="bg-cyan-50 text-left text-cyan-900">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Identificador URL</th>
              <th className="px-4 py-3">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {subcategoriasList.map((subcategoria) => (
              <tr key={subcategoria.id} className="border-t border-cyan-100">
                <td className="px-4 py-3 font-medium text-slate-900">{subcategoria.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{subcategoria.slug}</td>
                <td className="px-4 py-3 text-slate-700">{categoriasById.get(subcategoria.categoria_id) ?? 'Sin categoria'}</td>
              </tr>
            ))}

            {subcategoriasList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No hay subcategorias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
