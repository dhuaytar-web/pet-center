import type { Metadata } from 'next'
import { Nunito, Poppins } from 'next/font/google'
import PublicChrome from '../components/store/PublicChrome'
import { CartProvider } from '@/lib/CartContext'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'PET CENTER — Veterinaria en Tacna',
  description: 'Productos veterinarios, alimentos y accesorios para tu mascota en Tacna, Perú.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} ${poppins.variable} antialiased`}>
        <CartProvider>
          <PublicChrome>{children}</PublicChrome>
        </CartProvider>
      </body>
    </html>
  )
}