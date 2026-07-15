export const petTypeDefs = /* GraphQL */ `
  type PetActivityItem {
    id: ID!
    kind: String!
    type: String!
    title: String!
    detail: String!
    createdAt: String!
    statusFrom: String
    statusTo: String
  }

  type AdminPetDetail {
    pet: Pet!
    cases: [AdminCase!]!
    activity: [PetActivityItem!]!
  }

  input CreatePetInput {
    name: String!
    species: String!
    description: String!
    age: Int!
    gender: String!
    weight: Float!
    image: String!
    imageCloudinaryPublicId: String
    imageThumbnailUrl: String
    imageAlt: String
    status: String!
    publicStatus: String
    isPublished: Boolean
    size: String
    neutered: Boolean
    goodWithChildren: Boolean
    goodWithOtherAnimals: Boolean
    applications: Int
    ageGroup: String
    daysInShelter: Int
    lastUpdated: String
  }

  input UpdatePetInput {
    petId: ID!
    name: String!
    species: String!
    description: String!
    age: Int!
    gender: String!
    weight: Float!
    image: String!
    imageCloudinaryPublicId: String
    imageThumbnailUrl: String
    imageAlt: String
    status: String!
    publicStatus: String
    isPublished: Boolean
    size: String
    neutered: Boolean
    goodWithChildren: Boolean
    goodWithOtherAnimals: Boolean
    applications: Int
    ageGroup: String
    daysInShelter: Int
    lastUpdated: String
    publicationAction: String
  }

  type DeletePetPayload {
    deletedPetId: ID!
  }
`
