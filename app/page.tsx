import Link from 'next/link'
import { ArrowRight, HeartPulse, Pill, Salad, ShieldCheck, Sparkles, Tags } from 'lucide-react'

const categorias = [
  {
    href: '/farmacia',
    titulo: 'Farmacia',
    descripcion: 'Medicamentos, antipulgas y soporte para el cuidado diario.',
    icon: Pill,
  },
  {
    href: '/nutricion',
    titulo: 'Nutricion',
    descripcion: 'Alimentos premium por etapa, raza y necesidad clinica.',
    icon: Salad,
  },
  {
    href: '/accesorios',
    titulo: 'Accesorios',
    descripcion: 'Soluciones de confort para casa, paseo y entrenamiento.',
    icon: Tags,
  },
  {
    href: '/servicios',
    titulo: 'Servicios',
    descripcion: 'Consulta, control y atencion veterinaria en un solo lugar.',
    icon: HeartPulse,
  },
]

const destacados = [
  { nombre: 'Antipulgas Spot On Duo', precio: 'S/ 59.90', estado: 'Entrega hoy' },
  { nombre: 'ProPlan Adulto Control Peso', precio: 'S/ 139.00', estado: 'Entrega hoy' },
  { nombre: 'Shampoo Clinico Dermacare', precio: 'S/ 44.00', estado: 'Recojo express' },
]

const beneficiosRapidos = [
  'Envio rapido en Tacna y coordinacion nacional',
  'Pago seguro y confirmacion por WhatsApp',
  'Recoge en local sin colas ni llamadas',
  'Atencion veterinaria para compras sensibles',
]

const promos = [
  { titulo: 'Semana Antipulgas', ahorro: '-20%', detalle: 'Bravecto, Nexgard y mas marcas top.' },
  { titulo: 'Nutricion Premium', ahorro: '-15%', detalle: 'Alimentos clinicos y por etapa de vida.' },
]

const testimonios = [
  {
    nombre: 'Carla R.',
    texto: 'Pedi domingo por la noche y me confirmaron al toque por WhatsApp. Todo llego en excelente estado.',
  },
  {
    nombre: 'Luis M.',
    texto: 'La web es clara, los precios estan bien y lo mejor es que te asesoran cuando el producto es veterinario.',
  },
  {
    nombre: 'Andrea P.',
    texto: 'Compre alimento y antipulgas en una sola orden. Rapido, sin friccion y con seguimiento real.',
  },
]

const posts = [
  {
    titulo: 'Como elegir antipulgas segun peso y especie',
    resumen: 'Guia rapida para evitar errores de dosis y mejorar resultados desde la primera aplicacion.',
    href: '/farmacia',
  },
  {
    titulo: 'Nutricion por etapa: cachorro, adulto y senior',
    resumen: 'Que cambia en cada fase y como elegir un alimento que si aporte salud real.',
    href: '/nutricion',
  },
]

const marcas = ['Bravecto', 'Nexgard', 'ProPlan', 'Royal Canin', 'Hill\'s', 'Mimaskot']

const metricas = [
  { label: 'Clientes atendidos', value: '+2,500' },
  { label: 'Pedidos confirmados', value: '98%' },
  { label: 'Tiempo promedio', value: '15 min' },
]

const diferenciales = [
  'Asesoria veterinaria confiable',
  'Recojo y confirmacion por WhatsApp',
  'Catalogo con disponibilidad real',
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
    <div className="pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <section className="container-pet pt-8 md:pt-12">
        <div className="page-hero relative p-7 md:p-10 lg:p-12">
          <div className="hero-local-photo" aria-hidden="true" />
          <div className="absolute inset-0 bg-linear-to-r from-[#fffaf4]/96 via-[#fffaf4]/90 to-[#fffaf4]/84" aria-hidden="true" />
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="reveal-up relative z-10">
              <p className="tag-pill">
                <ShieldCheck size={13} />
                Pet center tacna
              </p>
              <h1 className="mt-5 text-4xl leading-tight text-[#1f1c19] sm:text-5xl lg:text-6xl xl:text-[4.2rem]">
                Cuidado veterinario con una experiencia de compra de verdad profesional.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f453b] md:text-xl">
                Compra farmacia, nutricion y accesorios con una interfaz clara, rapida y pensada para clientes reales. Todo conectado a tu atencion por WhatsApp.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/farmacia" className="btn-primary">
                  Ver tienda
                </Link>
                <Link href="/servicios" className="btn-secondary">
                  Reservar servicios
                </Link>
              </div>

              <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
                {diferenciales.map((item) => (
                  <article key={item} className="rounded-2xl border border-[#d8c8b4] bg-white/70 px-4 py-3 text-sm font-semibold text-[#4a3d31]">
                    {item}
                  </article>
                ))}
              </div>
            </div>

            <div className="reveal-up-delay relative z-10 grid gap-3.5">
              <article className="rounded-3xl border border-[#d8c8b4] bg-[#fff5ea]/97 p-5 shadow-lg shadow-[#b87b4a]/10">
                <p className="text-sm font-semibold leading-6 tracking-[0.06em] text-[#8a5b36]">Atencion activa</p>
                <h2 className="mt-1 text-2xl font-bold text-[#2a211a]">Hoy hasta las 7:00 p.m.</h2>
                <p className="mt-2 text-sm text-[#5a4b3e]">Av. Bolognesi 123, Tacna. Confirmamos pedidos en pocos minutos.</p>
                <Link href="/servicios" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#9b3e15]">
                  Agendar ahora
                  <ArrowRight size={16} />
                </Link>
              </article>

              {metricas.map((item) => (
                <article key={item.label} className="surface-card rounded-3xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#816a54]">{item.label}</p>
                  <p className="mt-1 text-3xl font-extrabold text-[#1f1c19]">{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-pet py-6">
        <div className="grid gap-3 rounded-3xl border border-[#d8c8b4] bg-[#fff8f1] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
          {beneficiosRapidos.map((item) => (
            <p key={item} className="rounded-2xl border border-[#e5d6c5] bg-white px-3 py-2 text-sm font-semibold text-[#4c4034]">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="container-pet py-16 lg:py-20">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-3xl text-[#1f1c19]">Navega por categoria</h2>
          <Sparkles className="text-[#b44918]" size={20} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((categoria) => {
            const Icon = categoria.icon
            return (
              <Link
                key={categoria.href}
                href={categoria.href}
                className="surface-card group flex h-full flex-col rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-[#cf8454]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e4d3] text-[#9e4319]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-2xl text-[#1f1c19]">{categoria.titulo}</h3>
                <p className="mt-2 text-base leading-7 text-[#5a4b3e]">{categoria.descripcion}</p>
                <p className="mt-5 text-sm font-semibold text-[#9b3e15]">Explorar categoria</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-linear-to-b from-transparent via-[#f9f1e8] to-transparent py-16">
        <div className="container-pet">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl text-[#1f1c19]">Productos destacados</h2>
            <Link href="/farmacia" className="text-sm font-bold text-[#9b3e15]">
              Ver catalogo completo
            </Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <article className="rounded-3xl border border-[#cfb89f] bg-linear-to-br from-[#3a2a1f] via-[#5b3a26] to-[#2f241d] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffd9b9]">Campana activa</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight">Descuentos veterinarios para compras de hoy</h3>
              <p className="mt-3 max-w-xl text-[#f7ece2]">
                Promociones reales en antipulgas, nutricion clinica y cuidado dermatologico con confirmacion inmediata por WhatsApp.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {promos.map((promo) => (
                  <div key={promo.titulo} className="rounded-2xl border border-[#83614a] bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ffd9b9]">{promo.titulo}</p>
                    <p className="mt-1 text-2xl font-extrabold">{promo.ahorro}</p>
                    <p className="mt-1 text-sm text-[#f7ece2]">{promo.detalle}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {destacados.map((producto) => (
                <article key={producto.nombre} className="surface-card flex h-full flex-col rounded-3xl p-6">
                  <div className="mb-4 h-40 rounded-2xl bg-linear-to-br from-[#f9dfcb] via-white to-[#e1efec]" />
                  <p className="text-base font-medium text-[#1f1c19]">{producto.nombre}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#d32f2f] px-2.5 py-1 text-[10px] font-bold text-white">-20%</span>
                    <p className="text-xs text-[#7b6c60] line-through">S/ 74.90</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <p className="text-lg font-bold text-[#1f1c19]">{producto.precio}</p>
                    <span className="rounded-full bg-[#f6dcc7] px-2.5 py-1 text-xs font-semibold text-[#8a4b23]">
                      {producto.estado}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-pet py-14 lg:py-16">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-3xl text-[#1f1c19]">Lo que dicen nuestros clientes</h2>
          <Link href="/checkout/confirmacion" className="text-sm font-bold text-[#9b3e15]">
            Ver experiencias
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonios.map((testimonio) => (
            <article key={testimonio.nombre} className="surface-card rounded-3xl p-6">
              <p className="text-sm leading-7 text-[#4f453b]">{testimonio.texto}</p>
              <p className="mt-4 text-sm font-bold text-[#1f1c19]">{testimonio.nombre}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a5b36]">Cliente verificado</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-pet pb-14 lg:pb-16">
        <div className="rounded-3xl border border-[#d8c8b4] bg-[#fff8f1] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl text-[#1f1c19] sm:text-3xl">Marcas premium que confian en Pet Center</h2>
            <Link href="/nutricion" className="text-sm font-bold text-[#9b3e15]">
              Ver marcas
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {marcas.map((marca) => (
              <article key={marca} className="rounded-2xl border border-[#e5d6c5] bg-white px-4 py-3">
                <p className="text-sm font-semibold text-[#4c4034]">{marca}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-transparent via-[#f9f1e8] to-transparent py-14">
        <div className="container-pet">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-3xl text-[#1f1c19]">Contenido que ayuda a comprar mejor</h2>
            <Link href="/servicios" className="text-sm font-bold text-[#9b3e15]">
              Ver mas contenido
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.titulo} className="surface-card rounded-3xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a5b36]">Guia Pet Center</p>
                <h3 className="mt-2 text-2xl leading-tight text-[#1f1c19]">{post.titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-[#4f453b]">{post.resumen}</p>
                <Link href={post.href} className="mt-4 inline-flex text-sm font-bold text-[#9b3e15]">
                  Leer articulo
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pet py-14 lg:py-16">
        <div className="rounded-3xl border border-[#d8c8b4] bg-linear-to-r from-[#2b2723] to-[#4a3629] p-7 text-white sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#f9d7c1]">PET CENTER DIGITAL</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Compra online y recoge en local, rapido y sin llamadas.</h2>
          <p className="mt-3 max-w-2xl text-base text-[#f3ece5] sm:text-lg">
            Haz tu pedido en minutos y te confirmamos por WhatsApp. Sin colas, sin esperas y con
            asesoramiento veterinario confiable.
          </p>
        </div>
      </section>
    </div>
  )
}
