import CheckoutClient from '@/app/checkout/CheckoutClient'

export default function CheckoutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero p-6 sm:p-8">
        <p className="tag-pill">Checkout</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Finaliza tu compra</h1>
        <p className="mt-2 text-sm text-slate-600">Completa tus datos, elige pago y confirma tu pedido.</p>
      </section>
      <div className="mt-6">
        <CheckoutClient />
      </div>
    </div>
  )
}
