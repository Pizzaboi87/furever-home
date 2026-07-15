import { anonymizePerson, createPerson, updatePerson } from '@/lib/admin/person-write-service'
import { mapPersonToGraphQL } from '@/lib/graphql/schema/admin-schema-mappers'
import type {
  AnonymizePersonMutationArgs,
  CreatePersonMutationArgs,
  GraphQLContext,
  GraphQLPerson,
  UpdatePersonMutationArgs,
} from '@/lib/graphql/schema/admin-schema-types'
import { requireGraphQLStaff } from '@/lib/graphql/schema/resolvers/admin-resolver-support'

export const personMutationResolvers = {
  createPerson: async (
    _parent: unknown,
    args: CreatePersonMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPerson> => {
    await requireGraphQLStaff(context)
    const person = await createPerson(args.input)

    return mapPersonToGraphQL(person)
  },
  updatePerson: async (
    _parent: unknown,
    args: UpdatePersonMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPerson> => {
    await requireGraphQLStaff(context)
    const person = await updatePerson(args.input)

    return mapPersonToGraphQL(person)
  },
  anonymizePerson: async (
    _parent: unknown,
    args: AnonymizePersonMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPerson> => {
    await requireGraphQLStaff(context)
    const person = await anonymizePerson(args.input)

    return mapPersonToGraphQL(person)
  },
}
