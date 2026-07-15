import { isAnonymizedPersonRecord } from '@/lib/admin/person/person-utils'

export type PersonPrivacyRecord = Parameters<typeof isAnonymizedPersonRecord>[0]

export const assertPersonCanBeUpdated = (person: PersonPrivacyRecord) => {
  if (isAnonymizedPersonRecord(person)) {
    throw new Error('An anonymized contact cannot be edited.')
  }
}

export const assertPersonCanBeAnonymized = (
  person: PersonPrivacyRecord,
  activeCaseCount: number,
) => {
  if (isAnonymizedPersonRecord(person)) {
    throw new Error('This contact has already been anonymized.')
  }

  if (activeCaseCount > 0) {
    throw new Error(
      'This contact cannot be anonymized while active cases are still linked to it.',
    )
  }
}
