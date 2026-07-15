import type { AdminPetActivityItem } from '@/lib/admin/domain'
import { mapPrismaActivityEventToDomain } from './pet-mappers'
import { getPrismaPetActivityEventRows } from './pet-repository'
import {
  getAdminPetCasesFromPrisma,
  getAdminPetStatusEventsFromPrisma,
  getPrismaAdminPetById,
} from './pet-read-service'

export const getAdminPetActivityFromPrisma = async (
  petId: string,
): Promise<AdminPetActivityItem[]> => {
  const [pet, activityEvents, cases, statusEvents] = await Promise.all([
    getPrismaAdminPetById(petId),
    getPrismaPetActivityEventRows(petId),
    getAdminPetCasesFromPrisma(petId),
    getAdminPetStatusEventsFromPrisma(petId),
  ])

  if (!pet) {
    return []
  }

  const activityItems: AdminPetActivityItem[] = activityEvents
    .map(mapPrismaActivityEventToDomain)
    .map((event) => ({
      id: event.id,
      kind: 'activity',
      type: event.type,
      title: event.title,
      detail: event.detail,
      createdAt: event.createdAt,
    }))

  const caseActivityItems: AdminPetActivityItem[] = cases.map((shelterCase) => ({
    id: `case-activity-${shelterCase.id}`,
    kind: 'activity',
    type: 'case',
    title: shelterCase.subject,
    detail:
      shelterCase.summary ?? `${shelterCase.type} case linked to ${pet.name}.`,
    createdAt: shelterCase.lastActivityAt,
  }))

  const statusItems: AdminPetActivityItem[] = statusEvents.map((event) => ({
    id: event.id,
    kind: 'status',
    type: 'status_change',
    title: `${pet.name} status changed to ${event.toStatus}`,
    detail: event.fromStatus
      ? `${event.fromStatus} -> ${event.toStatus}`
      : `Initial status: ${event.toStatus}`,
    createdAt: event.createdAt ?? event.date,
    statusFrom: event.fromStatus ?? null,
    statusTo: event.toStatus,
  }))

  return [...activityItems, ...caseActivityItems, ...statusItems]
    .filter((item) => Boolean(item.createdAt))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
