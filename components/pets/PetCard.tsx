import Link from 'next/link'
import Image from '@/components/ui/LoadingImage'
import MotionReveal from '@/components/ui/MotionReveal'
import { formatLabel } from '@/lib/pet-format'
import {
  getPublicPetStatusBadgeClassName,
  getPublicPetStatusBadgeLabel,
  shouldShowPublicPetStatusBadge,
} from '@/lib/pet-visibility'

interface Pet {
  id: string
  name: string
  species: string
  gender: string
  weight: number
  age: number
  description: string
  image: string
  status?: string
  publicStatus?: string
  size?: string
  goodWithChildren?: boolean
  goodWithOtherAnimals?: boolean
}

interface PetCardProps {
  pet: Pet
  delay?: number
  viewportMargin?: string
  eager?: boolean
}

const getGoodWithLabel = (pet: Pet) => {
  if (pet.goodWithChildren && pet.goodWithOtherAnimals) {
    return 'Kids & pets'
  }

  if (pet.goodWithChildren) {
    return 'Kids'
  }

  if (pet.goodWithOtherAnimals) {
    return 'Pets'
  }

  return 'Calm home'
}

export default function PetCard({ pet, delay = 0, viewportMargin, eager = false, }: PetCardProps) {
  const publicStatus = pet.publicStatus ?? pet.status
  const showStatusBadge = shouldShowPublicPetStatusBadge(publicStatus)

  return (
    <MotionReveal delay={delay} viewportMargin={viewportMargin}>
      <Link href={`/pets/${pet.id}`}>
        <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg">
          {/* Image Container */}
          <div className="relative h-75 w-full overflow-hidden bg-muted">
            <Image
              src={pet.image}
              alt={pet.name}
              loading={eager ? 'eager' : 'lazy'}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />

            {showStatusBadge && (
              <div
                className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-bold tracking-wide shadow-sm backdrop-blur-sm ${getPublicPetStatusBadgeClassName(
                  publicStatus
                )}`}
              >
                {getPublicPetStatusBadgeLabel(publicStatus)}
              </div>
            )}
          </div>

          <div className="rounded-b-lg border border-t-0 border-border bg-white">
            {/* Content */}
            <div className="p-4">
              {/* Header */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-foreground">{pet.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatLabel(pet.species)} · {formatLabel(pet.gender)}
                </p>
              </div>

              {/* Details */}
              <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded bg-secondary p-2 text-center text-[#1E1B4B]">
                  <p className="text-xs">Age</p>
                  <p className="font-semibold">{pet.age}y</p>
                </div>

                <div className="rounded bg-secondary p-2 text-center text-[#1E1B4B]">
                  <p className="text-xs">Size</p>
                  <p className="font-semibold">{pet.size ? formatLabel(pet.size) : 'Unknown'}</p>
                </div>

                <div className="rounded bg-secondary p-2 text-center text-[#1E1B4B]">
                  <p className="text-xs">Good with</p>
                  <p className="font-semibold">{getGoodWithLabel(pet)}</p>
                </div>
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-sm text-foreground">{pet.description}</p>
            </div>

            {/* CTA */}
            <div className="flex h-10 flex-col justify-center border-t border-border pl-4 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white">
              <p className="inline-block text-sm font-semibold">View Details →</p>
            </div>
          </div>
        </div>
      </Link>
    </MotionReveal>
  )
}
