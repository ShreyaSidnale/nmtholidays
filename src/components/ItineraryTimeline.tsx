import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Utensils, BedDouble } from 'lucide-react'
import type { Tour, Media } from '@/payload-types'
import { mediaUrl } from '@/lib/media'

type ItineraryDay = NonNullable<Tour['itinerary']>[number]

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const t = useTranslations('tour')
  if (!days?.length) return null
  return (
    <ol className="relative space-y-8 border-l-2 border-brand-100 pl-6">
      {days.map((day, i) => {
        const img = mediaUrl(day.image as Media | number | null | undefined, 'card')
        return (
          <li key={day.id ?? i} className="relative">
            <span className="absolute -left-[2.1rem] flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-ink">
                <span className="text-brand-600">{t('day')} {i + 1}:</span> {day.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{day.description}</p>
              {img && (
                <div className="relative mt-3 aspect-video overflow-hidden rounded-lg">
                  <Image src={img} alt={day.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              )}
              {(day.meals || day.stay) && (
                <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {day.meals && (
                    <span className="inline-flex items-center gap-1">
                      <Utensils size={14} className="text-brand-500" /> {day.meals}
                    </span>
                  )}
                  {day.stay && (
                    <span className="inline-flex items-center gap-1">
                      <BedDouble size={14} className="text-brand-500" /> {day.stay}
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
