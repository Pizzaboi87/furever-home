'use client'

import { useCallback, useMemo, useState } from 'react'

import { AnimalActivitySection } from '@/components/admin/dashboard/AnimalActivitySection'
import { ApplicationDemandSection } from '@/components/admin/dashboard/ApplicationDemandSection'
import { DashboardFilters } from '@/components/admin/dashboard/DashboardFilters'
import { DashboardOverviewCards } from '@/components/admin/dashboard/DashboardOverviewCards'
import { MonthlySummarySection } from '@/components/admin/dashboard/MonthlySummarySection'
import { SupportTrendsSection } from '@/components/admin/dashboard/SupportTrendsSection'
import { useCompactDashboardCharts } from '@/components/admin/dashboard/useCompactDashboardCharts'
import { useDashboardDerivedData } from '@/components/admin/dashboard/useDashboardDerivedData'
import { useDashboardFilterOptions } from '@/components/admin/dashboard/useDashboardFilterOptions'
import {
    dashboardDateValue,
    dashboardKeyValue,
    formatCurrency,
    formatDateRangeLabel,
    getHistoricalMonthlyWindow,
    getMonthKey,
    getPetRecordValue,
    getPetType,
    getRollingDailyDonationDates,
    isDecidedApplicationStatus,
    isInSelectedDateRange,
    type DashboardPetRecord,
} from '@/utils/admin/dashboard/dashboard-utils'
import { normalizeValue } from '@/lib/pet-format'
import Header from '@/components/admin/common/Header'
import type { AdminDashboardDataset, DashboardRecord } from '@/lib/admin/domain'

type DashboardClientProps = {
    dashboardDataset: AdminDashboardDataset
}

export default function DashboardClient({ dashboardDataset }: DashboardClientProps) {
    const shouldUseCompactCharts = useCompactDashboardCharts()
    const pets = dashboardDataset.pets
    const intakes = dashboardDataset.intakes
    const adoptions = dashboardDataset.adoptions
    const applications = dashboardDataset.applications
    const donations = dashboardDataset.donations
    const volunteerHours = dashboardDataset.volunteerHours
    const activityEvents = dashboardDataset.activityEvents
    const dailySummaries = dashboardDataset.dailySummaries
    const monthlySummaries = dashboardDataset.monthlySummaries
    const speciesMonthlySummaries = dashboardDataset.speciesMonthlySummaries
    const petStatusEvents = dashboardDataset.petStatusEvents
    const monthlyPetSnapshots = dashboardDataset.monthlyPetSnapshots

    const {
        latestMonthValue,
        dateRangeValues,
        intakeHealthValues,
        applicationStatusValues,
        applicationChannelValues,
        donationStatusValues,
        donationSourceValues,
        activityTypeValues,
        speciesValues,
        statusValues,
        ageGroups,
        sizeValues,
        genderValues,
    } = useDashboardFilterOptions(dashboardDataset)

    const [dateRange, setDateRange] = useState(latestMonthValue)
    const [speciesFilter, setSpeciesFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [ageGroupFilter, setAgeGroupFilter] = useState('all')
    const [sizeFilter, setSizeFilter] = useState('all')
    const [genderFilter, setGenderFilter] = useState('all')
    const [intakeHealthFilter, setIntakeHealthFilter] = useState('all')
    const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
    const [applicationChannelFilter, setApplicationChannelFilter] = useState('all')
    const [donationStatusFilter, setDonationStatusFilter] = useState('all')
    const [donationSourceFilter, setDonationSourceFilter] = useState('all')
    const [activityTypeFilter, setActivityTypeFilter] = useState('all')

    const selectedMonthKey = dateRange === 'all' ? latestMonthValue : getMonthKey(dateRange)
    const availableDailyDatesForSelectedMonth = useMemo(() => {
        return [
            ...new Set(
                [
                    ...dailySummaries.map((item) => String(item.date ?? '')),
                    ...intakes.map((item) => String(item.date ?? '')),
                    ...applications.map((item) => String(item.date ?? '')),
                    ...donations.map((item) => String(item.date ?? '')),
                    ...volunteerHours.map((item) => String(item.date ?? '')),
                    ...activityEvents.map((item) => String(item.createdAt ?? '').slice(0, 10)),
                ]
                    .filter((date) => date.startsWith(selectedMonthKey))
                    .filter(Boolean),
            ),
        ].sort()
    }, [activityEvents, applications, dailySummaries, donations, intakes, selectedMonthKey, volunteerHours])

    const dailyDonationDates = useMemo(
        () => getRollingDailyDonationDates(selectedMonthKey, availableDailyDatesForSelectedMonth),
        [availableDailyDatesForSelectedMonth, selectedMonthKey],
    )
    const historicalMonthlyWindow = useMemo(
        () => getHistoricalMonthlyWindow(selectedMonthKey, monthlySummaries),
        [monthlySummaries, selectedMonthKey],
    )

    const filteredPets = useMemo(() => {
        const selectedMonthSnapshots = monthlyPetSnapshots.filter((pet) => pet.month === selectedMonthKey)
        const historicalPets: DashboardPetRecord[] = selectedMonthSnapshots.length ? selectedMonthSnapshots : pets

        return historicalPets.filter((pet) => {
            const petType = getPetType(pet)
            const petStatus = normalizeValue(getPetRecordValue(pet, 'status') ?? getPetRecordValue(pet, 'toStatus'))
            const matchSpecies = speciesFilter === 'all' || petType === speciesFilter
            const matchStatus = statusFilter === 'all' || petStatus === statusFilter
            const matchAgeGroup = ageGroupFilter === 'all' || normalizeValue(getPetRecordValue(pet, 'ageGroup')) === ageGroupFilter
            const matchSize = sizeFilter === 'all' || normalizeValue(getPetRecordValue(pet, 'size')) === sizeFilter
            const matchGender = genderFilter === 'all' || normalizeValue(getPetRecordValue(pet, 'gender')) === genderFilter
            return matchSpecies && matchStatus && matchAgeGroup && matchSize && matchGender
        })
    }, [ageGroupFilter, genderFilter, monthlyPetSnapshots, pets, selectedMonthKey, sizeFilter, speciesFilter, statusFilter])

    const selectedPetIds = useMemo(() => new Set(filteredPets.map((pet) => String(getPetRecordValue(pet, 'petId') ?? getPetRecordValue(pet, 'id')))), [filteredPets])

    // Date selection should not restrict operational events to the month-end shelter population.
    // Use the monthly pet snapshot as a cross-filter only when the user selects pet-only
    // dimensions that are not present on every event record.
    const shouldUseMonthlyPetContext = statusFilter !== 'all' || sizeFilter !== 'all'

    const filteredIntakes = useMemo(() => {
        return intakes.filter((item) => {
            const matchDate = isInSelectedDateRange(dashboardDateValue(item.date), dateRange)
            const matchMonthlyPetContext = !shouldUseMonthlyPetContext || selectedPetIds.has(String(item.petId))
            const matchHealth = intakeHealthFilter === 'all' || normalizeValue(item.healthStatus) === intakeHealthFilter
            const matchSpecies = speciesFilter === 'all' || normalizeValue(item.type) === speciesFilter
            const matchAgeGroup = ageGroupFilter === 'all' || normalizeValue(item.ageGroup) === ageGroupFilter
            const matchGender = genderFilter === 'all' || normalizeValue(item.gender) === genderFilter
            return matchDate && matchMonthlyPetContext && matchHealth && matchSpecies && matchAgeGroup && matchGender
        })
    }, [ageGroupFilter, dateRange, genderFilter, intakeHealthFilter, intakes, selectedPetIds, shouldUseMonthlyPetContext, speciesFilter])

    const filteredAdoptions = useMemo(() => {
        return adoptions.filter((item) => {
            const matchDate = isInSelectedDateRange(dashboardDateValue(item.date), dateRange)
            const matchMonthlyPetContext = !shouldUseMonthlyPetContext || selectedPetIds.has(String(item.petId))
            const matchSpecies = speciesFilter === 'all' || normalizeValue(item.type) === speciesFilter
            const matchAgeGroup = ageGroupFilter === 'all' || normalizeValue(item.ageGroup) === ageGroupFilter
            return matchDate && matchMonthlyPetContext && matchSpecies && matchAgeGroup
        })
    }, [adoptions, ageGroupFilter, dateRange, selectedPetIds, shouldUseMonthlyPetContext, speciesFilter])

    const applicationMatchesCurrentFilters = useCallback((item: DashboardRecord) => {
        const matchMonthlyPetContext = !shouldUseMonthlyPetContext || selectedPetIds.has(String(item.petId))
        const matchStatus = applicationStatusFilter === 'all' || normalizeValue(item.status) === applicationStatusFilter
        const matchChannel = applicationChannelFilter === 'all' || normalizeValue(item.channel) === applicationChannelFilter
        const matchSpecies = speciesFilter === 'all' || normalizeValue(item.type) === speciesFilter

        return matchMonthlyPetContext && matchStatus && matchChannel && matchSpecies
    }, [applicationChannelFilter, applicationStatusFilter, selectedPetIds, shouldUseMonthlyPetContext, speciesFilter])

    const filteredApplications = useMemo(() => {
        return applications.filter((item) => {
            const matchDate = isInSelectedDateRange(dashboardDateValue(item.date), dateRange)

            return matchDate && applicationMatchesCurrentFilters(item)
        })
    }, [applicationMatchesCurrentFilters, applications, dateRange])

    const decidedApplicationsInSelectedPeriod = useMemo(() => {
        return filteredApplications.filter((item) =>
            isDecidedApplicationStatus(item.status),
        )
    }, [filteredApplications])

    const donationRecordsMatchingFilters = useMemo(() => {
        return donations.filter((item) => {
            const matchStatus = donationStatusFilter === 'all' || normalizeValue(item.status) === donationStatusFilter
            const matchSource = donationSourceFilter === 'all' || normalizeValue(item.source) === donationSourceFilter
            return matchStatus && matchSource
        })
    }, [donationSourceFilter, donationStatusFilter, donations])

    const filteredDonations = useMemo(() => {
        return donationRecordsMatchingFilters.filter((item) => isInSelectedDateRange(dashboardDateValue(item.date), dateRange))
    }, [dateRange, donationRecordsMatchingFilters])

    const filteredVolunteerHours = useMemo(() => {
        if (dateRange === 'all') {
            return volunteerHours
        }

        const selectedDailyDates = new Set(dailyDonationDates)

        return volunteerHours.filter((item) =>
            selectedDailyDates.has(String(item.date)),
        )
    }, [dailyDonationDates, dateRange, volunteerHours])

    const filteredActivityEvents = useMemo(() => {
        return activityEvents.filter((item) => {
            const eventDate = String(item.createdAt ?? '').slice(0, 10)
            const matchDate = isInSelectedDateRange(eventDate, dateRange)
            const matchType = activityTypeFilter === 'all' || normalizeValue(item.type) === activityTypeFilter
            const hasPetReference = Boolean(item.petId)
            const matchMonthlyPetContext = !shouldUseMonthlyPetContext || (hasPetReference && selectedPetIds.has(String(item.petId))) || (!hasPetReference && speciesFilter === 'all' && statusFilter === 'all' && ageGroupFilter === 'all' && sizeFilter === 'all' && genderFilter === 'all')
            return matchDate && matchType && matchMonthlyPetContext
        })
    }, [activityEvents, activityTypeFilter, ageGroupFilter, dateRange, genderFilter, selectedPetIds, shouldUseMonthlyPetContext, sizeFilter, speciesFilter, statusFilter])

    const filteredPetStatusEvents = useMemo(() => {
        return petStatusEvents.filter((item) => {
            const matchDate = isInSelectedDateRange(dashboardDateValue(item.date), dateRange)
            const matchMonthlyPetContext = !shouldUseMonthlyPetContext || selectedPetIds.has(String(item.petId))
            const matchSpecies = speciesFilter === 'all' || normalizeValue(item.type) === speciesFilter
            const matchStatus = statusFilter === 'all' || normalizeValue(item.toStatus) === statusFilter
            const matchAgeGroup = ageGroupFilter === 'all' || normalizeValue(item.ageGroup) === ageGroupFilter
            return matchDate && matchMonthlyPetContext && matchSpecies && matchStatus && matchAgeGroup
        })
    }, [ageGroupFilter, dateRange, petStatusEvents, selectedPetIds, shouldUseMonthlyPetContext, speciesFilter, statusFilter])

    const {
        activityOption,
        ageOption,
        applicationApprovalDetail,
        availableCount,
        averageStay,
        dailyDonationChartRangeLabel,
        dailyDonationsOption,
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
        historicalDonationsOption,
        lowInterestPets,
        monthlySummaryFocusTitle,
        newApplicationsInSelectedPeriod,
        overviewCards,
        periodRowsShown,
        periodSummary,
        petPopulationForCharts,
        petPopulationLabel,
        pipelineOption,
        reservedCount,
        rollingApplicationFocus,
        selectedVolunteerTotal,
        seniorPetsCount,
        speciesFocus,
        speciesOption,
        successfulAdoptions,
        supportOption,
        topWaitlistPets,
        totalActivityEvents,
        approvedApplicationsInSelectedPeriod,
        unresolvedApplicationWorkload,
        youngPetsCount,
    } = useDashboardDerivedData({
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
    })

    const filterGroups = [
        {
            label: 'Intake filters',
            fields: [
                { label: 'Species', value: speciesFilter, onChange: setSpeciesFilter, options: speciesValues, allLabel: 'All species' },
                { label: 'Health', value: intakeHealthFilter, onChange: setIntakeHealthFilter, options: intakeHealthValues, allLabel: 'All health states' },
            ],
        },
        {
            label: 'Application filters',
            fields: [
                { label: 'Status', value: applicationStatusFilter, onChange: setApplicationStatusFilter, options: applicationStatusValues, allLabel: 'All statuses' },
                { label: 'Channel', value: applicationChannelFilter, onChange: setApplicationChannelFilter, options: applicationChannelValues, allLabel: 'All channels' },
            ],
        },
        {
            label: 'Support filters',
            fields: [
                { label: 'Donation status', value: donationStatusFilter, onChange: setDonationStatusFilter, options: donationStatusValues, allLabel: 'All statuses' },
                { label: 'Source', value: donationSourceFilter, onChange: setDonationSourceFilter, options: donationSourceValues, allLabel: 'All sources' },
            ],
        },
    ]

    return (
        <main className="min-h-screen bg-background">
            <Header
                currentHref="/admin/dashboard"
                title="Operations Dashboard"
                description="Monitor shelter activity, workload, demand, donations, volunteers, and trends."
            />

            <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                <DashboardFilters
                    petPopulationCount={petPopulationForCharts.length}
                    petPopulationLabel={petPopulationLabel}
                    newApplications={newApplicationsInSelectedPeriod}
                    approvedApplications={approvedApplicationsInSelectedPeriod}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    dateRangeValues={dateRangeValues}
                    formatDateRangeLabel={formatDateRangeLabel}
                    speciesFilter={speciesFilter}
                    setSpeciesFilter={setSpeciesFilter}
                    speciesValues={speciesValues}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    statusValues={statusValues}
                    ageGroupFilter={ageGroupFilter}
                    setAgeGroupFilter={setAgeGroupFilter}
                    ageGroups={ageGroups}
                    sizeFilter={sizeFilter}
                    setSizeFilter={setSizeFilter}
                    sizeValues={sizeValues}
                    genderFilter={genderFilter}
                    setGenderFilter={setGenderFilter}
                    genderValues={genderValues}
                    availableCount={availableCount}
                    youngPetsCount={youngPetsCount}
                    seniorPetsCount={seniorPetsCount}
                    filterGroups={filterGroups}
                    activityTypeFilter={activityTypeFilter}
                    setActivityTypeFilter={setActivityTypeFilter}
                    activityTypeValues={activityTypeValues}
                    totalActivityEvents={totalActivityEvents}
                />

                <DashboardOverviewCards cards={overviewCards} />

                <AnimalActivitySection
                    speciesOption={speciesOption}
                    ageOption={ageOption}
                    hasSpeciesData={hasSpeciesData}
                    hasAgeData={hasAgeData}
                    averageStay={averageStay}
                    reservedCount={reservedCount}
                    speciesFocusCount={speciesFocus.length}
                    availableCount={availableCount}
                    youngPetsCount={youngPetsCount}
                    seniorPetsCount={seniorPetsCount}
                    activityEvents={filteredActivityEvents}
                    getActivityKey={dashboardKeyValue}
                />

                <ApplicationDemandSection
                    pipelineOption={pipelineOption}
                    hasPipelineData={hasPipelineData}
                    successfulAdoptions={successfulAdoptions}
                    unresolvedApplicationWorkload={unresolvedApplicationWorkload}
                    topWaitlistPets={topWaitlistPets}
                    lowInterestPets={lowInterestPets}
                />

                <SupportTrendsSection
                    dailyDonationChartRangeLabel={dailyDonationChartRangeLabel}
                    dailyDonationsOption={dailyDonationsOption}
                    hasDailyDonationData={hasDailyDonationData}
                    historicalDonationChartTitle={historicalDonationChartTitle}
                    historicalDonationsOption={historicalDonationsOption}
                    hasHistoricalDonationData={hasHistoricalDonationData}
                    selectedVolunteerTotal={selectedVolunteerTotal}
                    periodRowsShown={periodRowsShown}
                    activityOption={activityOption}
                    supportOption={supportOption}
                    hasActivityTrendData={hasActivityTrendData}
                    hasVolunteerSupportData={hasVolunteerSupportData}
                />

                <MonthlySummarySection
                    periodSummary={periodSummary}
                    monthlySummaryFocusTitle={monthlySummaryFocusTitle}
                    hasMonthlySpeciesFocus={hasMonthlySpeciesFocus}
                    speciesFocus={speciesFocus}
                    rollingApplicationFocus={rollingApplicationFocus}
                    speciesFilter={speciesFilter}
                    intakeHealthFilter={intakeHealthFilter}
                    approvedApplicationsInSelectedPeriod={approvedApplicationsInSelectedPeriod}
                    newApplicationsInSelectedPeriod={newApplicationsInSelectedPeriod}
                    applicationApprovalDetail={applicationApprovalDetail}
                    applicationChannelFilter={applicationChannelFilter}
                    donationFilteredTotal={donationFilteredTotal}
                    donationStatusFilter={donationStatusFilter}
                    formatCurrency={formatCurrency}
                />
            </div>
        </main>
    )
}
