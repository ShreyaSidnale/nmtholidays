/**
 * Creates (or ensures) a test admin user for local verification.
 *   npx tsx scripts/create-admin.ts
 * Credentials: admin@nmt.local / NmtAdmin123!  (change/delete in production)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const EMAIL = 'admin@nmt.local'
const PASSWORD = 'NmtAdmin123!'

async function run() {
  const payload = await getPayload({ config: await config })
  const existing = await payload.find({ collection: 'users', where: { email: { equals: EMAIL } }, limit: 1 })
  if (existing.docs[0]) {
    console.log(`admin exists: ${EMAIL}`)
  } else {
    await payload.create({ collection: 'users', data: { email: EMAIL, password: PASSWORD, name: 'NMT Admin' } })
    console.log(`created admin: ${EMAIL} / ${PASSWORD}`)
  }
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
