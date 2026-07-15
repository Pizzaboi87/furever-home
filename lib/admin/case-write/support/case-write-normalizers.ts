import { normalizeValue } from '@/lib/pet-format'
import {
  PRISMA_BACKGROUND_CHECK_STATUS,
  PRISMA_CASE_PRIORITY,
  PRISMA_CASE_STATUS,
  PRISMA_CONTACT_CHANNEL,
  PRISMA_DONATION_INQUIRY_TYPE,
  PRISMA_EXPERIENCE_LEVEL,
  PRISMA_INTERACTION_DIRECTION,
  PRISMA_LANDLORD_APPROVAL,
  PRISMA_PAYMENT_FREQUENCY,
  PRISMA_VIRTUAL_ADOPTION_STATUS,
  PRISMA_VOLUNTEER_APPLICATION_STATUS,
} from '@/lib/admin/case-write/support/case-write-enums'
import type {
  PrismaBackgroundCheckStatusValue,
  PrismaCasePriorityValue,
  PrismaCaseStatusValue,
  PrismaContactChannelValue,
  PrismaDonationInquiryTypeValue,
  PrismaExperienceLevelValue,
  PrismaInteractionDirectionValue,
  PrismaLandlordApprovalValue,
  PrismaPaymentFrequencyValue,
  PrismaVirtualAdoptionStatusValue,
  PrismaVolunteerApplicationStatusValue,
} from '@/lib/admin/case-write/support/case-write-enums'

const CLOSED_CASE_STATUSES: readonly string[] = [
  PRISMA_CASE_STATUS.COMPLETED,
  PRISMA_CASE_STATUS.CLOSED,
  PRISMA_CASE_STATUS.DECLINED,
  PRISMA_CASE_STATUS.CANCELLED,
  PRISMA_CASE_STATUS.REJECTED,
  PRISMA_CASE_STATUS.NO_RESPONSE,
]

export const toPrismaCaseStatus = (
  value: string | null | undefined,
): PrismaCaseStatusValue => {
  switch (normalizeValue(value)) {
    case 'waiting_on_contact':
    case 'waiting_reply': return PRISMA_CASE_STATUS.WAITING_ON_CONTACT
    case 'waiting_on_staff':
    case 'in_review': return PRISMA_CASE_STATUS.WAITING_ON_STAFF
    case 'screening': return PRISMA_CASE_STATUS.SCREENING
    case 'scheduled': return PRISMA_CASE_STATUS.SCHEDULED
    case 'approved': return PRISMA_CASE_STATUS.APPROVED
    case 'declined': return PRISMA_CASE_STATUS.DECLINED
    case 'completed': return PRISMA_CASE_STATUS.COMPLETED
    case 'closed': return PRISMA_CASE_STATUS.CLOSED
    case 'cancelled':
    case 'canceled': return PRISMA_CASE_STATUS.CANCELLED
    case 'rejected': return PRISMA_CASE_STATUS.REJECTED
    case 'no_response': return PRISMA_CASE_STATUS.NO_RESPONSE
    case 'new': return PRISMA_CASE_STATUS.NEW
    case 'open':
    default: return PRISMA_CASE_STATUS.OPEN
  }
}

export const toPrismaPriority = (
  value: string | null | undefined,
): PrismaCasePriorityValue => {
  switch (normalizeValue(value)) {
    case 'low': return PRISMA_CASE_PRIORITY.LOW
    case 'high': return PRISMA_CASE_PRIORITY.HIGH
    case 'medium':
    default: return PRISMA_CASE_PRIORITY.MEDIUM
  }
}

export const toPrismaContactChannel = (
  value: string | null | undefined,
): PrismaContactChannelValue => {
  switch (normalizeValue(value)) {
    case 'website_form': return PRISMA_CONTACT_CHANNEL.WEBSITE_FORM
    case 'phone': return PRISMA_CONTACT_CHANNEL.PHONE
    case 'walk_in':
    case 'in_person': return PRISMA_CONTACT_CHANNEL.WALK_IN
    case 'shelter_event': return PRISMA_CONTACT_CHANNEL.SHELTER_EVENT
    case 'admin_created': return PRISMA_CONTACT_CHANNEL.ADMIN_CREATED
    case 'internal': return PRISMA_CONTACT_CHANNEL.INTERNAL
    case 'email':
    default: return PRISMA_CONTACT_CHANNEL.EMAIL
  }
}

export const toPrismaInteractionDirection = (
  value: string | null | undefined,
): PrismaInteractionDirectionValue => {
  switch (normalizeValue(value)) {
    case 'outbound': return PRISMA_INTERACTION_DIRECTION.OUTBOUND
    case 'internal': return PRISMA_INTERACTION_DIRECTION.INTERNAL
    case 'inbound':
    default: return PRISMA_INTERACTION_DIRECTION.INBOUND
  }
}

export const toPrismaLandlordApproval = (
  value: string | null | undefined,
): PrismaLandlordApprovalValue | null => {
  switch (normalizeValue(value)) {
    case 'not_needed': return PRISMA_LANDLORD_APPROVAL.NOT_NEEDED
    case 'pending': return PRISMA_LANDLORD_APPROVAL.PENDING
    case 'confirmed': return PRISMA_LANDLORD_APPROVAL.CONFIRMED
    case 'rejected': return PRISMA_LANDLORD_APPROVAL.REJECTED
    default: return null
  }
}

export const toPrismaExperienceLevel = (
  value: string | null | undefined,
): PrismaExperienceLevelValue | null => {
  switch (normalizeValue(value)) {
    case 'first_time': return PRISMA_EXPERIENCE_LEVEL.FIRST_TIME
    case 'some_experience': return PRISMA_EXPERIENCE_LEVEL.SOME_EXPERIENCE
    case 'experienced': return PRISMA_EXPERIENCE_LEVEL.EXPERIENCED
    default: return null
  }
}

export const toPrismaVirtualAdoptionStatus = (
  value: string | null | undefined,
): PrismaVirtualAdoptionStatusValue => {
  switch (normalizeValue(value)) {
    case 'paused': return PRISMA_VIRTUAL_ADOPTION_STATUS.PAUSED
    case 'cancelled':
    case 'canceled': return PRISMA_VIRTUAL_ADOPTION_STATUS.CANCELLED
    case 'completed': return PRISMA_VIRTUAL_ADOPTION_STATUS.COMPLETED
    case 'active':
    default: return PRISMA_VIRTUAL_ADOPTION_STATUS.ACTIVE
  }
}

export const toPrismaPaymentFrequency = (
  value: string | null | undefined,
): PrismaPaymentFrequencyValue | null => {
  switch (normalizeValue(value)) {
    case 'one_time': return PRISMA_PAYMENT_FREQUENCY.ONE_TIME
    case 'monthly': return PRISMA_PAYMENT_FREQUENCY.MONTHLY
    case 'quarterly': return PRISMA_PAYMENT_FREQUENCY.QUARTERLY
    case 'annual':
    case 'yearly': return PRISMA_PAYMENT_FREQUENCY.ANNUAL
    default: return null
  }
}

export const toPrismaDonationInquiryType = (
  value: string | null | undefined,
): PrismaDonationInquiryTypeValue => {
  switch (normalizeValue(value)) {
    case 'receipt_request': return PRISMA_DONATION_INQUIRY_TYPE.RECEIPT_REQUEST
    case 'monthly_donation_change': return PRISMA_DONATION_INQUIRY_TYPE.MONTHLY_DONATION_CHANGE
    case 'corporate_donation': return PRISMA_DONATION_INQUIRY_TYPE.CORPORATE_DONATION
    case 'refund_or_correction': return PRISMA_DONATION_INQUIRY_TYPE.REFUND_OR_CORRECTION
    case 'allocation_question': return PRISMA_DONATION_INQUIRY_TYPE.ALLOCATION_QUESTION
    case 'event_sponsorship': return PRISMA_DONATION_INQUIRY_TYPE.EVENT_SPONSORSHIP
    case 'other':
    default: return PRISMA_DONATION_INQUIRY_TYPE.OTHER
  }
}

export const toPrismaVolunteerStatus = (
  value: string | null | undefined,
): PrismaVolunteerApplicationStatusValue => {
  switch (normalizeValue(value)) {
    case 'screening': return PRISMA_VOLUNTEER_APPLICATION_STATUS.SCREENING
    case 'orientation_scheduled': return PRISMA_VOLUNTEER_APPLICATION_STATUS.ORIENTATION_SCHEDULED
    case 'approved': return PRISMA_VOLUNTEER_APPLICATION_STATUS.APPROVED
    case 'declined': return PRISMA_VOLUNTEER_APPLICATION_STATUS.DECLINED
    case 'active': return PRISMA_VOLUNTEER_APPLICATION_STATUS.ACTIVE
    case 'inactive': return PRISMA_VOLUNTEER_APPLICATION_STATUS.INACTIVE
    case 'new':
    default: return PRISMA_VOLUNTEER_APPLICATION_STATUS.NEW
  }
}

export const toPrismaBackgroundCheck = (
  value: string | null | undefined,
): PrismaBackgroundCheckStatusValue | null => {
  switch (normalizeValue(value)) {
    case 'not_required': return PRISMA_BACKGROUND_CHECK_STATUS.NOT_REQUIRED
    case 'cleared': return PRISMA_BACKGROUND_CHECK_STATUS.CLEARED
    case 'failed': return PRISMA_BACKGROUND_CHECK_STATUS.FAILED
    case 'pending': return PRISMA_BACKGROUND_CHECK_STATUS.PENDING
    default: return null
  }
}

export const isClosedCaseStatus = (status: PrismaCaseStatusValue) => {
  return CLOSED_CASE_STATUSES.includes(status)
}
