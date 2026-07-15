import type { PublicInquirySource } from '@/lib/public-inquiry-validation'

export type InquirySource = PublicInquirySource

export type InquiryFormData = {
  name: string
  email: string
  phone: string
  subject: string
  availability: string
  message: string
  honeypot: string
}

export type PublicInquiryFormProps = {
  source: InquirySource
  submitLabel: string
  successTitle: string
  successMessage: string
  defaultSubject?: string
  petName?: string
  showPhone?: boolean
  showSubject?: boolean
  showAvailability?: boolean
  messageLabel?: string
  messagePlaceholder?: string
  isMessageRequired?: boolean
  cancelLabel?: string
  onCancel?: () => void
  onSuccessComplete?: () => void
  onSubmittedChange?: (isSubmitted: boolean) => void
  successDisplayMs?: number
}

export type InquiryFieldUpdater = (field: keyof InquiryFormData, value: string) => void

export type PublicInquiryFieldsProps = {
  formData: InquiryFormData
  updateField: InquiryFieldUpdater
  showPhone: boolean
  showSubject: boolean
  showAvailability: boolean
  messageLabel: string
  messagePlaceholder: string
  isMessageRequired: boolean
}

export type PublicInquiryActionsProps = {
  submitLabel: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting: boolean
}

