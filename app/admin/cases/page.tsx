import { getAdminCasesFromGraphQL } from '@/lib/graphql/admin-queries'
import { isOpenCaseStatus } from '@/lib/admin/domain'
import CasesClient from './client'

import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

export default async function AdminCasesPage() {
    await requireCurrentStaff()
    const cases = await getAdminCasesFromGraphQL()
    const stats = {
        total: cases.length,
        open: cases.filter((item) => isOpenCaseStatus(item.status)).length,
        highPriority: cases.filter((item) => item.priority === 'high').length,
        petRelated: cases.filter((item) => item.scope === 'pet_related').length,
    }

    return <CasesClient cases={cases} stats={stats} />
}
