import { execute, parse, type ExecutionResult } from 'graphql'

import type { AdminPet } from '@/lib/admin/domain'
import {
  appGraphQLSchema,
  type GraphQLContext,
} from '@/lib/graphql/app-schema'
import { toTypedClientSafePlainData } from '@/lib/graphql/plain-data'
import type {
  GraphQLPublicPet,
  GraphQLPublicPetDetail,
  GraphQLPublicPetImage,
} from '@/lib/graphql/public-pet-schema'

const publicGraphQLContext: GraphQLContext = {
  getCurrentStaff: async () => null,
}

const executePublicQuery = async <TData>(
  source: string,
  variableValues?: Record<string, unknown>,
): Promise<TData> => {
  const result = (await execute({
    schema: appGraphQLSchema,
    document: parse(source),
    variableValues,
    contextValue: publicGraphQLContext,
  })) as ExecutionResult<TData>

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join('; '))
  }

  if (!result.data) {
    throw new Error('GraphQL query returned no data.')
  }

  return toTypedClientSafePlainData(result.data)
}

const mapGraphQLImageToDomain = (
  image: GraphQLPublicPetImage,
): NonNullable<AdminPet['images']>[number] => {
  return {
    id: image.id,
    petId: image.petId ?? undefined,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl ?? undefined,
    cloudinaryPublicId: image.cloudinaryPublicId ?? undefined,
    alt: image.alt ?? undefined,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
    createdAt: image.createdAt ?? undefined,
    updatedAt: image.updatedAt ?? undefined,
  }
}

const mapGraphQLPetToDomain = (pet: GraphQLPublicPet): AdminPet => {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    description: pet.description,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    image: pet.image,
    imageCloudinaryPublicId: pet.imageCloudinaryPublicId,
    imageAlt: pet.imageAlt,
    images: pet.images.map(mapGraphQLImageToDomain),
    status: pet.status,
    publicStatus: pet.publicStatus,
    isPublished: pet.isPublished,
    publishedAt: pet.publishedAt ?? undefined,
    hiddenAt: pet.hiddenAt ?? undefined,
    size: pet.size ?? undefined,
    neutered: pet.neutered ?? undefined,
    goodWithChildren: pet.goodWithChildren ?? undefined,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? undefined,
    ageGroup: pet.ageGroup ?? undefined,
    daysInShelter: pet.daysInShelter ?? undefined,
    createdAt: pet.createdAt ?? undefined,
    lastUpdated: pet.lastUpdated ?? undefined,
  }
}

const PUBLIC_PET_FIELDS = /* GraphQL */ `
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

type PublicPetsQueryData = {
  pets: GraphQLPublicPet[]
}

type PublicPetDetailQueryData = {
  petDetail: GraphQLPublicPetDetail | null
}

export const getPublicPetsFromGraphQL = async (): Promise<AdminPet[]> => {
  const data = await executePublicQuery<PublicPetsQueryData>(/* GraphQL */ `
    query PublicPets {
      pets {
        ${PUBLIC_PET_FIELDS}
      }
    }
  `)

  return data.pets.map(mapGraphQLPetToDomain)
}

export const getPublicPetDetailFromGraphQL = async (
  id: string,
): Promise<{ pet: AdminPet; relatedPets: AdminPet[] } | null> => {
  const data = await executePublicQuery<PublicPetDetailQueryData>(
    /* GraphQL */ `
      query PublicPetDetail($id: ID!) {
        petDetail(id: $id) {
          pet {
            ${PUBLIC_PET_FIELDS}
          }
          relatedPets {
            ${PUBLIC_PET_FIELDS}
          }
        }
      }
    `,
    { id },
  )

  if (!data.petDetail) {
    return null
  }

  return {
    pet: mapGraphQLPetToDomain(data.petDetail.pet),
    relatedPets: data.petDetail.relatedPets.map(mapGraphQLPetToDomain),
  }
}
