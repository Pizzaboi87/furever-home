import { LineChart, ShieldCheck } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import type { DashboardApplicationFocus, DashboardPeriodSummary } from '@/components/admin/dashboard/dashboard-types'
import type { DashboardRecord } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

type MonthlySummarySectionProps = {
    periodSummary: DashboardPeriodSummary
    monthlySummaryFocusTitle: string
    hasMonthlySpeciesFocus: boolean
    speciesFocus: DashboardRecord[]
    rollingApplicationFocus: DashboardApplicationFocus[]
    speciesFilter: string
    intakeHealthFilter: string
    approvedApplicationsInSelectedPeriod: number
    newApplicationsInSelectedPeriod: number
    applicationApprovalDetail: string
    applicationChannelFilter: string
    donationFilteredTotal: number
    donationStatusFilter: string
    formatCurrency: (value: number) => string
}

export const MonthlySummarySection = ({
    periodSummary,
    monthlySummaryFocusTitle,
    hasMonthlySpeciesFocus,
    speciesFocus,
    rollingApplicationFocus,
    speciesFilter,
    intakeHealthFilter,
    approvedApplicationsInSelectedPeriod,
    newApplicationsInSelectedPeriod,
    applicationApprovalDetail,
    applicationChannelFilter,
    donationFilteredTotal,
    donationStatusFilter,
    formatCurrency,
}: MonthlySummarySectionProps) => (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard padding="md" className="flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Monthly Summary</h2>
                    <p className="text-sm text-muted-foreground">Roll-up from daily and monthly summaries.</p>
                </div>
                <LineChart className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    [periodSummary.intakes, 'selected period intakes'],
                    [periodSummary.adoptions, 'selected period adoptions'],
                    [periodSummary.applications, 'selected period applications'],
                    [formatCurrency(periodSummary.donationAmount), 'selected period donations'],
                ].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-border bg-input p-4">
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        <p className="text-sm leading-5 text-muted-foreground">{label}</p>
                    </div>
                ))}
            </div>
            <div className="mt-5 flex flex-1 flex-col">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {monthlySummaryFocusTitle}
                </p>
                <div className="flex flex-1 flex-col gap-2">
                    {hasMonthlySpeciesFocus
                        ? speciesFocus.map((item) => (
                            <div key={`${item.month}-${item.type}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-input p-3 text-sm">
                                <div>
                                    <p className="font-semibold text-foreground">{formatLabel(String(item.type ?? 'unknown'))}</p>
                                    <p className="text-xs text-muted-foreground">{item.month}</p>
                                </div>
                                <p className="text-right text-muted-foreground">
                                    {Number(item.intakes ?? 0)} intakes · {Number(item.adoptions ?? 0)} adoptions · {Number(item.applications ?? 0)} apps
                                </p>
                            </div>
                        ))
                        : rollingApplicationFocus.map((item) => (
                            <div key={item.type} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-input p-3 text-sm">
                                <div>
                                    <p className="font-semibold text-foreground">{formatLabel(item.type)}</p>
                                    <p className="text-xs text-muted-foreground">Application workload</p>
                                </div>
                                <p className="text-right text-muted-foreground">{item.applications} apps · {item.pets} pets</p>
                            </div>
                        ))}
                    {!hasMonthlySpeciesFocus && rollingApplicationFocus.length === 0 && (
                        <div className="flex min-h-36 flex-1 items-center rounded-xl border border-dashed border-border bg-input p-4 text-sm text-muted-foreground">
                            <p className='text-center mx-auto max-w-xs'>No monthly movement or active application workload matches the selected filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </SectionCard>

        <SectionCard padding="md" delay={0.12}>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Summary Snapshot</h2>
                    <p className="text-sm text-muted-foreground">What the filtered dashboard currently emphasizes.</p>
                </div>
                <ShieldCheck className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-input p-4">
                    <p className="text-sm font-semibold text-foreground">Selected intake slice</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatLabel(speciesFilter === 'all' ? 'All species' : speciesFilter)} · {formatLabel(intakeHealthFilter === 'all' ? 'All health states' : intakeHealthFilter)}</p>
                </div>
                <div className="rounded-xl border border-border bg-input p-4">
                    <p className="text-sm font-semibold text-foreground">Application slice</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {approvedApplicationsInSelectedPeriod} approved in selected period · {newApplicationsInSelectedPeriod} new in selected period · {applicationApprovalDetail} · {formatLabel(applicationChannelFilter === 'all' ? 'All channels' : applicationChannelFilter)}
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-input p-4">
                    <p className="text-sm font-semibold text-foreground">Support slice</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(donationFilteredTotal)} in donations · {formatLabel(donationStatusFilter === 'all' ? 'All statuses' : donationStatusFilter)}</p>
                </div>
                <div className="rounded-xl border border-border bg-indigo-50 p-4">
                    <p className="text-sm font-semibold text-primary">Notes</p>
                    <p className="mt-1 pr-4 text-sm text-muted-foreground">Prioritize follow-ups based on the selected species, application activity, and donation support. Use this view to spot rising demand, low-interest pets, and records that may need faster outreach, refreshed profile details, or a clearer adoption campaign focus for the current priorities.</p>
                </div>
            </div>
        </SectionCard>
    </section>
)
