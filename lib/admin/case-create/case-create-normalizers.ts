import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import { normalizeValue } from '@/lib/pet-format'

import {
  PRISMA_CASE_PRIORITY,
  PRISMA_CASE_TYPE,
  PRISMA_CONTACT_CHANNEL,
  PRISMA_PERSON_PROFILE_TYPE,
  PRISMA_REFERENCE_SYSTEM,
  PRISMA_REFERENCE_TYPE,
  type PrismaCasePriorityValue,
  type PrismaCaseTypeValue,
  type PrismaContactChannelValue,
  type PrismaReferenceSystemValue,
  type PrismaReferenceTypeValue,
} from './case-create-constants'

export const requiredString = (
  value: string | null | undefined,
  label: string,
) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    throw new Error(`${label} is required.`)
  }

  return trimmed
}

export const optionalString = (value: string | null | undefined) => {
  const trimmed = value?.trim()

  return trimmed || null
}

export const parseAddress = (value: string | null | undefined) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return {
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    }
  }

  const parts = trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) {
    return {
      addressLine1: trimmed,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    }
  }

  return {
    addressLine1: parts[0] ?? null,
    addressLine2: null,
    city: parts[1] ?? null,
    state: parts[2] ?? null,
    zip: parts[3] ?? null,
    country: parts.slice(4).join(', ') || null,
  }
}

export const toPrismaCaseType = (value: string): PrismaCaseTypeValue => {
  switch (normalizeValue(value)) {
    case 'pet_question':
    case 'question':
      return PRISMA_CASE_TYPE.PET_QUESTION
    case 'adoption_application':
    case 'adoption_interest':
      return PRISMA_CASE_TYPE.ADOPTION_APPLICATION
    case 'virtual_adoption':
      return PRISMA_CASE_TYPE.VIRTUAL_ADOPTION
    case 'donation_support':
    case 'donation':
      return PRISMA_CASE_TYPE.DONATION_SUPPORT
    case 'volunteer_application':
    case 'volunteer':
      return PRISMA_CASE_TYPE.VOLUNTEER_APPLICATION
    case 'event_followup':
      return PRISMA_CASE_TYPE.EVENT_FOLLOWUP
    case 'surrender_request':
      return PRISMA_CASE_TYPE.SURRENDER_REQUEST
    case 'lost_and_found':
      return PRISMA_CASE_TYPE.LOST_AND_FOUND
    case 'medical_update':
      return PRISMA_CASE_TYPE.MEDICAL_UPDATE
    case 'other':
      return PRISMA_CASE_TYPE.OTHER
    case 'general_question':
    case 'general':
    default:
      return PRISMA_CASE_TYPE.GENERAL_QUESTION
  }
}

export const toPrismaPriority = (
  value: string | null | undefined,
): PrismaCasePriorityValue => {
  switch (normalizeValue(value)) {
    case 'low':
      return PRISMA_CASE_PRIORITY.LOW
    case 'high':
      return PRISMA_CASE_PRIORITY.HIGH
    case 'medium':
    default:
      return PRISMA_CASE_PRIORITY.MEDIUM
  }
}

export const toPrismaContactChannel = (
  value: string | null | undefined,
): PrismaContactChannelValue => {
  switch (normalizeValue(value)) {
    case 'website_form':
      return PRISMA_CONTACT_CHANNEL.WEBSITE_FORM
    case 'phone':
      return PRISMA_CONTACT_CHANNEL.PHONE
    case 'walk_in':
    case 'in_person':
      return PRISMA_CONTACT_CHANNEL.WALK_IN
    case 'shelter_event':
      return PRISMA_CONTACT_CHANNEL.SHELTER_EVENT
    case 'admin_created':
      return PRISMA_CONTACT_CHANNEL.ADMIN_CREATED
    case 'internal':
      return PRISMA_CONTACT_CHANNEL.INTERNAL
    case 'email':
    default:
      return PRISMA_CONTACT_CHANNEL.EMAIL
  }
}

export const toPrismaReferenceSystem = (
  value: string | null | undefined,
): PrismaReferenceSystemValue | null => {
  switch (normalizeValue(value)) {
    case 'email_client':
      return PRISMA_REFERENCE_SYSTEM.EMAIL_CLIENT
    case 'call_recording':
      return PRISMA_REFERENCE_SYSTEM.CALL_RECORDING
    case 'website':
      return PRISMA_REFERENCE_SYSTEM.WEBSITE
    case 'event_signup':
      return PRISMA_REFERENCE_SYSTEM.EVENT_SIGNUP
    case 'manual':
      return PRISMA_REFERENCE_SYSTEM.MANUAL
    default:
      return null
  }
}

export const toPrismaReferenceType = (
  value: string | null | undefined,
): PrismaReferenceTypeValue | null => {
  switch (normalizeValue(value)) {
    case 'email':
      return PRISMA_REFERENCE_TYPE.EMAIL
    case 'call':
      return PRISMA_REFERENCE_TYPE.CALL
    case 'form_submission':
      return PRISMA_REFERENCE_TYPE.FORM_SUBMISSION
    case 'conversation':
      return PRISMA_REFERENCE_TYPE.CONVERSATION
    case 'manual_note':
      return PRISMA_REFERENCE_TYPE.MANUAL_NOTE
    default:
      return null
  }
}

export const inferProfileTypeForNewCasePerson = (
  input: CreateIncomingCaseInput,
) => {
  switch (normalizeValue(input.type)) {
    case 'adoption_application':
    case 'adoption_interest':
      return PRISMA_PERSON_PROFILE_TYPE.ADOPTER
    case 'volunteer_application':
    case 'volunteer':
      return PRISMA_PERSON_PROFILE_TYPE.VOLUNTEER
    case 'donation_support':
    case 'donation':
    case 'virtual_adoption':
      return PRISMA_PERSON_PROFILE_TYPE.DONOR
    default:
      return PRISMA_PERSON_PROFILE_TYPE.GENERAL_CONTACT
  }
}

export const getStructuredRecordPrefix = (caseType: string) => {
  switch (normalizeValue(caseType)) {
    case 'adoption_application':
    case 'adoption_interest':
      return 'adoption-application'
    case 'virtual_adoption':
      return 'virtual-adoption'
    case 'donation_support':
    case 'donation':
      return 'donation-inquiry'
    case 'volunteer_application':
    case 'volunteer':
      return 'volunteer-application'
    default:
      return null
  }
}
