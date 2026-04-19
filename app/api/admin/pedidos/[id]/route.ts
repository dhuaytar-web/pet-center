import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin-auth'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const sessionClient = await createSessionClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const supabase = getAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Config Supabase incompleta.' }, { status: 500 })

  const { id } = await context.params

  const [{ data: pedido, error: pedidoError }, { data: pedidoItems, error: itemsError }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('id,numero_pedido,nombre_cliente,telefono,total,estado,metodo_pago,metodo_entrega,notas,created_at,updated_at')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('pedido_items').select('id,nombre_producto,precio_unitario,cantidad').eq('pedido_id', id),
  ])

  if (pedidoError) {
    return NextResponse.json({ error: pedidoError.message }, { status: 500 })
  }

  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 })
  }

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  return NextResponse.json({
    pedido: {
      ...pedido,
      pedido_items: pedidoItems ?? [],
    },
  })
}