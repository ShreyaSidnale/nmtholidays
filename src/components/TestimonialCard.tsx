import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Testimonial } from '@/payload-types'
import { mediaUrl } from '@/lib/media'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const avatar = mediaUrl(testimonial.avatar, 'thumbnail')
  const rating = testimonial.rating ?? 5
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex gap-0.5 text-accent-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? 'currentColor' : 'none'} className={i < rating ? '' : 'text-slate-300'} />
        ))}
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-slate-600">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {avatar ? (
          <Image src={avatar} alt={testimonial.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
            {testimonial.name.charAt(0)}
          </span>
        )}
        <div>
          <div className="text-sm font-semibold text-ink">{testimonial.name}</div>
          {testimonial.location && <div className="text-xs text-slate-500">{testimonial.location}</div>}
        </div>
      </figcaption>
    </figure>
  )
}
