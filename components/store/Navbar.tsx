'use client'

import Link from 'next/link'
import { ShoppingCart, Stethoscope } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/farmacia', label: 'Farmacia' },
  { href: '/nutricion', label: 'Nutricion' },
  { href: '/accesorios', label: 'Accesorios' },
  { href: '/servicios', label: 'Servicios' },
]

export default function Navbar() {
  const { itemsCount } = useCart()
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return isActive
      ? 'text-cyan-800 bg-cyan-50 border-cyan-200'
      : 'text-slate-700 border-transparent hover:text-cyan-700 hover:bg-cyan-50/70'
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-100 bg-white/90 backdrop-blur">
      <nav className="container-pet flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-600 text-white">
            <Stethoscope size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-cyan-900">PET CENTER</p>
            <p className="text-xs text-cyan-700">Veterinaria en Tacna</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-2 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-xl border px-3 py-2 transition-colors ${linkClass(link.href)}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/carrito"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200 text-cyan-800 transition-colors hover:bg-cyan-50"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={18} />
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-[11px] font-semibold text-white">
            {itemsCount}
          </span>
        </Link>
      </nav>

      <div className="container-pet pb-3 md:hidden">
        <ul className="flex gap-2 overflow-x-auto whitespace-nowrap">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${linkClass(link.href)}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
