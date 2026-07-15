import type {
  AdminCaseDetail,
  AdminCaseTimelineItem,
  CaseInteraction,
  CaseNote,
} from '@/lib/admin/domain'

import {
  mapAdoptionApplication,
  mapCaseApplicant,
  mapCaseEvent,
  mapCaseInteraction,
  mapCaseNote,
  mapCasePet,
  mapDetailCase,
  mapDonationInquiry,
  mapVirtualAdoption,
  mapVolunteerApplication,
} from './case-detail-mappers'
import { getPrismaAdminCaseDetailRow } from './case-repository'

export const getAdminCaseByIdFromPrisma = async (
  caseId: string,
): Promise<AdminCaseDetail | undefined> => {
  const shelterCase = await getPrismaAdminCaseDetailRow(caseId)

  if (!shelterCase) return undefined

  return {
    case: mapDetailCase(shelterCase),
    adoptionApplication: mapAdoptionApplication(shelterCase.adoptionApplication),
    virtualAdoption: mapVirtualAdoption(shelterCase.virtualAdoption),
    donationInquiry: mapDonationInquiry(shelterCase.donationInquiry),
    volunteerApplication: mapVolunteerApplication(shelterCase.volunteerApplication),
    relatedPet: shelterCase.pet ? mapCasePet(shelterCase.pet) : undefined,
    applicant: mapCaseApplicant(shelterCase),
  }
}

export const getAdminCaseInteractionsFromPrisma = async (
  caseId: string,
): Promise<CaseInteraction[]> => {
  const shelterCase = await getPrismaAdminCaseDetailRow(caseId)
  return shelterCase?.interactions.map(mapCaseInteraction) ?? []
}

export const getAdminCaseNotesFromPrisma = async (
  caseId: string,
): Promise<CaseNote[]> => {
  const shelterCase = await getPrismaAdminCaseDetailRow(caseId)
  return shelterCase?.notes.map(mapCaseNote) ?? []
}

export const getAdminCaseTimelineFromPrisma = async (
  caseId: string,
): Promise<AdminCaseTimelineItem[]> => {
  const shelterCase = await getPrismaAdminCaseDetailRow(caseId)
  if (!shelterCase) return []

  return shelterCase.events
    .map(mapCaseEvent)
    .filter((item: AdminCaseTimelineItem) => Boolean(item.createdAt))
    .sort((a: AdminCaseTimelineItem, b: AdminCaseTimelineItem) =>
      b.createdAt.localeCompare(a.createdAt),
    )
}
