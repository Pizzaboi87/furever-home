import type { PrismaClient } from '@prisma/client'
import { toDate } from './seed-normalizers'
import type { RawActivityEvent } from './seed-types'

export const seedActivityEvents = async (
  prisma: PrismaClient,
  events: RawActivityEvent[],
  validPetIds: Set<string>,
  validCaseIds: Set<string>,
  validPersonIds: Set<string>,
  validStaffIds: Set<string>,
) => {
  for (const event of events) {
    const data = {
      type: event.type,
      title: event.title,
      detail: event.detail,
      createdAt: toDate(event.createdAt),
      petId: event.petId && validPetIds.has(event.petId) ? event.petId : null,
      caseId: event.caseId && validCaseIds.has(event.caseId) ? event.caseId : null,
      personId:
        event.personId && validPersonIds.has(event.personId)
          ? event.personId
          : null,
      actorId:
        event.actorId && validStaffIds.has(event.actorId) ? event.actorId : null,
      actorName: event.actorName ?? null,
      actorRole: event.actorRole ?? null,
    }

    await prisma.activityEvent.upsert({
      where: { id: event.id },
      update: data,
      create: { id: event.id, ...data },
    })
  }
}
