import { ClipboardList } from 'lucide-react'
import type { AdminCaseTimelineItem } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import { CaseDetailCardHeader } from '@/components/admin/cases/CaseDetailCards'
import { formatLabel } from '@/lib/pet-format'
import { formatDateTime } from '@/utils/admin/cases/case-detail-utils'

type CaseTimelineSectionProps = {
  timeline: AdminCaseTimelineItem[]
}

const CaseTimelineSection = ({ timeline }: CaseTimelineSectionProps) => (
  <SectionCard delay={0.12}>
    <CaseDetailCardHeader
      title="Timeline"
      description="Case events, internal notes, interaction logs, and related activity."
      badge={`${timeline.length} events`}
    />

    <div className="max-h-136 overflow-y-auto pr-2">
      <div className="relative space-y-4 before:absolute before:bottom-0 before:left-2.5 before:top-1 before:w-px before:bg-border">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-8">
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-primary ring-4 ring-white">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            </span>

            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-input px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {formatLabel(item.type)}
                </span>
              </div>

              <p className="mt-3 text-xs font-medium text-primary">
                {item.actorName ? `By ${item.actorName} · ` : ''}
                {formatDateTime(item.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {timeline.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
            No timeline events found for this case yet.
          </div>
        )}
      </div>
    </div>
  </SectionCard>
)

export default CaseTimelineSection
