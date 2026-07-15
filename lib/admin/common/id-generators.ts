const DEFAULT_CASE_SEQUENCE_START = 109

export const getYearFromTimestamp = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return new Date().getFullYear()
  }

  return date.getFullYear()
}

export const makeSeededId = (prefix: string, seed: string) => {
  return `${prefix}-${seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`
}

export const makePreviewCaseId = (createdAt: string) => {
  return `FH-${getYearFromTimestamp(createdAt)}-PREVIEW`
}

export const getNextCaseId = (existingIds: string[], createdAt: string) => {
  const year = getYearFromTimestamp(createdAt)
  const caseIdPattern = new RegExp(`^FH-${year}-(\\d+)$`)

  const highestCaseNumber = existingIds.reduce((highest, id) => {
    const match = caseIdPattern.exec(id)

    if (!match) {
      return highest
    }

    return Math.max(highest, Number(match[1]))
  }, DEFAULT_CASE_SEQUENCE_START)

  return `FH-${year}-${String(highestCaseNumber + 1).padStart(4, '0')}`
}

export const getNextPetId = (existingIds: string[]) => {
  const highestPetNumber = existingIds.reduce((highest, id) => {
    const match = /^pet-(\d+)$/.exec(id)

    if (!match) {
      return highest
    }

    return Math.max(highest, Number(match[1]))
  }, 0)

  return `pet-${String(highestPetNumber + 1).padStart(4, '0')}`
}

export const getNextPersonId = (existingIds: string[]) => {
  const highestPersonNumber = existingIds.reduce((highest, id) => {
    const match = /^person-(\d+)$/.exec(id)

    if (!match) {
      return highest
    }

    return Math.max(highest, Number(match[1]))
  }, 0)

  return `person-${String(highestPersonNumber + 1).padStart(4, '0')}`
}