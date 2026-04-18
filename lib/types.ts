export type Categoria = {
  id: string
  nombre: string
  slug: string
  icono: string | null
  orden: number
  activo: boolean
}

export type Subcategoria = {
  id: string
  categoria_id: string
  nombre: string
  slug: string
}

export type Producto = {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  precio: number
  disponible: boolean
  categoria_id: string
  subcategoria_id: string | null
  imagen_url: string | null
  recomendacion_medica: string | null
  aviso_legal: boolean
  destacado: boolean
  activo: boolean
  created_at: string
  categoria?: Categoria
  subcategoria?: Subcategoria
}

export type PedidoItem = {
  id: string
  pedido_id: string
  producto_id: string
  nombre_producto: string
  precio_unitario: number
  cantidad: number
}

export type Pedido = {
  id: string
  numero_pedido: string
  nombre_cliente: string
  telefono: string
  metodo_pago: 'yape' | 'plin' | 'efectivo_tienda'
  metodo_entrega: 'recojo_tienda'
  estado: 'pendiente' | 'confirmado' | 'listo' | 'entregado' | 'cancelado'
  total: number
  notas: string | null
  created_at: string
  updated_at: string
  pedido_items?: PedidoItem[]
}

export type CartItem = {
  producto: Producto
  cantidad: number
}