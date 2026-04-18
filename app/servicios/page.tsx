const servicios = [
  {
    nombre: 'Consulta veterinaria',
    precio: 'Desde S/ 45',
    mensaje: 'Hola! Quiero agendar una consulta veterinaria en PET CENTER.',
  },
  {
    nombre: 'Bano y corte',
    precio: 'Desde S/ 35',
    mensaje: 'Hola! Quiero agendar bano y corte para mi mascota en PET CENTER.',
  },
  {
    nombre: 'Vacunacion',
    precio: 'Desde S/ 60',
    mensaje: 'Hola! Quiero informacion y cita para vacunacion en PET CENTER.',
  },
]

export default function ServiciosPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51912345678'

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-cyan-950">Servicios</h1>
      <p className="mt-2 text-sm text-slate-600">
        Agenda por WhatsApp en segundos. Te confirmamos disponibilidad y horario.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {servicios.map((servicio) => {
          const href = `https://wa.me/${phone}?text=${encodeURIComponent(servicio.mensaje)}`
          return (
            <article key={servicio.nombre} className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{servicio.nombre}</h2>
              <p className="mt-1 text-sm text-cyan-800">{servicio.precio}</p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
              >
                Agendar por WhatsApp
              </a>
            </article>
          )
        })}
      </div>
    </div>
  )
}
