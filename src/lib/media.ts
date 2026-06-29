import type { Media } from '@/payload-types'

type MediaInput = number | Media | null | undefined

/**
 * Resolves a usable image URL from a Payload upload field, which may be a
 * populated Media object, an id, or null. Optionally pick a generated size.
 */
export function mediaUrl(
  media: MediaInput,
  size?: 'thumbnail' | 'card' | 'feature',
): string | null {
  if (!media || typeof media === 'number') return null
  if (size && media.sizes?.[size]?.url) return media.sizes[size]!.url ?? null
  return media.url ?? null
}

export function mediaAlt(media: MediaInput, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt ?? fallback
}
