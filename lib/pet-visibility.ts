import { normalizeValue } from '@/lib/pet-format'
import type { AdminPet, PetImage, PetStatus } from '@/lib/admin/domain'

export const PUBLIC_PET_VISIBLE_STATUSES = new Set([
  'available',
  'new',
  'reserved',
  'adoption_in_progress',
])

export const PUBLIC_PET_ADOPTABLE_STATUSES = new Set(['available', 'new'])

export const getPetPublicStatus = (pet: Pick<AdminPet, 'status' | 'publicStatus'>) => {
  return normalizeValue(pet.publicStatus ?? pet.status) as PetStatus
}

export const isPublicPetStatus = (status: PetStatus | string | null | undefined) => {
  return PUBLIC_PET_VISIBLE_STATUSES.has(normalizeValue(status))
}

export const isPublicPetAdoptable = (pet: Pick<AdminPet, 'status' | 'publicStatus'>) => {
  return PUBLIC_PET_ADOPTABLE_STATUSES.has(getPetPublicStatus(pet))
}

export const getPrimaryPetImage = (
  pet: Pick<AdminPet, 'images'>,
): PetImage | undefined => {
  return pet.images
    ?.slice()
    .sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) {
        return -1
      }

      if (!a.isPrimary && b.isPrimary) {
        return 1
      }

      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    })[0]
}

export const getPetPublicImageUrl = (pet: Pick<AdminPet, 'image' | 'images'>) => {
  return getPrimaryPetImage(pet)?.url ?? pet.image
}

export const normalizePetForPublicDisplay = (pet: AdminPet): AdminPet => {
  return {
    ...pet,
    image: getPetPublicImageUrl(pet),
  }
}

export const getPublicPetStatusBadgeLabel = (
  status: PetStatus | string | null | undefined,
) => {
  switch (normalizeValue(status)) {
    case 'new':
      return 'Just arrived'
    case 'reserved':
    case 'adoption_in_progress':
      return 'Adoption in progress'
    default:
      return ''
  }
}

export const shouldShowPublicPetStatusBadge = (
  status: PetStatus | string | null | undefined,
) => {
  return Boolean(getPublicPetStatusBadgeLabel(status))
}

export const getPublicPetStatusBadgeClassName = (
  status: PetStatus | string | null | undefined,
) => {
  switch (normalizeValue(status)) {
    case 'new':
      return 'border-primary/20 bg-secondary/95 text-primary'
    case 'reserved':
    case 'adoption_in_progress':
      return 'border-accent/30 bg-primary/95 text-primary-foreground'
    default:
      return ''
  }
}
