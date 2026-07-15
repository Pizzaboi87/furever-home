import type { AdminPetActivityItem } from '@/lib/admin/domain'
import type { GraphQLPetActivityItem } from '@/lib/graphql/schema/admin-schema-types'

export const mapPetActivityItemToGraphQL = (
  item: AdminPetActivityItem,
): GraphQLPetActivityItem => ({
  id: item.id,
  kind: item.kind,
  type: item.type,
  title: item.title,
  detail: item.detail,
  createdAt: item.createdAt,
  statusFrom: item.statusFrom ? String(item.statusFrom) : null,
  statusTo: item.statusTo ? String(item.statusTo) : null,
})
