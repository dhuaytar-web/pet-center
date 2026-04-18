import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from '@/components/store/Footer'
import Navbar from '@/components/store/Navbar'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import { CartProvider } from '@/lib/CartContext'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${poppins.variable} antialiased`}>
        <CartProvider>
          <div className="min-h-screen bg-white text-slate-900">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}