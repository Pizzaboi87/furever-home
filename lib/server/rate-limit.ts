import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'

import { getPrismaClient } from '@/lib/server/prisma'

type PublicRateLimitOptions = {
  scope: string
  limit: number
  windowMs: number
}

const getClientAddress = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const firstForwardedAddress = forwardedFor?.split(',')[0]?.trim()

  return firstForwardedAddress || request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export const getRateLimitWindowStart = (now: Date, windowMs: number) => {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs)
}

export const getRateLimitKeyHash = (request: Request, scope: string) => {
  return createHash('sha256')
    .update(`${scope}:${getClientAddress(request)}`)
    .digest('hex')
}

export const enforcePublicRateLimit = async (
  request: Request,
  { scope, limit, windowMs }: PublicRateLimitOptions,
) => {
  const now = new Date()
  const windowStart = getRateLimitWindowStart(now, windowMs)
  const expiresAt = new Date(windowStart.getTime() + windowMs)
  const keyHash = getRateLimitKeyHash(request, scope)
  const prisma = getPrismaClient()

  await prisma.apiRateLimit.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  })

  const entry = await prisma.apiRateLimit.upsert({
    where: {
      scope_keyHash_windowStart: {
        scope,
        keyHash,
        windowStart,
      },
    },
    create: {
      scope,
      keyHash,
      windowStart,
      expiresAt,
      count: 1,
    },
    update: {
      count: {
        increment: 1,
      },
      expiresAt,
    },
    select: {
      count: true,
    },
  })

  if (entry.count <= limit) {
    return null
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
  )

  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(expiresAt.getTime() / 1000)),
      },
    },
  )
}
