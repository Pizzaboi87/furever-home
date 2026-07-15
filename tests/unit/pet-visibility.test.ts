import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getPetPublicImageUrl,
  getPetPublicStatus,
  getPublicPetStatusBadgeLabel,
  isPublicPetAdoptable,
  isPublicPetStatus,
} from '@/lib/pet-visibility'

describe('public pet visibility', () => {
  it('prefers publicStatus over the internal status', () => {
    assert.equal(
      getPetPublicStatus({ status: 'hidden', publicStatus: 'reserved' }),
      'reserved',
    )
  })

  it('recognizes visible and hidden public statuses', () => {
    assert.equal(isPublicPetStatus('AVAILABLE'), true)
    assert.equal(isPublicPetStatus('adoption_in_progress'), true)
    assert.equal(isPublicPetStatus('adopted'), false)
    assert.equal(isPublicPetStatus(undefined), false)
  })

  it('only treats available and new pets as publicly adoptable', () => {
    assert.equal(
      isPublicPetAdoptable({ status: 'available', publicStatus: 'available' }),
      true,
    )
    assert.equal(
      isPublicPetAdoptable({ status: 'reserved', publicStatus: 'reserved' }),
      false,
    )
  })

  it('selects the primary image before sort order and fallback image', () => {
    const imageUrl = getPetPublicImageUrl({
      image: '/fallback.jpg',
      images: [
        { id: 'later', url: '/later.jpg', isPrimary: false, sortOrder: 0 },
        { id: 'primary', url: '/primary.jpg', isPrimary: true, sortOrder: 10 },
      ],
    })

    assert.equal(imageUrl, '/primary.jpg')
  })

  it('falls back to the legacy image when no image records exist', () => {
    assert.equal(
      getPetPublicImageUrl({ image: '/fallback.jpg', images: [] }),
      '/fallback.jpg',
    )
  })

  it('returns user-facing badge labels for new and reserved pets', () => {
    assert.equal(getPublicPetStatusBadgeLabel('new'), 'Just arrived')
    assert.equal(
      getPublicPetStatusBadgeLabel('adoption_in_progress'),
      'Adoption in progress',
    )
    assert.equal(getPublicPetStatusBadgeLabel('available'), '')
  })
})
