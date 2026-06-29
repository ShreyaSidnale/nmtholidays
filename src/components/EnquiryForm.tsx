'use client'

import { useActionState } from 'react'
import { submitEnquiry } from '@/app/actions/enquiry'
import type { EnquiryState } from '@/app/actions/types'
import { Button } from '@/components/ui/Button'

const initial: EnquiryState = { ok: false, message: '' }

const inputClass =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

type Props = {
  source?: 'contact' | 'tour' | 'plan-trip'
  tourId?: number
  compact?: boolean
  submitLabel?: string
}

export function EnquiryForm({ source = 'contact', tourId, compact = false, submitLabel = 'Send Enquiry' }: Props) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-6 text-center">
        <p className="font-semibold text-brand-700">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="source" value={source} />
      {tourId != null && <input type="hidden" name="tourId" value={tourId} />}
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <input name="name" required placeholder="Your name *" className={inputClass} />
        <input name="phone" required placeholder="Phone number *" className={inputClass} />
      </div>
      <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
      <textarea name="message" rows={compact ? 3 : 4} placeholder="Tell us about your trip — dates, travellers, preferences…" className={inputClass} />

      {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
        {pending ? 'Sending…' : submitLabel}
      </Button>
    </form>
  )
}
