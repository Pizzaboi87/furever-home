import type { AdminPet, AdminPetActivityItem, AdminPetCase } from '@/lib/admin/domain'
import { ADMIN_CASE_FIELDS, ADMIN_PET_FIELDS } from '@/lib/graphql/admin/admin-query-fragments'
import { executeAdminQuery } from '@/lib/graphql/admin/admin-query-executor'
import {
  mapGraphQLCaseToDomain,
  mapGraphQLPetActivityToDomain,
  mapGraphQLPetToDomain,
} from '@/lib/graphql/admin/admin-query-mappers'
import type {
  GraphQLAdminPet,
  GraphQLAdminPetDetail,
} from '@/lib/graphql/admin/admin-query-types'

export const getAdminPetsFromGraphQL = async (): Promise<AdminPet[]> => {
  const data = await executeAdminQuery<{ adminPets: GraphQLAdminPet[] }>(/* GraphQL */ `
    query AdminPetsForPage {
      adminPets {
        ${ADMIN_PET_FIELDS}
      }
    }
  `)

  return data.adminPets.map(mapGraphQLPetToDomain)
}

export const getAdminPetDetailFromGraphQL = async (
  id: string,
): Promise<{ pet: AdminPet; cases: AdminPetCase[]; activity: AdminPetActivityItem[] } | null> => {
  const data = await executeAdminQuery<{ adminPetDetail: GraphQLAdminPetDetail | null }>(
    /* GraphQL */ `
      query AdminPetDetailForPage($id: ID!) {
        adminPetDetail(id: $id) {
          pet {
            ${ADMIN_PET_FIELDS}
          }
          cases {
            ${ADMIN_CASE_FIELDS}
          }
          activity {
            id
            kind
            type
            title
            detail
            createdAt
            statusFrom
            statusTo
          }
        }
      }
    `,
    { id },
  )

  if (!data.adminPetDetail) {
    return null
  }

  return {
    pet: mapGraphQLPetToDomain(data.adminPetDetail.pet),
    cases: data.adminPetDetail.cases.map(mapGraphQLCaseToDomain),
    activity: data.adminPetDetail.activity.map(mapGraphQLPetActivityToDomain),
  }
}
