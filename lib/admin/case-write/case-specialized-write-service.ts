import type { CurrentStaff } from '@/lib/admin/auth'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertCaseAllowsStructuredRecordUpdate } from '@/lib/admin/validation/domain/case-status-validation'
import type {
  CaseWriteResult,
  UpdateAdoptionApplicationInput,
  UpdateDonationInquiryInput,
  UpdateVirtualAdoptionInput,
  UpdateVolunteerApplicationInput,
} from '@/lib/admin/case-write/case-write-types'
import {
  PRISMA_PAYMENT_FREQUENCY,
  createCaseEvent,
  getPrismaCaseContext,
  makeRecordId,
  optionalDate,
  optionalNumber,
  toPrismaBackgroundCheck,
  toPrismaCaseStatus,
  toPrismaDonationInquiryType,
  toPrismaExperienceLevel,
  toPrismaLandlordApproval,
  toPrismaPaymentFrequency,
  toPrismaVirtualAdoptionStatus,
  toPrismaVolunteerStatus,
} from '@/lib/admin/case-write/case-write-support'

export const updateDonationInquiry = async (
  input: UpdateDonationInquiryInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context?.donationInquiry) {
    return null
  }

  assertCaseAllowsStructuredRecordUpdate(context.status)

  const donationId = input.donationId?.trim()
  const status = input.status?.trim()
  const currency = input.currency?.trim()

  await prisma.donationInquiry.update({
    where: { caseId: input.caseId },
    data: {
      externalDonationId: donationId || null,
      inquiryType: input.inquiryType
        ? toPrismaDonationInquiryType(input.inquiryType)
        : context.donationInquiry.inquiryType,
      status: status ? toPrismaCaseStatus(status) : context.donationInquiry.status,
      amount: input.amount === undefined ? context.donationInquiry.amount : optionalNumber(input.amount),
      currency: currency || context.donationInquiry.currency || 'USD',
      frequency:
        input.frequency === undefined
          ? context.donationInquiry.frequency
          : toPrismaPaymentFrequency(input.frequency),
      receiptRequested:
        input.receiptRequested ?? context.donationInquiry.receiptRequested,
      thankYouSent: input.thankYouSent ?? context.donationInquiry.thankYouSent,
      updatedAt: new Date(),
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'donation_inquiry_updated',
    title: 'Donation inquiry updated',
    detail: donationId || status || 'Donation inquiry details were updated.',
    personId: context.personId,
    petId: context.petId,
    actor,
  })

  return {
    caseId: input.caseId,
    personId: context.personId,
    petId: context.petId,
  }
}

export const updateVirtualAdoption = async (
  input: UpdateVirtualAdoptionInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context?.virtualAdoption) {
    return null
  }

  assertCaseAllowsStructuredRecordUpdate(context.status)

  const status = input.status?.trim()
  const currency = input.currency?.trim()

  await prisma.virtualAdoption.update({
    where: { caseId: input.caseId },
    data: {
      status: status
        ? toPrismaVirtualAdoptionStatus(status)
        : context.virtualAdoption.status,
      amount: input.amount === undefined ? context.virtualAdoption.amount : optionalNumber(input.amount),
      currency: currency || context.virtualAdoption.currency || 'USD',
      frequency:
        input.frequency === undefined
          ? context.virtualAdoption.frequency
          : toPrismaPaymentFrequency(input.frequency) ?? PRISMA_PAYMENT_FREQUENCY.MONTHLY,
      sponsorUpdateRequested:
        input.sponsorUpdateRequested ?? context.virtualAdoption.sponsorUpdateRequested,
      certificateSent: input.certificateSent ?? context.virtualAdoption.certificateSent,
      updatedAt: new Date(),
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'virtual_adoption_updated',
    title: 'Virtual adoption updated',
    detail: status || 'Virtual adoption details were updated.',
    personId: context.personId,
    petId: context.petId,
    actor,
  })

  return {
    caseId: input.caseId,
    personId: context.personId,
    petId: context.petId,
  }
}

export const updateVolunteerApplication = async (
  input: UpdateVolunteerApplicationInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context?.volunteerApplication) {
    return null
  }

  assertCaseAllowsStructuredRecordUpdate(context.status)

  const status = input.status?.trim()
  const availability = input.availability?.trim()
  const experience = input.experience?.trim()
  const assignedRole = input.assignedRole?.trim()
  const volunteerHoursDate = input.volunteerHoursDate?.trim()
  const volunteerHoursActivity = input.volunteerHoursActivity?.trim()
  const volunteerHours = optionalNumber(input.volunteerHours)

  await prisma.volunteerApplication.update({
    where: { caseId: input.caseId },
    data: {
      status: status
        ? toPrismaVolunteerStatus(status)
        : context.volunteerApplication.status,
      interestAreas: input.interestAreas ?? context.volunteerApplication.interestAreas,
      availability: availability || context.volunteerApplication.availability,
      experience: experience || context.volunteerApplication.experience,
      backgroundCheckStatus:
        input.backgroundCheckStatus === undefined
          ? context.volunteerApplication.backgroundCheckStatus
          : toPrismaBackgroundCheck(input.backgroundCheckStatus),
      orientationScheduledAt:
        input.orientationScheduledAt === undefined
          ? context.volunteerApplication.orientationScheduledAt
          : optionalDate(input.orientationScheduledAt),
      orientationCompleted:
        input.orientationCompleted ?? context.volunteerApplication.orientationCompleted,
      assignedRole: assignedRole || context.volunteerApplication.assignedRole,
      updatedAt: new Date(),
    },
  })

  if (
    volunteerHoursDate &&
    volunteerHoursActivity &&
    volunteerHours &&
    volunteerHours > 0
  ) {
    await prisma.volunteerHours.create({
      data: {
        id: makeRecordId('volunteer-hours', input.caseId),
        personId: context.personId,
        volunteerApplicationId: context.volunteerApplication.id,
        caseId: input.caseId,
        date: new Date(volunteerHoursDate),
        hours: volunteerHours,
        activity: volunteerHoursActivity,
        role: assignedRole || context.volunteerApplication.assignedRole,
        staffId: actor.id,
        createdAt: new Date(),
      },
    })
  }

  await createCaseEvent({
    caseId: input.caseId,
    type: 'volunteer_application_updated',
    title: 'Volunteer application updated',
    detail: status || 'Volunteer application details were updated.',
    personId: context.personId,
    petId: context.petId,
    actor,
  })

  return {
    caseId: input.caseId,
    personId: context.personId,
    petId: context.petId,
  }
}

export const updateAdoptionApplication = async (
  input: UpdateAdoptionApplicationInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context?.adoptionApplication) {
    return null
  }

  assertCaseAllowsStructuredRecordUpdate(context.status)

  const status = input.status?.trim()
  const householdType = input.householdType?.trim()
  const housingType = input.housingType?.trim()
  const screeningNote = input.screeningNote?.trim()

  await prisma.adoptionApplication.update({
    where: { caseId: input.caseId },
    data: {
      status: status
        ? toPrismaCaseStatus(status)
        : context.adoptionApplication.status,
      score: input.score === undefined ? context.adoptionApplication.score : optionalNumber(input.score),
      householdType: householdType || context.adoptionApplication.householdType,
      hasOtherPets: input.hasOtherPets ?? context.adoptionApplication.hasOtherPets,
      hasChildren: input.hasChildren ?? context.adoptionApplication.hasChildren,
      housingType: housingType || context.adoptionApplication.housingType,
      landlordApproval:
        input.landlordApproval === undefined
          ? context.adoptionApplication.landlordApproval
          : toPrismaLandlordApproval(input.landlordApproval),
      experienceLevel:
        input.experienceLevel === undefined
          ? context.adoptionApplication.experienceLevel
          : toPrismaExperienceLevel(input.experienceLevel),
      screeningNote: screeningNote || context.adoptionApplication.screeningNote,
      updatedAt: new Date(),
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'adoption_application_updated',
    title: 'Adoption application updated',
    detail: screeningNote || status || 'Adoption application details were updated.',
    personId: context.personId,
    petId: context.petId,
    actor,
  })

  return {
    caseId: input.caseId,
    personId: context.personId,
    petId: context.petId,
  }
}

