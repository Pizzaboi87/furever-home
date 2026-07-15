import { formatLabel } from '@/lib/pet-format'
import type {
  CaseInteraction,
  CaseInteractionExternalReference,
  CaseNote,
} from '@/lib/admin/domain'

import { toDomainEnumValue, toIsoString } from '../case-utils'
import type {
  PrismaCaseDetailInteraction,
  PrismaCaseDetailNote,
} from './case-detail-mapper-types'

export const mapCaseInteraction = (
  interaction: PrismaCaseDetailInteraction,
): CaseInteraction => {
  const reference = interaction.reference ?? null

  return {
    id: interaction.id,
    caseId: interaction.caseId,
    channel: toDomainEnumValue(interaction.channel) as CaseInteraction['channel'],
    direction: toDomainEnumValue(interaction.direction) as CaseInteraction['direction'],
    occurredAt: toIsoString(interaction.occurredAt),
    loggedAt: toIsoString(interaction.loggedAt),
    loggedByStaffId: interaction.loggedByStaffId,
    loggedByStaffName: interaction.loggedByStaff?.name ?? null,
    loggedByStaffRole: interaction.loggedByStaff?.role
      ? formatLabel(toDomainEnumValue(interaction.loggedByStaff.role))
      : null,
    contactPersonId: interaction.contactPersonId,
    contactPoint: interaction.contactPoint,
    externalReference:
      interaction.referenceSystem || interaction.referenceType || reference
        ? {
            system: (toDomainEnumValue(interaction.referenceSystem) ?? 'manual') as CaseInteractionExternalReference['system'],
            type: (toDomainEnumValue(interaction.referenceType) ?? 'manual_note') as CaseInteractionExternalReference['type'],
            reference,
          }
        : undefined,
    summary: interaction.summary,
    actionTaken: interaction.actionTaken,
    nextStep: interaction.nextStep,
    visibility: 'internal',
  }
}

export const mapCaseNote = (note: PrismaCaseDetailNote): CaseNote => {
  return {
    id: note.id,
    caseId: note.caseId,
    staffId: note.staffId ?? '',
    staffName: note.staff?.name ?? null,
    staffRole: note.staff?.role
      ? formatLabel(toDomainEnumValue(note.staff.role))
      : null,
    body: note.body,
    createdAt: toIsoString(note.createdAt),
    tags: note.tags,
    visibility: 'internal',
  }
}
