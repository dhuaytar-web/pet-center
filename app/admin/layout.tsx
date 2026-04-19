import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ClipboardList, FolderTree, LayoutGrid, LogOut, PackagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  async function signOut() {
    'use server'
    const supabaseClient = await createClient()
    await supabaseClient.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="container-pet py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-6 h-fit rounded-3xl border border-cyan-100 bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="rounded-2xl bg-linear-to-br from-cyan-50 to-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Panel Admin</p>
            <h1 className="mt-1 text-lg font-bold text-slate-900">PET CENTER</h1>
            <p className="mt-1 text-sm text-slate-600">Gestión rápida de catálogo y pedidos.</p>
          </div>

          <nav className="mt-4 space-y-2">
            <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <LayoutGrid size={16} /> Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <PackagePlus size={16} /> Productos
            </Link>
            <Link href="/admin/subcategorias" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50">
              <FolderTree size={16} /> Subcategorias
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
