import { NFC_POINTS, QR_POINTS } from './content'
import { Icon } from './icons'
import { Reveal } from './Reveal'

function Points({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((p) => (
        <li key={p}>
          <Icon name="check" />
          {p}
        </li>
      ))}
    </ul>
  )
}

export function Compare() {
  return (
    <section className="lp-section" aria-labelledby="nfcqr-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">Doble tecnología</span>
          <h2 id="nfcqr-title" className="lp-h2">
            NFC y QR, <em>juntos</em>.
          </h2>
          <p className="lp-sub">Cada tarjeta trae las dos formas de acceder, para que nadie se quede afuera.</p>
        </Reveal>

        <div className="lp-compare">
          <Reveal className="lp-comp">
            <span className="lp-tile-icon">
              <Icon name="nfc" />
            </span>
            <h3>NFC</h3>
            <p className="lp-comp-sub">Acercar y listo</p>
            <Points items={NFC_POINTS} />
          </Reveal>

          <div className="lp-comp-plus" aria-hidden="true">
            <Icon name="plus" />
          </div>

          <Reveal className="lp-comp" delay={0.1}>
            <span className="lp-tile-icon">
              <Icon name="qr" />
            </span>
            <h3>Código QR</h3>
            <p className="lp-comp-sub">Escanear y listo</p>
            <Points items={QR_POINTS} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
