import type { Dispatch, SetStateAction } from 'react'
import type { CasePriority, CaseStatus } from '@/lib/admin/domain'

export type StaffOption = {
    id: string
    name: string
}

export type FollowUpPreset = {
    label: string
    getDate: () => Date
}

export type CaseManagementFieldsProps = {
    selectedStaffId: string
    setSelectedStaffId: Dispatch<SetStateAction<string>>
    staffOptions: StaffOption[]
    selectedPriority: CasePriority
    setSelectedPriority: Dispatch<SetStateAction<CasePriority>>
    status: CaseStatus
    outcome?: string | null
}

export type FollowUpPlanningProps = {
    followUpAtValue: string
    setFollowUpAtValue: Dispatch<SetStateAction<string>>
    followUpNoteValue: string
    setFollowUpNoteValue: Dispatch<SetStateAction<string>>
    onClear: () => void
    onApplyPreset: (preset: FollowUpPreset) => void
}
