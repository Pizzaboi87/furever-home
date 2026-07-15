import type {
  AdminCaseApplicant,
  AdminPet,
  Person,
  PersonAddress,
} from '@/lib/admin/domain'

import type { PrismaAdminCaseDetailRow } from '../case-repository'
import { toDomainEnumValue, toIsoString } from '../case-utils'
import type {
  PrismaCaseDetailImage,
  PrismaCaseDetailPerson,
  PrismaCaseDetailPet,
} from './case-detail-mapper-types'

const mapPersonAddress = (
  person: PrismaCaseDetailPerson,
): PersonAddress | undefined => {
  const address = {
    line1: person.addressLine1 ?? undefined,
    line2: person.addressLine2 ?? undefined,
    city: person.city ?? undefined,
    state: person.state ?? undefined,
    zip: person.zip ?? undefined,
    country: person.country ?? undefined,
  }

  return Object.values(address).some(Boolean) ? address : undefined
}

const mapPerson = (person: PrismaCaseDetailPerson): Person => {
  return {
    id: person.id,
    name: person.name,
    email: person.email ?? undefined,
    phone: person.phone ?? undefined,
    address: mapPersonAddress(person),
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

export const mapCasePet = (pet: PrismaCaseDetailPet): AdminPet => {
  const primaryImage = pet.images[0]

  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    description: pet.description,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    image: primaryImage?.secureUrl ?? '/placeholder-user.jpg',
    imageCloudinaryPublicId: primaryImage?.cloudinaryPublicId ?? null,
    imageAlt: primaryImage?.alt ?? `${pet.name} the ${pet.species}`,
    images: pet.images.map((image: PrismaCaseDetailImage) => ({
      id: image.id,
      petId: image.petId,
      url: image.secureUrl,
      thumbnailUrl: image.thumbnailUrl,
      cloudinaryPublicId: image.cloudinaryPublicId,
      alt: image.alt,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    })),
    status: toDomainEnumValue(pet.status) ?? 'available',
    publicStatus: toDomainEnumValue(pet.publicStatus),
    isPublished: pet.isPublished,
    publishedAt: pet.publishedAt?.toISOString(),
    hiddenAt: pet.hiddenAt?.toISOString(),
    size: pet.size ?? undefined,
    neutered: pet.neutered ?? undefined,
    goodWithChildren: pet.goodWithChildren ?? undefined,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? undefined,
    applications: Math.max(pet._count.cases, pet._count.adoptionApplications),
    ageGroup: pet.ageGroup ?? undefined,
    daysInShelter: pet.daysInShelter ?? undefined,
    createdAt: pet.createdAt.toISOString(),
    lastUpdated: pet.updatedAt.toISOString(),
  }
}

export const mapCaseApplicant = (
  shelterCase: PrismaAdminCaseDetailRow,
): AdminCaseApplicant => {
  const person = mapPerson(shelterCase.person)
  const adoptionApplication = shelterCase.adoptionApplication

  return {
    id: person.id,
    name: person.name,
    email: person.email,
    phone: person.phone,
    address: person.address,
    channel:
      toDomainEnumValue(shelterCase.interactions[0]?.channel) ??
      toDomainEnumValue(shelterCase.source),
    householdType: person.householdType ?? adoptionApplication?.householdType ?? undefined,
    hasOtherPets: person.hasOtherPets ?? adoptionApplication?.hasOtherPets ?? undefined,
    score: adoptionApplication?.score ?? undefined,
  }
}
