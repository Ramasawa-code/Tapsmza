import { TRUST } from './content'
import { Icon } from './icons'

export function TrustStrip() {
  return (
    <section className="lp-trust" aria-label="Puntos clave">
      <div className="lp-container">
        <ul className="lp-trust-grid">
          {TRUST.map((t) => (
            <li key={t.title}>
              <span className="lp-trust-icon">
                <Icon name={t.icon} />
              </span>
              <div>
                <b>{t.title}</b>
                <span>{t.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
