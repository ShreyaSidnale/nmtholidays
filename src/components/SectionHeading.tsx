export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</span>
      )}
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
    </div>
  )
}
