import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyCustomerOrderStatus } from '@/lib/notifications'

type EstadoPedido = 'pendiente' | 'confirmado' | 'listo' | 'entregado' | 'cancelado'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null
  return createClient(url, key)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const { id } = await context.params
  const body = (await request.json()) as { estado: EstadoPedido }

  if (!body.estado) {
    return NextResponse.json({ error: 'Estado invalido.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('pedidos')
    .update({ estado: body.estado, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('telefono, numero_pedido')
    .eq('id', id)
    .maybeSingle()

  if (pedido?.telefono && pedido?.numero_pedido) {
    await notifyCustomerOrderStatus({
      telefono: pedido.telefono,
      numeroPedido: pedido.numero_pedido,
      estado: body.estado,
    })
  }

  return NextResponse.json({ ok: true })
}
