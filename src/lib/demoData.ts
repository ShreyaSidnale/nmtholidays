/**
 * Static demo content used as a fallback when no database is connected (e.g.
 * on the Vercel prototype deployment) or when the DB returns no rows. This lets
 * the public site render a full, clickable demo with zero backend setup.
 *
 * When a real database IS connected and has data, the query layer uses that
 * instead (see src/lib/queries.ts) — this file is only a graceful fallback.
 *
 * Images are remote (Unsplash) so no uploaded media is required; the hostnames
 * are allowlisted in next.config.ts.
 */
import type { Tour, Destination, Testimonial, Post, SiteSetting, Media } from '@/payload-types'

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`

// Build a Media-like object accepted by mediaUrl()/next-image.
const img = (url: string, alt: string): Media =>
  ({ id: 0, alt, url, updatedAt: '', createdAt: '' }) as unknown as Media

const IMG = {
  kashmir: U('photo-1506905925346-21bda4d32df4'),
  kerala: U('photo-1602216056096-3b40cc0c9944'),
  rajasthan: U('photo-1599661046289-e31897846e41'),
  himachal: U('photo-1626621341517-bbf3d9990a23'),
  bali: U('photo-1537996194471-e657df975ab4'),
  dubai: U('photo-1512453979798-5ea266f8880c'),
  thailand: U('photo-1528181304800-259b08848526'),
  maldives: U('photo-1514282401047-d79a71a590e8'),
}

/* --------------------------------------------------------------- Destinations */
type DemoDest = Destination & { image: Media }

export const demoDestinations: DemoDest[] = [
  { id: 1, name: 'Kashmir', slug: 'kashmir', type: 'domestic', featured: true, shortDescription: 'Paradise on earth — Dal Lake, gardens and snow-capped peaks.', image: img(IMG.kashmir, 'Kashmir') },
  { id: 2, name: 'Kerala', slug: 'kerala', type: 'domestic', featured: true, shortDescription: 'Backwaters, beaches and lush hill stations of God’s Own Country.', image: img(IMG.kerala, 'Kerala') },
  { id: 3, name: 'Rajasthan', slug: 'rajasthan', type: 'domestic', featured: true, shortDescription: 'Royal forts, palaces and desert adventures.', image: img(IMG.rajasthan, 'Rajasthan') },
  { id: 4, name: 'Himachal', slug: 'himachal', type: 'domestic', featured: true, shortDescription: 'Manali, Shimla and the magic of the Himalayas.', image: img(IMG.himachal, 'Himachal') },
  { id: 5, name: 'Bali', slug: 'bali', type: 'international', featured: true, shortDescription: 'Island of temples, beaches and rice terraces.', image: img(IMG.bali, 'Bali') },
  { id: 6, name: 'Dubai', slug: 'dubai', type: 'international', featured: true, shortDescription: 'Glittering skylines, desert safaris and luxury shopping.', image: img(IMG.dubai, 'Dubai') },
  { id: 7, name: 'Thailand', slug: 'thailand', type: 'international', featured: true, shortDescription: 'Bangkok buzz, island beaches and vibrant culture.', image: img(IMG.thailand, 'Thailand') },
  { id: 8, name: 'Maldives', slug: 'maldives', type: 'international', featured: true, shortDescription: 'Overwater villas and turquoise lagoons.', image: img(IMG.maldives, 'Maldives') },
].map((d) => ({ ...d, updatedAt: '2026-01-01', createdAt: '2026-01-01' })) as DemoDest[]

const destRef = (slug: string) => demoDestinations.find((d) => d.slug === slug) as Destination

type Day = { title: string; description: string; meals?: string; stay?: string }
const li = (arr: string[]) => arr.map((text, i) => ({ text, id: String(i) }))
const days = (arr: Day[]) => arr.map((d, i) => ({ ...d, id: String(i) }))

/* ---------------------------------------------------------------------- Tours */
export const demoTours: Tour[] = [
  {
    id: 101,
    title: 'Enchanting Kashmir — Srinagar, Gulmarg & Pahalgam',
    slug: 'enchanting-kashmir',
    destination: destRef('kashmir'),
    summary: 'A 6-day escape through Srinagar’s lakes, Gulmarg’s meadows and Pahalgam’s valleys.',
    durationDays: 6,
    durationNights: 5,
    priceFrom: 24999,
    currency: 'INR',
    themes: ['family', 'hill-station'],
    trending: true,
    featured: true,
    status: 'published',
    heroImage: img(IMG.kashmir, 'Kashmir'),
    gallery: [{ image: img(IMG.himachal, 'Valley'), id: '1' }, { image: img(IMG.kashmir, 'Dal Lake'), id: '2' }],
    highlights: li(['Shikara ride on Dal Lake', 'Gondola at Gulmarg', 'Betaab Valley', 'Mughal Gardens']),
    inclusions: li(['5 nights hotel stay', 'Daily breakfast & dinner', 'All transfers by private cab', 'Sightseeing as per itinerary']),
    exclusions: li(['Airfare', 'Gondola/pony charges', 'Personal expenses']),
    itinerary: days([
      { title: 'Arrival in Srinagar', description: 'Arrive and transfer to your houseboat. Evening Shikara ride on Dal Lake.', meals: 'Dinner', stay: 'Srinagar' },
      { title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg, enjoy the Gondola ride and meadows.', meals: 'Breakfast, Dinner', stay: 'Gulmarg' },
      { title: 'Gulmarg to Pahalgam', description: 'Scenic drive to Pahalgam via saffron fields.', meals: 'Breakfast, Dinner', stay: 'Pahalgam' },
      { title: 'Pahalgam local', description: 'Visit Betaab Valley, Aru and Chandanwari.', meals: 'Breakfast, Dinner', stay: 'Pahalgam' },
      { title: 'Back to Srinagar', description: 'Return to Srinagar, visit Mughal Gardens.', meals: 'Breakfast, Dinner', stay: 'Srinagar' },
      { title: 'Departure', description: 'Transfer to airport with beautiful memories.', meals: 'Breakfast' },
    ]),
    faqs: [{ question: 'Is it safe to travel to Kashmir?', answer: 'Yes, tourist areas are safe and well-supported. We monitor conditions and assist throughout.', id: '1' }],
  },
  {
    id: 102,
    title: 'Kerala Backwaters & Beaches',
    slug: 'kerala-backwaters',
    destination: destRef('kerala'),
    summary: 'Munnar tea gardens, Alleppey houseboats and Kovalam beaches in 5 relaxing days.',
    durationDays: 5,
    durationNights: 4,
    priceFrom: 21999,
    currency: 'INR',
    themes: ['honeymoon', 'family'],
    trending: true,
    status: 'published',
    heroImage: img(IMG.kerala, 'Kerala'),
    gallery: [{ image: img(IMG.kerala, 'Backwaters'), id: '1' }],
    highlights: li(['Alleppey houseboat stay', 'Munnar tea plantations', 'Kathakali show', 'Kovalam beach']),
    inclusions: li(['4 nights accommodation', 'Houseboat with full board', 'Private transfers', 'Daily breakfast']),
    exclusions: li(['Airfare', 'Entry tickets', 'Personal expenses']),
    itinerary: days([
      { title: 'Arrive Cochin → Munnar', description: 'Drive to Munnar through waterfalls and spice plantations.', meals: 'Dinner', stay: 'Munnar' },
      { title: 'Munnar sightseeing', description: 'Tea museum, Mattupetty dam and Echo Point.', meals: 'Breakfast', stay: 'Munnar' },
      { title: 'Munnar → Alleppey', description: 'Board a traditional houseboat on the backwaters.', meals: 'Breakfast, Lunch, Dinner', stay: 'Houseboat' },
      { title: 'Alleppey → Kovalam', description: 'Relax at the beach in the evening.', meals: 'Breakfast', stay: 'Kovalam' },
      { title: 'Departure', description: 'Transfer to Trivandrum airport.', meals: 'Breakfast' },
    ]),
    faqs: [{ question: 'Is the houseboat air-conditioned?', answer: 'Yes, AC is available in the bedrooms during the night.', id: '1' }],
  },
  {
    id: 103,
    title: 'Bali Honeymoon Special',
    slug: 'bali-honeymoon',
    destination: destRef('bali'),
    summary: 'Romantic 6-day Bali getaway with private pool villa, Ubud and Nusa Penida.',
    durationDays: 6,
    durationNights: 5,
    priceFrom: 64999,
    currency: 'INR',
    themes: ['honeymoon', 'beach'],
    trending: true,
    featured: true,
    status: 'published',
    heroImage: img(IMG.bali, 'Bali'),
    gallery: [{ image: img(IMG.bali, 'Bali beach'), id: '1' }],
    highlights: li(['Private pool villa', 'Nusa Penida island tour', 'Ubud rice terraces', 'Romantic candlelight dinner']),
    inclusions: li(['5 nights stay', 'Daily breakfast', 'Airport transfers', 'Day tours with guide']),
    exclusions: li(['Airfare', 'Visa', 'Lunch & dinner unless specified']),
    itinerary: days([
      { title: 'Arrival in Bali', description: 'Transfer to your villa, evening at leisure.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Nusa Penida tour', description: 'Kelingking, Broken Beach and Angel’s Billabong.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Ubud day tour', description: 'Rice terraces, temples and the monkey forest.', meals: 'Breakfast', stay: 'Ubud' },
      { title: 'Water sports & beaches', description: 'Enjoy watersports at Tanjung Benoa.', meals: 'Breakfast', stay: 'Ubud' },
      { title: 'Leisure & shopping', description: 'Free day for shopping and spa.', meals: 'Breakfast', stay: 'Kuta' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ]),
    faqs: [{ question: 'Do we need a visa for Bali?', answer: 'Indian passport holders get visa-on-arrival. We assist with the paperwork.', id: '1' }],
  },
  {
    id: 104,
    title: 'Royal Rajasthan — Jaipur, Jodhpur & Udaipur',
    slug: 'royal-rajasthan',
    destination: destRef('rajasthan'),
    summary: 'Forts, palaces and culture across the Pink, Blue and Lake cities in 7 days.',
    durationDays: 7,
    durationNights: 6,
    priceFrom: 32999,
    currency: 'INR',
    themes: ['heritage', 'family'],
    trending: true,
    status: 'published',
    heroImage: img(IMG.rajasthan, 'Rajasthan'),
    gallery: [{ image: img(IMG.rajasthan, 'Fort'), id: '1' }],
    highlights: li(['Amber Fort', 'Mehrangarh Fort', 'Lake Pichola boat ride', 'City Palace Udaipur']),
    inclusions: li(['6 nights heritage hotels', 'Daily breakfast', 'AC car with driver', 'Guided sightseeing']),
    exclusions: li(['Airfare', 'Monument entry fees', 'Camera charges']),
    itinerary: days([
      { title: 'Arrive Jaipur', description: 'Welcome to the Pink City.', meals: 'Dinner', stay: 'Jaipur' },
      { title: 'Jaipur sightseeing', description: 'Amber Fort, City Palace and Hawa Mahal.', meals: 'Breakfast', stay: 'Jaipur' },
      { title: 'Jaipur → Jodhpur', description: 'Drive to the Blue City.', meals: 'Breakfast', stay: 'Jodhpur' },
      { title: 'Jodhpur sightseeing', description: 'Mehrangarh Fort and Jaswant Thada.', meals: 'Breakfast', stay: 'Jodhpur' },
      { title: 'Jodhpur → Udaipur', description: 'Drive to the City of Lakes.', meals: 'Breakfast', stay: 'Udaipur' },
      { title: 'Udaipur sightseeing', description: 'City Palace and Lake Pichola boat ride.', meals: 'Breakfast', stay: 'Udaipur' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ]),
    faqs: [],
  },
  {
    id: 105,
    title: 'Dubai Extravaganza',
    slug: 'dubai-extravaganza',
    destination: destRef('dubai'),
    summary: 'City tour, desert safari and Burj Khalifa across 5 dazzling days.',
    durationDays: 5,
    durationNights: 4,
    priceFrom: 54999,
    currency: 'INR',
    themes: ['family', 'group'],
    trending: true,
    status: 'published',
    heroImage: img(IMG.dubai, 'Dubai'),
    gallery: [{ image: img(IMG.dubai, 'Dubai skyline'), id: '1' }],
    highlights: li(['Burj Khalifa 124th floor', 'Desert safari with BBQ dinner', 'Dubai Marina cruise', 'Abu Dhabi day trip']),
    inclusions: li(['4 nights hotel', 'Daily breakfast', 'Tours with transfers', 'Visa assistance']),
    exclusions: li(['Airfare', 'Lunch & dinner', 'Personal expenses']),
    itinerary: days([
      { title: 'Arrival', description: 'Arrive in Dubai, evening Marina dhow cruise.', meals: 'Dinner', stay: 'Dubai' },
      { title: 'City tour + Burj Khalifa', description: 'Half-day city tour and Burj Khalifa visit.', meals: 'Breakfast', stay: 'Dubai' },
      { title: 'Desert safari', description: 'Dune bashing, camel ride and BBQ dinner.', meals: 'Breakfast, Dinner', stay: 'Dubai' },
      { title: 'Abu Dhabi tour', description: 'Sheikh Zayed Mosque and Ferrari World.', meals: 'Breakfast', stay: 'Dubai' },
      { title: 'Departure', description: 'Transfer to airport.', meals: 'Breakfast' },
    ]),
    faqs: [],
  },
  {
    id: 106,
    title: 'Magical Maldives Getaway',
    slug: 'magical-maldives',
    destination: destRef('maldives'),
    summary: 'Four nights of overwater-villa bliss with snorkelling and sunset cruises.',
    durationDays: 5,
    durationNights: 4,
    priceFrom: 89999,
    currency: 'INR',
    themes: ['honeymoon', 'beach'],
    featured: true,
    status: 'published',
    heroImage: img(IMG.maldives, 'Maldives'),
    gallery: [{ image: img(IMG.maldives, 'Lagoon'), id: '1' }],
    highlights: li(['Overwater villa', 'Snorkelling with reef fish', 'Sunset dolphin cruise', 'Candlelight beach dinner']),
    inclusions: li(['4 nights resort stay', 'All meals (full board)', 'Speedboat/seaplane transfers', 'Snorkelling gear']),
    exclusions: li(['Airfare', 'Excursions not listed', 'Personal expenses']),
    itinerary: days([
      { title: 'Arrival in Malé', description: 'Seaplane transfer to your resort; evening at leisure.', meals: 'Dinner', stay: 'Resort' },
      { title: 'Island & snorkelling', description: 'Snorkel the house reef and relax by the lagoon.', meals: 'Breakfast, Lunch, Dinner', stay: 'Resort' },
      { title: 'Sunset dolphin cruise', description: 'Spot dolphins and enjoy a candlelight beach dinner.', meals: 'Breakfast, Lunch, Dinner', stay: 'Resort' },
      { title: 'Leisure day', description: 'Spa, watersports or simply unwind.', meals: 'Breakfast, Lunch, Dinner', stay: 'Resort' },
      { title: 'Departure', description: 'Transfer back to Malé for your flight.', meals: 'Breakfast' },
    ]),
    faqs: [],
  },
].map((t) => ({ ...t, updatedAt: '2026-01-01', createdAt: '2026-01-01', _status: 'published' })) as unknown as Tour[]

/* -------------------------------------------------------------- Testimonials */
export const demoTestimonials: Testimonial[] = [
  { id: 1, name: 'Priya & Rohan', location: 'Mumbai', rating: 5, quote: 'Our Bali honeymoon was flawless. Every detail was taken care of — truly memories for life!', published: true },
  { id: 2, name: 'Anil Sharma', location: 'Delhi', rating: 5, quote: 'The Kashmir trip exceeded expectations. Great hotels, smooth transfers and a wonderful guide.', published: true },
  { id: 3, name: 'Sneha Patel', location: 'Ahmedabad', rating: 5, quote: 'Loved our Kerala backwater stay. NMT made booking so easy over WhatsApp.', published: true },
].map((t) => ({ ...t, updatedAt: '2026-01-01', createdAt: '2026-01-01' })) as unknown as Testimonial[]

/* ---------------------------------------------------------------------- Posts */
export const demoPosts: Post[] = [
  { id: 1, title: 'Best time to visit Kashmir', slug: 'best-time-to-visit-kashmir', excerpt: 'From tulip season to snowfall — a month-by-month guide to planning your Kashmir trip.', status: 'published', publishedDate: '2026-03-01' },
  { id: 2, title: '7 things to pack for the Maldives', slug: 'packing-for-maldives', excerpt: 'Reef-safe sunscreen, light layers and more — our essential Maldives packing list.', status: 'published', publishedDate: '2026-04-10' },
  { id: 3, title: 'A first-timer’s guide to Rajasthan', slug: 'first-timers-rajasthan', excerpt: 'Forts, food and festivals — how to make the most of the land of kings.', status: 'published', publishedDate: '2026-05-05' },
].map((p) => ({ ...p, updatedAt: '2026-01-01', createdAt: '2026-01-01' })) as unknown as Post[]

/* -------------------------------------------------------------- Site settings */
export const demoSiteSettings = {
  siteName: 'NMT India Holidays',
  tagline: 'Your Perfect Travelling Partner',
  logo: img('/nmt-logo.png', 'NMT India Holidays'),
  phone: '+91 96979 88891',
  whatsappNumber: '919697988892',
  whatsappMessageTemplate: 'Hi NMT India Holidays! I would like to know more about {tour}.',
  email: 'info@nmtindiaholidays.com',
  address: 'Office No.106/107, First Floor, Shiv Platino,\nOpp. Khare Mangal Karyalaya Parking,\nVishrambag, Sangli 416 415 (MS), India',
  officeHours: 'Mon – Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 3:00 PM',
  facebook: 'https://www.facebook.com/nmtindiaSangli',
  instagram: 'https://www.instagram.com/nmt_india_holidays',
  youtube: '',
  heroSlides: [
    { image: img(IMG.maldives, 'Maldives'), heading: 'Discover the Maldives', subheading: 'Overwater villas and turquoise lagoons.', id: '1' },
    { image: img(IMG.kashmir, 'Kashmir'), heading: 'Experience Kashmir', subheading: 'Paradise on earth awaits you.', id: '2' },
    { image: img(IMG.dubai, 'Dubai'), heading: 'Dazzling Dubai', subheading: 'Skylines, deserts and luxury.', id: '3' },
  ],
} as unknown as SiteSetting
