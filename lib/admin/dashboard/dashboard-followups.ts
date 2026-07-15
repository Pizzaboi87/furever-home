import { formatInlineEnums } from '@/lib/pet-format'
import { isClosedCaseStatus } from '../domain'
import type { AdminPet, AdminPetCase, DashboardRecord } from '../domain'
import {
  getCasePetId,
  getFollowUpBucket,
  stringValue,
} from './dashboard-utils'

export const formatDashboardActivityText = (record: DashboardRecord): DashboardRecord => ({
  ...record,
  title: formatInlineEnums(stringValue(record.title)),
  detail: formatInlineEnums(stringValue(record.detail)),
})

export const buildFollowUpRecords = (
  cases: AdminPetCase[],
  petById: Map<string, AdminPet>,
): DashboardRecord[] => {
  return cases
    .filter((shelterCase) => {
      if (!shelterCase.nextFollowUpAt) {
        return false
      }

      return !isClosedCaseStatus(shelterCase.status)
    })
    .map((shelterCase) => {
      const petId = getCasePetId(shelterCase)
      const pet = petId ? petById.get(String(petId)) : undefined

      return {
        id: `follow-up-${shelterCase.id}`,
        caseId: shelterCase.id,
        caseNumber: shelterCase.caseNumber,
        subject: shelterCase.subject,
        status: shelterCase.status,
        priority: shelterCase.priority ?? 'medium',
        assignedStaff: shelterCase.assignedStaff,
        assignedStaffId: shelterCase.assignedStaffId,
        type: shelterCase.type,
        scope: shelterCase.scope,
        personId: shelterCase.personId,
        applicantName: shelterCase.applicantName ?? 'Unknown contact',
        petId: petId ?? undefined,
        petName: pet?.name,
        species: pet?.species,
        nextFollowUpAt: shelterCase.nextFollowUpAt,
        nextFollowUpNote: shelterCase.nextFollowUpNote,
        lastActivityAt: shelterCase.lastActivityAt,
        bucket: getFollowUpBucket(shelterCase.nextFollowUpAt),
      }
    })
    .sort((a, b) => {
      const dateCompare = stringValue(a.nextFollowUpAt).localeCompare(
        stringValue(b.nextFollowUpAt),
      )

      if (dateCompare !== 0) {
        return dateCompare
      }

      return stringValue(a.subject).localeCompare(stringValue(b.subject))
    })
}

