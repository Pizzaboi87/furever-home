import type { LucideIcon } from 'lucide-react'

export type DashboardOverviewCard = {
    label: string
    value: string
    detail: string
    icon: LucideIcon
}

export type DashboardPeriodSummary = {
    intakes: number
    adoptions: number
    applications: number
    donationAmount: number
}

export type DashboardApplicationFocus = {
    type: string
    applications: number
    pets: number
}
