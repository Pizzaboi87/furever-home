import type { EChartsOption } from 'echarts'
import { CheckCircle2, ClipboardList, Radar, TrendingUp } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { DashboardChart } from '@/components/admin/dashboard/DashboardChart'
import { formatLabel } from '@/lib/pet-format'

export type DashboardDemandPet = {
    id: string
    name: string
    species: string
    status: string
    applications: number
}

type ApplicationDemandSectionProps = {
    pipelineOption: EChartsOption
    hasPipelineData: boolean
    successfulAdoptions: number
    unresolvedApplicationWorkload: number
    topWaitlistPets: DashboardDemandPet[]
    lowInterestPets: DashboardDemandPet[]
}

const DemandList = ({ pets, emptyMessage }: { pets: DashboardDemandPet[]; emptyMessage: string }) => (
    <div className="flex flex-1 flex-col gap-2">
        {pets.map((pet) => (
            <div key={pet.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-input p-3 text-sm">
                <div>
                    <span className="font-semibold text-foreground">{pet.name}</span>
                    <p className="text-xs text-muted-foreground">{formatLabel(pet.species)} · {formatLabel(pet.status)}</p>
                </div>
                <span className="shrink-0 text-muted-foreground">{pet.applications} apps</span>
            </div>
        ))}
        {pets.length === 0 && (
            <div className="flex min-h-36 flex-1 items-center rounded-xl border border-dashed border-border bg-input p-4 text-sm text-muted-foreground">
                <p className='max-w-50 text-center mx-auto'>{emptyMessage}</p>
            </div>
        )}
    </div>
)

export const ApplicationDemandSection = ({
    pipelineOption,
    hasPipelineData,
    successfulAdoptions,
    unresolvedApplicationWorkload,
    topWaitlistPets,
    lowInterestPets,
}: ApplicationDemandSectionProps) => (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard padding="md">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Application Pipeline</h2>
                    <p className="text-sm text-muted-foreground">Selected-period applications grouped by final or current status.</p>
                </div>
                <TrendingUp className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <DashboardChart
                option={pipelineOption}
                hasData={hasPipelineData}
                emptyTitle="No application pipeline data"
                emptyDescription="The chart is working, but no applications match the selected period and filters."
                className="mb-6 h-70 w-full"
                emptyClassName="min-h-70"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                    { label: 'adopted pet records', value: successfulAdoptions, icon: CheckCircle2 },
                    { label: 'unresolved application workload', value: unresolvedApplicationWorkload, icon: ClipboardList },
                ].map((stat) => {
                    const Icon = stat.icon

                    return (
                        <div key={stat.label} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                            <div className="flex items-center gap-4">
                                <Icon className="h-9 w-9 shrink-0 text-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold leading-5 text-primary">{stat.label}</p>
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </SectionCard>

        <SectionCard padding="md" delay={0.12} className="flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Waitlist Signals</h2>
                    <p className="text-sm text-muted-foreground">Selected-period demand by pet, based on applications in this month and the active filters.</p>
                </div>
                <Radar className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Most requested</h3>
                    <DemandList pets={topWaitlistPets} emptyMessage="No pet demand signals match the selected filters." />
                </div>
                <div className="flex flex-col">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Least requested</h3>
                    <DemandList pets={lowInterestPets} emptyMessage="No low-interest pet signals match the selected filters." />
                </div>
            </div>
        </SectionCard>
    </section>
)
