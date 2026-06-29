import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { SectionHeading } from '@/components/SectionHeading'
import { TourCard } from '@/components/TourCard'
import { RichText } from '@/components/RichText'
import { getDestinationBySlug, getTours } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const dest = await getDestinationBySlug(slug).catch(() => null)
  if (!dest) return { title: 'Destination not found' }
  return { title: dest.name, description: dest.shortDescription || `Tour packages for ${dest.name}.` }
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dest = await getDestinationBySlug(slug).catch(() => null)
  if (!dest) notFound()

  const result = await getTours({ destination: slug }, 1, 24).catch(() => null)
  const tours = result?.docs ?? []
  const banner = mediaUrl(dest.image, 'feature') || mediaUrl(dest.image)

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden bg-brand-800 md:h-80">
        {banner && <Image src={banner} alt={dest.name} fill sizes="100vw" className="object-cover opacity-70" priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container-page relative z-10 pb-8 text-white">
          <span className="text-sm uppercase tracking-wide text-white/80">
            {dest.type === 'international' ? 'International' : 'India'}
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold">{dest.name}</h1>
        </div>
      </div>

      <div className="container-page py-10">
        {dest.shortDescription && <p className="max-w-3xl text-lg text-slate-600">{dest.shortDescription}</p>}
        {dest.description && <RichText data={dest.description} className="prose mt-4 max-w-none text-slate-600" />}

        <div className="mt-10">
          <SectionHeading align="left" title={`${dest.name} Tour Packages`} />
          {tours.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-slate-500">No packages listed for {dest.name} yet — message us on WhatsApp and we&apos;ll craft one.</p>
          )}
        </div>
      </div>
    </div>
  )
}
