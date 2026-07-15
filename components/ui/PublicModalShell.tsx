'use client'

import Image from '@/components/ui/LoadingImage'
import type { ReactNode } from 'react'

import ModalSuccessState from '@/components/ui/ModalSuccessState'
import ModalTransition from '@/components/ui/ModalTransition'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

type PublicModalShellProps = {
  isOpen: boolean
  isSubmitted: boolean
  onClose: () => void
  title: string
  description: string
  closeLabel: string
  imageSrc: string
  imageAlt: string
  successTitle: string
  successMessage: string
  successIcon?: string
  children: ReactNode
}

const PublicModalShell = ({
  isOpen,
  isSubmitted,
  onClose,
  title,
  description,
  closeLabel,
  imageSrc,
  imageAlt,
  successTitle,
  successMessage,
  successIcon,
  children,
}: PublicModalShellProps) => {
  useBodyScrollLock(isOpen)

  const panelClassName = isSubmitted
    ? 'mx-auto w-full max-w-sm'
    : 'mx-auto w-full max-w-4xl rounded-lg bg-white p-4 shadow-xl sm:p-5 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto md:p-6'

  return (
    <ModalTransition
      isOpen={isOpen}
      overlayClassName="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-3 py-8 backdrop-blur-[5px] sm:p-4"
      panelClassName={panelClassName}
    >
      {isSubmitted ? (
        <ModalSuccessState icon={successIcon} title={successTitle} message={successMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] md:gap-6">
          <div className="relative min-h-48 overflow-hidden rounded-lg sm:min-h-64 md:min-h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 360px, 100vw"
              priority
            />
          </div>

          <div>
            <div className="mb-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={closeLabel}
                >
                  ✕
                </button>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">{description}</p>
            </div>

            {children}
          </div>
        </div>
      )}
    </ModalTransition>
  )
}

export default PublicModalShell
