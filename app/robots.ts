import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pet-center.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/acceso-admin', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
