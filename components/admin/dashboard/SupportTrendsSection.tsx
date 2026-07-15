import type { EChartsOption } from 'echarts'
import { DollarSign, Users } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { DashboardChart } from '@/components/admin/dashboard/DashboardChart'

type SupportTrendsSectionProps = {
    dailyDonationChartRangeLabel: string
    dailyDonationsOption: EChartsOption
    hasDailyDonationData: boolean
    historicalDonationChartTitle: string
    historicalDonationsOption: EChartsOption
    hasHistoricalDonationData: boolean
    selectedVolunteerTotal: number
    periodRowsShown: number
    activityOption: EChartsOption
    supportOption: EChartsOption
    hasActivityTrendData: boolean
    hasVolunteerSupportData: boolean
}

export const SupportTrendsSection = ({
    dailyDonationChartRangeLabel,
    dailyDonationsOption,
    hasDailyDonationData,
    historicalDonationChartTitle,
    historicalDonationsOption,
    hasHistoricalDonationData,
    selectedVolunteerTotal,
    periodRowsShown,
    activityOption,
    supportOption,
    hasActivityTrendData,
    hasVolunteerSupportData,
}: SupportTrendsSectionProps) => (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard padding="md">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Donation Trends</h2>
                    <p className="text-sm text-muted-foreground">Daily donations for the selected month, followed by a 12-month historical view.</p>
                </div>
                <DollarSign className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-5">
                <div>
                    <p className="mb-3 text-sm font-semibold text-foreground">Daily breakdown - {dailyDonationChartRangeLabel}</p>
                    <DashboardChart
                        option={dailyDonationsOption}
                        hasData={hasDailyDonationData}
                        emptyTitle="No daily donations"
                        emptyDescription="No donation records match the selected month and filters."
                        className="h-72 w-full"
                    />
                </div>
                <div>
                    <p className="mb-3 text-sm font-semibold text-foreground">{historicalDonationChartTitle}</p>
                    <DashboardChart
                        option={historicalDonationsOption}
                        hasData={hasHistoricalDonationData}
                        emptyTitle="No donation history"
                        emptyDescription="There are no donation records in the displayed historical period."
                        className="h-72 w-full"
                    />
                </div>
            </div>
        </SectionCard>

        <SectionCard padding="md" delay={0.12}>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Community Support</h2>
                    <p className="text-sm text-muted-foreground">Volunteer hours and support context rolled up by month.</p>
                </div>
                <Users className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-input p-4">
                    <p className="text-3xl font-bold text-foreground">{selectedVolunteerTotal.toFixed(2)}</p>
                    <p className="text-sm leading-5 text-muted-foreground">volunteer hours</p>
                </div>
                <div className="rounded-xl border border-border bg-input p-4">
                    <p className="text-3xl font-bold text-foreground">{periodRowsShown}</p>
                    <p className="text-sm leading-5 text-muted-foreground">period rows shown</p>
                </div>
            </div>
            <DashboardChart
                option={activityOption}
                hasData={hasActivityTrendData}
                emptyTitle="No operational trend data"
                emptyDescription="No application or intake activity matches the selected period."
                className="h-64 w-full rounded-xl border border-border bg-input p-2"
                emptyClassName="min-h-64"
            />
            <div className="mt-4">
                <DashboardChart
                    option={supportOption}
                    hasData={hasVolunteerSupportData}
                    emptyTitle="No volunteer support data"
                    emptyDescription="No volunteer hours are recorded for the displayed period."
                    className="h-72 w-full rounded-xl border border-border bg-input p-2"
                />
            </div>
        </SectionCard>
    </section>
)
