import type { AdminPet } from '@/lib/admin/domain'
import type {
  CreatePetInput,
  DeletePetResult,
  UpdatePetInput,
} from '@/lib/admin/pet-write-service'
import {
  ADMIN_PET_FIELDS,
  executeAdminQuery,
  mapGraphQLPetToDomain,
} from '@/lib/graphql/admin-queries'

type PetMutationResult<TKey extends string> = Record<
  TKey,
  Parameters<typeof mapGraphQLPetToDomain>[0]
>

export const createPetWithGraphQL = async (input: CreatePetInput): Promise<AdminPet> => {
  const data = await executeAdminQuery<PetMutationResult<'createPet'>>(
    /* GraphQL */ `
      mutation CreatePet($input: CreatePetInput!) {
        createPet(input: $input) {
          ${ADMIN_PET_FIELDS}
        }
      }
    `,
    { input },
  )

  return mapGraphQLPetToDomain(data.createPet)
}

export const updatePetWithGraphQL = async (input: UpdatePetInput): Promise<AdminPet> => {
  const data = await executeAdminQuery<PetMutationResult<'updatePet'>>(
    /* GraphQL */ `
      mutation UpdatePet($input: UpdatePetInput!) {
        updatePet(input: $input) {
          ${ADMIN_PET_FIELDS}
        }
      }
    `,
    { input },
  )

  return mapGraphQLPetToDomain(data.updatePet)
}

export const unpublishPetWithGraphQL = async (id: string): Promise<AdminPet> => {
  const data = await executeAdminQuery<PetMutationResult<'unpublishPet'>>(
    /* GraphQL */ `
      mutation UnpublishPet($id: ID!) {
        unpublishPet(id: $id) {
          ${ADMIN_PET_FIELDS}
        }
      }
    `,
    { id },
  )

  return mapGraphQLPetToDomain(data.unpublishPet)
}

export const deletePetWithGraphQL = async (id: string): Promise<DeletePetResult> => {
  const data = await executeAdminQuery<{ deletePet: DeletePetResult }>(
    /* GraphQL */ `
      mutation DeletePet($id: ID!) {
        deletePet(id: $id) {
          deletedPetId
        }
      }
    `,
    { id },
  )

  return data.deletePet
}
