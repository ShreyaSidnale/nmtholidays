import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700',
        accent: 'bg-accent-500 text-ink hover:bg-accent-600 hover:text-white',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe5a]',
        outline: 'border border-brand-600 text-brand-700 hover:bg-brand-50',
        ghost: 'text-brand-700 hover:bg-brand-50',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}

type LinkButtonProps = VariantProps<typeof button> & {
  href: string
  className?: string
  children: React.ReactNode
  target?: string
  rel?: string
}

export function LinkButton({ variant, size, className, href, ...props }: LinkButtonProps) {
  const isExternal = href.startsWith('http')
  if (isExternal) {
    return <a href={href} className={cn(button({ variant, size }), className)} {...props} />
  }
  return <Link href={href} className={cn(button({ variant, size }), className)} {...props} />
}
