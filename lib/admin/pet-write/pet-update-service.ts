import type { AdminPet } from '@/lib/admin/domain'
import { deletePetImagesFromCloudinary } from '@/lib/server/cloudinary'
import { getPrismaClient } from '@/lib/server/prisma'
import {
  assertPetPublicationState,
  assertPetStatusSupportsApplicationWorkload,
} from '@/lib/admin/validation/domain/pet-domain-validation'

import type { ExistingPetImage, UpdatePetInput } from './pet-write-types'
import {
  getFallbackCloudinaryPublicId,
  getNormalizedPetImageUrl,
  getPrismaPetStatus,
  getPublicStatusForPetStatus,
  isHiddenFromPublicStatus,
  loadUpdatedPet,
  requiredPetString,
  restoreStatusForPublish,
  safePetNumber,
} from './pet-write-utils'

export const updatePet = async (input: UpdatePetInput): Promise<AdminPet> => {
  const prisma = getPrismaClient()
  const currentPet = await prisma.pet.findUnique({
    where: { id: input.petId },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
  })

  if (!currentPet) {
    throw new Error('Pet not found.')
  }

  const images = currentPet.images as ExistingPetImage[]
  const name = requiredPetString(input.name, 'Pet name')
  const species = requiredPetString(input.species, 'Species')
  const description = requiredPetString(input.description, 'Description')
  const requestedStatus = getPrismaPetStatus(input.status)
  const shouldPublish = input.publicationAction === 'publish'
  const status = shouldPublish ? restoreStatusForPublish(requestedStatus) : requestedStatus
  const isPublished = shouldPublish
    ? !isHiddenFromPublicStatus(status)
    : currentPet.isPublished && !isHiddenFromPublicStatus(status)
  assertPetPublicationState({ status, isPublished })
  const publicStatus = getPublicStatusForPetStatus({ status, isPublished })
  const applicationStatuses = await prisma.adoptionApplication.findMany({
    where: { petId: input.petId },
    select: { status: true },
  })
  assertPetStatusSupportsApplicationWorkload({
    currentStatus: currentPet.status,
    nextStatus: status,
    applicationStatuses: applicationStatuses.map(
      (application: { status: string }) => application.status,
    ),
  })
  const now = new Date()
  const imageUrl = getNormalizedPetImageUrl(input.image)
  const cloudinaryPublicId =
    input.imageCloudinaryPublicId?.trim() ||
    getFallbackCloudinaryPublicId({ petId: input.petId, name, imageUrl })
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0]
  const previousPrimaryImagePublicId = primaryImage?.cloudinaryPublicId ?? null

  await prisma.pet.update({
    where: { id: input.petId },
    data: {
      name,
      species,
      description,
      age: safePetNumber(input.age, 'Age'),
      gender: requiredPetString(input.gender, 'Gender'),
      weight: safePetNumber(input.weight, 'Weight'),
      status,
      publicStatus,
      isPublished,
      size: input.size?.trim() || null,
      neutered: input.neutered ?? null,
      goodWithChildren: input.goodWithChildren ?? null,
      goodWithOtherAnimals: input.goodWithOtherAnimals ?? null,
      ageGroup: input.ageGroup?.trim() || null,
      daysInShelter: Number.isFinite(input.daysInShelter) ? input.daysInShelter : 0,
      publishedAt: isPublished ? currentPet.publishedAt ?? now : currentPet.publishedAt,
      hiddenAt: isPublished ? null : now,
    },
  })

  if (primaryImage) {
    await prisma.petImage.update({
      where: { id: primaryImage.id },
      data: {
        cloudinaryPublicId,
        secureUrl: imageUrl,
        thumbnailUrl: input.imageThumbnailUrl?.trim() || imageUrl,
        alt: input.imageAlt?.trim() || `${name} the ${species}`,
        sortOrder: 0,
        isPrimary: true,
      },
    })
  } else {
    await prisma.petImage.create({
      data: {
        id: `pet-image-${input.petId}-primary`,
        petId: input.petId,
        cloudinaryPublicId,
        secureUrl: imageUrl,
        thumbnailUrl: input.imageThumbnailUrl?.trim() || imageUrl,
        alt: input.imageAlt?.trim() || `${name} the ${species}`,
        sortOrder: 0,
        isPrimary: true,
      },
    })
  }

  if (previousPrimaryImagePublicId && previousPrimaryImagePublicId !== cloudinaryPublicId) {
    try {
      await deletePetImagesFromCloudinary([previousPrimaryImagePublicId])
    } catch (error) {
      console.error(error)
    }
  }

  return loadUpdatedPet(input.petId)
}
