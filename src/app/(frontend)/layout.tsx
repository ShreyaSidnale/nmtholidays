import React from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './styles.css'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Analytics } from '@/components/Analytics'
import { getSiteSettings } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'
import { whatsappLink } from '@/lib/whatsapp'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NMT India Holidays — Tour Packages & Holidays',
    template: '%s · NMT India Holidays',
  },
  description:
    'Plan your perfect getaway with NMT India Holidays — handcrafted domestic and international tour packages, honeymoon trips, group tours and more.',
  openGraph: { type: 'website', siteName: 'NMT India Holidays', url: siteUrl },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, locale, messages] = await Promise.all([
    getSiteSettings().catch(() => null),
    getLocale(),
    getMessages(),
  ])

  const siteName = settings?.siteName || 'NMT India Holidays'
  const phone = settings?.phone
  const wa = whatsappLink(
    settings?.whatsappNumber,
    'Hi NMT India Holidays! I would like help planning a trip.',
  )

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header siteName={siteName} logoUrl={mediaUrl(settings?.logo)} phone={phone} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer
            siteName={siteName}
            tagline={settings?.tagline}
            phone={phone}
            email={settings?.email}
            address={settings?.address}
            socials={{
              facebook: settings?.facebook,
              instagram: settings?.instagram,
              youtube: settings?.youtube,
            }}
          />
          <WhatsAppFloat href={wa} />
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
