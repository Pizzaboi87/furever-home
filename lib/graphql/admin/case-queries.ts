import type {
  AdminCaseDetail,
  AdminCaseTimelineItem,
  AdminPetCase,
  CaseInteraction,
  CaseNote,
} from '@/lib/admin/domain'
import {
  ADMIN_CASE_FIELDS,
  CASE_DETAIL_FIELDS,
} from '@/lib/graphql/admin/admin-query-fragments'
import { executeAdminQuery } from '@/lib/graphql/admin/admin-query-executor'
import {
  mapGraphQLCaseDetailToDomain,
  mapGraphQLCaseToDomain,
  mapGraphQLInteractionToDomain,
  mapGraphQLNoteToDomain,
  mapGraphQLTimelineToDomain,
} from '@/lib/graphql/admin/admin-query-mappers'
import type {
  GraphQLAdminCase,
  GraphQLAdminCaseDetail,
  StaffOption,
} from '@/lib/graphql/admin/admin-query-types'

export const getAdminCasesFromGraphQL = async (): Promise<AdminPetCase[]> => {
  const data = await executeAdminQuery<{ adminCases: GraphQLAdminCase[] }>(/* GraphQL */ `
    query AdminCasesForPage {
      adminCases {
        ${ADMIN_CASE_FIELDS}
      }
    }
  `)

  return data.adminCases.map(mapGraphQLCaseToDomain)
}

export const getAdminCasePageDataFromGraphQL = async (
  id: string,
): Promise<{
  detail: AdminCaseDetail
  interactions: CaseInteraction[]
  notes: CaseNote[]
  timeline: AdminCaseTimelineItem[]
  staffOptions: StaffOption[]
} | null> => {
  const data = await executeAdminQuery<{
    adminCase: GraphQLAdminCaseDetail | null
    activeStaffOptions: StaffOption[]
  }>(
    /* GraphQL */ `
      query AdminCasePageData($id: ID!) {
        adminCase(id: $id) {
          ${CASE_DETAIL_FIELDS}
        }
        activeStaffOptions {
          id
          name
        }
      }
    `,
    { id },
  )

  if (!data.adminCase) {
    return null
  }

  return {
    detail: mapGraphQLCaseDetailToDomain(data.adminCase),
    interactions: data.adminCase.interactions.map(mapGraphQLInteractionToDomain),
    notes: data.adminCase.notes.map(mapGraphQLNoteToDomain),
    timeline: data.adminCase.timeline.map(mapGraphQLTimelineToDomain),
    staffOptions: data.activeStaffOptions,
  }
}
