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
}

export default function Filtros({ basePath, paramName, opciones, selected, query }: FiltrosProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`${basePath}${query ? `?q=${encodeURIComponent(query)}` : ''}`}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
          !selected
            ? 'border-cyan-600 bg-cyan-600 text-white'
            : 'border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-50'
        }`}
      >
        Todos
      </Link>

      {opciones.map((opcion) => {
        const active = selected === opcion.value
        const params = new URLSearchParams()
        params.set(paramName, opcion.value)
        if (query) params.set('q', query)

        return (
          <Link
            key={opcion.value}
            href={`${basePath}?${params.toString()}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'border-cyan-600 bg-cyan-600 text-white'
                : 'border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-50'
            }`}
          >
            {opcion.label}
          </Link>
        )
      })}
    </div>
  )
}
