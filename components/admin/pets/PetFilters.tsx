import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/utils/admin/pets/pet-utils'

type PetFiltersProps = {
  searchTerm: string
  speciesFilter: string
  statusFilter: string
  speciesValues: string[]
  statusValues: string[]
  onSearchTermChange: (value: string) => void
  onSpeciesFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
}

export default function PetFilters({
  searchTerm,
  speciesFilter,
  statusFilter,
  speciesValues,
  statusValues,
  onSearchTermChange,
  onSpeciesFilterChange,
  onStatusFilterChange,
}: PetFiltersProps) {
  return (
    <SectionCard className="mb-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_140px]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by ID, name, species, or status..."
            className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={speciesFilter}
          onChange={(event) => onSpeciesFilterChange(event.target.value)}
          className="rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All species</option>

          {speciesValues.map((species) => (
            <option key={species} value={species}>
              {formatLabel(species)}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All statuses</option>

          {statusValues.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>

        <Link
          href="/admin/pets/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-5 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New pet
        </Link>
      </div>
    </SectionCard>
  )
}
