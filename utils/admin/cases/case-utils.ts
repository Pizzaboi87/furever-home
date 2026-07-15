import type { AdminPetCase } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

export type FollowUpBucket = 'overdue' | 'today' | 'upcoming' | 'none'
export type CaseSortMode = 'follow_up' | 'latest_activity' | 'priority' | 'created_at'

export const followUpFilterOptions: {
  value: 'all' | FollowUpBucket
  label: string
}[] = [
  { value: 'all', label: 'All follow-ups' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'none', label: 'No follow-up' },
]

export const caseSortOptions: { value: CaseSortMode; label: string }[] = [
  { value: 'follow_up', label: 'Follow-up urgency' },
  { value: 'latest_activity', label: 'Latest activity' },
  { value: 'priority', label: 'Priority' },
  { value: 'created_at', label: 'Created date' },
]

const getValidDate = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

const getStartOfDay = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

export const getFollowUpBucket = (
  value: string | null | undefined,
  referenceDate = new Date(),
): FollowUpBucket => {
  const followUpDate = getValidDate(value)

  if (!followUpDate) {
    return 'none'
  }

  const followUpDay = getStartOfDay(followUpDate).getTime()
  const today = getStartOfDay(referenceDate).getTime()

  if (followUpDay < today) {
    return 'overdue'
  }

  if (followUpDay === today) {
    return 'today'
  }

  return 'upcoming'
}

const getFollowUpSortValue = (bucket: FollowUpBucket) => {
  if (bucket === 'overdue') {
    return 0
  }

  if (bucket === 'today') {
    return 1
  }

  if (bucket === 'upcoming') {
    return 2
  }

  return 3
}

const getPrioritySortValue = (priority: string | null | undefined) => {
  const normalizedPriority = normalizeValue(priority ?? 'low')

  if (normalizedPriority === 'high' || normalizedPriority === 'urgent') {
    return 0
  }

  if (normalizedPriority === 'medium') {
    return 1
  }

  return 2
}

export const formatCaseDateTime = (value: string | null | undefined) => {
  const date = getValidDate(value)

  if (!date) {
    return 'Not scheduled'
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const getFollowUpLabel = (bucket: FollowUpBucket) => {
  if (bucket === 'overdue') {
    return 'Overdue'
  }

  if (bucket === 'today') {
    return 'Due today'
  }

  if (bucket === 'upcoming') {
    return 'Upcoming'
  }

  return 'No follow-up'
}

export const getFollowUpBadgeClassName = (bucket: FollowUpBucket) => {
  if (bucket === 'overdue') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (bucket === 'today') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  if (bucket === 'upcoming') {
    return 'border-indigo-100 bg-indigo-50 text-primary'
  }

  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export const getCaseSearchableText = (item: AdminPetCase) => {
  return [
    item.id,
    item.subject,
    item.summary,
    item.type,
    item.status,
    item.applicantName,
    item.source,
    item.channel,
    item.priority,
    item.assignedStaff,
    item.nextFollowUpNote,
  ]
    .map((value) => normalizeValue(value))
    .filter(Boolean)
    .join(' ')
}

export const sortCases = (cases: AdminPetCase[], sortMode: CaseSortMode) => {
  return [...cases].sort((a, b) => {
    if (sortMode === 'latest_activity') {
      return b.lastActivityAt.localeCompare(a.lastActivityAt)
    }

    if (sortMode === 'priority') {
      const priorityDifference =
        getPrioritySortValue(a.priority) - getPrioritySortValue(b.priority)

      if (priorityDifference !== 0) {
        return priorityDifference
      }

      return b.lastActivityAt.localeCompare(a.lastActivityAt)
    }

    if (sortMode === 'created_at') {
      return b.createdAt.localeCompare(a.createdAt)
    }

    const firstBucket = getFollowUpBucket(a.nextFollowUpAt)
    const secondBucket = getFollowUpBucket(b.nextFollowUpAt)
    const bucketDifference =
      getFollowUpSortValue(firstBucket) - getFollowUpSortValue(secondBucket)

    if (bucketDifference !== 0) {
      return bucketDifference
    }

    const firstDate =
      getValidDate(a.nextFollowUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const secondDate =
      getValidDate(b.nextFollowUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER

    if (firstDate !== secondDate) {
      return firstDate - secondDate
    }

    return b.lastActivityAt.localeCompare(a.lastActivityAt)
  })
}
