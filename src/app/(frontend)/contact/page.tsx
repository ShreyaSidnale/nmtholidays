import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
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

  return (
    <div className="container-page py-12">
      <SectionHeading align="left" eyebrow="We'd love to help" title="Get in Touch" subtitle="Have a question or ready to book? Send us a message and our travel experts will respond quickly." />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-5 text-xl font-bold text-ink">Send us a message</h2>
          <EnquiryForm source="contact" submitLabel="Send Message" />
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-ink">Reach us directly</h2>
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
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
            <div className="mt-6">
              <WhatsAppButton number={settings?.whatsappNumber} label="Chat on WhatsApp" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
