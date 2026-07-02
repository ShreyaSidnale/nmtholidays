'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'

const THEME_VALUES = [
  'honeymoon', 'family', 'adventure', 'beach', 'hill-station',
  'pilgrimage', 'wildlife', 'heritage', 'group', 'mice',
] as const

const DURATIONS = [
  ['1-4', '1–4 days'],
  ['5-7', '5–7 days'],
  ['8-100', '8+ days'],
] as const

const PRICES = [
  ['25000', 'Under ₹25,000'],
  ['50000', 'Under ₹50,000'],
  ['100000', 'Under ₹1,00,000'],
] as const

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export function TourFilters({ destinations }: { destinations: { slug: string; name: string }[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const t = useTranslations('filters')

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      router.push(`/tours?${next.toString()}`)
    },
    [params, router],
  )

  return (
    <div className="grid grid-cols-2 gap-3 rounded-[var(--radius-card)] border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-4">
      <select className={selectClass} value={params.get('destination') ?? ''} onChange={(e) => update('destination', e.target.value)}>
        <option value="">{t('allDestinations')}</option>
        {destinations.map((d) => (
          <option key={d.slug} value={d.slug}>{d.name}</option>
        ))}
      </select>

      <select className={selectClass} value={params.get('theme') ?? ''} onChange={(e) => update('theme', e.target.value)}>
        <option value="">{t('allThemes')}</option>
        {THEME_VALUES.map((v) => (
          <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}</option>
        ))}
      </select>

      <select className={selectClass} value={params.get('duration') ?? ''} onChange={(e) => update('duration', e.target.value)}>
        <option value="">{t('anyDuration')}</option>
        {DURATIONS.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>

      <select className={selectClass} value={params.get('maxPrice') ?? ''} onChange={(e) => update('maxPrice', e.target.value)}>
        <option value="">{t('anyBudget')}</option>
        {PRICES.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  )
}
