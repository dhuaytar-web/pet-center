import Link from 'next/link'

type ConfirmacionPageProps = {
  searchParams: Promise<{ pedido?: string }>
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const params = await searchParams
  const numero = params.pedido ?? 'PET-0000-000'
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51912345678'
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(`Hola! Mi pedido es #${numero}`)}`

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-14 sm:px-6">
      <div className="w-full rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E1F5EE]">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
            <path d="M5 12.5L10 17L19 8" stroke="#1D9E75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-display mt-3 text-[15px] font-bold text-gray-900">¡Pedido recibido!</h1>
        <p className="mt-1 text-sm text-gray-500">Numero de pedido</p>
        <p className="mt-1 text-lg font-bold text-(--pet-green-dark)">{numero}</p>

        <div className="mt-4 rounded-xl bg-[#E1F5EE] p-3 text-[11.5px] leading-relaxed text-[#085041]">
          Si pagaste por Yape/Plin, envia tu comprobante por WhatsApp para confirmar mas rapido.
        </div>

        <div className="mt-5 space-y-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
          >
            Enviar comprobante por WhatsApp
          </a>
          <Link href="/" className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 py-2.5 text-sm font-semibold text-gray-700">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
