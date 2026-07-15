import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { AdminPet, AdminPetCase, Person } from '@/lib/admin/domain'
import { mapPetToGraphQL } from '@/lib/graphql/public-pet-schema'
import {
  mapAdminCaseToGraphQL,
  mapNoteToGraphQL,
  mapTimelineItemToGraphQL,
} from '@/lib/graphql/schema/mappers/case-schema-mappers'
import { mapPersonToGraphQL } from '@/lib/graphql/schema/mappers/person-schema-mappers'
import { mapPetActivityItemToGraphQL } from '@/lib/graphql/schema/mappers/pet-schema-mappers'
import { formatPersonAddress } from '@/lib/graphql/schema/mappers/schema-mapper-utils'

const basePet: AdminPet = {
  id: 'pet-0001',
  name: 'Luna',
  species: 'cat',
  description: 'Calm and curious.',
  age: 3,
  gender: 'female',
  weight: 4.5,
  image: '/luna.jpg',
  status: 'available',
}

const baseCase: AdminPetCase = {
  id: 'case-1',
  type: 'general_question',
  scope: 'general',
  status: 'open',
  personId: 'person-1',
  subject: 'Question about Luna',
  createdAt: '2026-07-14T10:00:00.000Z',
  updatedAt: '2026-07-14T11:00:00.000Z',
  lastActivityAt: '2026-07-14T11:00:00.000Z',
}

describe('GraphQL schema mappers', () => {
  it('maps pet defaults and image defaults into the GraphQL contract', () => {
    const result = mapPetToGraphQL({
      ...basePet,
      images: [{ url: '/luna-detail.jpg' }],
    })

    assert.equal(result.publicStatus, 'available')
    assert.equal(result.isPublished, true)
    assert.equal(result.images[0]?.id, '/luna-detail.jpg')
    assert.equal(result.images[0]?.sortOrder, 0)
    assert.equal(result.images[0]?.isPrimary, false)
    assert.equal(result.images[0]?.thumbnailUrl, null)
  })

  it('preserves explicit pet publication fields', () => {
    const result = mapPetToGraphQL({
      ...basePet,
      publicStatus: 'reserved',
      isPublished: false,
      publishedAt: '2026-07-10T10:00:00.000Z',
      hiddenAt: '2026-07-11T10:00:00.000Z',
    })

    assert.equal(result.publicStatus, 'reserved')
    assert.equal(result.isPublished, false)
    assert.equal(result.publishedAt, '2026-07-10T10:00:00.000Z')
    assert.equal(result.hiddenAt, '2026-07-11T10:00:00.000Z')
  })

  it('maps case defaults and relatedPetId fallback', () => {
    const result = mapAdminCaseToGraphQL({
      ...baseCase,
      relatedPetId: 'pet-0001',
    })

    assert.equal(result.petId, 'pet-0001')
    assert.equal(result.priority, 'medium')
    assert.equal(result.source, 'manual')
    assert.equal(result.applicantName, 'Unknown applicant')
    assert.deepEqual(result.tags, [])
  })

  it('maps person addresses and nullable optional values', () => {
    const person: Person = {
      id: 'person-1',
      name: 'Mia Green',
      address: {
        line1: '12 Main Street',
        city: 'Athens',
        country: 'Greece',
      },
      createdAt: '2026-07-14T10:00:00.000Z',
    }

    const result = mapPersonToGraphQL(person)

    assert.equal(result.address, '12 Main Street, Athens, Greece')
    assert.equal(result.email, null)
    assert.equal(result.phone, null)
    assert.deepEqual(result.tags, [])
    assert.deepEqual(result.interestAreas, [])
  })

  it('returns null for an empty structured address', () => {
    assert.equal(formatPersonAddress({}), null)
  })

  it('maps note and timeline optional staff fields to null', () => {
    const note = mapNoteToGraphQL({
      id: 'note-1',
      caseId: 'case-1',
      staffId: 'staff-1',
      body: 'Follow up tomorrow.',
      visibility: 'internal',
      createdAt: '2026-07-14T10:00:00.000Z',
    })
    const timeline = mapTimelineItemToGraphQL({
      id: 'event-1',
      type: 'status_changed',
      title: 'Status changed',
      detail: 'Open to waiting on staff',
      createdAt: '2026-07-14T10:00:00.000Z',
    })

    assert.deepEqual(note.tags, [])
    assert.equal(note.staffName, null)
    assert.equal(note.isPinned, false)
    assert.equal(timeline.actorName, null)
    assert.equal(timeline.caseId, null)
  })

  it('normalizes pet activity status values', () => {
    const result = mapPetActivityItemToGraphQL({
      id: 'status-1',
      kind: 'status',
      type: 'pet_status_changed',
      title: 'Status changed',
      detail: 'Available to reserved',
      createdAt: '2026-07-14T10:00:00.000Z',
      statusFrom: null,
      statusTo: 'reserved',
    })

    assert.equal(result.statusFrom, null)
    assert.equal(result.statusTo, 'reserved')
  })
})
