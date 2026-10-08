'use client'

import { useRef } from 'react'

// Glow que sigue al cursor: setea --mx/--my en cada hijo `.lp-spot`.
export function SpotlightGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !ref.current) return
    ref.current.querySelectorAll<HTMLElement>('.lp-spot').forEach((el) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    })
  }

  return (
    <div ref={ref} className={className} onPointerMove={onMove}>
      {children}
    </div>
  )
}
