
import type { Prisma } from '@prisma/client'
import { normalizeValue } from '@/lib/pet-format'
import { getPrismaClient } from '@/lib/server/prisma'
import {
  PUBLIC_PRISMA_PET_PUBLIC_STATUSES,
  PUBLIC_PRISMA_PET_STATUSES,
} from '@/lib/pet-publication-policy'
import { normalizePetForPublicDisplay } from '@/lib/pet-visibility'

import type { AdminPet, PetImage } from '@/lib/admin/domain'

const formatEnumValue = (value: string) => {
  return value.toLowerCase()
}

const prismaPublicPetInclude = {
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  },
} as const satisfies Prisma.PetInclude

type PrismaPublicPet = Prisma.PetGetPayload<{ include: typeof prismaPublicPetInclude }>

const getPublicPetRows = async (): Promise<PrismaPublicPet[]> => {
  const prisma = getPrismaClient()

  return prisma.pet.findMany({
    where: {
      isPublished: true,
      status: {
        in: [...PUBLIC_PRISMA_PET_STATUSES],
      },
      publicStatus: {
        in: [...PUBLIC_PRISMA_PET_PUBLIC_STATUSES],
      },
    },
    include: prismaPublicPetInclude,
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
  })
}

const getPrimaryImage = (images: PrismaPublicPet['images']) => {
  return (
    images.find((image: PrismaPublicPet['images'][number]) => image.isPrimary) ?? images[0]
  )
}

const mapPrismaPetImageToDomain = (image: PrismaPublicPet['images'][number]): PetImage => {
  return {
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
  }
}

const mapPrismaPetToDomain = (pet: PrismaPublicPet): AdminPet => {
  const primaryImage = getPrimaryImage(pet.images)
  const images = pet.images.map(mapPrismaPetImageToDomain)
  const status = formatEnumValue(pet.status)

  return normalizePetForPublicDisplay({
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
    images,
    status,
    publicStatus: status,
    isPublished: pet.isPublished,
    publishedAt: pet.publishedAt?.toISOString(),
    hiddenAt: pet.hiddenAt?.toISOString(),
    size: pet.size ?? undefined,
    neutered: pet.neutered ?? undefined,
    goodWithChildren: pet.goodWithChildren ?? undefined,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? undefined,
    ageGroup: pet.ageGroup ?? undefined,
    daysInShelter: pet.daysInShelter ?? undefined,
    lastUpdated: pet.updatedAt.toISOString(),
  })
}

export const getPublicPets = async (): Promise<AdminPet[]> => {
  const pets = await getPublicPetRows()

  return pets.map(mapPrismaPetToDomain)
}

export const getPublicPetById = async (id: string): Promise<AdminPet | undefined> => {
  const prisma = getPrismaClient()

  const pet = await prisma.pet.findFirst({
    where: {
      OR: [{ id }, { publicSlug: id }],
      isPublished: true,
      status: {
        in: [...PUBLIC_PRISMA_PET_STATUSES],
      },
      publicStatus: {
        in: [...PUBLIC_PRISMA_PET_PUBLIC_STATUSES],
      },
    },
    include: prismaPublicPetInclude,
  })

  return pet ? mapPrismaPetToDomain(pet) : undefined
}

export const getRelatedPublicPets = async (
  pet: AdminPet,
  limit = 3,
): Promise<AdminPet[]> => {
  const prisma = getPrismaClient()
  const species = normalizeValue(pet.species)

  const relatedPets = await prisma.pet.findMany({
    where: {
      id: {
        not: pet.id,
      },
      species: {
        equals: species,
        mode: 'insensitive',
      },
      isPublished: true,
      status: {
        in: [...PUBLIC_PRISMA_PET_STATUSES],
      },
      publicStatus: {
        in: [...PUBLIC_PRISMA_PET_PUBLIC_STATUSES],
      },
    },
    include: prismaPublicPetInclude,
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit,
  })

  return relatedPets.map((relatedPet: PrismaPublicPet) =>
    mapPrismaPetToDomain(relatedPet),
  )
}
