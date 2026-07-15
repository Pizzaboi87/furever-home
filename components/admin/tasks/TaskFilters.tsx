import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { formatTaskLabel } from '@/utils/admin/tasks/task-utils'

const bucketOptions = [
  { value: 'all', label: 'All buckets' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'upcoming', label: 'Upcoming' },
]

type StaffFilterOption = {
  value: string
  label: string
}

type TaskFiltersProps = {
  searchTerm: string
  bucketFilter: string
  typeFilter: string
  priorityFilter: string
  staffFilter: string
  typeValues: string[]
  priorityValues: string[]
  staffValues: StaffFilterOption[]
  onSearchTermChange: (value: string) => void
  onBucketFilterChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onStaffFilterChange: (value: string) => void
}

const TaskFilters = ({
  searchTerm,
  bucketFilter,
  typeFilter,
  priorityFilter,
  staffFilter,
  typeValues,
  priorityValues,
  staffValues,
  onSearchTermChange,
  onBucketFilterChange,
  onTypeFilterChange,
  onPriorityFilterChange,
  onStaffFilterChange,
}: TaskFiltersProps) => {
  const selectClassName =
    'rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <SectionCard className="mb-6" delay={0.14}>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px_190px_auto]">
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by subject, person, pet, note, type, priority, or case ID..."
            className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={bucketFilter}
          onChange={(event) => onBucketFilterChange(event.target.value)}
          className={selectClassName}
        >
          {bucketOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className={selectClassName}
        >
          <option value="all">All types</option>
          {typeValues.map((type) => (
            <option key={type} value={type}>
              {formatTaskLabel(type)}
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
              {formatTaskLabel(priority)}
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

        <Link
          href="/admin/cases/new"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-5 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          New case
        </Link>
      </div>
    </SectionCard>
  )
}

export default TaskFilters
