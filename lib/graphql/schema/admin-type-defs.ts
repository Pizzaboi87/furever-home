import { adminRootTypeDefs } from '@/lib/graphql/schema/type-defs/admin-root-type-defs'
import { caseTypeDefs } from '@/lib/graphql/schema/type-defs/case-type-defs'
import { personTypeDefs } from '@/lib/graphql/schema/type-defs/person-type-defs'
import { petTypeDefs } from '@/lib/graphql/schema/type-defs/pet-type-defs'

export const adminTypeDefs = [
  personTypeDefs,
  caseTypeDefs,
  petTypeDefs,
  adminRootTypeDefs,
].join('\n')
