'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FaqItem = { question: string; answer: string }

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  if (!items?.length) return null

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-[var(--radius-card)] border border-slate-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-ink">{item.question}</span>
              <ChevronDown size={20} className={cn('shrink-0 text-brand-600 transition-transform', isOpen && 'rotate-180')} />
            </button>
            {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
