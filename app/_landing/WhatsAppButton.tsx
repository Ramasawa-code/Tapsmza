import { Icon, WhatsAppIcon } from './icons'
import { whatsappUrl } from './content'

type Props = {
  children: React.ReactNode
  message?: string
  size?: 'md' | 'lg'
  className?: string
}

export function WhatsAppButton({ children, message, size = 'lg', className = '' }: Props) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn lp-btn-wa ${size === 'lg' ? 'btn-lg' : ''} ${className}`}
    >
      <WhatsAppIcon className="lp-wa-icon" />
      <span>{children}</span>
      <Icon name="arrow" className="lp-btn-arrow" />
    </a>
  )
}
