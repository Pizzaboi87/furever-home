import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  hasFilledPublicInquiryHoneypot,
  parsePublicInquiryPayload,
} from '@/lib/public-inquiry-validation'

const makePayload = (overrides: Record<string, unknown> = {}) => ({
  source: 'contact',
  name: '  Mia Green  ',
  email: '  MIA@EXAMPLE.COM  ',
  message: '  I would like more information.  ',
  phone: '  +1 555 0100  ',
  petName: '',
  subject: '  General question  ',
  availability: '',
  honeypot: '',
  ...overrides,
})

describe('public inquiry validation', () => {
  it('normalizes contact submissions', () => {
    const result = parsePublicInquiryPayload(makePayload())

    assert.equal(result.success, true)
    if (!result.success) return

    assert.equal(result.data.name, 'Mia Green')
    assert.equal(result.data.email, 'mia@example.com')
    assert.equal(result.data.phone, '+1 555 0100')
    assert.equal(result.data.subject, 'General question')
  })

  it('rejects malformed email addresses', () => {
    const result = parsePublicInquiryPayload(makePayload({ email: 'not-an-email' }))

    assert.equal(result.success, false)
    if (result.success) return
    assert.equal(result.error, 'Please enter a valid email address.')
  })

  it('requires a message for contact submissions', () => {
    const result = parsePublicInquiryPayload(makePayload({ message: ' ' }))

    assert.equal(result.success, false)
    if (result.success) return
    assert.equal(result.error, 'Please enter a message.')
  })

  it('requires a subject for volunteer submissions', () => {
    const result = parsePublicInquiryPayload(
      makePayload({ source: 'volunteer', subject: '' }),
    )

    assert.equal(result.success, false)
    if (result.success) return
    assert.equal(result.error, 'Please enter a subject.')
  })

  it('requires a pet name for pet inquiry sources', () => {
    const result = parsePublicInquiryPayload(
      makePayload({ source: 'start_adoption', subject: '', message: '', petName: '' }),
    )

    assert.equal(result.success, false)
    if (result.success) return
    assert.equal(result.error, 'This pet inquiry is missing a pet name.')
  })

  it('allows adoption submissions without a custom message', () => {
    const result = parsePublicInquiryPayload(
      makePayload({
        source: 'start_adoption',
        subject: '',
        message: '',
        petName: 'Luna',
      }),
    )

    assert.equal(result.success, true)
    if (!result.success) return
    assert.equal(result.data.message, 'No additional message provided.')
  })

  it('truncates free-text fields to their supported maximum length', () => {
    const result = parsePublicInquiryPayload(
      makePayload({ message: `  ${'x'.repeat(3100)}  ` }),
    )

    assert.equal(result.success, true)
    if (!result.success) return
    assert.equal(result.data.message.length, 3000)
  })

  it('detects only non-empty string honeypot values', () => {
    assert.equal(hasFilledPublicInquiryHoneypot({ honeypot: 'bot' }), true)
    assert.equal(hasFilledPublicInquiryHoneypot({ honeypot: '   ' }), false)
    assert.equal(hasFilledPublicInquiryHoneypot({ honeypot: 123 }), false)
    assert.equal(hasFilledPublicInquiryHoneypot(null), false)
  })
})
