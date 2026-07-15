import type {
  ActivityEvent as PrismaActivityEventRow,
  PetStatusEvent as PrismaPetStatusEventRow,
} from '@prisma/client'
import { getPrismaClient } from '@/lib/server/prisma'
import { prismaAdminPetInclude, type PrismaAdminPetRow } from './pet-types'

export const getPrismaAdminPetRows = async ({
  onlyPublished = true,
}: {
  onlyPublished?: boolean
} = {}): Promise<PrismaAdminPetRow[]> => {
  const prisma = getPrismaClient()

  return prisma.pet.findMany({
    where: onlyPublished
      ? {
          isPublished: true,
        }
      : undefined,
    include: prismaAdminPetInclude,
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
  })
}

export const getPrismaAdminPetRowById = async (
  id: string,
): Promise<PrismaAdminPetRow | null> => {
  const prisma = getPrismaClient()

  return prisma.pet.findFirst({
    where: {
      OR: [{ id }, { publicSlug: id }],
    },
    include: prismaAdminPetInclude,
  })
}

export const getRelatedCaseCountByPetIdFromPrisma = async () => {
  const prisma = getPrismaClient()
  const groupedCases = await prisma.shelterCase.groupBy({
    by: ['petId'],
    where: {
      petId: {
        not: null,
      },
    },
    _count: {
      _all: true,
    },
  })

  const counts = new Map<string, number>()

  for (const item of groupedCases) {
    if (item.petId) {
      counts.set(item.petId, item._count._all)
    }
  }

  return counts
}

export const getPrismaPetStatusEventRows = async (
  petId: string,
): Promise<PrismaPetStatusEventRow[]> => {
  const prisma = getPrismaClient()

  return prisma.petStatusEvent.findMany({
    where: {
      petId,
    },
    orderBy: [{ createdAt: 'desc' }, { date: 'desc' }],
  })
}

export const getPrismaPetActivityEventRows = async (
  petId: string,
): Promise<PrismaActivityEventRow[]> => {
  const prisma = getPrismaClient()

  return prisma.activityEvent.findMany({
    where: {
      petId,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  })
}
