import { MessageSquare } from 'lucide-react'
import type { CaseInteraction } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import InteractionLogModal from '@/components/admin/cases/InteractionLogModal'
import { CaseDetailCardHeader } from '@/components/admin/cases/CaseDetailCards'
import { formatLabel } from '@/lib/pet-format'
import {
  formatDateTime,
  MAX_VISIBLE_INTERACTIONS,
} from '@/utils/admin/cases/case-detail-utils'

type CaseInteractionsSectionProps = {
  caseId: string
  interactions: CaseInteraction[]
}

const CaseInteractionsSection = ({
  caseId,
  interactions,
}: CaseInteractionsSectionProps) => {
  const visibleInteractions = interactions.slice(0, MAX_VISIBLE_INTERACTIONS)

  return (
    <SectionCard delay={0.04}>
      <CaseDetailCardHeader
        title="Interaction Log"
        description="Staff summaries of emails, calls, forms, and in-person conversations."
        icon={MessageSquare}
      />

      <div className="space-y-4">
        {visibleInteractions.map((interaction) => (
          <div
            key={interaction.id}
            className="rounded-xl border border-border bg-input p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {formatLabel(interaction.direction)} ·{' '}
                  {formatLabel(interaction.channel)}
                </p>
                <p className="mt-1 text-xs font-semibold text-primary">
                  Logged {formatDateTime(interaction.loggedAt)}
                </p>
              </div>

              {interaction.externalReference?.reference && (
                <span className="break-all rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
                  {interaction.externalReference.system}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Summary
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {interaction.summary}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Action taken
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {interaction.actionTaken || 'Not captured'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Next step
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {interaction.nextStep || 'Not captured'}
                </p>
              </div>
            </div>

            {interaction.externalReference?.reference && (
              <div className="mt-4 rounded-lg border border-border bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  External reference
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-primary">
                  {interaction.externalReference.type} ·{' '}
                  {interaction.externalReference.reference}
                </p>
              </div>
            )}
          </div>
        ))}

        {interactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
            No interaction logs found for this case yet.
          </div>
        )}

        {interactions.length > visibleInteractions.length && (
          <p className="rounded-xl border border-dashed border-border bg-input p-3 text-center text-sm font-semibold text-muted-foreground">
            Showing latest {visibleInteractions.length} of {interactions.length}{' '}
            interaction logs.
          </p>
        )}
      </div>

      <InteractionLogModal caseId={caseId} />
    </SectionCard>
  )
}

export default CaseInteractionsSection
