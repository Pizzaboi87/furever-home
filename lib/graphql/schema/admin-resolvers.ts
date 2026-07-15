import { jsonScalar } from '@/lib/graphql/schema/json-scalar'
import { adminQueryResolvers } from '@/lib/graphql/schema/resolvers/admin-query-resolvers'
import { caseMutationResolvers } from '@/lib/graphql/schema/resolvers/case-mutation-resolvers'
import { personMutationResolvers } from '@/lib/graphql/schema/resolvers/person-mutation-resolvers'
import { petMutationResolvers } from '@/lib/graphql/schema/resolvers/pet-mutation-resolvers'

export const adminResolvers = {
  JSON: jsonScalar,
  Query: adminQueryResolvers,
  Mutation: {
    ...caseMutationResolvers,
    ...petMutationResolvers,
    ...personMutationResolvers,
  },
}
