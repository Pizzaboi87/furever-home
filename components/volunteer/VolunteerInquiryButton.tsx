'use client'

import { useState } from 'react'

import PublicInquiryModal from '@/components/public-inquiry/PublicInquiryModal'

export default function VolunteerInquiryButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
      >
        Apply to Volunteer
      </button>

      <PublicInquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source="volunteer"
        title="Volunteer Application"
        description="Tell us a little about yourself, when you might be available, and how you would like to help our animals. Our team will review your application and get back to you soon."
        submitLabel="Submit Volunteer Application"
        successTitle="Application Sent!"
        successMessage="Thank you for offering your time. Our team will review your volunteer application and contact you soon."
        defaultSubject="Volunteer application"
        showAvailability
        imageSrc="/images/items/volunteer-2.png"
        imageAlt="Furever Home volunteers spending time with dogs outside the animal shelter"
      />
    </>
  )
}
