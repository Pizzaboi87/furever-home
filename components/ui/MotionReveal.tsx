'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState } from 'react'

const DesktopMotionReveal = dynamic(() => import('./DesktopMotionReveal'), {
  ssr: false,
})

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  viewportMargin?: string
  style?: CSSProperties
}

const DESKTOP_REVEAL_QUERY = '(min-width: 1536px) and (hover: hover) and (pointer: fine)'

const useDesktopRevealMotion = () => {
  const [shouldUseMotion, setShouldUseMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_REVEAL_QUERY)

    const updateMotionPreference = () => {
      setShouldUseMotion(mediaQuery.matches)
    }

    updateMotionPreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMotionPreference)

      return () => {
        mediaQuery.removeEventListener('change', updateMotionPreference)
      }
    }

    mediaQuery.addListener(updateMotionPreference)

    return () => {
      mediaQuery.removeListener(updateMotionPreference)
    }
  }, [])

  return shouldUseMotion
}

export default function MotionReveal({
  children,
  className,
  delay = 0,
  viewportMargin = '0px',
  style,
}: MotionRevealProps) {
  const pathname = usePathname()
  const shouldUseMotion = useDesktopRevealMotion()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute || !shouldUseMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <DesktopMotionReveal
      className={className}
      delay={delay}
      viewportMargin={viewportMargin}
      style={style}
    >
      {children}
    </DesktopMotionReveal>
  )
}
