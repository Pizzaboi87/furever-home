import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

import { getDatabaseEnv } from '@/lib/server/env'

const globalForPrisma = globalThis as unknown as {
  prismaClient?: PrismaClient
}

const createPrismaClient = (): PrismaClient => {
  const { DATABASE_URL } = getDatabaseEnv()
  const acceleratedClient = new PrismaClient({
    accelerateUrl: DATABASE_URL,
  }).$extends(withAccelerate())

  // The application uses the standard Prisma Client API and does not expose
  // Accelerate-specific cache arguments. Keeping the public client type as
  // PrismaClient preserves existing repository and transaction types while
  // queries are still routed through Accelerate at runtime.
  return acceleratedClient as unknown as PrismaClient
}

export const getPrismaClient = (): PrismaClient => {
  if (!globalForPrisma.prismaClient) {
    globalForPrisma.prismaClient = createPrismaClient()
  }

  return globalForPrisma.prismaClient
}
