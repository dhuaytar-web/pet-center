'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type CatalogSearchBarProps = {
  placeholder: string
  initialValue?: string
  queryKey?: string
}

export default function CatalogSearchBar({ placeholder, initialValue = '', queryKey = 'q' }: CatalogSearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const current = new URLSearchParams(searchParams.toString())
      const nextValue = value.trim()

      if (nextValue) {
        current.set(queryKey, nextValue)
      } else {
        current.delete(queryKey)
      }

      current.delete('page')

      const query = current.toString()
      const href = query ? `${pathname}?${query}` : pathname

      startTransition(() => {
        router.replace(href, { scroll: false })
      })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [value, pathname, queryKey, router, searchParams])

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-busy={isPending}
        className="w-full rounded-lg border border-[#32424b] bg-[#0f1418] px-4 py-3 text-sm text-white outline-none ring-[#0f766e] focus:ring-2"
      />
      {isPending ? (
        <div className="rounded-lg bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white opacity-90">Buscando...</div>
      ) : null}
    </div>
  )
}
