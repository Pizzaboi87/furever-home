import { CalendarClock } from 'lucide-react'
import { caseManagementFollowUpPresets } from '@/utils/admin/cases/case-management-utils'
import type { FollowUpPlanningProps } from './case-management-types'

const CaseFollowUpPlanning = ({
    followUpAtValue,
    setFollowUpAtValue,
    followUpNoteValue,
    setFollowUpNoteValue,
    onClear,
    onApplyPreset,
}: FollowUpPlanningProps) => (
    <div className="rounded-xl border border-border bg-input p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
            <div>
                <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                    Follow-up planning
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Set the next staff action so this case appears in Tasks and case follow-up filters. Clear removes both the follow-up date and note.
                </p>
            </div>

            <button
                type="button"
                onClick={onClear}
                className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-indigo-50 hover:text-primary"
            >
                Clear
            </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {caseManagementFollowUpPresets.map((preset) => (
                <button
                    key={preset.label}
                    type="button"
                    onClick={() => onApplyPreset(preset)}
                    className="cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50 hover:text-primary"
                >
                    {preset.label}
                </button>
            ))}
        </div>

        <label className="block text-sm font-semibold text-foreground">
            Next follow-up
            <input
                type="datetime-local"
                name="nextFollowUpAt"
                value={followUpAtValue}
                onChange={(event) => setFollowUpAtValue(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </label>

        <label className="mt-3 block text-sm font-semibold text-foreground">
            Follow-up note
            <textarea
                name="nextFollowUpNote"
                rows={3}
                value={followUpNoteValue}
                onChange={(event) => setFollowUpNoteValue(event.target.value)}
                placeholder="What should staff check or do next?"
                className="mt-2 w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm font-normal leading-6 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </label>
    </div>
)

export default CaseFollowUpPlanning
