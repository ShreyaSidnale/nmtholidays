/**
 * Machine-translates key CMS display fields (destination names, tour titles,
 * tagline) into Hindi / Marathi / Kannada and writes them to the localized
 * fields in Payload. Re-runnable. Untranslated fields fall back to English.
 *
 *   npx tsx scripts/translate.ts
 *
 * Extend the maps below (or translate remaining fields directly in /admin →
 * switch the locale selector at the top of any document).
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Tri = { hi: string; mr: string; kn: string }

const DEST_NAMES: Record<string, Tri> = {
  Kashmir: { hi: 'कश्मीर', mr: 'काश्मीर', kn: 'ಕಾಶ್ಮೀರ' },
  Kerala: { hi: 'केरल', mr: 'केरळ', kn: 'ಕೇರಳ' },
  Rajasthan: { hi: 'राजस्थान', mr: 'राजस्थान', kn: 'ರಾಜಸ್ಥಾನ' },
  Himachal: { hi: 'हिमाचल', mr: 'हिमाचल', kn: 'ಹಿಮಾಚಲ' },
  Bali: { hi: 'बाली', mr: 'बाली', kn: 'ಬಾಲಿ' },
  Dubai: { hi: 'दुबई', mr: 'दुबई', kn: 'ದುಬೈ' },
  Thailand: { hi: 'थाईलैंड', mr: 'थायलंड', kn: 'ಥೈಲ್ಯಾಂಡ್' },
  Maldives: { hi: 'मालदीव', mr: 'मालदीव', kn: 'ಮಾಲ್ಡೀವ್ಸ್' },
}

const TOUR_TITLES: Record<string, Tri> = {
  'Enchanting Kashmir — Srinagar, Gulmarg & Pahalgam': {
    hi: 'मनमोहक कश्मीर — श्रीनगर, गुलमर्ग और पहलगाम',
    mr: 'मोहक काश्मीर — श्रीनगर, गुलमर्ग आणि पहलगाम',
    kn: 'ಮನಮೋಹಕ ಕಾಶ್ಮೀರ — ಶ್ರೀನಗರ, ಗುಲ್ಮಾರ್ಗ್ ಮತ್ತು ಪಹಲ್ಗಾಮ್',
  },
  'Kerala Backwaters & Beaches': {
    hi: 'केरल बैकवाटर और समुद्र तट',
    mr: 'केरळ बॅकवॉटर आणि समुद्रकिनारे',
    kn: 'ಕೇರಳ ಬ್ಯಾಕ್‌ವಾಟರ್ ಮತ್ತು ಕಡಲತೀರಗಳು',
  },
  'Bali Honeymoon Special': {
    hi: 'बाली हनीमून स्पेशल',
    mr: 'बाली हनिमून स्पेशल',
    kn: 'ಬಾಲಿ ಹನಿಮೂನ್ ಸ್ಪೆಷಲ್',
  },
  'Royal Rajasthan — Jaipur, Jodhpur & Udaipur': {
    hi: 'शाही राजस्थान — जयपुर, जोधपुर और उदयपुर',
    mr: 'राजेशाही राजस्थान — जयपूर, जोधपूर आणि उदयपूर',
    kn: 'ರಾಜವೈಭವ ರಾಜಸ್ಥಾನ — ಜೈಪುರ, ಜೋಧ್‌ಪುರ ಮತ್ತು ಉದಯಪುರ',
  },
  'Dubai Extravaganza': {
    hi: 'दुबई एक्स्ट्रावेगेंज़ा',
    mr: 'दुबई एक्स्ट्राव्हॅगान्झा',
    kn: 'ದುಬೈ ಎಕ್ಸ್‌ಟ್ರಾವಗಾಂಜಾ',
  },
}

const TAGLINE: Tri = {
  hi: 'आपका सर्वश्रेष्ठ यात्रा साथी',
  mr: 'तुमचा परिपूर्ण प्रवास साथीदार',
  kn: 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಪ್ರಯಾಣ ಸಂಗಾತಿ',
}

const LOCALES = ['hi', 'mr', 'kn'] as const

async function run() {
  const payload = await getPayload({ config: await config })
  console.log('Translating CMS content…')

  // Destinations
  const dests = await payload.find({ collection: 'destinations', limit: 100, locale: 'en' })
  for (const d of dests.docs) {
    const tri = DEST_NAMES[d.name]
    if (!tri) continue
    for (const l of LOCALES) {
      await payload.update({ collection: 'destinations', id: d.id, locale: l, data: { name: tri[l] } })
    }
    console.log(`  ✓ destination: ${d.name}`)
  }

  // Tours (title). `summary` is required+localized, so we carry the English
  // summary through to satisfy validation (translate it later in /admin).
  const tours = await payload.find({ collection: 'tours', limit: 200, locale: 'en' })
  for (const t of tours.docs) {
    const tri = TOUR_TITLES[t.title]
    if (!tri) continue
    for (const l of LOCALES) {
      await payload.update({
        collection: 'tours',
        id: t.id,
        locale: l,
        data: { title: tri[l], summary: t.summary },
      })
    }
    console.log(`  ✓ tour: ${t.title}`)
  }

  // Tagline
  for (const l of LOCALES) {
    await payload.updateGlobal({ slug: 'site-settings', locale: l, data: { tagline: TAGLINE[l] } })
  }
  console.log('  ✓ tagline')

  console.log('Done. Translate remaining fields per-locale in /admin.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
