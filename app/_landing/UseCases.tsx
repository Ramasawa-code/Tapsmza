import { USE_CASES } from './content'
import { Icon } from './icons'
import { Reveal } from './Reveal'
import { SpotlightGrid } from './SpotlightGrid'

export function UseCases() {
  return (
    <section className="lp-section" aria-labelledby="rubros-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">Para quién</span>
          <h2 id="rubros-title" className="lp-h2">
            Si tenés clientes, <em>te sirve</em>.
          </h2>
        </Reveal>

        <SpotlightGrid className="lp-cases">
          {USE_CASES.map((c, i) => (
            <Reveal key={c.title} className="lp-case lp-spot" delay={(i % 3) * 0.07}>
              <span className="lp-tile-icon">
                <Icon name={c.icon} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  )
}
