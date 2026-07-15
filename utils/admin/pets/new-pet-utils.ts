import type { PetStatus } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

import type { NewPetDraft } from '@/components/admin/pets/new/new-pet-types'

export const fallbackPetImage = '/images/assets/pet-placeholder.png'
export const newPetDraftStorageKey = 'furever-home:new-pet-draft'

export const getUniquePetValues = (values: string[]) => [
  ...new Set(values.map((value) => normalizeValue(value)).filter(Boolean)),
]

export const buildNewPetInput = (
  draft: NewPetDraft,
  statusOverride?: PetStatus,
  isPublished = true,
) => ({
  name: draft.name.trim(),
  species: draft.species,
  description: draft.description.trim(),
  age: Number(draft.age) || 0,
  gender: draft.gender,
  weight: Number(draft.weight) || 0,
  image: draft.image.trim() || fallbackPetImage,
  imageCloudinaryPublicId: draft.imageCloudinaryPublicId || undefined,
  imageThumbnailUrl: draft.imageThumbnailUrl || undefined,
  imageAlt: draft.name.trim()
    ? `${draft.name.trim()} the ${draft.species}`
    : undefined,
  status: statusOverride ?? draft.status,
  isPublished,
  size: draft.size,
  neutered: draft.neutered,
  goodWithChildren: draft.goodWithChildren,
  goodWithOtherAnimals: draft.goodWithOtherAnimals,
  applications: 0,
  ageGroup: draft.ageGroup,
  daysInShelter: Number(draft.daysInShelter) || 0,
  lastUpdated: draft.lastUpdated
    ? new Date(draft.lastUpdated).toISOString()
    : new Date().toISOString(),
})
