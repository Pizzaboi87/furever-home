import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  isClosedCaseStatus,
  isCompletedAdoptionStatus,
  isDecidedApplicationStatus,
  isOpenCaseStatus,
} from '@/lib/admin/domain/case-lifecycle'
import {
  assertCaseAllowsStructuredRecordUpdate,
  assertCaseStatusTransition,
} from '@/lib/admin/validation/domain/case-status-validation'
import { PRISMA_CASE_STATUS } from '@/lib/admin/case-write/case-write-support'

describe('case lifecycle', () => {
  it('normalizes aliases and whitespace when identifying closed cases', () => {
    assert.equal(isClosedCaseStatus('  CANCELED  '), true)
    assert.equal(isClosedCaseStatus('withdrawn'), true)
    assert.equal(isClosedCaseStatus('waiting_on_staff'), false)
  })

  it('does not classify an empty status as open', () => {
    assert.equal(isOpenCaseStatus(''), false)
    assert.equal(isOpenCaseStatus(null), false)
  })

  it('recognizes decided and completed application statuses', () => {
    assert.equal(isDecidedApplicationStatus('approved'), true)
    assert.equal(isDecidedApplicationStatus('withdrawn'), true)
    assert.equal(isCompletedAdoptionStatus('completed'), true)
    assert.equal(isCompletedAdoptionStatus('approved'), false)
  })
})

describe('case status validation', () => {
  it('requires an outcome before closing a case', () => {
    assert.throws(
      () =>
        assertCaseStatusTransition({
          currentStatus: PRISMA_CASE_STATUS.OPEN,
          nextStatus: PRISMA_CASE_STATUS.CLOSED,
          outcome: '   ',
        }),
      /outcome is required/i,
    )
  })

  it('prevents reopening a closed case through general management', () => {
    assert.throws(
      () =>
        assertCaseStatusTransition({
          currentStatus: PRISMA_CASE_STATUS.CLOSED,
          nextStatus: PRISMA_CASE_STATUS.OPEN,
          outcome: 'Previously resolved',
        }),
      /cannot be reopened/i,
    )
  })

  it('allows a no-op update on an already closed case', () => {
    assert.doesNotThrow(() =>
      assertCaseStatusTransition({
        currentStatus: PRISMA_CASE_STATUS.CLOSED,
        nextStatus: PRISMA_CASE_STATUS.CLOSED,
        outcome: 'Resolved successfully',
      }),
    )
  })

  it('blocks structured record updates after closure', () => {
    assert.throws(
      () => assertCaseAllowsStructuredRecordUpdate(PRISMA_CASE_STATUS.COMPLETED),
      /cannot be changed after the case is closed/i,
    )
  })
})
