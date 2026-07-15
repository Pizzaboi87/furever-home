import { ClipboardList, FileText, MessageSquare, UserRound } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import type { CreateIncomingCasePreview } from '@/lib/admin/case-create/case-preview-service'
import { formatLabel } from '@/lib/pet-format'
import { formatPreviewAddress } from '@/utils/admin/cases/new-case-utils'

type PreviewCardProps = {
    title: string
    icon: typeof UserRound
    rows: { label: string; value: string | null | undefined }[]
}

const PreviewCard = ({ title, icon: Icon, rows }: PreviewCardProps) => (
    <div className="rounded-xl border border-border bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="font-bold text-foreground">{title}</h3>
        </div>

        <div className="space-y-3">
            {rows.map((row) => (
                <div key={row.label}>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {row.label}
                    </p>
                    <p className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
                        {row.value || 'Not captured'}
                    </p>
                </div>
            ))}
        </div>
    </div>
)

type NewCasePreviewPanelProps = {
    preview: CreateIncomingCasePreview | null
}

export const NewCasePreviewPanel = ({ preview }: NewCasePreviewPanelProps) => (
    <aside className="space-y-6">
        <SectionCard padding="md" delay={0.12}>
            <h2 className="text-xl font-bold text-foreground">Generated records preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                This shows the person, case, interaction, and events that will be created.
            </p>

            {!preview ? (
                <div className="mt-5 rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
                    Fill the form and generate a preview to inspect the planned records before creating the case.
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    <PreviewCard
                        title="Person"
                        icon={UserRound}
                        rows={[
                            { label: 'ID', value: preview.person.id },
                            { label: 'Name', value: preview.person.name },
                            { label: 'Email', value: preview.person.email },
                            { label: 'Phone', value: preview.person.phone },
                            { label: 'Address', value: formatPreviewAddress(preview.person.address) },
                        ]}
                    />

                    <PreviewCard
                        title="Case"
                        icon={ClipboardList}
                        rows={[
                            { label: 'ID', value: preview.case.id },
                            { label: 'Type', value: formatLabel(preview.case.type) },
                            { label: 'Scope', value: formatLabel(preview.case.scope) },
                            { label: 'Status', value: formatLabel(preview.case.status) },
                            { label: 'Priority', value: formatLabel(preview.case.priority) },
                            { label: 'Assigned staff', value: preview.case.assignedStaff },
                            { label: 'Pet ID', value: preview.case.petId ? String(preview.case.petId) : null },
                        ]}
                    />

                    <PreviewCard
                        title="Interaction Log"
                        icon={MessageSquare}
                        rows={[
                            { label: 'ID', value: preview.interaction.id },
                            { label: 'Direction', value: formatLabel(preview.interaction.direction) },
                            { label: 'Channel', value: formatLabel(preview.interaction.channel) },
                            { label: 'Summary', value: preview.interaction.summary },
                            { label: 'Action taken', value: preview.interaction.actionTaken },
                            { label: 'Next step', value: preview.interaction.nextStep },
                            { label: 'Reference', value: preview.interaction.externalReference?.reference },
                        ]}
                    />

                    <PreviewCard
                        title="Events"
                        icon={FileText}
                        rows={[
                            { label: 'Case event', value: preview.caseEvent.title },
                            { label: 'Activity event', value: preview.activityEvent.title },
                            { label: 'Pet activity', value: preview.petActivityEvent?.title },
                            { label: 'Persisted', value: preview.wouldPersist ? 'Yes' : 'No, preview only' },
                        ]}
                    />
                </div>
            )}
        </SectionCard>
    </aside>
)
