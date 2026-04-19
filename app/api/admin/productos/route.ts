import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin-auth'

type ProductoPayload = {
  id?: string
  nombre: string
  slug: string
  descripcion?: string
  precio: number
  categoria_id: string
  subcategoria_id?: string
  stock?: number
  imagen_url?: string
  destacado?: boolean
  activo: boolean
  disponible: boolean
  aviso_legal: boolean
  recomendacion_medica?: string
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: Request) {
  const sessionClient = await createSessionClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const body = (await request.json()) as ProductoPayload

  if (!body.nombre?.trim() || !body.slug?.trim() || !body.categoria_id?.trim()) {
    return NextResponse.json({ error: 'Nombre, slug y categoria son obligatorios.' }, { status: 400 })
  }

  if (!Number.isFinite(body.precio) || body.precio < 0) {
    return NextResponse.json({ error: 'El precio debe ser un numero valido.' }, { status: 400 })
  }

  const payload = {
    nombre: body.nombre.trim(),
    slug: body.slug.trim(),
    descripcion: body.descripcion?.trim() || null,
    precio: body.precio,
    categoria_id: body.categoria_id,
    subcategoria_id: body.subcategoria_id?.trim() || null,
    stock: Math.max(0, Number(body.stock ?? 0)),
    imagen_url: body.imagen_url?.trim() || null,
    destacado: Boolean(body.destacado),
    activo: body.activo,
    disponible: body.disponible,
    aviso_legal: body.aviso_legal,
    recomendacion_medica: body.recomendacion_medica?.trim() || null,
  }

  const { error } = await supabase.from('productos').insert(payload)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const sessionClient = await createSessionClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const body = (await request.json()) as ProductoPayload
  if (!body.id) return NextResponse.json({ error: 'Falta id de producto.' }, { status: 400 })

  if (!body.nombre?.trim() || !body.slug?.trim() || !body.categoria_id?.trim()) {
    return NextResponse.json({ error: 'Nombre, slug y categoria son obligatorios.' }, { status: 400 })
  }

  if (!Number.isFinite(body.precio) || body.precio < 0) {
    return NextResponse.json({ error: 'El precio debe ser un numero valido.' }, { status: 400 })
  }

  const payload = {
    nombre: body.nombre.trim(),
    slug: body.slug.trim(),
    descripcion: body.descripcion?.trim() || null,
    precio: body.precio,
    categoria_id: body.categoria_id,
    subcategoria_id: body.subcategoria_id?.trim() || null,
    stock: Math.max(0, Number(body.stock ?? 0)),
    imagen_url: body.imagen_url?.trim() || null,
    destacado: Boolean(body.destacado),
    activo: body.activo,
    disponible: body.disponible,
    aviso_legal: body.aviso_legal,
    recomendacion_medica: body.recomendacion_medica?.trim() || null,
  }

  const { error } = await supabase.from('productos').update(payload).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
