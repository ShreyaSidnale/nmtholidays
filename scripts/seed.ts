/**
 * Seeds the database with sample destinations, tours, testimonials and site
 * settings so the site is populated out of the box. Safe to re-run — it skips
 * records that already exist (matched by slug / name).
 *
 *   npm run seed
 *
 * Replace this sample data with real NMT content via the admin, or run the
 * scraper (npm run scrape) to pull it from the existing live site.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const DESTINATIONS = [
  { name: 'Kashmir', type: 'domestic', featured: true, shortDescription: 'Paradise on earth — Dal Lake, gardens and snow-capped peaks.', image: 'https://images.unsplash.com/photo-1566837497312-7be4a47d8e88' },
  { name: 'Kerala', type: 'domestic', featured: true, shortDescription: 'Backwaters, beaches and lush hill stations of God’s Own Country.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944' },
  { name: 'Rajasthan', type: 'domestic', featured: true, shortDescription: 'Royal forts, palaces and desert adventures.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41' },
  { name: 'Himachal', type: 'domestic', featured: true, shortDescription: 'Manali, Shimla and the magic of the Himalayas.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23' },
  { name: 'Bali', type: 'international', featured: true, shortDescription: 'Island of temples, beaches and rice terraces.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { name: 'Dubai', type: 'international', featured: true, shortDescription: 'Glittering skylines, desert safaris and luxury shopping.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
  { name: 'Thailand', type: 'international', featured: true, shortDescription: 'Bangkok buzz, island beaches and vibrant culture.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526' },
  { name: 'Maldives', type: 'international', featured: true, shortDescription: 'Overwater villas and turquoise lagoons.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8' },
]

const TOURS = [
  {
    title: 'Enchanting Kashmir — Srinagar, Gulmarg & Pahalgam',
    destination: 'Kashmir',
    summary: 'A 6-day escape through Srinagar’s lakes, Gulmarg’s meadows and Pahalgam’s valleys.',
    durationDays: 6,
    durationNights: 5,
    priceFrom: 24999,
    themes: ['family', 'hill-station'],
    trending: true,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1566837497312-7be4a47d8e88',
    highlights: ['Shikara ride on Dal Lake', 'Gondola at Gulmarg', 'Betaab Valley', 'Mughal Gardens'],
    inclusions: ['5 nights hotel stay', 'Daily breakfast & dinner', 'All transfers by private cab', 'Sightseeing as per itinerary'],
    exclusions: ['Airfare', 'Gondola/pony charges', 'Personal expenses'],
    itinerary: [
      { title: 'Arrival in Srinagar', description: 'Arrive and transfer to your houseboat. Evening Shikara ride on Dal Lake.', meals: 'Dinner', stay: 'Srinagar' },
      { title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg, enjoy the Gondola ride and meadows.', meals: 'Breakfast, Dinner', stay: 'Gulmarg' },
      { title: 'Gulmarg to Pahalgam', description: 'Scenic drive to Pahalgam via saffron fields.', meals: 'Breakfast, Dinner', stay: 'Pahalgam' },
      { title: 'Pahalgam local', description: 'Visit Betaab Valley, Aru and Chandanwari.', meals: 'Breakfast, Dinner', stay: 'Pahalgam' },
      { title: 'Back to Srinagar', description: 'Return to Srinagar, visit Mughal Gardens.', meals: 'Breakfast, Dinner', stay: 'Srinagar' },
      { title: 'Departure', description: 'Transfer to airport with beautiful memories.', meals: 'Breakfast' },
    ],
    faqs: [{ question: 'Is it safe to travel to Kashmir?', answer: 'Yes, tourist areas are safe and well-supported. We monitor conditions and assist throughout.' }],
  },
  {
    title: 'Kerala Backwaters & Beaches',
    destination: 'Kerala',
    summary: 'Munnar tea gardens, Alleppey houseboats and Kovalam beaches in 5 relaxing days.',
    durationDays: 5,
    durationNights: 4,
    priceFrom: 21999,
    themes: ['honeymoon', 'family'],
    trending: true,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
    highlights: ['Alleppey houseboat stay', 'Munnar tea plantations', 'Kathakali show', 'Kovalam beach'],
    inclusions: ['4 nights accommodation', 'Houseboat with full board', 'Private transfers', 'Daily breakfast'],
    exclusions: ['Airfare', 'Entry tickets', 'Personal expenses'],
    itinerary: [
      { title: 'Arrive Cochin → Munnar', description: 'Drive to Munnar through waterfalls and spice plantations.', meals: 'Dinner', stay: 'Munnar' },
      { title: 'Munnar sightseeing', description: 'Tea museum, Mattupetty dam and Echo Point.', meals: 'Breakfast', stay: 'Munnar' },
      { title: 'Munnar → Alleppey', description: 'Board a traditional houseboat on the backwaters.', meals: 'Breakfast, Lunch, Dinner', stay: 'Houseboat' },
      { title: 'Alleppey → Kovalam', description: 'Relax at the beach in the evening.', meals: 'Breakfast', stay: 'Kovalam' },
      { title: 'Departure', description: 'Transfer to Trivandrum airport.', meals: 'Breakfast' },
    ],
  },
  {
    title: 'Bali Honeymoon Special',
    destination: 'Bali',
    summary: 'Romantic 6-day Bali getaway with private pool villa, Ubud and Nusa Penida.',
    durationDays: 6,
    durationNights: 5,
    priceFrom: 64999,
    currency: 'INR',
    themes: ['honeymoon', 'beach'],
    trending: true,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    highlights: ['Private pool villa', 'Nusa Penida island tour', 'Ubud rice terraces', 'Romantic candlelight dinner'],
    inclusions: ['5 nights stay', 'Daily breakfast', 'Airport transfers', 'Day tours with guide'],
    exclusions: ['Airfare', 'Visa', 'Lunch & dinner unless specified'],
    itinerary: [
      { title: 'Arrival in Bali', description: 'Transfer to your villa, evening at leisure.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Nusa Penida tour', description: 'Kelingking, Broken Beach and Angel’s Billabong.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Ubud day tour', description: 'Rice terraces, temples and the monkey forest.', meals: 'Breakfast', stay: 'Ubud' },
      { title: 'Water sports & beaches', description: 'Enjoy watersports at Tanjung Benoa.', meals: 'Breakfast', stay: 'Ubud' },
      { title: 'Leisure & shopping', description: 'Free day for shopping and spa.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ],
  },
  {
    title: 'Royal Rajasthan — Jaipur, Jodhpur & Udaipur',
    destination: 'Rajasthan',
    summary: 'Forts, palaces and culture across the Pink, Blue and Lake cities in 7 days.',
    durationDays: 7,
    durationNights: 6,
    priceFrom: 32999,
    themes: ['heritage', 'family'],
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    highlights: ['Amber Fort', 'Mehrangarh Fort', 'Lake Pichola boat ride', 'City Palace Udaipur'],
    inclusions: ['6 nights heritage hotels', 'Daily breakfast', 'AC car with driver', 'Guided sightseeing'],
    exclusions: ['Airfare', 'Monument entry fees', 'Camera charges'],
    itinerary: [
      { title: 'Arrive Jaipur', description: 'Welcome to the Pink City.', meals: 'Dinner', stay: 'Jaipur' },
      { title: 'Jaipur sightseeing', description: 'Amber Fort, City Palace and Hawa Mahal.', meals: 'Breakfast', stay: 'Jaipur' },
      { title: 'Jaipur → Jodhpur', description: 'Drive to the Blue City.', meals: 'Breakfast', stay: 'Jodhpur' },
      { title: 'Jodhpur sightseeing', description: 'Mehrangarh Fort and Jaswant Thada.', meals: 'Breakfast', stay: 'Jodhpur' },
      { title: 'Jodhpur → Udaipur', description: 'Drive to the City of Lakes.', meals: 'Breakfast', stay: 'Udaipur' },
      { title: 'Udaipur sightseeing', description: 'City Palace and Lake Pichola boat ride.', meals: 'Breakfast', stay: 'Udaipur' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ],
  },
  {
    title: 'Dubai Extravaganza',
    destination: 'Dubai',
    summary: 'City tour, desert safari and Burj Khalifa across 5 dazzling days.',
    durationDays: 5,
    durationNights: 4,
    priceFrom: 54999,
    themes: ['family', 'group'],
    trending: true,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    highlights: ['Burj Khalifa 124th floor', 'Desert safari with BBQ dinner', 'Dubai Marina cruise', 'Abu Dhabi day trip'],
    inclusions: ['4 nights hotel', 'Daily breakfast', 'Tours with transfers', 'Visa assistance'],
    exclusions: ['Airfare', 'Lunch & dinner', 'Personal expenses'],
    itinerary: [
      { title: 'Arrival', description: 'Arrive in Dubai, evening Marina dhow cruise.', meals: 'Dinner', stay: 'Dubai' },
      { title: 'City tour + Burj Khalifa', description: 'Half-day city tour and Burj Khalifa visit.', meals: 'Breakfast', stay: 'Dubai' },
      { title: 'Desert safari', description: 'Dune bashing, camel ride and BBQ dinner.', meals: 'Breakfast, Dinner', stay: 'Dubai' },
      { title: 'Abu Dhabi tour', description: 'Sheikh Zayed Mosque and Ferrari World.', meals: 'Breakfast', stay: 'Dubai' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ],
  },
]

const TESTIMONIALS = [
  { name: 'Priya & Rohan', location: 'Mumbai', rating: 5, quote: 'Our Bali honeymoon was flawless. Every detail was taken care of — truly memories for life!' },
  { name: 'Anil Sharma', location: 'Delhi', rating: 5, quote: 'The Kashmir trip exceeded expectations. Great hotels, smooth transfers and a wonderful guide.' },
  { name: 'Sneha Patel', location: 'Ahmedabad', rating: 5, quote: 'Loved our Kerala backwater stay. NMT made booking so easy over WhatsApp.' },
]

async function uploadFromUrl(payload: any, url: string, alt: string): Promise<number | null> {
  try {
    const res = await fetch(`${url}?auto=format&fit=crop&w=1600&q=70`)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        name: `${alt.toLowerCase().replace(/[^\w]+/g, '-')}.jpg`,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
    })
    return doc.id
  } catch (e) {
    console.warn(`  ! image upload failed for ${alt}:`, (e as Error).message)
    return null
  }
}

async function run() {
  const payload = await getPayload({ config: await config })
  console.log('Seeding database…')

  const destIds: Record<string, number> = {}
  for (const d of DESTINATIONS) {
    const existing = await payload.find({ collection: 'destinations', where: { name: { equals: d.name } }, limit: 1 })
    if (existing.docs[0]) {
      destIds[d.name] = existing.docs[0].id
      console.log(`  = destination exists: ${d.name}`)
      continue
    }
    const image = await uploadFromUrl(payload, d.image, d.name)
    const doc = await payload.create({
      collection: 'destinations',
      data: { name: d.name, type: d.type as 'domestic' | 'international', featured: d.featured, shortDescription: d.shortDescription, image: image ?? undefined },
    })
    destIds[d.name] = doc.id
    console.log(`  + destination: ${d.name}`)
  }

  for (const t of TOURS) {
    const existing = await payload.find({ collection: 'tours', where: { title: { equals: t.title } }, limit: 1 })
    if (existing.docs[0]) {
      console.log(`  = tour exists: ${t.title}`)
      continue
    }
    const hero = await uploadFromUrl(payload, t.heroImage, t.title)
    await payload.create({
      collection: 'tours',
      data: {
        title: t.title,
        destination: destIds[t.destination],
        summary: t.summary,
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        priceFrom: t.priceFrom,
        currency: (t.currency as 'INR' | 'USD' | 'EUR') ?? 'INR',
        themes: t.themes as any,
        trending: t.trending ?? false,
        featured: t.featured ?? false,
        status: 'published',
        heroImage: hero ?? undefined,
        highlights: t.highlights?.map((text) => ({ text })),
        inclusions: t.inclusions?.map((text) => ({ text })),
        exclusions: t.exclusions?.map((text) => ({ text })),
        itinerary: t.itinerary,
        faqs: t.faqs,
      },
    })
    console.log(`  + tour: ${t.title}`)
  }

  for (const r of TESTIMONIALS) {
    const existing = await payload.find({ collection: 'testimonials', where: { name: { equals: r.name } }, limit: 1 })
    if (existing.docs[0]) continue
    await payload.create({ collection: 'testimonials', data: { ...r, published: true } })
    console.log(`  + testimonial: ${r.name}`)
  }

  // Site settings (WhatsApp/contact + hero slides from featured destinations).
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings?.whatsappNumber) {
    const heroDest = await payload.find({ collection: 'destinations', where: { featured: { equals: true } }, limit: 3, depth: 1 })
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'NMT India Holidays',
        tagline: 'Sirf Trip Nahi, Memories Banao',
        phone: '+91 90000 00000',
        whatsappNumber: '919000000000',
        whatsappMessageTemplate: 'Hi NMT India Holidays! I would like to know more about {tour}.',
        email: 'info@nmtindiaholidays.com',
        address: 'NMT India Holidays, India',
        heroSlides: heroDest.docs
          .filter((d) => d.image)
          .map((d) => ({ image: typeof d.image === 'object' ? d.image!.id : d.image!, heading: `Discover ${d.name}`, subheading: d.shortDescription })),
      },
    })
    console.log('  + site settings updated')
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
