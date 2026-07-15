import { ClipboardList } from 'lucide-react'
import type { CaseNote } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import { CaseDetailCardHeader } from '@/components/admin/cases/CaseDetailCards'
import { formatLabel } from '@/lib/pet-format'
import {
  formatDateTime,
  MAX_VISIBLE_NOTES,
} from '@/utils/admin/cases/case-detail-utils'

type CaseNotesSectionProps = {
  notes: CaseNote[]
}

const CaseNotesSection = ({ notes }: CaseNotesSectionProps) => {
  const visibleNotes = notes.slice(0, MAX_VISIBLE_NOTES)

  return (
    <SectionCard delay={0.08}>
      <CaseDetailCardHeader
        title="Internal notes"
        description="Staff-only observations, screening context, and follow-up notes."
        icon={ClipboardList}
      />

      <div className="space-y-3">
        {visibleNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-border bg-input p-4"
          >
            <p className="text-sm leading-6 text-foreground">{note.body}</p>

            {note.tags && note.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary"
                  >
                    {formatLabel(tag)}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs font-medium text-primary">
              {formatDateTime(note.createdAt)}
            </p>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
            No internal notes found for this case yet.
          </div>
        )}

        {notes.length > visibleNotes.length && (
          <div className="rounded-xl border border-dashed border-border bg-input p-3 text-center text-sm font-semibold text-muted-foreground">
            Showing latest {visibleNotes.length} of {notes.length} internal notes.
          </div>
        )}
      </div>
    </SectionCard>
  )
}

export default CaseNotesSection
