import type { CasePriority, CaseStatus, CaseType, ContactChannel } from './case-core-types'

export const CANONICAL_CASE_TYPE_OPTIONS = [
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
] as const satisfies readonly CaseType[]

export const CANONICAL_CONTACT_CHANNEL_OPTIONS = [
  'website_form',
  'email',
  'phone',
  'walk_in',
  'shelter_event',
  'admin_created',
] as const satisfies readonly ContactChannel[]

export const CASE_PRIORITY_OPTIONS = [
  'low',
  'medium',
  'high',
] as const satisfies readonly CasePriority[]

export const OPEN_CASE_STATUSES = [
  'new',
  'open',
  'waiting_on_contact',
  'waiting_on_staff',
  'screening',
  'scheduled',
] as const satisfies readonly CaseStatus[]

export const SUCCESSFUL_CASE_STATUSES = [
  'approved',
  'completed',
  'closed',
] as const satisfies readonly CaseStatus[]

export const FAILED_CASE_STATUSES = [
  'declined',
  'cancelled',
  'rejected',
  'no_response',
] as const satisfies readonly CaseStatus[]

export const CLOSED_CASE_STATUSES = [
  'completed',
  'closed',
  'declined',
  'cancelled',
  'rejected',
  'no_response',
] as const satisfies readonly CaseStatus[]

export const DECIDED_APPLICATION_STATUSES = [
  'approved',
  'completed',
  'closed',
  'declined',
  'cancelled',
  'rejected',
  'no_response',
] as const satisfies readonly CaseStatus[]

export const COMPLETED_ADOPTION_STATUSES = [
  'completed',
  'closed',
] as const satisfies readonly CaseStatus[]

const normalizeLifecycleStatus = (status: CaseStatus | string | null | undefined) => {
  return String(status ?? '').trim().toLowerCase()
}

const CLOSED_CASE_STATUS_VALUES = new Set<string>([
  ...CLOSED_CASE_STATUSES,
  'canceled',
  'withdrawn',
])

const DECIDED_APPLICATION_STATUS_VALUES = new Set<string>([
  ...DECIDED_APPLICATION_STATUSES,
  'canceled',
  'withdrawn',
])

const COMPLETED_ADOPTION_STATUS_VALUES = new Set<string>([
  ...COMPLETED_ADOPTION_STATUSES,
])

export const isClosedCaseStatus = (status: CaseStatus | string | null | undefined) => {
  return CLOSED_CASE_STATUS_VALUES.has(normalizeLifecycleStatus(status))
}

export const isOpenCaseStatus = (status: CaseStatus | string | null | undefined) => {
  return Boolean(normalizeLifecycleStatus(status)) && !isClosedCaseStatus(status)
}

export const isDecidedApplicationStatus = (
  status: CaseStatus | string | null | undefined,
) => {
  return DECIDED_APPLICATION_STATUS_VALUES.has(normalizeLifecycleStatus(status))
}

export const isCompletedAdoptionStatus = (
  status: CaseStatus | string | null | undefined,
) => {
  return COMPLETED_ADOPTION_STATUS_VALUES.has(normalizeLifecycleStatus(status))
}

export type CaseInteractionDirection = 'inbound' | 'outbound' | 'internal'

export type CaseInteractionReferenceSystem =
  | 'email_client'
  | 'call_recording'
  | 'website'
  | 'manual'
  | 'event_signup'

export type CaseInteractionReferenceType =
  | 'email'
  | 'call'
  | 'form_submission'
  | 'conversation'
  | 'manual_note'

export type CaseEventActorType =
  | 'system'
  | 'staff'
  | 'contact'
  | 'applicant'
  | 'volunteer'
  | 'donor'

