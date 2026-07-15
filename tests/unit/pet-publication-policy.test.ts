import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getPublicStatusForPetStatus,
  isInactivePrismaPetStatus,
  restoreStatusForPublish,
  shouldForceHiddenFromPublic,
} from '@/lib/pet-publication-policy'
import {
  PRISMA_PET_PUBLIC_STATUS,
  PRISMA_PET_STATUS,
} from '@/lib/server/prisma-pet-enums'

describe('pet publication policy', () => {
  it('treats adopted, unavailable, and hidden pets as inactive', () => {
    assert.equal(isInactivePrismaPetStatus(PRISMA_PET_STATUS.ADOPTED), true)
    assert.equal(isInactivePrismaPetStatus(PRISMA_PET_STATUS.UNAVAILABLE), true)
    assert.equal(isInactivePrismaPetStatus(PRISMA_PET_STATUS.HIDDEN), true)
    assert.equal(isInactivePrismaPetStatus(PRISMA_PET_STATUS.AVAILABLE), false)
  })

  it('forces inactive pets to be hidden from the public site', () => {
    assert.equal(shouldForceHiddenFromPublic(PRISMA_PET_STATUS.ADOPTED), true)
    assert.equal(shouldForceHiddenFromPublic(PRISMA_PET_STATUS.RESERVED), false)
  })

  it('restores hidden and unavailable pets to available before publishing', () => {
    assert.equal(
      restoreStatusForPublish(PRISMA_PET_STATUS.HIDDEN),
      PRISMA_PET_STATUS.AVAILABLE,
    )
    assert.equal(
      restoreStatusForPublish(PRISMA_PET_STATUS.UNAVAILABLE),
      PRISMA_PET_STATUS.AVAILABLE,
    )
    assert.equal(
      restoreStatusForPublish(PRISMA_PET_STATUS.RESERVED),
      PRISMA_PET_STATUS.RESERVED,
    )
  })

  it('maps unpublished active pets to draft', () => {
    assert.equal(
      getPublicStatusForPetStatus({
        status: PRISMA_PET_STATUS.AVAILABLE,
        isPublished: false,
      }),
      PRISMA_PET_PUBLIC_STATUS.DRAFT,
    )
  })

  it('preserves adopted status even when the pet is unpublished', () => {
    assert.equal(
      getPublicStatusForPetStatus({
        status: PRISMA_PET_STATUS.ADOPTED,
        isPublished: false,
      }),
      PRISMA_PET_PUBLIC_STATUS.ADOPTED,
    )
  })

  it('maps reservation workflow states to the reserved public status', () => {
    for (const status of [
      PRISMA_PET_STATUS.RESERVED,
      PRISMA_PET_STATUS.ADOPTION_IN_PROGRESS,
    ]) {
      assert.equal(
        getPublicStatusForPetStatus({ status, isPublished: true }),
        PRISMA_PET_PUBLIC_STATUS.RESERVED,
      )
    }
  })
})
