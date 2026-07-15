import type { PrismaClient } from '@prisma/client'
import { toPrismaJsonObject } from './seed-file-utils'
import type {
  AdminDashboardFile,
  DashboardCollectionName,
  RawDashboardRecord,
} from './seed-types'

const DASHBOARD_COLLECTIONS: DashboardCollectionName[] = [
  'animalIntakes',
  'adoptions',
  'applications',
  'donations',
  'volunteerHours',
  'activityEvents',
  'dailySummaries',
  'monthlySummaries',
  'speciesMonthlySummaries',
  'petStatusEvents',
  'monthlyPetSnapshots',
]

const getDashboardRecordDate = (record: RawDashboardRecord) => {
  const value =
    record.date ??
    record.createdAt ??
    record.updatedAt ??
    record.loggedAt ??
    record.completedAt ??
    record.monthEndDate

  return typeof value === 'string' ? value.slice(0, 10) : null
}

const getDashboardRecordMonth = (record: RawDashboardRecord) => {
  if (typeof record.month === 'string') {
    return record.month.slice(0, 7)
  }

  return getDashboardRecordDate(record)?.slice(0, 7) ?? null
}

const getDashboardRecordKey = (
  collection: DashboardCollectionName,
  record: RawDashboardRecord,
  index: number,
) => {
  if (typeof record.id === 'string' && record.id.trim()) {
    return record.id
  }

  if (collection === 'dailySummaries' && typeof record.date === 'string') {
    return record.date
  }

  if (collection === 'monthlySummaries' && typeof record.month === 'string') {
    return record.month
  }

  if (
    collection === 'speciesMonthlySummaries' &&
    typeof record.month === 'string' &&
    typeof record.type === 'string'
  ) {
    return `${record.month}-${record.type}`
  }

  if (
    collection === 'monthlyPetSnapshots' &&
    typeof record.month === 'string' &&
    typeof record.petId === 'string'
  ) {
    return `${record.month}-${record.petId}`
  }

  return `${collection}-${index + 1}`
}

export const seedDashboardAnalytics = async (
  prisma: PrismaClient,
  adminDashboardFile: AdminDashboardFile,
) => {
  await prisma.dashboardAnalyticsRecord.deleteMany({
    where: {
      collection: {
        in: DASHBOARD_COLLECTIONS,
      },
    },
  })

  for (const collection of DASHBOARD_COLLECTIONS) {
    const records = (adminDashboardFile[collection] ?? []) as RawDashboardRecord[]

    console.log(
      `Seeding dashboard analytics: ${collection} (${records.length})...`,
    )

    if (records.length === 0) {
      continue
    }

    for (let index = 0; index < records.length; index += 500) {
      const chunk = records.slice(index, index + 500)

      await prisma.dashboardAnalyticsRecord.createMany({
        data: chunk.map((record, chunkIndex) => {
          const recordIndex = index + chunkIndex
          const recordKey = getDashboardRecordKey(
            collection,
            record,
            recordIndex,
          )

          return {
            id: `${collection}:${recordKey}`,
            collection,
            recordKey,
            date: getDashboardRecordDate(record),
            month: getDashboardRecordMonth(record),
            data: toPrismaJsonObject(record),
          }
        }),
      })
    }
  }
}
