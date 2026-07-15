import type { AdminPet, PetStatus } from '@/lib/admin/domain'

export type CreatePetInput = {
  name: string
  species: string
  description: string
  age: number
  gender: string
  weight: number
  image: string
  imageCloudinaryPublicId?: string | null
  imageThumbnailUrl?: string | null
  imageAlt?: string | null
  images?: AdminPet['images']
  status: PetStatus
  publicStatus?: PetStatus
  isPublished?: boolean
  size?: string
  neutered?: boolean
  goodWithChildren?: boolean
  goodWithOtherAnimals?: boolean
  applications?: number
  ageGroup?: string
  daysInShelter?: number
  lastUpdated?: string
}

export type UpdatePetInput = CreatePetInput & {
  petId: string
  publicationAction?: 'keep' | 'publish'
}

export type DeletePetResult = {
  deletedPetId: string
}

export type RelatedRecordCounts = {
  cases: number
  adoptionApplications: number
  virtualAdoptions: number
  statusEvents: number
  activityEvents: number
}

export type ExistingPetImage = {
  id: string
  cloudinaryPublicId: string
  isPrimary: boolean
}
