'use client'

import { type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

import MotionReveal from '@/components/ui/MotionReveal'

type DangerZoneProps = {
  title: string
  description: ReactNode
  confirmationLabel: string
  confirmationValue: string
  onConfirmationChange: (value: string) => void
  confirmationPlaceholder: string
  action: ReactNode
  delay?: number
  error?: ReactNode
  className?: string
}

export default function DangerZone({
  title,
  description,
  confirmationLabel,
  confirmationValue,
  onConfirmationChange,
  confirmationPlaceholder,
  action,
  delay = 0.1,
  error,
  className,
}: DangerZoneProps) {
  const rootClassName = [
    'rounded-2xl border border-red-200 bg-white p-6 shadow-sm',
    className,
  ].filter(Boolean).join(' ')

  return (
    <MotionReveal className={rootClassName} delay={delay}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <div className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="text-sm font-semibold text-foreground">
          {confirmationLabel}
          <input
            type="text"
            value={confirmationValue}
            onChange={(event) => onConfirmationChange(event.target.value)}
            placeholder={confirmationPlaceholder}
            className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </label>

        <div className="self-end">{action}</div>
      </div>

      {error ? <div className="mt-3">{error}</div> : null}
    </MotionReveal>
  )
}
