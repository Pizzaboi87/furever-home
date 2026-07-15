'use client'

import { useEffect, useState } from 'react'

import PublicInquiryForm, { type InquirySource } from '@/components/public-inquiry/PublicInquiryForm'
import PublicModalShell from '@/components/ui/PublicModalShell'

type PublicInquiryModalProps = {
  isOpen: boolean
  onClose: () => void
  source: InquirySource
  title: string
  description: string
  submitLabel: string
  successTitle: string
  successMessage: string
  defaultSubject: string
  showAvailability?: boolean
  imageSrc: string
  imageAlt: string
}

export default function PublicInquiryModal({
  isOpen,
  onClose,
  source,
  title,
  description,
  submitLabel,
  successTitle,
  successMessage,
  defaultSubject,
  showAvailability = false,
  imageSrc,
  imageAlt,
}: PublicInquiryModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false)
    }
  }, [isOpen, source])

  return (
    <PublicModalShell
      isOpen={isOpen}
      isSubmitted={isSubmitted}
      onClose={onClose}
      title={title}
      description={description}
      closeLabel="Close contact form"
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      successTitle={successTitle}
      successMessage={successMessage}
    >
      <PublicInquiryForm
        source={source}
        submitLabel={submitLabel}
        successTitle={successTitle}
        successMessage={successMessage}
        defaultSubject={defaultSubject}
        showAvailability={showAvailability}
        onSuccessComplete={onClose}
        onSubmittedChange={setIsSubmitted}
      />
    </PublicModalShell>
  )
}
