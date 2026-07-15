import { createYoga } from 'graphql-yoga'

import { getCurrentStaff } from '@/lib/admin/auth'
import { appGraphQLSchema, type GraphQLContext } from '@/lib/graphql/app-schema'

const yoga = createYoga<GraphQLContext>({
  schema: appGraphQLSchema,
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
  context: () => ({
    getCurrentStaff,
  }),
})

export const dynamic = 'force-dynamic'

const handleGraphQLRequest = (request: Request) => {
  return yoga.handleRequest(request, { getCurrentStaff })
}

export const GET = handleGraphQLRequest
export const POST = handleGraphQLRequest
export const OPTIONS = handleGraphQLRequest
