import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildIncomingCasePreview,
  createIncomingCase,
  type CreateIncomingCaseInput,
} from '@/lib/admin/case-create/case-preview-service'

const createdAt = '2026-07-14T10:30:00.000Z'

const makeInput = (
  overrides: Partial<CreateIncomingCaseInput> = {},
): CreateIncomingCaseInput => ({
  channel: 'website_form',
  person: {
    name: 'Mia Green',
    email: 'mia@example.com',
  },
  petId: 'pet-0001',
  petName: 'Luna',
  type: 'general_question',
  subject: 'Question about Luna',
  message: 'Please call after 5 PM.',
  createdAt,
  ...overrides,
})

describe('incoming case preview service', () => {
  it('creates deterministic preview records without persistence markers', () => {
    const result = buildIncomingCasePreview(makeInput())

    assert.equal(result.mode, 'preview')
    assert.equal(result.wouldPersist, false)
    assert.equal(result.case.id, 'FH-2026-PREVIEW')
    assert.equal(result.person.id, 'person-preview')
    assert.equal(result.interaction.id, 'interaction-preview')
  })

  it('creates pet-related case and activity records when a pet is selected', () => {
    const result = createIncomingCase(makeInput())

    assert.equal(result.case.scope, 'pet_related')
    assert.equal(result.case.petId, 'pet-0001')
    assert.equal(result.activityEvent.petId, 'pet-0001')
    assert.equal(result.petActivityEvent?.title, 'Mia Green opened a case for Luna')
  })

  it('creates general cases without pet activity when no pet is selected', () => {
    const result = createIncomingCase(
      makeInput({ petId: null, petName: undefined }),
    )

    assert.equal(result.case.scope, 'general')
    assert.equal(result.case.petId, null)
    assert.equal(result.petActivityEvent, undefined)
  })

  it('prefers email as the website form contact point', () => {
    const result = createIncomingCase(
      makeInput({ person: { name: 'Mia', email: 'mia@example.com', phone: '+1 555' } }),
    )

    assert.equal(result.interaction.contactPoint, 'mia@example.com')
    assert.deepEqual(result.interaction.externalReference, {
      system: 'website',
      type: 'form_submission',
      reference: 'form-submission-202607141030-mia-example-com',
    })
  })

  it('uses the phone contact point and call reference for phone cases', () => {
    const result = createIncomingCase(
      makeInput({
        channel: 'phone',
        person: { name: 'Mia', email: 'mia@example.com', phone: '+1 555 0100' },
      }),
    )

    assert.equal(result.interaction.contactPoint, '+1 555 0100')
    assert.equal(
      result.interaction.externalReference?.reference,
      'call-202607141030-1-555-0100',
    )
  })

  it('marks manually created admin interactions as internal', () => {
    const result = createIncomingCase(
      makeInput({
        channel: 'admin_created',
        assignedStaffId: 'staff-1',
        assignedStaff: 'Emma Wilson',
      }),
    )

    assert.equal(result.interaction.direction, 'internal')
    assert.equal(result.caseEvent.actorType, 'staff')
    assert.equal(result.caseEvent.actorId, 'staff-1')
  })

  it('uses supplied persisted identifiers and deterministic child identifiers', () => {
    const result = createIncomingCase(makeInput(), {
      caseId: 'FH-2026-0704',
      personId: 'person-0704',
    })

    assert.equal(result.case.id, 'FH-2026-0704')
    assert.equal(result.person.id, 'person-0704')
    assert.equal(result.interaction.id, 'interaction-fh-2026-0704-2026-07-14t10-30-00-000z')
    assert.equal(result.caseEvent.id, 'case-event-fh-2026-0704-created-2026-07-14t10-30-00-000z')
  })

  it('preserves custom action and next-step text', () => {
    const result = createIncomingCase(
      makeInput({
        actionTaken: 'Sent the adoption guide.',
        nextStep: 'Call tomorrow.',
      }),
    )

    assert.equal(result.interaction.actionTaken, 'Sent the adoption guide.')
    assert.equal(result.interaction.nextStep, 'Call tomorrow.')
  })
})
