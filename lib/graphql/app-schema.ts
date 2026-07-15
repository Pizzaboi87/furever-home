import { createSchema } from 'graphql-yoga'

import { publicPetResolvers, publicPetTypeDefs } from '@/lib/graphql/public-pet-schema'
import { adminResolvers } from '@/lib/graphql/schema/admin-resolvers'
import { adminTypeDefs } from '@/lib/graphql/schema/admin-type-defs'

export type { GraphQLContext } from '@/lib/graphql/schema/admin-schema-types'

export const appGraphQLSchema = createSchema({
  typeDefs: [publicPetTypeDefs, adminTypeDefs],
  resolvers: [publicPetResolvers, adminResolvers],
})
