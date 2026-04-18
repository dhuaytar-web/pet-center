import CarritoClient from '@/app/carrito/CarritoClient'

export default function CarritoPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-cyan-950">Carrito</h1>
      <p className="mt-2 text-sm text-slate-600">Revisa tus productos antes de confirmar el pedido.</p>
      <div className="mt-6">
        <CarritoClient />
      </div>
    </div>
  )
}
