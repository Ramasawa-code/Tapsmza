import { ImageResponse } from 'next/og'

export const alt = 'TAPS MZA — Tarjetas NFC y QR para conseguir más reseñas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          color: '#f4f5f6',
          backgroundColor: '#08090a',
          backgroundImage: 'radial-gradient(circle at 85% 0%, rgba(61,220,151,0.28), rgba(8,9,10,0) 60%)',
        }}
      >
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, letterSpacing: -2 }}>
          TAPS<span style={{ color: '#3ddc97', marginLeft: 12 }}>MZA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, display: 'flex', flexWrap: 'wrap' }}>
            Un toque y tu negocio suma&nbsp;<span style={{ color: '#3ddc97' }}>reseñas.</span>
          </div>
          <div style={{ fontSize: 32, color: '#9da2a9', display: 'flex' }}>
            Tarjetas inteligentes NFC + QR · tapsmza.site
          </div>
        </div>
      </div>
    ),
    size,
  )
}
