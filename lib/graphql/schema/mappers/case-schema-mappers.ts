import {
  getAdminCaseInteractionsFromPrisma,
  getAdminCaseNotesFromPrisma,
  getAdminCaseTimelineFromPrisma,
} from '@/lib/admin/case-service'
import type {
  AdminCaseApplicant,
  AdminCaseDetail,
  AdminCaseTimelineItem,
  AdminPetCase,
  AdoptionApplication,
  CaseInteraction,
  CaseNote,
  DonationInquiry,
  VirtualAdoption,
  VolunteerApplication,
} from '@/lib/admin/domain'
import { mapPetToGraphQL } from '@/lib/graphql/public-pet-schema'
import type {
  GraphQLAdminCase,
  GraphQLAdminCaseApplicant,
  GraphQLAdminCaseDetail,
  GraphQLAdoptionApplication,
  GraphQLCaseInteraction,
  GraphQLCaseNote,
  GraphQLCaseTimelineItem,
  GraphQLDonationInquiry,
  GraphQLVirtualAdoption,
  GraphQLVolunteerApplication,
} from '@/lib/graphql/schema/admin-schema-types'
import {
  formatPersonAddress,
  toNullableString,
} from '@/lib/graphql/schema/mappers/schema-mapper-utils'

export const mapAdminCaseToGraphQL = (
  shelterCase: AdminPetCase,
): GraphQLAdminCase => ({
  id: shelterCase.id,
  caseNumber: shelterCase.caseNumber ?? null,
  type: shelterCase.type,
  scope: shelterCase.scope,
  status: shelterCase.status,
  priority: shelterCase.priority ?? 'medium',
  source: shelterCase.source ?? 'manual',
  personId: shelterCase.personId,
  petId: shelterCase.petId ?? shelterCase.relatedPetId ?? null,
  subject: shelterCase.subject,
  summary: shelterCase.summary ?? null,
  assignedStaffId: shelterCase.assignedStaffId ?? null,
  assignedStaff: shelterCase.assignedStaff ?? null,
  createdAt: shelterCase.createdAt,
  updatedAt: shelterCase.updatedAt,
  closedAt: shelterCase.closedAt ?? null,
  outcome: shelterCase.outcome ?? null,
  nextFollowUpAt: shelterCase.nextFollowUpAt ?? null,
  nextFollowUpNote: shelterCase.nextFollowUpNote ?? null,
  tags: shelterCase.tags ?? [],
  applicantName: shelterCase.applicantName ?? 'Unknown applicant',
  channel: shelterCase.channel ?? null,
  score: shelterCase.score ?? null,
  sourceRecordId: shelterCase.sourceRecordId ?? null,
  lastActivityAt: shelterCase.lastActivityAt,
})

export const mapInteractionToGraphQL = (
  interaction: CaseInteraction,
): GraphQLCaseInteraction => ({
  id: interaction.id,
  caseId: interaction.caseId,
  direction: interaction.direction,
  channel: interaction.channel,
  summary: interaction.summary,
  occurredAt: interaction.occurredAt,
  loggedAt: interaction.loggedAt,
  loggedByStaffId: interaction.loggedByStaffId ?? null,
  loggedByStaffName: interaction.loggedByStaffName ?? null,
  loggedByStaffRole: interaction.loggedByStaffRole ?? null,
})

export const mapNoteToGraphQL = (note: CaseNote): GraphQLCaseNote => ({
  id: note.id,
  caseId: note.caseId,
  body: note.body,
  tags: note.tags ?? [],
  isPinned: false,
  createdAt: note.createdAt,
  staffId: note.staffId ?? null,
  staffName: note.staffName ?? null,
  staffRole: note.staffRole ?? null,
})

export const mapTimelineItemToGraphQL = (
  item: AdminCaseTimelineItem & { caseId?: string; caseSubject?: string },
): GraphQLCaseTimelineItem => ({
  id: item.id,
  type: item.type,
  title: item.title,
  detail: item.detail,
  createdAt: item.createdAt,
  actorName: item.actorName ?? null,
  actorRole: item.actorRole ?? null,
  caseId: item.caseId ?? null,
  caseSubject: item.caseSubject ?? null,
})

const mapAdminCaseApplicantToGraphQL = (
  applicant: AdminCaseApplicant,
): GraphQLAdminCaseApplicant => ({
  id: applicant.id,
  name: applicant.name,
  email: toNullableString(applicant.email),
  phone: toNullableString(applicant.phone),
  address: formatPersonAddress(applicant.address),
  channel: applicant.channel ?? null,
  householdType: applicant.householdType ?? null,
  hasOtherPets: applicant.hasOtherPets ?? null,
  score: applicant.score ?? null,
})

const mapAdoptionApplicationToGraphQL = (
  application: AdoptionApplication | undefined,
): GraphQLAdoptionApplication | null => {
  if (!application) {
    return null
  }

  return {
    id: application.id,
    caseId: application.caseId,
    personId: application.personId,
    petId: application.petId,
    sourceApplicationId: application.sourceApplicationId ?? null,
    status: application.status,
    householdType: application.householdType ?? null,
    hasOtherPets: application.hasOtherPets ?? null,
    hasChildren: application.hasChildren ?? null,
    housingType: application.housingType ?? null,
    landlordApproval: application.landlordApproval ?? null,
    experienceLevel: application.experienceLevel ?? null,
    score: application.score ?? null,
    screeningNote: application.screeningNote ?? null,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt ?? null,
  }
}

const mapVirtualAdoptionToGraphQL = (
  virtualAdoption: VirtualAdoption | undefined,
): GraphQLVirtualAdoption | null => {
  if (!virtualAdoption) {
    return null
  }

  return {
    id: virtualAdoption.id,
    caseId: virtualAdoption.caseId,
    personId: virtualAdoption.personId,
    petId: String(virtualAdoption.petId),
    status: virtualAdoption.status,
    frequency: virtualAdoption.frequency,
    amount: virtualAdoption.amount ?? null,
    currency: virtualAdoption.currency ?? null,
    sponsorUpdateRequested: virtualAdoption.sponsorUpdateRequested ?? null,
    certificateSent: virtualAdoption.certificateSent ?? null,
    createdAt: virtualAdoption.createdAt,
    updatedAt: virtualAdoption.updatedAt ?? null,
  }
}

const mapDonationInquiryToGraphQL = (
  donationInquiry: DonationInquiry | undefined,
): GraphQLDonationInquiry | null => {
  if (!donationInquiry) {
    return null
  }

  return {
    id: donationInquiry.id,
    caseId: donationInquiry.caseId,
    personId: donationInquiry.personId,
    donationId: donationInquiry.donationId ?? null,
    inquiryType: donationInquiry.inquiryType,
    status: donationInquiry.status,
    amount: donationInquiry.amount ?? null,
    currency: donationInquiry.currency ?? null,
    frequency: donationInquiry.frequency ?? null,
    receiptRequested: donationInquiry.receiptRequested ?? null,
    thankYouSent: donationInquiry.thankYouSent ?? null,
    createdAt: donationInquiry.createdAt,
    updatedAt: donationInquiry.updatedAt ?? null,
  }
}

const mapVolunteerApplicationToGraphQL = (
  volunteerApplication: VolunteerApplication | undefined,
): GraphQLVolunteerApplication | null => {
  if (!volunteerApplication) {
    return null
  }

  return {
    id: volunteerApplication.id,
    caseId: volunteerApplication.caseId,
    personId: volunteerApplication.personId,
    status: volunteerApplication.status,
    interestAreas: volunteerApplication.interestAreas ?? [],
    availability: volunteerApplication.availability ?? null,
    experience: volunteerApplication.experience ?? null,
    backgroundCheckStatus: volunteerApplication.backgroundCheckStatus ?? null,
    orientationScheduledAt: volunteerApplication.orientationScheduledAt ?? null,
    orientationCompleted: volunteerApplication.orientationCompleted ?? null,
    assignedRole: volunteerApplication.assignedRole ?? null,
    createdAt: volunteerApplication.createdAt,
    updatedAt: volunteerApplication.updatedAt ?? null,
  }
}

export const mapAdminCaseDetailToGraphQL = async (
  detail: AdminCaseDetail,
): Promise<GraphQLAdminCaseDetail> => {
  const [interactions, notes, timeline] = await Promise.all([
    getAdminCaseInteractionsFromPrisma(detail.case.id),
    getAdminCaseNotesFromPrisma(detail.case.id),
    getAdminCaseTimelineFromPrisma(detail.case.id),
  ])

  return {
    case: mapAdminCaseToGraphQL(detail.case),
    application: null,
    adoptionApplication: mapAdoptionApplicationToGraphQL(detail.adoptionApplication),
    virtualAdoption: mapVirtualAdoptionToGraphQL(detail.virtualAdoption),
    donationInquiry: mapDonationInquiryToGraphQL(detail.donationInquiry),
    volunteerApplication: mapVolunteerApplicationToGraphQL(detail.volunteerApplication),
    relatedPet: detail.relatedPet ? mapPetToGraphQL(detail.relatedPet) : null,
    applicant: mapAdminCaseApplicantToGraphQL(detail.applicant),
    interactions: interactions.map(mapInteractionToGraphQL),
    notes: notes.map(mapNoteToGraphQL),
    timeline: timeline.map(mapTimelineItemToGraphQL),
  }
}
