import type { PrismaClient } from '@prisma/client'
import {
  resolveSeedShelterCaseState,
  toContactChannel,
  toDate,
  toPrismaCaseEventActorType,
  toPrismaCasePriority,
  toPrismaCaseScope,
  toPrismaCaseType,
  toPrismaInteractionDirection,
  toPrismaReferenceSystem,
  toPrismaReferenceType,
  toRequiredDate,
} from './seed-normalizers'
import type {
  RawCaseEvent,
  RawCaseInteraction,
  RawCaseNote,
  RawPerson,
  RawShelterCase,
  RawShelterEvent,
  RawStaff,
} from './seed-types'

export const seedShelterEvents = async (
  prisma: PrismaClient,
  events: RawShelterEvent[],
) => {
  for (const event of events) {
    await prisma.shelterEvent.upsert({
      where: { id: event.id },
      update: {
        name: event.name,
        type: event.type,
        date: toRequiredDate(event.date),
        location: event.location ?? null,
        notes: event.notes ?? null,
        createdAt: toDate(event.createdAt),
      },
      create: {
        id: event.id,
        name: event.name,
        type: event.type,
        date: toRequiredDate(event.date),
        location: event.location ?? null,
        notes: event.notes ?? null,
        createdAt: toDate(event.createdAt),
      },
    })
  }
}

const normalizeLegacyShelterCaseIds = async (
  prisma: PrismaClient,
  cases: RawShelterCase[],
) => {
  for (const shelterCase of cases) {
    if (!shelterCase.caseNumber || shelterCase.id !== shelterCase.caseNumber) {
      continue
    }

    const existingCase = await prisma.shelterCase.findUnique({
      where: { caseNumber: shelterCase.caseNumber },
      select: { id: true },
    })

    if (!existingCase || existingCase.id === shelterCase.id) {
      continue
    }

    const targetCase = await prisma.shelterCase.findUnique({
      where: { id: shelterCase.id },
      select: { id: true },
    })

    if (targetCase) {
      throw new Error(
        `Cannot normalize legacy case id ${existingCase.id} to ${shelterCase.id}: target id already exists.`,
      )
    }

    await prisma.shelterCase.update({
      where: { id: existingCase.id },
      data: { id: shelterCase.id },
    })
  }
}

const getSafeLegacyCaseNumber = async (
  prisma: PrismaClient,
  shelterCase: RawShelterCase,
) => {
  if (!shelterCase.caseNumber) {
    return null
  }

  const existingCase = await prisma.shelterCase.findUnique({
    where: { caseNumber: shelterCase.caseNumber },
    select: { id: true },
  })

  if (!existingCase || existingCase.id === shelterCase.id) {
    return shelterCase.caseNumber
  }

  throw new Error(
    `Case number ${shelterCase.caseNumber} already belongs to ${existingCase.id}, not ${shelterCase.id}.`,
  )
}

export const seedShelterCases = async (
  prisma: PrismaClient,
  cases: RawShelterCase[],
  validPetIds: Set<string>,
  currentPetIds: Set<string>,
) => {
  await normalizeLegacyShelterCaseIds(prisma, cases)

  for (const shelterCase of cases) {
    const safeCaseNumber = await getSafeLegacyCaseNumber(prisma, shelterCase)
    const resolvedCaseState = resolveSeedShelterCaseState(
      shelterCase,
      validPetIds,
      currentPetIds,
    )

    const data = {
      caseNumber: safeCaseNumber,
      type: toPrismaCaseType(shelterCase.type),
      scope: toPrismaCaseScope(shelterCase.scope),
      status: resolvedCaseState.status,
      priority: toPrismaCasePriority(shelterCase.priority),
      source: shelterCase.source ? toContactChannel(shelterCase.source) : null,
      personId: shelterCase.personId,
      petId: resolvedCaseState.petId,
      relatedEventId: shelterCase.relatedEventId ?? null,
      relatedDonationId: shelterCase.relatedDonationId ?? null,
      subject: shelterCase.subject,
      summary: shelterCase.summary ?? null,
      assignedStaffId: shelterCase.assignedStaffId ?? null,
      outcome: resolvedCaseState.outcome,
      nextFollowUpAt: resolvedCaseState.nextFollowUpAt,
      nextFollowUpNote: shelterCase.nextFollowUpNote ?? null,
      tags: shelterCase.tags ?? [],
      createdAt: toDate(shelterCase.createdAt),
      updatedAt:
        toDate(shelterCase.updatedAt) ??
        toDate(shelterCase.createdAt) ??
        new Date(),
      closedAt: resolvedCaseState.closedAt,
    }

    await prisma.shelterCase.upsert({
      where: { id: shelterCase.id },
      update: data,
      create: { id: shelterCase.id, ...data },
    })
  }
}

export const seedCaseInteractions = async (
  prisma: PrismaClient,
  interactions: RawCaseInteraction[],
  validStaffIds: Set<string>,
  validPersonIds: Set<string>,
) => {
  for (const interaction of interactions) {
    const data = {
      caseId: interaction.caseId,
      channel: toContactChannel(interaction.channel),
      direction: toPrismaInteractionDirection(interaction.direction),
      occurredAt: toRequiredDate(interaction.occurredAt ?? interaction.loggedAt),
      loggedAt: toRequiredDate(interaction.loggedAt ?? interaction.occurredAt),
      loggedByStaffId:
        interaction.loggedByStaffId && validStaffIds.has(interaction.loggedByStaffId)
          ? interaction.loggedByStaffId
          : null,
      contactPersonId:
        interaction.contactPersonId && validPersonIds.has(interaction.contactPersonId)
          ? interaction.contactPersonId
          : null,
      contactPoint: interaction.contactPoint ?? null,
      referenceSystem: toPrismaReferenceSystem(interaction.externalReference?.system),
      referenceType: toPrismaReferenceType(interaction.externalReference?.type),
      reference: interaction.externalReference?.reference ?? null,
      summary: interaction.summary,
      actionTaken: interaction.actionTaken ?? null,
      nextStep: interaction.nextStep ?? null,
      visibility: interaction.visibility ?? 'internal',
    }

    await prisma.caseInteraction.upsert({
      where: { id: interaction.id },
      update: data,
      create: { id: interaction.id, ...data },
    })
  }
}

export const seedCaseNotes = async (
  prisma: PrismaClient,
  notes: RawCaseNote[],
  validStaffIds: Set<string>,
) => {
  for (const note of notes) {
    const data = {
      caseId: note.caseId,
      staffId: note.staffId && validStaffIds.has(note.staffId) ? note.staffId : null,
      body: note.body,
      tags: note.tags ?? [],
      visibility: note.visibility ?? 'internal',
      createdAt: toDate(note.createdAt),
    }

    await prisma.caseNote.upsert({
      where: { id: note.id },
      update: data,
      create: { id: note.id, ...data },
    })
  }
}

const getCaseEventActor = (
  event: RawCaseEvent,
  validStaffIds: Set<string>,
  peopleById: Map<string, RawPerson>,
  staffById: Map<string, RawStaff>,
) => {
  const actorType = toPrismaCaseEventActorType(event.actorType)
  const staff = event.actorId ? staffById.get(event.actorId) : undefined
  const person = event.actorId ? peopleById.get(event.actorId) : undefined

  return {
    actorType,
    actorId: staff && validStaffIds.has(staff.id) ? staff.id : null,
    actorName: event.actorName ?? staff?.name ?? person?.name ?? null,
    actorRole: event.actorRole ?? staff?.role ?? null,
  }
}

export const seedCaseEvents = async (
  prisma: PrismaClient,
  events: RawCaseEvent[],
  validStaffIds: Set<string>,
  people: RawPerson[],
  staff: RawStaff[],
) => {
  const peopleById = new Map(people.map((person) => [person.id, person]))
  const staffById = new Map(staff.map((member) => [member.id, member]))

  for (const event of events) {
    const data = {
      caseId: event.caseId,
      type: event.type,
      title: event.title,
      detail: event.detail ?? null,
      createdAt: toDate(event.createdAt),
      ...getCaseEventActor(event, validStaffIds, peopleById, staffById),
    }

    await prisma.caseEvent.upsert({
      where: { id: event.id },
      update: data,
      create: { id: event.id, ...data },
    })
  }
}
