import TasksClient from './client'

import { requireCurrentStaff } from '@/lib/admin/auth'
import { getAdminFollowUpsFromGraphQL } from '@/lib/graphql/admin-queries'

export const dynamic = 'force-dynamic'

export default async function AdminTasksPage() {
  await requireCurrentStaff()

  const tasks = await getAdminFollowUpsFromGraphQL()

  return <TasksClient tasks={[...tasks]} />
}
