import {
  PRISMA_PET_STATUS,
  type PrismaPetStatusValue,
} from '@/lib/server/prisma-pet-enums'

import type { AdminPet, PetStatus } from '@/lib/admin/domain'
import { getPrismaAdminPetById } from '@/lib/admin/pet-service'
import { normalizeValue } from '@/lib/pet-format'

const FALLBACK_IMAGE = '/images/assets/pet-placeholder.png'

export const slugifyPetValue = (value: string) => {
  return normalizeValue(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const requiredPetString = (value: string, label: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new Error(`${label} is required.`)
  }

  return trimmedValue
}

export const safePetNumber = (value: number, label: string) => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a valid non-negative number.`)
  }

  return value
}

export const getPrismaPetStatus = (
  status: PetStatus | string | null | undefined,
): PrismaPetStatusValue => {
  switch (normalizeValue(status)) {
    case 'available':
      return PRISMA_PET_STATUS.AVAILABLE
    case 'reserved':
      return PRISMA_PET_STATUS.RESERVED
    case 'adoption_in_progress':
      return PRISMA_PET_STATUS.ADOPTION_IN_PROGRESS
    case 'adopted':
      return PRISMA_PET_STATUS.ADOPTED
    case 'unavailable':
      return PRISMA_PET_STATUS.UNAVAILABLE
    case 'hidden':
      return PRISMA_PET_STATUS.HIDDEN
    case 'new':
    default:
      return PRISMA_PET_STATUS.NEW
  }
}

export {
  getPublicStatusForPetStatus,
  isHiddenFromPublicStatus,
  restoreStatusForPublish,
  shouldForceHiddenFromPublic,
} from '@/lib/pet-publication-policy'

export const getNormalizedPetImageUrl = (image: string | null | undefined) => {
  return image?.trim() || FALLBACK_IMAGE
}

const getCloudinaryPublicIdFromUrl = (imageUrl: string) => {
  const marker = '/image/upload/'
  const markerIndex = imageUrl.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  const pathAfterUpload = imageUrl.slice(markerIndex + marker.length)
  const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '')

  return pathWithoutVersion.replace(/\.[a-z0-9]+$/i, '') || null
}

export const getFallbackCloudinaryPublicId = ({
  petId,
  name,
  imageUrl,
}: {
  petId: string
  name: string
  imageUrl: string
}) => {
  const parsedPublicId = getCloudinaryPublicIdFromUrl(imageUrl)

  if (parsedPublicId) {
    return parsedPublicId
  }

  const imageName = imageUrl.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '')
  const imageSlug = slugifyPetValue(imageName || name) || 'primary'

  return `manual-pets/${petId}/${imageSlug}`
}

export const loadUpdatedPet = async (petId: string): Promise<AdminPet> => {
  const pet = await getPrismaAdminPetById(petId)

  if (!pet) {
    throw new Error('Pet was saved, but could not be loaded from Prisma.')
  }

  return pet
}
