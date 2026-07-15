import { notFound } from 'next/navigation'
import { requireCurrentStaff } from '@/lib/admin/auth'
import { getAdminCasePageDataFromGraphQL } from '@/lib/graphql/admin-queries'
import { formatLabel } from '@/lib/pet-format'
import Header from '@/components/admin/common/Header'
import CaseDetailMainContent from '@/components/admin/cases/CaseDetailMainContent'
import CaseDetailSidebar from '@/components/admin/cases/CaseDetailSidebar'

export const dynamic = 'force-dynamic'

type AdminCaseDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function AdminCaseDetailPage({
  params,
}: AdminCaseDetailPageProps) {
  await requireCurrentStaff()
  const { id } = await params
  const pageData = await getAdminCasePageDataFromGraphQL(id)

  if (!pageData) {
    notFound()
  }

  const { detail, interactions, notes, timeline, staffOptions } = pageData

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/cases"
        title={detail.case.subject}
        description={`${formatLabel(detail.case.source ?? detail.applicant.channel)} · ${formatLabel(detail.case.scope)}`}
      />

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_390px]">
        <CaseDetailMainContent
          detail={detail}
          interactions={interactions}
          notes={notes}
          timeline={timeline}
          staffOptions={staffOptions}
        />

        <CaseDetailSidebar detail={detail} />
      </div>
    </main>
  )
}
