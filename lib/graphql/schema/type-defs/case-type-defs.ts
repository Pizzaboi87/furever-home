export const caseTypeDefs = /* GraphQL */ `
  type CaseInteraction {
    id: ID!
    caseId: ID!
    direction: String!
    channel: String!
    summary: String!
    occurredAt: String!
    loggedAt: String!
    loggedByStaffId: ID
    loggedByStaffName: String
    loggedByStaffRole: String
  }

  type CaseNote {
    id: ID!
    caseId: ID!
    body: String!
    tags: [String!]!
    isPinned: Boolean!
    createdAt: String!
    staffId: ID
    staffName: String
    staffRole: String
  }

  type CaseTimelineItem {
    id: ID!
    type: String!
    title: String!
    detail: String!
    createdAt: String!
    actorName: String
    actorRole: String
    caseId: ID
    caseSubject: String
  }

  type AdminCase {
    id: ID!
    caseNumber: String
    type: String!
    scope: String!
    status: String!
    priority: String!
    source: String!
    personId: ID
    petId: ID
    subject: String!
    summary: String
    assignedStaffId: ID
    assignedStaff: String
    createdAt: String!
    updatedAt: String!
    closedAt: String
    outcome: String
    nextFollowUpAt: String
    nextFollowUpNote: String
    tags: [String!]!
    applicantName: String!
    channel: String
    score: Int
    sourceRecordId: ID
    lastActivityAt: String!
  }

  type AdminCaseApplicant {
    id: ID!
    name: String!
    email: String
    phone: String
    address: String
    channel: String
    householdType: String
    hasOtherPets: Boolean
    score: Int
  }

  type AdoptionApplication {
    id: ID!
    caseId: ID!
    personId: ID!
    petId: ID!
    sourceApplicationId: ID
    status: String!
    householdType: String
    hasOtherPets: Boolean
    hasChildren: Boolean
    housingType: String
    landlordApproval: String
    experienceLevel: String
    score: Int
    screeningNote: String
    createdAt: String!
    updatedAt: String
  }

  type VirtualAdoption {
    id: ID!
    caseId: ID!
    personId: ID!
    petId: ID!
    status: String!
    frequency: String!
    amount: Float
    currency: String
    sponsorUpdateRequested: Boolean
    certificateSent: Boolean
    createdAt: String!
    updatedAt: String
  }

  type DonationInquiry {
    id: ID!
    caseId: ID!
    personId: ID!
    donationId: ID
    inquiryType: String!
    status: String!
    amount: Float
    currency: String
    frequency: String
    receiptRequested: Boolean
    thankYouSent: Boolean
    createdAt: String!
    updatedAt: String
  }

  type VolunteerApplication {
    id: ID!
    caseId: ID!
    personId: ID!
    status: String!
    interestAreas: [String!]!
    availability: String
    experience: String
    backgroundCheckStatus: String
    orientationScheduledAt: String
    orientationCompleted: Boolean
    assignedRole: String
    createdAt: String!
    updatedAt: String
  }

  type AdminCaseDetail {
    case: AdminCase!
    application: AdminCase
    adoptionApplication: AdoptionApplication
    virtualAdoption: VirtualAdoption
    donationInquiry: DonationInquiry
    volunteerApplication: VolunteerApplication
    relatedPet: Pet
    applicant: AdminCaseApplicant!
    interactions: [CaseInteraction!]!
    notes: [CaseNote!]!
    timeline: [CaseTimelineItem!]!
  }

  input CreateCasePersonInput {
    id: ID
    name: String!
    email: String
    phone: String
    address: String
  }

  input CreateCaseInput {
    channel: String!
    person: CreateCasePersonInput!
    petId: ID
    petName: String
    type: String!
    subject: String!
    message: String!
    actionTaken: String
    nextStep: String
    priority: String
    assignedStaff: String
    assignedStaffId: ID
    createdAt: String
  }

  input AddCaseNoteInput {
    caseId: ID!
    body: String!
  }

  input LogCaseInteractionInput {
    caseId: ID!
    channel: String!
    direction: String!
    summary: String!
    actionTaken: String
    nextStep: String
  }

  input UpdateCaseStatusInput {
    caseId: ID!
    status: String!
    currentStatus: String
    outcome: String
  }

  input UpdateCaseManagementInput {
    caseId: ID!
    assignedStaffId: ID
    priority: String
    status: String
    outcome: String
    nextFollowUpAt: String
    nextFollowUpNote: String
  }

  input UpdateDonationInquiryInput {
    caseId: ID!
    donationId: String
    inquiryType: String
    status: String
    amount: String
    currency: String
    frequency: String
    receiptRequested: Boolean
    thankYouSent: Boolean
  }

  input UpdateVirtualAdoptionInput {
    caseId: ID!
    status: String
    amount: String
    currency: String
    frequency: String
    sponsorUpdateRequested: Boolean
    certificateSent: Boolean
  }

  input UpdateVolunteerApplicationInput {
    caseId: ID!
    status: String
    interestAreas: [String!]
    availability: String
    experience: String
    backgroundCheckStatus: String
    orientationScheduledAt: String
    orientationCompleted: Boolean
    assignedRole: String
    volunteerHoursDate: String
    volunteerHours: String
    volunteerHoursActivity: String
  }

  input UpdateAdoptionApplicationInput {
    caseId: ID!
    status: String
    score: String
    householdType: String
    hasOtherPets: Boolean
    hasChildren: Boolean
    housingType: String
    landlordApproval: String
    experienceLevel: String
    screeningNote: String
  }

  input RunAdoptionWorkflowInput {
    caseId: ID!
    action: String!
    petId: ID
    note: String
  }
`
