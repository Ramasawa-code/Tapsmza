import { Icon } from './icons'
import { Reveal } from './Reveal'
import { SpotlightGrid } from './SpotlightGrid'

export function Benefits() {
  return (
    <section className="lp-section" id="beneficios" aria-labelledby="beneficios-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">Beneficios</span>
          <h2 id="beneficios-title" className="lp-h2">
            Todo lo que necesita tu negocio, <em>en una tarjeta</em>.
          </h2>
        </Reveal>

        <SpotlightGrid className="lp-bento">
          <Reveal className="lp-tile lp-spot lp-tile-wide">
            <div className="lp-tile-text">
              <span className="lp-tile-icon">
                <Icon name="star" />
              </span>
              <h3>Más reseñas, mejor presencia local</h3>
              <p>
                Cuanto más fácil es dejar una reseña, más reseñas recibís. Y las reseñas recientes ayudan a que te
                elijan cuando te buscan en Google Maps.
              </p>
            </div>
            <div className="lp-viz-bars" aria-hidden="true">
              {[38, 52, 46, 68, 62, 84, 96].map((h, i) => (
                <i key={i} style={{ ['--h' as string]: `${h}%`, ['--i' as string]: i }} />
              ))}
            </div>
          </Reveal>

          <Reveal className="lp-tile lp-spot" delay={0.06}>
            <span className="lp-tile-icon">
              <Icon name="nfc" />
            </span>
            <h3>NFC + QR en una sola tarjeta</h3>
            <p>Un toque para la mayoría, y el QR impreso como respaldo para cualquier celular.</p>
          </Reveal>

          <Reveal className="lp-tile lp-spot" delay={0.1}>
            <span className="lp-tile-icon">
              <Icon name="link" />
            </span>
            <h3>Link editable</h3>
            <p>Hoy reseñas, mañana una promo. Cambiás el destino y la tarjeta sigue igual.</p>
            <div className="lp-viz-url mono" aria-hidden="true">
              <span>tapsmza.site/0042</span>
              <Icon name="arrow" />
              <span className="lp-url-swap">
                <b>google.com/maps</b>
                <b>instagram.com/tunegocio</b>
                <b>tunegocio.com/promo</b>
              </span>
            </div>
          </Reveal>

          <Reveal className="lp-tile lp-spot" delay={0.06}>
            <span className="lp-tile-icon">
              <Icon name="chart" />
            </span>
            <h3>Sabé cuánto se usa</h3>
            <p>Contamos los toques y escaneos de cada tarjeta, para que midas qué funciona.</p>
          </Reveal>

          <Reveal className="lp-tile lp-spot" delay={0.06}>
            <span className="lp-tile-icon">
              <Icon name="layers" />
            </span>
            <h3>Diseño con tu marca</h3>
            <p>Una tarjeta que se ve profesional y suma a la imagen de tu negocio.</p>
          </Reveal>
          <Reveal className="lp-tile lp-spot lp-tile-wide" delay={0.1}>
            <div className="lp-tile-text">
              <span className="lp-tile-icon">
                <Icon name="globe" />
              </span>
              <h3>Un destino, el que quieras</h3>
              <p>
                Reseñas de Google, Instagram, tu web, WhatsApp, tu carta o catálogo: cualquier link que necesites que tus
                clientes abran en segundos.
              </p>
            </div>
            <div className="lp-viz-chips" aria-hidden="true">
              <span><Icon name="star" />Reseñas</span>
              <span><Icon name="instagram" />Instagram</span>
              <span><Icon name="chat" />WhatsApp</span>
              <span><Icon name="menu" />Carta</span>
              <span><Icon name="globe" />Web</span>
            </div>
          </Reveal>

        </SpotlightGrid>
      </div>
    </section>
  )
}
