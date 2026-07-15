import type { DashboardRecord } from '../domain'
import {
  getRecordDate,
  getRecordMonth,
  numberValue,
  stringValue,
} from './dashboard-utils'

const getDateKeys = (...recordGroups: DashboardRecord[][]) => {
  return [...new Set(recordGroups.flatMap((records) => records.map(getRecordDate)).filter(Boolean))].sort()
}

const getMonthKeys = (...recordGroups: DashboardRecord[][]) => {
  return [...new Set(recordGroups.flatMap((records) => records.map(getRecordMonth)).filter(Boolean))].sort()
}

const recordsForDate = (records: DashboardRecord[], date: string) => {
  return records.filter((record) => getRecordDate(record) === date)
}

const recordsForMonth = (records: DashboardRecord[], month: string) => {
  return records.filter((record) => getRecordMonth(record) === month)
}

const sumRecordValues = (records: DashboardRecord[], key: string) => {
  return records.reduce((sum, record) => sum + numberValue(record[key]), 0)
}

const buildSummaryRecord = ({
  key,
  keyName,
  intakes,
  adoptions,
  applications,
  donations,
  volunteerHours,
  activityEvents,
}: {
  key: string
  keyName: 'date' | 'month'
  intakes: DashboardRecord[]
  adoptions: DashboardRecord[]
  applications: DashboardRecord[]
  donations: DashboardRecord[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
}): DashboardRecord => {
  const donationAmount = sumRecordValues(donations, 'amount')
  const volunteerHourTotal = sumRecordValues(volunteerHours, 'hours')

  return {
    [keyName]: key,
    intakes: intakes.length,
    adoptions: adoptions.length,
    applications: applications.length,
    donations: donationAmount,
    donationAmount,
    volunteerHours: volunteerHourTotal,
    activityEvents: activityEvents.length,
  }
}

export const mergeSummaryRecords = (
  baseSummaries: DashboardRecord[],
  derivedSummaries: DashboardRecord[],
  keyName: 'date' | 'month',
) => {
  const merged = new Map<string, DashboardRecord>()

  for (const summary of baseSummaries) {
    const key = stringValue(summary[keyName])

    if (key) {
      merged.set(key, summary)
    }
  }

  for (const summary of derivedSummaries) {
    const key = stringValue(summary[keyName])

    if (!key) {
      continue
    }

    merged.set(key, {
      ...merged.get(key),
      ...summary,
    })
  }

  return [...merged.values()].sort((a, b) => stringValue(a[keyName]).localeCompare(stringValue(b[keyName])))
}

export const buildDailySummaries = ({
  baseSummaries,
  intakes,
  adoptions,
  applications,
  donations,
  volunteerHours,
  activityEvents,
}: {
  baseSummaries: DashboardRecord[]
  intakes: DashboardRecord[]
  adoptions: DashboardRecord[]
  applications: DashboardRecord[]
  donations: DashboardRecord[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
}) => {
  const dateKeys = getDateKeys(intakes, adoptions, applications, donations, volunteerHours, activityEvents)
  const derivedSummaries = dateKeys.map((date) =>
    buildSummaryRecord({
      key: date,
      keyName: 'date',
      intakes: recordsForDate(intakes, date),
      adoptions: recordsForDate(adoptions, date),
      applications: recordsForDate(applications, date),
      donations: recordsForDate(donations, date),
      volunteerHours: recordsForDate(volunteerHours, date),
      activityEvents: recordsForDate(activityEvents, date),
    }),
  )

  return mergeSummaryRecords(baseSummaries, derivedSummaries, 'date')
}

export const buildMonthlySummaries = ({
  baseSummaries,
  intakes,
  adoptions,
  applications,
  donations,
  volunteerHours,
  activityEvents,
}: {
  baseSummaries: DashboardRecord[]
  intakes: DashboardRecord[]
  adoptions: DashboardRecord[]
  applications: DashboardRecord[]
  donations: DashboardRecord[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
}) => {
  const monthKeys = getMonthKeys(intakes, adoptions, applications, donations, volunteerHours, activityEvents)
  const derivedSummaries = monthKeys.map((month) =>
    buildSummaryRecord({
      key: month,
      keyName: 'month',
      intakes: recordsForMonth(intakes, month),
      adoptions: recordsForMonth(adoptions, month),
      applications: recordsForMonth(applications, month),
      donations: recordsForMonth(donations, month),
      volunteerHours: recordsForMonth(volunteerHours, month),
      activityEvents: recordsForMonth(activityEvents, month),
    }),
  )

  return mergeSummaryRecords(baseSummaries, derivedSummaries, 'month')
}
