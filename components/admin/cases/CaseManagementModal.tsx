'use client'

import { useRef, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import ModalShell from '@/components/ui/ModalShell'
import { updateCaseManagementAction } from '@/actions/admin/cases/case-actions'
import type { CasePriority, CaseStatus } from '@/lib/admin/domain'
import CaseFollowUpPlanning from './management/CaseFollowUpPlanning'
import CaseManagementActions from './management/CaseManagementActions'
import CaseManagementFields from './management/CaseManagementFields'
import type {
    FollowUpPreset,
    StaffOption,
} from './management/case-management-types'
import { getDateTimeLocalValue } from '@/utils/admin/cases/case-management-utils'

type CaseManagementModalProps = {
    caseId: string
    assignedStaffId?: string | null
    staffOptions: StaffOption[]
    priority?: CasePriority | null
    status: CaseStatus
    outcome?: string | null
    nextFollowUpAt?: string | null
    nextFollowUpNote?: string | null
}

const CaseManagementModal = ({
    caseId,
    assignedStaffId,
    staffOptions,
    priority,
    status,
    outcome,
    nextFollowUpAt,
    nextFollowUpNote,
}: CaseManagementModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedStaffId, setSelectedStaffId] = useState(assignedStaffId ?? '')
    const [selectedPriority, setSelectedPriority] = useState<CasePriority>(priority ?? 'medium')
    const [followUpAtValue, setFollowUpAtValue] = useState(getDateTimeLocalValue(nextFollowUpAt))
    const [followUpNoteValue, setFollowUpNoteValue] = useState(nextFollowUpNote ?? '')
    const formRef = useRef<HTMLFormElement>(null)

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setSelectedStaffId(assignedStaffId ?? '')
        setSelectedPriority(priority ?? 'medium')
        setFollowUpAtValue(getDateTimeLocalValue(nextFollowUpAt))
        setFollowUpNoteValue(nextFollowUpNote ?? '')
        setIsOpen(true)
    }

    const applyFollowUpPreset = (preset: FollowUpPreset) => {
        setFollowUpAtValue(getDateTimeLocalValue(preset.getDate().toISOString()))
    }

    const clearFollowUp = () => {
        setFollowUpAtValue('')
        setFollowUpNoteValue('')
    }

    const handleAction = async (formData: FormData) => {
        await updateCaseManagementAction(caseId, formData)
        formRef.current?.reset()
        closeModal()
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
            >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Manage case
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Manage case"
                description="Update assignment, priority, status, outcome, and follow-up planning for this case."
                closeLabel="Close case management modal"
                size="sm"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <CaseManagementFields
                        selectedStaffId={selectedStaffId}
                        setSelectedStaffId={setSelectedStaffId}
                        staffOptions={staffOptions}
                        selectedPriority={selectedPriority}
                        setSelectedPriority={setSelectedPriority}
                        status={status}
                        outcome={outcome}
                    />

                    <CaseFollowUpPlanning
                        followUpAtValue={followUpAtValue}
                        setFollowUpAtValue={setFollowUpAtValue}
                        followUpNoteValue={followUpNoteValue}
                        setFollowUpNoteValue={setFollowUpNoteValue}
                        onClear={clearFollowUp}
                        onApplyPreset={applyFollowUpPreset}
                    />

                    <CaseManagementActions onCancel={closeModal} />
                </form>
            </ModalShell>
        </>
    )
}

export default CaseManagementModal
