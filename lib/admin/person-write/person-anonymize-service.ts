import type { Person } from '@/lib/admin/domain'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertPersonCanBeAnonymized } from '@/lib/admin/validation/domain/person-domain-validation'
import { PRISMA_CASE_STATUS } from '@/lib/admin/case-write/case-write-support'

import { PRISMA_PERSON_PROFILE_TYPE } from './person-write-constants'
import type { AnonymizePersonInput } from './person-write-types'
import { mapPrismaPersonToDomainPerson } from './person-write-utils'

export const anonymizePerson = async (
  input: AnonymizePersonInput,
): Promise<Person> => {
  const prisma = getPrismaClient()
  const person = await prisma.person.findUnique({
    where: {
      id: input.personId,
    },
  })

  if (!person) {
    throw new Error('Person not found.')
  }

  const activeCaseCount = await prisma.shelterCase.count({
    where: {
      personId: input.personId,
      status: {
        in: [
          PRISMA_CASE_STATUS.NEW,
          PRISMA_CASE_STATUS.OPEN,
          PRISMA_CASE_STATUS.WAITING_ON_CONTACT,
          PRISMA_CASE_STATUS.WAITING_ON_STAFF,
          PRISMA_CASE_STATUS.SCREENING,
          PRISMA_CASE_STATUS.SCHEDULED,
          PRISMA_CASE_STATUS.APPROVED,
        ],
      },
    },
  })

  assertPersonCanBeAnonymized(person, activeCaseCount)

  if (input.confirmationName.trim() !== person.name) {
    throw new Error('Type the current contact name exactly before anonymizing.')
  }

  const updatedPerson = await prisma.person.update({
    where: {
      id: input.personId,
    },
    data: {
      name: 'Deleted contact',
      email: null,
      phone: null,
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      preferredContactMethod: null,
      profileType: PRISMA_PERSON_PROFILE_TYPE.GENERAL_CONTACT,
      householdType: null,
      hasOtherPets: null,
      interestAreas: [],
      tags: [],
      updatedAt: new Date(),
    },
  })

  return mapPrismaPersonToDomainPerson(updatedPerson)
}
