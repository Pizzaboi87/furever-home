import { randomUUID } from 'node:crypto'

import { Prisma } from '@prisma/client'

import { getPrismaClient } from '@/lib/server/prisma'
import {
  getUtcDateKey,
  shouldShiftMonthLabels,
} from '@/lib/server/demo-date-shift/demo-date-shift-utils'

type ShiftedRunRow = {
  id: string
}

export type DemoDateShiftResult =
  | {
      status: 'shifted'
      runDate: string
      shiftedDays: 1
      shiftedRows: number
    }
  | {
      status: 'already_shifted'
      runDate: string
      shiftedDays: 0
      shiftedRows: 0
    }

const BUSINESS_DATE_UPDATES = [
  Prisma.sql`
    UPDATE "StaffUser"
    SET
      "emailVerified" = "emailVerified" + INTERVAL '1 day',
      "lastSignedInAt" = "lastSignedInAt" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "Person"
    SET
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "Pet"
    SET
      "publishedAt" = "publishedAt" + INTERVAL '1 day',
      "hiddenAt" = "hiddenAt" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "PetImage"
    SET
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "ShelterEvent"
    SET
      "date" = "date" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "ShelterCase"
    SET
      "nextFollowUpAt" = "nextFollowUpAt" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day',
      "closedAt" = "closedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "CaseInteraction"
    SET
      "occurredAt" = "occurredAt" + INTERVAL '1 day',
      "loggedAt" = "loggedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "CaseNote"
    SET "createdAt" = "createdAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "CaseEvent"
    SET "createdAt" = "createdAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "AdoptionApplication"
    SET
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "VirtualAdoption"
    SET
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "DonationInquiry"
    SET
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "VolunteerApplication"
    SET
      "orientationScheduledAt" = "orientationScheduledAt" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day',
      "updatedAt" = "updatedAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "VolunteerHours"
    SET
      "date" = "date" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "ActivityEvent"
    SET "createdAt" = "createdAt" + INTERVAL '1 day'
  `,
  Prisma.sql`
    UPDATE "PetStatusEvent"
    SET
      "date" = "date" + INTERVAL '1 day',
      "createdAt" = "createdAt" + INTERVAL '1 day'
  `,
] as const

export const shiftAllDemoDatesByOneDay = async (
  now = new Date(),
): Promise<DemoDateShiftResult> => {
  const prisma = getPrismaClient()
  const runDate = getUtcDateKey(now)
  const runDateValue = new Date(`${runDate}T00:00:00.000Z`)
  const shiftMonthLabels = shouldShiftMonthLabels(now)

  return prisma.$transaction(
    async (transaction) => {
      const insertedRuns = await transaction.$queryRaw<ShiftedRunRow[]>(
        Prisma.sql`
          INSERT INTO "DemoDateShiftRun" (
            "id",
            "runDate",
            "shiftedDays",
            "shiftedRows",
            "createdAt"
          )
          VALUES (
            ${randomUUID()},
            ${runDateValue},
            1,
            0,
            CURRENT_TIMESTAMP
          )
          ON CONFLICT ("runDate") DO NOTHING
          RETURNING "id"
        `,
      )

      const run = insertedRuns[0]

      if (!run) {
        return {
          status: 'already_shifted',
          runDate,
          shiftedDays: 0,
          shiftedRows: 0,
        }
      }

      let shiftedRows = 0

      for (const update of BUSINESS_DATE_UPDATES) {
        shiftedRows += await transaction.$executeRaw(update)
      }

      shiftedRows += await transaction.$executeRaw(
        Prisma.sql`
          UPDATE "DashboardAnalyticsRecord"
          SET
            "data" = shift_demo_json_dates_by_one_day(
              "data",
              ${shiftMonthLabels}
            ),
            "date" = CASE
              WHEN "date" ~ '^\\d{4}-\\d{2}-\\d{2}$'
                THEN to_char("date"::date + INTERVAL '1 day', 'YYYY-MM-DD')
              ELSE "date"
            END,
            "month" = CASE
              WHEN "date" ~ '^\\d{4}-\\d{2}-\\d{2}$'
                THEN to_char("date"::date + INTERVAL '1 day', 'YYYY-MM')
              WHEN ${shiftMonthLabels} AND "month" ~ '^\\d{4}-\\d{2}$'
                THEN to_char(
                  ("month" || '-01')::date + INTERVAL '1 month',
                  'YYYY-MM'
                )
              ELSE "month"
            END,
            "createdAt" = "createdAt" + INTERVAL '1 day',
            "updatedAt" = "updatedAt" + INTERVAL '1 day'
        `,
      )

      await transaction.demoDateShiftRun.update({
        where: {
          id: run.id,
        },
        data: {
          shiftedRows,
        },
      })

      return {
        status: 'shifted',
        runDate,
        shiftedDays: 1,
        shiftedRows,
      }
    },
    {
      maxWait: 10_000,
      timeout: 120_000,
    },
  )
}
