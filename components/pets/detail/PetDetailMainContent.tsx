import Image from '@/components/ui/LoadingImage'

import MotionReveal from '@/components/ui/MotionReveal'
import type { AdminPet } from '@/lib/admin/domain'
import {
  getPublicPetStatusBadgeClassName,
  getPublicPetStatusBadgeLabel,
  shouldShowPublicPetStatusBadge,
} from '@/lib/pet-visibility'
import { getBestFitText } from '@/utils/pets/pet-detail-utils'

type PetDetailMainContentProps = {
  pet: AdminPet
  publicStatus: string
}

export default function PetDetailMainContent({
  pet,
  publicStatus,
}: PetDetailMainContentProps) {
  const showStatusBadge = shouldShowPublicPetStatusBadge(publicStatus)

  return (
    <div className="space-y-8 lg:col-span-2">
      <MotionReveal className="relative h-100 overflow-hidden rounded-lg border border-border bg-muted shadow-lg lg:h-125">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
          priority
        />

        {showStatusBadge && (
          <div
            className={`absolute right-5 top-5 rounded-full border px-4 py-2 text-sm font-bold tracking-wide shadow-sm backdrop-blur-sm ${getPublicPetStatusBadgeClassName(
              publicStatus
            )}`}
          >
            {getPublicPetStatusBadgeLabel(publicStatus)}
          </div>
        )}
      </MotionReveal>

      <MotionReveal className="rounded-lg border border-border bg-white p-8 shadow-sm">
        <h2 className="relative mb-4 inline-block pb-3 text-2xl font-bold text-foreground after:absolute after:bottom-1 after:left-0 after:h-0.75 after:w-3/4 after:rounded-full after:bg-primary after:content-['']">
          About {pet.name}
        </h2>

        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          {pet.description}
        </p>

        <div className="rounded-lg border border-border bg-background p-5">
          <h3 className="mb-2 text-lg font-bold text-foreground">
            Best fit for {pet.name}
          </h3>

          <p className="leading-relaxed text-muted-foreground">{getBestFitText(pet)}</p>
        </div>
      </MotionReveal>
    </div>
  )
}
