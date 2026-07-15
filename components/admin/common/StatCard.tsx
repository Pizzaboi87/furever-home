import type { LucideIcon } from 'lucide-react'

type StatCardVariant = 'default' | 'compact'

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  variant?: StatCardVariant
}

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => {
  return classNames.filter(Boolean).join(' ')
}

const StatCard = ({ label, value, icon: Icon, variant = 'default' }: StatCardProps) => {
  const isCompact = variant === 'compact'

  return (
    <div
      className={joinClassNames(
        'border border-border bg-white shadow-sm',
        isCompact ? 'rounded-xl p-4' : 'rounded-2xl p-5',
      )}
    >
      <div className={isCompact ? 'flex items-start justify-between gap-3' : 'flex items-center justify-between gap-4'}>
        <div>
          <p className={isCompact ? 'text-2xl font-bold text-foreground' : 'text-sm font-semibold text-muted-foreground'}>
            {isCompact ? value : label}
          </p>
          <p className={isCompact ? 'mt-1 text-sm text-muted-foreground' : 'mt-1 text-3xl font-bold text-foreground'}>
            {isCompact ? label : value}
          </p>
        </div>

        <span
          className={joinClassNames(
            'flex shrink-0 items-center justify-center bg-indigo-50 text-primary',
            isCompact ? 'h-9 w-9 rounded-lg' : 'h-11 w-11 rounded-xl',
          )}
        >
          <Icon className={isCompact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

export default StatCard
