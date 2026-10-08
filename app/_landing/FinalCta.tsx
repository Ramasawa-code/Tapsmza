import { Reveal } from './Reveal'
import { WhatsAppButton } from './WhatsAppButton'

export function FinalCta() {
  return (
    <section className="lp-section lp-final" aria-labelledby="cta-title">
      <div className="lp-container">
        <Reveal className="lp-final-card">
          <div className="lp-final-glow" aria-hidden="true" />
          <h2 id="cta-title" className="lp-h2">
            Que tu próxima reseña sea cuestión de <em>un toque</em>.
          </h2>
          <p className="lp-sub">Escribinos por WhatsApp y te asesoramos para tu negocio. Precios y plazos según tu caso.</p>
          <WhatsAppButton message="Hola! Quiero consultar precios de las tarjetas NFC/QR de TAPS MZA.">
            Consultá precios por WhatsApp
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  )
}
