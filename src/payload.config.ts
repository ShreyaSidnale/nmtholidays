import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· NMT India Holidays',
    },
  },
  collections: [Tours, Destinations, Testimonials, BlogPosts, Enquiries, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_ENV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
})
