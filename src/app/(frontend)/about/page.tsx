import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSiteSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NMT India Holidays — your trusted partner for memorable journeys across India and beyond.',
}

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <div className="container-page max-w-4xl py-12">
      <SectionHeading align="left" eyebrow="About NMT" title="Your journey, our passion" />
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
        <p>
          NMT India Holidays is a full-service travel company crafting unforgettable holidays across India and around
          the world. From honeymoon escapes and family vacations to group tours and corporate trips, we design every
          itinerary with care, local expertise and a personal touch.
        </p>
        <p>
          We believe travel is about memories, not just destinations — <em>“Sirf trip nahi, memories banao.”</em> That&apos;s
          why we handle everything ourselves, with no third parties, transparent pricing, and round-the-clock support
          while you&apos;re on the road.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          ['1000+', 'Happy travellers'],
          ['50+', 'Destinations covered'],
          ['10+', 'Years of experience'],
        ].map(([stat, label]) => (
          <div key={label} className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-brand-700">{stat}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <WhatsAppButton number={settings?.whatsappNumber} label="Start planning with us" />
      </div>
    </div>
  )
}
