import type { CurrentStaff } from '@/lib/admin/auth'
import { getPrismaClient } from '@/lib/server/prisma'
import { PRISMA_CASE_EVENT_ACTOR_TYPE } from '@/lib/admin/case-write/support/case-write-enums'
import { makeRecordId } from '@/lib/admin/case-write/support/case-write-values'

const updateCaseTimestamp = async (caseId: string, now: Date) => {
  await getPrismaClient().shelterCase.update({
    where: { id: caseId },
    data: { updatedAt: now },
  })
}

export const createCaseEvent = async ({
  caseId,
  type,
  title,
  detail,
  personId,
  petId,
  actor,
}: {
  caseId: string
  type: string
  title: string
  detail?: string | null
  personId?: string | null
  petId?: string | null
  actor: CurrentStaff
}) => {
  const prisma = getPrismaClient()
  const now = new Date()

  await prisma.caseEvent.create({
    data: {
      id: makeRecordId('case-event', caseId),
      caseId,
      type,
      title,
      detail: detail ?? null,
      createdAt: now,
      actorType: PRISMA_CASE_EVENT_ACTOR_TYPE.STAFF,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
    },
  })

  await prisma.activityEvent.create({
    data: {
      id: makeRecordId('activity-event', caseId),
      type,
      title,
      detail: detail ?? title,
      createdAt: now,
      petId: petId ?? null,
      caseId,
      personId: personId ?? null,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
    },
  })

  await updateCaseTimestamp(caseId, now)
}
