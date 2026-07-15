import type { AdminPet } from '@/lib/admin/domain'
import { getNextPetId } from '@/lib/admin/common/id-generators'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertPetPublicationState } from '@/lib/admin/validation/domain/pet-domain-validation'

import type { CreatePetInput } from './pet-write-types'
import {
  getFallbackCloudinaryPublicId,
  getNormalizedPetImageUrl,
  getPrismaPetStatus,
  getPublicStatusForPetStatus,
  loadUpdatedPet,
  requiredPetString,
  shouldForceHiddenFromPublic,
  slugifyPetValue,
} from './pet-write-utils'

export const createPet = async (input: CreatePetInput): Promise<AdminPet> => {
  const prisma = getPrismaClient()
  const existingPets: Array<{ id: string }> = await prisma.pet.findMany({
    select: {
      id: true,
    },
  })

  const petId = getNextPetId(existingPets.map((pet) => pet.id))
  const name = requiredPetString(input.name, 'Pet name')
  const species = requiredPetString(input.species, 'Species')
  const description = requiredPetString(input.description, 'Description')
  const status = getPrismaPetStatus(input.status)
  const isPublished = shouldForceHiddenFromPublic(status)
    ? false
    : input.isPublished ?? true
  assertPetPublicationState({ status, isPublished })

  const imageUrl = getNormalizedPetImageUrl(input.image)
  const cloudinaryPublicId =
    input.imageCloudinaryPublicId?.trim() ||
    getFallbackCloudinaryPublicId({ petId, name, imageUrl })
  const now = new Date()

  await prisma.pet.create({
    data: {
      id: petId,
      publicSlug: `${slugifyPetValue(name) || petId}-${petId}`,
      name,
      species,
      description,
      age: Number.isFinite(input.age) ? input.age : 0,
      gender: requiredPetString(input.gender, 'Gender'),
      weight: Number.isFinite(input.weight) ? input.weight : 0,
      status,
      publicStatus: getPublicStatusForPetStatus({ status, isPublished }),
      isPublished,
      featured: false,
      size: input.size?.trim() || null,
      neutered: input.neutered ?? null,
      goodWithChildren: input.goodWithChildren ?? null,
      goodWithOtherAnimals: input.goodWithOtherAnimals ?? null,
      ageGroup: input.ageGroup?.trim() || null,
      daysInShelter: Number.isFinite(input.daysInShelter) ? input.daysInShelter : 0,
      publishedAt: isPublished ? now : null,
      hiddenAt: isPublished ? null : now,
      images: {
        create: {
          id: `pet-image-${petId}-primary`,
          cloudinaryPublicId,
          secureUrl: imageUrl,
          thumbnailUrl: input.imageThumbnailUrl?.trim() || imageUrl,
          alt: input.imageAlt?.trim() || `${name} the ${species}`,
          sortOrder: 0,
          isPrimary: true,
        },
      },
    },
  })

  return loadUpdatedPet(petId)
}
