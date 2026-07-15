import { ClipboardList } from 'lucide-react'
import type { AdminCaseDetail } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/lib/pet-format'
import AdoptionApplicationModal from '@/components/admin/cases/AdoptionApplicationModal'
import DonationInquiryModal from '@/components/admin/cases/DonationInquiryModal'
import VirtualAdoptionModal from '@/components/admin/cases/VirtualAdoptionModal'
import VolunteerApplicationModal from '@/components/admin/cases/VolunteerApplicationModal'
import {
  DetailList,
  CaseDetailCardHeader,
} from '@/components/admin/cases/CaseDetailCards'
import {
  formatDateTime,
  formatMoney,
} from '@/utils/admin/cases/case-detail-utils'

type CaseStructuredDetailsCardProps = {
  detail: AdminCaseDetail
}

const CaseStructuredDetailsCard = ({ detail }: CaseStructuredDetailsCardProps) => {
  const hasStructuredDetails = Boolean(
    detail.adoptionApplication ||
      detail.virtualAdoption ||
      detail.donationInquiry ||
      detail.volunteerApplication,
  )

  return (
    <SectionCard delay={0.24}>
      <CaseDetailCardHeader
        title="Case details"
        description="Structured fields for this case type."
        icon={ClipboardList}
      />

      <div className="rounded-xl border border-border bg-input p-4">
        {detail.adoptionApplication && (
          <>
            <DetailList
              rows={[
                {
                  label: 'Application status',
                  value: formatLabel(detail.adoptionApplication.status),
                },
                {
                  label: 'Household type',
                  value: formatLabel(detail.adoptionApplication.householdType),
                },
                {
                  label: 'Other pets',
                  value: detail.adoptionApplication.hasOtherPets,
                },
                {
                  label: 'Children',
                  value: detail.adoptionApplication.hasChildren,
                },
                {
                  label: 'Housing type',
                  value: formatLabel(detail.adoptionApplication.housingType),
                },
                {
                  label: 'Landlord approval',
                  value: formatLabel(detail.adoptionApplication.landlordApproval),
                },
                {
                  label: 'Experience',
                  value: formatLabel(detail.adoptionApplication.experienceLevel),
                },
                {
                  label: 'Review score',
                  value: detail.adoptionApplication.score,
                },
                {
                  label: 'Screening note',
                  value: detail.adoptionApplication.screeningNote,
                },
              ]}
            />

            <AdoptionApplicationModal
              caseId={detail.case.id}
              adoptionApplication={detail.adoptionApplication}
            />
          </>
        )}

        {detail.virtualAdoption && (
          <>
            <DetailList
              rows={[
                {
                  label: 'Status',
                  value: formatLabel(detail.virtualAdoption.status),
                },
                {
                  label: 'Frequency',
                  value: formatLabel(detail.virtualAdoption.frequency),
                },
                {
                  label: 'Amount',
                  value: formatMoney(
                    detail.virtualAdoption.amount,
                    detail.virtualAdoption.currency,
                  ),
                },
                {
                  label: 'Sponsor updates requested',
                  value: detail.virtualAdoption.sponsorUpdateRequested,
                },
                {
                  label: 'Certificate sent',
                  value: detail.virtualAdoption.certificateSent,
                },
              ]}
            />

            <VirtualAdoptionModal
              caseId={detail.case.id}
              virtualAdoption={detail.virtualAdoption}
            />
          </>
        )}

        {detail.donationInquiry && (
          <>
            <DetailList
              rows={[
                {
                  label: 'Inquiry type',
                  value: formatLabel(detail.donationInquiry.inquiryType),
                },
                {
                  label: 'Status',
                  value: formatLabel(detail.donationInquiry.status),
                },
                {
                  label: 'Amount',
                  value: formatMoney(
                    detail.donationInquiry.amount,
                    detail.donationInquiry.currency,
                  ),
                },
                {
                  label: 'Frequency',
                  value: formatLabel(detail.donationInquiry.frequency),
                },
                {
                  label: 'Receipt requested',
                  value: detail.donationInquiry.receiptRequested,
                },
                {
                  label: 'Thank-you sent',
                  value: detail.donationInquiry.thankYouSent,
                },
                {
                  label: 'Donation ID',
                  value: detail.donationInquiry.donationId,
                },
              ]}
            />

            <DonationInquiryModal
              caseId={detail.case.id}
              donationInquiry={detail.donationInquiry}
            />
          </>
        )}

        {detail.volunteerApplication && (
          <>
            <DetailList
              rows={[
                {
                  label: 'Status',
                  value: formatLabel(detail.volunteerApplication.status),
                },
                {
                  label: 'Interest areas',
                  value: detail.volunteerApplication.interestAreas
                    ?.map(formatLabel)
                    .join(', '),
                },
                {
                  label: 'Availability',
                  value: detail.volunteerApplication.availability,
                },
                {
                  label: 'Experience',
                  value: detail.volunteerApplication.experience,
                },
                {
                  label: 'Background check',
                  value: formatLabel(
                    detail.volunteerApplication.backgroundCheckStatus,
                  ),
                },
                {
                  label: 'Orientation scheduled',
                  value: detail.volunteerApplication.orientationScheduledAt
                    ? formatDateTime(
                        detail.volunteerApplication.orientationScheduledAt,
                      )
                    : undefined,
                },
                {
                  label: 'Orientation completed',
                  value: detail.volunteerApplication.orientationCompleted,
                },
                {
                  label: 'Assigned role',
                  value: detail.volunteerApplication.assignedRole,
                },
              ]}
            />

            <VolunteerApplicationModal
              caseId={detail.case.id}
              volunteerApplication={detail.volunteerApplication}
            />
          </>
        )}

        {!hasStructuredDetails && (
          <p className="text-sm text-muted-foreground">
            No structured case-specific details are attached to this case.
          </p>
        )}
      </div>
    </SectionCard>
  )
}

export default CaseStructuredDetailsCard
