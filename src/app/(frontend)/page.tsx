import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ShieldCheck, Users, Headset, MapPinned, Sparkles, ArrowRight } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { SectionHeading } from '@/components/SectionHeading'
import { TourCard } from '@/components/TourCard'
import { DestinationCard } from '@/components/DestinationCard'
import { TestimonialCard } from '@/components/TestimonialCard'
import { Faq } from '@/components/Faq'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { LinkButton } from '@/components/ui/Button'
import {
  getSiteSettings,
  getDestinations,
  getTrendingTours,
  getTestimonials,
  getPosts,
} from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

const WHY = [
  { icon: ShieldCheck, key: 'safe' },
  { icon: Headset, key: 'support' },
  { icon: Users, key: 'group' },
  { icon: MapPinned, key: 'dest' },
] as const

const STATS = [
  { value: '13+', key: 'years' },
  { value: '300+', key: 'groups' },
  { value: '50+', key: 'destinations' },
  { value: '25,000+', key: 'travellers' },
] as const

const THEMES = [
  { value: 'honeymoon', emoji: '💍' },
  { value: 'family', emoji: '👨‍👩‍👧' },
  { value: 'adventure', emoji: '🏔️' },
  { value: 'beach', emoji: '🏖️' },
  { value: 'pilgrimage', emoji: '🛕' },
  { value: 'group', emoji: '🚌' },
] as const

export default async function HomePage() {
  const [settings, destinations, trending, testimonials, posts] = await Promise.all([
    getSiteSettings().catch(() => null),
    getDestinations({ featuredOnly: false }).catch(() => []),
    getTrendingTours(6).catch(() => []),
    getTestimonials(6).catch(() => []),
    getPosts(3).catch(() => []),
  ])

  const [t, tw, tt, ts, ta] = await Promise.all([
    getTranslations('home'),
    getTranslations('why'),
    getTranslations('themes'),
    getTranslations('stats'),
    getTranslations('actions'),
  ])

  const slides = (settings?.heroSlides ?? []).map((s) => ({
    image: mediaUrl(s.image, 'feature') || mediaUrl(s.image),
    heading: s.heading,
    subheading: s.subheading,
  }))

  const featuredDestinations = destinations.filter((d) => d.featured).slice(0, 8)
  const shownDestinations = (featuredDestinations.length ? featuredDestinations : destinations).slice(0, 8)

  return (
    <>
      <Hero slides={slides} siteTagline={settings?.tagline} />

      {/* Stats strip */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.key} className="text-center">
              <div className="text-3xl font-extrabold text-brand-600 md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">{ts(s.key)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Destinations */}
      {shownDestinations.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow={t('destinationsEyebrow')} title={t('destinationsTitle')} subtitle={t('destinationsSubtitle')} />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {shownDestinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Trips */}
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow={t('trendingEyebrow')} title={t('trendingTitle')} />
            <LinkButton href="/tours" variant="ghost" className="hidden sm:inline-flex">
              {ta('viewAll')} <ArrowRight size={16} />
            </LinkButton>
          </div>
          {trending.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
              {t('noTrending')}
            </p>
          )}
        </div>
      </section>

      {/* Browse by theme */}
      <section className="container-page py-16">
        <SectionHeading eyebrow={t('themesEyebrow')} title={t('themesTitle')} />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {THEMES.map((theme) => (
            <Link
              key={theme.value}
              href={`/tours?theme=${theme.value}`}
              className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{theme.emoji}</span>
              <span className="text-sm font-semibold text-ink">{tt(theme.value)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-navy-700 py-16 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-navy-200">{t('whyEyebrow')}</span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              {t('whyTitle')}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.key} className="rounded-[var(--radius-card)] bg-white/10 p-6 backdrop-blur">
                <w.icon size={28} className="text-brand-400" />
                <h3 className="mt-3 font-semibold">{tw(`${w.key}Title`)}</h3>
                <p className="mt-1 text-sm text-white/80">{tw(`${w.key}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow={t('testimonialsEyebrow')} title={t('testimonialsTitle')} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((tm) => (
              <TestimonialCard key={tm.id} testimonial={tm} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="container-page py-12">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-r from-brand-500 to-brand-700 p-10 text-center text-white md:flex-row md:justify-between md:text-left">
          <div>
            <Sparkles className="mb-2 text-white" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-2 text-white/90">{t('ctaText')}</p>
          </div>
          <WhatsAppButton number={settings?.whatsappNumber} label={ta('connectExpert')} />
        </div>
      </section>

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="container-page pb-8">
          <SectionHeading eyebrow={t('blogEyebrow')} title={t('blogTitle')} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                <h3 className="font-semibold text-ink group-hover:text-brand-700">{p.title}</h3>
                {p.excerpt && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-page py-16">
        <SectionHeading eyebrow={t('faqEyebrow')} title={t('faqTitle')} />
        <div className="mt-10">
          <Faq
            items={[
              { question: 'How do I book a tour?', answer: 'Browse our packages, open any tour and send an enquiry — or message us on WhatsApp. Our team confirms availability and guides you through booking.' },
              { question: 'Can the itinerary be customised?', answer: 'Absolutely. Every trip can be tailored to your dates, budget and preferences. Just tell us what you have in mind.' },
              { question: 'Do you handle international trips?', answer: 'Yes — we arrange both domestic India holidays and international getaways.' },
              { question: 'What is included in the price?', answer: 'Each tour page lists detailed inclusions and exclusions. Typically accommodation, transfers and sightseeing are covered.' },
            ]}
          />
        </div>
      </section>
    </>
  )
}
