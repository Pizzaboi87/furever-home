import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config as loadEnv } from 'dotenv'

import { getDirectDatabaseEnv } from '../../../lib/server/env'

loadEnv({ path: '.env.playwright.local', quiet: true })
loadEnv({ path: '.env.local', quiet: true })
loadEnv({ path: '.env', quiet: true })

export const mutationTestPrefix = 'PW-E2E'

export type MutationTestRecords = {
  personId?: string
  petId?: string
  caseId?: string
}

export const requireMutationTestsEnabled = () => {
  if (process.env.PLAYWRIGHT_MUTATION_TESTS !== 'true') {
    throw new Error(
      'PLAYWRIGHT_MUTATION_TESTS=true is required for database-writing Playwright tests.',
    )
  }
}

const getDatabaseConnectionOptions = (databaseUrl: string) => {
  const url = new URL(databaseUrl)
  const sslMode = url.searchParams.get('sslmode')
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
  const shouldUseSsl = Boolean(sslMode) || !isLocalhost

  url.searchParams.delete('sslmode')

  return {
    connectionString: url.toString(),
    ...(shouldUseSsl
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  }
}

const createCleanupPrismaClient = () => {
  const adapter = new PrismaPg(
    getDatabaseConnectionOptions(getDirectDatabaseEnv().DIRECT_DATABASE_URL),
  )

  return new PrismaClient({ adapter })
}

export const cleanupMutationTestRecords = async ({
  caseId,
  personId,
  petId,
}: MutationTestRecords) => {
  const prisma = createCleanupPrismaClient()

  try {
    if (caseId) {
      await prisma.activityEvent.deleteMany({ where: { caseId } })
      await prisma.petStatusEvent.deleteMany({ where: { caseId } })
      await prisma.volunteerHours.deleteMany({ where: { caseId } })
      await prisma.shelterCase.deleteMany({ where: { id: caseId } })
    }

    if (petId) {
      await prisma.activityEvent.deleteMany({ where: { petId } })
      await prisma.petStatusEvent.deleteMany({ where: { petId } })
      await prisma.pet.deleteMany({ where: { id: petId } })
    }

    if (personId) {
      await prisma.activityEvent.deleteMany({ where: { personId } })
      await prisma.volunteerHours.deleteMany({ where: { personId } })
      await prisma.person.deleteMany({ where: { id: personId } })
    }
  } finally {
    await prisma.$disconnect()
  }
}
