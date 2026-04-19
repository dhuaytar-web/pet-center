import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyOwnerNewOrder } from '@/lib/notifications'

type CreatePedidoBody = {
  nombre_cliente: string
  telefono: string
  metodo_pago: 'yape' | 'plin' | 'efectivo_tienda'
  metodo_entrega: 'recojo_tienda'
  total: number
  notas?: string | null
  items: Array<{
    producto_id: string
    nombre_producto: string
    precio_unitario: number
    cantidad: number
  }>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePedidoBody

    if (!body.nombre_cliente || !body.telefono || !body.items?.length) {
      return NextResponse.json({ error: 'Datos incompletos del pedido.' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || (!serviceRole && !anon)) {
      return NextResponse.json({ error: 'Variables de Supabase incompletas.' }, { status: 500 })
    }

    const supabase = createClient(url, serviceRole ?? anon!)

    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        nombre_cliente: body.nombre_cliente,
        telefono: body.telefono,
        metodo_pago: body.metodo_pago,
        metodo_entrega: body.metodo_entrega,
        total: body.total,
        notas: body.notas ?? null,
      })
      .select('id, numero_pedido')
      .single()

    if (pedidoError || !pedido) {
      return NextResponse.json({ error: pedidoError?.message ?? 'No se pudo crear el pedido.' }, { status: 500 })
    }

    const itemsPayload = body.items.map((item) => ({
      pedido_id: pedido.id,
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      precio_unitario: item.precio_unitario,
      cantidad: item.cantidad,
    }))

    const { error: itemsError } = await supabase.from('pedido_items').insert(itemsPayload)
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Notificacion best-effort: nunca bloquea la creacion de pedido.
    const itemsText = body.items
      .map((item) => `${item.nombre_producto} x${item.cantidad}`)
      .slice(0, 6)
      .join(', ')

    await notifyOwnerNewOrder({
      numeroPedido: pedido.numero_pedido,
      cliente: body.nombre_cliente,
      telefono: body.telefono,
      total: Number(body.total),
      metodoPago: body.metodo_pago,
      itemsText,
    })

    return NextResponse.json({ numero_pedido: pedido.numero_pedido })
  } catch {
    return NextResponse.json({ error: 'Error inesperado al crear el pedido.' }, { status: 500 })
  }
}
