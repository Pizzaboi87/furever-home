import type { Person } from '../domain'
import type { AdminPersonStats, PrismaPersonRecord } from './person-types'

export const openCaseStatuses = new Set([
  'new',
  'open',
  'waiting_on_contact',
  'waiting_on_staff',
  'screening',
  'scheduled',
  'waiting_reply',
  'in_review',
])

export const uniqueById = <T extends { id: string }>(items: T[]) => {
  return [...new Map(items.map((item) => [item.id, item])).values()]
}

export const getLatestTimestamp = (
  values: Array<string | undefined | null>,
): string | undefined => {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a))[0]
}

const toDomainEnumValue = (value: string | null | undefined) => {
  return value?.toLowerCase() as string | undefined
}

const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) {
    return new Date().toISOString()
  }

  return value instanceof Date ? value.toISOString() : value
}

export const isAnonymizedPersonRecord = (
  person: Pick<
    PrismaPersonRecord,
    | 'name'
    | 'email'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'state'
    | 'zip'
    | 'country'
  >,
) => {
  return person.name === 'Deleted contact'
    && !person.email
    && !person.phone
    && !person.addressLine1
    && !person.addressLine2
    && !person.city
    && !person.state
    && !person.zip
    && !person.country
}

export const mapPrismaPersonToDomainPerson = (person: PrismaPersonRecord): Person => {
  const addressParts = [
    person.addressLine1,
    person.addressLine2,
    person.city,
    person.state,
    person.zip,
    person.country,
  ].filter(Boolean)

  return {
    id: person.id,
    name: person.name,
    email: person.email ?? undefined,
    phone: person.phone ?? undefined,
    address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
    preferredContactMethod: toDomainEnumValue(person.preferredContactMethod) as Person['preferredContactMethod'],
    profileType: toDomainEnumValue(person.profileType) as Person['profileType'],
    householdType: person.householdType ?? undefined,
    hasOtherPets: person.hasOtherPets ?? undefined,
    interestAreas: person.interestAreas,
    tags: person.tags,
    createdAt: toIsoString(person.createdAt),
    updatedAt: toIsoString(person.updatedAt),
  }
}

export const createEmptyPersonStats = (): AdminPersonStats => ({
  totalCases: 0,
  openCases: 0,
  totalInteractions: 0,
  internalNotes: 0,
  relatedPets: 0,
})
