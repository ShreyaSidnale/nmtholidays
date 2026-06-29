import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin } from 'lucide-react'
import type { Tour, Destination } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { formatPrice, durationLabel } from '@/lib/utils'

export function TourCard({ tour }: { tour: Tour }) {
  const img = mediaUrl(tour.heroImage, 'card') || mediaUrl(tour.heroImage)
  const dest = tour.destination as Destination | null | undefined
  const destName = dest && typeof dest === 'object' ? dest.name : null

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {img ? (
          <Image
            src={img}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
        {tour.priceFrom != null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-brand-700 shadow">
            From {formatPrice(tour.priceFrom, tour.currency ?? 'INR')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {destName && (
          <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
            <MapPin size={12} /> {destName}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold text-ink group-hover:text-brand-700">{tour.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{tour.summary}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <Clock size={14} className="text-brand-500" />
          {durationLabel(tour.durationDays, tour.durationNights)}
        </div>
      </div>
    </Link>
  )
}
