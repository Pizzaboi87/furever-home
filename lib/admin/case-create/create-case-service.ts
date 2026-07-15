import type { Prisma } from '@prisma/client'

import {
  createIncomingCase,
  type CreatedIncomingCaseResult,
  type CreateIncomingCaseInput,
} from '@/lib/admin/case-create/case-preview-service'
import type { CurrentStaff } from '@/lib/admin/auth'
import { getPrismaClient } from '@/lib/server/prisma'

import {
  PRISMA_CASE_EVENT_ACTOR_TYPE,
  PRISMA_CASE_SCOPE,
  PRISMA_CASE_STATUS,
  PRISMA_INTERACTION_DIRECTION,
} from './case-create-constants'
import {
  assertRelatedPetExists,
  createOrResolvePersonId,
  getAssignedStaffId,
  getNextPrismaCaseId,
} from './case-create-context'
import {
  optionalString,
  requiredString,
  toPrismaCaseType,
  toPrismaContactChannel,
  toPrismaPriority,
  toPrismaReferenceSystem,
  toPrismaReferenceType,
} from './case-create-normalizers'
import { createStructuredRecord } from './case-structured-record-service'

export const createCase = async (
  input: CreateIncomingCaseInput,
  currentStaff: CurrentStaff,
): Promise<CreatedIncomingCaseResult> => {
  const prisma = getPrismaClient()
  const createdAt = input.createdAt ?? new Date().toISOString()
  const now = new Date(createdAt)
  const caseId = await getNextPrismaCaseId(createdAt)
  const personId = await createOrResolvePersonId(input)
  const petId = await assertRelatedPetExists(input.petId ?? null)
  const assignedStaffId = await getAssignedStaffId(input.assignedStaff)
  const created = createIncomingCase(
    {
      ...input,
      person: {
        ...input.person,
        id: personId,
      },
      petId,
      createdAt,
      assignedStaffId,
    },
    { caseId, personId },
  )
  const prismaChannel = toPrismaContactChannel(input.channel)
  const prismaCaseType = toPrismaCaseType(input.type)
  const prismaPriority = toPrismaPriority(input.priority)
  const externalReference = created.interaction.externalReference

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.shelterCase.create({
      data: {
        id: created.case.id,
        caseNumber: created.case.id,
        type: prismaCaseType,
        scope: petId ? PRISMA_CASE_SCOPE.PET_RELATED : PRISMA_CASE_SCOPE.GENERAL,
        status: PRISMA_CASE_STATUS.OPEN,
        priority: prismaPriority,
        source: prismaChannel,
        personId,
        petId,
        subject: requiredString(input.subject, 'Case subject'),
        summary: requiredString(input.message, 'Interaction summary'),
        assignedStaffId,
        outcome: null,
        nextFollowUpAt: null,
        nextFollowUpNote: null,
        tags: [],
        createdAt: now,
        updatedAt: now,
        closedAt: null,
      },
    })

    await tx.caseInteraction.create({
      data: {
        id: created.interaction.id,
        caseId: created.case.id,
        channel: prismaChannel,
        direction:
          created.interaction.direction === 'internal'
            ? PRISMA_INTERACTION_DIRECTION.INTERNAL
            : PRISMA_INTERACTION_DIRECTION.INBOUND,
        occurredAt: now,
        loggedAt: now,
        loggedByStaffId: currentStaff.id,
        contactPersonId: personId,
        contactPoint: created.interaction.contactPoint,
        referenceSystem: toPrismaReferenceSystem(externalReference?.system),
        referenceType: toPrismaReferenceType(externalReference?.type),
        reference: externalReference?.reference ?? null,
        summary: requiredString(input.message, 'Interaction summary'),
        actionTaken:
          optionalString(input.actionTaken) ?? created.interaction.actionTaken,
        nextStep: optionalString(input.nextStep),
        visibility: 'internal',
      },
    })

    await tx.caseEvent.create({
      data: {
        id: created.caseEvent.id,
        caseId: created.case.id,
        type: created.caseEvent.type,
        title: created.caseEvent.title,
        detail: created.caseEvent.detail,
        createdAt: now,
        actorType: PRISMA_CASE_EVENT_ACTOR_TYPE.STAFF,
        actorId: currentStaff.id,
        actorName: currentStaff.name,
        actorRole: currentStaff.role,
      },
    })

    await tx.activityEvent.create({
      data: {
        id: created.activityEvent.id,
        type: created.activityEvent.type,
        title: created.activityEvent.title,
        detail: created.activityEvent.detail,
        createdAt: now,
        petId: null,
        caseId: created.case.id,
        personId,
        actorId: currentStaff.id,
        actorName: currentStaff.name,
        actorRole: currentStaff.role,
      },
    })

    if (created.petActivityEvent && petId) {
      await tx.activityEvent.create({
        data: {
          id: created.petActivityEvent.id,
          type: created.petActivityEvent.type,
          title: created.petActivityEvent.title,
          detail: created.petActivityEvent.detail,
          createdAt: now,
          petId,
          caseId: created.case.id,
          personId,
          actorId: currentStaff.id,
          actorName: currentStaff.name,
          actorRole: currentStaff.role,
        },
      })
    }

    await createStructuredRecord({
      prismaClient: tx,
      caseId: created.case.id,
      caseType: input.type,
      personId,
      petId,
      now,
    })
  })

  return {
    ...created,
    mode: 'prisma_created',
    persisted: 'database',
  }
}
