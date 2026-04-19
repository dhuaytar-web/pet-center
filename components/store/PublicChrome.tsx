'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/store/Footer'
import Navbar from '@/components/store/Navbar'
import { ToastHost, ToastProvider } from '@/components/ui/Toast'
import WhatsAppButton from '@/components/store/WhatsAppButton'

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <ToastProvider>
      <div className="min-h-screen text-slate-900">
        {!isAdminRoute && <Navbar />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppButton />}
        <ToastHost />
      </div>
    </ToastProvider>
  )
}
