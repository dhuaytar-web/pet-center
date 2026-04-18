import { notFound } from 'next/navigation'
import ProductoForm from '@/app/admin/productos/[id]/ProductoForm'
import { createClient } from '@/lib/supabase/server'

type AdminProductoEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminProductoEditPage({ params }: AdminProductoEditPageProps) {
  const { id } = await params

  if (id === 'new') {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Nuevo producto</h1>
        <ProductoForm />
      </div>
    )
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('id,nombre,slug,descripcion,precio,activo,disponible,stock,aviso_legal,recomendacion_medica')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()

  const disponible = typeof data.disponible === 'boolean' ? data.disponible : (data.stock ?? 0) > 0

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Editar producto</h1>
      <ProductoForm
        id={id}
        initialValues={{
          nombre: data.nombre,
          slug: data.slug,
          descripcion: data.descripcion,
          precio: Number(data.precio),
          activo: data.activo,
          disponible,
          aviso_legal: data.aviso_legal,
          recomendacion_medica: data.recomendacion_medica,
        }}
      />
    </div>
  )
}
