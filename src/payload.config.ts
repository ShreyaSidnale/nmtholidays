import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { Destinations } from './collections/Destinations'
import { Testimonials } from './collections/Testimonials'
import { BlogPosts } from './collections/BlogPosts'
import { Enquiries } from './collections/Enquiries'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = process.env.DATABASE_URI || ''
const usePostgres = databaseUri.startsWith('postgres')

// Postgres (Neon/Supabase) in production; zero-config SQLite file for local dev.
const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseUri } })
  : sqliteAdapter({ client: { url: databaseUri || `file:${path.resolve(dirname, '../nmt.db')}` } })

// On Vercel the filesystem is ephemeral, so uploaded media must go to blob
// storage. Enabled only when a Vercel Blob token is present — locally, uploads
// keep using the disk (no token needed).
const plugins: Plugin[] = []
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
    meta: {
      titleSuffix: '· NMT India Holidays',
    },
  },
  collections: [Tours, Destinations, Testimonials, BlogPosts, Enquiries, Media, Users],
  globals: [SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'हिन्दी (Hindi)', code: 'hi' },
      { label: 'मराठी (Marathi)', code: 'mr' },
      { label: 'ಕನ್ನಡ (Kannada)', code: 'kn' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_ENV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins,
})
