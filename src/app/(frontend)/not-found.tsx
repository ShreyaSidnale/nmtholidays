import { useTranslations } from 'next-intl'
import { LinkButton } from '@/components/ui/Button'

export default function NotFound() {
  const ta = useTranslations('actions')
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl font-extrabold text-brand-600">404</span>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">
        The page you’re looking for doesn’t exist or may have moved. Let’s get you back on the road.
      </p>
      <div className="mt-6 flex gap-3">
        <LinkButton href="/" variant="primary">{ta('backHome')}</LinkButton>
        <LinkButton href="/tours" variant="outline">{ta('browseTours')}</LinkButton>
      </div>
    </div>
  )
}
