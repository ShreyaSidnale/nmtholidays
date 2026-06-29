import Link from 'next/link'
import Image from 'next/image'
import type { Destination } from '@/payload-types'
import { mediaUrl } from '@/lib/media'

export function DestinationCard({ destination }: { destination: Destination }) {
  const img = mediaUrl(destination.image, 'card') || mediaUrl(destination.image)
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-slate-200"
    >
      {img && (
        <Image
          src={img}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <span className="text-xs font-medium uppercase tracking-wide text-white/80">
          {destination.type === 'international' ? 'International' : 'India'}
        </span>
        <h3 className="text-lg font-bold">{destination.name}</h3>
      </div>
    </Link>
  )
}
