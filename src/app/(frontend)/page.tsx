import Link from 'next/link'
import { ShieldCheck, Wallet, Headset, MapPinned, Sparkles, ArrowRight } from 'lucide-react'
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
  { icon: ShieldCheck, title: 'No Third Party', text: 'We operate every trip ourselves — no middlemen, no surprises.' },
  { icon: Wallet, title: 'Best Price Promise', text: 'Transparent pricing with the best value for your money.' },
  { icon: Headset, title: '24/7 Support', text: 'On-trip assistance whenever you need us.' },
  { icon: MapPinned, title: 'Tailor-made Trips', text: 'Itineraries customised to how you love to travel.' },
]

const THEMES = [
  { label: 'Honeymoon', value: 'honeymoon', emoji: '💍' },
  { label: 'Family', value: 'family', emoji: '👨‍👩‍👧' },
  { label: 'Adventure', value: 'adventure', emoji: '🏔️' },
  { label: 'Beach', value: 'beach', emoji: '🏖️' },
  { label: 'Pilgrimage', value: 'pilgrimage', emoji: '🛕' },
  { label: 'Group Tours', value: 'group', emoji: '🚌' },
]

export default async function HomePage() {
  const [settings, destinations, trending, testimonials, posts] = await Promise.all([
    getSiteSettings().catch(() => null),
    getDestinations({ featuredOnly: false }).catch(() => []),
    getTrendingTours(6).catch(() => []),
    getTestimonials(6).catch(() => []),
    getPosts(3).catch(() => []),
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

      {/* Explore Destinations */}
      {shownDestinations.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow="Explore" title="Top Destinations" subtitle="Discover the places our travellers love most." />
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
            <SectionHeading align="left" eyebrow="Hot right now" title="Trending Trips" />
            <LinkButton href="/tours" variant="ghost" className="hidden sm:inline-flex">
              View all <ArrowRight size={16} />
            </LinkButton>
          </div>
          {trending.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No trending tours yet. Mark tours as “Trending” in the admin to feature them here.
            </p>
          )}
        </div>
      </section>

      {/* Browse by theme */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Plan by interest" title="Find Your Kind of Trip" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {THEMES.map((t) => (
            <Link
              key={t.value}
              href={`/tours?theme=${t.value}`}
              className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{t.emoji}</span>
              <span className="text-sm font-semibold text-ink">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-brand-700 py-16 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-200">Why NMT</span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Travel with people who care
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-[var(--radius-card)] bg-white/10 p-6 backdrop-blur">
                <w.icon size={28} className="text-accent-400" />
                <h3 className="mt-3 font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-white/80">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow="Happy travellers" title="What Our Guests Say" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="container-page py-12">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-r from-brand-600 to-brand-800 p-10 text-center text-white md:flex-row md:justify-between md:text-left">
          <div>
            <Sparkles className="mb-2 text-accent-400" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
              Ready to plan your dream trip?
            </h2>
            <p className="mt-2 text-white/85">Chat with a travel expert now — we reply fast on WhatsApp.</p>
          </div>
          <WhatsAppButton number={settings?.whatsappNumber} label="Connect with Expert" />
        </div>
      </section>

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="container-page pb-8">
          <SectionHeading eyebrow="Stories" title="From the Travel Blog" />
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
        <SectionHeading eyebrow="Good to know" title="Frequently Asked Questions" />
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
