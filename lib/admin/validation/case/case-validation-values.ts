import { z } from 'zod'

import {
  CASE_PRIORITY_OPTIONS,
  type CaseStatus,
  type CaseType,
  type ContactChannel,
} from '@/lib/admin/domain'

export const caseTypeValues = [
  'general_question',
  'pet_question',
  'adoption_application',
  'virtual_adoption',
  'donation_support',
  'volunteer_application',
  'event_followup',
  'surrender_request',
  'lost_and_found',
  'medical_update',
  'other',
  'question',
  'adoption_interest',
  'donation',
  'volunteer',
  'general',
] as const satisfies readonly CaseType[]

export const contactChannelValues = [
  'website_form',
  'email',
  'phone',
  'walk_in',
  'shelter_event',
  'admin_created',
  'internal',
  'in_person',
] as const satisfies readonly ContactChannel[]

export const caseStatusValues = [
  'new',
  'open',
  'waiting_on_contact',
  'waiting_on_staff',
  'screening',
  'scheduled',
  'approved',
  'declined',
  'completed',
  'closed',
  'cancelled',
  'waiting_reply',
  'in_review',
  'rejected',
  'no_response',
] as const satisfies readonly CaseStatus[]

export const interactionDirectionValues = ['inbound', 'outbound', 'internal'] as const

export const adoptionWorkflowActionValues = [
  'schedule_meet_and_greet',
  'approve_application',
  'decline_application',
  'complete_adoption',
] as const

export const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.string().optional())

export const requiredTrimmedString = (fieldName: string) => {
  return z.string().trim().min(1, `${fieldName} is required.`)
}

export const nullableIdSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.string().optional().nullable())

export const optionalIsoDateString = optionalTrimmedString.refine((value) => {
  if (!value) {
    return true
  }

  return Number.isFinite(Date.parse(value))
}, 'Enter a valid date.')

export const optionalNumericString = optionalTrimmedString.refine((value) => {
  if (!value) {
    return true
  }

  return Number.isFinite(Number(value))
}, 'Enter a valid number.')

export const optionalNonNegativeNumericString = optionalNumericString.refine((value) => {
  if (!value) {
    return true
  }

  return Number(value) >= 0
}, 'Enter a number greater than or equal to 0.')

export const optionalEmail = optionalTrimmedString.refine((value) => {
  if (!value) {
    return true
  }

  return z.email().safeParse(value).success
}, 'Enter a valid email address.')

export const caseIdSchema = requiredTrimmedString('Case ID')

export const createCasePrioritySchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.enum(CASE_PRIORITY_OPTIONS).optional())

export const optionalCasePrioritySchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.enum(CASE_PRIORITY_OPTIONS).optional().nullable())

export const optionalCaseStatusSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}, z.enum(caseStatusValues).optional().nullable())
