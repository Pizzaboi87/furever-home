import type { LucideIcon } from 'lucide-react'
import { formatDisplayValue, type DetailListRow, type DetailRowValue } from '@/utils/admin/cases/case-detail-utils'

export function DetailList({ rows }: { rows: DetailListRow[] }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-4 py-3 text-sm"
        >
          <span className="text-muted-foreground">{row.label}</span>
          <span className="text-right font-semibold text-foreground">
            {formatDisplayValue(row.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DetailCard({
  label,
  value,
}: {
  label: string
  value: DetailRowValue
}) {
  return (
    <div className="rounded-xl border border-border bg-input p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {formatDisplayValue(value)}
      </p>
    </div>
  )
}

export function CaseDetailCardHeader({
  title,
  description,
  icon: Icon,
  badge,
}: {
  title: string
  description: string
  icon?: LucideIcon
  badge?: string | number
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {badge !== undefined ? (
        <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 px-3 text-sm font-bold text-primary">
          {badge}
        </span>
      ) : Icon ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  )
}
