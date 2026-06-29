'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

type Props = {
  siteName: string
  logoUrl?: string | null
  phone?: string | null
}

export function Header({ siteName, logoUrl, phone }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={150} height={48} className="h-10 w-auto object-contain" />
          ) : (
            <span className="text-xl font-extrabold tracking-tight text-brand-700">
              NMT<span className="text-accent-500"> Holidays</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="hidden items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:inline-flex"
            >
              <Phone size={16} /> {phone}
            </a>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-md p-2 text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('border-t border-slate-100 bg-white md:hidden', open ? 'block' : 'hidden')}>
        <nav className="container-page flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          {phone && (
            <a href={`tel:${phone}`} className="mt-2 flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-3 font-semibold text-white">
              <Phone size={18} /> Call {phone}
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
