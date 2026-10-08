'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { FAQS } from './content'
import { Icon } from './icons'
import { Reveal } from './Reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="lp-section" id="faq" aria-labelledby="faq-title">
      <div className="lp-container lp-faq-wrap">
        <Reveal className="lp-head lp-head-left">
          <span className="lp-eyebrow">Preguntas frecuentes</span>
          <h2 id="faq-title" className="lp-h2">
            Todo lo que querés <em>saber</em>.
          </h2>
        </Reveal>

        <Reveal className="lp-faq">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={`lp-faq-item ${isOpen ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <Icon name="plus" className="lp-faq-plus" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      className="lp-faq-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <p>{f.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
