import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SectionHeading } from '@/components/SectionHeading'
import { TourCard } from '@/components/TourCard'
import { TourFilters } from '@/components/TourFilters'
import { getTours, getDestinations, type TourFilters as Filters } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tour Packages',
  description: 'Browse handcrafted India and international tour packages. Filter by destination, theme, duration and budget.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function parseDuration(value?: string): { minDays?: number; maxDays?: number } {
  if (!value) return {}
  const [min, max] = value.split('-').map((n) => parseInt(n, 10))
  return { minDays: min || undefined, maxDays: max || undefined }
}

export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const page = Number(str(sp.page)) || 1

  const filters: Filters = {
    destination: str(sp.destination),
    theme: str(sp.theme),
    q: str(sp.q),
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
    ...parseDuration(str(sp.duration)),
  }

  const [result, destinations] = await Promise.all([
    getTours(filters, page).catch(() => null),
    getDestinations().catch(() => []),
  ])

  const tours = result?.docs ?? []
  const tt = await getTranslations('tour')
  const tn = await getTranslations('nav')
  const ta = await getTranslations('actions')

  return (
    <div className="container-page py-12">
      <SectionHeading align="left" eyebrow={tn('tours')} title={filters.q ? `“${filters.q}”` : tn('tours')} />

      <div className="mt-8">
        <TourFilters destinations={destinations.map((d) => ({ slug: d.slug ?? '', name: d.name }))} />
      </div>

      {tours.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-slate-500">{tt('resultsFound', { count: result?.totalDocs ?? tours.length })}</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>

          {/* Pagination */}
          {result && result.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }).map((_, i) => {
                const p = i + 1
                const next = new URLSearchParams()
                Object.entries(sp).forEach(([k, v]) => {
                  if (v && k !== 'page') next.set(k, String(Array.isArray(v) ? v[0] : v))
                })
                next.set('page', String(p))
                return (
                  <Link
                    key={p}
                    href={`/tours?${next.toString()}`}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      p === page ? 'bg-brand-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </Link>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-500">{tt('noResults')}</p>
          <Link href="/tours" className="mt-3 inline-block font-medium text-brand-700 hover:underline">
            {ta('clearFilters')}
          </Link>
        </div>
      )}
    </div>
  )
}
