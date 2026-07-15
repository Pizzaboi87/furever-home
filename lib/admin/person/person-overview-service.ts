import { getPrismaClient } from '@/lib/server/prisma'

import { getAdminCasesFromPrisma } from '../case-service'
import { getAdminPeopleFromPrisma } from './person-repository'
import type {
  AdminPersonOverview,
  AdminPersonStats,
} from './person-types'
import {
  createEmptyPersonStats,
  getLatestTimestamp,
  openCaseStatuses,
} from './person-utils'

const getAdminPeopleStatsFromPrisma = async (): Promise<Map<string, AdminPersonStats>> => {
  const prisma = getPrismaClient()
  const cases = await getAdminCasesFromPrisma()
  const [interactions, notes] = await Promise.all([
    prisma.caseInteraction.findMany({
      select: {
        loggedAt: true,
        case: {
          select: {
            personId: true,
          },
        },
      },
    }),
    prisma.caseNote.findMany({
      select: {
        createdAt: true,
        case: {
          select: {
            personId: true,
          },
        },
      },
    }),
  ])

  const statsByPerson = new Map<string, AdminPersonStats>()
  const ensureStats = (personId: string) => {
    const existing = statsByPerson.get(personId)

    if (existing) {
      return existing
    }

    const created = createEmptyPersonStats()
    statsByPerson.set(personId, created)

    return created
  }

  const relatedPetIdsByPerson = new Map<string, Set<string>>()

  for (const shelterCase of cases) {
    const stats = ensureStats(shelterCase.personId)
    stats.totalCases += 1
    stats.openCases += openCaseStatuses.has(shelterCase.status) ? 1 : 0
    stats.lastActivityAt = getLatestTimestamp([stats.lastActivityAt, shelterCase.lastActivityAt])

    if (shelterCase.petId) {
      const relatedPetIds = relatedPetIdsByPerson.get(shelterCase.personId) ?? new Set<string>()
      relatedPetIds.add(shelterCase.petId)
      relatedPetIdsByPerson.set(shelterCase.personId, relatedPetIds)
      stats.relatedPets = relatedPetIds.size
    }
  }

  for (const interaction of interactions) {
    const personId = interaction.case.personId
    const stats = ensureStats(personId)
    stats.totalInteractions += 1
    stats.lastActivityAt = getLatestTimestamp([
      stats.lastActivityAt,
      interaction.loggedAt.toISOString(),
    ])
  }

  for (const note of notes) {
    const personId = note.case.personId
    const stats = ensureStats(personId)
    stats.internalNotes += 1
    stats.lastActivityAt = getLatestTimestamp([
      stats.lastActivityAt,
      note.createdAt.toISOString(),
    ])
  }

  return statsByPerson
}

export const getAdminPeopleOverviewFromPrisma = async (): Promise<AdminPersonOverview[]> => {
  const [people, statsByPerson] = await Promise.all([
    getAdminPeopleFromPrisma(),
    getAdminPeopleStatsFromPrisma(),
  ])

  return people
    .map((person) => ({
      person,
      stats: statsByPerson.get(person.id) ?? createEmptyPersonStats(),
    }))
    .sort((a, b) => {
      const aDate = a.stats.lastActivityAt ?? a.person.updatedAt ?? a.person.createdAt
      const bDate = b.stats.lastActivityAt ?? b.person.updatedAt ?? b.person.createdAt

      return bDate.localeCompare(aDate)
    })
}
