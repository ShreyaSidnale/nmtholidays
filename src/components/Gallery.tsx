'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export function Gallery({ images, title }: { images: { url: string; alt: string }[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!images.length) return null

  const [hero, ...rest] = images

  return (
    <>
      <div className="grid gap-2 overflow-hidden rounded-[var(--radius-card)] md:grid-cols-3 md:grid-rows-2">
        <button
          onClick={() => setOpen(0)}
          className="relative aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto"
        >
          <Image src={hero.url} alt={hero.alt || title} fill sizes="(max-width:768px) 100vw, 66vw" className="object-cover" priority />
        </button>
        {rest.slice(0, 4).map((img, i) => (
          <button key={i} onClick={() => setOpen(i + 1)} className="relative hidden aspect-[4/3] md:block">
            <Image src={img.url} alt={img.alt || title} fill sizes="33vw" className="object-cover" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <button className="absolute right-4 top-4 text-white" onClick={() => setOpen(null)} aria-label="Close">
            <X size={32} />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image src={images[open].url} alt={images[open].alt || title} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
