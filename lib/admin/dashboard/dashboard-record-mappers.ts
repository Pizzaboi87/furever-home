import { isCompletedAdoptionStatus } from '../domain'
import type {
  AdminPet,
  AdminPetCase,
  AdoptionApplication,
  DashboardRecord,
  DonationInquiry,
  VirtualAdoption,
} from '../domain'
import {
  getCasePetId,
  getCurrentMonthPart,
  getDatePart,
  mergeDashboardRecords,
  numberValue,
  stringValue,
} from './dashboard-utils'

const APPLICATION_CASE_TYPES = new Set(['adoption_application', 'adoption_interest'])

const REALIZED_VIRTUAL_ADOPTION_STATUSES = new Set<VirtualAdoption['status']>([
  'active',
  'completed',
])

const getPetType = (pet: AdminPet | undefined) => {
  return pet?.species ?? ''
}

const getPetName = (pet: AdminPet | undefined, shelterCase: AdminPetCase) => {
  return pet?.name ?? stringValue(shelterCase.relatedPetId ?? shelterCase.petId) ?? 'Unknown pet'
}


export const mapCaseToApplicationRecord = (
  shelterCase: AdminPetCase,
  petById: Map<string, AdminPet>,
  adoptionApplicationByCaseId: Map<string, AdoptionApplication>,
): DashboardRecord | undefined => {
  if (!APPLICATION_CASE_TYPES.has(shelterCase.type)) {
    return undefined
  }

  const adoptionApplication = adoptionApplicationByCaseId.get(shelterCase.id)
  const petId = getCasePetId(shelterCase) ?? adoptionApplication?.petId

  if (!petId) {
    return undefined
  }

  const pet = petById.get(String(petId))

  return {
    id: `application-${shelterCase.id}`,
    caseId: shelterCase.id,
    personId: shelterCase.personId,
    date: getDatePart(shelterCase.createdAt),
    createdAt: shelterCase.createdAt,
    updatedAt: adoptionApplication?.updatedAt ?? shelterCase.updatedAt,
    petId,
    petName: getPetName(pet, shelterCase),
    type: getPetType(pet),
    applicantName: shelterCase.applicantName ?? 'Unknown applicant',
    status: adoptionApplication?.status ?? shelterCase.status,
    channel: shelterCase.source ?? shelterCase.channel,
    score: adoptionApplication?.score ?? shelterCase.score,
    householdType: adoptionApplication?.householdType,
    hasOtherPets: adoptionApplication?.hasOtherPets,
    hasChildren: adoptionApplication?.hasChildren,
    housingType: adoptionApplication?.housingType,
    landlordApproval: adoptionApplication?.landlordApproval,
    experienceLevel: adoptionApplication?.experienceLevel,
  }
}

export const mapCompletedCaseToAdoptionRecord = (
  shelterCase: AdminPetCase,
  petById: Map<string, AdminPet>,
): DashboardRecord | undefined => {
  if (!APPLICATION_CASE_TYPES.has(shelterCase.type)) {
    return undefined
  }

  if (!isCompletedAdoptionStatus(shelterCase.status)) {
    return undefined
  }

  const petId = getCasePetId(shelterCase)

  if (!petId) {
    return undefined
  }

  const pet = petById.get(String(petId))

  return {
    id: `adoption-${shelterCase.id}`,
    caseId: shelterCase.id,
    personId: shelterCase.personId,
    date: getDatePart(shelterCase.closedAt ?? shelterCase.updatedAt),
    createdAt: shelterCase.createdAt,
    updatedAt: shelterCase.updatedAt,
    petId,
    petName: getPetName(pet, shelterCase),
    type: getPetType(pet),
    applicantName: shelterCase.applicantName ?? 'Unknown applicant',
    status: shelterCase.status,
    daysInShelter: pet?.daysInShelter ?? 0,
  }
}

export const mapDonationInquiryToDonationRecord = (
  donationInquiry: DonationInquiry,
  caseById: Map<string, AdminPetCase>,
): DashboardRecord | undefined => {
  const amount = numberValue(donationInquiry.amount)

  if (amount <= 0) {
    return undefined
  }

  const shelterCase = caseById.get(donationInquiry.caseId)
  const recordDate = donationInquiry.updatedAt ?? donationInquiry.createdAt

  return {
    id: `donation-${donationInquiry.caseId}`,
    caseId: donationInquiry.caseId,
    personId: donationInquiry.personId,
    donationId: donationInquiry.donationId,
    date: getDatePart(recordDate),
    createdAt: donationInquiry.createdAt,
    updatedAt: donationInquiry.updatedAt ?? donationInquiry.createdAt,
    amount,
    currency: donationInquiry.currency ?? 'USD',
    frequency: donationInquiry.frequency ?? 'one_time',
    status: donationInquiry.status,
    source: shelterCase?.source ?? shelterCase?.channel ?? 'manual',
    inquiryType: donationInquiry.inquiryType,
    receiptRequested: donationInquiry.receiptRequested,
    thankYouSent: donationInquiry.thankYouSent,
  }
}

export const mapVirtualAdoptionToDonationRecord = (
  virtualAdoption: VirtualAdoption,
  caseById: Map<string, AdminPetCase>,
): DashboardRecord | undefined => {
  const amount = numberValue(virtualAdoption.amount)

  if (amount <= 0) {
    return undefined
  }

  if (!REALIZED_VIRTUAL_ADOPTION_STATUSES.has(virtualAdoption.status)) {
    return undefined
  }

  const shelterCase = caseById.get(virtualAdoption.caseId)
  const recordDate = virtualAdoption.updatedAt ?? virtualAdoption.createdAt

  return {
    id: `virtual-adoption-donation-${virtualAdoption.caseId}`,
    caseId: virtualAdoption.caseId,
    personId: virtualAdoption.personId,
    petId: virtualAdoption.petId,
    date: getDatePart(recordDate),
    createdAt: virtualAdoption.createdAt,
    updatedAt: virtualAdoption.updatedAt ?? virtualAdoption.createdAt,
    amount,
    currency: virtualAdoption.currency ?? 'USD',
    frequency: virtualAdoption.frequency,
    status: virtualAdoption.status,
    source: 'virtual_adoption',
    caseType: shelterCase?.type ?? 'virtual_adoption',
    sponsorshipStatus: virtualAdoption.status,
    sponsorUpdateRequested: virtualAdoption.sponsorUpdateRequested,
    certificateSent: virtualAdoption.certificateSent,
  }
}

export const mapPetToIntakeRecord = (pet: AdminPet): DashboardRecord => {
  const createdAt = pet.createdAt ?? pet.lastUpdated ?? new Date().toISOString()

  return {
    id: `intake-${pet.id}`,
    date: getDatePart(createdAt),
    createdAt,
    petId: pet.id,
    petName: pet.name,
    type: pet.species,
    species: pet.species,
    age: pet.age,
    ageGroup: pet.ageGroup,
    size: pet.size,
    gender: pet.gender,
    status: pet.status,
    healthStatus: 'pending_review',
  }
}

const mapPetToMonthlySnapshot = (pet: AdminPet, month: string): DashboardRecord => {
  return {
    id: `snapshot-${month}-${pet.id}`,
    month,
    petId: pet.id,
    name: pet.name,
    type: pet.species,
    species: pet.species,
    status: pet.status,
    age: pet.age,
    ageGroup: pet.ageGroup,
    size: pet.size,
    gender: pet.gender,
    weight: pet.weight,
    applications: pet.applications ?? 0,
    daysInShelter: pet.daysInShelter ?? 0,
  }
}

const getSnapshotKey = (snapshot: DashboardRecord) => {
  return `${stringValue(snapshot.month)}-${stringValue(snapshot.petId ?? snapshot.id)}`
}

const buildCurrentPetSnapshotsForMonths = (pets: AdminPet[], months: string[]) => {
  return months.flatMap((month) => pets.map((pet) => mapPetToMonthlySnapshot(pet, month)))
}

export const buildCurrentMonthPetSnapshots = (pets: AdminPet[]) => {
  return buildCurrentPetSnapshotsForMonths(pets, [getCurrentMonthPart()])
}

export const mergePetSnapshots = (
  historicalSnapshots: DashboardRecord[],
  liveCurrentSnapshots: DashboardRecord[],
) => {
  return mergeDashboardRecords(
    historicalSnapshots,
    liveCurrentSnapshots,
    getSnapshotKey,
  )
}

