'use client'

import { useRef, useState } from 'react'
import { BadgeDollarSign } from 'lucide-react'
import { FormField, adminInputClassName } from '@/components/admin/common/FormField'
import ModalShell from '@/components/ui/ModalShell'

import { updateVirtualAdoptionAction } from '@/actions/admin/cases/case-actions'
import type { VirtualAdoption } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

type VirtualAdoptionModalProps = {
    caseId: string
    virtualAdoption: VirtualAdoption
}

const statusOptions: VirtualAdoption['status'][] = [
    'active',
    'paused',
    'cancelled',
    'completed',
]

const frequencyOptions: VirtualAdoption['frequency'][] = [
    'one_time',
    'monthly',
    'quarterly',
    'annual',
]

const currencyInputClassName = `${adminInputClassName} uppercase`

const VirtualAdoptionModal = ({
    caseId,
    virtualAdoption,
}: VirtualAdoptionModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAction = async (formData: FormData) => {
        await updateVirtualAdoptionAction(caseId, formData)
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
                <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
                Manage virtual adoption
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Manage virtual adoption"
                description="Update sponsorship status, amount, frequency, and sponsor communication."
                closeLabel="Close virtual adoption management modal"
                size="sm"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <FormField label="Sponsorship status">
                        <select
                            name="status"
                            defaultValue={virtualAdoption.status}
                            className={adminInputClassName}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Amount">
                            <input
                                type="number"
                                name="amount"
                                min="0"
                                step="0.01"
                                defaultValue={virtualAdoption.amount ?? ''}
                                placeholder="25"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Currency">
                            <input
                                type="text"
                                name="currency"
                                defaultValue={virtualAdoption.currency ?? 'USD'}
                                placeholder="USD"
                                className={currencyInputClassName}
                            />
                        </FormField>
                    </div>

                    <FormField label="Frequency">
                        <select
                            name="frequency"
                            defaultValue={virtualAdoption.frequency}
                            className={adminInputClassName}
                        >
                            {frequencyOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="sponsorUpdateRequested"
                                defaultChecked={Boolean(virtualAdoption.sponsorUpdateRequested)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Sponsor updates requested
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="certificateSent"
                                defaultChecked={Boolean(virtualAdoption.certificateSent)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Certificate sent
                        </label>
                    </div>

                    <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-900">
                        Virtual adoption does not mark the pet as adopted. It only updates the sponsorship context for this case.
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
                            Save sponsorship
                        </button>
                    </div>
                </form>
            </ModalShell>
        </>
    )
}

export default VirtualAdoptionModal
