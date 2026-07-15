import type { GraphQLPublicPetImage } from '@/lib/graphql/public-pet-schema'

export type GraphQLAdminPet = {
  id: string
  name: string
  species: string
  description: string
  age: number
  gender: string
  weight: number
  image: string
  imageCloudinaryPublicId: string | null
  imageAlt: string | null
  images: GraphQLPublicPetImage[]
  status: string
  publicStatus: string
  isPublished: boolean
  publishedAt: string | null
  hiddenAt: string | null
  size: string | null
  neutered: boolean | null
  goodWithChildren: boolean | null
  goodWithOtherAnimals: boolean | null
  ageGroup: string | null
  daysInShelter: number | null
  createdAt: string | null
  lastUpdated: string | null
  applications: number | null
}

export type GraphQLAdminCase = {
  id: string
  caseNumber: string | null
  type: string
  scope: string
  status: string
  priority: string
  source: string
  personId: string | null
  petId: string | null
  subject: string
  summary: string | null
  assignedStaffId: string | null
  assignedStaff: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
  outcome: string | null
  nextFollowUpAt: string | null
  nextFollowUpNote: string | null
  tags: string[]
  applicantName: string
  channel: string | null
  score: number | null
  sourceRecordId: string | null
  lastActivityAt: string
}

export type GraphQLPerson = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  preferredContactMethod: string | null
  profileType: string | null
  householdType: string | null
  hasOtherPets: boolean | null
  interestAreas: string[]
  tags: string[]
  createdAt: string | null
  updatedAt: string | null
}

export type GraphQLCaseInteraction = {
  id: string
  caseId: string
  direction: string
  channel: string
  summary: string
  occurredAt: string
  loggedAt: string
  loggedByStaffId: string | null
  loggedByStaffName: string | null
  loggedByStaffRole: string | null
}

export type GraphQLCaseNote = {
  id: string
  caseId: string
  body: string
  tags: string[]
  createdAt: string
  staffId: string | null
  staffName: string | null
  staffRole: string | null
}

export type GraphQLCaseTimelineItem = {
  id: string
  type: string
  title: string
  detail: string
  createdAt: string
  actorName: string | null
  actorRole: string | null
  caseId: string | null
  caseSubject: string | null
}

export type GraphQLAdminCaseApplicant = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  channel: string | null
  householdType: string | null
  hasOtherPets: boolean | null
  score: number | null
}

export type GraphQLAdoptionApplication = {
  id: string
  caseId: string
  personId: string
  petId: string
  sourceApplicationId: string | null
  status: string
  householdType: string | null
  hasOtherPets: boolean | null
  hasChildren: boolean | null
  housingType: string | null
  landlordApproval: string | null
  experienceLevel: string | null
  score: number | null
  screeningNote: string | null
  createdAt: string
  updatedAt: string | null
}

export type GraphQLVirtualAdoption = {
  id: string
  caseId: string
  personId: string
  petId: string
  status: string
  frequency: string
  amount: number | null
  currency: string | null
  sponsorUpdateRequested: boolean | null
  certificateSent: boolean | null
  createdAt: string
  updatedAt: string | null
}

export type GraphQLDonationInquiry = {
  id: string
  caseId: string
  personId: string
  donationId: string | null
  inquiryType: string
  status: string
  amount: number | null
  currency: string | null
  frequency: string | null
  receiptRequested: boolean | null
  thankYouSent: boolean | null
  createdAt: string
  updatedAt: string | null
}

export type GraphQLVolunteerApplication = {
  id: string
  caseId: string
  personId: string
  status: string
  interestAreas: string[]
  availability: string | null
  experience: string | null
  backgroundCheckStatus: string | null
  orientationScheduledAt: string | null
  orientationCompleted: boolean | null
  assignedRole: string | null
  createdAt: string
  updatedAt: string | null
}

export type GraphQLPetActivityItem = {
  id: string
  kind: string
  type: string
  title: string
  detail: string
  createdAt: string
  statusFrom: string | null
  statusTo: string | null
}

export type GraphQLAdminCaseDetail = {
  case: GraphQLAdminCase
  adoptionApplication: GraphQLAdoptionApplication | null
  virtualAdoption: GraphQLVirtualAdoption | null
  donationInquiry: GraphQLDonationInquiry | null
  volunteerApplication: GraphQLVolunteerApplication | null
  relatedPet: GraphQLAdminPet | null
  applicant: GraphQLAdminCaseApplicant
  interactions: GraphQLCaseInteraction[]
  notes: GraphQLCaseNote[]
  timeline: GraphQLCaseTimelineItem[]
}

export type GraphQLAdminPersonStats = {
  totalCases: number
  openCases: number
  totalInteractions: number
  internalNotes: number
  relatedPets: number
  lastActivityAt: string | null
}

export type GraphQLAdminPersonOverview = {
  person: GraphQLPerson
  stats: GraphQLAdminPersonStats
}

export type GraphQLAdminPersonDetail = {
  person: GraphQLPerson
  cases: GraphQLAdminCase[]
  interactions: GraphQLCaseInteraction[]
  notes: GraphQLCaseNote[]
  timeline: GraphQLCaseTimelineItem[]
  relatedPets: GraphQLAdminPet[]
  stats: GraphQLAdminPersonStats
}

export type GraphQLAdminPetDetail = {
  pet: GraphQLAdminPet
  cases: GraphQLAdminCase[]
  activity: GraphQLPetActivityItem[]
}

export type StaffOption = {
  id: string
  name: string
}

