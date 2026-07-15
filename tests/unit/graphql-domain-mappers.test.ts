import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  mapGraphQLCaseToDomain,
  mapGraphQLPersonToDomain,
  mapGraphQLPetActivityToDomain,
  mapGraphQLPetToDomain,
} from '@/lib/graphql/admin/admin-query-mappers'
import type {
  GraphQLAdminCase,
  GraphQLAdminPet,
  GraphQLPerson,
  GraphQLPetActivityItem,
} from '@/lib/graphql/admin/admin-query-types'

describe('GraphQL to domain mappers', () => {
  it('converts nullable pet fields back to optional domain fields', () => {
    const pet: GraphQLAdminPet = {
      id: 'pet-0001',
      name: 'Luna',
      species: 'cat',
      description: 'Calm and curious.',
      age: 3,
      gender: 'female',
      weight: 4.5,
      image: '/luna.jpg',
      imageCloudinaryPublicId: null,
      imageAlt: null,
      images: [],
      status: 'available',
      publicStatus: 'available',
      isPublished: true,
      publishedAt: null,
      hiddenAt: null,
      size: null,
      neutered: null,
      goodWithChildren: null,
      goodWithOtherAnimals: null,
      ageGroup: null,
      daysInShelter: null,
      createdAt: null,
      lastUpdated: null,
      applications: null,
    }

    const result = mapGraphQLPetToDomain(pet)

    assert.equal(result.publishedAt, undefined)
    assert.equal(result.hiddenAt, undefined)
    assert.equal(result.size, undefined)
    assert.equal(result.applications, undefined)
    assert.deepEqual(result.images, [])
  })

  it('maps GraphQL image nulls to optional domain image fields', () => {
    const pet: GraphQLAdminPet = {
      id: 'pet-0002',
      name: 'Max',
      species: 'dog',
      description: 'Friendly.',
      age: 5,
      gender: 'male',
      weight: 18,
      image: '/max.jpg',
      imageCloudinaryPublicId: null,
      imageAlt: null,
      images: [
        {
          id: 'image-1',
          petId: null,
          url: '/max-detail.jpg',
          thumbnailUrl: null,
          cloudinaryPublicId: null,
          alt: null,
          sortOrder: 1,
          isPrimary: true,
          width: null,
          height: null,
          createdAt: null,
          updatedAt: null,
        },
      ],
      status: 'available',
      publicStatus: 'available',
      isPublished: true,
      publishedAt: null,
      hiddenAt: null,
      size: null,
      neutered: null,
      goodWithChildren: null,
      goodWithOtherAnimals: null,
      ageGroup: null,
      daysInShelter: null,
      createdAt: null,
      lastUpdated: null,
      applications: null,
    }

    const image = mapGraphQLPetToDomain(pet).images?.[0]

    assert.equal(image?.petId, undefined)
    assert.equal(image?.thumbnailUrl, undefined)
    assert.equal(image?.width, undefined)
    assert.equal(image?.isPrimary, true)
  })

  it('maps case nullable values and mirrors petId as relatedPetId', () => {
    const shelterCase: GraphQLAdminCase = {
      id: 'case-1',
      caseNumber: null,
      type: 'general_question',
      scope: 'general',
      status: 'open',
      priority: 'medium',
      source: 'admin_created',
      personId: null,
      petId: 'pet-0001',
      subject: 'Question',
      summary: null,
      assignedStaffId: null,
      assignedStaff: null,
      createdAt: '2026-07-14T10:00:00.000Z',
      updatedAt: '2026-07-14T11:00:00.000Z',
      closedAt: null,
      outcome: null,
      nextFollowUpAt: null,
      nextFollowUpNote: null,
      tags: [],
      applicantName: 'Unknown applicant',
      channel: null,
      score: null,
      sourceRecordId: null,
      lastActivityAt: '2026-07-14T11:00:00.000Z',
    }

    const result = mapGraphQLCaseToDomain(shelterCase)

    assert.equal(result.personId, '')
    assert.equal(result.petId, 'pet-0001')
    assert.equal(result.relatedPetId, 'pet-0001')
    assert.equal(result.summary, undefined)
  })

  it('maps person nullable fields and preserves explicit timestamps', () => {
    const person: GraphQLPerson = {
      id: 'person-1',
      name: 'Mia Green',
      email: null,
      phone: null,
      address: null,
      preferredContactMethod: null,
      profileType: null,
      householdType: null,
      hasOtherPets: null,
      interestAreas: [],
      tags: [],
      createdAt: '2026-07-14T10:00:00.000Z',
      updatedAt: null,
    }

    const result = mapGraphQLPersonToDomain(person)

    assert.equal(result.email, undefined)
    assert.equal(result.address, undefined)
    assert.equal(result.createdAt, '2026-07-14T10:00:00.000Z')
    assert.equal(result.updatedAt, undefined)
  })

  it('converts pet activity null statuses into optional domain values', () => {
    const item: GraphQLPetActivityItem = {
      id: 'event-1',
      kind: 'status',
      type: 'pet_status_changed',
      title: 'Status changed',
      detail: 'Draft to available',
      createdAt: '2026-07-14T10:00:00.000Z',
      statusFrom: null,
      statusTo: 'available',
    }

    const result = mapGraphQLPetActivityToDomain(item)

    assert.equal(result.statusFrom, null)
    assert.equal(result.statusTo, 'available')
  })
})
