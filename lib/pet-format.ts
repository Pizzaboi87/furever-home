type LabelValue = unknown

export function normalizeValue(value: LabelValue) {
  if (value === null || value === undefined) {
    return ''
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value).trim().toLowerCase()
  }

  return ''
}

export function formatLabel(value: LabelValue) {
  return normalizeValue(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatInlineEnums(value: LabelValue) {
  const text = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : ''

  return text.replace(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g, (match) =>
    formatLabel(match).toLowerCase(),
  )
}
