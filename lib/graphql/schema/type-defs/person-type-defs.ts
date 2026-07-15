export const personTypeDefs = /* GraphQL */ `
  type Person {
    id: ID!
    name: String!
    email: String
    phone: String
    address: String
    preferredContactMethod: String
    profileType: String
    householdType: String
    hasOtherPets: Boolean
    interestAreas: [String!]!
    tags: [String!]!
    createdAt: String
    updatedAt: String
  }

  type PersonStats {
    totalCases: Int!
    openCases: Int!
    totalInteractions: Int!
    internalNotes: Int!
    relatedPets: Int!
    lastActivityAt: String
  }

  type PersonOverview {
    person: Person!
    stats: PersonStats!
  }

  type AdminPersonDetail {
    person: Person!
    cases: [AdminCase!]!
    interactions: [CaseInteraction!]!
    notes: [CaseNote!]!
    timeline: [CaseTimelineItem!]!
    relatedPets: [Pet!]!
    stats: PersonStats!
  }

  input CreatePersonInput {
    name: String!
    email: String
    phone: String
    address: String
    preferredContactMethod: String
    tags: [String!]
  }

  input UpdatePersonInput {
    personId: ID!
    name: String!
    email: String
    phone: String
    address: String
    preferredContactMethod: String
    profileType: String
    householdType: String
    hasOtherPets: Boolean
    interestAreas: [String!]
    tags: [String!]
  }

  input AnonymizePersonInput {
    personId: ID!
    confirmationName: String!
  }
`
