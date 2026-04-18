import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type ProductoPayload = {
  id?: string
  nombre: string
  slug: string
  descripcion?: string
  precio: number
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
  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const body = (await request.json()) as ProductoPayload

  const payload = {
    nombre: body.nombre,
    slug: body.slug,
    descripcion: body.descripcion || null,
    precio: body.precio,
    activo: body.activo,
    disponible: body.disponible,
    aviso_legal: body.aviso_legal,
    recomendacion_medica: body.recomendacion_medica || null,
  }

  const { error } = await supabase.from('productos').insert(payload)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const body = (await request.json()) as ProductoPayload
  if (!body.id) return NextResponse.json({ error: 'Falta id de producto.' }, { status: 400 })

  const payload = {
    nombre: body.nombre,
    slug: body.slug,
    descripcion: body.descripcion || null,
    precio: body.precio,
    activo: body.activo,
    disponible: body.disponible,
    aviso_legal: body.aviso_legal,
    recomendacion_medica: body.recomendacion_medica || null,
  }

  const { error } = await supabase.from('productos').update(payload).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
