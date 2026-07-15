import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { toClientSafePlainData } from '@/lib/graphql/plain-data'

describe('GraphQL client-safe serialization', () => {
  it('preserves JSON primitives and converts undefined to null at the root', () => {
    assert.equal(toClientSafePlainData('hello'), 'hello')
    assert.equal(toClientSafePlainData(42), 42)
    assert.equal(toClientSafePlainData(true), true)
    assert.equal(toClientSafePlainData(undefined), null)
  })

  it('converts dates and bigint values into serializable strings', () => {
    const result = toClientSafePlainData({
      createdAt: new Date('2026-07-14T12:00:00.000Z'),
      total: BigInt('9007199254740993'),
    })

    assert.deepEqual(result, {
      createdAt: '2026-07-14T12:00:00.000Z',
      total: '9007199254740993',
    })
  })

  it('removes undefined object properties while preserving null values', () => {
    const result = toClientSafePlainData({
      omitted: undefined,
      retained: null,
      nested: { value: undefined, name: 'Luna' },
    })

    assert.deepEqual(result, {
      retained: null,
      nested: { name: 'Luna' },
    })
  })

  it('converts undefined and NaN array entries to null', () => {
    assert.deepEqual(toClientSafePlainData([1, undefined, Number.NaN, 'pet']), [
      1,
      null,
      null,
      'pet',
    ])
  })

  it('uses custom JSON serializers before validating the result', () => {
    const value = {
      toJSON: () => ({ amount: '12.50', currency: 'USD' }),
    }

    assert.deepEqual(toClientSafePlainData(value), {
      amount: '12.50',
      currency: 'USD',
    })
  })

  it('supports objects with a null prototype', () => {
    const value = Object.assign(Object.create(null) as Record<string, unknown>, {
      id: 'pet-0001',
    })

    assert.deepEqual(toClientSafePlainData(value), { id: 'pet-0001' })
  })

  it('rejects circular references with the failing path', () => {
    const value: Record<string, unknown> = { id: 'case-1' }
    value.self = value

    assert.throws(
      () => toClientSafePlainData(value),
      /circular reference at self/i,
    )
  })

  it('rejects unsupported class instances with the failing path and type', () => {
    class UnsupportedValue {}

    assert.throws(
      () => toClientSafePlainData({ nested: new UnsupportedValue() }),
      /nested.*UnsupportedValue/i,
    )
  })
})
