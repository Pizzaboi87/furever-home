import { Sparkles } from 'lucide-react'

import { FormField, adminInputClassName } from '@/components/admin/common/FormField'
import { SectionHeading } from '@/components/admin/common/SectionHeading'
import { CASE_PRIORITY_OPTIONS, type CasePriority } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

const staffOptions = ['Unassigned', 'Emma Wilson', 'Noah Carter', 'Sofia Brown']

type NewCaseAssignmentSectionProps = {
    assignedStaff: string
    priority: CasePriority
    onAssignedStaffChange: (value: string) => void
    onPriorityChange: (value: CasePriority) => void
}

export const NewCaseAssignmentSection = ({
    assignedStaff,
    priority,
    onAssignedStaffChange,
    onPriorityChange,
}: NewCaseAssignmentSectionProps) => (
    <section>
        <SectionHeading icon={<Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />}>
            Assignment
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Assigned staff">
                <select
                    value={assignedStaff}
                    onChange={(event) => onAssignedStaffChange(event.target.value)}
                    className={adminInputClassName}
                >
                    {staffOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Priority">
                <select
                    value={priority}
                    onChange={(event) => onPriorityChange(event.target.value as CasePriority)}
                    className={adminInputClassName}
                >
                    {CASE_PRIORITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {formatLabel(option)}
                        </option>
                    ))}
                </select>
            </FormField>
        </div>
    </section>
)
