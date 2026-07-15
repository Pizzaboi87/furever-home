import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseValue as parseGraphQLValue } from 'graphql'

import { jsonScalar } from '@/lib/graphql/schema/json-scalar'

const parseLiteral = (source: string) => {
  const parser = jsonScalar.parseLiteral
  assert.ok(parser)
  return parser(parseGraphQLValue(source), undefined)
}

describe('GraphQL JSON scalar', () => {
  it('passes JSON-compatible runtime values through serialization', () => {
    const value = { petId: 'pet-0001', tags: ['new', 'featured'], active: true }

    assert.deepEqual(jsonScalar.serialize(value), value)
    assert.deepEqual(jsonScalar.parseValue(value), value)
  })

  it('parses scalar literals', () => {
    assert.equal(parseLiteral('"Luna"'), 'Luna')
    assert.equal(parseLiteral('42'), 42)
    assert.equal(parseLiteral('12.5'), 12.5)
    assert.equal(parseLiteral('true'), true)
    assert.equal(parseLiteral('null'), null)
  })

  it('parses nested list and object literals', () => {
    assert.deepEqual(
      parseLiteral('{ pet: { id: "pet-0001" }, scores: [1, 2.5], visible: true }'),
      {
        pet: { id: 'pet-0001' },
        scores: [1, 2.5],
        visible: true,
      },
    )
  })

  it('maps unsupported enum literals to null', () => {
    assert.equal(parseLiteral('AVAILABLE'), null)
  })
})
