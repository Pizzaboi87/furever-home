export const ADMIN_PET_FIELDS = /* GraphQL */ `
  id
  name
  species
  description
  age
  gender
  weight
  image
  imageCloudinaryPublicId
  imageAlt
  status
  publicStatus
  isPublished
  publishedAt
  hiddenAt
  size
  neutered
  goodWithChildren
  goodWithOtherAnimals
  ageGroup
  daysInShelter
  createdAt
  lastUpdated
  applications
  images {
    id
    petId
    url
    thumbnailUrl
    cloudinaryPublicId
    alt
    sortOrder
    isPrimary
    width
    height
    createdAt
    updatedAt
  }
`

export const ADMIN_CASE_FIELDS = /* GraphQL */ `
  id
  caseNumber
  type
  scope
  status
  priority
  source
  personId
  petId
  subject
  summary
  assignedStaffId
  assignedStaff
  createdAt
  updatedAt
  closedAt
  outcome
  nextFollowUpAt
  nextFollowUpNote
  tags
  applicantName
  channel
  score
  sourceRecordId
  lastActivityAt
`

export const PERSON_FIELDS = /* GraphQL */ `
  id
  name
  email
  phone
  address
  preferredContactMethod
  profileType
  householdType
  hasOtherPets
  interestAreas
  tags
  createdAt
  updatedAt
`

export const CASE_DETAIL_FIELDS = /* GraphQL */ `
  case {
    ${ADMIN_CASE_FIELDS}
  }
  applicant {
    id
    name
    email
    phone
    address
    channel
    householdType
    hasOtherPets
    score
  }
  relatedPet {
    ${ADMIN_PET_FIELDS}
  }
  adoptionApplication {
    id
    caseId
    personId
    petId
    sourceApplicationId
    status
    householdType
    hasOtherPets
    hasChildren
    housingType
    landlordApproval
    experienceLevel
    score
    screeningNote
    createdAt
    updatedAt
  }
  virtualAdoption {
    id
    caseId
    personId
    petId
    status
    frequency
    amount
    currency
    sponsorUpdateRequested
    certificateSent
    createdAt
    updatedAt
  }
  donationInquiry {
    id
    caseId
    personId
    donationId
    inquiryType
    status
    amount
    currency
    frequency
    receiptRequested
    thankYouSent
    createdAt
    updatedAt
  }
  volunteerApplication {
    id
    caseId
    personId
    status
    interestAreas
    availability
    experience
    backgroundCheckStatus
    orientationScheduledAt
    orientationCompleted
    assignedRole
    createdAt
    updatedAt
  }
  interactions {
    id
    caseId
    direction
    channel
    summary
    occurredAt
    loggedAt
    loggedByStaffId
    loggedByStaffName
    loggedByStaffRole
  }
  notes {
    id
    caseId
    body
    tags
    createdAt
    staffId
    staffName
    staffRole
  }
  timeline {
    id
    type
    title
    detail
    createdAt
    actorName
    actorRole
  }
`

export const PERSON_STATS_FIELDS = /* GraphQL */ `
  totalCases
  openCases
  totalInteractions
  internalNotes
  relatedPets
  lastActivityAt
`

