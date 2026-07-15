import {
    CASE_PRIORITY_OPTIONS,
    type CasePriority,
} from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'
import { caseManagementStatusOptions } from '@/utils/admin/cases/case-management-utils'
import type { CaseManagementFieldsProps } from './case-management-types'

const CaseManagementFields = ({
    selectedStaffId,
    setSelectedStaffId,
    staffOptions,
    selectedPriority,
    setSelectedPriority,
    status,
    outcome,
}: CaseManagementFieldsProps) => {
    const shouldShowOwnershipWarning = selectedPriority === 'high' && !selectedStaffId

    return (
        <>
            <label className="block text-sm font-semibold text-foreground">
                Assigned staff
                <select
                    name="assignedStaffId"
                    value={selectedStaffId}
                    onChange={(event) => setSelectedStaffId(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">Unassigned</option>
                    {staffOptions.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block text-sm font-semibold text-foreground">
                Priority
                <select
                    name="priority"
                    value={selectedPriority}
                    onChange={(event) => setSelectedPriority(event.target.value as CasePriority)}
                    className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    {CASE_PRIORITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {formatLabel(option)}
                        </option>
                    ))}
                </select>
            </label>

            {shouldShowOwnershipWarning ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                    High priority cases should usually have an assigned owner before they enter the task queue.
                </div>
            ) : null}

            <label className="block text-sm font-semibold text-foreground">
                Status
                <select
                    name="status"
                    defaultValue={status}
                    className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    {caseManagementStatusOptions.map((option) => (
                        <option key={option} value={option}>
                            {formatLabel(option)}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block text-sm font-semibold text-foreground">
                Outcome / reason
                <textarea
                    name="outcome"
                    rows={4}
                    defaultValue={outcome ?? ''}
                    placeholder="Required when closing a case; optional for open statuses..."
                    className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal leading-6 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </label>
        </>
    )
}

export default CaseManagementFields
