export const toDomainEnumValue = <T extends string = string>(
  value: string | null | undefined,
): T | undefined => {
  return value?.toLowerCase() as T | undefined
}

export const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) {
    return new Date().toISOString()
  }

  return value instanceof Date ? value.toISOString() : value
}
