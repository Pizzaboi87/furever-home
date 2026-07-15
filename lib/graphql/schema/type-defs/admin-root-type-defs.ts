export const adminRootTypeDefs = /* GraphQL */ `
  scalar JSON

  type StaffOption {
    id: ID!
    name: String!
  }

  extend type Query {
    adminPets: [Pet!]!
    adminPet(id: ID!): Pet
    adminPetDetail(id: ID!): AdminPetDetail
    adminCases: [AdminCase!]!
    adminCase(id: ID!): AdminCaseDetail
    adminPeople: [Person!]!
    adminPeopleOverview: [PersonOverview!]!
    adminPerson(id: ID!): AdminPersonDetail
    activeStaffOptions: [StaffOption!]!
    adminDashboardDataset: JSON!
    adminFollowUps: [JSON!]!
  }

  type Mutation {
    createCase(input: CreateCaseInput!): AdminCaseDetail!
    addCaseNote(input: AddCaseNoteInput!): AdminCaseDetail!
    logCaseInteraction(input: LogCaseInteractionInput!): AdminCaseDetail!
    updateCaseStatus(input: UpdateCaseStatusInput!): AdminCaseDetail!
    updateCaseManagement(input: UpdateCaseManagementInput!): AdminCaseDetail!
    updateDonationInquiry(input: UpdateDonationInquiryInput!): AdminCaseDetail!
    updateVirtualAdoption(input: UpdateVirtualAdoptionInput!): AdminCaseDetail!
    updateVolunteerApplication(input: UpdateVolunteerApplicationInput!): AdminCaseDetail!
    updateAdoptionApplication(input: UpdateAdoptionApplicationInput!): AdminCaseDetail!
    runAdoptionWorkflow(input: RunAdoptionWorkflowInput!): AdminCaseDetail!
    createPet(input: CreatePetInput!): Pet!
    updatePet(input: UpdatePetInput!): Pet!
    unpublishPet(id: ID!): Pet!
    deletePet(id: ID!): DeletePetPayload!
    createPerson(input: CreatePersonInput!): Person!
    updatePerson(input: UpdatePersonInput!): Person!
    anonymizePerson(input: AnonymizePersonInput!): Person!
  }
`
