import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import { getDirectDatabaseEnv } from '@/lib/server/env'

const getDatabaseUrlWithoutSslMode = (value: string) => {
  const url = new URL(value)
  url.searchParams.delete('sslmode')
  return url.toString()
}

export const createDirectPrismaClient = (): PrismaClient => {
  const { DIRECT_DATABASE_URL } = getDirectDatabaseEnv()
  const adapter = new PrismaPg({
    connectionString: getDatabaseUrlWithoutSslMode(DIRECT_DATABASE_URL),
    ssl: {
      rejectUnauthorized: false,
    },
    max: 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  })

  return new PrismaClient({ adapter })
}
