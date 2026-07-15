import type {
  AdminPersonDetail,
  AdminPersonStats,
  AdminPersonTimelineItem,
} from './person-types'
import { getAdminPersonByIdFromPrisma } from './person-repository'
import { getLatestTimestamp, openCaseStatuses, uniqueById } from './person-utils'
import {
  mapCaseEvent,
  mapCaseInteraction,
  mapCaseNote,
  mapCasePet,
  mapDetailCase,
} from '../case/case-detail-mappers'
import {
  getPrismaAdminPersonCaseDetailRows,
  type PrismaAdminCaseDetailRow,
} from '../case/case-repository'

export const getAdminPersonDetailFromPrisma = async (
  personId: string,
): Promise<AdminPersonDetail | undefined> => {
  const [person, caseRows] = await Promise.all([
    getAdminPersonByIdFromPrisma(personId),
    getPrismaAdminPersonCaseDetailRows(personId),
  ])

  if (!person) {
    return undefined
  }

  const cases = caseRows
    .map(mapDetailCase)
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))

  const interactions = caseRows
    .flatMap((shelterCase) => shelterCase.interactions.map(mapCaseInteraction))
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))

  const notes = caseRows
    .flatMap((shelterCase) => shelterCase.notes.map(mapCaseNote))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const timeline: AdminPersonTimelineItem[] = caseRows
    .flatMap((shelterCase) =>
      shelterCase.events.map((event: PrismaAdminCaseDetailRow['events'][number]) => ({
        ...mapCaseEvent(event),
        caseId: shelterCase.id,
        caseSubject: shelterCase.subject,
      })),
    )
    .filter((item) => Boolean(item.createdAt))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const relatedPets = uniqueById(
    caseRows
      .map((shelterCase) => (shelterCase.pet ? mapCasePet(shelterCase.pet) : undefined))
      .filter((pet): pet is NonNullable<typeof pet> => Boolean(pet)),
  )

  const stats: AdminPersonStats = {
    totalCases: cases.length,
    openCases: cases.filter((item) => openCaseStatuses.has(item.status)).length,
    totalInteractions: interactions.length,
    internalNotes: notes.length,
    relatedPets: relatedPets.length,
    lastActivityAt: getLatestTimestamp([
      ...cases.map((item) => item.lastActivityAt),
      ...interactions.map((item) => item.loggedAt),
      ...notes.map((item) => item.createdAt),
    ]),
  }

  return {
    person,
    cases,
    interactions,
    notes,
    timeline,
    relatedPets,
    stats,
  }
}
