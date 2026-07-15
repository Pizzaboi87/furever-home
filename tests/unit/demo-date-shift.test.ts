import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getUtcDateKey,
  shouldShiftMonthLabels,
} from '../../lib/server/demo-date-shift/demo-date-shift-utils'

describe('daily demo date shift utilities', () => {
  it('uses the UTC calendar date as the idempotency key', () => {
    assert.equal(
      getUtcDateKey(new Date('2026-07-15T23:59:59.000Z')),
      '2026-07-15',
    )
  })

  it('advances month-only dashboard labels on the first UTC day', () => {
    assert.equal(
      shouldShiftMonthLabels(new Date('2026-08-01T00:00:00.000Z')),
      true,
    )
  })

  it('keeps month-only dashboard labels unchanged on other days', () => {
    assert.equal(
      shouldShiftMonthLabels(new Date('2026-08-02T00:00:00.000Z')),
      false,
    )
  })
})
