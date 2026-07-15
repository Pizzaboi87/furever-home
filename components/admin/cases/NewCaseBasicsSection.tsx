import { ClipboardList } from 'lucide-react'

import { FormField, adminInputClassName, adminTextareaClassName } from '@/components/admin/common/FormField'
import { SectionHeading } from '@/components/admin/common/SectionHeading'
import {
    CANONICAL_CASE_TYPE_OPTIONS,
    CANONICAL_CONTACT_CHANNEL_OPTIONS,
    type CaseType,
    type ContactChannel,
} from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

type NewCaseBasicsSectionProps = {
    channel: ContactChannel
    type: CaseType
    subject: string
    message: string
    onChannelChange: (value: ContactChannel) => void
    onTypeChange: (value: CaseType) => void
    onSubjectChange: (value: string) => void
    onMessageChange: (value: string) => void
}

export const NewCaseBasicsSection = ({
    channel,
    type,
    subject,
    message,
    onChannelChange,
    onTypeChange,
    onSubjectChange,
    onMessageChange,
}: NewCaseBasicsSectionProps) => (
    <section>
        <SectionHeading icon={<ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />}>
            Case basics
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Channel">
                <select
                    value={channel}
                    onChange={(event) => onChannelChange(event.target.value as ContactChannel)}
                    className={adminInputClassName}
                >
                    {CANONICAL_CONTACT_CHANNEL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {formatLabel(option)}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Type / topic">
                <select
                    value={type}
                    onChange={(event) => onTypeChange(event.target.value as CaseType)}
                    className={adminInputClassName}
                >
                    {CANONICAL_CASE_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {formatLabel(option)}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Subject" className="md:col-span-2">
                <input
                    required
                    value={subject}
                    onChange={(event) => onSubjectChange(event.target.value)}
                    placeholder="e.g. Question about Luna's adoption process"
                    className={adminInputClassName}
                />
            </FormField>

            <FormField label="Interaction summary" className="md:col-span-2">
                <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(event) => onMessageChange(event.target.value)}
                    placeholder="Summarize what the contact asked, reported, or requested. Do not paste the full email or call transcript."
                    className={adminTextareaClassName}
                />
            </FormField>
        </div>
    </section>
)
