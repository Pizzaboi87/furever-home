import type {
  AdoptionApplication as PrismaAdoptionApplicationRow,
  DonationInquiry as PrismaDonationInquiryRow,
  VirtualAdoption as PrismaVirtualAdoptionRow,
  VolunteerHours as PrismaVolunteerHoursRow,
  ActivityEvent as PrismaActivityEventRow,
  PetStatusEvent as PrismaPetStatusEventRow,
  Prisma,
} from '@prisma/client'
import { getPrismaClient } from '@/lib/server/prisma'
import type {
  AdoptionApplication,
  DashboardRecord,
  DonationInquiry,
  VirtualAdoption,
} from '../domain'
import type { DashboardAnalyticsDataset, LiveDashboardRecords } from './dashboard-types'
import { getDatePart } from './dashboard-utils'

export const DASHBOARD_COLLECTIONS = [
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
] as const

export type DashboardCollectionName = (typeof DASHBOARD_COLLECTIONS)[number]

type DashboardAnalyticsRow = {
  collection: string
  data: Prisma.JsonValue
}

const emptyDashboardAnalyticsDataset = (): DashboardAnalyticsDataset => ({
  metadata: {},
  animalIntakes: [],
  adoptions: [],
  applications: [],
  donations: [],
  volunteerHours: [],
  activityEvents: [],
  dailySummaries: [],
  monthlySummaries: [],
  speciesMonthlySummaries: [],
  petStatusEvents: [],
  monthlyPetSnapshots: [],
})

export const getDashboardAnalyticsCollectionFromPrisma = async (
  collection: DashboardCollectionName,
): Promise<DashboardRecord[]> => {
  const rows = await getPrismaClient().dashboardAnalyticsRecord.findMany({
    where: { collection },
    select: { data: true },
    orderBy: [
      { month: 'asc' },
      { date: 'asc' },
      { recordKey: 'asc' },
      { id: 'asc' },
    ],
  })

  return rows.map((row) => row.data as DashboardRecord)
}

const getDashboardAnalyticsRows = async (): Promise<DashboardAnalyticsRow[]> => {
  const collectionRows = await Promise.all(
    DASHBOARD_COLLECTIONS.map(async (collection) => {
      const records = await getDashboardAnalyticsCollectionFromPrisma(collection)

      return records.map((data) => ({ collection, data }))
    }),
  )

  return collectionRows.flat()
}

export const getDashboardAnalyticsFromPrisma = async (): Promise<DashboardAnalyticsDataset> => {
  const rows = await getDashboardAnalyticsRows()
  const dataset = emptyDashboardAnalyticsDataset()

  for (const row of rows) {
    const collection = row.collection as DashboardCollectionName

    if (!DASHBOARD_COLLECTIONS.includes(collection)) {
      continue
    }

    dataset[collection].push(row.data as DashboardRecord)
  }

  return dataset
}

const toDomainEnumValue = (value: string | null | undefined) => {
  return value?.toLowerCase()
}

const decimalToNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const getLiveDashboardRecordsFromPrisma = async (): Promise<LiveDashboardRecords> => {
  const prisma = getPrismaClient()

  const [
    adoptionApplications,
    donationInquiries,
    virtualAdoptions,
    volunteerHours,
    activityEvents,
    petStatusEvents,
  ] = await Promise.all([
    prisma.adoptionApplication.findMany(),
    prisma.donationInquiry.findMany(),
    prisma.virtualAdoption.findMany(),
    prisma.volunteerHours.findMany(),
    prisma.activityEvent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.petStatusEvent.findMany({
      orderBy: [{ createdAt: 'desc' }, { date: 'desc' }],
    }),
  ])

  return {
    adoptionApplications: adoptionApplications.map((application: PrismaAdoptionApplicationRow) => ({
      id: application.id,
      caseId: application.caseId,
      personId: application.personId,
      petId: application.petId,
      sourceApplicationId: application.sourceApplicationId ?? undefined,
      status: toDomainEnumValue(application.status) as AdoptionApplication['status'],
      householdType: application.householdType ?? undefined,
      hasOtherPets: application.hasOtherPets ?? undefined,
      hasChildren: application.hasChildren ?? undefined,
      housingType: application.housingType ?? undefined,
      landlordApproval: toDomainEnumValue(application.landlordApproval) as AdoptionApplication['landlordApproval'],
      experienceLevel: toDomainEnumValue(application.experienceLevel) as AdoptionApplication['experienceLevel'],
      score: application.score ?? undefined,
      screeningNote: application.screeningNote,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    })),
    donationInquiries: donationInquiries.map((inquiry: PrismaDonationInquiryRow) => ({
      id: inquiry.id,
      caseId: inquiry.caseId,
      personId: inquiry.personId,
      donationId: inquiry.externalDonationId,
      inquiryType: toDomainEnumValue(inquiry.inquiryType) as DonationInquiry['inquiryType'],
      status: toDomainEnumValue(inquiry.status) as DonationInquiry['status'],
      amount: decimalToNumber(inquiry.amount),
      currency: inquiry.currency,
      frequency: toDomainEnumValue(inquiry.frequency) as DonationInquiry['frequency'],
      receiptRequested: inquiry.receiptRequested,
      thankYouSent: inquiry.thankYouSent,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
    })),
    virtualAdoptions: virtualAdoptions.map((virtualAdoption: PrismaVirtualAdoptionRow) => ({
      id: virtualAdoption.id,
      caseId: virtualAdoption.caseId,
      personId: virtualAdoption.personId,
      petId: virtualAdoption.petId,
      status: toDomainEnumValue(virtualAdoption.status) as VirtualAdoption['status'],
      frequency: toDomainEnumValue(virtualAdoption.frequency) as VirtualAdoption['frequency'],
      amount: decimalToNumber(virtualAdoption.amount),
      currency: virtualAdoption.currency,
      sponsorUpdateRequested: virtualAdoption.sponsorUpdateRequested,
      certificateSent: virtualAdoption.certificateSent,
      createdAt: virtualAdoption.createdAt.toISOString(),
      updatedAt: virtualAdoption.updatedAt.toISOString(),
    })),
    volunteerHours: volunteerHours.map((record: PrismaVolunteerHoursRow) => ({
      id: record.id,
      personId: record.personId,
      caseId: record.caseId ?? undefined,
      volunteerApplicationId: record.volunteerApplicationId ?? undefined,
      date: getDatePart(record.date.toISOString()),
      createdAt: record.createdAt.toISOString(),
      hours: record.hours,
      activity: record.activity,
      role: record.role ?? undefined,
      staffId: record.staffId ?? undefined,
    })),
    activityEvents: activityEvents.map((event: PrismaActivityEventRow) => ({
      id: event.id,
      type: event.type,
      title: event.title,
      detail: event.detail,
      createdAt: event.createdAt.toISOString(),
      petId: event.petId ?? undefined,
      caseId: event.caseId ?? undefined,
      personId: event.personId ?? undefined,
      actorId: event.actorId ?? undefined,
      actorName: event.actorName ?? undefined,
      actorRole: event.actorRole ?? undefined,
    })),
    petStatusEvents: petStatusEvents.map((event: PrismaPetStatusEventRow) => ({
      id: event.id,
      petId: event.petId ?? undefined,
      caseId: event.caseId ?? undefined,
      fromStatus: toDomainEnumValue(event.fromStatus),
      toStatus: toDomainEnumValue(event.toStatus),
      date: getDatePart(event.date.toISOString()),
      createdAt: event.createdAt.toISOString(),
    })),
  }
}
