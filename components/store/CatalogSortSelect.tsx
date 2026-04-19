'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useTransition } from 'react'

type CatalogSortSelectProps = {
  initialValue?: string
  variant?: 'dark' | 'light'
  queryKey?: string
}

function normalizeSort(value?: string) {
  if (value === 'precio-menor') return 'precio-menor'
  if (value === 'precio-mayor') return 'precio-mayor'
  if (value === 'mas-vendidos') return 'mas-vendidos'
  return 'destacados'
}

export default function CatalogSortSelect({
  initialValue = 'destacados',
  variant = 'light',
  queryKey = 'sort',
}: CatalogSortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const sortValue = useMemo(() => normalizeSort(initialValue), [initialValue])

  const baseClassName =
    variant === 'dark'
      ? 'rounded-md border border-[#32424b] bg-[#0f1418] px-2 py-1.5 text-sm text-white'
      : 'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800'

  return (
    <select
      value={sortValue}
      disabled={isPending}
      onChange={(event) => {
        const nextSort = normalizeSort(event.target.value)
        const current = new URLSearchParams(searchParams.toString())
        current.set(queryKey, nextSort)
        current.delete('page')

        const query = current.toString()
        const href = query ? `${pathname}?${query}` : pathname

        startTransition(() => {
          router.replace(href, { scroll: false })
        })
      }}
      className={baseClassName}
      aria-label="Ordenar catalogo"
    >
      <option value="destacados">Destacados</option>
      <option value="precio-mayor">Precio: mayor a menor</option>
      <option value="precio-menor">Precio: menor a mayor</option>
      <option value="mas-vendidos">Mas vendidos</option>
    </select>
  )
}
