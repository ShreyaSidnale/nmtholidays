import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.SHOT_BASE || 'http://localhost:3000'
const out = 'scripts/output'
mkdirSync(out, { recursive: true })

const shots: [string, string][] = [
  ['/', 'home'],
  ['/tours', 'tours'],
  ['/tours/enchanting-kashmir-srinagar-gulmarg-pahalgam', 'tour-detail'],
]

const run = async () => {
  const browser = await chromium.launch()

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  for (const [path, name] of shots) {
    const page = await desktop.newPage()
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/desktop-${name}.png`, fullPage: true })
    console.log(`captured desktop-${name}`)
    await page.close()
  }

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
  const m = await mobile.newPage()
  await m.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
  await m.waitForTimeout(1200)
  await m.screenshot({ path: `${out}/mobile-home.png`, fullPage: true })
  console.log('captured mobile-home')

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
