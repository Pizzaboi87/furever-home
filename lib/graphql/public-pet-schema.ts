import type { AdminPet, PetImage } from '@/lib/admin/domain'
import {
  getPublicPetById,
  getPublicPets,
  getRelatedPublicPets,
} from '@/lib/public-pet-service'

export type GraphQLPublicPetImage = {
  id: string
  petId: string | null
  url: string
  thumbnailUrl: string | null
  cloudinaryPublicId: string | null
  alt: string | null
  sortOrder: number
  isPrimary: boolean
  width: number | null
  height: number | null
  createdAt: string | null
  updatedAt: string | null
}

export type GraphQLPublicPet = {
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

export type GraphQLPublicPetDetail = {
  pet: GraphQLPublicPet
  relatedPets: GraphQLPublicPet[]
}

type PetQueryArgs = {
  id: string
}

type PetDetailQueryArgs = {
  id: string
  relatedLimit?: number | null
}

type RelatedPetsQueryArgs = {
  id: string
  limit?: number | null
}

export const publicPetTypeDefs = /* GraphQL */ `
  type PetImage {
    id: ID!
    petId: ID
    url: String!
    thumbnailUrl: String
    cloudinaryPublicId: String
    alt: String
    sortOrder: Int!
    isPrimary: Boolean!
    width: Int
    height: Int
    createdAt: String
    updatedAt: String
  }

  type Pet {
    id: ID!
    name: String!
    species: String!
    description: String!
    age: Int!
    gender: String!
    weight: Float!
    image: String!
    imageCloudinaryPublicId: String
    imageAlt: String
    images: [PetImage!]!
    status: String!
    publicStatus: String!
    isPublished: Boolean!
    publishedAt: String
    hiddenAt: String
    size: String
    neutered: Boolean
    goodWithChildren: Boolean
    goodWithOtherAnimals: Boolean
    ageGroup: String
    daysInShelter: Int
    createdAt: String
    lastUpdated: String
    applications: Int
  }

  type PetDetail {
    pet: Pet!
    relatedPets: [Pet!]!
  }

  type Query {
    pets: [Pet!]!
    pet(id: ID!): Pet
    petDetail(id: ID!, relatedLimit: Int = 3): PetDetail
    relatedPets(id: ID!, limit: Int = 3): [Pet!]!
  }
`

const mapPetImageToGraphQL = (image: PetImage): GraphQLPublicPetImage => {
  return {
    id: image.id ?? image.cloudinaryPublicId ?? image.url,
    petId: image.petId ?? null,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl ?? null,
    cloudinaryPublicId: image.cloudinaryPublicId ?? null,
    alt: image.alt ?? null,
    sortOrder: image.sortOrder ?? 0,
    isPrimary: image.isPrimary ?? false,
    width: image.width ?? null,
    height: image.height ?? null,
    createdAt: image.createdAt ?? null,
    updatedAt: image.updatedAt ?? null,
  }
}

export const mapPetToGraphQL = (pet: AdminPet): GraphQLPublicPet => {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    description: pet.description,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    image: pet.image,
    imageCloudinaryPublicId: pet.imageCloudinaryPublicId ?? null,
    imageAlt: pet.imageAlt ?? null,
    images: pet.images?.map(mapPetImageToGraphQL) ?? [],
    status: String(pet.status),
    publicStatus: String(pet.publicStatus ?? pet.status),
    isPublished: pet.isPublished ?? true,
    publishedAt: pet.publishedAt ?? null,
    hiddenAt: pet.hiddenAt ?? null,
    size: pet.size ?? null,
    neutered: pet.neutered ?? null,
    goodWithChildren: pet.goodWithChildren ?? null,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? null,
    ageGroup: pet.ageGroup ?? null,
    daysInShelter: pet.daysInShelter ?? null,
    createdAt: pet.createdAt ?? null,
    lastUpdated: pet.lastUpdated ?? null,
    applications: pet.applications ?? null,
  }
}

const normalizeLimit = (limit: number | null | undefined, fallback: number) => {
  if (!Number.isFinite(limit ?? Number.NaN)) {
    return fallback
  }

  return Math.max(0, Math.min(Math.trunc(limit ?? fallback), 12))
}

export const publicPetResolvers = {
  Query: {
    pets: async (): Promise<GraphQLPublicPet[]> => {
      const pets = await getPublicPets()

      return pets.map(mapPetToGraphQL)
    },
    pet: async (
      _parent: unknown,
      args: PetQueryArgs,
    ): Promise<GraphQLPublicPet | null> => {
      const pet = await getPublicPetById(args.id)

      return pet ? mapPetToGraphQL(pet) : null
    },
    petDetail: async (
      _parent: unknown,
      args: PetDetailQueryArgs,
    ): Promise<GraphQLPublicPetDetail | null> => {
      const pet = await getPublicPetById(args.id)

      if (!pet) {
        return null
      }

      const relatedPets = await getRelatedPublicPets(
        pet,
        normalizeLimit(args.relatedLimit, 3),
      )

      return {
        pet: mapPetToGraphQL(pet),
        relatedPets: relatedPets.map(mapPetToGraphQL),
      }
    },
    relatedPets: async (
      _parent: unknown,
      args: RelatedPetsQueryArgs,
    ): Promise<GraphQLPublicPet[]> => {
      const pet = await getPublicPetById(args.id)

      if (!pet) {
        return []
      }

      const relatedPets = await getRelatedPublicPets(pet, normalizeLimit(args.limit, 3))

      return relatedPets.map(mapPetToGraphQL)
    },
  },
}