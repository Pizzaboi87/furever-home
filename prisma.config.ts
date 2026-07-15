import 'dotenv/config'
import { defineConfig } from 'prisma/config'

import { getOptionalShadowDatabaseEnv } from './lib/server/env'

const fallbackDatabaseUrl =
  'postgresql://furever_home:password@localhost:5432/furever_home?schema=public'

const directDatabaseUrl =
  process.env.DIRECT_DATABASE_URL ??
  (process.env.DATABASE_URL?.startsWith('postgres')
    ? process.env.DATABASE_URL
    : fallbackDatabaseUrl)

const shadowDatabaseEnv = getOptionalShadowDatabaseEnv()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: directDatabaseUrl,
    shadowDatabaseUrl: shadowDatabaseEnv.SHADOW_DATABASE_URL,
  },
})
