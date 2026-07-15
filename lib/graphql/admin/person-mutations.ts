import type { Person } from '@/lib/admin/domain'
import type {
  AnonymizePersonInput,
  CreatePersonInput,
  UpdatePersonInput,
} from '@/lib/admin/person-write-service'
import {
  PERSON_FIELDS,
  executeAdminQuery,
  mapGraphQLPersonToDomain,
} from '@/lib/graphql/admin-queries'

type PersonMutationResult<TKey extends string> = Record<
  TKey,
  Parameters<typeof mapGraphQLPersonToDomain>[0]
>

export const createPersonWithGraphQL = async (
  input: CreatePersonInput,
): Promise<Person> => {
  const data = await executeAdminQuery<PersonMutationResult<'createPerson'>>(
    /* GraphQL */ `
      mutation CreatePerson($input: CreatePersonInput!) {
        createPerson(input: $input) {
          ${PERSON_FIELDS}
        }
      }
    `,
    { input },
  )

  return mapGraphQLPersonToDomain(data.createPerson)
}

export const updatePersonWithGraphQL = async (
  input: UpdatePersonInput,
): Promise<Person> => {
  const data = await executeAdminQuery<PersonMutationResult<'updatePerson'>>(
    /* GraphQL */ `
      mutation UpdatePerson($input: UpdatePersonInput!) {
        updatePerson(input: $input) {
          ${PERSON_FIELDS}
        }
      }
    `,
    { input },
  )

  return mapGraphQLPersonToDomain(data.updatePerson)
}

export const anonymizePersonWithGraphQL = async (
  input: AnonymizePersonInput,
): Promise<Person> => {
  const data = await executeAdminQuery<PersonMutationResult<'anonymizePerson'>>(
    /* GraphQL */ `
      mutation AnonymizePerson($input: AnonymizePersonInput!) {
        anonymizePerson(input: $input) {
          ${PERSON_FIELDS}
        }
      }
    `,
    { input },
  )

  return mapGraphQLPersonToDomain(data.anonymizePerson)
}
