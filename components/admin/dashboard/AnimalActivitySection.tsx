import type { EChartsOption } from 'echarts'
import { Bell, History, PawPrint } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { DashboardChart } from '@/components/admin/dashboard/DashboardChart'
import EmptyState from '@/components/ui/EmptyState'
import type { DashboardRecord, DashboardRecordValue } from '@/lib/admin/domain'

type AnimalActivitySectionProps = {
    speciesOption: EChartsOption
    ageOption: EChartsOption
    hasSpeciesData: boolean
    hasAgeData: boolean
    averageStay: number
    reservedCount: number
    speciesFocusCount: number
    availableCount: number
    youngPetsCount: number
    seniorPetsCount: number
    activityEvents: DashboardRecord[]
    getActivityKey: (value: DashboardRecordValue, fallback: string) => string | number
}

export const AnimalActivitySection = ({
    speciesOption,
    ageOption,
    hasSpeciesData,
    hasAgeData,
    averageStay,
    reservedCount,
    speciesFocusCount,
    availableCount,
    youngPetsCount,
    seniorPetsCount,
    activityEvents,
    getActivityKey,
}: AnimalActivitySectionProps) => (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
        <SectionCard padding="md">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Animal Statistics</h2>
                    <p className="text-sm text-muted-foreground">
                        Population, age mix, average stay, reserved capacity, and monthly species pressure.
                    </p>
                </div>
                <PawPrint className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
                <DashboardChart
                    option={speciesOption}
                    hasData={hasSpeciesData}
                    emptyTitle="No animal population data"
                    emptyDescription="No pet records match the selected month and filters."
                    className="h-70 w-full"
                    emptyClassName="min-h-70"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                        [averageStay, 'avg. days in shelter'],
                        [reservedCount, 'reserved pets'],
                        [speciesFocusCount, 'top species now'],
                        [availableCount, 'available pets'],
                        [youngPetsCount, 'young pets'],
                        [seniorPetsCount, 'senior pets'],
                    ].map(([value, label]) => (
                        <div key={label} className="rounded-xl border border-border bg-input p-4">
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            <p className="text-sm leading-5 text-muted-foreground">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <DashboardChart
                    option={ageOption}
                    hasData={hasAgeData}
                    emptyTitle="No age distribution data"
                    emptyDescription="There are no pet age records for the selected month and filters."
                    className="h-55 w-full rounded-lg border border-border bg-input p-2"
                    emptyClassName="min-h-55"
                />
            </div>
        </SectionCard>

        <SectionCard padding="md" delay={0.12} className="flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Activity History</h2>
                    <p className="text-sm text-muted-foreground">
                        Historical operations events for the selected month and filters.
                    </p>
                </div>
                <Bell className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>

            {activityEvents.length === 0 ? (
                <EmptyState
                    icon={History}
                    title="No activity history"
                    description="No operational events match the selected month and filters."
                    className="flex-1"
                />
            ) : (
                <div className="max-h-130 space-y-4 overflow-y-auto pr-4">
                    {activityEvents.map((item) => (
                        <div
                            key={getActivityKey(item.id, `activity-${item.createdAt ?? item.title ?? item.detail ?? 'event'}`)}
                            className="rounded-xl border border-border bg-input p-4"
                        >
                            <p className="font-semibold text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.detail}</p>
                            <p className="mt-2 text-xs font-medium text-primary">
                                {item.actorName ? `By ${item.actorName} · ` : ''}
                                {new Date(item.createdAt ?? '').toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    </section>
)
