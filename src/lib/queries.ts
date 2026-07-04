import { getPayloadClient } from './payload'
import { getLocale } from 'next-intl/server'
import type { Where } from 'payload'
import type { Locale } from '@/i18n/config'
import {
  demoTours,
  demoDestinations,
  demoTestimonials,
  demoPosts,
  demoSiteSettings,
} from './demoData'

// Resolve the active locale from the request (cookie-based). Falls back to 'en'
// outside a request context (e.g. build-time), where next-intl throws.
async function activeLocale(): Promise<Locale> {
  try {
    return (await getLocale()) as Locale
  } catch {
    return 'en'
  }
}

// Decide whether to serve static demo content instead of querying the DB.
// - DEMO_MODE=true  -> always demo (great for the Vercel prototype)
// - DEMO_MODE=false -> never demo (force real DB)
// - otherwise       -> auto: demo on Vercel when no database is configured
export function useDemoData(): boolean {
  const flag = process.env.DEMO_MODE ?? process.env.NEXT_PUBLIC_DEMO_MODE
  if (flag === 'true') return true
  if (flag === 'false') return false
  return Boolean(process.env.VERCEL) && !process.env.DATABASE_URI
}

// Run a DB query, but gracefully fall back to static demo content when demo
// mode is on, or when the database is unavailable / returns nothing. `hasData`
// decides whether the DB result is "real"; if not, `fallback` is returned.
async function withFallback<T>(
  run: () => Promise<T>,
  fallback: T,
  hasData: (r: T) => boolean,
): Promise<T> {
  if (useDemoData()) return fallback
  try {
    const result = await run()
    return hasData(result) ? result : fallback
  } catch {
    return fallback
  }
}

const nonEmpty = <T>(arr: T[]) => arr.length > 0

export async function getSiteSettings() {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      return payload.findGlobal({ slug: 'site-settings', depth: 1, locale })
    },
    demoSiteSettings,
    (s) => Boolean(s && (s.whatsappNumber || s.phone || s.siteName)),
  )
}

export async function getDestinations({ featuredOnly = false } = {}) {
  const fallback = featuredOnly ? demoDestinations.filter((d) => d.featured) : demoDestinations
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const where: Where = featuredOnly ? { featured: { equals: true } } : {}
      const res = await payload.find({ collection: 'destinations', where, limit: 50, depth: 1, locale })
      return res.docs
    },
    fallback,
    nonEmpty,
  )
}

export async function getDestinationBySlug(slug: string) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({ collection: 'destinations', where: { slug: { equals: slug } }, limit: 1, depth: 1, locale })
      return res.docs[0] ?? null
    },
    demoDestinations.find((d) => d.slug === slug) ?? null,
    (d) => Boolean(d),
  )
}

export async function getTrendingTours(limit = 6) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({
        collection: 'tours',
        where: { and: [{ status: { equals: 'published' } }, { trending: { equals: true } }] },
        limit,
        depth: 2,
        locale,
      })
      return res.docs
    },
    demoTours.filter((t) => t.trending).slice(0, limit),
    nonEmpty,
  )
}

export async function getFeaturedTours(limit = 4) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({
        collection: 'tours',
        where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
        limit,
        depth: 2,
        locale,
      })
      return res.docs
    },
    demoTours.filter((t) => t.featured).slice(0, limit),
    nonEmpty,
  )
}

export type TourFilters = {
  destination?: string
  theme?: string
  maxPrice?: number
  minDays?: number
  maxDays?: number
  q?: string
}

function filterDemoTours(filters: TourFilters) {
  return demoTours.filter((t) => {
    if (filters.destination) {
      const d = t.destination
      const slug = d && typeof d === 'object' ? d.slug : undefined
      if (slug !== filters.destination) return false
    }
    if (filters.theme && !(t.themes ?? []).includes(filters.theme as never)) return false
    if (filters.maxPrice && (t.priceFrom ?? 0) > filters.maxPrice) return false
    if (filters.minDays && t.durationDays < filters.minDays) return false
    if (filters.maxDays && t.durationDays > filters.maxDays) return false
    if (filters.q && !t.title.toLowerCase().includes(filters.q.toLowerCase())) return false
    return true
  })
}

export async function getTours(filters: TourFilters = {}, page = 1, limit = 12) {
  const getToursDb = async () => {
    const payload = await getPayloadClient()
    const locale = await activeLocale()
    const and: Where[] = [{ status: { equals: 'published' } }]
    if (filters.destination) and.push({ 'destination.slug': { equals: filters.destination } })
    if (filters.theme) and.push({ themes: { contains: filters.theme } })
    if (filters.maxPrice) and.push({ priceFrom: { less_than_equal: filters.maxPrice } })
    if (filters.minDays) and.push({ durationDays: { greater_than_equal: filters.minDays } })
    if (filters.maxDays) and.push({ durationDays: { less_than_equal: filters.maxDays } })
    if (filters.q) and.push({ title: { like: filters.q } })
    return payload.find({ collection: 'tours', where: { and }, page, limit, depth: 2, locale })
  }

  const all = filterDemoTours(filters)
  const totalPages = Math.max(1, Math.ceil(all.length / limit))
  const demoResult = {
    docs: all.slice((page - 1) * limit, page * limit),
    totalDocs: all.length,
    totalPages,
    page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  } as Awaited<ReturnType<typeof getToursDb>>

  return withFallback(getToursDb, demoResult, (r) => r.docs.length > 0)
}

export async function getTourBySlug(slug: string) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({ collection: 'tours', where: { slug: { equals: slug } }, limit: 1, depth: 2, locale })
      return res.docs[0] ?? null
    },
    demoTours.find((t) => t.slug === slug) ?? null,
    (d) => Boolean(d),
  )
}

export async function getAllTourSlugs() {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'tours',
        where: { status: { equals: 'published' } },
        limit: 500,
        depth: 0,
        select: { slug: true },
      })
      return res.docs.map((d) => d.slug).filter(Boolean) as string[]
    },
    demoTours.map((t) => t.slug).filter(Boolean) as string[],
    nonEmpty,
  )
}

export async function getTestimonials(limit = 12) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({ collection: 'testimonials', where: { published: { equals: true } }, limit, depth: 1, locale })
      return res.docs
    },
    demoTestimonials.slice(0, limit),
    nonEmpty,
  )
}

export async function getPosts(limit = 9) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedDate', limit, depth: 1, locale })
      return res.docs
    },
    demoPosts.slice(0, limit),
    nonEmpty,
  )
}

export async function getPostBySlug(slug: string) {
  return withFallback(
    async () => {
      const payload = await getPayloadClient()
      const locale = await activeLocale()
      const res = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 1, locale })
      return res.docs[0] ?? null
    },
    demoPosts.find((p) => p.slug === slug) ?? null,
    (d) => Boolean(d),
  )
}
