'use client'

import type { CSSProperties, ReactNode, Ref } from 'react'

import MotionReveal from '@/components/ui/MotionReveal'

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => {
  return classNames.filter(Boolean).join(' ')
}

type AdminListPanelProps = {
  title: string
  description: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  delay?: number
  style?: CSSProperties
  bodyRef?: Ref<HTMLDivElement>
  onBodyScroll?: () => void
}

export default function AdminListPanel({
  title,
  description,
  children,
  className,
  bodyClassName,
  delay,
  style,
  bodyRef,
  onBodyScroll,
}: AdminListPanelProps) {
  return (
    <MotionReveal
      className={joinClassNames(
        'overflow-hidden rounded-2xl border border-border bg-white shadow-sm',
        className,
      )}
      delay={delay}
      style={style}
    >
      <div className="border-b border-border p-5">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div ref={bodyRef} onScroll={onBodyScroll} className={bodyClassName}>
        {children}
      </div>
    </MotionReveal>
  )
}
