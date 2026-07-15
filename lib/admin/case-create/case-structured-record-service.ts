import type { Prisma, PrismaClient } from '@prisma/client'

import { normalizeValue } from '@/lib/pet-format'
import { getPrismaClient } from '@/lib/server/prisma'

import {
  PRISMA_BACKGROUND_CHECK_STATUS,
  PRISMA_CASE_STATUS,
  PRISMA_DONATION_INQUIRY_TYPE,
  PRISMA_PAYMENT_FREQUENCY,
  PRISMA_VIRTUAL_ADOPTION_STATUS,
  PRISMA_VOLUNTEER_APPLICATION_STATUS,
} from './case-create-constants'
import { getStructuredRecordPrefix } from './case-create-normalizers'

type PrismaStructuredRecordClient = PrismaClient | Prisma.TransactionClient

export const createStructuredRecord = async ({
  prismaClient = getPrismaClient(),
  caseId,
  caseType,
  personId,
  petId,
  now,
}: {
  prismaClient?: PrismaStructuredRecordClient
  caseId: string
  caseType: string
  personId: string
  petId: string | null
  now: Date
}) => {
  const prisma = prismaClient
  const normalizedType = normalizeValue(caseType)
  const recordPrefix = getStructuredRecordPrefix(caseType)

  if (!recordPrefix) {
    return
  }

  const id = `${recordPrefix}-${caseId.toLowerCase()}`

  if (
    normalizedType === 'adoption_application' ||
    normalizedType === 'adoption_interest'
  ) {
    if (!petId) {
      return
    }

    await prisma.adoptionApplication.create({
      data: {
        id,
        caseId,
        personId,
        petId,
        status: PRISMA_CASE_STATUS.OPEN,
        createdAt: now,
        updatedAt: now,
      },
    })

    return
  }

  if (normalizedType === 'virtual_adoption') {
    if (!petId) {
      return
    }

    await prisma.virtualAdoption.create({
      data: {
        id,
        caseId,
        personId,
        petId,
        status: PRISMA_VIRTUAL_ADOPTION_STATUS.ACTIVE,
        frequency: PRISMA_PAYMENT_FREQUENCY.MONTHLY,
        amount: null,
        currency: 'USD',
        sponsorUpdateRequested: false,
        certificateSent: false,
        createdAt: now,
        updatedAt: now,
      },
    })

    return
  }

  if (
    normalizedType === 'donation_support' ||
    normalizedType === 'donation'
  ) {
    await prisma.donationInquiry.create({
      data: {
        id,
        caseId,
        personId,
        externalDonationId: null,
        inquiryType: PRISMA_DONATION_INQUIRY_TYPE.OTHER,
        status: PRISMA_CASE_STATUS.OPEN,
        amount: null,
        currency: 'USD',
        frequency: PRISMA_PAYMENT_FREQUENCY.ONE_TIME,
        receiptRequested: false,
        thankYouSent: false,
        createdAt: now,
        updatedAt: now,
      },
    })

    return
  }

  if (
    normalizedType === 'volunteer_application' ||
    normalizedType === 'volunteer'
  ) {
    await prisma.volunteerApplication.create({
      data: {
        id,
        caseId,
        personId,
        status: PRISMA_VOLUNTEER_APPLICATION_STATUS.NEW,
        interestAreas: [],
        availability: null,
        experience: null,
        backgroundCheckStatus: PRISMA_BACKGROUND_CHECK_STATUS.PENDING,
        orientationScheduledAt: null,
        orientationCompleted: false,
        assignedRole: null,
        createdAt: now,
        updatedAt: now,
      },
    })
  }
}
