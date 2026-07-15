import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import { formatLabel } from '@/lib/pet-format'

type PeopleFiltersProps = {
    searchTerm: string
    typeFilter: string
    activityFilter: string
    typeValues: string[]
    onSearchTermChange: (value: string) => void
    onTypeFilterChange: (value: string) => void
    onActivityFilterChange: (value: string) => void
}

export default function PeopleFilters({
    searchTerm,
    typeFilter,
    activityFilter,
    typeValues,
    onSearchTermChange,
    onTypeFilterChange,
    onActivityFilterChange,
}: PeopleFiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <div className="relative min-w-0">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => onSearchTermChange(event.target.value)}
                    placeholder="Search by name, email, phone, type, or ID..."
                    className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <select
                value={typeFilter}
                onChange={(event) => onTypeFilterChange(event.target.value)}
                className="rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
                <option value="all">All types</option>

                {typeValues.map((type) => (
                    <option key={type} value={type}>
                        {formatLabel(type)}
                    </option>
                ))}
            </select>

            <select
                value={activityFilter}
                onChange={(event) => onActivityFilterChange(event.target.value)}
                className="rounded-lg border border-border bg-input px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
                <option value="all">All activity</option>
                <option value="open_cases">Open cases</option>
                <option value="has_interactions">Has interactions</option>
                <option value="has_related_pets">Related pets</option>
            </select>

            <Link
                href="/admin/people/new"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-5 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
            >
                <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                New person
            </Link>
        </div>
    )
}
