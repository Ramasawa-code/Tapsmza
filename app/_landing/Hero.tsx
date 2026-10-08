import { Icon } from './icons'
import { CardPhoneMockup } from './CardPhoneMockup'
import { WhatsAppButton } from './WhatsAppButton'

export function Hero() {
  return (
    <section className="lp-hero" id="top">
      <div className="lp-container lp-hero-grid">
        <div className="lp-hero-copy">
          <span className="pill lp-hero-pill">
            <span className="dot dot-live" />
            Tarjetas inteligentes NFC + QR
          </span>

          <h1 className="lp-h1">
            Un toque y tu negocio suma <em>reseñas</em>.
          </h1>

          <p className="lp-lead">
            Tarjetas NFC con QR que llevan a tus clientes directo a tu Google Maps, tus redes o cualquier link.
            Sin apps. Sin pasos de más.
          </p>

          <div className="lp-hero-ctas">
            <WhatsAppButton message="Hola! Quiero consultar precios de las tarjetas NFC/QR de TAPS MZA.">
              Consultá precios
            </WhatsAppButton>
            <a href="#como-funciona" className="btn btn-secondary btn-lg">
              Ver cómo funciona
              <Icon name="arrow" className="lp-btn-arrow" />
            </a>
          </div>

          <ul className="lp-hero-points">
            <li>
              <Icon name="check" /> Sin apps
            </li>
            <li>
              <Icon name="check" /> Sin contacto
            </li>
            <li>
              <Icon name="check" /> Link editable
            </li>
          </ul>
        </div>

        <div className="lp-hero-visual">
          <CardPhoneMockup />
        </div>
      </div>
    </section>
  )
}
