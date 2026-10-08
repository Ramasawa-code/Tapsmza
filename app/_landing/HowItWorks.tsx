import { STEPS } from './content'
import { Reveal } from './Reveal'

export function HowItWorks() {
  return (
    <section className="lp-section" id="como-funciona" aria-labelledby="como-title">
      <div className="lp-container">
        <Reveal className="lp-head">
          <span className="lp-eyebrow">Cómo funciona</span>
          <h2 id="como-title" className="lp-h2">
            De la tarjeta a la reseña en <em>tres pasos</em>.
          </h2>
        </Reveal>

        <ol className="lp-steps">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <Reveal className="lp-step" delay={i * 0.1}>
                <span className="lp-step-n mono">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
