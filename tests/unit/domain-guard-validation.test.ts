import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  assertPetCanContinueAdoptionWorkflow,
  assertPetCanReceiveOpenCase,
  assertPetPublicationState,
  assertPetStatusSupportsApplicationWorkload,
} from '@/lib/admin/validation/domain/pet-domain-validation'
import {
  assertPersonCanBeAnonymized,
  assertPersonCanBeUpdated,
  type PersonPrivacyRecord,
} from '@/lib/admin/validation/domain/person-domain-validation'
import { PRISMA_PET_STATUS } from '@/lib/server/prisma-pet-enums'

const activePerson: PersonPrivacyRecord = {
  name: 'Mia Green',
  email: 'mia@example.com',
  phone: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  state: null,
  zip: null,
  country: null,
}

const anonymizedPerson: PersonPrivacyRecord = {
  ...activePerson,
  name: 'Deleted contact',
  email: null,
}

describe('person privacy guards', () => {
  it('allows an active person to be updated', () => {
    assert.doesNotThrow(() => assertPersonCanBeUpdated(activePerson))
  })

  it('prevents updating an anonymized person', () => {
    assert.throws(
      () => assertPersonCanBeUpdated(anonymizedPerson),
      /cannot be edited/i,
    )
  })

  it('prevents anonymization while active cases exist', () => {
    assert.throws(
      () => assertPersonCanBeAnonymized(activePerson, 1),
      /active cases/i,
    )
  })

  it('allows anonymization when no active cases remain', () => {
    assert.doesNotThrow(() => assertPersonCanBeAnonymized(activePerson, 0))
  })
})

describe('pet domain guards', () => {
  it('prevents linking an inactive pet to a new open case', () => {
    assert.throws(
      () =>
        assertPetCanReceiveOpenCase({
          id: 'pet-1',
          status: PRISMA_PET_STATUS.ADOPTED,
        }),
      /cannot be linked/i,
    )
  })

  it('prevents publishing inactive pets', () => {
    assert.throws(
      () =>
        assertPetPublicationState({
          status: PRISMA_PET_STATUS.HIDDEN,
          isPublished: true,
        }),
      /cannot be published/i,
    )
  })

  it('prevents deactivating a pet with an open application', () => {
    assert.throws(
      () =>
        assertPetStatusSupportsApplicationWorkload({
          currentStatus: PRISMA_PET_STATUS.AVAILABLE,
          nextStatus: PRISMA_PET_STATUS.ADOPTED,
          applicationStatuses: ['SCREENING', 'DECLINED'],
        }),
      /open adoption applications/i,
    )
  })

  it('allows deactivation after every application is closed', () => {
    assert.doesNotThrow(() =>
      assertPetStatusSupportsApplicationWorkload({
        currentStatus: PRISMA_PET_STATUS.AVAILABLE,
        nextStatus: PRISMA_PET_STATUS.ADOPTED,
        applicationStatuses: ['COMPLETED', 'DECLINED'],
      }),
    )
  })

  it('only completes adoption for reserved or in-progress pets', () => {
    assert.throws(
      () =>
        assertPetCanContinueAdoptionWorkflow(
          { id: 'pet-1', status: PRISMA_PET_STATUS.AVAILABLE },
          'complete_adoption',
        ),
      /only be completed for a reserved pet/i,
    )

    assert.doesNotThrow(() =>
      assertPetCanContinueAdoptionWorkflow(
        { id: 'pet-1', status: PRISMA_PET_STATUS.RESERVED },
        'complete_adoption',
      ),
    )
  })
})
