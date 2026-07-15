import Link from 'next/link'
import { ArrowRight, CalendarClock, UserRound } from 'lucide-react'

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

type CaseDesktopTableProps = {
  cases: AdminPetCase[]
}

export default function CaseDesktopTable({ cases }: CaseDesktopTableProps) {
  return (
    <table className="hidden w-full table-fixed text-left text-sm lg:table">
      <colgroup>
        <col className="w-[26%]" />
        <col className="w-[14%]" />
        <col className="w-[11%]" />
        <col className="w-[12%]" />
        <col className="w-[17%]" />
        <col className="w-[10%]" />
        <col className="w-[10%]" />
      </colgroup>

      <thead className="sticky top-0 z-10 bg-input text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th className="px-5 py-3">Case</th>
          <th className="px-5 py-3">Contact</th>
          <th className="px-5 py-3">Type</th>
          <th className="whitespace-nowrap px-5 py-3">Status</th>
          <th className="whitespace-nowrap px-5 py-3">Follow-up</th>
          <th className="whitespace-nowrap px-5 py-3">Priority</th>
          <th className="whitespace-nowrap px-5 py-3">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border">
        {cases.map((item) => {
          const followUpBucket = getFollowUpBucket(item.nextFollowUpAt)
          const normalizedPriority = normalizeValue(item.priority ?? 'low')

          return (
            <tr
              key={item.id}
              className={`bg-white transition-colors hover:bg-indigo-50/60 ${
                followUpBucket === 'overdue'
                  ? 'shadow-[inset_4px_0_0_#ef4444]'
                  : ''
              }`}
            >
              <td className="px-5 py-4 align-middle">
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

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(normalizedPriority === 'high' ||
                      normalizedPriority === 'urgent') && (
                      <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">
                        High priority
                      </span>
                    )}

                    {!item.assignedStaff?.trim() && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                        Unassigned
                      </span>
                    )}

                    {followUpBucket === 'overdue' && (
                      <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">
                        Overdue
                      </span>
                    )}

                    {followUpBucket === 'today' && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                        Due today
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 align-middle">
                <div className="flex min-w-0 items-center gap-2 text-foreground">
                  <UserRound
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  {item.personId ? (
                    <Link
                      href={`/admin/people/${item.personId}`}
                      className="min-w-0 wrap-break-word font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                      {item.applicantName || 'Unknown person'}
                    </Link>
                  ) : (
                    <span className="min-w-0 wrap-break-word font-semibold">
                      {item.applicantName || 'Unknown person'}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Owner:{' '}
                  <span className="font-semibold text-foreground">
                    {item.assignedStaff?.trim() || 'Unassigned'}
                  </span>
                </p>
              </td>

              <td className="px-5 py-4 align-middle text-muted-foreground">
                <span className="block wrap-break-word">
                  {formatLabel(item.type)}
                </span>
              </td>

              <td className="px-5 py-4 align-middle">
                <span
                  className={`${badgeBaseClassName} ${getCaseStatusBadgeClassName(item.status)}`}
                >
                  {formatLabel(item.status)}
                </span>
              </td>

              <td className="px-5 py-4 align-middle">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <CalendarClock
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{formatCaseDateTime(item.nextFollowUpAt)}</span>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-bold ${getFollowUpBadgeClassName(followUpBucket)}`}
                  >
                    {getFollowUpLabel(followUpBucket)}
                  </span>

                  {item.nextFollowUpNote ? (
                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {item.nextFollowUpNote}
                    </p>
                  ) : null}
                </div>
              </td>

              <td className="px-5 py-4 align-middle">
                <span
                  className={`${badgeBaseClassName} ${getCasePriorityBadgeClassName(item.priority)}`}
                >
                  {formatLabel(item.priority ?? 'low')}
                </span>
              </td>

              <td className="px-5 py-4 align-middle">
                <Link
                  href={`/admin/cases/${item.id}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          )
        })}

        {cases.length === 0 && (
          <tr>
            <td
              colSpan={7}
              className="px-5 py-10 text-center text-sm text-muted-foreground"
            >
              No cases match the selected filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
