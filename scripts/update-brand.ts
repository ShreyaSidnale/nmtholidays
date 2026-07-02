/**
 * Updates Site Settings with the real NMT brand + contact details and uploads
 * the official logo. Run after `npm run seed` / scrape. Idempotent.
 *
 *   npx tsx scripts/update-brand.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const LOGO_URL =
  'https://nmtindiaholidays.com/static/media/NMT%20_logo.e8b76191fc2bb0b622f1.png'

async function run() {
  const payload = await getPayload({ config: await config })

  // Upload the official logo (once).
  let logoId: number | undefined
  const existingLogo = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'NMT India Holidays logo' } },
    limit: 1,
  })
  if (existingLogo.docs[0]) {
    logoId = existingLogo.docs[0].id
  } else {
    try {
      const res = await fetch(LOGO_URL)
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer())
        const doc = await payload.create({
          collection: 'media',
          data: { alt: 'NMT India Holidays logo' },
          file: { data: buffer, name: 'nmt-logo.png', mimetype: 'image/png', size: buffer.length },
        })
        logoId = doc.id
        console.log('  + uploaded logo')
      }
    } catch (e) {
      console.warn('  ! logo upload failed:', (e as Error).message)
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'NMT India Holidays',
      tagline: 'Your Perfect Travelling Partner',
      ...(logoId ? { logo: logoId } : {}),
      phone: '+91 96979 88891',
      whatsappNumber: '919697988892',
      whatsappMessageTemplate: 'Hi NMT India Holidays! I would like to know more about {tour}.',
      email: 'info@nmtindiaholidays.com',
      address:
        'Office No.106/107, First Floor, Shiv Platino,\nOpp. Khare Mangal Karyalaya Parking,\nVishrambag, Sangli 416 415 (MS), India',
      officeHours: 'Mon – Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 3:00 PM',
      facebook: 'https://www.facebook.com/nmtindiaSangli',
      instagram: 'https://www.instagram.com/nmt_india_holidays',
      youtube: '',
    },
  })
  console.log('  + updated site settings (brand + contact)')
  console.log('Done.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
