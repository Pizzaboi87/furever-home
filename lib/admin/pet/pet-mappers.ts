import type { ActivityEvent, AdminPet, PetStatus } from '@/lib/admin/domain'
import type { PrismaAdminPetImageRow, PrismaAdminPetRow } from './pet-types'

export const formatPrismaEnumValue = (value: string) => value.toLowerCase()

const getPrimaryPrismaPetImage = (images: PrismaAdminPetImageRow[]) => {
  return images.find((image: PrismaAdminPetImageRow) => image.isPrimary) ?? images[0]
}

const mapPrismaPetImageToDomain = (
  image: PrismaAdminPetImageRow,
): NonNullable<AdminPet['images']>[number] => ({
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
})

export const mapPrismaPetToAdminPet = (
  pet: PrismaAdminPetRow,
  relatedCaseCountByPetId: Map<string, number>,
): AdminPet => {
  const primaryImage = getPrimaryPrismaPetImage(pet.images)
  const images = pet.images.map(mapPrismaPetImageToDomain)
  const relatedCaseCount = relatedCaseCountByPetId.get(pet.id) ?? 0
  const prismaApplicationCount = Math.max(
    pet._count.cases,
    pet._count.adoptionApplications,
  )

  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    description: pet.description,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    image: primaryImage?.secureUrl ?? '/images/assets/pet-placeholder.png',
    imageCloudinaryPublicId: primaryImage?.cloudinaryPublicId ?? null,
    imageAlt: primaryImage?.alt ?? `${pet.name} the ${pet.species}`,
    images,
    status: formatPrismaEnumValue(pet.status),
    publicStatus: formatPrismaEnumValue(pet.publicStatus),
    isPublished: pet.isPublished,
    publishedAt: pet.publishedAt?.toISOString(),
    hiddenAt: pet.hiddenAt?.toISOString(),
    size: pet.size ?? undefined,
    neutered: pet.neutered ?? undefined,
    goodWithChildren: pet.goodWithChildren ?? undefined,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? undefined,
    applications: Math.max(relatedCaseCount, prismaApplicationCount),
    ageGroup: pet.ageGroup ?? undefined,
    daysInShelter: pet.daysInShelter ?? undefined,
    createdAt: pet.createdAt.toISOString(),
    lastUpdated: pet.updatedAt.toISOString(),
  }
}

export const mapPrismaActivityEventToDomain = (event: {
  id: string
  type: string
  title: string
  detail: string
  createdAt: Date
  petId: string | null
  caseId: string | null
  personId: string | null
  actorId: string | null
  actorName: string | null
  actorRole: string | null
}): ActivityEvent => ({
  id: event.id,
  type: event.type,
  title: event.title,
  detail: event.detail,
  createdAt: event.createdAt.toISOString(),
  petId: event.petId ?? undefined,
  caseId: event.caseId ?? undefined,
  personId: event.personId ?? undefined,
  actorId: event.actorId,
  actorName: event.actorName,
  actorRole: event.actorRole,
})

export const mapPetStatusValue = (value: string): PetStatus => {
  return formatPrismaEnumValue(value) as PetStatus
}
