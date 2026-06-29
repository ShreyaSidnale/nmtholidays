import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_SYMBOL: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' }

export function formatPrice(amount?: number | null, currency = 'INR'): string {
  if (amount == null) return 'On request'
  const symbol = CURRENCY_SYMBOL[currency] ?? ''
  return `${symbol}${amount.toLocaleString('en-IN')}`
}

export function durationLabel(days?: number | null, nights?: number | null): string {
  if (!days) return ''
  const n = nights ?? Math.max(0, days - 1)
  return `${days} Days / ${n} Nights`
}
