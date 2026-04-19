import { notFound } from 'next/navigation'
import ProductoForm from '@/app/admin/productos/[id]/ProductoForm'
import { createAdminClient } from '@/lib/supabase/admin'

type AdminProductoEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminProductoEditPage({ params }: AdminProductoEditPageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  if (!supabase) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Gestion de producto</h1>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Falta configurar SUPABASE_SERVICE_ROLE_KEY para usar el panel administrativo.
        </p>
      </div>
    )
  }

  const [{ data: categorias, error: categoriasError }, { data: subcategorias, error: subcategoriasError }] = await Promise.all([
    supabase.from('categorias').select('id,nombre').eq('activo', true).order('orden', { ascending: true }),
    supabase.from('subcategorias').select('id,nombre,categoria_id').order('nombre', { ascending: true }),
  ])

  const categoriasList = categorias ?? []
  const subcategoriasList = subcategorias ?? []

  if (categoriasError || subcategoriasError) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Gestion de producto</h1>
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudieron cargar categorias/subcategorias para el formulario.
        </p>
      </div>
    )
  }

  if (id === 'new') {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Nuevo producto</h1>
        <ProductoForm categorias={categoriasList} subcategorias={subcategoriasList} />
      </div>
    )
  }

  const { data } = await supabase
    .from('productos')
    .select('id,nombre,slug,descripcion,precio,categoria_id,subcategoria_id,imagen_url,destacado,activo,disponible,stock,aviso_legal,recomendacion_medica')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()

  const disponible = typeof data.disponible === 'boolean' ? data.disponible : (data.stock ?? 0) > 0

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Editar producto</h1>
      <ProductoForm
        id={id}
        categorias={categoriasList}
        subcategorias={subcategoriasList}
        initialValues={{
          nombre: data.nombre,
          slug: data.slug,
          descripcion: data.descripcion,
          precio: Number(data.precio),
          categoria_id: data.categoria_id,
          subcategoria_id: data.subcategoria_id,
          stock: data.stock ?? 0,
          imagen_url: data.imagen_url,
          destacado: data.destacado,
          activo: data.activo,
          disponible,
          aviso_legal: data.aviso_legal,
          recomendacion_medica: data.recomendacion_medica,
        }}
      />
    </div>
  )
}
