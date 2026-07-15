'use client'

import { useRef, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import ModalShell from '@/components/ui/ModalShell'

import { updateVolunteerApplicationAction } from '@/actions/admin/cases/case-actions'
import type { VolunteerApplication } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'
import {
    FormField,
    adminInputClassName,
    adminTextareaClassName,
} from '../common/FormField'

type VolunteerApplicationModalProps = {
    caseId: string
    volunteerApplication: VolunteerApplication
}

const statusOptions: VolunteerApplication['status'][] = [
    'new',
    'screening',
    'orientation_scheduled',
    'approved',
    'declined',
    'active',
    'inactive',
]

const backgroundCheckOptions: NonNullable<VolunteerApplication['backgroundCheckStatus']>[] = [
    'not_required',
    'pending',
    'cleared',
    'failed',
]

const getDateTimeLocalValue = (value: string | null | undefined) => {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return date.toISOString().slice(0, 16)
}

const VolunteerApplicationModal = ({
    caseId,
    volunteerApplication,
}: VolunteerApplicationModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAction = async (formData: FormData) => {
        await updateVolunteerApplicationAction(caseId, formData)
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
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Manage volunteer
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Manage volunteer"
                description="Update screening, orientation, availability, and role details for this volunteer application."
                closeLabel="Close volunteer management modal"
                size="sm"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <FormField label="Volunteer status">
                        <select
                            name="status"
                            defaultValue={volunteerApplication.status}
                            className={adminInputClassName}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Interest areas">
                        <input
                            type="text"
                            name="interestAreas"
                            defaultValue={volunteerApplication.interestAreas.join(', ')}
                            placeholder="Dog walking, cat socialization, transport, events"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <FormField label="Availability">
                        <input
                            type="text"
                            name="availability"
                            defaultValue={volunteerApplication.availability ?? ''}
                            placeholder="Weekends, weekday evenings, flexible"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <FormField label="Experience">
                        <textarea
                            name="experience"
                            rows={3}
                            defaultValue={volunteerApplication.experience ?? ''}
                            placeholder="Previous shelter work, foster experience, animal handling, event support..."
                            className={adminTextareaClassName}
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Background check">
                            <select
                                name="backgroundCheckStatus"
                                defaultValue={volunteerApplication.backgroundCheckStatus ?? 'pending'}
                                className={adminInputClassName}
                            >
                                {backgroundCheckOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Assigned role">
                            <input
                                type="text"
                                name="assignedRole"
                                defaultValue={volunteerApplication.assignedRole ?? ''}
                                placeholder="Dog walker, cat room assistant"
                                className={adminInputClassName}
                            />
                        </FormField>
                    </div>

                    <FormField label="Orientation scheduled">
                        <input
                            type="datetime-local"
                            name="orientationScheduledAt"
                            defaultValue={getDateTimeLocalValue(volunteerApplication.orientationScheduledAt)}
                            className={adminInputClassName}
                        />
                    </FormField>

                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="orientationCompleted"
                                defaultChecked={Boolean(volunteerApplication.orientationCompleted)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Orientation completed
                        </label>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <h3 className="text-sm font-bold text-foreground">
                            Log volunteer hours
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Optional. Use this only when actual volunteer work has been completed.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <FormField label="Date">
                                <input
                                    type="date"
                                    name="volunteerHoursDate"
                                    className={adminInputClassName}
                                />
                            </FormField>

                            <FormField label="Hours">
                                <input
                                    type="number"
                                    name="volunteerHours"
                                    min="0"
                                    step="0.25"
                                    placeholder="2.5"
                                    className={adminInputClassName}
                                />
                            </FormField>
                        </div>

                        <FormField label="Activity" className="mt-4 block">
                            <input
                                type="text"
                                name="volunteerHoursActivity"
                                placeholder="Dog walking, cat socialization, transport, events"
                                className={adminInputClassName}
                            />
                        </FormField>
                    </div>

                    <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-input"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 cursor-pointer rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
                        >
                            Save volunteer
                        </button>
                    </div>
                </form>
            </ModalShell>
        </>
    )
}

export default VolunteerApplicationModal
