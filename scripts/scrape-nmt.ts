/**
 * Scrapes the live nmtindiaholidays.com site (a client-rendered SPA) using a
 * headless browser, and writes the extracted tours + contact info to
 * scripts/output/nmt-content.json.
 *
 *   npm run scrape           # scrape only -> JSON
 *   npm run scrape -- --import   # scrape AND import into Payload as DRAFT tours
 *
 * Imported tours are created as DRAFTS so you can review, enrich (itinerary,
 * inclusions, pricing) and publish them from the admin. Images are stored as
 * remote URLs in the summary/notes for reference; upload final images in admin.
 */
import 'dotenv/config'
import { chromium, type Page } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const SITE = 'https://nmtindiaholidays.com'
const LIST_PAGES: { url: string; type: 'domestic' | 'international' }[] = [
  { url: `${SITE}/domestic-tours`, type: 'domestic' },
  { url: `${SITE}/international-tours`, type: 'international' },
]

type ScrapedTour = {
  title: string
  type: 'domestic' | 'international'
  durationDays?: number
  durationNights?: number
  image?: string
  detailUrl?: string
  detailText?: string
}

async function scrapeList(page: Page, url: string, type: 'domestic' | 'international'): Promise<ScrapedTour[]> {
  // 'networkidle' is unreliable on this SPA (it keeps connections open), so we
  // wait for the actual tour content (the "X Days / Y Nights" labels) instead.
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page
    .waitForFunction(() => /days?\s*\/\s*\d+\s*nights?/i.test(document.body.innerText), { timeout: 30000 })
    .catch(() => {})
  await page.waitForTimeout(1500)

  return page.evaluate((tourType) => {
    const results: any[] = []
    // Each tour name is a heading; find its card container and read details.
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4'))
    for (const h of headings) {
      const title = (h.textContent || '').trim()
      if (!title || title.length < 3 || /tour packages|destinations|nmt india/i.test(title)) continue

      // Walk up to a card-like container.
      let card: HTMLElement | null = h as HTMLElement
      for (let i = 0; i < 4 && card; i++) {
        if (card.querySelector('img') && /days?\s*\/\s*\d+\s*nights?/i.test(card.innerText || '')) break
        card = card.parentElement
      }
      if (!card) continue

      const text = card.innerText || ''
      const durMatch = text.match(/(\d+)\s*days?\s*\/\s*(\d+)\s*nights?/i)
      if (!durMatch) continue

      const img = card.querySelector('img') as HTMLImageElement | null
      const link = card.querySelector('a[href]') as HTMLAnchorElement | null

      results.push({
        title,
        type: tourType,
        durationDays: parseInt(durMatch[1], 10),
        durationNights: parseInt(durMatch[2], 10),
        image: img?.src,
        detailUrl: link?.href,
      })
    }
    // De-dupe by title.
    return Array.from(new Map(results.map((r) => [r.title, r])).values())
  }, type)
}

async function scrapeContact(page: Page) {
  await page.goto(`${SITE}/contact-us`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2500)
  return page.evaluate(() => {
    const tel = document.querySelector('a[href^="tel:"]') as HTMLAnchorElement | null
    const mail = document.querySelector('a[href^="mailto:"]') as HTMLAnchorElement | null
    const social = (host: string) =>
      (Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[]).find((a) => a.href.includes(host))?.href
    return {
      phone: tel?.href.replace('tel:', ''),
      email: mail?.href.replace('mailto:', ''),
      facebook: social('facebook.com'),
      instagram: social('instagram.com'),
      address: document.body.innerText.match(/sangli[^\n]*/i)?.[0],
    }
  })
}

async function run() {
  const doImport = process.argv.includes('--import')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  let tours: ScrapedTour[] = []
  for (const lp of LIST_PAGES) {
    console.log(`Scraping ${lp.url} …`)
    const list = await scrapeList(page, lp.url, lp.type).catch((e) => {
      console.warn('  ! failed:', e.message)
      return [] as ScrapedTour[]
    })
    console.log(`  found ${list.length} tours`)
    tours = tours.concat(list)
  }

  // Visit detail pages (best-effort) to capture itinerary text.
  for (const t of tours) {
    if (!t.detailUrl || t.detailUrl.endsWith('#')) continue
    try {
      await page.goto(t.detailUrl, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(2000)
      t.detailText = await page.evaluate(() => document.body.innerText.slice(0, 6000))
    } catch {
      /* ignore detail failures */
    }
  }

  const contact = await scrapeContact(page).catch(() => ({}))
  await browser.close()

  mkdirSync('scripts/output', { recursive: true })
  const payload = { scrapedAt: new Date().toISOString(), contact, tours }
  writeFileSync('scripts/output/nmt-content.json', JSON.stringify(payload, null, 2))
  console.log(`\nWrote ${tours.length} tours + contact to scripts/output/nmt-content.json`)

  if (doImport) {
    await importToPayload(payload)
  } else {
    console.log('Run with --import to load these into Payload as draft tours.')
  }
  process.exit(0)
}

async function importToPayload(data: { contact: any; tours: ScrapedTour[] }) {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config: await config })
  console.log('\nImporting into Payload as drafts…')

  // Ensure destination buckets exist by tour title keywords is overkill — we
  // just create draft tours with type captured in the summary for triage.
  for (const t of data.tours) {
    const existing = await payload.find({ collection: 'tours', where: { title: { equals: t.title } }, limit: 1 })
    if (existing.docs[0]) {
      console.log(`  = exists: ${t.title}`)
      continue
    }
    await payload.create({
      collection: 'tours',
      data: {
        title: t.title,
        summary: `[${t.type}] Imported from nmtindiaholidays.com. ${t.image ? `Reference image: ${t.image}` : ''}`.trim(),
        durationDays: t.durationDays || 1,
        durationNights: t.durationNights,
        status: 'draft',
        // Stash scraped detail text in overview-less note via highlights for review:
        ...(t.detailText ? { metaDescription: t.detailText.slice(0, 300) } : {}),
      },
    })
    console.log(`  + draft: ${t.title}`)
  }

  // Known NMT contact details (from the live site header/footer). Used as a
  // fallback when the contact page DOM doesn't expose tel:/mailto: links.
  const contact = {
    phone: data.contact?.phone || '+91 96979 88891',
    whatsappNumber: '919697988891',
    email: data.contact?.email || 'info@nmtindiaholidays.com',
    facebook: data.contact?.facebook || 'https://www.facebook.com/nmtindiaSangli',
    instagram: data.contact?.instagram || 'https://www.instagram.com/nmt_india_holidays',
    address: data.contact?.address || 'Sangli, Maharashtra, India',
  }
  await payload.updateGlobal({ slug: 'site-settings', data: contact })
  console.log('  + updated site contact info')
  console.log('Import complete. Review and publish drafts in /admin.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
