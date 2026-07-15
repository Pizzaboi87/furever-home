import type { AdminDashboardDataset } from './domain'
import { getAdminCasesFromPrisma } from './case-service'
import { getPrismaAdminPets } from './pet-service'
import { buildDashboardDataset } from './dashboard/dashboard-builder'
import { buildFollowUpRecords } from './dashboard/dashboard-followups'
import {
  getDashboardAnalyticsFromPrisma,
  getLiveDashboardRecordsFromPrisma,
} from './dashboard/dashboard-repository'

export const getDashboardDataset = async (): Promise<AdminDashboardDataset> => {
  const [pets, cases, analytics, live] = await Promise.all([
    getPrismaAdminPets(),
    getAdminCasesFromPrisma(),
    getDashboardAnalyticsFromPrisma(),
    getLiveDashboardRecordsFromPrisma(),
  ])

  return buildDashboardDataset({ pets, cases, analytics, live })
}

export const getDashboardFollowUps = async () => {
  const [pets, cases] = await Promise.all([
    getPrismaAdminPets(),
    getAdminCasesFromPrisma(),
  ])

  return buildFollowUpRecords(
    cases,
    new Map(pets.map((pet) => [pet.id, pet])),
  )
}
