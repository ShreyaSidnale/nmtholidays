import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/tours', '/destinations', '/blog', '/about', '/contact'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))

  try {
    const payload = await getPayloadClient()
    const [tours, destinations, posts] = await Promise.all([
      payload.find({ collection: 'tours', where: { status: { equals: 'published' } }, limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'destinations', limit: 200, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
    ])

    const dynamicRoutes = [
      ...tours.docs.map((d) => ({ url: `${siteUrl}/tours/${d.slug}`, lastModified: new Date(d.updatedAt) })),
      ...destinations.docs.map((d) => ({ url: `${siteUrl}/destinations/${d.slug}`, lastModified: new Date(d.updatedAt) })),
      ...posts.docs.map((d) => ({ url: `${siteUrl}/blog/${d.slug}`, lastModified: new Date(d.updatedAt) })),
    ]

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    return staticRoutes
  }
}
