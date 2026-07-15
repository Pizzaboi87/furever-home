import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getRateLimitKeyHash,
  getRateLimitWindowStart,
} from '../../lib/server/rate-limit'

describe('public API rate limiting', () => {
  it('groups requests into deterministic fixed windows', () => {
    const start = getRateLimitWindowStart(
      new Date('2026-07-14T12:07:59.000Z'),
      10 * 60 * 1000,
    )

    assert.equal(start.toISOString(), '2026-07-14T12:00:00.000Z')
  })

  it('uses the first forwarded client address without storing the raw value', () => {
    const firstRequest = new Request('https://example.com/api/contact', {
      headers: {
        'x-forwarded-for': '203.0.113.10, 10.0.0.1',
      },
    })
    const secondRequest = new Request('https://example.com/api/contact', {
      headers: {
        'x-forwarded-for': '203.0.113.10',
      },
    })

    const firstHash = getRateLimitKeyHash(firstRequest, 'contact')
    const secondHash = getRateLimitKeyHash(secondRequest, 'contact')

    assert.equal(firstHash, secondHash)
    assert.notEqual(firstHash, '203.0.113.10')
    assert.equal(firstHash.length, 64)
  })

  it('keeps endpoint scopes separate for the same client', () => {
    const request = new Request('https://example.com', {
      headers: {
        'x-real-ip': '203.0.113.11',
      },
    })

    assert.notEqual(
      getRateLimitKeyHash(request, 'contact'),
      getRateLimitKeyHash(request, 'stripe-checkout'),
    )
  })
})
