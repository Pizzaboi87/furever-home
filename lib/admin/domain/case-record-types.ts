import type { Id } from './common-types'
import type { AdminPet } from './pet-types'
import type { PersonAddress } from './person-types'
import type {
  CasePriority,
  CaseScope,
  CaseStatus,
  CaseType,
  ContactChannel,
} from './case-core-types'
import type {
  CaseEventActorType,
  CaseInteractionDirection,
  CaseInteractionReferenceSystem,
  CaseInteractionReferenceType,
} from './case-lifecycle'

export type ShelterCase = {
  id: Id
  caseNumber?: string
  type: CaseType
  scope: CaseScope
  status: CaseStatus
  priority?: CasePriority
  source?: ContactChannel
  personId: Id
  petId?: Id | null
  relatedPetId?: Id | null
  relatedEventId?: Id | null
  relatedDonationId?: Id | null
  subject: string
  summary?: string
  assignedStaffId?: Id | null
  assignedStaff?: string
  createdAt: string
  updatedAt: string
  closedAt?: string | null
  outcome?: string | null
  nextFollowUpAt?: string | null
  nextFollowUpNote?: string | null
  tags?: string[]
}

export type AdminPetCase = ShelterCase & {
  applicantName?: string
  channel?: string
  score?: number
  sourceRecordId?: Id
  lastActivityAt: string
}

export type AdminApplicationRecord = {
  id: Id
  caseId?: Id
  personId?: Id
  date: string
  createdAt: string
  petId: Id
  petName: string
  type: string
  applicantName: string
  status: string
  channel?: string
  householdType?: string
  hasOtherPets?: boolean
  score?: number
}

export type AdminCaseApplicant = {
  id: Id
  name: string
  email?: string
  phone?: string
  address?: string | PersonAddress
  channel?: string
  householdType?: string
  hasOtherPets?: boolean
  score?: number
}

export type CaseInteractionExternalReference = {
  system: CaseInteractionReferenceSystem
  type: CaseInteractionReferenceType
  reference: string | null
}

export type CaseInteraction = {
  id: Id
  caseId: Id
  channel: ContactChannel
  direction: CaseInteractionDirection
  occurredAt: string
  loggedAt: string
  loggedByStaffId: Id | null
  loggedByStaffName?: string | null
  loggedByStaffRole?: string | null
  contactPersonId: Id | null
  contactPoint: string | null
  externalReference?: CaseInteractionExternalReference
  summary: string
  actionTaken?: string | null
  nextStep?: string | null
  visibility: 'internal'
}

export type CaseNote = {
  id: Id
  caseId: Id
  staffId: Id
  staffName?: string | null
  staffRole?: string | null
  body: string
  createdAt: string
  tags?: string[]
  visibility: 'internal'
}

export type CaseEvent = {
  id: Id
  caseId: Id
  type: string
  title: string
  detail?: string
  createdAt: string
  actorType?: CaseEventActorType
  actorId?: Id | null
  actorName?: string | null
  actorRole?: string | null
}

export type AdoptionApplication = {
  id: Id
  caseId: Id
  personId: Id
  petId: Id
  sourceApplicationId?: Id
  status: CaseStatus
  householdType?: string
  hasOtherPets?: boolean
  hasChildren?: boolean
  housingType?: string
  landlordApproval?: 'not_needed' | 'pending' | 'confirmed' | 'rejected'
  experienceLevel?: 'first_time' | 'some_experience' | 'experienced'
  score?: number
  screeningNote?: string | null
  createdAt: string
  updatedAt?: string
}

export type VirtualAdoption = {
  id: Id
  caseId: Id
  personId: Id
  petId: Id | number
  status: 'active' | 'paused' | 'cancelled' | 'completed'
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annual'
  amount?: number | null
  currency?: string | null
  sponsorUpdateRequested?: boolean
  certificateSent?: boolean
  createdAt: string
  updatedAt?: string
}

export type DonationInquiry = {
  id: Id
  caseId: Id
  personId: Id
  donationId?: Id | null
  inquiryType:
    | 'receipt_request'
    | 'monthly_donation_change'
    | 'corporate_donation'
    | 'refund_or_correction'
    | 'allocation_question'
    | 'event_sponsorship'
    | 'other'
  status: CaseStatus
  amount?: number | null
  currency?: string | null
  frequency?: 'one_time' | 'monthly' | 'quarterly' | 'annual' | null
  receiptRequested?: boolean
  thankYouSent?: boolean
  createdAt: string
  updatedAt?: string
}

export type VolunteerApplication = {
  id: Id
  caseId: Id
  personId: Id
  status:
    | 'new'
    | 'screening'
    | 'orientation_scheduled'
    | 'approved'
    | 'declined'
    | 'active'
    | 'inactive'
  interestAreas: string[]
  availability?: string
  experience?: string
  backgroundCheckStatus?: 'not_required' | 'pending' | 'cleared' | 'failed'
  orientationScheduledAt?: string | null
  orientationCompleted?: boolean
  assignedRole?: string | null
  createdAt: string
  updatedAt?: string
}

export type ActivityEvent = {
  id: Id
  type: string
  title: string
  detail: string
  createdAt: string
  petId?: Id | number
  caseId?: Id
  personId?: Id
  actorId?: Id | null
  actorName?: string | null
  actorRole?: string | null
}

export type AdminCaseTimelineItem = {
  id: Id
  type: string
  title: string
  detail: string
  createdAt: string
  actorName?: string | null
  actorRole?: string | null
}

export type AdminCaseDetail = {
  case: AdminPetCase
  application?: AdminApplicationRecord
  adoptionApplication?: AdoptionApplication
  virtualAdoption?: VirtualAdoption
  donationInquiry?: DonationInquiry
  volunteerApplication?: VolunteerApplication
  relatedPet?: AdminPet
  applicant: AdminCaseApplicant
}
