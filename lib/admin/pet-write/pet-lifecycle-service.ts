import { PRISMA_PET_PUBLIC_STATUS } from '@/lib/server/prisma-pet-enums'

import type { AdminPet } from '@/lib/admin/domain'
import { deletePetImagesFromCloudinary } from '@/lib/server/cloudinary'
import { getPrismaClient } from '@/lib/server/prisma'

import {
  formatRelatedPetRecordBlockers,
  getRelatedPetRecordCounts,
} from './pet-delete-support'
import type { DeletePetResult } from './pet-write-types'
import { loadUpdatedPet } from './pet-write-utils'

export const unpublishPet = async (petId: string): Promise<AdminPet> => {
  const prisma = getPrismaClient()

  await prisma.pet.update({
    where: { id: petId },
    data: {
      isPublished: false,
      publicStatus: PRISMA_PET_PUBLIC_STATUS.DRAFT,
      hiddenAt: new Date(),
    },
  })

  return loadUpdatedPet(petId)
}

export const deletePet = async (petId: string): Promise<DeletePetResult> => {
  const prisma = getPrismaClient()
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: {
      images: true,
    },
  })

  if (!pet) {
    throw new Error('Pet not found.')
  }

  const blockers = formatRelatedPetRecordBlockers(await getRelatedPetRecordCounts(petId))

  if (blockers.length > 0) {
    throw new Error(
      `This pet cannot be permanently deleted yet because it has related ${blockers.join(
        ', ',
      )}. Use Unpublish for now, or remove/anonymize related records first.`,
    )
  }

  const cloudinaryPublicIds = pet.images
    .map((image: { cloudinaryPublicId: string }) => image.cloudinaryPublicId)
    .filter((publicId: string): publicId is string => Boolean(publicId))

  await prisma.pet.delete({
    where: { id: petId },
  })

  try {
    await deletePetImagesFromCloudinary(cloudinaryPublicIds)
  } catch (error) {
    console.error(error)
  }

  return { deletedPetId: petId }
}
