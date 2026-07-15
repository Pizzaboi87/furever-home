import { timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'

import { shiftAllDemoDatesByOneDay } from '@/lib/server/demo-date-shift/demo-date-shift-service'
import { getCronEnv } from '@/lib/server/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const hasValidAuthorization = (request: Request, expectedSecret: string) => {
  const authorization = request.headers.get('authorization')
  const expectedAuthorization = `Bearer ${expectedSecret}`

  if (!authorization) {
    return false
  }

  const supplied = Buffer.from(authorization)
  const expected = Buffer.from(expectedAuthorization)

  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

export async function GET(request: Request) {
  let cronSecret: string

  try {
    cronSecret = getCronEnv().CRON_SECRET
  } catch (error: unknown) {
    console.error('Cron environment validation failed.', error)

    return NextResponse.json(
      { error: 'The date-shift job is not configured.' },
      { status: 503 },
    )
  }

  if (!hasValidAuthorization(request, cronSecret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const result = await shiftAllDemoDatesByOneDay()

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Daily demo date shift failed.', error)

    return NextResponse.json(
      { error: 'Could not shift the demo dates.' },
      { status: 500 },
    )
  }
}
