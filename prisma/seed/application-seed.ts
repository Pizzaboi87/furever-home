import type { PrismaClient } from '@prisma/client'
import {
  toDate,
  toDecimalString,
  toNullableDate,
  toPrismaBackgroundCheckStatus,
  toPrismaCaseStatus,
  toPrismaDonationInquiryType,
  toPrismaExperienceLevel,
  toPrismaLandlordApproval,
  toPrismaPaymentFrequency,
  toPrismaVirtualAdoptionStatus,
  toPrismaVolunteerApplicationStatus,
} from './seed-normalizers'
import type {
  RawAdoptionApplication,
  RawDonationInquiry,
  RawVirtualAdoption,
  RawVolunteerApplication,
} from './seed-types'

export const seedAdoptionApplications = async (
  prisma: PrismaClient,
  applications: RawAdoptionApplication[],
) => {
  for (const application of applications) {
    const data = {
      caseId: application.caseId,
      personId: application.personId,
      petId: application.petId,
      sourceApplicationId: application.sourceApplicationId ?? null,
      status: toPrismaCaseStatus(application.status),
      householdType: application.householdType ?? null,
      hasOtherPets: application.hasOtherPets ?? null,
      hasChildren: application.hasChildren ?? null,
      housingType: application.housingType ?? null,
      landlordApproval: toPrismaLandlordApproval(application.landlordApproval),
      experienceLevel: toPrismaExperienceLevel(application.experienceLevel),
      score: application.score ?? null,
      screeningNote: application.screeningNote ?? null,
      createdAt: toDate(application.createdAt),
      updatedAt:
        toDate(application.updatedAt) ??
        toDate(application.createdAt) ??
        new Date(),
    }

    await prisma.adoptionApplication.upsert({
      where: { id: application.id },
      update: data,
      create: { id: application.id, ...data },
    })
  }
}

export const seedVirtualAdoptions = async (
  prisma: PrismaClient,
  virtualAdoptions: RawVirtualAdoption[],
) => {
  for (const virtualAdoption of virtualAdoptions) {
    const data = {
      caseId: virtualAdoption.caseId,
      personId: virtualAdoption.personId,
      petId: virtualAdoption.petId,
      status: toPrismaVirtualAdoptionStatus(virtualAdoption.status),
      frequency: toPrismaPaymentFrequency(virtualAdoption.frequency),
      amount: toDecimalString(virtualAdoption.amount),
      currency: virtualAdoption.currency ?? 'USD',
      sponsorUpdateRequested: virtualAdoption.sponsorUpdateRequested ?? false,
      certificateSent: virtualAdoption.certificateSent ?? false,
      createdAt: toDate(virtualAdoption.createdAt),
      updatedAt:
        toDate(virtualAdoption.updatedAt) ??
        toDate(virtualAdoption.createdAt) ??
        new Date(),
    }

    await prisma.virtualAdoption.upsert({
      where: { id: virtualAdoption.id },
      update: data,
      create: { id: virtualAdoption.id, ...data },
    })
  }
}

export const seedDonationInquiries = async (
  prisma: PrismaClient,
  donationInquiries: RawDonationInquiry[],
) => {
  for (const donationInquiry of donationInquiries) {
    const data = {
      caseId: donationInquiry.caseId,
      personId: donationInquiry.personId,
      externalDonationId: donationInquiry.donationId ?? null,
      inquiryType: toPrismaDonationInquiryType(donationInquiry.inquiryType),
      status: toPrismaCaseStatus(donationInquiry.status),
      amount: toDecimalString(donationInquiry.amount),
      currency: donationInquiry.currency ?? 'USD',
      frequency: donationInquiry.frequency
        ? toPrismaPaymentFrequency(donationInquiry.frequency)
        : null,
      receiptRequested: donationInquiry.receiptRequested ?? false,
      thankYouSent: donationInquiry.thankYouSent ?? false,
      createdAt: toDate(donationInquiry.createdAt),
      updatedAt:
        toDate(donationInquiry.updatedAt) ??
        toDate(donationInquiry.createdAt) ??
        new Date(),
    }

    await prisma.donationInquiry.upsert({
      where: { id: donationInquiry.id },
      update: data,
      create: { id: donationInquiry.id, ...data },
    })
  }
}

export const seedVolunteerApplications = async (
  prisma: PrismaClient,
  applications: RawVolunteerApplication[],
) => {
  for (const application of applications) {
    const data = {
      caseId: application.caseId,
      personId: application.personId,
      status: toPrismaVolunteerApplicationStatus(application.status),
      interestAreas: application.interestAreas ?? [],
      availability: application.availability ?? null,
      experience: application.experience ?? null,
      backgroundCheckStatus: toPrismaBackgroundCheckStatus(
        application.backgroundCheckStatus,
      ),
      orientationScheduledAt: toNullableDate(application.orientationScheduledAt),
      orientationCompleted: application.orientationCompleted ?? false,
      assignedRole: application.assignedRole ?? null,
      createdAt: toDate(application.createdAt),
      updatedAt:
        toDate(application.updatedAt) ??
        toDate(application.createdAt) ??
        new Date(),
    }

    await prisma.volunteerApplication.upsert({
      where: { id: application.id },
      update: data,
      create: { id: application.id, ...data },
    })
  }
}
