import { createPet, deletePet, unpublishPet, updatePet } from '@/lib/admin/pet-write-service'
import type { DeletePetResult } from '@/lib/admin/pet-write-service'
import { mapPetToGraphQL } from '@/lib/graphql/public-pet-schema'
import type { GraphQLPublicPet } from '@/lib/graphql/public-pet-schema'
import type {
  CreatePetMutationArgs,
  GraphQLContext,
  IdMutationArgs,
  UpdatePetMutationArgs,
} from '@/lib/graphql/schema/admin-schema-types'
import { requireGraphQLStaff } from '@/lib/graphql/schema/resolvers/admin-resolver-support'

export const petMutationResolvers = {
  createPet: async (
    _parent: unknown,
    args: CreatePetMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPublicPet> => {
    await requireGraphQLStaff(context)
    const pet = await createPet(args.input)

    return mapPetToGraphQL(pet)
  },
  updatePet: async (
    _parent: unknown,
    args: UpdatePetMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPublicPet> => {
    await requireGraphQLStaff(context)
    const pet = await updatePet(args.input)

    return mapPetToGraphQL(pet)
  },
  unpublishPet: async (
    _parent: unknown,
    args: IdMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPublicPet> => {
    await requireGraphQLStaff(context)
    const pet = await unpublishPet(args.id)

    return mapPetToGraphQL(pet)
  },
  deletePet: async (
    _parent: unknown,
    args: IdMutationArgs,
    context: GraphQLContext,
  ): Promise<DeletePetResult> => {
    await requireGraphQLStaff(context)

    return deletePet(args.id)
  },
}
