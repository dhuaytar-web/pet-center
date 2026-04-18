import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ClipboardList, LayoutGrid, LogOut, PackagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  async function signOut() {
    'use server'
    const supabaseClient = await createClient()
    await supabaseClient.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="container-pet py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">Panel Admin</p>
          <nav className="mt-4 space-y-2">
            <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <LayoutGrid size={16} /> Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <PackagePlus size={16} /> Productos
            </Link>
            <Link href="/admin/pedidos" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <ClipboardList size={16} /> Pedidos
            </Link>
          </nav>

          <form action={signOut} className="mt-6 border-t border-cyan-100 pt-4">
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50">
              <LogOut size={16} /> Cerrar sesion
            </button>
          </form>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  )
}
