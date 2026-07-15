import { useMemo } from 'react'

import type { AdminDashboardDataset } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'
import {
    getCurrentMonthKey,
    getPetRecordValue,
    getPetType,
} from '@/utils/admin/dashboard/dashboard-utils'

type DashboardFilterOptions = {
    latestMonthValue: string
    dateRangeValues: string[]
    intakeHealthValues: string[]
    applicationStatusValues: string[]
    applicationChannelValues: string[]
    donationStatusValues: string[]
    donationSourceValues: string[]
    activityTypeValues: string[]
    speciesValues: string[]
    statusValues: string[]
    ageGroups: string[]
    sizeValues: string[]
    genderValues: string[]
}

export const useDashboardFilterOptions = (
    dashboardDataset: AdminDashboardDataset,
): DashboardFilterOptions => {
    const {
        pets,
        intakes,
        applications,
        donations,
        activityEvents,
        monthlySummaries,
        petStatusEvents,
        monthlyPetSnapshots,
    } = dashboardDataset

    const latestMonthValue = getCurrentMonthKey()

    const dateRangeValues = useMemo(() => {
        const monthlySummaryValues = [
            ...new Set(
                [...monthlySummaries.map((item) => String(item.month ?? '')), latestMonthValue]
                    .filter(Boolean)
                    .sort(),
            ),
        ]

        return ['all', ...monthlySummaryValues]
    }, [latestMonthValue, monthlySummaries])

    const intakeHealthValues = useMemo(
        () => [...new Set(intakes.map((item) => normalizeValue(item.healthStatus)).filter(Boolean))],
        [intakes],
    )
    const applicationStatusValues = useMemo(
        () => [...new Set(applications.map((item) => normalizeValue(item.status)).filter(Boolean))],
        [applications],
    )
    const applicationChannelValues = useMemo(
        () => [...new Set(applications.map((item) => normalizeValue(item.channel)).filter(Boolean))],
        [applications],
    )
    const donationStatusValues = useMemo(
        () => [...new Set(donations.map((item) => normalizeValue(item.status)).filter(Boolean))],
        [donations],
    )
    const donationSourceValues = useMemo(
        () => [...new Set(donations.map((item) => normalizeValue(item.source)).filter(Boolean))],
        [donations],
    )
    const activityTypeValues = useMemo(
        () => [...new Set(activityEvents.map((item) => normalizeValue(item.type)).filter(Boolean))],
        [activityEvents],
    )

    const speciesValues = useMemo(
        () => [
            ...new Set(
                [
                    ...monthlyPetSnapshots.map((pet) => normalizeValue(pet.type)),
                    ...pets.map((pet) => getPetType(pet)),
                    ...intakes.map((item) => normalizeValue(item.type)),
                ].filter(Boolean),
            ),
        ],
        [intakes, monthlyPetSnapshots, pets],
    )

    const statusValues = useMemo(
        () => [
            ...new Set(
                [
                    ...monthlyPetSnapshots.map((pet) => normalizeValue(pet.status)),
                    ...pets.map((pet) => normalizeValue(pet.status)),
                    ...petStatusEvents.map((item) => normalizeValue(item.toStatus)),
                ].filter(Boolean),
            ),
        ],
        [monthlyPetSnapshots, petStatusEvents, pets],
    )

    const ageGroups = useMemo(
        () => [
            ...new Set(
                [
                    ...monthlyPetSnapshots.map((pet) => normalizeValue(getPetRecordValue(pet, 'ageGroup'))),
                    ...pets.map((pet) => normalizeValue(getPetRecordValue(pet, 'ageGroup'))),
                    ...intakes.map((item) => normalizeValue(item.ageGroup)),
                ].filter(Boolean),
            ),
        ],
        [intakes, monthlyPetSnapshots, pets],
    )

    const sizeValues = useMemo(
        () => [
            ...new Set(
                [
                    ...monthlyPetSnapshots.map((pet) => normalizeValue(getPetRecordValue(pet, 'size'))),
                    ...pets.map((pet) => normalizeValue(getPetRecordValue(pet, 'size'))),
                ].filter(Boolean),
            ),
        ],
        [monthlyPetSnapshots, pets],
    )

    const genderValues = useMemo(
        () => [
            ...new Set(
                [
                    ...monthlyPetSnapshots.map((pet) => normalizeValue(getPetRecordValue(pet, 'gender'))),
                    ...pets.map((pet) => normalizeValue(getPetRecordValue(pet, 'gender'))),
                    ...intakes.map((item) => normalizeValue(item.gender)),
                ].filter(Boolean),
            ),
        ],
        [intakes, monthlyPetSnapshots, pets],
    )

    return {
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
    }
}
