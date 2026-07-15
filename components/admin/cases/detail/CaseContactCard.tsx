import Link from 'next/link'
import { ExternalLink, Mail, Phone, UserRound } from 'lucide-react'
import type { AdminCaseDetail } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/lib/pet-format'
import {
  DetailCard,
  CaseDetailCardHeader,
} from '@/components/admin/cases/CaseDetailCards'
import { formatAddress } from '@/utils/admin/cases/case-detail-utils'

type CaseContactCardProps = {
  applicant: AdminCaseDetail['applicant']
}

const CaseContactCard = ({ applicant }: CaseContactCardProps) => {
  const applicantAddress = formatAddress(applicant.address)

  return (
    <SectionCard delay={0.16}>
      <CaseDetailCardHeader
        title="Contact"
        description="Person linked to this case."
        icon={UserRound}
      />

      <div className="rounded-xl border border-border bg-input p-4">
        <Link
          href={`/admin/people/${applicant.id}`}
          className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          {applicant.name}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

        <div className="mt-4 space-y-3">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {applicant.email ?? 'Email not captured'}
          </p>

          <p className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {applicant.phone ?? 'Phone not captured'}
          </p>

          {applicantAddress && (
            <p className="text-sm leading-5 text-muted-foreground">
              {applicantAddress}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <DetailCard label="Channel" value={formatLabel(applicant.channel)} />
        <DetailCard label="Score" value={applicant.score} />
        <DetailCard
          label="Household"
          value={formatLabel(applicant.householdType)}
        />
        <DetailCard label="Other pets" value={applicant.hasOtherPets} />
      </div>
    </SectionCard>
  )
}

export default CaseContactCard
