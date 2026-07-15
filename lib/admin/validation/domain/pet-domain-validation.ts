import {
  PRISMA_PET_STATUS,
  type PrismaPetStatusValue,
} from '@/lib/server/prisma-pet-enums'
import { isInactivePrismaPetStatus } from '@/lib/pet-publication-policy'

export type PetDomainRecord = {
  id: string
  status: PrismaPetStatusValue | string
  isPublished?: boolean
}

export const assertPetCanReceiveOpenCase = (pet: PetDomainRecord) => {
  if (isInactivePrismaPetStatus(pet.status as PrismaPetStatusValue)) {
    throw new Error(
      'A new open case cannot be linked to an adopted, hidden, or unavailable pet.',
    )
  }
}

export const assertPetPublicationState = ({
  status,
  isPublished,
}: {
  status: PrismaPetStatusValue
  isPublished: boolean
}) => {
  if (isPublished && isInactivePrismaPetStatus(status)) {
    throw new Error(
      'Adopted, hidden, or unavailable pets cannot be published on the public site.',
    )
  }
}


const CLOSED_APPLICATION_STATUSES = new Set([
  'COMPLETED',
  'CLOSED',
  'DECLINED',
  'CANCELLED',
  'REJECTED',
  'NO_RESPONSE',
])

export const assertPetStatusSupportsApplicationWorkload = ({
  currentStatus,
  nextStatus,
  applicationStatuses,
}: {
  currentStatus: PrismaPetStatusValue
  nextStatus: PrismaPetStatusValue
  applicationStatuses: readonly string[]
}) => {
  const hasOpenApplication = applicationStatuses.some(
    (status) => !CLOSED_APPLICATION_STATUSES.has(status),
  )

  if (
    currentStatus !== nextStatus &&
    hasOpenApplication &&
    isInactivePrismaPetStatus(nextStatus)
  ) {
    throw new Error(
      'This pet cannot be marked adopted, hidden, or unavailable while open adoption applications still exist.',
    )
  }
}

export const assertPetCanContinueAdoptionWorkflow = (
  pet: PetDomainRecord,
  action: 'schedule_meet_and_greet' | 'approve_application' | 'decline_application' | 'complete_adoption',
) => {
  if (
    action !== 'decline_application' &&
    isInactivePrismaPetStatus(pet.status as PrismaPetStatusValue)
  ) {
    throw new Error(
      'This adoption workflow cannot continue because the related pet is no longer active.',
    )
  }

  if (
    action === 'complete_adoption' &&
    pet.status !== PRISMA_PET_STATUS.RESERVED &&
    pet.status !== PRISMA_PET_STATUS.ADOPTION_IN_PROGRESS
  ) {
    throw new Error(
      'An adoption can only be completed for a reserved pet or a pet with an adoption in progress.',
    )
  }
}
