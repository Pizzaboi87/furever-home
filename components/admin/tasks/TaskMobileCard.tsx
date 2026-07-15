import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { DashboardRecord } from '@/lib/admin/domain'
import {
  formatDateTimeParts,
  formatTaskLabel,
  getBucketClassName,
  getPriorityClassName,
  getTaskOwnerLabel,
  normalizeTaskValue,
  stringValue,
  taskKeyValue,
} from '@/utils/admin/tasks/task-utils'

export default function TaskMobileCard({ task, index }: { task: DashboardRecord; index: number }) {
  const dueDateTime = formatDateTimeParts(task.nextFollowUpAt)
  const bucket = normalizeTaskValue(task.bucket) || 'upcoming'
  const cardKey = taskKeyValue(task.id, `task-mobile-${index}`)

  return (
    <article
      key={cardKey}
      className={`rounded-xl border border-border bg-white p-4 shadow-sm ${bucket === 'overdue' ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="wrap-break-word font-bold leading-5 text-foreground">
            {stringValue(task.subject) || 'Untitled case'}
          </p>
          {task.nextFollowUpNote ? (
            <p className="mt-1 line-clamp-2 wrap-break-word text-xs leading-5 text-muted-foreground">
              {stringValue(task.nextFollowUpNote)}
            </p>
          ) : null}
          <p className="mt-2 wrap-break-word text-xs font-semibold text-primary">
            {stringValue(task.caseId) || 'No case ID'}
          </p>
        </div>

        <Link
          href={`/admin/cases/${task.caseId}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
          <p className="mt-1 wrap-break-word font-semibold text-foreground">
            {stringValue(task.applicantName) || 'Unknown contact'}
          </p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Related pet</p>
          <p className="mt-1 wrap-break-word font-semibold text-foreground">
            {task.petName ? stringValue(task.petName) : 'No related pet'}
          </p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
          <p className="mt-1 text-muted-foreground">{getTaskOwnerLabel(task)}</p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Due</p>
          <p className="mt-1 text-muted-foreground">
            {dueDateTime.time ? `${dueDateTime.date} ${dueDateTime.time}` : dueDateTime.date}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getBucketClassName(bucket)}`}>
          {formatTaskLabel(bucket)}
        </span>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
          {formatTaskLabel(task.type)}
        </span>

        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClassName(task.priority)}`}>
          {formatTaskLabel(task.priority ?? 'medium')}
        </span>
      </div>
    </article>
  )
}
