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
    <footer className="mt-20 border-t border-cyan-100 bg-gradient-to-b from-cyan-50/30 to-cyan-50/80">
      <div className="container-pet grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h2 className="text-lg font-bold tracking-wide text-cyan-900">PET CENTER</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Tu veterinaria de confianza en Tacna para medicamentos, nutricion y accesorios para mascotas.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-800">Enlaces</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-cyan-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-800">Contacto</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-cyan-700" />
              <span>Av. Bolognesi 123, Tacna, Peru</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-cyan-700" />
              <span>+51 912 345 678</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 size={16} className="mt-0.5 text-cyan-700" />
              <span>Lun-Sab 9:00 a.m. - 7:00 p.m.</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-cyan-100/80">
        <div className="container-pet flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} PET CENTER. Todos los derechos reservados.</span>
          <Link href="/acceso-admin" className="font-semibold text-cyan-700 hover:text-cyan-900">
            Acceso administradores
          </Link>
        </div>
      </div>
    </footer>
  )
}
