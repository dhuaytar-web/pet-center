import CarritoClient from '@/app/carrito/CarritoClient'

export default function CarritoPage() {
  return (
    <div className="page-shell">
      <section className="page-hero p-6 sm:p-8">
        <p className="tag-pill">Mi carrito</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Revisa tu pedido</h1>
        <p className="mt-2 text-sm text-slate-600">Confirma cantidades y avanza al checkout cuando estes listo.</p>
      </section>
      <div className="mt-6">
        <CarritoClient />
      </div>
    </div>
  )
}
