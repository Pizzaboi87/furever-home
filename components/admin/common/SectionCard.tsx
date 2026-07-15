import type { ReactNode } from 'react'

import MotionReveal from '@/components/ui/MotionReveal'

type SectionCardProps = {
  children: ReactNode
  className?: string
  delay?: number
  viewportMargin?: string
  padding?: 'sm' | 'md'
}

const paddingClassNames = {
  sm: 'p-5',
  md: 'p-6',
} satisfies Record<NonNullable<SectionCardProps['padding']>, string>

const mergeClassNames = (...classNames: Array<string | undefined>) => {
  return classNames.filter(Boolean).join(' ')
}

export default function SectionCard({
  children,
  className,
  delay,
  viewportMargin,
  padding = 'sm',
}: SectionCardProps) {
  return (
    <MotionReveal
      className={mergeClassNames(
        'rounded-2xl border border-border bg-white shadow-sm',
        paddingClassNames[padding],
        className,
      )}
      delay={delay}
      viewportMargin={viewportMargin}
    >
      {children}
    </MotionReveal>
  )
}
