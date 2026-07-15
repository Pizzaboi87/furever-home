'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import {
  AdoptionModal,
  QuestionModal,
  VirtualAdoptionModal,
} from '@/components/pets/AdoptionModals'
import PetDetailMainContent from '@/components/pets/detail/PetDetailMainContent'
import PetDetailSidebar, {
  type PetDetailModalType,
} from '@/components/pets/detail/PetDetailSidebar'
import RelatedPetsSection from '@/components/pets/detail/RelatedPetsSection'
import type { AdminPet } from '@/lib/admin/domain'
import { isPublicPetAdoptable } from '@/lib/pet-visibility'

type PetDetailClientProps = {
  pet: AdminPet
  relatedPets: AdminPet[]
}

export default function PetDetailClient({ pet, relatedPets }: PetDetailClientProps) {
  const [activeModal, setActiveModal] = useState<PetDetailModalType>(null)
  const [currentPageUrl, setCurrentPageUrl] = useState('')

  useEffect(() => {
    setCurrentPageUrl(window.location.href)
  }, [pet.id])

  const publicStatus = pet.publicStatus ?? pet.status
  const facebookShareUrl = currentPageUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentPageUrl)}`
    : '#'

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/browse" className="text-primary hover:underline">
              Browse Pets
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">{pet.name}</span>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <PetDetailMainContent pet={pet} publicStatus={publicStatus} />
            <PetDetailSidebar
              pet={pet}
              publicStatus={publicStatus}
              isAdoptable={isPublicPetAdoptable(pet)}
              facebookShareUrl={facebookShareUrl}
              onOpenModal={setActiveModal}
            />
          </div>

          <RelatedPetsSection pets={relatedPets} />
        </div>
      </main>

      <AdoptionModal
        petName={pet.name}
        isOpen={activeModal === 'adoption'}
        onClose={() => setActiveModal(null)}
      />
      <VirtualAdoptionModal
        petName={pet.name}
        isOpen={activeModal === 'virtual'}
        onClose={() => setActiveModal(null)}
      />
      <QuestionModal
        petName={pet.name}
        isOpen={activeModal === 'question'}
        onClose={() => setActiveModal(null)}
      />

      <Footer />
    </>
  )
}
