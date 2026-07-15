import type { CreatePetInput, UpdatePetInput } from '@/lib/admin/pet-write-service'
import type { GraphQLPublicPet } from '@/lib/graphql/public-pet-schema'
import type { GraphQLAdminCase } from '@/lib/graphql/schema/types/case-schema-types'

export type GraphQLPetActivityItem = {
  id: string
  kind: string
  type: string
  title: string
  detail: string
  createdAt: string
  statusFrom: string | null
  statusTo: string | null
}

export type GraphQLAdminPetDetail = {
  pet: GraphQLPublicPet
  cases: GraphQLAdminCase[]
  activity: GraphQLPetActivityItem[]
}

export type CreatePetMutationArgs = {
  input: CreatePetInput
}

export type UpdatePetMutationArgs = {
  input: UpdatePetInput
}
