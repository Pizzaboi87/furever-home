import { GraphQLError } from 'graphql'

import { getAdminCaseByIdFromPrisma } from '@/lib/admin/case-service'
import { mapAdminCaseDetailToGraphQL } from '@/lib/graphql/schema/admin-schema-mappers'
import type { GraphQLContext } from '@/lib/graphql/schema/admin-schema-types'

export const requireGraphQLStaff = async (context: GraphQLContext) => {
  const currentStaff = await context.getCurrentStaff()

  if (!currentStaff) {
    throw new GraphQLError('Active staff authentication is required.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    })
  }

  return currentStaff
}

export const getUpdatedAdminCaseDetail = async (caseId: string) => {
  const detail = await getAdminCaseByIdFromPrisma(caseId)

  if (!detail) {
    throw new GraphQLError('Case was not found after update.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    })
  }

  return mapAdminCaseDetailToGraphQL(detail)
}

export const requireWriteResult = (result: { caseId: string } | null) => {
  if (!result) {
    throw new GraphQLError('The case update could not be completed.', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }

  return result
}
