import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Check, X, MapPin, Star } from 'lucide-react'
import type { Destination, Media } from '@/payload-types'
import { getTourBySlug, getSiteSettings, getAllTourSlugs } from '@/lib/queries'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { formatPrice, durationLabel } from '@/lib/utils'
import { Gallery } from '@/components/Gallery'
import { ItineraryTimeline } from '@/components/ItineraryTimeline'
import { Faq } from '@/components/Faq'
import { RichText } from '@/components/RichText'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { EnquiryForm } from '@/components/EnquiryForm'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const slugs = await getAllTourSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug).catch(() => null)
  if (!tour) return { title: 'Tour not found' }
  return {
    title: tour.metaTitle || tour.title,
    description: tour.metaDescription || tour.summary,
    openGraph: {
      title: tour.title,
      description: tour.summary,
      images: mediaUrl(tour.heroImage, 'feature') ? [mediaUrl(tour.heroImage, 'feature')!] : [],
    },
  }
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [tour, settings] = await Promise.all([
    getTourBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ])
  if (!tour) notFound()

  const dest = tour.destination as Destination | null | undefined
  const destName = dest && typeof dest === 'object' ? dest.name : null

  const galleryImages = [
    ...(mediaUrl(tour.heroImage, 'feature') ? [{ url: mediaUrl(tour.heroImage, 'feature')!, alt: mediaAlt(tour.heroImage, tour.title) }] : []),
    ...((tour.gallery ?? [])
      .map((g) => {
        const url = mediaUrl(g.image as Media | number, 'card')
        return url ? { url, alt: mediaAlt(g.image as Media, tour.title) } : null
      })
      .filter(Boolean) as { url: string; alt: string }[]),
  ]

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.summary,
    url: `${siteUrl}/tours/${tour.slug}`,
    ...(tour.priceFrom
      ? { offers: { '@type': 'Offer', price: tour.priceFrom, priceCurrency: tour.currency ?? 'INR' } }
      : {}),
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-page py-8">
        {/* Title block */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          {destName && (
            <span className="inline-flex items-center gap-1 text-brand-600">
              <MapPin size={14} /> {destName}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {durationLabel(tour.durationDays, tour.durationNights)}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-ink md:text-4xl">{tour.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{tour.summary}</p>

        {galleryImages.length > 0 && (
          <div className="mt-6">
            <Gallery images={galleryImages} title={tour.title} />
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="min-w-0 space-y-12">
            {tour.overview && (
              <section>
                <h2 className="mb-3 text-2xl font-bold text-ink">Overview</h2>
                <RichText data={tour.overview} className="prose max-w-none text-slate-600 [&_p]:mb-3" />
              </section>
            )}

            {tour.highlights?.length ? (
              <section>
                <h2 className="mb-3 text-2xl font-bold text-ink">Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <Star size={18} className="mt-0.5 shrink-0 text-accent-500" /> {h.text}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {tour.itinerary?.length ? (
              <section>
                <h2 className="mb-5 text-2xl font-bold text-ink">Day-wise Itinerary</h2>
                <ItineraryTimeline days={tour.itinerary} />
              </section>
            ) : null}

            {(tour.inclusions?.length || tour.exclusions?.length) && (
              <section className="grid gap-6 sm:grid-cols-2">
                {tour.inclusions?.length ? (
                  <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 font-bold text-ink">What&apos;s Included</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {tour.inclusions.map((x, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={16} className="mt-0.5 shrink-0 text-brand-600" /> {x.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {tour.exclusions?.length ? (
                  <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 font-bold text-ink">Not Included</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {tour.exclusions.map((x, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X size={16} className="mt-0.5 shrink-0 text-red-500" /> {x.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            )}

            {tour.faqs?.length ? (
              <section>
                <h2 className="mb-5 text-2xl font-bold text-ink">FAQs</h2>
                <Faq items={tour.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
              </section>
            ) : null}
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-lg">
              {tour.priceFrom != null && (
                <div className="mb-4">
                  <span className="text-sm text-slate-500">Starting from</span>
                  <div className="text-3xl font-extrabold text-brand-700">
                    {formatPrice(tour.priceFrom, tour.currency ?? 'INR')}
                    <span className="text-sm font-medium text-slate-500"> / person</span>
                  </div>
                </div>
              )}
              <WhatsAppButton
                number={settings?.whatsappNumber}
                template={settings?.whatsappMessageTemplate ?? undefined}
                tourTitle={tour.title}
                className="w-full"
              />
              <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" /> OR ENQUIRE BELOW <span className="h-px flex-1 bg-slate-200" />
              </div>
              <EnquiryForm source="tour" tourId={tour.id} compact submitLabel="Request a Callback" />
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
