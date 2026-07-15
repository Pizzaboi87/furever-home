import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-input px-5 py-8 text-center ${className}`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-65 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}
