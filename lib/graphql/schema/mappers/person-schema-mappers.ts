import type { Person } from '@/lib/admin/domain'
import type {
  AdminPersonDetail,
  AdminPersonOverview,
  AdminPersonStats,
} from '@/lib/admin/person-service'
import { mapPetToGraphQL } from '@/lib/graphql/public-pet-schema'
import type {
  GraphQLAdminPersonDetail,
  GraphQLAdminPersonOverview,
  GraphQLAdminPersonStats,
  GraphQLPerson,
} from '@/lib/graphql/schema/admin-schema-types'
import {
  mapAdminCaseToGraphQL,
  mapInteractionToGraphQL,
  mapNoteToGraphQL,
  mapTimelineItemToGraphQL,
} from '@/lib/graphql/schema/mappers/case-schema-mappers'
import {
  formatPersonAddress,
  toNullableString,
} from '@/lib/graphql/schema/mappers/schema-mapper-utils'

export const mapPersonToGraphQL = (person: Person): GraphQLPerson => ({
  id: person.id,
  name: person.name,
  email: toNullableString(person.email),
  phone: toNullableString(person.phone),
  address: formatPersonAddress(person.address),
  preferredContactMethod: toNullableString(person.preferredContactMethod),
  profileType: toNullableString(person.profileType),
  householdType: toNullableString(person.householdType),
  hasOtherPets: person.hasOtherPets ?? null,
  interestAreas: person.interestAreas ?? [],
  tags: person.tags ?? [],
  createdAt: person.createdAt ?? null,
  updatedAt: person.updatedAt ?? null,
})

const mapPersonStatsToGraphQL = (
  stats: AdminPersonStats,
): GraphQLAdminPersonStats => ({
  totalCases: stats.totalCases,
  openCases: stats.openCases,
  totalInteractions: stats.totalInteractions,
  internalNotes: stats.internalNotes,
  relatedPets: stats.relatedPets,
  lastActivityAt: stats.lastActivityAt ?? null,
})

export const mapPersonOverviewToGraphQL = (
  overview: AdminPersonOverview,
): GraphQLAdminPersonOverview => ({
  person: mapPersonToGraphQL(overview.person),
  stats: mapPersonStatsToGraphQL(overview.stats),
})

export const mapAdminPersonDetailToGraphQL = (
  detail: AdminPersonDetail,
): GraphQLAdminPersonDetail => ({
  person: mapPersonToGraphQL(detail.person),
  cases: detail.cases.map(mapAdminCaseToGraphQL),
  interactions: detail.interactions.map(mapInteractionToGraphQL),
  notes: detail.notes.map(mapNoteToGraphQL),
  timeline: detail.timeline.map(mapTimelineItemToGraphQL),
  relatedPets: detail.relatedPets.map(mapPetToGraphQL),
  stats: mapPersonStatsToGraphQL(detail.stats),
})
