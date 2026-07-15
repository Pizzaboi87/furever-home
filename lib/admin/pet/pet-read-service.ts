import type { AdminPet, AdminPetCase, PetStatusEvent } from '@/lib/admin/domain'
import { getAdminCasesFromPrisma } from '@/lib/admin/case-service'
import {
  formatPrismaEnumValue,
  mapPrismaPetToAdminPet,
  mapPetStatusValue,
} from './pet-mappers'
import {
  getPrismaAdminPetRowById,
  getPrismaAdminPetRows,
  getPrismaPetStatusEventRows,
  getRelatedCaseCountByPetIdFromPrisma,
} from './pet-repository'

export const getPrismaAdminPets = async (): Promise<AdminPet[]> => {
  const [relatedCaseCountByPetId, pets] = await Promise.all([
    getRelatedCaseCountByPetIdFromPrisma(),
    getPrismaAdminPetRows(),
  ])

  return pets.map((pet) => mapPrismaPetToAdminPet(pet, relatedCaseCountByPetId))
}

export const getPrismaAdminPetById = async (
  id: string,
): Promise<AdminPet | undefined> => {
  const [relatedCaseCountByPetId, pet] = await Promise.all([
    getRelatedCaseCountByPetIdFromPrisma(),
    getPrismaAdminPetRowById(id),
  ])

  return pet ? mapPrismaPetToAdminPet(pet, relatedCaseCountByPetId) : undefined
}

export const getAdminPetCasesFromPrisma = async (
  petId: string,
): Promise<AdminPetCase[]> => {
  const cases = await getAdminCasesFromPrisma()

  return cases
    .filter((shelterCase) => shelterCase.petId === petId)
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
}

export const getAdminPetStatusEventsFromPrisma = async (
  petId: string,
): Promise<PetStatusEvent[]> => {
  const events = await getPrismaPetStatusEventRows(petId)

  return events.map((event) => ({
    id: event.id,
    petId: event.petId,
    fromStatus: event.fromStatus ? mapPetStatusValue(event.fromStatus) : undefined,
    toStatus: mapPetStatusValue(event.toStatus),
    date: event.date.toISOString(),
    createdAt: event.createdAt.toISOString(),
    caseId: event.caseId ?? undefined,
  }))
}

export { formatPrismaEnumValue }
