import type { CurrentStaff } from '@/lib/admin/auth'
import { getPrismaClient } from '@/lib/server/prisma'
import {
  PRISMA_PET_PUBLIC_STATUS,
  PRISMA_PET_STATUS,
} from '@/lib/server/prisma-pet-enums'
import type {
  CaseWriteResult,
  RunAdoptionWorkflowInput,
} from '@/lib/admin/case-write/case-write-types'
import {
  PRISMA_CASE_STATUS,
  createCaseEvent,
  getPrismaCaseContext,
  isClosedCaseStatus,
  makeRecordId,
} from '@/lib/admin/case-write/case-write-support'
import type { PrismaCaseStatusValue } from '@/lib/admin/case-write/case-write-support'
import { validateAdoptionWorkflowTransition } from '@/lib/admin/validation/domain/adoption-workflow-validation'

const markPetAsAdopted = async (
  petId: string,
  caseId: string,
  actor: CurrentStaff,
) => {
  const prisma = getPrismaClient()
  const now = new Date()
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { status: true },
  })

  await prisma.pet.updateMany({
    where: { id: petId },
    data: {
      status: PRISMA_PET_STATUS.ADOPTED,
      publicStatus: PRISMA_PET_PUBLIC_STATUS.ADOPTED,
      isPublished: false,
      hiddenAt: now,
      updatedAt: now,
    },
  })

  await prisma.petStatusEvent.create({
    data: {
      id: makeRecordId('pet-status-event', caseId),
      petId,
      fromStatus: pet?.status ?? null,
      toStatus: PRISMA_PET_STATUS.ADOPTED,
      date: now,
      createdAt: now,
      caseId,
      staffId: actor.id,
    },
  })
}

export const runAdoptionWorkflow = async (
  input: RunAdoptionWorkflowInput,
  actor: CurrentStaff,
): Promise<CaseWriteResult | null> => {
  if (
    input.action !== 'schedule_meet_and_greet' &&
    input.action !== 'approve_application' &&
    input.action !== 'decline_application' &&
    input.action !== 'complete_adoption'
  ) {
    return null
  }

  const prisma = getPrismaClient()
  const context = await getPrismaCaseContext(input.caseId)

  if (!context) {
    return null
  }

  const petId =
    input.petId?.trim() || context.petId || context.adoptionApplication?.petId || null
  validateAdoptionWorkflowTransition({
    input,
    context,
    resolvedPetId: petId,
  })

  const note = input.note?.trim()
  const now = new Date()

  let nextStatus: PrismaCaseStatusValue = context.status as PrismaCaseStatusValue
  let eventTitle = 'Adoption workflow updated'
  let eventType = 'adoption_workflow_updated'

  if (input.action === 'schedule_meet_and_greet') {
    nextStatus = PRISMA_CASE_STATUS.SCHEDULED
    eventTitle = 'Meet-and-greet scheduled'
    eventType = 'meet_and_greet_scheduled'
  }

  if (input.action === 'approve_application') {
    nextStatus = PRISMA_CASE_STATUS.APPROVED
    eventTitle = 'Adoption application approved'
    eventType = 'adoption_application_approved'
  }

  if (input.action === 'decline_application') {
    nextStatus = PRISMA_CASE_STATUS.DECLINED
    eventTitle = 'Adoption application declined'
    eventType = 'adoption_application_declined'
  }

  if (input.action === 'complete_adoption') {
    nextStatus = PRISMA_CASE_STATUS.COMPLETED
    eventTitle = 'Adoption completed'
    eventType = 'adoption_completed'
  }

  const isClosingCase = isClosedCaseStatus(nextStatus)

  const nextOutcome =
    input.action === 'complete_adoption'
      ? 'Adoption completed'
      : input.action === 'decline_application'
        ? note || 'Adoption application declined'
        : context.outcome

  await prisma.shelterCase.update({
    where: { id: input.caseId },
    data: {
      status: nextStatus,
      outcome: nextOutcome,
      nextFollowUpAt: isClosingCase ? null : undefined,
      nextFollowUpNote: isClosingCase ? null : undefined,
      closedAt: isClosingCase ? now : null,
      updatedAt: now,
    },
  })

  if (context.adoptionApplication) {
    await prisma.adoptionApplication.update({
      where: { caseId: input.caseId },
      data: {
        status: nextStatus,
        updatedAt: now,
      },
    })
  }

  if (input.action === 'approve_application' && petId) {
    await prisma.pet.updateMany({
      where: { id: petId },
      data: {
        status: PRISMA_PET_STATUS.RESERVED,
        publicStatus: PRISMA_PET_PUBLIC_STATUS.RESERVED,
        isPublished: true,
        hiddenAt: null,
        updatedAt: now,
      },
    })
  }

  if (input.action === 'complete_adoption' && petId) {
    await markPetAsAdopted(petId, input.caseId, actor)
  }

  await createCaseEvent({
    caseId: input.caseId,
    type: eventType,
    title: eventTitle,
    detail: note || null,
    personId: context.personId,
    petId,
    actor,
  })

  return {
    caseId: input.caseId,
    personId: context.personId,
    petId,
  }
}
