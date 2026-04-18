import { MessageCircle } from 'lucide-react'

const DEFAULT_MESSAGE = 'Hola! Tengo una consulta sobre un producto de PET CENTER.'

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51912345678'
  const message = encodeURIComponent(DEFAULT_MESSAGE)
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-300/60 transition-transform hover:scale-105"
    >
      <MessageCircle size={24} />
    </a>
  )
}
