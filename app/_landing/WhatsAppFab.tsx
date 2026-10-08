'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { whatsappUrl } from './content'
import { WhatsAppIcon } from './icons'

export function WhatsAppFab() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <m.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="lp-fab"
          aria-label="Escribinos por WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <WhatsAppIcon />
        </m.a>
      )}
    </AnimatePresence>
  )
}
