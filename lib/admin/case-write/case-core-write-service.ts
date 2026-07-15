import type { CurrentStaff } from '@/lib/admin/auth'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertCaseStatusTransition } from '@/lib/admin/validation/domain/case-status-validation'
import type {
  AddCaseNoteInput,
  CaseWriteResult,
  LogCaseInteractionInput,
  UpdateCaseManagementInput,
  UpdateCaseStatusInput,
} from '@/lib/admin/case-write/case-write-types'
import {
  createCaseEvent,
  getPrismaCaseContext,
  isClosedCaseStatus,
  makeRecordId,
  optionalDate,
  resolveActiveStaffId,
  toPrismaCaseStatus,
  toPrismaContactChannel,
  toPrismaInteractionDirection,
  toPrismaPriority,
} from '@/lib/admin/case-write/case-write-support'

export const addCaseNote = async (
  input: AddCaseNoteInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const body = input.body.trim()

  if (!body) {
    return null
  }

  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context) {
    return null
  }

  const now = new Date()

  await prisma.caseNote.create({
    data: {
      id: makeRecordId('case-note', input.caseId),
      caseId: input.caseId,
      staffId: actor.id,
      body,
      tags: [],
      visibility: 'internal',
      createdAt: now,
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'internal_note_added',
    title: 'Internal note added',
    detail: body,
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

export const logCaseInteraction = async (
  input: LogCaseInteractionInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const summary = input.summary.trim()

  if (!summary) {
    return null
  }

  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context) {
    return null
  }

  const now = new Date()

  await prisma.caseInteraction.create({
    data: {
      id: makeRecordId('case-interaction', input.caseId),
      caseId: input.caseId,
      channel: toPrismaContactChannel(input.channel),
      direction: toPrismaInteractionDirection(input.direction),
      occurredAt: now,
      loggedAt: now,
      loggedByStaffId: actor.id,
      contactPersonId: context.personId,
      contactPoint: context.person.email ?? context.person.phone ?? null,
      referenceSystem: null,
      referenceType: null,
      reference: null,
      summary,
      actionTaken: input.actionTaken?.trim() || null,
      nextStep: input.nextStep?.trim() || null,
      visibility: 'internal',
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'interaction_logged',
    title: 'Interaction logged',
    detail: summary,
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

export const updateCaseStatus = async (
  input: UpdateCaseStatusInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const status = input.status.trim()

  if (!status) {
    return null
  }

  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context) {
    return null
  }

  const prismaStatus = toPrismaCaseStatus(status)
  const now = new Date()
  const outcome = input.outcome?.trim()
  const currentStatus = input.currentStatus?.trim()
  const isClosingCase = isClosedCaseStatus(prismaStatus)

  assertCaseStatusTransition({
    currentStatus: context.status,
    nextStatus: prismaStatus,
    outcome,
  })

  await prisma.shelterCase.update({
    where: { id: input.caseId },
    data: {
      status: prismaStatus,
      outcome: outcome || null,
      nextFollowUpAt: isClosingCase ? null : undefined,
      nextFollowUpNote: isClosingCase ? null : undefined,
      closedAt: isClosingCase ? now : null,
      updatedAt: now,
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'status_changed',
    title: `Status changed to ${status.replace(/_/g, ' ')}`,
    detail: currentStatus
      ? `Previous status: ${currentStatus.replace(/_/g, ' ')}`
      : outcome || null,
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

export const updateCaseManagement = async (
  input: UpdateCaseManagementInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context) {
    return null
  }

  const status = input.status?.trim()
  const outcome = input.outcome?.trim()
  const nextFollowUpNote = input.nextFollowUpNote?.trim()
  const priority = input.priority?.trim()
  const prismaStatus = status ? toPrismaCaseStatus(status) : context.status
  const resolvedAssignedStaffId = await resolveActiveStaffId(input.assignedStaffId)
  const now = new Date()
  const isClosingCase = isClosedCaseStatus(prismaStatus)

  assertCaseStatusTransition({
    currentStatus: context.status,
    nextStatus: prismaStatus,
    outcome,
  })

  await prisma.shelterCase.update({
    where: { id: input.caseId },
    data: {
      assignedStaffId: resolvedAssignedStaffId,
      priority: priority ? toPrismaPriority(priority) : context.priority,
      status: prismaStatus,
      outcome: outcome || null,
      nextFollowUpAt: isClosingCase ? null : optionalDate(input.nextFollowUpAt),
      nextFollowUpNote: isClosingCase ? null : nextFollowUpNote || null,
      closedAt: isClosingCase ? now : null,
      updatedAt: now,
    },
  })

  await createCaseEvent({
    caseId: input.caseId,
    type: 'case_management_updated',
    title: 'Case management updated',
    detail:
      nextFollowUpNote ||
      outcome ||
      'Assignment, priority, status, or follow-up details were updated.',
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


