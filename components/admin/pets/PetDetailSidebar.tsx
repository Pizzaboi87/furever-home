import { ClipboardList, PlusCircle } from 'lucide-react'

import SectionCard from '@/components/admin/common/SectionCard'
import { ActionLink } from '@/components/ui/ActionButton'
import type { AdminPetActivityItem, AdminPetCase } from '@/lib/admin/domain'
import { formatPetDetailShortDate } from '@/utils/admin/pets/pet-detail-utils'
import { PetDetailActivityRow, PetDetailCaseRow } from './PetDetailRows'

type PetDetailSidebarProps = {
  petId: string
  cases: AdminPetCase[]
  activity: AdminPetActivityItem[]
  openCases: number
  totalApplications: number
  lastActivityDate: string | undefined | null
}

export const PetDetailSidebar = ({
  petId,
  cases,
  activity,
  openCases,
  totalApplications,
  lastActivityDate,
}: PetDetailSidebarProps) => {
  return (
    <aside className="space-y-6">
      <SectionCard padding="md" delay={0.12}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Case summary
            </h2>
            <p className="text-sm text-muted-foreground">
              Adoption and contact activity for this pet.
            </p>
          </div>

          <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="grid cursor-default grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-input p-4">
            <p className="text-2xl font-bold text-foreground">{openCases}</p>
            <p className="text-sm text-muted-foreground">open cases</p>
          </div>

          <div className="rounded-xl border border-border bg-input p-4">
            <p className="text-2xl font-bold text-foreground">
              {cases.length}
            </p>
            <p className="text-sm text-muted-foreground">total cases</p>
          </div>

          <div className="rounded-xl border border-border bg-input p-4">
            <p className="text-2xl font-bold text-foreground">
              {totalApplications}
            </p>
            <p className="text-sm text-muted-foreground">applications</p>
          </div>

          <div className="rounded-xl border border-border bg-input p-4">
            <p className="text-2xl font-bold text-foreground">
              {formatPetDetailShortDate(lastActivityDate)}
            </p>
            <p className="text-sm text-muted-foreground">last activity</p>
          </div>
        </div>

        <ActionLink
          href={`/admin/cases/new?petId=${petId}`}
          fullWidth
          className="mt-5"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Create case for this pet
        </ActionLink>
      </SectionCard>

      <SectionCard padding="md" delay={0.16}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Related cases
            </h2>
            <p className="text-sm text-muted-foreground">
              All case records linked to this pet.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-primary">
            {cases.length}
          </span>
        </div>

        <div className="max-h-100 space-y-3 overflow-y-auto pr-2">
          {cases.map((item) => (
            <PetDetailCaseRow key={item.id} item={item} />
          ))}

          {cases.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No related cases found for this pet yet.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard padding="md" delay={0.2}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Recent history
            </h2>
            <p className="text-sm text-muted-foreground">
              All pet activity and status events, newest first.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-primary">
            {activity.length}
          </span>
        </div>

        <div className="relative max-h-100 space-y-4 overflow-y-auto pr-2 before:absolute before:bottom-0 before:left-2.5 before:top-1 before:w-px before:bg-border">
          {activity.map((item) => (
            <PetDetailActivityRow key={`${item.kind}-${item.id}`} item={item} />
          ))}

          {activity.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No activity found for this pet yet.
            </div>
          )}
        </div>
      </SectionCard>
    </aside>
  )
}
