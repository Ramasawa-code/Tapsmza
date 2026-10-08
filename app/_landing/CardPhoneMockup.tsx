'use client'

import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Icon } from './icons'

// Mockup 100% CSS/SVG: una tarjeta NFC "toca" el celular y la pantalla pasa
// de "Acercá la tarjeta" a la pantalla de reseña. El loop vive en landing.css.
export function CardPhoneMockup() {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9])
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7])

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <div className="lp-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="lp-stage-glow" aria-hidden="true" />
      <m.div className="lp-device" style={{ rotateX, rotateY }} role="img" aria-label="Una tarjeta NFC apoyada en un celular abre la pantalla de reseñas">
        {/* Celular */}
        <div className="lp-phone">
          <div className="lp-phone-notch" />
          <div className="lp-screen">
            <div className="lp-screen-idle">
              <div className="lp-idle-icon">
                <Icon name="nfc" />
              </div>
              <p>Acercá la tarjeta</p>
              <span>NFC listo</span>
            </div>

            <div className="lp-screen-review">
              <div className="lp-rv-bar">
                <Icon name="pin" />
                <span>Café Aconcagua</span>
              </div>
              <div className="lp-rv-body">
                <p className="lp-rv-title">¿Cómo fue tu experiencia?</p>
                <div className="lp-rv-stars" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" style={{ ['--i' as string]: i }} />
                  ))}
                </div>
                <div className="lp-rv-lines" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="lp-rv-btn">Publicar reseña</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ondas NFC */}
        <div className="lp-waves" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        {/* Tarjeta */}
        <div className="lp-card3d" aria-hidden="true">
          <div className="lp-card-face">
            <div className="lp-card-top">
              <span className="wordmark">
                TAPS<span>MZA</span>
              </span>
              <Icon name="nfc" />
            </div>
            <div className="lp-card-bottom">
              <span className="mono">tapsmza.site/0001</span>
              <div className="lp-card-chip" />
            </div>
            <div className="lp-card-shine" />
          </div>
        </div>

        {/* Notificaciones flotantes */}
        <div className="lp-float lp-float-a" aria-hidden="true">
          <span className="lp-float-dot">
            <Icon name="star" />
          </span>
          <div>
            <b>Nueva reseña</b>
            <small>Hace un instante</small>
          </div>
        </div>
        <div className="lp-float lp-float-b" aria-hidden="true">
          <span className="lp-float-dot">
            <Icon name="link" />
          </span>
          <div>
            <b>Link actualizado</b>
            <small>Sin reimprimir</small>
          </div>
        </div>
      </m.div>
    </div>
  )
}
