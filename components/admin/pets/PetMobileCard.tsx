import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'
import { Eye } from 'lucide-react'

import {
  badgeBaseClassName,
  getPetStatusBadgeClassName,
} from '@/utils/admin/badge-styles'
import type { AdminPet } from '@/lib/admin/domain'
import { formatLabel, formatPetDate } from '@/utils/admin/pets/pet-utils'

type PetMobileCardProps = {
  pet: AdminPet
  isSelected: boolean
  onSelect: () => void
  eager?: boolean
}

export default function PetMobileCard({
  pet,
  isSelected,
  onSelect,
  eager = false,
}: PetMobileCardProps) {
  return (
    <article
      className={`rounded-xl border border-border bg-white p-4 shadow-sm ${isSelected ? 'border-l-4 border-l-primary bg-indigo-50/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-input">
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              sizes="56px"
              loading={eager ? 'eager' : 'lazy'}
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="wrap-break-word font-bold leading-5 text-foreground">{pet.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pet.age} years · {pet.weight}kg
            </p>
            <p className="mt-2 wrap-break-word text-xs font-semibold text-primary">{pet.id}</p>
          </div>
        </div>

        <Link
          href={`/admin/pets/${pet.id}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
        >
          Details
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Species</p>
          <p className="mt-1 font-semibold text-foreground">{formatLabel(pet.species)}</p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Applications</p>
          <p className="mt-1 font-semibold text-foreground">{pet.applications}</p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Updated</p>
          <p className="mt-1 text-muted-foreground">{formatPetDate(pet.lastUpdated)}</p>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
          <span className={`mt-1 ${badgeBaseClassName} ${getPetStatusBadgeClassName(pet.status)}`}>
            {formatLabel(pet.status)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-[1.01] hover:border-primary hover:bg-indigo-50"
      >
        {isSelected ? 'Selected in preview' : 'Select for preview'}
      </button>
    </article>
  )
}
