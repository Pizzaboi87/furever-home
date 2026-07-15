export const optionalDate = (value: string | null | undefined) => {
  const trimmed = value?.trim()
  return trimmed ? new Date(trimmed) : null
}

export const optionalNumber = (value: string | null | undefined) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  const number = Number(trimmed)
  return Number.isFinite(number) ? number : null
}

export const makeRecordId = (prefix: string, caseId: string) => {
  return `${prefix}-${caseId.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
