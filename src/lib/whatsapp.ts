/**
 * Builds a WhatsApp click-to-chat deep link (wa.me) with a pre-filled message.
 * `number` must be digits-only with country code, e.g. "919876543210".
 */
export function whatsappLink(number?: string | null, message?: string): string {
  const clean = (number ?? '').replace(/[^\d]/g, '')
  const base = clean ? `https://wa.me/${clean}` : 'https://wa.me/'
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/** Fills the {tour} placeholder in the site's WhatsApp message template. */
export function tourWhatsappMessage(template: string | undefined, tourTitle: string): string {
  const t = template || 'Hi! I would like to know more about {tour}.'
  return t.replace(/\{tour\}/g, tourTitle)
}
