import { AFTER_STEPS, BEFORE_STEPS } from './content'
import { Icon } from './icons'
import { Reveal } from './Reveal'

export function Problem() {
  return (
    <section className="lp-section" aria-labelledby="problema-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">El problema</span>
          <h2 id="problema-title" className="lp-h2">
            Pedir una reseña no debería ser <em>tan incómodo</em>.
          </h2>
          <p className="lp-sub">
            Cada paso que le pedís a un cliente es una oportunidad de que se vaya sin dejarla. Acortamos el camino a uno.
          </p>
        </Reveal>

        <div className="lp-versus">
          <Reveal className="lp-vs lp-vs-before">
            <div className="lp-vs-tag">Sin TAPS MZA</div>
            <ol>
              {BEFORE_STEPS.map((s) => (
                <li key={s}>
                  <span className="lp-vs-mark">
                    <Icon name="x" />
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="lp-vs lp-vs-after" delay={0.12}>
            <div className="lp-vs-tag">Con TAPS MZA</div>
            <ol>
              {AFTER_STEPS.map((s) => (
                <li key={s}>
                  <span className="lp-vs-mark">
                    <Icon name="check" />
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="lp-vs-big">
              <Icon name="nfc" />
              <span>Un toque.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
