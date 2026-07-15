import { FileText } from 'lucide-react'
import SectionCard from '@/components/admin/common/SectionCard'
import { addInternalNoteAction } from '@/actions/admin/cases/case-actions'
import { CaseDetailCardHeader } from '@/components/admin/cases/CaseDetailCards'

type CaseInternalNoteCardProps = {
  caseId: string
}

const CaseInternalNoteCard = ({ caseId }: CaseInternalNoteCardProps) => {
  return (
    <SectionCard delay={0.28}>
      <CaseDetailCardHeader
        title="Add internal note"
        description="Capture a staff-only note for this case."
        icon={FileText}
      />

      <form action={addInternalNoteAction.bind(null, caseId)} className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Note
          <textarea
            name="body"
            rows={5}
            placeholder="Write a staff-only note about follow-up, screening, adopter context, or next steps..."
            className="mt-2 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Add new note
        </button>
      </form>
    </SectionCard>
  )
}

export default CaseInternalNoteCard
