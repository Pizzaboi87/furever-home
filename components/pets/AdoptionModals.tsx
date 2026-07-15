'use client'

import { useEffect, useState } from 'react'

import PublicInquiryForm from '@/components/public-inquiry/PublicInquiryForm'
import PublicModalShell from '@/components/ui/PublicModalShell'
import type { PublicInquirySource } from '@/lib/public-inquiry-validation'

type PetInquirySource = Extract<
  PublicInquirySource,
  'start_adoption' | 'virtual_adoption' | 'pet_question'
>

type PetInquiryModalConfig = {
  source: PetInquirySource
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  submitLabel: string
  successIcon: string
  successTitle: string
  successMessage: string
  messageLabel: string
  messagePlaceholder: string
  isMessageRequired: boolean
  errorContextKey: string
}

interface AdoptionModalsProps {
  petName: string
  isOpen: boolean
  onClose: () => void
}

const getAdoptionConfig = (petName: string): PetInquiryModalConfig => ({
  source: 'start_adoption',
  title: `Adopt ${petName}`,
  description: `Fill out the form below to start the adoption process for ${petName}.`,
  imageSrc: '/images/items/adopt.png',
  imageAlt: 'A smiling woman sitting on the floor with an adopted dog in a bright home',
  submitLabel: 'Submit Application',
  successIcon: '✓',
  successTitle: 'Thank You!',
  successMessage: "Your adoption application has been submitted successfully. We'll contact you soon!",
  messageLabel: 'Message (Optional)',
  messagePlaceholder: "Tell us about your home and why you'd like to adopt...",
  isMessageRequired: false,
  errorContextKey: 'adoption',
})

const getVirtualAdoptionConfig = (petName: string): PetInquiryModalConfig => ({
  source: 'virtual_adoption',
  title: `Virtual Adoption of ${petName}`,
  description: `Virtually adopt ${petName} and receive updates! You'll get photos and information about your adopted pet.`,
  imageSrc: '/images/items/virtual.png',
  imageAlt: 'A smiling woman holding a cat in a cozy home',
  submitLabel: 'Virtually Adopt',
  successIcon: '💝',
  successTitle: 'Thank you!!',
  successMessage: `You've virtually adopted ${petName}! Check your email for updates and photos.`,
  messageLabel: 'Message (Optional)',
  messagePlaceholder: 'Tell us why you want to virtually adopt...',
  isMessageRequired: false,
  errorContextKey: 'virtual_adoption',
})

const getQuestionConfig = (petName: string): PetInquiryModalConfig => ({
  source: 'pet_question',
  title: `Question about ${petName}`,
  description: `Have a question about ${petName}? Send it our way, and we'll get back to you soon.`,
  imageSrc: '/images/items/question.png',
  imageAlt: 'A smiling woman holding a rabbit in a cozy home',
  submitLabel: 'Send Question',
  successIcon: '✓',
  successTitle: 'Question Sent!',
  successMessage: `Thanks for your question about ${petName}. We'll contact you soon.`,
  messageLabel: 'Question',
  messagePlaceholder: 'What would you like to know?',
  isMessageRequired: true,
  errorContextKey: 'question',
})

const PetInquiryModal = ({
  petName,
  isOpen,
  onClose,
  config,
}: AdoptionModalsProps & { config: PetInquiryModalConfig }) => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false)
    }
  }, [isOpen, config.errorContextKey])

  return (
    <PublicModalShell
      isOpen={isOpen}
      isSubmitted={isSubmitted}
      onClose={onClose}
      title={config.title}
      description={config.description}
      closeLabel={`Close ${config.errorContextKey} form`}
      imageSrc={config.imageSrc}
      imageAlt={config.imageAlt}
      successIcon={config.successIcon}
      successTitle={config.successTitle}
      successMessage={config.successMessage}
    >
      <PublicInquiryForm
        source={config.source}
        petName={petName}
        submitLabel={config.submitLabel}
        successTitle={config.successTitle}
        successMessage={config.successMessage}
        showPhone={false}
        showSubject={false}
        messageLabel={config.messageLabel}
        messagePlaceholder={config.messagePlaceholder}
        isMessageRequired={config.isMessageRequired}
        cancelLabel="Cancel"
        onCancel={onClose}
        onSuccessComplete={onClose}
        onSubmittedChange={setIsSubmitted}
      />
    </PublicModalShell>
  )
}

export function AdoptionModal({
  petName,
  isOpen,
  onClose,
}: AdoptionModalsProps) {
  return (
    <PetInquiryModal
      petName={petName}
      isOpen={isOpen}
      onClose={onClose}
      config={getAdoptionConfig(petName)}
    />
  )
}

export function VirtualAdoptionModal({
  petName,
  isOpen,
  onClose,
}: AdoptionModalsProps) {
  return (
    <PetInquiryModal
      petName={petName}
      isOpen={isOpen}
      onClose={onClose}
      config={getVirtualAdoptionConfig(petName)}
    />
  )
}

export function QuestionModal({
  petName,
  isOpen,
  onClose,
}: AdoptionModalsProps) {
  return (
    <PetInquiryModal
      petName={petName}
      isOpen={isOpen}
      onClose={onClose}
      config={getQuestionConfig(petName)}
    />
  )
}
