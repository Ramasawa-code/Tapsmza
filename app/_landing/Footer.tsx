import Link from 'next/link'
import { NAV_LINKS } from './content'
import { Wordmark } from './Wordmark'

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container lp-footer-inner">
        <div>
          <Wordmark />
          <p>Tarjetas inteligentes NFC y QR. Hechas en Mendoza.</p>
        </div>
        <nav aria-label="Pie de página">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <Link href="/admin">Acceso admin</Link>
        </nav>
      </div>
      <div className="lp-container lp-footer-bottom">
        <span>© {new Date().getFullYear()} TAPS MZA</span>
      </div>
    </footer>
  )
}
