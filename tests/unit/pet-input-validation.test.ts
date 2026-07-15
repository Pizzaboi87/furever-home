import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  validateCreatePetInput,
  validatePetId,
  validateUpdatePetInput,
} from '@/lib/admin/pet-validation'

const validPetInput: Parameters<typeof validateCreatePetInput>[0] = {
  name: 'Daisy',
  species: 'dog',
  description: 'A friendly and calm dog looking for a patient home.',
  age: 4,
  gender: 'female',
  weight: 18.5,
  image: 'https://example.com/daisy.jpg',
  status: 'available',
}

describe('pet input validation', () => {
  it('accepts a valid minimal pet input', () => {
    const result = validateCreatePetInput(validPetInput)

    assert.equal(result.name, 'Daisy')
    assert.equal(result.age, 4)
    assert.equal(result.status, 'available')
  })

  it('trims textual pet fields', () => {
    const result = validateCreatePetInput({
      ...validPetInput,
      name: ' Daisy ',
      species: ' dog ',
      gender: ' female ',
      image: ' https://example.com/daisy.jpg ',
      size: ' medium ',
    })

    assert.equal(result.name, 'Daisy')
    assert.equal(result.species, 'dog')
    assert.equal(result.gender, 'female')
    assert.equal(result.size, 'medium')
  })

  it('requires a useful description', () => {
    assert.throws(
      () =>
        validateCreatePetInput({
          ...validPetInput,
          description: 'Too short',
        }),
      /at least 10 characters/i,
    )
  })

  it('rejects negative age and weight values', () => {
    assert.throws(
      () => validateCreatePetInput({ ...validPetInput, age: -1 }),
      /Age cannot be negative/i,
    )
    assert.throws(
      () => validateCreatePetInput({ ...validPetInput, weight: -0.1 }),
      /Weight cannot be negative/i,
    )
  })

  it('rejects unsupported pet statuses', () => {
    const input = {
      ...validPetInput,
      status: 'pending_review',
    } as Parameters<typeof validateCreatePetInput>[0]

    assert.throws(() => validateCreatePetInput(input))
  })

  it('validates nested pet images and trims their metadata', () => {
    const result = validateCreatePetInput({
      ...validPetInput,
      images: [
        {
          url: ' https://example.com/daisy-primary.jpg ',
          alt: ' Daisy portrait ',
          sortOrder: 0,
          isPrimary: true,
          width: 1200,
          height: 800,
        },
      ],
    })

    assert.equal(result.images?.[0]?.url, 'https://example.com/daisy-primary.jpg')
    assert.equal(result.images?.[0]?.alt, 'Daisy portrait')
  })

  it('rejects negative image dimensions and invalid dates', () => {
    assert.throws(() =>
      validateCreatePetInput({
        ...validPetInput,
        images: [
          {
            url: 'https://example.com/daisy.jpg',
            width: -1,
          },
        ],
      }),
    )

    assert.throws(
      () => validateCreatePetInput({ ...validPetInput, lastUpdated: 'not-a-date' }),
      /valid date/i,
    )
  })

  it('requires a pet id and valid publication action on update', () => {
    assert.throws(() =>
      validateUpdatePetInput({
        ...validPetInput,
        petId: ' ',
      }),
    )

    const invalidAction = {
      ...validPetInput,
      petId: 'pet-0001',
      publicationAction: 'unpublish',
    } as unknown as Parameters<typeof validateUpdatePetInput>[0]

    assert.throws(() => validateUpdatePetInput(invalidAction))
  })

  it('trims standalone pet ids', () => {
    assert.equal(validatePetId(' pet-0001 '), 'pet-0001')
    assert.throws(() => validatePetId(' '), /Pet ID is required/i)
  })
})
