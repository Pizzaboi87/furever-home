import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import type { GraphQLPublicPet } from '@/lib/graphql/public-pet-schema'

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
  isPinned: boolean
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

export type GraphQLAdminCaseDetail = {
  case: GraphQLAdminCase
  application: GraphQLAdminCase | null
  adoptionApplication: GraphQLAdoptionApplication | null
  virtualAdoption: GraphQLVirtualAdoption | null
  donationInquiry: GraphQLDonationInquiry | null
  volunteerApplication: GraphQLVolunteerApplication | null
  relatedPet: GraphQLPublicPet | null
  applicant: GraphQLAdminCaseApplicant
  interactions: GraphQLCaseInteraction[]
  notes: GraphQLCaseNote[]
  timeline: GraphQLCaseTimelineItem[]
}

export type CreateCaseMutationArgs = {
  input: CreateIncomingCaseInput
}

export type AddCaseNoteMutationArgs = {
  input: {
    caseId: string
    body: string
  }
}

export type LogCaseInteractionMutationArgs = {
  input: {
    caseId: string
    channel: string
    direction: string
    summary: string
    actionTaken?: string | null
    nextStep?: string | null
  }
}

export type UpdateCaseStatusMutationArgs = {
  input: {
    caseId: string
    status: string
    currentStatus?: string | null
    outcome?: string | null
  }
}

export type UpdateCaseManagementMutationArgs = {
  input: {
    caseId: string
    assignedStaffId?: string | null
    priority?: string | null
    status?: string | null
    outcome?: string | null
    nextFollowUpAt?: string | null
    nextFollowUpNote?: string | null
  }
}

export type UpdateDonationInquiryMutationArgs = {
  input: {
    caseId: string
    donationId?: string | null
    inquiryType?: string | null
    status?: string | null
    amount?: string | null
    currency?: string | null
    frequency?: string | null
    receiptRequested?: boolean | null
    thankYouSent?: boolean | null
  }
}

export type UpdateVirtualAdoptionMutationArgs = {
  input: {
    caseId: string
    status?: string | null
    amount?: string | null
    currency?: string | null
    frequency?: string | null
    sponsorUpdateRequested?: boolean | null
    certificateSent?: boolean | null
  }
}

export type UpdateVolunteerApplicationMutationArgs = {
  input: {
    caseId: string
    status?: string | null
    interestAreas?: string[] | null
    availability?: string | null
    experience?: string | null
    backgroundCheckStatus?: string | null
    orientationScheduledAt?: string | null
    orientationCompleted?: boolean | null
    assignedRole?: string | null
    volunteerHoursDate?: string | null
    volunteerHours?: string | null
    volunteerHoursActivity?: string | null
  }
}

export type UpdateAdoptionApplicationMutationArgs = {
  input: {
    caseId: string
    status?: string | null
    score?: string | null
    householdType?: string | null
    hasOtherPets?: boolean | null
    hasChildren?: boolean | null
    housingType?: string | null
    landlordApproval?: string | null
    experienceLevel?: string | null
    screeningNote?: string | null
  }
}

export type RunAdoptionWorkflowMutationArgs = {
  input: {
    caseId: string
    action: string
    petId?: string | null
    note?: string | null
  }
}
