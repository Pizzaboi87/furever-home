export type CaseWriteResult = {
  caseId: string
  personId: string | null
  petId: string | null
}

export type AddCaseNoteInput = {
  caseId: string
  body: string
}

export type LogCaseInteractionInput = {
  caseId: string
  channel: string
  direction: string
  summary: string
  actionTaken?: string | null
  nextStep?: string | null
}

export type UpdateCaseStatusInput = {
  caseId: string
  status: string
  currentStatus?: string | null
  outcome?: string | null
}

export type UpdateCaseManagementInput = {
  caseId: string
  assignedStaffId?: string | null
  priority?: string | null
  status?: string | null
  outcome?: string | null
  nextFollowUpAt?: string | null
  nextFollowUpNote?: string | null
}

export type UpdateDonationInquiryInput = {
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

export type UpdateVirtualAdoptionInput = {
  caseId: string
  status?: string | null
  amount?: string | null
  currency?: string | null
  frequency?: string | null
  sponsorUpdateRequested?: boolean | null
  certificateSent?: boolean | null
}

export type UpdateVolunteerApplicationInput = {
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

export type UpdateAdoptionApplicationInput = {
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

export type RunAdoptionWorkflowInput = {
  caseId: string
  action: string
  petId?: string | null
  note?: string | null
}
