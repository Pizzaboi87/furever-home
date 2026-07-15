import { z } from 'zod'

import type {
  AnonymizePersonInput,
  CreatePersonInput,
  UpdatePersonInput,
} from '@/lib/admin/person-write-service'

const contactChannelValues = [
  'website_form',
  'email',
  'phone',
  'walk_in',
  'shelter_event',
  'admin_created',
  'internal',
  'in_person',
] as const

const personProfileTypeValues = [
  'adopter',
  'foster',
  'volunteer',
  'donor',
  'supporter',
  'general_contact',
] as const

const requiredTrimmedString = (fieldName: string) => {
  return z.string().trim().min(1, `${fieldName} is required.`)
}

const nullableTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.string().optional().nullable())

const optionalEmail = nullableTrimmedString.refine((value) => {
  if (!value) {
    return true
  }

  return z.email().safeParse(value).success
}, 'Enter a valid email address.')

const stringListSchema = z.preprocess((value) => {
  if (!Array.isArray(value)) {
    return value
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}, z.array(z.string()).optional().nullable())

const contactChannelSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.enum(contactChannelValues).optional().nullable())

const profileTypeSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.enum(personProfileTypeValues).optional().nullable())

const createPersonInputSchema = z.object({
  name: requiredTrimmedString('Contact name').min(
    2,
    'Contact name should be at least 2 characters.',
  ),
  email: optionalEmail,
  phone: nullableTrimmedString,
  address: nullableTrimmedString,
  preferredContactMethod: contactChannelSchema,
  tags: stringListSchema,
})

const updatePersonInputSchema = createPersonInputSchema.extend({
  personId: requiredTrimmedString('Person ID'),
  profileType: profileTypeSchema,
  householdType: nullableTrimmedString,
  hasOtherPets: z.boolean().optional().nullable(),
  interestAreas: stringListSchema,
})

const anonymizePersonInputSchema = z.object({
  personId: requiredTrimmedString('Person ID'),
  confirmationName: requiredTrimmedString('Confirmation name'),
})

export const validateCreatePersonInput = (
  input: CreatePersonInput,
): CreatePersonInput => {
  return createPersonInputSchema.parse(input) as CreatePersonInput
}

export const validateUpdatePersonInput = (
  input: UpdatePersonInput,
): UpdatePersonInput => {
  return updatePersonInputSchema.parse(input) as UpdatePersonInput
}

export const validateAnonymizePersonInput = (
  input: AnonymizePersonInput,
): AnonymizePersonInput => {
  return anonymizePersonInputSchema.parse(input) as AnonymizePersonInput
}
