import type {
    AdminPet,
    DashboardRecord,
    DashboardRecordValue,
} from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

export const chartColors = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF']

export type DashboardPetRecord = AdminPet | DashboardRecord

export const getCompactChartWindow = <TItem,>(items: TItem[], shouldCompact: boolean) => {
    if (!shouldCompact || items.length <= 1) {
        return items
    }

    return items.slice(Math.floor(items.length / 2))
}

export const dashboardDateValue = (value: DashboardRecordValue) => {
    return typeof value === 'string' ? value : undefined
}

export const dashboardKeyValue = (value: DashboardRecordValue, fallback: string) => {
    if (typeof value === 'string' || typeof value === 'number') {
        return value
    }

    return fallback
}

export const getPetRecordValue = (
    pet: DashboardPetRecord,
    key: string,
): DashboardRecordValue => {
    return (pet as unknown as Record<string, DashboardRecordValue>)[key]
}

export const getPetType = (pet: DashboardPetRecord) => {
    return normalizeValue(
        getPetRecordValue(pet, 'type') ?? getPetRecordValue(pet, 'species'),
    )
}

export const formatDateRangeLabel = (value: string) => {
    if (value === 'all') {
        return 'All time'
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return new Date(`${value}-01T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })
}

export const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export const getMonthKey = (value: string) => value.slice(0, 7)

export const isDailyRange = (dateRange: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateRange)

export const isMonthlyRange = (dateRange: string) => /^\d{4}-\d{2}$/.test(dateRange)

export const isInSelectedDateRange = (date: string | undefined, dateRange: string) => {
    if (!date || dateRange === 'all') {
        return true
    }

    if (isDailyRange(dateRange)) {
        return date === dateRange
    }

    if (isMonthlyRange(dateRange)) {
        return date.startsWith(dateRange)
    }

    return true
}

export const getHistoricalMonthlyWindow = (
    selectedMonth: string,
    monthlySummaries: DashboardRecord[],
) => {
    if (!monthlySummaries.length) {
        return []
    }

    const fallbackIndex = Math.max(0, monthlySummaries.length - 1)
    const selectedIndex = Math.max(
        0,
        monthlySummaries.findIndex((item) => item.month === selectedMonth),
    )
    const index = selectedIndex >= 0 ? selectedIndex : fallbackIndex
    const windowSize = Math.min(12, monthlySummaries.length)
    const maxStart = Math.max(0, monthlySummaries.length - windowSize)
    const start = Math.min(Math.max(index - 5, 0), maxStart)

    return monthlySummaries.slice(start, start + windowSize)
}

export const formatDateKey = (value: Date) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const getCurrentMonthKey = () => formatDateKey(new Date()).slice(0, 7)

export const getCalendarDatesForMonth = (selectedMonth: string) => {
    const year = Number(selectedMonth.slice(0, 4))
    const monthIndex = Number(selectedMonth.slice(5, 7)) - 1
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    return Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(year, monthIndex, index + 1)

        return formatDateKey(date)
    })
}

export const getRollingDailyDonationDates = (
    selectedMonth: string,
    availableDates: string[] = [],
) => {
    const today = new Date()
    const currentMonthKey = getCurrentMonthKey()

    if (selectedMonth === currentMonthKey) {
        return Array.from({ length: 30 }, (_, index) => {
            const date = new Date(today)
            date.setDate(today.getDate() - (29 - index))

            return formatDateKey(date)
        })
    }

    if (availableDates.length > 0) {
        return availableDates
    }

    return getCalendarDatesForMonth(selectedMonth)
}

export const sumBy = (records: DashboardPetRecord[], key: string) => {
    return records.reduce(
        (sum, item) => sum + Number(getPetRecordValue(item, key) ?? 0),
        0,
    )
}

export const averageBy = (records: DashboardPetRecord[], key: string) => {
    if (!records.length) {
        return 0
    }

    return Math.round(sumBy(records, key) / records.length)
}

export const normalizeDashboardValue = (value: unknown) => {
    if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
    ) {
        return normalizeValue(value)
    }

    return ''
}

export const isPositiveApplicationDecision = (status: unknown) => {
    return ['approved', 'completed', 'closed', 'adopted'].includes(
        normalizeDashboardValue(status),
    )
}

export const isActiveApplicationStatus = (status: unknown) => {
    return !['completed', 'closed'].includes(normalizeDashboardValue(status))
}

export const isDecidedApplicationStatus = (status: unknown) => {
    return [
        'approved',
        'completed',
        'closed',
        'adopted',
        'declined',
        'rejected',
        'cancelled',
        'canceled',
        'no_response',
        'withdrawn',
    ].includes(normalizeDashboardValue(status))
}

export const getApplicationApprovalDetail = (
    decidedApplications: DashboardRecord[],
) => {
    if (!decidedApplications.length) {
        return 'No decisions yet'
    }

    const positiveDecisions = decidedApplications.filter((item) =>
        isPositiveApplicationDecision(item.status),
    ).length

    const approvalRate = Math.round(
        (positiveDecisions / decidedApplications.length) * 100,
    )

    return `${approvalRate}% approved · ${decidedApplications.length} decisions`
}
