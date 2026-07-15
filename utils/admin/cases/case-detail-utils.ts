export type DetailRowValue = string | number | boolean | null | undefined

export type DetailListRow = {
  label: string
  value: DetailRowValue
}

export const MAX_VISIBLE_INTERACTIONS = 3
export const MAX_VISIBLE_NOTES = 5

export function formatDateTime(value: string | undefined | null) {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDisplayValue(value: DetailRowValue) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return value ?? 'Not captured'
}

export function formatAddress(value: unknown) {
  if (!value) {
    return undefined
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value !== 'object') {
    return undefined
  }

  const address = value as {
    line1?: string
    line2?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.zip,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}

export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
) {
  if (typeof amount !== 'number') {
    return undefined
  }

  return `${currency ?? 'USD'} ${amount.toFixed(2)}`
}
