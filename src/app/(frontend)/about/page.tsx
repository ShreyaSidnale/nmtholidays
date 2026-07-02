import type { Metadata } from 'next'
import { ShieldCheck, Headset, Users, MapPinned } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { SectionHeading } from '@/components/SectionHeading'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSiteSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'NMT India Holidays (Northern Mediterranean Tourism India) — crafting unforgettable travel experiences since 2013. Your perfect travelling partner.',
}

const STATS: [string, string][] = [
  ['13+', 'Years of Experience'],
  ['300+', 'Groups Organised'],
  ['50+', 'Destinations'],
  ['25,000+', 'Happy Travellers'],
]

const VALUES = [
  { icon: ShieldCheck, title: 'Safe & Secure', text: 'All tours include comprehensive travel insurance and 24/7 emergency support for complete peace of mind.' },
  { icon: Headset, title: '24/7 Support', text: 'Our travel experts are always available via phone, email or WhatsApp whenever you need us.' },
  { icon: Users, title: 'Group Specialists', text: 'With 300+ groups organised, we have mastered the art of seamless, enjoyable group travel.' },
  { icon: MapPinned, title: '50+ Destinations', text: 'From the Himalayas to Southeast Asia — we cover India inside-out and beyond its borders.' },
]

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null)
  const ta = await getTranslations('actions')

  return (
    <div>
      {/* Hero band */}
      <section className="bg-navy-700 py-16 text-white">
        <div className="container-page text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-navy-200">
            Northern Mediterranean Tourism India
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold md:text-5xl">
            NMT India Holidays
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Crafting unforgettable travel experiences since 2013 — your perfect travelling partner.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-600 md:text-4xl">{stat}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container-page py-16">
        <SectionHeading align="left" eyebrow="Who we are" title="About NMT India Holidays" />
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-600">
          <p>
            At NMT India Holidays, our mission is to craft unforgettable travel experiences that go beyond
            sightseeing. We aim to connect travellers with the heart and soul of India — its people, culture,
            landscapes, and heritage.
          </p>
          <p>
            Whether it&apos;s a serene escape, a cultural discovery, or an adventurous journey, we strive to turn
            every trip into a memory that lasts a lifetime.
          </p>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="What drives us" title="Our Core Values" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-brand-50 p-3 text-brand-600">
                  <v.icon size={24} />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink md:text-3xl">
          Ready to plan your next journey?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          Our team is here to help you every step of the way.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton number={settings?.whatsappNumber} label={ta('startPlanning')} />
        </div>
      </section>
    </div>
  )
}
