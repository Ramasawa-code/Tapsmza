'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { DEMOS } from './content'
import { Icon } from './icons'
import { Reveal } from './Reveal'

export function Demo() {
  const [idx, setIdx] = useState(0)
  const d = DEMOS[idx]

  function onKey(e: React.KeyboardEvent) {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (idx + dir + DEMOS.length) % DEMOS.length
    setIdx(next)
    document.getElementById(`demo-tab-${DEMOS[next].id}`)?.focus()
  }

  return (
    <section className="lp-section" id="demo" aria-labelledby="demo-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">Probalo</span>
          <h2 id="demo-title" className="lp-h2">
            Una tarjeta. <em>Cualquier destino.</em>
          </h2>
          <p className="lp-sub">Elegí a dónde querés llevar a tus clientes y mirá cómo se ve en su celular.</p>
        </Reveal>

        <Reveal className="lp-demo">
          <div className="lp-demo-tabs" role="tablist" aria-label="Destino de la tarjeta" onKeyDown={onKey}>
            {DEMOS.map((t, i) => (
              <button
                key={t.id}
                id={`demo-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-controls="demo-panel"
                tabIndex={i === idx ? 0 : -1}
                className={`lp-demo-tab ${i === idx ? 'is-active' : ''}`}
                onClick={() => setIdx(i)}
              >
                <Icon name={t.icon} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="lp-demo-stage" id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${d.id}`}>
            <div className="lp-demo-url mono" aria-live="polite">
              <b>tapsmza.site/0042</b>
              <Icon name="arrow" />
              <span>{d.host}</span>
            </div>

            <div className="lp-phone lp-phone-sm">
              <div className="lp-phone-notch" />
              <div className="lp-screen">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={d.id}
                    className="lp-dscreen"
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <div className="lp-rv-bar">
                      <span className="lp-lock" aria-hidden="true" />
                      <span>{d.host}</span>
                    </div>
                    <div className="lp-dscreen-body">
                      <div className="lp-dscreen-icon">
                        <Icon name={d.icon} />
                      </div>
                      <p className="lp-rv-title">{d.title}</p>
                      <small>{d.sub}</small>
                      {d.id === 'resenas' && (
                        <div className="lp-rv-stars is-static" aria-hidden="true">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Icon key={i} name="star" />
                          ))}
                        </div>
                      )}
                      <div className="lp-rv-lines" aria-hidden="true">
                        <i />
                        <i />
                      </div>
                      <div className="lp-rv-btn">{d.cta}</div>
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
