import CheckoutClient from '@/app/checkout/CheckoutClient'

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-cyan-950">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">Completa tus datos y confirma tu pedido.</p>
      <div className="mt-6">
        <CheckoutClient />
      </div>
    </div>
  )
}
