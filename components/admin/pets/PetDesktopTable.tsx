import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'
import { Eye } from 'lucide-react'

import {
  badgeBaseClassName,
  getPetStatusBadgeClassName,
} from '@/utils/admin/badge-styles'
import type { AdminPet } from '@/lib/admin/domain'
import { formatLabel, formatPetDate } from '@/utils/admin/pets/pet-utils'

type PetDesktopTableProps = {
  pets: AdminPet[]
  selectedPetId: string | undefined
  onSelectPet: (petId: string) => void
}

export default function PetDesktopTable({ pets, selectedPetId, onSelectPet }: PetDesktopTableProps) {
  return (
    <table className="hidden w-full min-w-190 text-left text-sm lg:table">
      <thead className="sticky top-0 z-10 bg-input text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th className="px-5 py-3">Pet</th>
          <th className="px-5 py-3">Species</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3">Applications</th>
          <th className="px-5 py-3">Updated</th>
          <th className="px-5 py-3">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border">
        {pets.map((pet, index) => (
          <tr
            key={pet.id}
            className={`transition-colors hover:bg-indigo-50/60 ${selectedPetId === pet.id ? 'bg-indigo-50' : 'bg-white'}`}
          >
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-input">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    sizes="48px"
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-foreground">{pet.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pet.age} years · {pet.weight}kg
                  </p>
                </div>
              </div>
            </td>

            <td className="px-5 py-4 text-muted-foreground">{formatLabel(pet.species)}</td>

            <td className="px-5 py-4">
              <span className={`${badgeBaseClassName} ${getPetStatusBadgeClassName(pet.status)}`}>
                {formatLabel(pet.status)}
              </span>
            </td>

            <td className="px-5 py-4 font-semibold text-foreground">{pet.applications}</td>

            <td className="px-5 py-4 text-muted-foreground">{formatPetDate(pet.lastUpdated)}</td>

            <td className="px-5 py-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPet(pet.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
                >
                  Select
                </button>

                <Link
                  href={`/admin/pets/${pet.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  Details
                </Link>
              </div>
            </td>
          </tr>
        ))}

        {pets.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
              No pets match the selected filters.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  )
}
