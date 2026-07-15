import { formatInlineEnums } from '@/lib/pet-format'
import type {
  AdminCaseTimelineItem,
  AdminPetCase,
  CasePriority,
  CaseScope,
  CaseStatus,
  CaseType,
  ShelterCase,
} from '@/lib/admin/domain'

import type { PrismaAdminCaseDetailRow } from '../case-repository'
import { toDomainEnumValue, toIsoString } from '../case-utils'
import type {
  PrismaCaseDetailActivityEvent,
  PrismaCaseDetailEvent,
  PrismaCaseDetailInteraction,
  PrismaCaseDetailNote,
} from './case-detail-mapper-types'

const getFirstInteraction = (shelterCase: PrismaAdminCaseDetailRow) => {
  return shelterCase.interactions
    .slice()
    .sort((a: PrismaCaseDetailInteraction, b: PrismaCaseDetailInteraction) =>
      a.loggedAt.getTime() - b.loggedAt.getTime(),
    )[0]
}

const getLatestDetailTimestamp = (shelterCase: PrismaAdminCaseDetailRow) => {
  return [
    toIsoString(shelterCase.updatedAt),
    toIsoString(shelterCase.createdAt),
    ...shelterCase.interactions.map((item: PrismaCaseDetailInteraction) => toIsoString(item.loggedAt)),
    ...shelterCase.notes.map((item: PrismaCaseDetailNote) => toIsoString(item.createdAt)),
    ...shelterCase.events.map((item: PrismaCaseDetailEvent) => toIsoString(item.createdAt)),
    ...shelterCase.activityEvents.map((item: PrismaCaseDetailActivityEvent) => toIsoString(item.createdAt)),
  ].sort((a, b) => b.localeCompare(a))[0]
}

export const mapDetailCase = (
  shelterCase: PrismaAdminCaseDetailRow,
): AdminPetCase => {
  const firstInteraction = getFirstInteraction(shelterCase)

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
    applicantName: shelterCase.person.name,
    channel:
      toDomainEnumValue(firstInteraction?.channel) ??
      toDomainEnumValue(shelterCase.source),
    score: shelterCase.adoptionApplication?.score ?? undefined,
    sourceRecordId: shelterCase.adoptionApplication?.sourceApplicationId ?? undefined,
    lastActivityAt: getLatestDetailTimestamp(shelterCase),
  }
}

export const mapCaseEvent = (
  event: PrismaCaseDetailEvent,
): AdminCaseTimelineItem => {
  return {
    id: event.id,
    type: event.type,
    title: formatInlineEnums(event.title),
    detail: formatInlineEnums(event.detail ?? ''),
    createdAt: toIsoString(event.createdAt),
    actorName: event.actorName,
    actorRole: event.actorRole,
  }
}
