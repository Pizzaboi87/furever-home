import type {
  AdminCaseTimelineItem,
  AdminPet,
  AdminPetCase,
  CaseInteraction,
  CaseNote,
  Person,
} from '../domain'

export type AdminPersonTimelineItem = AdminCaseTimelineItem & {
  caseId: string
  caseSubject: string
}

export type AdminPersonStats = {
  totalCases: number
  openCases: number
  totalInteractions: number
  internalNotes: number
  relatedPets: number
  lastActivityAt?: string
}

export type AdminPersonDetail = {
  person: Person
  cases: AdminPetCase[]
  interactions: CaseInteraction[]
  notes: CaseNote[]
  timeline: AdminPersonTimelineItem[]
  relatedPets: AdminPet[]
  stats: AdminPersonStats
}

export type AdminPersonOverview = {
  person: Person
  stats: AdminPersonStats
}

export type PrismaPersonRecord = {
  id: string
  name: string
  email: string | null
  phone: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  preferredContactMethod: string | null
  profileType: string | null
  householdType: string | null
  hasOtherPets: boolean | null
  interestAreas: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
