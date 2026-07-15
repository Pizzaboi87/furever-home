import { z } from 'zod'

const nonEmptyString = (name: string) => {
  return z
    .string({ error: `${name} is required.` })
    .trim()
    .min(1, `${name} is required.`)
}

const optionalNonEmptyString = z
  .string()
  .trim()
  .min(1)
  .optional()

const urlString = (name: string) => {
  return nonEmptyString(name).url(`${name} must be a valid URL.`)
}

const optionalUrlString = (name: string) => {
  return z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim().length === 0
        ? undefined
        : value,
    z.string().trim().url(`${name} must be a valid URL.`).optional(),
  )
}

const postgresUrlString = (name: string) => {
  return nonEmptyString(name).refine(
    (value) => value.startsWith('postgresql://') || value.startsWith('postgres://'),
    `${name} must be a PostgreSQL connection string.`,
  )
}

const prismaRuntimeUrlString = (name: string) => {
  return nonEmptyString(name).refine(
    (value) =>
      value.startsWith('prisma://') ||
      value.startsWith('prisma+postgres://'),
    `${name} must be a Prisma Accelerate connection string.`,
  )
}

const emailFromString = (name: string) => {
  return nonEmptyString(name).refine(
    (value) => /^[^<>\s]+@[^<>\s]+\.[^<>\s]+$/.test(value) || /^.+\s<[^<>\s]+@[^<>\s]+\.[^<>\s]+>$/.test(value),
    `${name} must be an email address or a display-name email value.`,
  )
}

const formatEnvError = (schemaName: string, error: z.ZodError) => {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.join('.') || 'environment'

      return `- ${path}: ${issue.message}`
    })
    .join('\n')

  return `${schemaName} environment validation failed:\n${details}`
}

const parseEnv = <TOutput>(schemaName: string, schema: z.ZodType<TOutput>, values: unknown): TOutput => {
  const result = schema.safeParse(values)

  if (!result.success) {
    throw new Error(formatEnvError(schemaName, result.error))
  }

  return result.data
}

const appBaseUrlSchema = z.object({
  APP_BASE_URL: urlString('APP_BASE_URL').optional(),
  NEXT_PUBLIC_APP_URL: urlString('NEXT_PUBLIC_APP_URL').optional(),
  VERCEL_URL: optionalNonEmptyString,
})

const databaseEnvSchema = z.object({
  DATABASE_URL: prismaRuntimeUrlString('DATABASE_URL'),
})

const directDatabaseEnvSchema = z.object({
  DIRECT_DATABASE_URL: postgresUrlString('DIRECT_DATABASE_URL'),
})

const optionalShadowDatabaseEnvSchema = z.object({
  SHADOW_DATABASE_URL: postgresUrlString('SHADOW_DATABASE_URL').optional(),
})

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: nonEmptyString('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: nonEmptyString('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: nonEmptyString('CLOUDINARY_API_SECRET'),
})

const resendEnvSchema = z.object({
  RESEND_API_KEY: nonEmptyString('RESEND_API_KEY'),
  RESEND_FROM_EMAIL: emailFromString('RESEND_FROM_EMAIL'),
  RESEND_TO_EMAIL: z.string().trim().email('RESEND_TO_EMAIL must be a valid email address.'),
  RESEND_LOGO_URL: optionalUrlString('RESEND_LOGO_URL'),
})

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: nonEmptyString('STRIPE_SECRET_KEY').refine(
    (value) => value.startsWith('sk_'),
    'STRIPE_SECRET_KEY must start with sk_.',
  ),
})

const auth0EnvSchema = z.object({
  AUTH0_DOMAIN: nonEmptyString('AUTH0_DOMAIN'),
  AUTH0_CLIENT_ID: nonEmptyString('AUTH0_CLIENT_ID'),
  AUTH0_CLIENT_SECRET: nonEmptyString('AUTH0_CLIENT_SECRET'),
  AUTH0_SECRET: nonEmptyString('AUTH0_SECRET'),
  APP_BASE_URL: urlString('APP_BASE_URL'),
})

const cronEnvSchema = z.object({
  CRON_SECRET: nonEmptyString('CRON_SECRET').min(
    32,
    'CRON_SECRET must contain at least 32 characters.',
  ),
})

export type CloudinaryServerEnv = z.infer<typeof cloudinaryEnvSchema>
export type ResendServerEnv = z.infer<typeof resendEnvSchema>

export const getDatabaseEnv = () => {
  return parseEnv('Database', databaseEnvSchema, process.env)
}

export const getDirectDatabaseEnv = () => {
  return parseEnv('Direct database', directDatabaseEnvSchema, process.env)
}

export const getOptionalShadowDatabaseEnv = () => {
  return parseEnv('Shadow database', optionalShadowDatabaseEnvSchema, process.env)
}

export const getCloudinaryEnv = () => {
  return parseEnv('Cloudinary', cloudinaryEnvSchema, process.env)
}

export const getOptionalCloudinaryEnv = () => {
  const result = cloudinaryEnvSchema.safeParse(process.env)

  return result.success ? result.data : null
}

export const getResendEnv = () => {
  return parseEnv('Resend', resendEnvSchema, process.env)
}

export const getStripeEnv = () => {
  return parseEnv('Stripe', stripeEnvSchema, process.env)
}

export const getCronEnv = () => {
  return parseEnv('Cron', cronEnvSchema, process.env)
}

export const getValidatedAppBaseUrl = () => {
  const env = parseEnv('App URL', appBaseUrlSchema, process.env)

  if (env.APP_BASE_URL) {
    return env.APP_BASE_URL.replace(/\/$/, '')
  }

  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}`
  }

  return 'http://localhost:3000'
}

export const validateAuth0Env = () => {
  return parseEnv('Auth0', auth0EnvSchema, process.env)
}
