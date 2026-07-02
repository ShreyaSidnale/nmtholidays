import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { SectionHeading } from '@/components/SectionHeading'
import { EnquiryForm } from '@/components/EnquiryForm'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSiteSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with NMT India Holidays for tour bookings, custom itineraries and travel queries.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null)
  const t = await getTranslations('contact')
  const ta = await getTranslations('actions')

  return (
    <div className="container-page py-12">
      <SectionHeading align="left" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-5 text-xl font-bold text-ink">{t('sendTitle')}</h2>
          <EnquiryForm source="contact" submitLabel={ta('sendMessage')} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-ink">{t('reachTitle')}</h2>
            <ul className="space-y-4 text-slate-600">
              {settings?.phone && (
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-50 p-2 text-brand-600"><Phone size={18} /></span>
                  <a href={`tel:${settings.phone}`} className="hover:text-brand-700">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-50 p-2 text-brand-600"><Mail size={18} /></span>
                  <a href={`mailto:${settings.email}`} className="hover:text-brand-700">{settings.email}</a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <span className="rounded-full bg-brand-50 p-2 text-brand-600"><MapPin size={18} /></span>
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings?.officeHours && (
                <li className="flex items-start gap-3">
                  <span className="rounded-full bg-brand-50 p-2 text-brand-600"><Clock size={18} /></span>
                  <span className="whitespace-pre-line">{settings.officeHours}</span>
                </li>
              )}
            </ul>
            <div className="mt-6">
              <WhatsAppButton number={settings?.whatsappNumber} label={ta('chatWhatsapp')} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
