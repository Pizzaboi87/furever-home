'use client'

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import ModalTransition from '@/components/ui/ModalTransition'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

type ModalShellSize = 'sm' | 'md' | 'lg'

type ModalShellProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  closeLabel: string
  children: ReactNode
  size?: ModalShellSize
}

const sizeClassNames: Record<ModalShellSize, string> = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

const ModalShell = ({
  isOpen,
  onClose,
  title,
  description,
  closeLabel,
  children,
  size = 'sm',
}: ModalShellProps) => {
  useBodyScrollLock(isOpen)

  return (
    <ModalTransition
      isOpen={isOpen}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[5px]"
      panelClassName={`max-h-[calc(100vh-2rem)] w-full ${sizeClassNames[size]} overflow-y-auto rounded-lg bg-white p-5 shadow-xl md:p-6`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-input hover:text-foreground"
          aria-label={closeLabel}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {children}
    </ModalTransition>
  )
}

export default ModalShell
