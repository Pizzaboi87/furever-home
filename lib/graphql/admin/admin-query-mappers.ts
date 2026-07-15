import type {
  AdminCaseApplicant,
  AdminCaseDetail,
  AdminCaseTimelineItem,
  AdminPet,
  AdminPetActivityItem,
  AdminPetCase,
  AdoptionApplication,
  CaseInteraction,
  CaseNote,
  DonationInquiry,
  Person,
  VirtualAdoption,
  VolunteerApplication,
} from '@/lib/admin/domain'
import type { AdminPersonStats } from '@/lib/admin/person-service'
import type {
  GraphQLAdminCase,
  GraphQLAdminCaseApplicant,
  GraphQLAdminCaseDetail,
  GraphQLAdminPersonStats,
  GraphQLAdminPet,
  GraphQLAdoptionApplication,
  GraphQLCaseInteraction,
  GraphQLCaseNote,
  GraphQLCaseTimelineItem,
  GraphQLDonationInquiry,
  GraphQLPerson,
  GraphQLPetActivityItem,
  GraphQLVirtualAdoption,
  GraphQLVolunteerApplication,
} from '@/lib/graphql/admin/admin-query-types'
import type { GraphQLPublicPetImage } from '@/lib/graphql/public-pet-schema'

const mapGraphQLImageToDomain = (
  image: GraphQLPublicPetImage,
): NonNullable<AdminPet['images']>[number] => ({
  id: image.id,
  petId: image.petId ?? undefined,
  url: image.url,
  thumbnailUrl: image.thumbnailUrl ?? undefined,
  cloudinaryPublicId: image.cloudinaryPublicId ?? undefined,
  alt: image.alt ?? undefined,
  sortOrder: image.sortOrder,
  isPrimary: image.isPrimary,
  width: image.width ?? undefined,
  height: image.height ?? undefined,
  createdAt: image.createdAt ?? undefined,
  updatedAt: image.updatedAt ?? undefined,
})

export const mapGraphQLPetToDomain = (pet: GraphQLAdminPet): AdminPet => ({
  id: pet.id,
  name: pet.name,
  species: pet.species,
  description: pet.description,
  age: pet.age,
  gender: pet.gender,
  weight: pet.weight,
  image: pet.image,
  imageCloudinaryPublicId: pet.imageCloudinaryPublicId,
  imageAlt: pet.imageAlt,
  images: pet.images.map(mapGraphQLImageToDomain),
  status: pet.status,
  publicStatus: pet.publicStatus,
  isPublished: pet.isPublished,
  publishedAt: pet.publishedAt ?? undefined,
  hiddenAt: pet.hiddenAt ?? undefined,
  size: pet.size ?? undefined,
  neutered: pet.neutered ?? undefined,
  goodWithChildren: pet.goodWithChildren ?? undefined,
  goodWithOtherAnimals: pet.goodWithOtherAnimals ?? undefined,
  ageGroup: pet.ageGroup ?? undefined,
  daysInShelter: pet.daysInShelter ?? undefined,
  createdAt: pet.createdAt ?? undefined,
  lastUpdated: pet.lastUpdated ?? undefined,
  applications: pet.applications ?? undefined,
})

export const mapGraphQLCaseToDomain = (shelterCase: GraphQLAdminCase): AdminPetCase => ({
  id: shelterCase.id,
  caseNumber: shelterCase.caseNumber ?? undefined,
  type: shelterCase.type as AdminPetCase['type'],
  scope: shelterCase.scope as AdminPetCase['scope'],
  status: shelterCase.status as AdminPetCase['status'],
  priority: shelterCase.priority as AdminPetCase['priority'],
  source: shelterCase.source as AdminPetCase['source'],
  personId: shelterCase.personId ?? '',
  petId: shelterCase.petId,
  relatedPetId: shelterCase.petId,
  subject: shelterCase.subject,
  summary: shelterCase.summary ?? undefined,
  assignedStaffId: shelterCase.assignedStaffId,
  assignedStaff: shelterCase.assignedStaff ?? undefined,
  createdAt: shelterCase.createdAt,
  updatedAt: shelterCase.updatedAt,
  closedAt: shelterCase.closedAt,
  outcome: shelterCase.outcome,
  nextFollowUpAt: shelterCase.nextFollowUpAt,
  nextFollowUpNote: shelterCase.nextFollowUpNote,
  tags: shelterCase.tags,
  applicantName: shelterCase.applicantName,
  channel: shelterCase.channel ?? undefined,
  score: shelterCase.score ?? undefined,
  sourceRecordId: shelterCase.sourceRecordId ?? undefined,
  lastActivityAt: shelterCase.lastActivityAt,
})

export const mapGraphQLPersonToDomain = (person: GraphQLPerson): Person => ({
  id: person.id,
  name: person.name,
  email: person.email ?? undefined,
  phone: person.phone ?? undefined,
  address: person.address ?? undefined,
  preferredContactMethod: person.preferredContactMethod
    ? person.preferredContactMethod as Person['preferredContactMethod']
    : undefined,
  profileType: person.profileType
    ? person.profileType as Person['profileType']
    : undefined,
  householdType: person.householdType ?? undefined,
  hasOtherPets: person.hasOtherPets ?? undefined,
  interestAreas: person.interestAreas,
  tags: person.tags,
  createdAt: person.createdAt ?? new Date().toISOString(),
  updatedAt: person.updatedAt ?? undefined,
})

export const mapGraphQLInteractionToDomain = (
  interaction: GraphQLCaseInteraction,
): CaseInteraction => ({
  id: interaction.id,
  caseId: interaction.caseId,
  channel: interaction.channel as CaseInteraction['channel'],
  direction: interaction.direction as CaseInteraction['direction'],
  occurredAt: interaction.occurredAt,
  loggedAt: interaction.loggedAt,
  loggedByStaffId: interaction.loggedByStaffId,
  loggedByStaffName: interaction.loggedByStaffName,
  loggedByStaffRole: interaction.loggedByStaffRole,
  contactPersonId: null,
  contactPoint: null,
  summary: interaction.summary,
  visibility: 'internal',
})

export const mapGraphQLNoteToDomain = (note: GraphQLCaseNote): CaseNote => ({
  id: note.id,
  caseId: note.caseId,
  staffId: note.staffId ?? '',
  staffName: note.staffName,
  staffRole: note.staffRole,
  body: note.body,
  createdAt: note.createdAt,
  tags: note.tags,
  visibility: 'internal',
})

export const mapGraphQLTimelineToDomain = (
  item: GraphQLCaseTimelineItem,
): AdminCaseTimelineItem => ({
  id: item.id,
  type: item.type,
  title: item.title,
  detail: item.detail,
  createdAt: item.createdAt,
  actorName: item.actorName,
  actorRole: item.actorRole,
})

const mapGraphQLApplicantToDomain = (
  applicant: GraphQLAdminCaseApplicant,
): AdminCaseApplicant => ({
  id: applicant.id,
  name: applicant.name,
  email: applicant.email ?? undefined,
  phone: applicant.phone ?? undefined,
  address: applicant.address ?? undefined,
  channel: applicant.channel ?? undefined,
  householdType: applicant.householdType ?? undefined,
  hasOtherPets: applicant.hasOtherPets ?? undefined,
  score: applicant.score ?? undefined,
})

const mapGraphQLAdoptionApplicationToDomain = (
  application: GraphQLAdoptionApplication | null,
): AdoptionApplication | undefined => {
  if (!application) return undefined

  return {
    id: application.id,
    caseId: application.caseId,
    personId: application.personId,
    petId: application.petId,
    sourceApplicationId: application.sourceApplicationId ?? undefined,
    status: application.status as AdoptionApplication['status'],
    householdType: application.householdType ?? undefined,
    hasOtherPets: application.hasOtherPets ?? undefined,
    hasChildren: application.hasChildren ?? undefined,
    housingType: application.housingType ?? undefined,
    landlordApproval: application.landlordApproval
      ? application.landlordApproval as AdoptionApplication['landlordApproval']
      : undefined,
    experienceLevel: application.experienceLevel
      ? application.experienceLevel as AdoptionApplication['experienceLevel']
      : undefined,
    score: application.score ?? undefined,
    screeningNote: application.screeningNote,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt ?? undefined,
  }
}

const mapGraphQLVirtualAdoptionToDomain = (
  virtualAdoption: GraphQLVirtualAdoption | null,
): VirtualAdoption | undefined => {
  if (!virtualAdoption) return undefined

  return {
    id: virtualAdoption.id,
    caseId: virtualAdoption.caseId,
    personId: virtualAdoption.personId,
    petId: virtualAdoption.petId,
    status: virtualAdoption.status as VirtualAdoption['status'],
    frequency: virtualAdoption.frequency as VirtualAdoption['frequency'],
    amount: virtualAdoption.amount,
    currency: virtualAdoption.currency,
    sponsorUpdateRequested: virtualAdoption.sponsorUpdateRequested ?? undefined,
    certificateSent: virtualAdoption.certificateSent ?? undefined,
    createdAt: virtualAdoption.createdAt,
    updatedAt: virtualAdoption.updatedAt ?? undefined,
  }
}

const mapGraphQLDonationInquiryToDomain = (
  donationInquiry: GraphQLDonationInquiry | null,
): DonationInquiry | undefined => {
  if (!donationInquiry) return undefined

  return {
    id: donationInquiry.id,
    caseId: donationInquiry.caseId,
    personId: donationInquiry.personId,
    donationId: donationInquiry.donationId,
    inquiryType: donationInquiry.inquiryType as DonationInquiry['inquiryType'],
    status: donationInquiry.status as DonationInquiry['status'],
    amount: donationInquiry.amount,
    currency: donationInquiry.currency,
    frequency: donationInquiry.frequency
      ? donationInquiry.frequency as DonationInquiry['frequency']
      : undefined,
    receiptRequested: donationInquiry.receiptRequested ?? undefined,
    thankYouSent: donationInquiry.thankYouSent ?? undefined,
    createdAt: donationInquiry.createdAt,
    updatedAt: donationInquiry.updatedAt ?? undefined,
  }
}

const mapGraphQLVolunteerApplicationToDomain = (
  volunteerApplication: GraphQLVolunteerApplication | null,
): VolunteerApplication | undefined => {
  if (!volunteerApplication) return undefined

  return {
    id: volunteerApplication.id,
    caseId: volunteerApplication.caseId,
    personId: volunteerApplication.personId,
    status: volunteerApplication.status as VolunteerApplication['status'],
    interestAreas: volunteerApplication.interestAreas,
    availability: volunteerApplication.availability ?? undefined,
    experience: volunteerApplication.experience ?? undefined,
    backgroundCheckStatus: volunteerApplication.backgroundCheckStatus
      ? volunteerApplication.backgroundCheckStatus as VolunteerApplication['backgroundCheckStatus']
      : undefined,
    orientationScheduledAt: volunteerApplication.orientationScheduledAt,
    orientationCompleted: volunteerApplication.orientationCompleted ?? undefined,
    assignedRole: volunteerApplication.assignedRole,
    createdAt: volunteerApplication.createdAt,
    updatedAt: volunteerApplication.updatedAt ?? undefined,
  }
}

export const mapGraphQLPetActivityToDomain = (
  item: GraphQLPetActivityItem,
): AdminPetActivityItem => ({
  id: item.id,
  kind: item.kind as AdminPetActivityItem['kind'],
  type: item.type,
  title: item.title,
  detail: item.detail,
  createdAt: item.createdAt,
  statusFrom: item.statusFrom,
  statusTo: item.statusTo ?? undefined,
})

export const mapGraphQLPersonStatsToDomain = (
  stats: GraphQLAdminPersonStats,
): AdminPersonStats => ({
  totalCases: stats.totalCases,
  openCases: stats.openCases,
  totalInteractions: stats.totalInteractions,
  internalNotes: stats.internalNotes,
  relatedPets: stats.relatedPets,
  lastActivityAt: stats.lastActivityAt ?? undefined,
})

export const mapGraphQLCaseDetailToDomain = (
  detail: GraphQLAdminCaseDetail,
): AdminCaseDetail => ({
  case: mapGraphQLCaseToDomain(detail.case),
  adoptionApplication: mapGraphQLAdoptionApplicationToDomain(detail.adoptionApplication),
  virtualAdoption: mapGraphQLVirtualAdoptionToDomain(detail.virtualAdoption),
  donationInquiry: mapGraphQLDonationInquiryToDomain(detail.donationInquiry),
  volunteerApplication: mapGraphQLVolunteerApplicationToDomain(detail.volunteerApplication),
  relatedPet: detail.relatedPet ? mapGraphQLPetToDomain(detail.relatedPet) : undefined,
  applicant: mapGraphQLApplicantToDomain(detail.applicant),
})
