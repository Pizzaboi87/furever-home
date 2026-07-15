import type { Prisma } from '@prisma/client'

export type PrismaAdminPetImageRow = {
  id: string
  petId: string
  secureUrl: string
  thumbnailUrl: string | null
  cloudinaryPublicId: string
  alt: string | null
  sortOrder: number
  isPrimary: boolean
  width: number | null
  height: number | null
  createdAt: Date
  updatedAt: Date
}

export const prismaAdminPetInclude = {
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  },
  _count: {
    select: {
      cases: true,
      adoptionApplications: true,
    },
  },
} as const satisfies Prisma.PetInclude

export type PrismaAdminPetRow = Prisma.PetGetPayload<{
  include: typeof prismaAdminPetInclude
}>
