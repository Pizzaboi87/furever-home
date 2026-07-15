'use client'

import { useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import {
    FormField,
    adminInputClassName,
    adminTextareaClassName,
} from '@/components/admin/common/FormField'
import ModalShell from '@/components/ui/ModalShell'

import { addInteractionLogAction } from '@/actions/admin/cases/case-actions'

type InteractionLogModalProps = {
    caseId: string
}

export default function InteractionLogModal({ caseId }: InteractionLogModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAction = async (formData: FormData) => {
        await addInteractionLogAction(caseId, formData)
        formRef.current?.reset()
        closeModal()
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="mt-4 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
            >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Add new interaction log
            </button>

            <ModalShell
                isOpen={isOpen}
                onClose={closeModal}
                title="Log interaction"
                description="Add a staff summary of an email, call, form submission, walk-in conversation, or follow-up."
                closeLabel="Close interaction modal"
                size="md"
            >
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField label="Channel">
                            <select
                                name="channel"
                                defaultValue="internal"
                                className={adminInputClassName}
                            >
                                <option value="internal">Internal</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="website_form">Website Form</option>
                                <option value="walk_in">Walk In</option>
                                <option value="shelter_event">Shelter Event</option>
                                <option value="admin_created">Admin Created</option>
                            </select>
                        </FormField>

                        <FormField label="Direction">
                            <select
                                name="direction"
                                defaultValue="internal"
                                className={adminInputClassName}
                            >
                                <option value="internal">Internal</option>
                                <option value="inbound">Inbound</option>
                                <option value="outbound">Outbound</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Summary">
                        <textarea
                            name="summary"
                            rows={5}
                            required
                            placeholder="Summarize what happened in this email, call, form submission, or staff follow-up..."
                            className={adminTextareaClassName}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField label="Action taken">
                            <input
                                name="actionTaken"
                                type="text"
                                placeholder="e.g. Sent adopter screening questions"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Next step">
                            <input
                                name="nextStep"
                                type="text"
                                placeholder="e.g. Call back tomorrow afternoon"
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
                            Save interaction
                        </button>
                    </div>
                </form>
            </ModalShell>
        </>
    )
}
