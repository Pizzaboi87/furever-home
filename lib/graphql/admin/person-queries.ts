import type { Person } from '@/lib/admin/domain'
import type {
  AdminPersonDetail,
  AdminPersonOverview,
} from '@/lib/admin/person-service'
import {
  ADMIN_CASE_FIELDS,
  ADMIN_PET_FIELDS,
  PERSON_FIELDS,
  PERSON_STATS_FIELDS,
} from '@/lib/graphql/admin/admin-query-fragments'
import { executeAdminQuery } from '@/lib/graphql/admin/admin-query-executor'
import {
  mapGraphQLCaseToDomain,
  mapGraphQLInteractionToDomain,
  mapGraphQLNoteToDomain,
  mapGraphQLPersonStatsToDomain,
  mapGraphQLPersonToDomain,
  mapGraphQLPetToDomain,
  mapGraphQLTimelineToDomain,
} from '@/lib/graphql/admin/admin-query-mappers'
import type {
  GraphQLAdminPersonDetail,
  GraphQLAdminPersonOverview,
  GraphQLPerson,
} from '@/lib/graphql/admin/admin-query-types'

export const getAdminPeopleFromGraphQL = async (): Promise<Person[]> => {
  const data = await executeAdminQuery<{ adminPeople: GraphQLPerson[] }>(/* GraphQL */ `
    query AdminPeopleForForm {
      adminPeople {
        ${PERSON_FIELDS}
      }
    }
  `)

  return data.adminPeople.map(mapGraphQLPersonToDomain)
}

export const getAdminPeopleOverviewFromGraphQL = async (): Promise<AdminPersonOverview[]> => {
  const data = await executeAdminQuery<{
    adminPeopleOverview: GraphQLAdminPersonOverview[]
  }>(/* GraphQL */ `
    query AdminPeopleOverviewForPage {
      adminPeopleOverview {
        person {
          ${PERSON_FIELDS}
        }
        stats {
          ${PERSON_STATS_FIELDS}
        }
      }
    }
  `)

  return data.adminPeopleOverview.map((overview) => ({
    person: mapGraphQLPersonToDomain(overview.person),
    stats: mapGraphQLPersonStatsToDomain(overview.stats),
  }))
}

export const getAdminPersonDetailFromGraphQL = async (
  id: string,
): Promise<AdminPersonDetail | null> => {
  const data = await executeAdminQuery<{ adminPerson: GraphQLAdminPersonDetail | null }>(
    /* GraphQL */ `
      query AdminPersonDetailForPage($id: ID!) {
        adminPerson(id: $id) {
          person {
            ${PERSON_FIELDS}
          }
          cases {
            ${ADMIN_CASE_FIELDS}
          }
          interactions {
            id
            caseId
            direction
            channel
            summary
            occurredAt
            loggedAt
            loggedByStaffId
            loggedByStaffName
            loggedByStaffRole
          }
          notes {
            id
            caseId
            body
            tags
            createdAt
            staffId
            staffName
            staffRole
          }
          timeline {
            id
            type
            title
            detail
            createdAt
            actorName
            actorRole
            caseId
            caseSubject
          }
          relatedPets {
            ${ADMIN_PET_FIELDS}
          }
          stats {
            ${PERSON_STATS_FIELDS}
          }
        }
      }
    `,
    { id },
  )

  if (!data.adminPerson) {
    return null
  }

  return {
    person: mapGraphQLPersonToDomain(data.adminPerson.person),
    cases: data.adminPerson.cases.map(mapGraphQLCaseToDomain),
    interactions: data.adminPerson.interactions.map(mapGraphQLInteractionToDomain),
    notes: data.adminPerson.notes.map(mapGraphQLNoteToDomain),
    timeline: data.adminPerson.timeline.map((item) => ({
      ...mapGraphQLTimelineToDomain(item),
      caseId: item.caseId ?? '',
      caseSubject: item.caseSubject ?? '',
    })),
    relatedPets: data.adminPerson.relatedPets.map(mapGraphQLPetToDomain),
    stats: mapGraphQLPersonStatsToDomain(data.adminPerson.stats),
  }
}
