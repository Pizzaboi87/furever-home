import Link from 'next/link'
import { ArrowRight, ClipboardList, PawPrint, UserRound } from 'lucide-react'

import type { DashboardRecord } from '@/lib/admin/domain'
import {
  formatDateTime,
  formatTaskLabel,
  getPriorityClassName,
  getTaskOwnerLabel,
  stringValue,
} from '@/utils/admin/tasks/task-utils'

export default function CompactTaskCard({ task }: { task: DashboardRecord }) {
  return (
    <Link
      href={`/admin/cases/${task.caseId}`}
      className="group block rounded-xl border border-border bg-white p-3 text-sm transition-all duration-300 ease-in-out hover:scale-[1.01] hover:border-primary hover:bg-indigo-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-1 font-bold text-foreground">
            {stringValue(task.subject) || 'Untitled case'}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary">
            {formatDateTime(task.nextFollowUpAt)}
          </p>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
      </div>

      <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
        <p className="flex min-w-0 items-center gap-2">
          <UserRound className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">{stringValue(task.applicantName) || 'Unknown contact'}</span>
        </p>

        {task.petName ? (
          <p className="flex min-w-0 items-center gap-2">
            <PawPrint className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{stringValue(task.petName)}</span>
          </p>
        ) : null}

        <p className="flex min-w-0 items-center gap-2">
          <ClipboardList className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">Owner: {getTaskOwnerLabel(task)}</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
          {formatTaskLabel(task.type)}
        </span>

        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClassName(task.priority)}`}>
          {formatTaskLabel(task.priority ?? 'medium')}
        </span>
      </div>
    </Link>
  )
}
