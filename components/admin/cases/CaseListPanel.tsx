import AdminListPanel from '@/components/admin/common/AdminListPanel'
import CaseDesktopTable from '@/components/admin/cases/CaseDesktopTable'
import CaseMobileCard from '@/components/admin/cases/CaseMobileCard'
import type { AdminPetCase } from '@/lib/admin/domain'
import { caseSortOptions, type CaseSortMode } from '@/utils/admin/cases/case-utils'

type CaseListPanelProps = {
  cases: AdminPetCase[]
  totalCount: number
  sortMode: CaseSortMode
}

const CaseListPanel = ({ cases, totalCount, sortMode }: CaseListPanelProps) => {
  const sortLabel = caseSortOptions
    .find((option) => option.value === sortMode)
    ?.label.toLowerCase()

  return (
    <AdminListPanel
      title="Case records"
      description={
        <>
          Showing {cases.length} of {totalCount} CRM cases. Sorted by {sortLabel}.
        </>
      }
      bodyClassName="max-h-[calc(100vh-18rem)] overflow-y-auto"
    >
      <div className="space-y-3 p-4 lg:hidden">
        {cases.map((item) => (
          <CaseMobileCard key={item.id} item={item} />
        ))}

        {cases.length === 0 ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
            No cases match the selected filters.
          </div>
        ) : null}
      </div>

      <CaseDesktopTable cases={cases} />
    </AdminListPanel>
  )
}

export default CaseListPanel
