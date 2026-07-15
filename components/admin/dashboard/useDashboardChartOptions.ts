import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'

import { formatLabel, normalizeValue } from '@/lib/pet-format'
import {
    chartColors,
    formatCurrency,
    getPetRecordValue,
    getPetType,
    type DashboardPetRecord,
} from '@/utils/admin/dashboard/dashboard-utils'
import type { DashboardRecord } from '@/lib/admin/domain'

type DailyDonationSeriesItem = {
    date: string
    label: string
    value: number
}

type HistoricalDonationSummaryItem = {
    month: string
    label: string
    volunteerHours: number
    total: number
}

type ActivityTrendSummaryItem = {
    date: string
    applications: number
    intakes: number
}

type UseDashboardChartOptionsInput = {
    speciesValues: string[]
    ageGroups: string[]
    pipelineStatusValues: string[]
    petPopulationForCharts: DashboardPetRecord[]
    filteredApplications: DashboardRecord[]
    visibleDailyDonationSeries: DailyDonationSeriesItem[]
    visibleHistoricalDonationSummaries: HistoricalDonationSummaryItem[]
    activityTrendSummaries: ActivityTrendSummaryItem[]
    shouldUseCompactCharts: boolean
    todayDateKey: string
    selectedMonthKey: string
}

export const useDashboardChartOptions = ({
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
}: UseDashboardChartOptionsInput) => {
    const speciesOption = useMemo<EChartsOption>(() => ({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, left: 'center', textStyle: { color: '#6B7280' } },
        series: [
            {
                name: 'Species',
                type: 'pie',
                radius: ['48%', '72%'],
                center: ['50%', '42%'],
                label: { formatter: '{b}\n{c}', color: '#1F2937', fontWeight: 600 },
                data: speciesValues
                    .map((species, index) => ({
                        name: formatLabel(species),
                        value: petPopulationForCharts.filter((pet) => getPetType(pet) === species).length,
                        itemStyle: { color: chartColors[index % chartColors.length] },
                    }))
                    .filter((item) => item.value > 0),
            },
        ],
    }), [petPopulationForCharts, speciesValues])

    const ageOption = useMemo<EChartsOption>(() => ({
        grid: { left: 8, right: 12, top: 12, bottom: 20, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: ageGroups.map(formatLabel),
            axisLabel: { color: '#6B7280' },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Pets',
                type: 'bar',
                barWidth: 34,
                itemStyle: { color: '#4F46E5', borderRadius: [8, 8, 0, 0] },
                data: ageGroups.map((group) => petPopulationForCharts.filter((pet) => normalizeValue(getPetRecordValue(pet, 'ageGroup')) === group).length),
            },
        ],
    }), [ageGroups, petPopulationForCharts])

    const pipelineOption = useMemo<EChartsOption>(() => ({
        grid: { left: 12, right: 18, top: 20, bottom: 46, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: pipelineStatusValues.map(formatLabel),
            axisLabel: { color: '#6B7280', interval: 0, rotate: 18 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Applications',
                type: 'bar',
                barWidth: 34,
                itemStyle: { color: '#818CF8', borderRadius: [8, 8, 0, 0] },
                data: pipelineStatusValues.map((status) =>
                    filteredApplications.filter((item) => normalizeValue(item.status) === status).length,
                ),
            },
        ],
    }), [filteredApplications, pipelineStatusValues])

    const dailyDonationLabels = visibleDailyDonationSeries.map((item) => item.label)
    const dailyDonationValues = visibleDailyDonationSeries.map((item) => item.value)
    const dailyDonationDatesForChart = visibleDailyDonationSeries.map((item) => item.date)
    const historicalMonthlyLabels = visibleHistoricalDonationSummaries.map((item) => item.label)
    const historicalVolunteerValues = visibleHistoricalDonationSummaries.map((item) => item.volunteerHours)

    const activityAxisInterval =
        activityTrendSummaries.length > 24
            ? 4
            : activityTrendSummaries.length > 14
                ? 2
                : 0

    const dailyDonationsOption = useMemo<EChartsOption>(() => ({
        grid: { left: 12, right: 16, top: 20, bottom: 30, containLabel: true },
        tooltip: { trigger: 'axis', valueFormatter: (value) => formatCurrency(Number(value)) },
        xAxis: {
            type: 'category',
            data: dailyDonationLabels,
            axisLabel: { color: '#6B7280', hideOverlap: true, rotate: dailyDonationLabels.length > 12 ? 30 : 0 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280', formatter: '${value}' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Daily donations',
                type: 'bar',
                barWidth: shouldUseCompactCharts ? 8 : dailyDonationLabels.length > 20 ? 12 : 18,
                data: dailyDonationValues.map((value, index) => ({
                    value,
                    itemStyle: {
                        color: dailyDonationDatesForChart[index] === todayDateKey ? '#F59E0B' : '#4F46E5',
                        borderRadius: [8, 8, 0, 0],
                    },
                })),
            },
        ],
    }), [dailyDonationDatesForChart, dailyDonationLabels, dailyDonationValues, shouldUseCompactCharts, todayDateKey])

    const historicalDonationsOption = useMemo<EChartsOption>(() => ({
        grid: { left: 12, right: 16, top: 20, bottom: 40, containLabel: true },
        tooltip: { trigger: 'axis', valueFormatter: (value) => formatCurrency(Number(value)) },
        xAxis: {
            type: 'category',
            data: historicalMonthlyLabels,
            axisLabel: { color: '#6B7280', hideOverlap: true, rotate: 30 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280', formatter: '${value}' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Monthly donations',
                type: 'bar',
                barWidth: 24,
                data: visibleHistoricalDonationSummaries.map((item) => ({
                    value: item.total,
                    itemStyle: {
                        color: item.month === selectedMonthKey ? '#F59E0B' : '#4F46E5',
                        borderRadius: [8, 8, 0, 0],
                    },
                })),
            },
        ],
    }), [historicalMonthlyLabels, selectedMonthKey, visibleHistoricalDonationSummaries])

    const activityOption = useMemo<EChartsOption>(() => ({
        grid: {
            left: 12,
            right: 16,
            top: 18,
            bottom: 34,
            containLabel: true,
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: activityTrendSummaries.map((item) => String(item.date).slice(5)),
            axisLabel: {
                color: '#6B7280',
                hideOverlap: true,
                interval: activityAxisInterval,
            },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Applications',
                type: 'line',
                smooth: true,
                symbolSize: 7,
                lineStyle: { color: '#4F46E5', width: 3 },
                itemStyle: { color: '#4F46E5' },
                areaStyle: { color: 'rgba(79, 70, 229, 0.15)' },
                data: activityTrendSummaries.map((item) => item.applications),
            },
            {
                name: 'Intakes',
                type: 'line',
                smooth: true,
                symbolSize: 7,
                lineStyle: { color: '#F59E0B', width: 3 },
                itemStyle: { color: '#F59E0B' },
                areaStyle: { color: 'rgba(245, 158, 11, 0.12)' },
                data: activityTrendSummaries.map((item) => item.intakes),
            },
        ],
    }), [activityTrendSummaries, activityAxisInterval])

    const supportOption = useMemo<EChartsOption>(() => ({
        grid: { left: 12, right: 16, top: 18, bottom: 28, containLabel: true },
        tooltip: { trigger: 'axis', valueFormatter: (value) => `${Number(value).toLocaleString()} hrs` },
        xAxis: {
            type: 'category',
            data: historicalMonthlyLabels,
            axisLabel: { color: '#6B7280', hideOverlap: true, rotate: historicalMonthlyLabels.length > 8 ? 30 : 0 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#6B7280' },
            splitLine: { lineStyle: { color: '#E5E7EB' } },
        },
        series: [
            {
                name: 'Volunteer hours',
                type: 'line',
                smooth: true,
                symbolSize: 7,
                lineStyle: { color: '#818CF8', width: 4 },
                itemStyle: { color: '#4F46E5' },
                areaStyle: { color: 'rgba(129, 140, 248, 0.24)' },
                data: historicalVolunteerValues,
            },
        ],
    }), [historicalMonthlyLabels, historicalVolunteerValues])

    return {
        speciesOption,
        ageOption,
        pipelineOption,
        dailyDonationsOption,
        historicalDonationsOption,
        activityOption,
        supportOption,
    }
}
