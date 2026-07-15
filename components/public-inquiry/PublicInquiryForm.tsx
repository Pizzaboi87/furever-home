'use client'

import { useState } from 'react'

import { PublicInquiryActions } from '@/components/public-inquiry/form/PublicInquiryActions'
import { PublicInquiryFields } from '@/components/public-inquiry/form/PublicInquiryFields'
import type {
  InquiryFormData,
  InquirySource,
  PublicInquiryFormProps,
} from '@/components/public-inquiry/form/public-inquiry-types'
import ModalSuccessState from '@/components/ui/ModalSuccessState'
import { parsePublicInquiryPayload } from '@/lib/public-inquiry-validation'
import {
  DEFAULT_SUCCESS_DISPLAY_MS,
  initialInquiryFormData,
  parseInquiryResponse,
  shouldRequireMessage,
  shouldShowPhone,
  shouldShowSubject,
} from '@/utils/public-inquiry/public-inquiry-form-utils'

export type { InquirySource }

export default function PublicInquiryForm({
  source,
  submitLabel,
  successTitle,
  successMessage,
  defaultSubject = '',
  petName = '',
  showPhone = shouldShowPhone(source),
  showSubject = shouldShowSubject(source),
  showAvailability = false,
  messageLabel = 'Message',
  messagePlaceholder = 'Tell us a little more...',
  isMessageRequired = shouldRequireMessage(source),
  cancelLabel,
  onCancel,
  onSuccessComplete,
  onSubmittedChange,
  successDisplayMs = DEFAULT_SUCCESS_DISPLAY_MS,
}: PublicInquiryFormProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    ...initialInquiryFormData,
    subject: defaultSubject,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = (field: keyof InquiryFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const parsedPayload = parsePublicInquiryPayload({
        source,
        petName,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        availability: formData.availability,
        message: formData.message,
        honeypot: formData.honeypot,
      })

      if (!parsedPayload.success) {
        setError(parsedPayload.error)
        return
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload.data),
      })

      const inquiryResponse = parseInquiryResponse(await response.json().catch(() => null))

      if (!response.ok || inquiryResponse.error) {
        setError(inquiryResponse.error ?? 'Could not send your message. Please try again.')
        return
      }

      setSubmitted(true)
      onSubmittedChange?.(true)
      setFormData({ ...initialInquiryFormData, subject: defaultSubject })

      if (onSuccessComplete) {
        window.setTimeout(onSuccessComplete, successDisplayMs)
      }
    } catch {
      setError('Could not send your message. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && !onSubmittedChange) {
    return <ModalSuccessState title={successTitle} message={successMessage} />
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-primary/15 bg-primary/5 p-4 shadow-sm sm:p-5"
    >
      <PublicInquiryFields
        formData={formData}
        updateField={updateField}
        showPhone={showPhone}
        showSubject={showSubject}
        showAvailability={showAvailability}
        messageLabel={messageLabel}
        messagePlaceholder={messagePlaceholder}
        isMessageRequired={isMessageRequired}
      />

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <PublicInquiryActions
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </form>
  )
}
