'use client'

import { useRef, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import ModalShell from '@/components/ui/ModalShell'

import { updateAdoptionApplicationAction } from '@/actions/admin/cases/case-actions'
import {
    FAILED_CASE_STATUSES,
    OPEN_CASE_STATUSES,
    SUCCESSFUL_CASE_STATUSES,
    type AdoptionApplication,
    type CaseStatus,
} from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'
import {
    FormField,
    adminInputClassName,
    adminTextareaClassName,
} from '../common/FormField'

type AdoptionApplicationModalProps = {
    caseId: string
    adoptionApplication: AdoptionApplication
}

const statusOptions: CaseStatus[] = Array.from(
    new Set([
        ...OPEN_CASE_STATUSES,
        ...SUCCESSFUL_CASE_STATUSES,
        ...FAILED_CASE_STATUSES,
    ]),
)

const householdTypeOptions = [
    'single_adult',
    'couple',
    'family_with_children',
    'shared_household',
    'senior_household',
] as const

const housingTypeOptions = [
    'apartment',
    'house',
    'house_with_yard',
    'farm_or_rural',
    'other',
] as const

const landlordApprovalOptions: NonNullable<AdoptionApplication['landlordApproval']>[] = [
    'not_needed',
    'pending',
    'confirmed',
    'rejected',
]

const experienceLevelOptions: NonNullable<AdoptionApplication['experienceLevel']>[] = [
    'first_time',
    'some_experience',
    'experienced',
]

const AdoptionApplicationModal = ({
    caseId,
    adoptionApplication,
}: AdoptionApplicationModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAction = async (formData: FormData) => {
        await updateAdoptionApplicationAction(caseId, formData)
        formRef.current?.reset()
        closeModal()
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="mt-4 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-input"
            >
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                Manage application
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Manage application"
                description="Update the staff screening score, household context, and review note for this adoption application."
                closeLabel="Close adoption application modal"
                size="sm"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <FormField label="Application status">
                        <select
                            name="status"
                            defaultValue={adoptionApplication.status}
                            className={adminInputClassName}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <FormField label="Screening score">
                            <input
                                type="number"
                                name="score"
                                min="0"
                                max="100"
                                step="1"
                                defaultValue={adoptionApplication.score ?? ''}
                                placeholder="0-100"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Household type">
                            <select
                                name="householdType"
                                defaultValue={adoptionApplication.householdType ?? ''}
                                className={adminInputClassName}
                            >
                                <option value="">Not captured</option>

                                {householdTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Housing type">
                            <select
                                name="housingType"
                                defaultValue={adoptionApplication.housingType ?? ''}
                                className={adminInputClassName}
                            >
                                <option value="">Not captured</option>

                                {housingTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Landlord approval">
                            <select
                                name="landlordApproval"
                                defaultValue={adoptionApplication.landlordApproval ?? 'not_needed'}
                                className={adminInputClassName}
                            >
                                {landlordApprovalOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Experience level">
                        <select
                            name="experienceLevel"
                            defaultValue={adoptionApplication.experienceLevel ?? ''}
                            className={adminInputClassName}
                        >
                            <option value="">Not captured</option>

                            {experienceLevelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2 mt-2">
                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="hasOtherPets"
                                defaultChecked={Boolean(adoptionApplication.hasOtherPets)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Has other pets
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="hasChildren"
                                defaultChecked={Boolean(adoptionApplication.hasChildren)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Has children
                        </label>
                    </div>

                    <FormField label="Screening / review note">
                        <textarea
                            name="screeningNote"
                            rows={4}
                            defaultValue={adoptionApplication.screeningNote ?? ''}
                            placeholder="Add staff screening context, risk factors, follow-up requirements, or approval rationale..."
                            className={adminTextareaClassName}
                        />
                    </FormField>

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-input"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Save application
                        </button>
                    </div>
                </form>
            </ModalShell>
        </>
    )
}

export default AdoptionApplicationModal
