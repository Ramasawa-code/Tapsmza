'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { NAV_LINKS, whatsappUrl } from './content'
import { Icon } from './icons'
import { Wordmark } from './Wordmark'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`lp-nav ${scrolled || open ? 'is-scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <a href="#top" className="lp-nav-brand" aria-label="TAPS MZA, ir al inicio" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <nav className="lp-nav-links" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="lp-nav-actions">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary lp-nav-cta">
            Pedí la tuya
          </a>
          <button
            type="button"
            className="lp-burger"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="lp-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'x' : 'burger'} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="lp-mobile-menu"
            className="lp-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <nav aria-label="Móvil">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                  <Icon name="arrow" />
                </a>
              ))}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg btn-block"
              >
                Pedí la tuya por WhatsApp
              </a>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
