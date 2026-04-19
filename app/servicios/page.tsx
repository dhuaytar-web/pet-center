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
    <div className="page-shell">
      <section className="page-hero p-6 sm:p-8">
        <p className="tag-pill">Servicios veterinarios</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Agenda en minutos por WhatsApp</h1>
        <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Te confirmamos disponibilidad, horario y costo sin llamadas ni tiempos de espera innecesarios.
        </p>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {servicios.map((servicio) => {
          const href = `https://wa.me/${phone}?text=${encodeURIComponent(servicio.mensaje)}`
          return (
            <article key={servicio.nombre} className="surface-card rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">{servicio.nombre}</h2>
              <p className="mt-1 text-sm font-semibold text-teal-800">{servicio.precio}</p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-2xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
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
