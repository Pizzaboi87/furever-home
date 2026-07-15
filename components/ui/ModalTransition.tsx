'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ModalTransitionProps = {
  isOpen: boolean
  children: ReactNode
  overlayClassName: string
  panelClassName: string
}

const OVERLAY_TRANSITION = { duration: 0.18, ease: 'easeOut' as const }
const PANEL_TRANSITION = { duration: 0.24, ease: 'easeOut' as const }

export default function ModalTransition({
  isOpen,
  children,
  overlayClassName,
  panelClassName,
}: ModalTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          className={overlayClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={OVERLAY_TRANSITION}
        >
          <motion.div
            className={panelClassName}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={PANEL_TRANSITION}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
