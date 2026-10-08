import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Svg({ children, ...p }: P) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  )
}

export const ICONS = {
  star: (p: P) => (
    <Svg {...p}>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
    </Svg>
  ),
  nfc: (p: P) => (
    <Svg {...p}>
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
      <circle cx="5.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </Svg>
  ),
  qr: (p: P) => (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <path d="M14.5 14.5h2.5v2.5h-2.5zM20.5 14.5v0M17 20.5h3.5M20.5 17v0" />
    </Svg>
  ),
  link: (p: P) => (
    <Svg {...p}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
    </Svg>
  ),
  phone: (p: P) => (
    <Svg {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </Svg>
  ),
  pin: (p: P) => (
    <Svg {...p}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </Svg>
  ),
  chart: (p: P) => (
    <Svg {...p}>
      <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
    </Svg>
  ),
  spark: (p: P) => (
    <Svg {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </Svg>
  ),
  layers: (p: P) => (
    <Svg {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </Svg>
  ),
  globe: (p: P) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.7 2.6 3.8 5.6 3.8 9S14.7 18.4 12 21c-2.7-2.6-3.8-5.6-3.8-9S9.3 5.6 12 3Z" />
    </Svg>
  ),
  chat: (p: P) => (
    <Svg {...p}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
    </Svg>
  ),
  menu: (p: P) => (
    <Svg {...p}>
      <path d="M5 4h14v16H5zM8.5 9h7M8.5 13h7M8.5 17h4" />
    </Svg>
  ),
  instagram: (p: P) => (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  ),
  utensils: (p: P) => (
    <Svg {...p}>
      <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M7 3v7M17 21V3c-2.5 1.5-3.5 4.5-3.5 8H17" />
    </Svg>
  ),
  scissors: (p: P) => (
    <Svg {...p}>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="m8 8 12 9M8 16 20 7" />
    </Svg>
  ),
  bed: (p: P) => (
    <Svg {...p}>
      <path d="M3 18V6M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5" />
      <circle cx="7" cy="11" r="1.5" />
    </Svg>
  ),
  heart: (p: P) => (
    <Svg {...p}>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
    </Svg>
  ),
  store: (p: P) => (
    <Svg {...p}>
      <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20" />
    </Svg>
  ),
  wrench: (p: P) => (
    <Svg {...p}>
      <path d="M14.5 6.5a4 4 0 0 0 4.8 4.8L9.5 21.1a2.1 2.1 0 0 1-3-3L16.3 8.3A4 4 0 0 0 14.5 6.5Z" />
    </Svg>
  ),
  check: (p: P) => (
    <Svg {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  ),
  x: (p: P) => (
    <Svg {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  ),
  plus: (p: P) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  arrow: (p: P) => (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  burger: (p: P) => (
    <Svg {...p}>
      <path d="M4 8h16M4 16h16" />
    </Svg>
  ),
} as const

export type IconName = keyof typeof ICONS

export function Icon({ name, ...p }: { name: IconName } & P) {
  const C = ICONS[name]
  return <C {...p} />
}

export function WhatsAppIcon(p: P) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.88.9-3-.2-.31a8.2 8.2 0 1 1 6.88 3.76Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.28.18-.53.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.85.83-.85 2.03s.87 2.36 1 2.52c.12.16 1.7 2.6 4.12 3.65 1.53.66 2.13.72 2.9.6.47-.07 1.46-.6 1.66-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}
