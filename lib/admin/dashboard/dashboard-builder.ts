import type { AdminDashboardDataset, AdminPet, AdminPetCase, DashboardRecord } from '../domain'
import type { DashboardAnalyticsDataset, LiveDashboardRecords } from './dashboard-types'
import {
  buildCurrentMonthPetSnapshots,
  mapCaseToApplicationRecord,
  mapCompletedCaseToAdoptionRecord,
  mapDonationInquiryToDonationRecord,
  mapPetToIntakeRecord,
  mapVirtualAdoptionToDonationRecord,
  mergePetSnapshots,
} from './dashboard-record-mappers'
import { buildFollowUpRecords, formatDashboardActivityText } from './dashboard-followups'
import { buildDailySummaries, buildMonthlySummaries, mergeSummaryRecords } from './dashboard-summaries'
import {
  emptyLiveDashboardRecords,
  getCaseScopedRecordKey,
  getSortedUniqueMonths,
  mergeDashboardRecords,
  sortByCreatedAtDesc,
} from './dashboard-utils'

export const buildDashboardDataset = ({
  pets,
  cases,
  analytics,
  live = emptyLiveDashboardRecords(),
}: {
  pets: AdminPet[]
  cases: AdminPetCase[]
  analytics: DashboardAnalyticsDataset
  live?: LiveDashboardRecords
}): AdminDashboardDataset => {

  const petById = new Map(pets.map((pet) => [pet.id, pet]))
  const caseById = new Map(cases.map((shelterCase) => [shelterCase.id, shelterCase]))
  const adoptionApplicationByCaseId = new Map(
    live.adoptionApplications.map((application) => [application.caseId, application]),
  )

  // Dashboard history is an analytics dataset, not just the current transactional inventory.
  // Keep the historical dashboard fixtures as the source for old months, then overlay live
  // Prisma-created records that do not exist in the legacy fixture set yet.
  const livePetIntakes = pets.map(mapPetToIntakeRecord)
  const followUps = buildFollowUpRecords(cases, petById)

  const liveApplications = cases
    .map((shelterCase) =>
      mapCaseToApplicationRecord(shelterCase, petById, adoptionApplicationByCaseId),
    )
    .filter((record): record is DashboardRecord => Boolean(record))

  const liveAdoptions = cases
    .map((shelterCase) => mapCompletedCaseToAdoptionRecord(shelterCase, petById))
    .filter((record): record is DashboardRecord => Boolean(record))

  const derivedDonations = live.donationInquiries
    .map((donationInquiry) => mapDonationInquiryToDonationRecord(donationInquiry, caseById))
    .filter((record): record is DashboardRecord => Boolean(record))

  const derivedVirtualAdoptionDonations = live.virtualAdoptions
    .map((virtualAdoption) => mapVirtualAdoptionToDonationRecord(virtualAdoption, caseById))
    .filter((record): record is DashboardRecord => Boolean(record))

  const intakes = mergeDashboardRecords(
    analytics.animalIntakes,
    livePetIntakes,
  )
  const adoptions = mergeDashboardRecords(
    analytics.adoptions,
    liveAdoptions,
  )
  const applications = mergeDashboardRecords(
    analytics.applications,
    liveApplications,
  )
  const activityEvents = sortByCreatedAtDesc(
    mergeDashboardRecords(analytics.activityEvents, live.activityEvents).map(formatDashboardActivityText),
  )
  const petStatusEvents = sortByCreatedAtDesc(
    mergeDashboardRecords(analytics.petStatusEvents, live.petStatusEvents),
  )
  const donations = mergeDashboardRecords(
    analytics.donations,
    [
      ...derivedDonations,
      ...derivedVirtualAdoptionDonations,
    ],
    getCaseScopedRecordKey,
  )
  const volunteerHours = mergeDashboardRecords(
    analytics.volunteerHours,
    live.volunteerHours,
  )
  const dailySummaries = buildDailySummaries({
    baseSummaries: analytics.dailySummaries,
    intakes,
    adoptions,
    applications,
    donations,
    volunteerHours,
    activityEvents,
  })
  const monthlySummaries = buildMonthlySummaries({
    baseSummaries: analytics.monthlySummaries,
    intakes,
    adoptions,
    applications,
    donations,
    volunteerHours,
    activityEvents,
  })
  const dashboardMonths = getSortedUniqueMonths(
    monthlySummaries,
    intakes,
    adoptions,
    applications,
    donations,
    volunteerHours,
    activityEvents,
  )
  const completeMonthlySummaries = mergeSummaryRecords(
    monthlySummaries,
    dashboardMonths.map((month) => ({ month })),
    'month',
  )
  const monthlyPetSnapshots = mergePetSnapshots(
    analytics.monthlyPetSnapshots,
    buildCurrentMonthPetSnapshots(pets),
  )

  return {
    metadata: analytics.metadata,
    pets,
    intakes,
    adoptions,
    applications,
    donations,
    volunteerHours,
    activityEvents,
    followUps,
    dailySummaries,
    monthlySummaries: completeMonthlySummaries,
    speciesMonthlySummaries: analytics.speciesMonthlySummaries,
    petStatusEvents,
    monthlyPetSnapshots,
  }
}
