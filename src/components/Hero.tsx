'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export type HeroSlide = { image: string | null; heading?: string | null; subheading?: string | null }

export function Hero({ slides, siteTagline }: { slides: HeroSlide[]; siteTagline?: string | null }) {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [query, setQuery] = useState('')

  const valid = slides.filter((s) => s.image)
  const hasSlides = valid.length > 0

  useEffect(() => {
    if (valid.length < 2) return
    const id = setInterval(() => setActive((a) => (a + 1) % valid.length), 5000)
    return () => clearInterval(id)
  }, [valid.length])

  const current = valid[active]
  const heading = current?.heading || siteTagline || 'Sirf Trip Nahi, Memories Banao'
  const subheading = current?.subheading || 'Handcrafted tour packages across India and the world.'

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(query.trim() ? `/tours?q=${encodeURIComponent(query.trim())}` : '/tours')
  }

  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
      {/* Background slides */}
      <div className="absolute inset-0 bg-brand-900">
        {valid.map((slide, i) => (
          <Image
            key={i}
            src={slide.image as string}
            alt={slide.heading || 'Destination'}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn('object-cover transition-opacity duration-1000', i === active ? 'opacity-100' : 'opacity-0')}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="container-page relative z-10 py-20 text-center text-white">
        <h1 className="mx-auto max-w-4xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight drop-shadow md:text-6xl">
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 drop-shadow">{subheading}</p>

        <form
          onSubmit={onSearch}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search size={20} className="text-brand-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to go? (e.g. Kashmir, Bali)"
              className="w-full bg-transparent py-3 text-ink outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Explore
          </button>
        </form>

        {!hasSlides && (
          <p className="mt-6 text-sm text-white/70">
            Add hero images in the admin under <strong>Site Settings → Home Hero</strong>.
          </p>
        )}
      </div>
    </section>
  )
}
