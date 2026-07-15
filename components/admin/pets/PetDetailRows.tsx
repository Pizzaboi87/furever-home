import Link from 'next/link'
import { Activity, ExternalLink, PawPrint, UserRound } from 'lucide-react'

import type { AdminPetActivityItem, AdminPetCase } from '@/lib/admin/domain'
import { badgeBaseClassName, getCaseStatusBadgeClassName } from '@/utils/admin/badge-styles'
import { formatLabel } from '@/lib/pet-format'
import {
  formatPetDetailDate,
  formatPetDetailDateTime,
} from '@/utils/admin/pets/pet-detail-utils'

export const PetDetailCaseRow = ({ item }: { item: AdminPetCase }) => {
  return (
    <div className="cursor-default rounded-xl border border-border bg-white p-4 transition-colors hover:bg-indigo-50/50">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`${badgeBaseClassName} border-indigo-100 bg-indigo-50 text-primary`}
        >
          {formatLabel(item.type)}
        </span>

        <span
          className={`${badgeBaseClassName} ${getCaseStatusBadgeClassName(item.status)}`}
        >
          {formatLabel(item.status)}
        </span>
      </div>

      <h3 className="text-sm font-bold text-foreground">{item.subject}</h3>

      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        {item.applicantName ?? 'Unknown person'}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{formatPetDetailDate(item.lastActivityAt)}</span>

        <Link
          href={`/admin/cases/${item.id}`}
          className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
        >
          View
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export const PetDetailActivityRow = ({
  item,
}: {
  item: AdminPetActivityItem
}) => {
  return (
    <div className="relative cursor-default pl-7">
      <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-primary ring-4 ring-white">
        {item.kind === 'status' ? (
          <PawPrint className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </span>

      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {item.title}
            </p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {item.detail}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-input px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {formatLabel(item.type)}
          </span>
        </div>

        <p className="mt-3 text-xs font-medium text-primary">
          {formatPetDetailDateTime(item.createdAt)}
        </p>
      </div>
    </div>
  )
}
