'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV = [
  { key: 'home', href: '/' },
  { key: 'tours', href: '/tours' },
  { key: 'destinations', href: '/destinations' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const

type Props = {
  siteName: string
  logoUrl?: string | null
  phone?: string | null
}

export function Header({ siteName, logoUrl, phone }: Props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')
  const ta = useTranslations('actions')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={180} height={64} className="h-12 w-auto object-contain md:h-14" />
          ) : (
            <span className="text-xl font-extrabold tracking-tight text-brand-600">
              NMT<span className="text-navy-700"> India Holidays</span>
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
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          {phone && (
            <a
              href={`tel:${phone}`}
              className="hidden items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 lg:inline-flex"
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
              {t(item.key)}
            </Link>
          ))}
          {phone && (
            <a href={`tel:${phone}`} className="mt-2 flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-3 font-semibold text-white">
              <Phone size={18} /> {ta('call')} {phone}
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
