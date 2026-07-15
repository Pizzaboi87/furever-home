import { z } from 'zod'

export const publicInquirySources = [
  'start_adoption',
  'virtual_adoption',
  'pet_question',
  'volunteer',
  'contact',
] as const

export type PublicInquirySource = (typeof publicInquirySources)[number]


const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

export const hasFilledPublicInquiryHoneypot = (value: unknown) => {
  if (!isRecord(value)) {
    return false
  }

  return typeof value.honeypot === 'string' && value.honeypot.trim().length > 0
}

const trimText = (maxLength: number) => {
  return z.preprocess(
    (value) => (typeof value === 'string' ? value.trim().slice(0, maxLength) : ''),
    z.string().max(maxLength),
  )
}

const emailSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''),
  z.string().email('Please enter a valid email address.').max(180),
)

const messageRequiredSources = new Set<PublicInquirySource>([
  'pet_question',
  'volunteer',
  'contact',
])

const petInquirySources = new Set<PublicInquirySource>([
  'start_adoption',
  'virtual_adoption',
  'pet_question',
])

export const publicInquiryPayloadSchema = z
  .object({
    source: z.enum(publicInquirySources),
    name: trimText(120).pipe(
      z.string().min(2, 'Please enter your name.').max(120),
    ),
    email: emailSchema,
    message: trimText(3000),
    phone: trimText(80),
    petName: trimText(120),
    subject: trimText(160),
    availability: trimText(300),
    honeypot: trimText(120),
  })
  .superRefine((payload, context) => {
    if (messageRequiredSources.has(payload.source) && payload.message.length < 2) {
      context.addIssue({
        code: 'custom',
        path: ['message'],
        message: 'Please enter a message.',
      })
    }

    if ((payload.source === 'contact' || payload.source === 'volunteer') && payload.subject.length < 2) {
      context.addIssue({
        code: 'custom',
        path: ['subject'],
        message: 'Please enter a subject.',
      })
    }

    if (petInquirySources.has(payload.source) && payload.petName.length < 1) {
      context.addIssue({
        code: 'custom',
        path: ['petName'],
        message: 'This pet inquiry is missing a pet name.',
      })
    }
  })
  .transform((payload) => ({
    ...payload,
    message: payload.message || 'No additional message provided.',
  }))

export type PublicInquiryPayload = z.infer<typeof publicInquiryPayloadSchema>

export const parsePublicInquiryPayload = (value: unknown) => {
  const result = publicInquiryPayloadSchema.safeParse(value)

  if (result.success) {
    return { success: true as const, data: result.data }
  }

  return {
    success: false as const,
    error: result.error.issues[0]?.message ?? 'Invalid form submission.',
  }
}
