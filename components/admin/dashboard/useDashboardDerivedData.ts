import {
    Bell,
    ClipboardList,
    DollarSign,
    HeartHandshake,
    LineChart,
    PawPrint,
} from 'lucide-react'

import { useDashboardChartOptions } from '@/components/admin/dashboard/useDashboardChartOptions'
import type { DashboardRecord } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'
import {
    averageBy,
    formatCurrency,
    formatDateKey,
    formatDateRangeLabel,
    getApplicationApprovalDetail,
    getCompactChartWindow,
    getCurrentMonthKey,
    getPetRecordValue,
    isDecidedApplicationStatus,
    sumBy,
    type DashboardPetRecord,
} from '@/utils/admin/dashboard/dashboard-utils'

type UseDashboardDerivedDataArgs = {
    ageGroups: string[]
    applicationStatusValues: string[]
    dailyDonationDates: string[]
    dailySummaries: DashboardRecord[]
    dateRange: string
    decidedApplicationsInSelectedPeriod: DashboardRecord[]
    donationRecordsMatchingFilters: DashboardRecord[]
    filteredActivityEvents: DashboardRecord[]
    filteredAdoptions: DashboardRecord[]
    filteredApplications: DashboardRecord[]
    filteredDonations: DashboardRecord[]
    filteredIntakes: DashboardRecord[]
    filteredPets: DashboardPetRecord[]
    filteredPetStatusEvents: DashboardRecord[]
    filteredVolunteerHours: DashboardRecord[]
    historicalMonthlyWindow: DashboardRecord[]
    selectedMonthKey: string
    shouldUseCompactCharts: boolean
    speciesFilter: string
    speciesMonthlySummaries: DashboardRecord[]
    speciesValues: string[]
}

export const useDashboardDerivedData = ({
    ageGroups,
    applicationStatusValues,
    dailyDonationDates,
    dailySummaries,
    dateRange,
    decidedApplicationsInSelectedPeriod,
    donationRecordsMatchingFilters,
    filteredActivityEvents,
    filteredAdoptions,
    filteredApplications,
    filteredDonations,
    filteredIntakes,
    filteredPets,
    filteredPetStatusEvents,
    filteredVolunteerHours,
    historicalMonthlyWindow,
    selectedMonthKey,
    shouldUseCompactCharts,
    speciesFilter,
    speciesMonthlySummaries,
    speciesValues,
}: UseDashboardDerivedDataArgs) => {
    const shelterSnapshot = filteredPets.filter((pet) => {
        if (typeof getPetRecordValue(pet, 'inShelter') === 'boolean') {
            return Boolean(getPetRecordValue(pet, 'inShelter'))
        }

        return normalizeValue(getPetRecordValue(pet, 'status') ?? getPetRecordValue(pet, 'toStatus')) !== 'adopted'
    })

    const hasMonthEndShelterSnapshot = shelterSnapshot.length > 0
    const petPopulationForCharts: DashboardPetRecord[] = hasMonthEndShelterSnapshot ? shelterSnapshot : filteredPets
    const petPopulationLabel = hasMonthEndShelterSnapshot
        ? 'shelter population'
        : 'monthly pet records'

    const donationFilteredTotal = sumBy(filteredDonations, 'amount')
    const selectedDonationTotal = donationFilteredTotal
    const selectedVolunteerTotal = sumBy(filteredVolunteerHours, 'hours')
    const approvedApplicationsInSelectedPeriod = filteredApplications.filter(
        (item) => normalizeValue(item.status) === 'approved',
    ).length
    const unresolvedApplicationWorkload = filteredApplications.filter(
        (item) => !isDecidedApplicationStatus(item.status),
    ).length
    const applicationPipelineStatusValues = [
        ...new Set(filteredApplications.map((item) => normalizeValue(item.status)).filter(Boolean)),
    ]
    const pipelineStatusValues = applicationPipelineStatusValues.length
        ? applicationPipelineStatusValues
        : applicationStatusValues
    const newApplicationsInSelectedPeriod = filteredApplications.length
    const applicationApprovalDetail = getApplicationApprovalDetail(decidedApplicationsInSelectedPeriod)
    const successfulAdoptions = filteredAdoptions.length
    const reservedCount = petPopulationForCharts.filter((pet) => normalizeValue(getPetRecordValue(pet, 'status') ?? getPetRecordValue(pet, 'toStatus')) === 'reserved').length
    const availableCount = petPopulationForCharts.filter((pet) => normalizeValue(getPetRecordValue(pet, 'status') ?? getPetRecordValue(pet, 'toStatus')) === 'available').length
    const youngPetsCount = petPopulationForCharts.filter((pet) => normalizeValue(getPetRecordValue(pet, 'ageGroup')) === 'young').length
    const seniorPetsCount = petPopulationForCharts.filter((pet) => normalizeValue(getPetRecordValue(pet, 'ageGroup')) === 'senior').length
    const averageStay = filteredAdoptions.length ? averageBy(filteredAdoptions, 'daysInShelter') : averageBy(filteredPets, 'daysInShelter')
    const totalIntakes = filteredIntakes.length
    const totalAdoptions = filteredAdoptions.length
    const totalActivityEvents = filteredActivityEvents.length
    const avgApplicationScore = averageBy(filteredApplications, 'score')
    const todayDateKey = formatDateKey(new Date())

    const dailyDonationSeries = dailyDonationDates.map((date) => ({
        date,
        label: date.slice(5),
        value: donationRecordsMatchingFilters
            .filter((item) => item.date === date)
            .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    }))
    const visibleDailyDonationSeries = getCompactChartWindow(dailyDonationSeries, shouldUseCompactCharts)

    const historicalDonationSummaries = historicalMonthlyWindow.map((month) => ({
        month: String(month.month),
        label: formatDateRangeLabel(String(month.month)),
        volunteerHours: Number(month.volunteerHours ?? 0),
        total: donationRecordsMatchingFilters
            .filter((item) => String(item.date).startsWith(String(month.month)))
            .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    }))
    const visibleHistoricalDonationSummaries = getCompactChartWindow(
        historicalDonationSummaries,
        shouldUseCompactCharts,
    )

    const activityTrendSummaries = getCompactChartWindow(
        dailyDonationDates.map((date) => {
            const summary = dailySummaries.find((item) => item.date === date)

            return {
                date,
                applications: Number(summary?.applications ?? 0),
                intakes: Number(summary?.intakes ?? 0),
            }
        }),
        shouldUseCompactCharts,
    )

    const dailyDonationChartRangeLabel = shouldUseCompactCharts && visibleDailyDonationSeries.length < dailyDonationSeries.length
        ? `Recent ${visibleDailyDonationSeries.length} days`
        : selectedMonthKey === getCurrentMonthKey()
            ? 'Last 30 days'
            : formatDateRangeLabel(selectedMonthKey)
    const historicalDonationChartTitle = shouldUseCompactCharts && visibleHistoricalDonationSummaries.length < historicalDonationSummaries.length
        ? `Recent ${visibleHistoricalDonationSummaries.length}-month historical trend`
        : '12-month historical trend'

    const chartOptions = useDashboardChartOptions({
        speciesValues,
        ageGroups,
        pipelineStatusValues,
        petPopulationForCharts,
        filteredApplications,
        visibleDailyDonationSeries,
        visibleHistoricalDonationSummaries,
        activityTrendSummaries,
        shouldUseCompactCharts,
        todayDateKey,
        selectedMonthKey,
    })

    const hasSpeciesData = petPopulationForCharts.length > 0
    const hasAgeData = petPopulationForCharts.some((pet) => Boolean(normalizeValue(getPetRecordValue(pet, 'ageGroup'))))
    const hasPipelineData = filteredApplications.length > 0
    const hasDailyDonationData = visibleDailyDonationSeries.some((item) => item.value > 0)
    const hasHistoricalDonationData = visibleHistoricalDonationSummaries.some((item) => item.total > 0)
    const hasActivityTrendData = activityTrendSummaries.some((item) => item.applications > 0 || item.intakes > 0)
    const hasVolunteerSupportData = visibleHistoricalDonationSummaries.some((item) => item.volunteerHours > 0)

    const applicationsByPet = filteredApplications.reduce<
        Record<string, { count: number; petName: string; type: string }>
    >((acc, item) => {
        const petId = String(item.petId ?? '')

        if (!petId) {
            return acc
        }

        acc[petId] = acc[petId] ?? {
            count: 0,
            petName: String(item.petName ?? 'Unknown pet'),
            type: normalizeValue(item.type),
        }
        acc[petId].count += 1
        return acc
    }, {})

    const petDemandSignals = petPopulationForCharts
        .map((pet) => {
            const petId = String(getPetRecordValue(pet, 'petId') ?? getPetRecordValue(pet, 'id') ?? '')
            const demand = applicationsByPet[petId]

            return {
                id: petId,
                name: String(demand?.petName ?? getPetRecordValue(pet, 'petName') ?? getPetRecordValue(pet, 'name') ?? 'Unknown pet'),
                species: normalizeValue(demand?.type || getPetRecordValue(pet, 'type') || getPetRecordValue(pet, 'species')),
                status: normalizeValue(getPetRecordValue(pet, 'status') ?? getPetRecordValue(pet, 'toStatus')),
                applications: demand?.count ?? 0,
            }
        })
        .filter((pet) => Boolean(pet.id))

    const topWaitlistPets = [...petDemandSignals]
        .sort((a, b) => b.applications - a.applications || a.name.localeCompare(b.name))
        .slice(0, 5)
    const lowInterestPets = [...petDemandSignals]
        .sort((a, b) => a.applications - b.applications || a.name.localeCompare(b.name))
        .slice(0, 5)

    const speciesFocus = speciesMonthlySummaries
        .filter((item) => item.month === selectedMonthKey)
        .filter((item) => speciesFilter === 'all' || normalizeValue(item.type) === speciesFilter)
        .sort((a, b) => Number(b.applications ?? 0) - Number(a.applications ?? 0))
        .slice(0, 4)

    const rollingApplicationFocus = Object.values(
        filteredApplications.reduce<Record<string, { type: string; applications: number; pets: Set<string> }>>((acc, item) => {
            const type = normalizeValue(item.type || 'unknown')
            const petId = String(item.petId ?? '')

            if (speciesFilter !== 'all' && type !== speciesFilter) {
                return acc
            }

            acc[type] = acc[type] ?? { type, applications: 0, pets: new Set<string>() }
            acc[type].applications += 1

            if (petId) {
                acc[type].pets.add(petId)
            }

            return acc
        }, {}),
    )
        .map((item) => ({ type: item.type, applications: item.applications, pets: item.pets.size }))
        .sort((a, b) => b.applications - a.applications || a.type.localeCompare(b.type))
        .slice(0, 4)

    const hasMonthlySpeciesFocus = speciesFocus.length > 0
    const monthlySummaryFocusTitle = hasMonthlySpeciesFocus
        ? 'Monthly species movement'
        : 'Application workload'
    const periodRowsShown = dateRange === 'all'
        ? visibleHistoricalDonationSummaries.length
        : visibleDailyDonationSeries.length
    const periodSummary = {
        intakes: totalIntakes,
        adoptions: totalAdoptions,
        applications: filteredApplications.length,
        donationAmount: selectedDonationTotal,
    }
    const overviewCards = [
        { label: 'Intake Events', value: totalIntakes.toString(), detail: 'filtered by type and health', icon: PawPrint },
        {
            label: 'Approved Applications',
            value: approvedApplicationsInSelectedPeriod.toString(),
            detail: `${newApplicationsInSelectedPeriod} new in selected period`,
            icon: ClipboardList,
        },
        { label: 'Donations', value: formatCurrency(selectedDonationTotal), detail: `${formatDateRangeLabel(dateRange)} selection`, icon: DollarSign },
        { label: 'Activity Events', value: totalActivityEvents.toString(), detail: 'selected-period history', icon: Bell },
        { label: 'Successful Adoptions', value: totalAdoptions.toString(), detail: `${filteredPetStatusEvents.length} status movements`, icon: HeartHandshake },
        { label: 'Avg. Score', value: avgApplicationScore.toString(), detail: 'filtered application quality', icon: LineChart },
    ]

    return {
        ...chartOptions,
        applicationApprovalDetail,
        availableCount,
        averageStay,
        dailyDonationChartRangeLabel,
        donationFilteredTotal,
        hasActivityTrendData,
        hasAgeData,
        hasDailyDonationData,
        hasHistoricalDonationData,
        hasMonthlySpeciesFocus,
        hasPipelineData,
        hasSpeciesData,
        hasVolunteerSupportData,
        historicalDonationChartTitle,
        lowInterestPets,
        monthlySummaryFocusTitle,
        newApplicationsInSelectedPeriod,
        overviewCards,
        periodRowsShown,
        periodSummary,
        petPopulationForCharts,
        petPopulationLabel,
        reservedCount,
        rollingApplicationFocus,
        selectedDonationTotal,
        selectedVolunteerTotal,
        seniorPetsCount,
        speciesFocus,
        successfulAdoptions,
        topWaitlistPets,
        totalActivityEvents,
        totalAdoptions,
        approvedApplicationsInSelectedPeriod,
        unresolvedApplicationWorkload,
        totalIntakes,
        youngPetsCount,
    }
}
