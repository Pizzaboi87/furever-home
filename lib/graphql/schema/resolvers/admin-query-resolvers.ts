import {
  getCachedActiveStaffOptions,
  getCachedAdminCaseById,
  getCachedAdminCases,
  getCachedAdminPeople,
  getCachedAdminPeopleOverview,
  getCachedAdminPersonDetail,
  getCachedAdminPetActivity,
  getCachedAdminPetById,
  getCachedAdminPetCases,
  getCachedAdminPets,
  getCachedDashboardDataset,
  getCachedDashboardFollowUps,
} from '@/lib/admin/admin-read-cache'
import type { AdminDashboardDataset, DashboardRecord } from '@/lib/admin/domain'
import { mapPetToGraphQL } from '@/lib/graphql/public-pet-schema'
import type { GraphQLPublicPet } from '@/lib/graphql/public-pet-schema'
import {
  mapAdminCaseDetailToGraphQL,
  mapAdminCaseToGraphQL,
  mapAdminPersonDetailToGraphQL,
  mapPersonOverviewToGraphQL,
  mapPersonToGraphQL,
  mapPetActivityItemToGraphQL,
} from '@/lib/graphql/schema/admin-schema-mappers'
import type {
  GraphQLAdminCase,
  GraphQLAdminCaseDetail,
  GraphQLAdminPersonDetail,
  GraphQLAdminPersonOverview,
  GraphQLAdminPetDetail,
  GraphQLContext,
  GraphQLPerson,
  IdQueryArgs,
} from '@/lib/graphql/schema/admin-schema-types'
import { requireGraphQLStaff } from '@/lib/graphql/schema/resolvers/admin-resolver-support'

export const adminQueryResolvers = {
  adminPets: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<GraphQLPublicPet[]> => {
    await requireGraphQLStaff(context)
    const pets = await getCachedAdminPets()

    return pets.map(mapPetToGraphQL)
  },
  adminPet: async (
    _parent: unknown,
    args: IdQueryArgs,
    context: GraphQLContext,
  ): Promise<GraphQLPublicPet | null> => {
    await requireGraphQLStaff(context)
    const pet = await getCachedAdminPetById(args.id)

    return pet ? mapPetToGraphQL(pet) : null
  },
  adminPetDetail: async (
    _parent: unknown,
    args: IdQueryArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminPetDetail | null> => {
    await requireGraphQLStaff(context)
    const pet = await getCachedAdminPetById(args.id)

    if (!pet) {
      return null
    }

    const [cases, activity] = await Promise.all([
      getCachedAdminPetCases(pet.id),
      getCachedAdminPetActivity(pet.id),
    ])

    return {
      pet: mapPetToGraphQL(pet),
      cases: cases.map(mapAdminCaseToGraphQL),
      activity: activity.map(mapPetActivityItemToGraphQL),
    }
  },
  adminCases: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCase[]> => {
    await requireGraphQLStaff(context)
    const cases = await getCachedAdminCases()

    return cases.map(mapAdminCaseToGraphQL)
  },
  adminCase: async (
    _parent: unknown,
    args: IdQueryArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail | null> => {
    await requireGraphQLStaff(context)
    const detail = await getCachedAdminCaseById(args.id)

    return detail ? mapAdminCaseDetailToGraphQL(detail) : null
  },
  adminPeople: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<GraphQLPerson[]> => {
    await requireGraphQLStaff(context)
    const people = await getCachedAdminPeople()

    return people.map(mapPersonToGraphQL)
  },
  adminPeopleOverview: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<GraphQLAdminPersonOverview[]> => {
    await requireGraphQLStaff(context)
    const overview = await getCachedAdminPeopleOverview()

    return overview.map(mapPersonOverviewToGraphQL)
  },
  adminPerson: async (
    _parent: unknown,
    args: IdQueryArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminPersonDetail | null> => {
    await requireGraphQLStaff(context)
    const detail = await getCachedAdminPersonDetail(args.id)

    return detail ? mapAdminPersonDetailToGraphQL(detail) : null
  },
  activeStaffOptions: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<Array<{ id: string; name: string }>> => {
    await requireGraphQLStaff(context)
    return getCachedActiveStaffOptions()
  },
  adminDashboardDataset: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<AdminDashboardDataset> => {
    await requireGraphQLStaff(context)

    return getCachedDashboardDataset()
  },
  adminFollowUps: async (
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext,
  ): Promise<DashboardRecord[]> => {
    await requireGraphQLStaff(context)
    return getCachedDashboardFollowUps()
  },
}
