import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  validateAddCaseNoteInput,
  validateCreateIncomingCaseInput,
  validateLogCaseInteractionInput,
  validateRunAdoptionWorkflowInput,
  validateUpdateAdoptionApplicationInput,
  validateUpdateCaseManagementInput,
  validateUpdateCaseStatusInput,
  validateUpdateDonationInquiryInput,
  validateUpdateVolunteerApplicationInput,
} from '@/lib/admin/case-validation'

const validIncomingCase: Parameters<typeof validateCreateIncomingCaseInput>[0] = {
  channel: 'admin_created',
  person: {
    name: 'Mia Green',
    email: 'mia@example.com',
  },
  type: 'general_question',
  subject: 'Question about adoption',
  message: 'The contact would like more information about the adoption process.',
}

describe('case input validation', () => {
  it('normalizes incoming case text and optional ids', () => {
    const result = validateCreateIncomingCaseInput({
      ...validIncomingCase,
      person: {
        id: ' person-0001 ',
        name: ' Mia Green ',
        email: ' mia@example.com ',
      },
      petId: ' pet-0001 ',
      subject: ' Adoption question ',
      assignedStaffId: ' staff-0001 ',
    })

    assert.equal(result.person.id, 'person-0001')
    assert.equal(result.person.name, 'Mia Green')
    assert.equal(result.petId, 'pet-0001')
    assert.equal(result.subject, 'Adoption question')
    assert.equal(result.assignedStaffId, 'staff-0001')
  })

  it('rejects invalid incoming channels, types, and emails', () => {
    const badChannel = {
      ...validIncomingCase,
      channel: 'social_media',
    } as unknown as Parameters<typeof validateCreateIncomingCaseInput>[0]
    const badType = {
      ...validIncomingCase,
      type: 'billing_dispute',
    } as unknown as Parameters<typeof validateCreateIncomingCaseInput>[0]

    assert.throws(() => validateCreateIncomingCaseInput(badChannel))
    assert.throws(() => validateCreateIncomingCaseInput(badType))
    assert.throws(() =>
      validateCreateIncomingCaseInput({
        ...validIncomingCase,
        person: { name: 'Mia Green', email: 'invalid' },
      }),
    )
  })

  it('requires note and interaction content', () => {
    assert.throws(
      () => validateAddCaseNoteInput({ caseId: 'FH-2026-0001', body: ' ' }),
      /Note is required/i,
    )
    assert.throws(() =>
      validateLogCaseInteractionInput({
        caseId: 'FH-2026-0001',
        channel: 'email',
        direction: 'inbound',
        summary: ' ',
      }),
    )
  })

  it('accepts valid internal interaction data', () => {
    const result = validateLogCaseInteractionInput({
      caseId: ' FH-2026-0001 ',
      channel: 'internal',
      direction: 'internal',
      summary: ' Reviewed application ',
      actionTaken: ' Added screening note ',
    })

    assert.equal(result.caseId, 'FH-2026-0001')
    assert.equal(result.summary, 'Reviewed application')
    assert.equal(result.actionTaken, 'Added screening note')
  })

  it('rejects invalid case status values', () => {
    const input = {
      caseId: 'FH-2026-0001',
      status: 'paused',
    } as Parameters<typeof validateUpdateCaseStatusInput>[0]

    assert.throws(() => validateUpdateCaseStatusInput(input))
  })

  it('accepts valid management priority and follow-up date', () => {
    const result = validateUpdateCaseManagementInput({
      caseId: 'FH-2026-0001',
      priority: 'high',
      status: 'waiting_on_staff',
      nextFollowUpAt: '2026-08-01T10:00:00.000Z',
      nextFollowUpNote: ' Call applicant tomorrow ',
    })

    assert.equal(result.nextFollowUpNote, 'Call applicant tomorrow')
  })

  it('rejects malformed follow-up dates and priorities', () => {
    assert.throws(
      () =>
        validateUpdateCaseManagementInput({
          caseId: 'FH-2026-0001',
          nextFollowUpAt: 'tomorrow morning',
        }),
      /valid date/i,
    )

    const badPriority = {
      caseId: 'FH-2026-0001',
      priority: 'critical',
    } as Parameters<typeof validateUpdateCaseManagementInput>[0]
    assert.throws(() => validateUpdateCaseManagementInput(badPriority))
  })

  it('validates non-negative donation and adoption numeric strings', () => {
    const donation = validateUpdateDonationInquiryInput({
      caseId: 'FH-2026-0001',
      amount: ' 25.50 ',
      currency: ' USD ',
    })
    assert.equal(donation.amount, '25.50')
    assert.equal(donation.currency, 'USD')

    assert.throws(
      () =>
        validateUpdateAdoptionApplicationInput({
          caseId: 'FH-2026-0001',
          score: '-1',
        }),
      /greater than or equal to 0/i,
    )
  })

  it('validates volunteer hours and orientation dates', () => {
    const result = validateUpdateVolunteerApplicationInput({
      caseId: 'FH-2026-0001',
      interestAreas: [' dog walking ', ' events '],
      orientationScheduledAt: '2026-08-01T10:00:00.000Z',
      volunteerHours: '2.5',
    })

    assert.deepEqual(result.interestAreas, ['dog walking', 'events'])

    assert.throws(() =>
      validateUpdateVolunteerApplicationInput({
        caseId: 'FH-2026-0001',
        volunteerHours: '-0.5',
      }),
    )
  })

  it('only accepts known adoption workflow actions', () => {
    const result = validateRunAdoptionWorkflowInput({
      caseId: 'FH-2026-0001',
      action: 'approve_application',
      petId: ' pet-0001 ',
      note: ' Approved after screening ',
    })

    assert.equal(result.petId, 'pet-0001')
    assert.equal(result.note, 'Approved after screening')

    const invalidAction = {
      caseId: 'FH-2026-0001',
      action: 'archive_application',
    } as Parameters<typeof validateRunAdoptionWorkflowInput>[0]
    assert.throws(() => validateRunAdoptionWorkflowInput(invalidAction))
  })
})
