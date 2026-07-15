import type { Prisma } from '@prisma/client'

import { getPrismaClient } from '@/lib/server/prisma'

export const prismaAdminCaseInclude = {
  person: true,
  pet: true,
  assignedStaff: true,
  adoptionApplication: true,
  donationInquiry: true,
  virtualAdoption: true,
  volunteerApplication: true,
  interactions: { orderBy: { loggedAt: 'desc' } },
  notes: { orderBy: { createdAt: 'desc' } },
  events: { orderBy: { createdAt: 'desc' } },
  activityEvents: { orderBy: { createdAt: 'desc' } },
} as const satisfies Prisma.ShelterCaseInclude

export type PrismaAdminCaseRow = Prisma.ShelterCaseGetPayload<{
  include: typeof prismaAdminCaseInclude
}>

export const prismaAdminCaseDetailInclude = {
  person: true,
  pet: {
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      _count: {
        select: {
          cases: true,
          adoptionApplications: true,
        },
      },
    },
  },
  assignedStaff: true,
  adoptionApplication: true,
  donationInquiry: true,
  virtualAdoption: true,
  volunteerApplication: true,
  interactions: {
    include: { loggedByStaff: true },
    orderBy: { loggedAt: 'desc' },
  },
  notes: {
    include: { staff: true },
    orderBy: { createdAt: 'desc' },
  },
  events: { orderBy: { createdAt: 'desc' } },
  activityEvents: { orderBy: { createdAt: 'desc' } },
} as const satisfies Prisma.ShelterCaseInclude

export type PrismaAdminCaseDetailRow = Prisma.ShelterCaseGetPayload<{
  include: typeof prismaAdminCaseDetailInclude
}>

export const getPrismaAdminCaseRows = async (): Promise<PrismaAdminCaseRow[]> => {
  const prisma = getPrismaClient()

  return prisma.shelterCase.findMany({
    include: prismaAdminCaseInclude,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  })
}

export const getPrismaAdminPersonCaseDetailRows = async (
  personId: string,
): Promise<PrismaAdminCaseDetailRow[]> => {
  const prisma = getPrismaClient()

  return prisma.shelterCase.findMany({
    where: { personId },
    include: prismaAdminCaseDetailInclude,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  })
}

export const getPrismaAdminCaseDetailRow = async (
  caseId: string,
): Promise<PrismaAdminCaseDetailRow | null> => {
  const prisma = getPrismaClient()

  return prisma.shelterCase.findUnique({
    where: { id: caseId },
    include: prismaAdminCaseDetailInclude,
  })
}
