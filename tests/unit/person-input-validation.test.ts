import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  validateAnonymizePersonInput,
  validateCreatePersonInput,
  validateUpdatePersonInput,
} from '@/lib/admin/person-validation'

describe('person input validation', () => {
  it('trims create-person fields and removes empty list values', () => {
    const result = validateCreatePersonInput({
      name: '  Mia Green  ',
      email: ' mia@example.com ',
      phone: '  +1 555 0100  ',
      address: '   ',
      preferredContactMethod: ' email ',
      tags: [' adopter ', '', ' priority '],
    })

    assert.equal(result.name, 'Mia Green')
    assert.equal(result.email, 'mia@example.com')
    assert.equal(result.phone, '+1 555 0100')
    assert.equal(result.address, undefined)
    assert.equal(result.preferredContactMethod, 'email')
    assert.deepEqual(result.tags, ['adopter', 'priority'])
  })

  it('rejects a one-character contact name', () => {
    assert.throws(
      () =>
        validateCreatePersonInput({
          name: 'A',
        }),
      /at least 2 characters/i,
    )
  })

  it('rejects an invalid email address', () => {
    assert.throws(
      () =>
        validateCreatePersonInput({
          name: 'Mia Green',
          email: 'not-an-email',
        }),
      /valid email address/i,
    )
  })

  it('rejects unsupported contact channels', () => {
    const input = {
      name: 'Mia Green',
      preferredContactMethod: 'carrier_pigeon',
    } as Parameters<typeof validateCreatePersonInput>[0]

    assert.throws(() => validateCreatePersonInput(input))
  })

  it('accepts and normalizes complete update input', () => {
    const result = validateUpdatePersonInput({
      personId: ' person-0001 ',
      name: ' Mia Green ',
      profileType: ' adopter ',
      householdType: ' apartment ',
      hasOtherPets: false,
      interestAreas: [' cats ', ' fostering '],
      tags: [' priority '],
    })

    assert.equal(result.personId, 'person-0001')
    assert.equal(result.profileType, 'adopter')
    assert.equal(result.householdType, 'apartment')
    assert.deepEqual(result.interestAreas, ['cats', 'fostering'])
  })

  it('requires both anonymization identifiers', () => {
    assert.throws(
      () =>
        validateAnonymizePersonInput({
          personId: ' ',
          confirmationName: 'Mia Green',
        }),
      /Person ID is required/i,
    )

    assert.throws(
      () =>
        validateAnonymizePersonInput({
          personId: 'person-0001',
          confirmationName: ' ',
        }),
      /Confirmation name is required/i,
    )
  })
})
