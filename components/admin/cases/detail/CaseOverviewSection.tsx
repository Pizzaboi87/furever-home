import { ClipboardList } from 'lucide-react'
import type { AdminCaseDetail } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import {
  badgeBaseClassName,
  getCaseStatusBadgeClassName,
} from '@/utils/admin/badge-styles'
import { formatLabel } from '@/lib/pet-format'
import AdoptionWorkflowActions from '@/components/admin/cases/AdoptionWorkflowActions'
import CaseManagementModal from '@/components/admin/cases/CaseManagementModal'
import CaseStatusModal from '@/components/admin/cases/CaseStatusModal'
import {
  CaseDetailCardHeader,
  DetailCard,
} from '@/components/admin/cases/CaseDetailCards'
import { formatDateTime } from '@/utils/admin/cases/case-detail-utils'

type StaffOption = {
  id: string
  name: string
}

type CaseOverviewSectionProps = {
  detail: AdminCaseDetail
  staffOptions: StaffOption[]
}

const CaseOverviewSection = ({
  detail,
  staffOptions,
}: CaseOverviewSectionProps) => (
  <SectionCard>
    <CaseDetailCardHeader
      title="Case overview"
      description="Main case context and current handling state."
      icon={ClipboardList}
    />

    <p className="text-sm leading-6 text-muted-foreground">
      {detail.case.summary || 'No case summary captured yet.'}
    </p>

    <div className="mt-4 flex flex-wrap gap-2">
      <span
        className={`${badgeBaseClassName} ${getCaseStatusBadgeClassName(detail.case.status)}`}
      >
        {formatLabel(detail.case.status)}
      </span>

      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-primary">
        {formatLabel(detail.case.type)}
      </span>

      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
        {formatLabel(detail.case.source ?? detail.applicant.channel)}
      </span>

      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
        {formatLabel(detail.case.scope)}
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
      <p>
        <span className="font-bold uppercase tracking-wide">Created:</span>{' '}
        <span className="font-semibold text-foreground">
          {formatDateTime(detail.case.createdAt)}
        </span>
      </p>

      <p>
        <span className="font-bold uppercase tracking-wide">Last activity:</span>{' '}
        <span className="font-semibold text-foreground">
          {formatDateTime(detail.case.lastActivityAt)}
        </span>
      </p>

      <p>
        <span className="font-bold uppercase tracking-wide">Case ID:</span>{' '}
        <span className="font-semibold text-foreground">
          {detail.case.caseNumber ?? detail.case.id}
        </span>
      </p>
    </div>

    <div className="mt-4 border-t border-border pt-4">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailCard
          label="Assigned staff"
          value={detail.case.assignedStaff || 'Unassigned'}
        />
        <DetailCard
          label="Priority"
          value={formatLabel(detail.case.priority ?? 'medium')}
        />
        <DetailCard
          label="Outcome"
          value={detail.case.outcome || 'Not captured'}
        />
        <DetailCard
          label="Next follow-up"
          value={
            detail.case.nextFollowUpAt
              ? formatDateTime(detail.case.nextFollowUpAt)
              : 'Not scheduled'
          }
        />
      </div>

      {detail.adoptionApplication && (
        <div className="mt-4">
          <AdoptionWorkflowActions
            caseId={detail.case.id}
            currentStatus={detail.case.status}
            petId={detail.relatedPet?.id ?? detail.adoptionApplication.petId}
            petStatus={detail.relatedPet?.status}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <CaseManagementModal
          caseId={detail.case.id}
          assignedStaffId={detail.case.assignedStaffId}
          staffOptions={staffOptions}
          priority={detail.case.priority}
          status={detail.case.status}
          outcome={detail.case.outcome}
          nextFollowUpAt={detail.case.nextFollowUpAt}
          nextFollowUpNote={detail.case.nextFollowUpNote}
        />
        <CaseStatusModal
          caseId={detail.case.id}
          currentStatus={detail.case.status}
        />
      </div>
    </div>
  </SectionCard>
)

export default CaseOverviewSection
