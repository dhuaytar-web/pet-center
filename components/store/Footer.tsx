import Link from 'next/link'
import { Clock3, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { href: '/farmacia', label: 'Farmacia' },
  { href: '/nutricion', label: 'Nutricion' },
  { href: '/accesorios', label: 'Accesorios' },
  { href: '/servicios', label: 'Servicios' },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#d7c4ae] bg-linear-to-b from-[#fffaf2] via-[#f7efe6] to-[#efe2d5]">
      <div className="container-pet grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h2 className="text-xl font-bold tracking-wide text-[#241f1a]">PET CENTER</h2>
          <p className="mt-3 text-base leading-7 text-[#5a4b3e]">
            Tu veterinaria de confianza en Tacna para medicamentos, nutricion y accesorios para mascotas.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1d4f47]">Enlaces</h3>
          <ul className="mt-3 space-y-2 text-base text-[#4f4338]">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#8b3d17]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1d4f47]">Contacto</h3>
          <ul className="mt-3 space-y-3 text-base text-[#4f4338]">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-[#1d4f47]" />
              <span>Av. Bolognesi 123, Tacna, Peru</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-[#1d4f47]" />
              <span>+51 912 345 678</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 size={16} className="mt-0.5 text-[#1d4f47]" />
              <span>Lun-Sab 9:00 a.m. - 7:00 p.m.</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-[#d7c4ae]/80">
        <div className="container-pet flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-[#6a5a4b]">
          <span>© {new Date().getFullYear()} PET CENTER. Todos los derechos reservados.</span>
          <Link href="/acceso-admin" className="font-semibold text-[#1d4f47] hover:text-[#082a27]">
            Acceso administradores
          </Link>
        </div>
      </div>
    </footer>
  )
}
