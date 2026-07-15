import type { AdminPetCase, DashboardRecord } from '../domain'
import type { LiveDashboardRecords } from './dashboard-types'

export const stringValue = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

export const numberValue = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

const getIdRecordKey = (record: DashboardRecord) => {
  return stringValue(record.id) || stringValue(record.caseId)
}

export const getCaseScopedRecordKey = (record: DashboardRecord) => {
  return stringValue(record.caseId) || stringValue(record.id)
}

export const mergeDashboardRecords = (
  baseRecords: DashboardRecord[],
  extraRecords: DashboardRecord[],
  getRecordKey: (record: DashboardRecord) => string = getIdRecordKey,
) => {
  const merged = new Map<string, DashboardRecord>()

  for (const record of baseRecords) {
    const key = getRecordKey(record)

    if (key) {
      merged.set(key, record)
      continue
    }

    merged.set(`base-${merged.size}`, record)
  }

  for (const record of extraRecords) {
    const key = getRecordKey(record)

    if (key) {
      merged.set(key, record)
      continue
    }

    merged.set(`extra-${merged.size}`, record)
  }

  return [...merged.values()]
}

export const getDatePart = (value: string | undefined | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getRecordDate = (record: DashboardRecord) => {
  return (
    getDatePart(stringValue(record.date)) ||
    getDatePart(stringValue(record.createdAt)) ||
    getDatePart(stringValue(record.updatedAt)) ||
    getDatePart(stringValue(record.loggedAt))
  )
}

const getMonthPart = (value: string | undefined) => {
  return value ? value.slice(0, 7) : ''
}

export const getCurrentMonthPart = () => {
  return new Date().toISOString().slice(0, 7)
}

export const getRecordMonth = (record: DashboardRecord) => {
  return getMonthPart(stringValue(record.month)) || getMonthPart(getRecordDate(record))
}

export const getSortedUniqueMonths = (...recordGroups: DashboardRecord[][]) => {
  return [
    ...new Set([
      ...recordGroups.flatMap((records) => records.map(getRecordMonth).filter(Boolean)),
      getCurrentMonthPart(),
    ]),
  ].sort()
}

const getLocalDateKey = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getFollowUpBucket = (followUpAt: string | null | undefined) => {
  const followUpDate = getDatePart(followUpAt)

  if (!followUpDate) {
    return 'none'
  }

  const today = getLocalDateKey(new Date())

  if (followUpDate < today) {
    return 'overdue'
  }

  if (followUpDate === today) {
    return 'today'
  }

  return 'upcoming'
}

export const getCasePetId = (shelterCase: AdminPetCase) => {
  return shelterCase.relatedPetId ?? shelterCase.petId ?? null
}

export const sortByCreatedAtDesc = (records: DashboardRecord[]) => {
  return [...records].sort((a, b) =>
    stringValue(b.createdAt).localeCompare(stringValue(a.createdAt)),
  )
}

export const emptyLiveDashboardRecords = (): LiveDashboardRecords => ({
  adoptionApplications: [],
  donationInquiries: [],
  virtualAdoptions: [],
  volunteerHours: [],
  activityEvents: [],
  petStatusEvents: [],
})
