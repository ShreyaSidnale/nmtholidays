import { getPayloadClient } from './payload'
import { getLocale } from 'next-intl/server'
import type { Where } from 'payload'
import type { Locale } from '@/i18n/config'

// Resolve the active locale from the request (cookie-based). Falls back to 'en'
// outside a request context (e.g. build-time), where next-intl throws.
async function activeLocale(): Promise<Locale> {
  try {
    return (await getLocale()) as Locale
  } catch {
    return 'en'
  }
}

export async function getSiteSettings() {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  return payload.findGlobal({ slug: 'site-settings', depth: 1, locale })
}

export async function getDestinations({ featuredOnly = false } = {}) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const where: Where = featuredOnly ? { featured: { equals: true } } : {}
  const res = await payload.find({ collection: 'destinations', where, limit: 50, depth: 1, locale })
  return res.docs
}

export async function getDestinationBySlug(slug: string) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const res = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    locale,
  })
  return res.docs[0] ?? null
}

export async function getTrendingTours(limit = 6) {
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
}

export async function getFeaturedTours(limit = 4) {
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
}

export type TourFilters = {
  destination?: string
  theme?: string
  maxPrice?: number
  minDays?: number
  maxDays?: number
  q?: string
}

export async function getTours(filters: TourFilters = {}, page = 1, limit = 12) {
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

export async function getTourBySlug(slug: string) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const res = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    locale,
  })
  return res.docs[0] ?? null
}

export async function getAllTourSlugs() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'tours',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
    select: { slug: true },
  })
  return res.docs.map((d) => d.slug).filter(Boolean) as string[]
}

export async function getTestimonials(limit = 12) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const res = await payload.find({
    collection: 'testimonials',
    where: { published: { equals: true } },
    limit,
    depth: 1,
    locale,
  })
  return res.docs
}

export async function getPosts(limit = 9) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const res = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit,
    depth: 1,
    locale,
  })
  return res.docs
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayloadClient()
  const locale = await activeLocale()
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    locale,
  })
  return res.docs[0] ?? null
}
