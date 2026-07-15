import type {
  AdminCaseDetail,
  AdminCaseTimelineItem,
  CaseInteraction,
  CaseNote,
} from '@/lib/admin/domain'
import CaseInteractionsSection from '@/components/admin/cases/detail/CaseInteractionsSection'
import CaseNotesSection from '@/components/admin/cases/detail/CaseNotesSection'
import CaseOverviewSection from '@/components/admin/cases/detail/CaseOverviewSection'
import CaseTimelineSection from '@/components/admin/cases/detail/CaseTimelineSection'

type StaffOption = {
  id: string
  name: string
}

type CaseDetailMainContentProps = {
  detail: AdminCaseDetail
  interactions: CaseInteraction[]
  notes: CaseNote[]
  timeline: AdminCaseTimelineItem[]
  staffOptions: StaffOption[]
}

const CaseDetailMainContent = ({
  detail,
  interactions,
  notes,
  timeline,
  staffOptions,
}: CaseDetailMainContentProps) => (
  <div className="space-y-5">
    <CaseOverviewSection detail={detail} staffOptions={staffOptions} />
    <CaseInteractionsSection
      caseId={detail.case.id}
      interactions={interactions}
    />
    <CaseNotesSection notes={notes} />
    <CaseTimelineSection timeline={timeline} />
  </div>
)

export default CaseDetailMainContent
