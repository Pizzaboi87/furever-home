import type { CaseStatus } from '@/lib/admin/domain'

export const activePetDetailCaseStatuses: CaseStatus[] = [
  'new',
  'open',
  'waiting_on_contact',
  'waiting_on_staff',
  'screening',
  'scheduled',
  'waiting_reply',
  'in_review',
]

export const formatPetDetailDateTime = (value: string | undefined | null) => {
  if (!value) {
    return 'No activity yet'
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const formatPetDetailDate = (value: string | undefined | null) => {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatPetDetailShortDate = (value: string | undefined | null) => {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value).toISOString().slice(2, 10)
}

export const formatPetDetailDateInputValue = (
  value: string | undefined | null,
) => {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 10)
}
