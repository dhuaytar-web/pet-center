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
      ? 'text-white bg-[#233f3a] border-[#233f3a] shadow-sm'
      : 'text-[#46392f] border-transparent hover:text-[#8b3d17] hover:bg-[#fff8ef]'
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#d7c4ae]/70 bg-[#fffaf2]/88 backdrop-blur-xl">
      <nav className="container-pet flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#1d4f47] to-[#c8571a] text-white shadow-md shadow-[#c7ab8f]/60">
            <Stethoscope size={20} />
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-wide text-[#241f1a]">PET CENTER</p>
            <p className="text-sm text-[#6a5a4b]">Clinica y pet shop en Tacna</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-2 rounded-2xl border border-[#d7c4ae]/80 bg-[#fff5ea]/85 p-1.5 text-base font-semibold md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-xl border px-3.5 py-2.5 transition-colors ${linkClass(link.href)}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/carrito"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7c4ae] bg-white text-[#1d4f47] transition-colors hover:bg-[#fff6ec]"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={20} />
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c8571a] px-1 text-[11px] font-semibold text-white">
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
                className={`inline-flex rounded-full border px-3.5 py-2 text-sm font-semibold ${linkClass(link.href)}`}
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
