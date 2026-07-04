'use server'

import { getPayloadClient } from '@/lib/payload'
import { Resend } from 'resend'
import type { EnquiryState } from './types'
import { useDemoData } from '@/lib/queries'

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const name = String(formData.get('name') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const source = (String(formData.get('source') || 'contact') as 'contact' | 'tour' | 'plan-trip')
  const tourId = formData.get('tourId') ? Number(formData.get('tourId')) : undefined

  // Honeypot — bots fill hidden fields; humans don't.
  if (formData.get('company')) return { ok: true, message: 'Thank you! We will be in touch shortly.' }

  if (!name || !phone) {
    return { ok: false, message: 'Please provide your name and phone number.' }
  }

  // Demo/prototype mode: no database to store the lead — just acknowledge.
  if (useDemoData()) {
    console.log('[demo] enquiry received:', { name, phone, email, source, tourId })
    return { ok: true, message: 'Thank you! Our travel expert will reach out to you shortly.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: {
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
        source,
        ...(tourId ? { tour: tourId } : {}),
      },
    })

    // Optional email notification.
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.ENQUIRY_NOTIFY_EMAIL
    if (apiKey && to) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: 'NMT Website <onboarding@resend.dev>',
        to,
        subject: `New ${source} enquiry from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || '-'}\nSource: ${source}\nTour ID: ${tourId ?? '-'}\n\nMessage:\n${message || '-'}`,
      })
    }

    return { ok: true, message: 'Thank you! Our travel expert will reach out to you shortly.' }
  } catch (err) {
    console.error('Enquiry submission failed:', err)
    return { ok: false, message: 'Something went wrong. Please try again or message us on WhatsApp.' }
  }
}
