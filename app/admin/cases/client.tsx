'use client'

import { useMemo, useState } from 'react'

import Header from '@/components/admin/common/Header'
import CaseFilters from '@/components/admin/cases/CaseFilters'
import CaseListPanel from '@/components/admin/cases/CaseListPanel'
import CaseStats from '@/components/admin/cases/CaseStats'
import type { AdminPetCase } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'
import {
  getCaseSearchableText,
  getFollowUpBucket,
  sortCases,
  type CaseSortMode,
} from '@/utils/admin/cases/case-utils'

type CaseStatsData = {
  total: number
  open: number
  highPriority: number
  petRelated: number
}

type CasesClientProps = {
  cases: AdminPetCase[]
  stats: CaseStatsData
}

const getUniqueNormalizedValues = (values: Array<string | null | undefined>) => {
  return [...new Set(values.map((value) => normalizeValue(value)).filter(Boolean))]
}

export default function CasesClient({ cases, stats }: CasesClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [followUpFilter, setFollowUpFilter] = useState('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const [sortMode, setSortMode] = useState<CaseSortMode>('follow_up')

  const typeValues = useMemo(
    () => getUniqueNormalizedValues(cases.map((item) => item.type)),
    [cases],
  )
  const statusValues = useMemo(
    () => getUniqueNormalizedValues(cases.map((item) => item.status)),
    [cases],
  )
  const sourceValues = useMemo(
    () =>
      getUniqueNormalizedValues(
        cases.map((item) => item.source ?? item.channel),
      ),
    [cases],
  )
  const priorityValues = useMemo(
    () => getUniqueNormalizedValues(cases.map((item) => item.priority)),
    [cases],
  )
  const staffValues = useMemo(() => {
    return Array.from(
      new Map(
        cases
          .map((item) => item.assignedStaff?.trim())
          .filter((staff): staff is string => Boolean(staff))
          .map((staff) => [normalizeValue(staff), staff]),
      ).entries(),
    )
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [cases])

  const filteredCases = useMemo(() => {
    const search = normalizeValue(searchTerm)
    const matchingCases = cases.filter((item) => {
      const source = item.source ?? item.channel ?? ''
      const bucket = getFollowUpBucket(item.nextFollowUpAt)

      return (
        (!search || getCaseSearchableText(item).includes(search)) &&
        (typeFilter === 'all' || normalizeValue(item.type) === typeFilter) &&
        (statusFilter === 'all' ||
          normalizeValue(item.status) === statusFilter) &&
        (sourceFilter === 'all' || normalizeValue(source) === sourceFilter) &&
        (priorityFilter === 'all' ||
          normalizeValue(item.priority) === priorityFilter) &&
        (followUpFilter === 'all' || bucket === followUpFilter) &&
        (staffFilter === 'all' ||
          (staffFilter === 'unassigned' && !item.assignedStaff?.trim()) ||
          normalizeValue(item.assignedStaff) === staffFilter)
      )
    })

    return sortCases(matchingCases, sortMode)
  }, [
    cases,
    followUpFilter,
    priorityFilter,
    searchTerm,
    sortMode,
    sourceFilter,
    staffFilter,
    statusFilter,
    typeFilter,
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/cases"
        title="Manage Cases"
        description="Review CRM cases, interaction summaries, follow-ups, and case ownership."
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <CaseStats {...stats} />

        <CaseFilters
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          priorityFilter={priorityFilter}
          followUpFilter={followUpFilter}
          staffFilter={staffFilter}
          sortMode={sortMode}
          typeValues={typeValues}
          statusValues={statusValues}
          sourceValues={sourceValues}
          priorityValues={priorityValues}
          staffValues={staffValues}
          onSearchTermChange={setSearchTerm}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
          onSourceFilterChange={setSourceFilter}
          onPriorityFilterChange={setPriorityFilter}
          onFollowUpFilterChange={setFollowUpFilter}
          onStaffFilterChange={setStaffFilter}
          onSortModeChange={setSortMode}
        />

        <CaseListPanel
          cases={filteredCases}
          totalCount={cases.length}
          sortMode={sortMode}
        />
      </div>
    </main>
  )
}
