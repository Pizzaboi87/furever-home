'use client'

import { useRef, useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import { FormField, adminInputClassName } from '@/components/admin/common/FormField'
import ModalShell from '@/components/ui/ModalShell'

import { updateDonationInquiryAction } from '@/actions/admin/cases/case-actions'
import {
    FAILED_CASE_STATUSES,
    OPEN_CASE_STATUSES,
    SUCCESSFUL_CASE_STATUSES,
    type CaseStatus,
    type DonationInquiry,
} from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

type DonationInquiryModalProps = {
    caseId: string
    donationInquiry: DonationInquiry
}

const inquiryTypeOptions: DonationInquiry['inquiryType'][] = [
    'receipt_request',
    'monthly_donation_change',
    'corporate_donation',
    'refund_or_correction',
    'allocation_question',
    'event_sponsorship',
    'other',
]

const frequencyOptions: NonNullable<DonationInquiry['frequency']>[] = [
    'one_time',
    'monthly',
    'quarterly',
    'annual',
]

const statusOptions: CaseStatus[] = Array.from(
    new Set([
        ...OPEN_CASE_STATUSES,
        ...SUCCESSFUL_CASE_STATUSES,
        ...FAILED_CASE_STATUSES,
    ]),
)

const currencyInputClassName = `${adminInputClassName} uppercase`

const DonationInquiryModal = ({
    caseId,
    donationInquiry,
}: DonationInquiryModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAction = async (formData: FormData) => {
        await updateDonationInquiryAction(caseId, formData)
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
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                Manage donation
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Manage donation"
                description="Update donation amount, frequency, receipt handling, and follow-up state."
                closeLabel="Close donation management modal"
                size="sm"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <FormField label="Inquiry type">
                        <select
                            name="inquiryType"
                            defaultValue={donationInquiry.inquiryType}
                            className={adminInputClassName}
                        >
                            {inquiryTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Status">
                        <select
                            name="status"
                            defaultValue={donationInquiry.status}
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
                                defaultValue={donationInquiry.amount ?? ''}
                                placeholder="50"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Currency">
                            <input
                                type="text"
                                name="currency"
                                defaultValue={donationInquiry.currency ?? 'USD'}
                                placeholder="USD"
                                className={currencyInputClassName}
                            />
                        </FormField>
                    </div>

                    <FormField label="Frequency">
                        <select
                            name="frequency"
                            defaultValue={donationInquiry.frequency ?? 'one_time'}
                            className={adminInputClassName}
                        >
                            {frequencyOptions.map((option) => (
                                <option key={option} value={option}>
                                    {formatLabel(option)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Donation ID">
                        <input
                            type="text"
                            name="donationId"
                            defaultValue={donationInquiry.donationId ?? ''}
                            placeholder="Optional external payment or donor record ID"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="receiptRequested"
                                defaultChecked={Boolean(donationInquiry.receiptRequested)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Receipt requested
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
                            <input
                                type="checkbox"
                                name="thankYouSent"
                                defaultChecked={Boolean(donationInquiry.thankYouSent)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Thank-you sent
                        </label>
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
                            Save donation
                        </button>
                    </div>
                </form>
            </ModalShell>
        </>
    )
}

export default DonationInquiryModal
