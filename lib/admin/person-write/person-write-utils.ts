import type {
  ContactChannel,
  Person,
  PersonProfileType,
} from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

import {
  PRISMA_CONTACT_CHANNEL,
  PRISMA_PERSON_PROFILE_TYPE,
  type PrismaContactChannelValue,
  type PrismaPersonProfileTypeValue,
} from './person-write-constants'
import type { PersonRecord } from './person-write-types'

export const requiredString = (value: string, label: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new Error(`${label} is required.`)
  }

  return trimmedValue
}

export const cleanOptionalString = (value: string | null | undefined) => {
  const trimmed = value?.trim()

  return trimmed || null
}

export const cleanStringList = (values: string[] | null | undefined) => {
  return Array.from(
    new Set(
      (values ?? [])
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  )
}

export const cleanTagList = (values: string[] | null | undefined) => {
  return Array.from(
    new Set(
      (values ?? [])
        .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, '_'))
        .filter(Boolean),
    ),
  )
}

export const toPrismaContactChannel = (
  value: ContactChannel | string | null | undefined,
  fallback: PrismaContactChannelValue | null,
): PrismaContactChannelValue | null => {
  switch (normalizeValue(value)) {
    case 'website_form':
      return PRISMA_CONTACT_CHANNEL.WEBSITE_FORM
    case 'phone':
      return PRISMA_CONTACT_CHANNEL.PHONE
    case 'walk_in':
      return PRISMA_CONTACT_CHANNEL.WALK_IN
    case 'shelter_event':
      return PRISMA_CONTACT_CHANNEL.SHELTER_EVENT
    case 'admin_created':
      return PRISMA_CONTACT_CHANNEL.ADMIN_CREATED
    case 'internal':
      return PRISMA_CONTACT_CHANNEL.INTERNAL
    case 'email':
      return PRISMA_CONTACT_CHANNEL.EMAIL
    default:
      return fallback
  }
}

export const toPrismaPersonProfileType = (
  value: PersonProfileType | string | null | undefined,
  fallback: PrismaPersonProfileTypeValue | null,
): PrismaPersonProfileTypeValue | null => {
  switch (normalizeValue(value)) {
    case 'adopter':
      return PRISMA_PERSON_PROFILE_TYPE.ADOPTER
    case 'foster':
      return PRISMA_PERSON_PROFILE_TYPE.FOSTER
    case 'volunteer':
      return PRISMA_PERSON_PROFILE_TYPE.VOLUNTEER
    case 'donor':
      return PRISMA_PERSON_PROFILE_TYPE.DONOR
    case 'supporter':
      return PRISMA_PERSON_PROFILE_TYPE.SUPPORTER
    case 'general_contact':
      return PRISMA_PERSON_PROFILE_TYPE.GENERAL_CONTACT
    default:
      return fallback
  }
}

export const inferProfileType = (
  tags: string[],
): PrismaPersonProfileTypeValue => {
  const normalizedTags = tags.map(normalizeValue)

  if (normalizedTags.some((tag) => tag.includes('volunteer'))) {
    return PRISMA_PERSON_PROFILE_TYPE.VOLUNTEER
  }

  if (normalizedTags.some((tag) => tag.includes('donor'))) {
    return PRISMA_PERSON_PROFILE_TYPE.DONOR
  }

  if (normalizedTags.some((tag) => tag.includes('foster'))) {
    return PRISMA_PERSON_PROFILE_TYPE.FOSTER
  }

  if (normalizedTags.some((tag) => tag.includes('partner') || tag.includes('support'))) {
    return PRISMA_PERSON_PROFILE_TYPE.SUPPORTER
  }

  if (normalizedTags.some((tag) => tag.includes('adopter') || tag.includes('applicant'))) {
    return PRISMA_PERSON_PROFILE_TYPE.ADOPTER
  }

  return PRISMA_PERSON_PROFILE_TYPE.GENERAL_CONTACT
}

export const parseAddress = (value: string | null | undefined) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return {
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    }
  }

  const parts = trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) {
    return {
      addressLine1: trimmed,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    }
  }

  return {
    addressLine1: parts[0] ?? null,
    addressLine2: null,
    city: parts[1] ?? null,
    state: parts[2] ?? null,
    zip: parts[3] ?? null,
    country: parts.slice(4).join(', ') || null,
  }
}

const formatAddress = ({
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  country,
}: Pick<
  PersonRecord,
  'addressLine1' | 'addressLine2' | 'city' | 'state' | 'zip' | 'country'
>) => {
  return [addressLine1, addressLine2, city, state, zip, country]
    .filter(Boolean)
    .join(', ') || undefined
}

export const mapPrismaPersonToDomainPerson = (person: PersonRecord): Person => {
  return {
    id: person.id,
    name: person.name,
    email: person.email ?? undefined,
    phone: person.phone ?? undefined,
    address: formatAddress(person),
    preferredContactMethod: normalizeValue(
      person.preferredContactMethod,
    ) as Person['preferredContactMethod'],
    profileType: normalizeValue(person.profileType) as Person['profileType'],
    householdType: person.householdType ?? undefined,
    hasOtherPets: person.hasOtherPets ?? undefined,
    interestAreas: person.interestAreas,
    tags: person.tags,
    createdAt: person.createdAt.toISOString(),
    updatedAt: person.updatedAt.toISOString(),
  }
}
