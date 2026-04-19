import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin-auth'

type SubcategoriaPayload = {
  categoria_id: string
  nombre: string
  slug: string
}

export async function POST(request: Request) {
  const sessionClient = await createSessionClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })
  }

  const body = (await request.json()) as SubcategoriaPayload

  if (!body.categoria_id?.trim() || !body.nombre?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: 'Categoria, nombre e identificador URL son obligatorios.' }, { status: 400 })
  }

  const payload = {
    categoria_id: body.categoria_id.trim(),
    nombre: body.nombre.trim(),
    slug: body.slug.trim().toLowerCase(),
  }

  const { error } = await supabase.from('subcategorias').insert(payload)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
