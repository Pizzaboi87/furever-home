import {
    FAILED_CASE_STATUSES,
    OPEN_CASE_STATUSES,
    SUCCESSFUL_CASE_STATUSES,
    type CaseStatus,
} from '@/lib/admin/domain'
import type { FollowUpPreset } from '@/components/admin/cases/management/case-management-types'

export const caseManagementStatusOptions: CaseStatus[] = Array.from(
    new Set([
        ...OPEN_CASE_STATUSES,
        ...SUCCESSFUL_CASE_STATUSES,
        ...FAILED_CASE_STATUSES,
    ]),
)

export const getDateTimeLocalValue = (value: string | null | undefined) => {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return date.toISOString().slice(0, 16)
}

const setLocalTime = (date: Date, hours: number, minutes = 0) => {
    const nextDate = new Date(date)
    nextDate.setHours(hours, minutes, 0, 0)

    return nextDate
}

const getLaterTodayDate = () => {
    const now = new Date()
    const laterToday = new Date(now)
    laterToday.setHours(now.getHours() + 3, 0, 0, 0)

    return laterToday
}

const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return setLocalTime(tomorrow, 10)
}

const getInThreeDaysDate = () => {
    const inThreeDays = new Date()
    inThreeDays.setDate(inThreeDays.getDate() + 3)

    return setLocalTime(inThreeDays, 10)
}

const getNextWeekDate = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    return setLocalTime(nextWeek, 10)
}

export const caseManagementFollowUpPresets: FollowUpPreset[] = [
    { label: 'Later today', getDate: getLaterTodayDate },
    { label: 'Tomorrow', getDate: getTomorrowDate },
    { label: 'In 3 days', getDate: getInThreeDaysDate },
    { label: 'Next week', getDate: getNextWeekDate },
]
