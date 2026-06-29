import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { getPostBySlug } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.excerpt || undefined }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const cover = mediaUrl(post.coverImage, 'feature')

  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-ink md:text-4xl">{post.title}</h1>
      <div className="mt-2 text-sm text-slate-500">
        {post.author && <span>By {post.author}</span>}
        {post.publishedDate && (
          <span> · {new Date(post.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        )}
      </div>
      {cover && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
          <Image src={cover} alt={post.title} fill sizes="(max-width:768px) 100vw, 768px" className="object-cover" priority />
        </div>
      )}
      {post.body && <RichText data={post.body} className="prose mt-8 max-w-none text-slate-700 [&_p]:mb-4 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold" />}
    </article>
  )
}
