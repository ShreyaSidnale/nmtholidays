import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { DestinationCard } from '@/components/DestinationCard'
import { getDestinations } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore domestic and international destinations curated by NMT India Holidays.',
}

export default async function DestinationsPage() {
  const destinations = await getDestinations().catch(() => [])
  const domestic = destinations.filter((d) => d.type === 'domestic')
  const international = destinations.filter((d) => d.type === 'international')

  return (
    <div className="container-page py-12">
      <SectionHeading align="left" eyebrow="Where to next?" title="Explore Destinations" />

      {destinations.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No destinations yet. Add them in the admin under Catalog → Destinations.
        </p>
      )}

      {domestic.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-ink">India</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {domestic.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </section>
      )}

      {international.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink">International</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {international.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
