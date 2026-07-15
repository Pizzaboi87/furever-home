import DashboardClient from './client'

import { requireCurrentStaff } from '@/lib/admin/auth'
import { getAdminDashboardDatasetFromGraphQL } from '@/lib/graphql/admin-queries'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await requireCurrentStaff()

  const dashboardDataset = await getAdminDashboardDatasetFromGraphQL()

  return <DashboardClient dashboardDataset={dashboardDataset} />
}
