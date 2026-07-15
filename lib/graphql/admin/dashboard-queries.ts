import type { AdminDashboardDataset, DashboardRecord } from '@/lib/admin/domain'
import { executeAdminQuery } from '@/lib/graphql/admin/admin-query-executor'

type AdminDashboardDatasetQueryData = {
  adminDashboardDataset: AdminDashboardDataset
}

type AdminFollowUpsQueryData = {
  adminFollowUps: DashboardRecord[]
}

export const getAdminDashboardDatasetFromGraphQL = async (): Promise<AdminDashboardDataset> => {
  const data = await executeAdminQuery<AdminDashboardDatasetQueryData>(/* GraphQL */ `
    query AdminDashboardDataset {
      adminDashboardDataset
    }
  `)

  return data.adminDashboardDataset
}

export const getAdminFollowUpsFromGraphQL = async (): Promise<DashboardRecord[]> => {
  const data = await executeAdminQuery<AdminFollowUpsQueryData>(/* GraphQL */ `
    query AdminFollowUps {
      adminFollowUps
    }
  `)

  return data.adminFollowUps
}
