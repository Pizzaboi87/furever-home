'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Activity,
    ClipboardList,
    MessageSquare,
    UserRound,
} from 'lucide-react'

import Header from '@/components/admin/common/Header'
import AdminListPanel from '@/components/admin/common/AdminListPanel'
import SectionCard from '@/components/admin/common/SectionCard'
import StatCard from '@/components/admin/common/StatCard'
import MotionReveal from '@/components/ui/MotionReveal'
import PeopleDesktopTable from '@/components/admin/people/PeopleDesktopTable'
import PeopleFilters from '@/components/admin/people/PeopleFilters'
import PeopleMobileCard from '@/components/admin/people/PeopleMobileCard'
import type { AdminPersonOverview } from '@/lib/admin/person-service'
import {
    buildSearchablePeople,
    filterPeople,
    INITIAL_VISIBLE_PEOPLE,
    VISIBLE_PEOPLE_STEP,
} from '@/utils/admin/people/people-utils'

type PeopleClientProps = {
    people: AdminPersonOverview[]
}

export default function PeopleClient({ people }: PeopleClientProps) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [activityFilter, setActivityFilter] = useState('all')
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PEOPLE)

    const searchablePeople = useMemo(() => buildSearchablePeople(people), [people])

    const typeValues = useMemo(() => {
        return [
            ...new Set(
                searchablePeople
                    .map((item) => item.personType)
                    .filter(Boolean),
            ),
        ]
    }, [searchablePeople])

    const filteredPeople = useMemo(() => {
        return filterPeople({
            people: searchablePeople,
            searchTerm,
            typeFilter,
            activityFilter,
        })
    }, [activityFilter, searchablePeople, searchTerm, typeFilter])

    useEffect(() => {
        setVisibleCount(INITIAL_VISIBLE_PEOPLE)
        scrollContainerRef.current?.scrollTo({ top: 0 })
    }, [activityFilter, searchTerm, typeFilter])

    const visiblePeople = filteredPeople.slice(0, visibleCount)
    const hasMorePeople = visiblePeople.length < filteredPeople.length

    const handlePeopleScroll = () => {
        const container = scrollContainerRef.current

        if (!container || !hasMorePeople) {
            return
        }

        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight

        if (distanceFromBottom > 240) {
            return
        }

        setVisibleCount((currentCount) =>
            Math.min(currentCount + VISIBLE_PEOPLE_STEP, filteredPeople.length),
        )
    }

    const totalCases = people.reduce((sum, item) => sum + item.stats.totalCases, 0)
    const openCases = people.reduce((sum, item) => sum + item.stats.openCases, 0)
    const totalInteractions = people.reduce(
        (sum, item) => sum + item.stats.totalInteractions,
        0,
    )

    return (
        <main className="min-h-screen bg-background">
            <Header
                currentHref="/admin/people"
                title="Manage People"
                description="Review contacts, applicants, donors, volunteers, related cases, and interaction history."
            />

            <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MotionReveal>
                        <StatCard label="Total people" value={people.length} icon={UserRound} />
                    </MotionReveal>

                    <MotionReveal delay={0.04}>
                        <StatCard label="Related cases" value={totalCases} icon={ClipboardList} />
                    </MotionReveal>

                    <MotionReveal delay={0.08}>
                        <StatCard label="Open cases" value={openCases} icon={MessageSquare} />
                    </MotionReveal>

                    <MotionReveal delay={0.12}>
                        <StatCard label="Interactions" value={totalInteractions} icon={Activity} />
                    </MotionReveal>
                </div>

                <SectionCard className="mb-6">
                    <PeopleFilters
                        searchTerm={searchTerm}
                        typeFilter={typeFilter}
                        activityFilter={activityFilter}
                        typeValues={typeValues}
                        onSearchTermChange={setSearchTerm}
                        onTypeFilterChange={setTypeFilter}
                        onActivityFilterChange={setActivityFilter}
                    />
                </SectionCard>

                <AdminListPanel
                    title="Contact records"
                    description={`Showing ${visiblePeople.length} of ${filteredPeople.length} matching people. Total records: ${people.length}.`}
                    bodyClassName="max-h-[calc(100vh-18rem)] overflow-y-auto"
                    bodyRef={scrollContainerRef}
                    onBodyScroll={handlePeopleScroll}
                >
                    <div className="space-y-3 p-4 lg:hidden">
                        {visiblePeople.map((item) => (
                            <PeopleMobileCard key={item.person.id} item={item} />
                        ))}

                        {filteredPeople.length === 0 ? (
                            <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
                                No people match the selected filters.
                            </div>
                        ) : null}
                    </div>

                    <PeopleDesktopTable
                        people={visiblePeople}
                        hasMatches={filteredPeople.length > 0}
                    />

                    {hasMorePeople && (
                        <div className="border-t border-border px-5 py-3 text-center text-sm text-muted-foreground">
                            Scroll to load {filteredPeople.length - visiblePeople.length} more matching people.
                        </div>
                    )}
                </AdminListPanel>
            </div>
        </main>
    )
}
