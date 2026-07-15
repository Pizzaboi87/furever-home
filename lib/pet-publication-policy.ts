import {
  PRISMA_PET_PUBLIC_STATUS,
  PRISMA_PET_STATUS,
  type PrismaPetStatusValue,
} from '@/lib/server/prisma-pet-enums'

export const PUBLIC_PRISMA_PET_STATUSES = [
  PRISMA_PET_STATUS.AVAILABLE,
  PRISMA_PET_STATUS.NEW,
  PRISMA_PET_STATUS.RESERVED,
  PRISMA_PET_STATUS.ADOPTION_IN_PROGRESS,
] as const

export const PUBLIC_PRISMA_PET_PUBLIC_STATUSES = [
  PRISMA_PET_PUBLIC_STATUS.PUBLISHED,
  PRISMA_PET_PUBLIC_STATUS.RESERVED,
] as const

const INACTIVE_PRISMA_PET_STATUSES = new Set<PrismaPetStatusValue>([
  PRISMA_PET_STATUS.ADOPTED,
  PRISMA_PET_STATUS.UNAVAILABLE,
  PRISMA_PET_STATUS.HIDDEN,
])

export const isInactivePrismaPetStatus = (status: PrismaPetStatusValue) => {
  return INACTIVE_PRISMA_PET_STATUSES.has(status)
}

export const shouldForceHiddenFromPublic = (status: PrismaPetStatusValue) => {
  return isInactivePrismaPetStatus(status)
}

export const isHiddenFromPublicStatus = (status: PrismaPetStatusValue) => {
  return isInactivePrismaPetStatus(status)
}

export const restoreStatusForPublish = (status: PrismaPetStatusValue) => {
  if (status === PRISMA_PET_STATUS.HIDDEN || status === PRISMA_PET_STATUS.UNAVAILABLE) {
    return PRISMA_PET_STATUS.AVAILABLE
  }

  return status
}

export const getPublicStatusForPetStatus = ({
  status,
  isPublished,
}: {
  status: PrismaPetStatusValue
  isPublished: boolean
}) => {
  if (!isPublished) {
    return status === PRISMA_PET_STATUS.ADOPTED
      ? PRISMA_PET_PUBLIC_STATUS.ADOPTED
      : PRISMA_PET_PUBLIC_STATUS.DRAFT
  }

  switch (status) {
    case PRISMA_PET_STATUS.RESERVED:
    case PRISMA_PET_STATUS.ADOPTION_IN_PROGRESS:
      return PRISMA_PET_PUBLIC_STATUS.RESERVED
    case PRISMA_PET_STATUS.ADOPTED:
      return PRISMA_PET_PUBLIC_STATUS.ADOPTED
    case PRISMA_PET_STATUS.UNAVAILABLE:
    case PRISMA_PET_STATUS.HIDDEN:
      return PRISMA_PET_PUBLIC_STATUS.HIDDEN
    case PRISMA_PET_STATUS.AVAILABLE:
    case PRISMA_PET_STATUS.NEW:
    default:
      return PRISMA_PET_PUBLIC_STATUS.PUBLISHED
  }
}
