import Image from '@/components/ui/LoadingImage'

import MotionReveal from '@/components/ui/MotionReveal'
import type { AdminPet } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'
import { getPublicPetStatusBadgeLabel } from '@/lib/pet-visibility'
import {
  formatPetDetailDate,
  getHomeFitBadges,
  getPetAgeLabel,
} from '@/utils/pets/pet-detail-utils'

export type PetDetailModalType = 'adoption' | 'virtual' | 'question' | null

type PetDetailSidebarProps = {
  pet: AdminPet
  publicStatus: string
  isAdoptable: boolean
  facebookShareUrl: string
  onOpenModal: (modal: Exclude<PetDetailModalType, null>) => void
}

const actionButtons: {
  label: string
  modal: Exclude<PetDetailModalType, null>
  className: string
}[] = [
  {
    label: 'Start Adoption',
    modal: 'adoption',
    className:
      'bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground hover:brightness-105',
  },
  {
    label: 'Virtual Adoption',
    modal: 'virtual',
    className: 'bg-secondary text-[#1E1B4B] hover:bg-opacity-90',
  },
  {
    label: 'I Have a Question',
    modal: 'question',
    className:
      'border border-border bg-white text-foreground hover:border-primary hover:bg-indigo-50',
  },
]

export default function PetDetailSidebar({
  pet,
  publicStatus,
  isAdoptable,
  facebookShareUrl,
  onOpenModal,
}: PetDetailSidebarProps) {
  const profileCards = [
    { label: 'Age', value: getPetAgeLabel(pet.age) },
    { label: 'Size', value: pet.size ? formatLabel(pet.size) : 'Unknown' },
    { label: 'Weight', value: `${pet.weight} kg` },
  ]
  const homeFitBadges = getHomeFitBadges(pet)

  return (
    <MotionReveal
      className="relative flex flex-col self-start rounded-lg border border-border bg-white p-8 shadow-sm lg:sticky lg:top-6"
      delay={0.14}
    >
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${pet.name} on Facebook`}
        className="absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-linear-to-r from-[#5f57e7] to-primary transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Image
          src="/images/assets/facebook.png"
          width={24}
          height={24}
          alt=""
          aria-hidden="true"
        />
      </a>

      <div className="mb-7 pr-12">
        <h1 className="mb-2 text-4xl font-bold text-foreground">{pet.name}</h1>
        <p className="text-lg font-semibold text-foreground">
          {formatLabel(pet.species)} · {formatLabel(pet.gender)}
        </p>
      </div>

      <div className="mb-7">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Profile
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {profileCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-border bg-secondary p-3 text-center shadow-sm"
            >
              <p className="mb-1 text-xs text-foreground">{card.label}</p>
              <p className="text-sm font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Home fit
        </h2>
        <div className="flex flex-wrap gap-2">
          {homeFitBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-white px-3 py-1 text-sm font-semibold text-foreground shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-7 border-t border-border pt-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Shelter journey
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {typeof pet.daysInShelter === 'number' && (
            <p>
              Looking for a home for{' '}
              <span className="font-semibold text-foreground">{pet.daysInShelter} days</span>.
            </p>
          )}
          {pet.lastUpdated && (
            <p>
              Updated{' '}
              <span className="font-semibold text-foreground">
                {formatPetDetailDate(pet.lastUpdated)}
              </span>
              .
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {actionButtons.map((button) => {
          const isDisabled = button.modal === 'adoption' && !isAdoptable

          return (
            <button
              key={button.modal}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onOpenModal(button.modal)
                }
              }}
              className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out ${
                isDisabled
                  ? 'cursor-not-allowed bg-input text-muted-foreground'
                  : `cursor-pointer hover:scale-105 ${button.className}`
              }`}
            >
              {isDisabled
                ? getPublicPetStatusBadgeLabel(publicStatus) || 'Not currently adoptable'
                : button.label}
            </button>
          )
        })}
      </div>
    </MotionReveal>
  )
}
