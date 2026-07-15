import { execute, parse, type ExecutionResult } from 'graphql'

import { getCurrentStaff } from '@/lib/admin/auth'
import { appGraphQLSchema, type GraphQLContext } from '@/lib/graphql/app-schema'
import { toTypedClientSafePlainData } from '@/lib/graphql/plain-data'

export const executeAdminQuery = async <TData>(
  source: string,
  variableValues?: Record<string, unknown>,
): Promise<TData> => {
  const context: GraphQLContext = {
    getCurrentStaff,
  }

  const result = (await execute({
    schema: appGraphQLSchema,
    document: parse(source),
    variableValues,
    contextValue: context,
  })) as ExecutionResult<TData>

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join('; '))
  }

  if (!result.data) {
    throw new Error('GraphQL admin query returned no data.')
  }

  return toTypedClientSafePlainData(result.data)
}
