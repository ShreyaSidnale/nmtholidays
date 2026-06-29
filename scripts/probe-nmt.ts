import { chromium } from 'playwright'

const run = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://nmtindiaholidays.com/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'))
      .map((a) => ({ text: (a.textContent || '').trim().slice(0, 40), href: (a as HTMLAnchorElement).href }))
      .filter((l) => l.href && !l.href.startsWith('javascript'))
    const uniqueLinks = Array.from(new Map(links.map((l) => [l.href, l])).values())
    const images = Array.from(document.querySelectorAll('img')).map((i) => (i as HTMLImageElement).src).slice(0, 20)
    return {
      title: document.title,
      headings: Array.from(document.querySelectorAll('h1,h2,h3')).map((h) => (h.textContent || '').trim()).filter(Boolean).slice(0, 30),
      links: uniqueLinks.slice(0, 60),
      images,
      bodyTextLength: document.body.innerText.length,
      bodySample: document.body.innerText.slice(0, 1500),
    }
  })

  console.log(JSON.stringify(data, null, 2))
  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
