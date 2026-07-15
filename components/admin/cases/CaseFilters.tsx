import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/lib/pet-format'
import {
  caseSortOptions,
  followUpFilterOptions,
  type CaseSortMode,
} from '@/utils/admin/cases/case-utils'

type FilterOption = {
  value: string
  label: string
}

type CaseFiltersProps = {
  searchTerm: string
  typeFilter: string
  statusFilter: string
  sourceFilter: string
  priorityFilter: string
  followUpFilter: string
  staffFilter: string
  sortMode: CaseSortMode
  typeValues: string[]
  statusValues: string[]
  sourceValues: string[]
  priorityValues: string[]
  staffValues: FilterOption[]
  onSearchTermChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onSourceFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onFollowUpFilterChange: (value: string) => void
  onStaffFilterChange: (value: string) => void
  onSortModeChange: (value: CaseSortMode) => void
}

const selectClassName =
  'rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

const CaseFilters = ({
  searchTerm,
  typeFilter,
  statusFilter,
  sourceFilter,
  priorityFilter,
  followUpFilter,
  staffFilter,
  sortMode,
  typeValues,
  statusValues,
  sourceValues,
  priorityValues,
  staffValues,
  onSearchTermChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onSourceFilterChange,
  onPriorityFilterChange,
  onFollowUpFilterChange,
  onStaffFilterChange,
  onSortModeChange,
}: CaseFiltersProps) => {
  return (
    <SectionCard className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search by subject, person, follow-up note, owner, status, type, or ID..."
              className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Link
            href="/admin/cases/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-5 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New case
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
          <select
            value={typeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All types</option>
            {typeValues.map((type) => (
              <option key={type} value={type}>
                {formatLabel(type)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All statuses</option>
            {statusValues.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(event) => onSourceFilterChange(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All sources</option>
            {sourceValues.map((source) => (
              <option key={source} value={source}>
                {formatLabel(source)}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => onPriorityFilterChange(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All priorities</option>
            {priorityValues.map((priority) => (
              <option key={priority} value={priority}>
                {formatLabel(priority)}
              </option>
            ))}
          </select>

          <select
            value={followUpFilter}
            onChange={(event) => onFollowUpFilterChange(event.target.value)}
            className={selectClassName}
          >
            {followUpFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={staffFilter}
            onChange={(event) => onStaffFilterChange(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All staff</option>
            <option value="unassigned">Unassigned</option>
            {staffValues.map((staff) => (
              <option key={staff.value} value={staff.value}>
                {staff.label}
              </option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={(event) =>
              onSortModeChange(event.target.value as CaseSortMode)
            }
            className={selectClassName}
          >
            {caseSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SectionCard>
  )
}

export default CaseFilters
