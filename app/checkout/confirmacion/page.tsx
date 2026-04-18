import Link from 'next/link'

type ConfirmacionPageProps = {
  searchParams: Promise<{ pedido?: string }>
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const params = await searchParams
  const numero = params.pedido ?? 'PET-0000-000'

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-cyan-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">Pedido confirmado</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Gracias por tu compra</h1>
        <p className="mt-3 text-sm text-slate-600">Tu numero de pedido es:</p>
        <p className="mt-2 text-2xl font-extrabold text-cyan-900">{numero}</p>
        <p className="mt-4 text-sm text-slate-600">
          Te contactaremos por WhatsApp para confirmar y coordinar el recojo en tienda.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/farmacia"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
