import type { Metadata } from 'next'
import './_landing/landing.css'
import { SITE_URL } from './_landing/content'
import { Benefits } from './_landing/Benefits'
import { Compare } from './_landing/Compare'
import { Demo } from './_landing/Demo'
import { Faq } from './_landing/Faq'
import { FinalCta } from './_landing/FinalCta'
import { Footer } from './_landing/Footer'
import { Hero } from './_landing/Hero'
import { HowItWorks } from './_landing/HowItWorks'
import { MotionProvider } from './_landing/MotionProvider'
import { Nav } from './_landing/Nav'
import { Problem } from './_landing/Problem'
import { TrustStrip } from './_landing/TrustStrip'
import { UseCases } from './_landing/UseCases'
import { WhatsAppFab } from './_landing/WhatsAppFab'

const TITLE = 'TAPS MZA — Tarjetas NFC y QR para conseguir más reseñas'
const DESCRIPTION =
  'Tarjetas inteligentes NFC y QR que llevan a tus clientes directo a tu reseña de Google Maps, tus redes o cualquier link. Sin apps, sin pasos de más.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: SITE_URL, siteName: 'TAPS MZA', title: TITLE, description: DESCRIPTION, locale: 'es_AR' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Home() {
  return (
    <MotionProvider>
      <div className="lp">
        <Nav />
        <main>
          <Hero />
          <TrustStrip />
          <Problem />
          <HowItWorks />
          <Benefits />
          <Demo />
          <UseCases />
          <Compare />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </MotionProvider>
  )
}
