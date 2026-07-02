import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LinkButton } from '@/components/ui/Button'
import { whatsappLink, tourWhatsappMessage } from '@/lib/whatsapp'

type Props = {
  number?: string | null
  template?: string
  tourTitle?: string
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WhatsAppButton({ number, template, tourTitle, label, className, size = 'lg' }: Props) {
  const ta = useTranslations('actions')
  const resolvedLabel = label ?? ta('enquireWhatsapp')
  const message = tourTitle
    ? tourWhatsappMessage(template, tourTitle)
    : 'Hi NMT India Holidays! I would like help planning a trip.'
  const href = whatsappLink(number, message)

  return (
    <LinkButton href={href} variant="whatsapp" size={size} target="_blank" rel="noopener noreferrer" className={className}>
      <MessageCircle size={18} /> {resolvedLabel}
    </LinkButton>
  )
}
