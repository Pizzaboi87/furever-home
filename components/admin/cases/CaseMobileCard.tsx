import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import {
  badgeBaseClassName,
  getCasePriorityBadgeClassName,
  getCaseStatusBadgeClassName,
} from '@/utils/admin/badge-styles'
import type { AdminPetCase } from '@/lib/admin/domain'
import { formatLabel, normalizeValue } from '@/lib/pet-format'
import {
  formatCaseDateTime,
  getFollowUpBadgeClassName,
  getFollowUpBucket,
  getFollowUpLabel,
} from '@/utils/admin/cases/case-utils'

type CaseMobileCardProps = {
  item: AdminPetCase
}

export default function CaseMobileCard({ item }: CaseMobileCardProps) {
  const followUpBucket = getFollowUpBucket(item.nextFollowUpAt)
  const isHighPriority = ['high', 'urgent'].includes(
    normalizeValue(item.priority ?? 'low'),
  )

  return (
    <article
      className={`rounded-xl border border-border bg-white p-4 shadow-sm ${
        followUpBucket === 'overdue' ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="wrap-break-word font-bold leading-5 text-foreground">
            {item.subject}
          </p>
          <p className="mt-1 line-clamp-2 wrap-break-word text-xs leading-5 text-muted-foreground">
            {item.summary || 'No case summary captured.'}
          </p>
          <p className="mt-2 wrap-break-word text-xs font-semibold text-primary">
            {item.id}
          </p>
        </div>

        <Link
          href={`/admin/cases/${item.id}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </p>
          {item.personId ? (
            <Link
              href={`/admin/people/${item.personId}`}
              className="mt-1 block wrap-break-word font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {item.applicantName || 'Unknown person'}
            </Link>
          ) : (
            <p className="mt-1 wrap-break-word font-semibold text-foreground">
              {item.applicantName || 'Unknown person'}
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">
            Owner
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {item.assignedStaff?.trim() || 'Unassigned'}
          </p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">
            Type
          </p>
          <p className="mt-1 text-muted-foreground">{formatLabel(item.type)}</p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">
            Follow-up
          </p>
          <p className="mt-1 text-muted-foreground">
            {formatCaseDateTime(item.nextFollowUpAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`${badgeBaseClassName} ${getCaseStatusBadgeClassName(item.status)}`}
        >
          {formatLabel(item.status)}
        </span>
        <span
          className={`${badgeBaseClassName} ${getCasePriorityBadgeClassName(item.priority)}`}
        >
          {formatLabel(item.priority ?? 'low')}
        </span>
        <span
          className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-bold ${getFollowUpBadgeClassName(followUpBucket)}`}
        >
          {getFollowUpLabel(followUpBucket)}
        </span>
        {isHighPriority ? (
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
            High priority
          </span>
        ) : null}
      </div>

      {item.nextFollowUpNote ? (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {item.nextFollowUpNote}
        </p>
      ) : null}
    </article>
  )
}
