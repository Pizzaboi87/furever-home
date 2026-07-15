import type { Person } from '@/lib/admin/domain'

export const toNullableString = (value: string | null | undefined) => value ?? null

export const formatPersonAddress = (
  value: Person['address'] | null | undefined,
): string | null => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  return [
    value.line1,
    value.line2,
    value.city,
    value.state,
    value.zip,
    value.country,
  ]
    .filter((part): part is string => Boolean(part))
    .join(', ') || null
}
