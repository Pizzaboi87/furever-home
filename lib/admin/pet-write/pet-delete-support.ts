import { getPrismaClient } from '@/lib/server/prisma'

import type { RelatedRecordCounts } from './pet-write-types'

export const getRelatedPetRecordCounts = async (
  petId: string,
): Promise<RelatedRecordCounts> => {
  const prisma = getPrismaClient()

  const [cases, adoptionApplications, virtualAdoptions, statusEvents, activityEvents] =
    await Promise.all([
      prisma.shelterCase.count({ where: { petId } }),
      prisma.adoptionApplication.count({ where: { petId } }),
      prisma.virtualAdoption.count({ where: { petId } }),
      prisma.petStatusEvent.count({ where: { petId } }),
      prisma.activityEvent.count({ where: { petId } }),
    ])

  return {
    cases,
    adoptionApplications,
    virtualAdoptions,
    statusEvents,
    activityEvents,
  }
}

export const formatRelatedPetRecordBlockers = (counts: RelatedRecordCounts) => {
  return [
    counts.cases > 0 ? `${counts.cases} case${counts.cases === 1 ? '' : 's'}` : '',
    counts.adoptionApplications > 0
      ? `${counts.adoptionApplications} adoption application${counts.adoptionApplications === 1 ? '' : 's'}`
      : '',
    counts.virtualAdoptions > 0
      ? `${counts.virtualAdoptions} virtual adoption${counts.virtualAdoptions === 1 ? '' : 's'}`
      : '',
    counts.statusEvents > 0
      ? `${counts.statusEvents} pet status event${counts.statusEvents === 1 ? '' : 's'}`
      : '',
    counts.activityEvents > 0
      ? `${counts.activityEvents} activity event${counts.activityEvents === 1 ? '' : 's'}`
      : '',
  ].filter(Boolean)
}
