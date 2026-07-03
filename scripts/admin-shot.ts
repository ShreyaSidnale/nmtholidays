import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.SHOT_BASE || 'http://localhost:3000'
const out = 'scripts/output'
mkdirSync(out, { recursive: true })

const run = async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()

  // Login page
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}/admin-login.png`, fullPage: true })
  console.log('captured admin-login')

  // Log in
  await page.fill('input[name="email"]', 'admin@nmt.local')
  await page.fill('input[name="password"]', 'NmtAdmin123!')
  await page.click('form button[type="submit"], form [type="submit"]')
  await page.waitForURL('**/admin', { timeout: 60000 }).catch(() => {})
  await page.waitForSelector('.collections__label, .modular-dashboard', { timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${out}/admin-dashboard.png`, fullPage: true })
  console.log('captured admin-dashboard')

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
