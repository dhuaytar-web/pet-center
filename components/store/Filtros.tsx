import Link from 'next/link'

type OpcionFiltro = {
  label: string
  value: string
}

type FiltrosProps = {
  basePath: string
  paramName: string
  opciones: OpcionFiltro[]
  selected?: string
  query?: string
  extraParams?: Record<string, string | undefined>
}

export default function Filtros({ basePath, paramName, opciones, selected, query, extraParams }: FiltrosProps) {
  const applyExtraParams = (params: URLSearchParams) => {
    if (!extraParams) return

    for (const [key, value] of Object.entries(extraParams)) {
      if (value) {
        params.set(key, value)
      }
    }
  }

  const allParams = new URLSearchParams()
  if (query) allParams.set('q', query)
  applyExtraParams(allParams)

  return (
    <div className="flex flex-wrap gap-2.5">
      <Link
        href={`${basePath}${allParams.toString() ? `?${allParams.toString()}` : ''}`}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          !selected
            ? 'border-teal-700 bg-teal-700 text-white'
            : 'border-slate-300 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-900'
        }`}
      >
        Todos
      </Link>

      {opciones.map((opcion) => {
        const active = selected === opcion.value
        const params = new URLSearchParams()
        params.set(paramName, opcion.value)
        if (query) params.set('q', query)
        applyExtraParams(params)

        return (
          <Link
            key={opcion.value}
            href={`${basePath}?${params.toString()}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-900'
            }`}
          >
            {opcion.label}
          </Link>
        )
      })}
    </div>
  )
}
