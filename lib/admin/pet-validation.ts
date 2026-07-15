import { z } from 'zod'

import type {
  CreatePetInput,
  UpdatePetInput,
} from '@/lib/admin/pet-write-service'

const petStatusValues = [
  'available',
  'reserved',
  'adoption_in_progress',
  'new',
  'adopted',
  'unavailable',
  'hidden',
] as const

const requiredTrimmedString = (fieldName: string) => {
  return z.string().trim().min(1, `${fieldName} is required.`)
}

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.string().optional())

const nullableTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.string().optional().nullable())

const nonNegativeNumber = (fieldName: string) => {
  return z.number().finite(`${fieldName} must be a valid number.`).min(0, `${fieldName} cannot be negative.`)
}

const optionalNonNegativeNumber = (fieldName: string) => {
  return z.number().finite(`${fieldName} must be a valid number.`).min(0, `${fieldName} cannot be negative.`).optional()
}

const optionalIsoDateString = optionalTrimmedString.refine((value) => {
  if (!value) {
    return true
  }

  return Number.isFinite(Date.parse(value))
}, 'Enter a valid date.')

const petImageSchema = z.object({
  id: optionalTrimmedString,
  petId: optionalTrimmedString,
  url: requiredTrimmedString('Image URL'),
  thumbnailUrl: nullableTrimmedString,
  cloudinaryPublicId: nullableTrimmedString,
  alt: nullableTrimmedString,
  sortOrder: optionalNonNegativeNumber('Image sort order'),
  isPrimary: z.boolean().optional(),
  width: optionalNonNegativeNumber('Image width'),
  height: optionalNonNegativeNumber('Image height'),
  createdAt: optionalIsoDateString,
  updatedAt: optionalIsoDateString,
})

const createPetInputSchema = z.object({
  name: requiredTrimmedString('Pet name'),
  species: requiredTrimmedString('Species'),
  description: requiredTrimmedString('Description').min(10, 'Description should be at least 10 characters.'),
  age: nonNegativeNumber('Age'),
  gender: requiredTrimmedString('Gender'),
  weight: nonNegativeNumber('Weight'),
  image: requiredTrimmedString('Image'),
  imageCloudinaryPublicId: nullableTrimmedString,
  imageThumbnailUrl: nullableTrimmedString,
  imageAlt: nullableTrimmedString,
  images: z.array(petImageSchema).optional(),
  status: z.enum(petStatusValues),
  publicStatus: z.enum(petStatusValues).optional(),
  isPublished: z.boolean().optional(),
  size: optionalTrimmedString,
  neutered: z.boolean().optional(),
  goodWithChildren: z.boolean().optional(),
  goodWithOtherAnimals: z.boolean().optional(),
  applications: optionalNonNegativeNumber('Applications'),
  ageGroup: optionalTrimmedString,
  daysInShelter: optionalNonNegativeNumber('Days in shelter'),
  lastUpdated: optionalIsoDateString,
})

const updatePetInputSchema = createPetInputSchema.extend({
  petId: requiredTrimmedString('Pet ID'),
  publicationAction: z.enum(['keep', 'publish']).optional(),
})

const petIdSchema = requiredTrimmedString('Pet ID')

export const validateCreatePetInput = (input: CreatePetInput): CreatePetInput => {
  return createPetInputSchema.parse(input) as CreatePetInput
}

export const validateUpdatePetInput = (input: UpdatePetInput): UpdatePetInput => {
  return updatePetInputSchema.parse(input) as UpdatePetInput
}

export const validatePetId = (petId: string): string => {
  return petIdSchema.parse(petId)
}
