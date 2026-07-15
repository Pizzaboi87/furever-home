import type { DashboardRecord } from '@/lib/admin/domain'
import { formatLabel, normalizeValue } from '@/lib/pet-format'

export const stringValue = (value: unknown) => {
  return String(value ?? '')
}

export const taskKeyValue = (value: unknown, fallback: string) => {
  return typeof value === 'string' || typeof value === 'number' ? value : fallback
}

export const normalizeTaskValue = (value: unknown) => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return normalizeValue(value)
  }

  return ''
}

export const formatTaskLabel = (value: unknown, fallback = 'Not captured') => {
  const normalizedValue = normalizeTaskValue(value)

  if (!normalizedValue) {
    return fallback
  }

  return formatLabel(normalizedValue)
}

const getTaskDateTime = (value: unknown) => {
  const rawValue = stringValue(value)

  if (!rawValue) {
    return null
  }

  const date = new Date(rawValue)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export const formatDateTime = (value: unknown) => {
  const date = getTaskDateTime(value)

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

export const formatDateTimeParts = (value: unknown) => {
  const date = getTaskDateTime(value)

  if (!date) {
    return {
      date: 'Not scheduled',
      time: '',
    }
  }

  return {
    date: `${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })},`,
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
  }
}

export const getBucketClassName = (bucket: unknown) => {
  const normalizedBucket = normalizeTaskValue(bucket)

  if (normalizedBucket === 'overdue') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (normalizedBucket === 'today') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-indigo-100 bg-indigo-50 text-primary'
}

export const getPriorityClassName = (priority: unknown) => {
  const normalizedPriority = normalizeTaskValue(priority)

  if (normalizedPriority === 'high') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (normalizedPriority === 'medium') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export const getTaskGroup = (tasks: DashboardRecord[], bucket: string) => {
  return tasks.filter((task) => normalizeTaskValue(task.bucket) === bucket)
}

export const getTaskOwnerLabel = (task: DashboardRecord) => {
  const assignedStaff = stringValue(task.assignedStaff).trim()

  return assignedStaff || 'Unassigned'
}

const getBucketSortValue = (bucket: unknown) => {
  const normalizedBucket = normalizeTaskValue(bucket)

  if (normalizedBucket === 'overdue') {
    return 0
  }

  if (normalizedBucket === 'today') {
    return 1
  }

  return 2
}

export const sortTasks = (tasks: DashboardRecord[]) => {
  return [...tasks].sort((a, b) => {
    const bucketDifference = getBucketSortValue(a.bucket) - getBucketSortValue(b.bucket)

    if (bucketDifference !== 0) {
      return bucketDifference
    }

    const firstDate = getTaskDateTime(a.nextFollowUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const secondDate = getTaskDateTime(b.nextFollowUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER

    if (firstDate !== secondDate) {
      return firstDate - secondDate
    }

    return stringValue(a.subject).localeCompare(stringValue(b.subject))
  })
}

export const getSearchableTaskText = (task: DashboardRecord) => {
  return [
    task.id,
    task.caseId,
    task.subject,
    task.applicantName,
    task.petName,
    task.type,
    task.scope,
    task.priority,
    task.bucket,
    task.status,
    task.assignedStaff,
    task.nextFollowUpNote,
  ]
    .map(normalizeTaskValue)
    .filter(Boolean)
    .join(' ')
}

export const getUniqueFilterValues = (tasks: DashboardRecord[], key: string) => {
  return [
    ...new Set(
      tasks
        .map((task) => normalizeTaskValue(task[key]))
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b))
}
