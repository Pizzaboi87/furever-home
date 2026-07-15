import type { CurrentStaff } from '@/lib/admin/auth'

export type GraphQLContext = {
  getCurrentStaff: () => Promise<CurrentStaff | null>
}

export type IdQueryArgs = {
  id: string
}

export type IdMutationArgs = {
  id: string
}
