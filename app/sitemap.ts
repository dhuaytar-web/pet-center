import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pet-center.vercel.app'

  const routes = [
    '',
    '/farmacia',
    '/nutricion',
    '/accesorios',
    '/servicios',
    '/carrito',
    '/checkout',
  ]

  const now = new Date()
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
