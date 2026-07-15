import { makePreviewCaseId, makeSeededId } from '@/lib/admin/common/id-generators'

import type {
  ActivityEvent,
  CaseEvent,
  CaseInteraction,
  CasePriority,
  CaseScope,
  CaseType,
  ContactChannel,
  Id,
  Person,
  ShelterCase,
} from '@/lib/admin/domain'

export type CreateIncomingCaseInput = {
  channel: ContactChannel
  person: {
    id?: Id
    name: string
    email?: string
    phone?: string
    address?: string
  }
  petId?: Id | null
  petName?: string
  type: CaseType
  subject: string

  // This is not a raw email or call transcript. It is the staff-facing CRM summary
  // of what the contact was about.
  message: string

  actionTaken?: string
  nextStep?: string
  priority?: CasePriority
  assignedStaff?: string
  assignedStaffId?: Id | null
  createdAt?: string
}

export type CreateIncomingCaseResult = {
  person: Person
  case: ShelterCase
  interaction: CaseInteraction
  caseEvent: CaseEvent
  activityEvent: ActivityEvent
  petActivityEvent?: ActivityEvent
}

export type CreateIncomingCasePreview = CreateIncomingCaseResult & {
  mode: 'preview'
  wouldPersist: false
}

export type CreatedIncomingCaseResult = CreateIncomingCaseResult & {
  mode: 'prisma_created'
  persisted: 'database'
}

const getContactPoint = (channel: ContactChannel, person: CreateIncomingCaseInput['person']) => {
  if (channel === 'phone') {
    return person.phone ?? person.email ?? null
  }

  if (channel === 'email' || channel === 'website_form') {
    return person.email ?? person.phone ?? null
  }

  return person.email ?? person.phone ?? null
}

const getExternalReference = (
  channel: ContactChannel,
  createdAt: string,
  contactPoint: string | null,
): CaseInteraction['externalReference'] => {
  const safeContactPoint = contactPoint
    ? contactPoint.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'unknown-contact'

  const safeTimestamp = createdAt.replace(/[^0-9]/g, '').slice(0, 12)

  if (channel === 'email') {
    return {
      system: 'email_client',
      type: 'email',
      reference: `email-${safeTimestamp}-${safeContactPoint}`,
    }
  }

  if (channel === 'phone') {
    return {
      system: 'call_recording',
      type: 'call',
      reference: `call-${safeTimestamp}-${safeContactPoint}`,
    }
  }

  if (channel === 'website_form') {
    return {
      system: 'website',
      type: 'form_submission',
      reference: `form-submission-${safeTimestamp}-${safeContactPoint}`,
    }
  }

  if (channel === 'shelter_event') {
    return {
      system: 'event_signup',
      type: 'conversation',
      reference: `event-conversation-${safeTimestamp}-${safeContactPoint}`,
    }
  }

  return {
    system: 'manual',
    type: 'manual_note',
    reference: null,
  }
}

const getDefaultActionTaken = (channel: ContactChannel) => {
  if (channel === 'website_form') {
    return 'Case was created from the submitted website form and is ready for staff review.'
  }

  if (channel === 'phone') {
    return 'Staff logged the call summary in the case record.'
  }

  if (channel === 'email') {
    return 'Staff reviewed the email and logged the relevant case summary.'
  }

  if (channel === 'walk_in' || channel === 'in_person') {
    return 'Staff logged the in-person conversation summary.'
  }

  if (channel === 'shelter_event') {
    return 'Staff logged the event conversation as a follow-up case.'
  }

  if (channel === 'admin_created') {
    return 'Staff created the case manually.'
  }

  return 'Initial case interaction was logged.'
}

export const createIncomingCase = (
  input: CreateIncomingCaseInput,
  options: { caseId?: Id; personId?: Id } = {},
): CreateIncomingCaseResult => {
  const createdAt = input.createdAt ?? new Date().toISOString()
  const isPreview = !options.caseId
  const personId = input.person.id ?? options.personId ?? 'person-preview'
  const caseId = options.caseId ?? makePreviewCaseId(createdAt)
  const interactionId = isPreview ? 'interaction-preview' : makeSeededId('interaction', `${caseId}-${createdAt}`)
  const caseEventId = isPreview ? 'case-event-preview' : makeSeededId('case-event', `${caseId}-created-${createdAt}`)
  const activityEventId = isPreview ? 'activity-preview' : makeSeededId('activity', `${caseId}-created-${createdAt}`)
  const petActivityEventId = isPreview
    ? 'activity-preview-pet-linked'
    : makeSeededId('activity', `${caseId}-pet-linked-${createdAt}`)
  const scope: CaseScope = input.petId ? 'pet_related' : 'general'
  const contactPoint = getContactPoint(input.channel, input.person)

  const person: Person = {
    id: personId,
    name: input.person.name,
    email: input.person.email,
    phone: input.person.phone,
    address: input.person.address,
    preferredContactMethod: input.channel,
    createdAt,
    updatedAt: createdAt,
  }

  const shelterCase: ShelterCase = {
    id: caseId,
    type: input.type,
    scope,
    status: 'open',
    personId,
    petId: input.petId ?? null,
    relatedPetId: input.petId ?? null,
    subject: input.subject,
    summary: input.message,
    priority: input.priority,
    source: input.channel,
    assignedStaff: input.assignedStaff,
    assignedStaffId: input.assignedStaffId ?? null,
    createdAt,
    updatedAt: createdAt,
    closedAt: null,
    outcome: null,
  }

  const interaction: CaseInteraction = {
    id: interactionId,
    caseId,
    channel: input.channel,
    direction: input.channel === 'admin_created' || input.channel === 'internal' ? 'internal' : 'inbound',
    occurredAt: createdAt,
    loggedAt: createdAt,
    loggedByStaffId: input.assignedStaffId ?? null,
    contactPersonId: personId,
    contactPoint,
    externalReference: getExternalReference(input.channel, createdAt, contactPoint),
    summary: input.message,
    actionTaken: input.actionTaken || getDefaultActionTaken(input.channel),
    nextStep: input.nextStep || null,
    visibility: 'internal',
  }

  const caseEvent: CaseEvent = {
    id: caseEventId,
    caseId,
    type: 'case_created',
    title: `Incoming ${input.type.replaceAll('_', ' ')} case created`,
    detail: input.subject,
    createdAt,
    actorType: input.channel === 'admin_created' ? 'staff' : 'contact',
    actorId: input.channel === 'admin_created' ? input.assignedStaffId ?? null : personId,
  }

  const activityEvent: ActivityEvent = {
    id: activityEventId,
    type: 'case',
    title: `${input.person.name} opened a ${input.type.replaceAll('_', ' ')} case`,
    detail: input.subject,
    createdAt,
    petId: input.petId ?? undefined,
    caseId,
    personId,
  }

  const petActivityEvent = input.petId
    ? {
      id: petActivityEventId,
      type: 'pet_case',
      title: `${input.person.name} opened a case${input.petName ? ` for ${input.petName}` : ''}`,
      detail: input.subject,
      createdAt,
      petId: input.petId,
      caseId,
      personId,
    }
    : undefined

  return {
    person,
    case: shelterCase,
    interaction,
    caseEvent,
    activityEvent,
    petActivityEvent,
  }
}

export const buildIncomingCasePreview = (input: CreateIncomingCaseInput): CreateIncomingCasePreview => {
  return {
    ...createIncomingCase(input),
    mode: 'preview',
    wouldPersist: false,
  }
}