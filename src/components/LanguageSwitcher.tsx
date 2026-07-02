'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useTransition, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { setLocale } from '@/app/actions/locale'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const active = useLocale() as Locale
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const choose = (locale: Locale) => {
    setOpen(false)
    startTransition(async () => {
      await setLocale(locale)
      router.refresh()
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label="Change language"
        className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{localeNames[active]}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => choose(l)}
                className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
              >
                {localeNames[l]}
                {l === active && <Check size={15} className="text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
