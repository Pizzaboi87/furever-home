import type {
  InquiryFormData,
  InquirySource,
} from '@/components/public-inquiry/form/public-inquiry-types'

export type InquiryResponse = {
  ok?: boolean
  error?: string
}

export const initialInquiryFormData: InquiryFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  availability: '',
  message: '',
  honeypot: '',
}

export const DEFAULT_SUCCESS_DISPLAY_MS = 3200

const subjectSources = new Set<InquirySource>(['contact', 'volunteer'])
const phoneSources = new Set<InquirySource>(['contact', 'volunteer'])
const messageRequiredSources = new Set<InquirySource>([
  'contact',
  'volunteer',
  'pet_question',
])

export const shouldShowSubject = (source: InquirySource) => subjectSources.has(source)

export const shouldShowPhone = (source: InquirySource) => phoneSources.has(source)

export const shouldRequireMessage = (source: InquirySource) =>
  messageRequiredSources.has(source)

export const parseInquiryResponse = (value: unknown): InquiryResponse => {
  if (typeof value !== 'object' || value === null) {
    return { error: 'Unexpected response from the email service.' }
  }

  const record = value as Record<string, unknown>

  return {
    ok: record.ok === true,
    error: typeof record.error === 'string' ? record.error : undefined,
  }
}
