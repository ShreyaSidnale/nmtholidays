import { chromium } from 'playwright'

const PAGES = [
  'https://nmtindiaholidays.com/aboutus',
  'https://nmtindiaholidays.com/contact-us',
  'https://nmt-pi.vercel.app/contact',
  'https://nmt-pi.vercel.app/about',
]

const run = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  for (const url of PAGES) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3500)
    const text = await page.evaluate(() => document.body.innerText)
    console.log(`\n\n========== ${url} ==========\n`)
    console.log(text.slice(0, 5000))
  }
  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
