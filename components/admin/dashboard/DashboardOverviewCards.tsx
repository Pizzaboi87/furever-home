import SectionCard from '@/components/admin/common/SectionCard'
import type { DashboardOverviewCard } from '@/components/admin/dashboard/dashboard-types'

type DashboardOverviewCardsProps = {
    cards: DashboardOverviewCard[]
}

export const DashboardOverviewCards = ({ cards }: DashboardOverviewCardsProps) => (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
            const Icon = card.icon

            return (
                <SectionCard key={card.label} delay={index * 0.08}>
                    <div className="flex items-center gap-5">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
                            <Icon className="h-12 w-12" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold leading-5 text-muted-foreground">{card.label}</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.detail}</p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{card.value}</p>
                        </div>
                    </div>
                </SectionCard>
            )
        })}
    </section>
)
