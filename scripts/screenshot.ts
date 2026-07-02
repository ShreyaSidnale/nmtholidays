import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.SHOT_BASE || 'http://localhost:3000'
const out = 'scripts/output'
mkdirSync(out, { recursive: true })

const run = async () => {
  const browser = await chromium.launch()
  const url = new URL(BASE)

  // English desktop
  const en = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const p1 = await en.newPage()
  await p1.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
  await p1.waitForTimeout(1200)
  await p1.screenshot({ path: `${out}/theme-home-en.png`, fullPage: true })
  console.log('captured theme-home-en')
  await p1.goto(`${BASE}/about`, { waitUntil: 'networkidle', timeout: 60000 })
  await p1.waitForTimeout(800)
  await p1.screenshot({ path: `${out}/theme-about-en.png`, fullPage: true })
  console.log('captured theme-about-en')

  // Hindi desktop (set locale cookie)
  const hi = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await hi.addCookies([{ name: 'NEXT_LOCALE', value: 'hi', url: url.origin }])
  const p2 = await hi.newPage()
  await p2.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
  await p2.waitForTimeout(1200)
  await p2.screenshot({ path: `${out}/theme-home-hi.png`, fullPage: true })
  console.log('captured theme-home-hi')

  // Mobile English
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
  const p3 = await m.newPage()
  await p3.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
  await p3.waitForTimeout(1200)
  await p3.screenshot({ path: `${out}/theme-mobile-en.png`, fullPage: true })
  console.log('captured theme-mobile-en')

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
