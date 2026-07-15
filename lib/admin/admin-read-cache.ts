import { unstable_cache } from 'next/cache'

import { getAdminCaseByIdFromPrisma, getAdminCasesFromPrisma } from '@/lib/admin/case-service'
import { ADMIN_CACHE_TAGS } from '@/lib/admin/cache-tags'
import { buildDashboardDataset } from '@/lib/admin/dashboard/dashboard-builder'
import { buildFollowUpRecords } from '@/lib/admin/dashboard/dashboard-followups'
import type { DashboardAnalyticsDataset } from '@/lib/admin/dashboard/dashboard-types'
import {
  DASHBOARD_COLLECTIONS,
  getDashboardAnalyticsCollectionFromPrisma,
  getLiveDashboardRecordsFromPrisma,
} from '@/lib/admin/dashboard/dashboard-repository'
import {
  getAdminPeopleFromPrisma,
  getAdminPeopleOverviewFromPrisma,
  getAdminPersonDetailFromPrisma,
} from '@/lib/admin/person-service'
import {
  getAdminPetActivityFromPrisma,
  getAdminPetCasesFromPrisma,
  getPrismaAdminPetById,
  getPrismaAdminPets,
} from '@/lib/admin/pet-service'
import { getPrismaClient } from '@/lib/server/prisma'

const ADMIN_READ_CACHE_SECONDS = 300

export const getCachedAdminPets = unstable_cache(
  getPrismaAdminPets,
  ['admin-read', 'pets'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.pets],
  },
)

export const getCachedAdminPetById = unstable_cache(
  async (petId: string) => getPrismaAdminPetById(petId),
  ['admin-read', 'pet-detail'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.pets],
  },
)

export const getCachedAdminPetCases = unstable_cache(
  async (petId: string) => getAdminPetCasesFromPrisma(petId),
  ['admin-read', 'pet-cases'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.cases, ADMIN_CACHE_TAGS.pets],
  },
)

export const getCachedAdminPetActivity = unstable_cache(
  async (petId: string) => getAdminPetActivityFromPrisma(petId),
  ['admin-read', 'pet-activity'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.cases, ADMIN_CACHE_TAGS.pets],
  },
)

export const getCachedAdminCases = unstable_cache(
  getAdminCasesFromPrisma,
  ['admin-read', 'cases'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.cases],
  },
)

export const getCachedAdminCaseById = unstable_cache(
  async (caseId: string) => getAdminCaseByIdFromPrisma(caseId),
  ['admin-read', 'case-detail'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [
      ADMIN_CACHE_TAGS.cases,
      ADMIN_CACHE_TAGS.people,
      ADMIN_CACHE_TAGS.pets,
    ],
  },
)

export const getCachedAdminPeople = unstable_cache(
  getAdminPeopleFromPrisma,
  ['admin-read', 'people'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.people],
  },
)

export const getCachedAdminPeopleOverview = unstable_cache(
  getAdminPeopleOverviewFromPrisma,
  ['admin-read', 'people-overview'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.cases, ADMIN_CACHE_TAGS.people],
  },
)

export const getCachedAdminPersonDetail = unstable_cache(
  async (personId: string) => getAdminPersonDetailFromPrisma(personId),
  ['admin-read', 'person-detail'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [
      ADMIN_CACHE_TAGS.cases,
      ADMIN_CACHE_TAGS.people,
      ADMIN_CACHE_TAGS.pets,
    ],
  },
)

export const getCachedActiveStaffOptions = unstable_cache(
  async () => {
    return getPrismaClient().staffUser.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    })
  },
  ['admin-read', 'active-staff-options'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.staff],
  },
)

const getCachedDashboardAnalyticsCollection = unstable_cache(
  async (collection: (typeof DASHBOARD_COLLECTIONS)[number]) =>
    getDashboardAnalyticsCollectionFromPrisma(collection),
  ['admin-read', 'dashboard-analytics-collection'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.dashboard],
  },
)

const getCachedDashboardAnalytics = async (): Promise<DashboardAnalyticsDataset> => {
  const collections = await Promise.all(
    DASHBOARD_COLLECTIONS.map(async (collection) => [
      collection,
      await getCachedDashboardAnalyticsCollection(collection),
    ] as const),
  )

  return {
    metadata: {},
    ...Object.fromEntries(collections),
  } as DashboardAnalyticsDataset
}

const getCachedLiveDashboardRecords = unstable_cache(
  getLiveDashboardRecordsFromPrisma,
  ['admin-read', 'dashboard-live-records'],
  {
    revalidate: ADMIN_READ_CACHE_SECONDS,
    tags: [
      ADMIN_CACHE_TAGS.cases,
      ADMIN_CACHE_TAGS.dashboard,
      ADMIN_CACHE_TAGS.people,
      ADMIN_CACHE_TAGS.pets,
    ],
  },
)

export const getCachedDashboardDataset = async () => {
  const [pets, cases, analytics, live] = await Promise.all([
    getCachedAdminPets(),
    getCachedAdminCases(),
    getCachedDashboardAnalytics(),
    getCachedLiveDashboardRecords(),
  ])

  return buildDashboardDataset({ pets, cases, analytics, live })
}

export const getCachedDashboardFollowUps = async () => {
  const [pets, cases] = await Promise.all([
    getCachedAdminPets(),
    getCachedAdminCases(),
  ])

  return buildFollowUpRecords(
    cases,
    new Map(pets.map((pet) => [pet.id, pet])),
  )
}
