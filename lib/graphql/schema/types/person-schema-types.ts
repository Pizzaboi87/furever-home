import type {
  AnonymizePersonInput,
  CreatePersonInput,
  UpdatePersonInput,
} from '@/lib/admin/person-write-service'
import type { GraphQLPublicPet } from '@/lib/graphql/public-pet-schema'
import type {
  GraphQLAdminCase,
  GraphQLCaseInteraction,
  GraphQLCaseNote,
  GraphQLCaseTimelineItem,
} from '@/lib/graphql/schema/types/case-schema-types'

export type GraphQLPerson = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  preferredContactMethod: string | null
  profileType: string | null
  householdType: string | null
  hasOtherPets: boolean | null
  interestAreas: string[]
  tags: string[]
  createdAt: string | null
  updatedAt: string | null
}

export type GraphQLAdminPersonStats = {
  totalCases: number
  openCases: number
  totalInteractions: number
  internalNotes: number
  relatedPets: number
  lastActivityAt: string | null
}

export type GraphQLAdminPersonOverview = {
  person: GraphQLPerson
  stats: GraphQLAdminPersonStats
}

export type GraphQLAdminPersonDetail = {
  person: GraphQLPerson
  cases: GraphQLAdminCase[]
  interactions: GraphQLCaseInteraction[]
  notes: GraphQLCaseNote[]
  timeline: GraphQLCaseTimelineItem[]
  relatedPets: GraphQLPublicPet[]
  stats: GraphQLAdminPersonStats
}

export type CreatePersonMutationArgs = {
  input: CreatePersonInput
}

export type UpdatePersonMutationArgs = {
  input: UpdatePersonInput
}

export type AnonymizePersonMutationArgs = {
  input: AnonymizePersonInput
}
