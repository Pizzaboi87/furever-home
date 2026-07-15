import type { AdminCaseDetail } from '@/lib/admin/domain'
import CaseContactCard from '@/components/admin/cases/detail/CaseContactCard'
import CaseInternalNoteCard from '@/components/admin/cases/detail/CaseInternalNoteCard'
import CaseRelatedPetCard from '@/components/admin/cases/detail/CaseRelatedPetCard'
import CaseStructuredDetailsCard from '@/components/admin/cases/detail/CaseStructuredDetailsCard'

type CaseDetailSidebarProps = {
  detail: AdminCaseDetail
}

const CaseDetailSidebar = ({ detail }: CaseDetailSidebarProps) => {
  return (
    <aside className="space-y-5">
      <CaseContactCard applicant={detail.applicant} />
      <CaseRelatedPetCard relatedPet={detail.relatedPet} />
      <CaseStructuredDetailsCard detail={detail} />
      <CaseInternalNoteCard caseId={detail.case.id} />
    </aside>
  )
}

export default CaseDetailSidebar
