import Link from 'next/link'
import { HeartPulse, Pill, Salad, ShieldCheck, Sparkles, Tags } from 'lucide-react'

const categorias = [
  {
    href: '/farmacia',
    titulo: 'Farmacia',
    descripcion: 'Medicamentos y antipulgas para el cuidado diario.',
    icon: Pill,
  },
  {
    href: '/nutricion',
    titulo: 'Nutricion',
    descripcion: 'Alimentos balanceados para cada etapa de vida.',
    icon: Salad,
  },
  {
    href: '/accesorios',
    titulo: 'Accesorios',
    descripcion: 'Todo para el confort y bienestar de tu mascota.',
    icon: Tags,
  },
  {
    href: '/servicios',
    titulo: 'Servicios',
    descripcion: 'Consulta y atencion veterinaria en un solo lugar.',
    icon: HeartPulse,
  },
]

const destacados = [
  { nombre: 'Antipulgas Spot On', precio: 'S/ 49.90', estado: 'Disponible' },
  { nombre: 'ProPlan Adulto Raza Mediana', precio: 'S/ 129.00', estado: 'Disponible' },
  { nombre: 'Shampoo Dermatologico Canino', precio: 'S/ 38.00', estado: 'Disponible' },
]

export default function Home() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: 'PET CENTER',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Bolognesi 123',
      addressLocality: 'Tacna',
      addressCountry: 'PE',
    },
    telephone: '+51912345678',
    areaServed: 'Tacna',
  }

  return (
    <div className="pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <section className="relative overflow-hidden border-b border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-emerald-50">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="container-pet relative flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800">
              <ShieldCheck size={14} />
              Veterinaria en Tacna
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-cyan-950 sm:text-5xl lg:text-6xl">
              Compra para tu mascota con la confianza de tu vet de barrio.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Medicamentos, alimentos y accesorios con recojo rapido en tienda. Paga con Yape,
              Plin o efectivo al recoger.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/farmacia"
                className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
              >
                Ver productos
              </Link>
              <Link
                href="/servicios"
                className="rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-cyan-900 transition-colors hover:bg-cyan-50"
              >
                Agendar servicio
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-cyan-900">Atencion de hoy</p>
            <p className="mt-1 text-sm text-slate-600">Lun-Sab 9:00 a.m. - 7:00 p.m.</p>
            <div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              <p className="font-semibold">Recojo en tienda</p>
              <p className="mt-1">Av. Bolognesi 123, Tacna</p>
            </div>
            <p className="mt-4 text-xs text-slate-500">Confirmacion de pedidos por WhatsApp.</p>
          </div>
        </div>
      </section>

      <section className="container-pet py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Categorias principales</h2>
          <Sparkles className="text-cyan-600" size={20} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((categoria) => {
            const Icon = categoria.icon
            return (
              <Link
                key={categoria.href}
                href={categoria.href}
                className="group flex h-full flex-col rounded-3xl border border-cyan-100 bg-white p-5 transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{categoria.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{categoria.descripcion}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-cyan-50/70 py-14">
        <div className="container-pet">
          <h2 className="text-2xl font-bold text-slate-900">Productos destacados</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {destacados.map((producto) => (
              <article key={producto.nombre} className="flex h-full flex-col rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
                <div className="mb-4 h-36 rounded-2xl bg-linear-to-br from-slate-50 to-cyan-50" />
                <p className="text-sm font-medium text-slate-900">{producto.nombre}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="text-base font-bold text-cyan-800">{producto.precio}</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {producto.estado}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pet py-14">
        <div className="rounded-3xl border border-cyan-200 bg-cyan-600 p-6 text-white sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-100">MVP PET CENTER</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Compra online y recoge en local, rapido y sin llamadas.</h2>
          <p className="mt-3 max-w-2xl text-cyan-50">
            Haz tu pedido en minutos y te confirmamos por WhatsApp. Sin colas, sin esperas y con
            asesoramiento veterinario confiable.
          </p>
        </div>
      </section>
    </div>
  )
}
