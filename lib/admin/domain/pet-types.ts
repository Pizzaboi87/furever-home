import type { Id } from './common-types'

export type PetStatus =
  | 'available'
  | 'reserved'
  | 'adoption_in_progress'
  | 'new'
  | 'adopted'
  | 'unavailable'
  | 'hidden'
  | string

export type PetImage = {
  id?: Id
  petId?: Id
  url: string
  thumbnailUrl?: string | null
  cloudinaryPublicId?: string | null
  alt?: string | null
  sortOrder?: number
  isPrimary?: boolean
  width?: number
  height?: number
  createdAt?: string
  updatedAt?: string
}

export type AdminPet = {
  id: Id
  name: string
  species: string
  description: string
  age: number
  gender: string
  weight: number
  image: string
  imageCloudinaryPublicId?: string | null
  imageAlt?: string | null
  images?: PetImage[]
  status: PetStatus
  publicStatus?: PetStatus
  isPublished?: boolean
  publishedAt?: string
  hiddenAt?: string
  size?: string
  neutered?: boolean
  goodWithChildren?: boolean
  goodWithOtherAnimals?: boolean
  applications?: number
  ageGroup?: string
  daysInShelter?: number
  createdAt?: string
  lastUpdated?: string
}

export type PetStatusEvent = {
  id: Id
  petId: Id | number
  fromStatus?: PetStatus
  toStatus: PetStatus
  date: string
  createdAt?: string
  caseId?: Id
}

export type AdminPetActivityItem = {
  id: Id
  kind: 'activity' | 'status'
  type: string
  title: string
  detail: string
  createdAt: string
  statusFrom?: PetStatus | null
  statusTo?: PetStatus
}
