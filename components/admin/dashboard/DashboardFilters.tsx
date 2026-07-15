import { Filter } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import MotionReveal from '@/components/ui/MotionReveal'
import { formatLabel } from '@/lib/pet-format'

export type DashboardFilterField = {
    label: string
    value: string
    onChange: Dispatch<SetStateAction<string>>
    options: string[]
    allLabel: string
}

export type DashboardFilterGroup = {
    label: string
    fields: DashboardFilterField[]
}

type DashboardFiltersProps = {
    petPopulationCount: number
    petPopulationLabel: string
    newApplications: number
    approvedApplications: number
    dateRange: string
    setDateRange: Dispatch<SetStateAction<string>>
    dateRangeValues: string[]
    formatDateRangeLabel: (value: string) => string
    speciesFilter: string
    setSpeciesFilter: Dispatch<SetStateAction<string>>
    speciesValues: string[]
    statusFilter: string
    setStatusFilter: Dispatch<SetStateAction<string>>
    statusValues: string[]
    ageGroupFilter: string
    setAgeGroupFilter: Dispatch<SetStateAction<string>>
    ageGroups: string[]
    sizeFilter: string
    setSizeFilter: Dispatch<SetStateAction<string>>
    sizeValues: string[]
    genderFilter: string
    setGenderFilter: Dispatch<SetStateAction<string>>
    genderValues: string[]
    availableCount: number
    youngPetsCount: number
    seniorPetsCount: number
    filterGroups: DashboardFilterGroup[]
    activityTypeFilter: string
    setActivityTypeFilter: Dispatch<SetStateAction<string>>
    activityTypeValues: string[]
    totalActivityEvents: number
}

const selectClassName = 'mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [&>option]:bg-white [&>option]:text-foreground'

export const DashboardFilters = ({
    petPopulationCount,
    petPopulationLabel,
    newApplications,
    approvedApplications,
    dateRange,
    setDateRange,
    dateRangeValues,
    formatDateRangeLabel,
    speciesFilter,
    setSpeciesFilter,
    speciesValues,
    statusFilter,
    setStatusFilter,
    statusValues,
    ageGroupFilter,
    setAgeGroupFilter,
    ageGroups,
    sizeFilter,
    setSizeFilter,
    sizeValues,
    genderFilter,
    setGenderFilter,
    genderValues,
    availableCount,
    youngPetsCount,
    seniorPetsCount,
    filterGroups,
    activityTypeFilter,
    setActivityTypeFilter,
    activityTypeValues,
    totalActivityEvents,
}: DashboardFiltersProps) => (
    <MotionReveal className="mb-6 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h2 className="text-lg font-bold text-foreground">Dashboard filters</h2>
                <p className="text-sm text-muted-foreground">Filter shelter activity by period, pet details, adoption demand, and support data.</p>
            </div>
            <div className="w-full rounded-2xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-primary sm:w-auto sm:rounded-full">
                {petPopulationCount} {petPopulationLabel} · {newApplications} new applications · {approvedApplications} approved applications
            </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="h-full w-full rounded-none border-0 bg-transparent p-0 xl:rounded-2xl xl:border xl:border-border xl:bg-input/40 xl:p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
                    Pet view
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                    <label className="text-sm font-semibold text-foreground">
                        Date range
                        <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className={selectClassName}>
                            {dateRangeValues.map((range) => (
                                <option key={range} value={range}>{formatDateRangeLabel(range)}</option>
                            ))}
                        </select>
                    </label>

                    {[
                        { label: 'Species', value: speciesFilter, setter: setSpeciesFilter, values: speciesValues, allLabel: 'All species' },
                        { label: 'Status', value: statusFilter, setter: setStatusFilter, values: statusValues, allLabel: 'All statuses' },
                        { label: 'Age group', value: ageGroupFilter, setter: setAgeGroupFilter, values: ageGroups, allLabel: 'All age groups' },
                        { label: 'Size', value: sizeFilter, setter: setSizeFilter, values: sizeValues, allLabel: 'All sizes' },
                        { label: 'Gender', value: genderFilter, setter: setGenderFilter, values: genderValues, allLabel: 'All genders' },
                    ].map((field) => (
                        <label key={field.label} className="text-sm font-semibold text-foreground">
                            {field.label}
                            <select value={field.value} onChange={(event) => field.setter(event.target.value)} className={selectClassName}>
                                <option value="all">{field.allLabel}</option>
                                {field.values.map((value) => (
                                    <option key={value} value={value}>{formatLabel(value)}</option>
                                ))}
                            </select>
                        </label>
                    ))}
                </div>

                <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        { value: petPopulationCount, label: petPopulationLabel },
                        { value: approvedApplications, label: 'approved applications' },
                        { value: newApplications, label: 'new applications' },
                        { value: availableCount, label: 'available pets' },
                        { value: youngPetsCount, label: 'young pets' },
                        { value: seniorPetsCount, label: 'senior pets' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-border bg-white p-3">
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm leading-5 text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-full rounded-none border-0 bg-transparent p-0 xl:rounded-2xl xl:border xl:border-border xl:bg-input/40 xl:p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
                    Operations view
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {filterGroups.map((group) => (
                        <div key={group.label} className="space-y-3 rounded-xl border border-border bg-white p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                            {group.fields.map((field) => (
                                <label key={field.label} className="block text-sm font-semibold text-foreground">
                                    {field.label}
                                    <select value={field.value} onChange={(event) => field.onChange(event.target.value)} className={selectClassName}>
                                        <option value="all">{field.allLabel}</option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>{formatLabel(option)}</option>
                                        ))}
                                    </select>
                                </label>
                            ))}
                        </div>
                    ))}

                    <div className="space-y-3 rounded-xl border border-border bg-white p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Activity filters</p>
                        <label className="block text-sm font-semibold text-foreground">
                            Event type
                            <select value={activityTypeFilter} onChange={(event) => setActivityTypeFilter(event.target.value)} className={selectClassName}>
                                <option value="all">All events</option>
                                {activityTypeValues.map((type) => (
                                    <option key={type} value={type}>{formatLabel(type)}</option>
                                ))}
                            </select>
                        </label>
                        <div className="rounded-xl bg-indigo-50 p-3 text-sm text-foreground">
                            <p className="font-semibold text-primary">Filtered activity feed</p>
                            <p className="mt-1 text-muted-foreground">{totalActivityEvents} events match the selected event type.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MotionReveal>
)
