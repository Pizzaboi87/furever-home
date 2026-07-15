'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

type DesktopMotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  viewportMargin?: string
  style?: CSSProperties
}

export default function DesktopMotionReveal({
  children,
  className,
  delay = 0,
  viewportMargin = '0px',
  style,
}: DesktopMotionRevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: viewportMargin }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
