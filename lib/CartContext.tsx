'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { CartItem, Producto } from '@/lib/types'

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { producto: Producto; cantidad: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_QTY'; payload: { productId: string; cantidad: number } }
  | { type: 'CLEAR' }

const STORAGE_KEY = 'petcenter_cart'

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload }
    case 'ADD_ITEM': {
      const incomingQty = Math.max(1, Math.min(99, action.payload.cantidad))
      const existing = state.items.find((item) => item.producto.id === action.payload.producto.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.producto.id === action.payload.producto.id
              ? { ...item, cantidad: Math.min(item.cantidad + incomingQty, 99) }
              : item
          ),
        }
      }

      return {
        items: [...state.items, { producto: action.payload.producto, cantidad: incomingQty }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.producto.id !== action.payload),
      }
    case 'SET_QTY':
      return {
        items: state.items
          .map((item) =>
            item.producto.id === action.payload.productId
              ? { ...item, cantidad: Math.max(1, Math.min(99, action.payload.cantidad)) }
              : item
          )
          .filter((item) => item.cantidad > 0),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  itemsCount: number
  subtotal: number
  addItem: (producto: Producto, cantidad?: number) => void
  removeItem: (productId: string) => void
  setQty: (productId: string, cantidad: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const isHydratedRef = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      if (Array.isArray(parsed)) {
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      // Ignore invalid localStorage payloads.
    }

    isHydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!isHydratedRef.current) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const value = useMemo<CartContextValue>(() => {
    const itemsCount = state.items.reduce((acc, item) => acc + item.cantidad, 0)
    const subtotal = state.items.reduce((acc, item) => acc + Number(item.producto.precio) * item.cantidad, 0)

    return {
      items: state.items,
      itemsCount,
      subtotal,
      addItem: (producto, cantidad = 1) => dispatch({ type: 'ADD_ITEM', payload: { producto, cantidad } }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
      setQty: (productId, cantidad) => dispatch({ type: 'SET_QTY', payload: { productId, cantidad } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
