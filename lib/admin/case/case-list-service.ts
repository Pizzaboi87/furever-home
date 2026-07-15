import type {
  AdminPetCase,
  CasePriority,
  CaseScope,
  CaseStatus,
  CaseType,
  ShelterCase,
} from '@/lib/admin/domain'

import type { PrismaAdminCaseRow } from './case-repository'

type PrismaCaseInteraction = PrismaAdminCaseRow['interactions'][number]
type PrismaCaseNote = PrismaAdminCaseRow['notes'][number]
type PrismaCaseEvent = PrismaAdminCaseRow['events'][number]
type PrismaCaseActivityEvent = PrismaAdminCaseRow['activityEvents'][number]
import { getPrismaAdminCaseRows } from './case-repository'
import { toDomainEnumValue, toIsoString } from './case-utils'

const getLatestCaseTimestamp = (shelterCase: PrismaAdminCaseRow): string => {
  return [
    toIsoString(shelterCase.updatedAt),
    toIsoString(shelterCase.createdAt),
    ...shelterCase.interactions.map((item: PrismaCaseInteraction) => toIsoString(item.loggedAt)),
    ...shelterCase.notes.map((item: PrismaCaseNote) => toIsoString(item.createdAt)),
    ...shelterCase.events.map((item: PrismaCaseEvent) => toIsoString(item.createdAt)),
    ...shelterCase.activityEvents.map((item: PrismaCaseActivityEvent) => toIsoString(item.createdAt)),
  ].sort((a, b) => b.localeCompare(a))[0]
}

export const getFirstPrismaInteraction = (
  shelterCase: Pick<PrismaAdminCaseRow, 'interactions'>,
) => {
  return shelterCase.interactions
    .slice()
    .sort((a: PrismaCaseInteraction, b: PrismaCaseInteraction) =>
      a.loggedAt.getTime() - b.loggedAt.getTime(),
    )[0]
}

export const mapPrismaCaseToAdminPetCase = (
  shelterCase: PrismaAdminCaseRow,
): AdminPetCase => {
  const firstInteraction = getFirstPrismaInteraction(shelterCase)

  return {
    id: shelterCase.id,
    caseNumber: shelterCase.caseNumber ?? undefined,
    type: toDomainEnumValue<CaseType>(shelterCase.type) ?? 'general_question',
    scope: toDomainEnumValue<CaseScope>(shelterCase.scope) ?? 'general',
    status: toDomainEnumValue<CaseStatus>(shelterCase.status) ?? 'new',
    priority: toDomainEnumValue<CasePriority>(shelterCase.priority) ?? 'medium',
    source: toDomainEnumValue(shelterCase.source) as ShelterCase['source'],
    personId: shelterCase.personId,
    petId: shelterCase.petId,
    relatedPetId: shelterCase.petId,
    relatedEventId: shelterCase.relatedEventId,
    relatedDonationId: shelterCase.relatedDonationId,
    subject: shelterCase.subject,
    summary: shelterCase.summary ?? undefined,
    assignedStaffId: shelterCase.assignedStaffId,
    assignedStaff: shelterCase.assignedStaff?.name ?? undefined,
    createdAt: toIsoString(shelterCase.createdAt),
    updatedAt: toIsoString(shelterCase.updatedAt),
    closedAt: shelterCase.closedAt ? toIsoString(shelterCase.closedAt) : null,
    outcome: shelterCase.outcome,
    nextFollowUpAt: shelterCase.nextFollowUpAt
      ? toIsoString(shelterCase.nextFollowUpAt)
      : null,
    nextFollowUpNote: shelterCase.nextFollowUpNote,
    tags: shelterCase.tags,
    applicantName: shelterCase.person?.name ?? 'Unknown person',
    channel:
      toDomainEnumValue(firstInteraction?.channel) ??
      toDomainEnumValue(shelterCase.source),
    score: shelterCase.adoptionApplication?.score ?? undefined,
    sourceRecordId: shelterCase.adoptionApplication?.sourceApplicationId ?? undefined,
    lastActivityAt: getLatestCaseTimestamp(shelterCase),
  }
}

export const getAdminCasesFromPrisma = async (): Promise<AdminPetCase[]> => {
  return (await getPrismaAdminCaseRows())
    .map(mapPrismaCaseToAdminPetCase)
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
}
