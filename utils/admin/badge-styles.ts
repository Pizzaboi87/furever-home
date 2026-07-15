import type { CasePriority, CaseStatus, PetStatus } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

export const getCaseStatusBadgeClassName = (
  status: CaseStatus | string | undefined | null,
) => {
  const normalizedStatus = normalizeValue(status)

  if (['approved', 'completed', 'closed'].includes(normalizedStatus)) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (['declined', 'rejected', 'cancelled', 'no_response'].includes(normalizedStatus)) {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (
    [
      'waiting_on_contact',
      'waiting_on_staff',
      'waiting_reply',
      'in_review',
      'screening',
      'scheduled',
    ].includes(normalizedStatus)
  ) {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-indigo-100 bg-indigo-50 text-primary'
}

export const getCasePriorityBadgeClassName = (
  priority: CasePriority | string | undefined | null,
) => {
  const normalizedPriority = normalizeValue(priority)

  if (normalizedPriority === 'high') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (normalizedPriority === 'medium') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export const getPetStatusBadgeClassName = (
  status: PetStatus | string | undefined | null,
) => {
  const normalizedStatus = normalizeValue(status)

  if (normalizedStatus === 'available') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (normalizedStatus === 'reserved') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  if (normalizedStatus === 'adopted') {
    return 'border-slate-200 bg-slate-50 text-slate-600'
  }

  if (normalizedStatus === 'new') {
    return 'border-indigo-100 bg-indigo-50 text-primary'
  }

  return 'border-border bg-white text-muted-foreground'
}

export const badgeBaseClassName =
  'inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold'
