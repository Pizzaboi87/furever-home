import type {
  AdoptionApplication,
  CaseStatus,
  DonationInquiry,
  VirtualAdoption,
  VolunteerApplication,
} from '@/lib/admin/domain'

import type { PrismaAdminCaseDetailRow } from '../case-repository'
import { toDomainEnumValue, toIsoString } from '../case-utils'

export const mapAdoptionApplication = (
  application: PrismaAdminCaseDetailRow['adoptionApplication'],
): AdoptionApplication | undefined => {
  if (!application) return undefined

  return {
    id: application.id,
    caseId: application.caseId,
    personId: application.personId,
    petId: application.petId,
    sourceApplicationId: application.sourceApplicationId ?? undefined,
    status: toDomainEnumValue<CaseStatus>(application.status) ?? 'new',
    householdType: application.householdType ?? undefined,
    hasOtherPets: application.hasOtherPets ?? undefined,
    hasChildren: application.hasChildren ?? undefined,
    housingType: application.housingType ?? undefined,
    landlordApproval: toDomainEnumValue(application.landlordApproval) as AdoptionApplication['landlordApproval'],
    experienceLevel: toDomainEnumValue(application.experienceLevel) as AdoptionApplication['experienceLevel'],
    score: application.score ?? undefined,
    screeningNote: application.screeningNote,
    createdAt: toIsoString(application.createdAt),
    updatedAt: toIsoString(application.updatedAt),
  }
}

export const mapVirtualAdoption = (
  item: PrismaAdminCaseDetailRow['virtualAdoption'],
): VirtualAdoption | undefined => {
  if (!item) return undefined

  return {
    id: item.id,
    caseId: item.caseId,
    personId: item.personId,
    petId: item.petId,
    status: toDomainEnumValue(item.status) as VirtualAdoption['status'],
    frequency: toDomainEnumValue(item.frequency) as VirtualAdoption['frequency'],
    amount: item.amount === null ? null : Number(item.amount),
    currency: item.currency,
    sponsorUpdateRequested: item.sponsorUpdateRequested,
    certificateSent: item.certificateSent,
    createdAt: toIsoString(item.createdAt),
    updatedAt: toIsoString(item.updatedAt),
  }
}

export const mapDonationInquiry = (
  item: PrismaAdminCaseDetailRow['donationInquiry'],
): DonationInquiry | undefined => {
  if (!item) return undefined

  return {
    id: item.id,
    caseId: item.caseId,
    personId: item.personId,
    donationId: item.externalDonationId,
    inquiryType: toDomainEnumValue(item.inquiryType) as DonationInquiry['inquiryType'],
    status: toDomainEnumValue<CaseStatus>(item.status) ?? 'new',
    amount: item.amount === null ? null : Number(item.amount),
    currency: item.currency,
    frequency: toDomainEnumValue(item.frequency) as DonationInquiry['frequency'],
    receiptRequested: item.receiptRequested,
    thankYouSent: item.thankYouSent,
    createdAt: toIsoString(item.createdAt),
    updatedAt: toIsoString(item.updatedAt),
  }
}

export const mapVolunteerApplication = (
  item: PrismaAdminCaseDetailRow['volunteerApplication'],
): VolunteerApplication | undefined => {
  if (!item) return undefined

  return {
    id: item.id,
    caseId: item.caseId,
    personId: item.personId,
    status: toDomainEnumValue(item.status) as VolunteerApplication['status'],
    interestAreas: item.interestAreas,
    availability: item.availability ?? undefined,
    experience: item.experience ?? undefined,
    backgroundCheckStatus: toDomainEnumValue(item.backgroundCheckStatus) as VolunteerApplication['backgroundCheckStatus'],
    orientationScheduledAt: item.orientationScheduledAt
      ? toIsoString(item.orientationScheduledAt)
      : null,
    orientationCompleted: item.orientationCompleted,
    assignedRole: item.assignedRole,
    createdAt: toIsoString(item.createdAt),
    updatedAt: toIsoString(item.updatedAt),
  }
}
