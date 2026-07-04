import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.SHOT_BASE || 'http://localhost:3000'
const out = 'scripts/output'
mkdirSync(out, { recursive: true })

const run = async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}/demo-home.png`, fullPage: true })
  console.log('captured demo-home')

  await page.goto(`${BASE}/tours/enchanting-kashmir`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}/demo-tour.png`, fullPage: true })
  console.log('captured demo-tour')

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
