import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://tapsmza.site'),
  title: 'TAPS MZA',
  description: 'Tarjetas NFC y códigos QR que llevan a tus clientes directo a tu reseña de Google.',
}

export const viewport: Viewport = {
  themeColor: '#08090a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
