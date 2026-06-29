import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SectionHeading } from '@/components/SectionHeading'
import { getPosts } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'Travel tips, destination guides and stories from NMT India Holidays.',
}

export default async function BlogPage() {
  const posts = await getPosts(24).catch(() => [])

  return (
    <div className="container-page py-12">
      <SectionHeading align="left" eyebrow="Stories & Guides" title="Travel Blog" />

      {posts.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No posts published yet. Write one in the admin under Content → Blog Posts.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const cover = mediaUrl(p.coverImage, 'card')
            return (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-slate-100">
                  {cover && <Image src={cover} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <h3 className="mt-3 font-semibold text-ink group-hover:text-brand-700">{p.title}</h3>
                {p.excerpt && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
