import type { Person } from '@/lib/admin/domain'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertPersonCanBeUpdated } from '@/lib/admin/validation/domain/person-domain-validation'

import type { UpdatePersonInput } from './person-write-types'
import {
  cleanOptionalString,
  cleanStringList,
  cleanTagList,
  mapPrismaPersonToDomainPerson,
  parseAddress,
  requiredString,
  toPrismaContactChannel,
  toPrismaPersonProfileType,
} from './person-write-utils'

export const updatePerson = async (input: UpdatePersonInput): Promise<Person> => {
  const prisma = getPrismaClient()
  const existingPerson = await prisma.person.findUnique({
    where: { id: input.personId },
  })

  if (!existingPerson) {
    throw new Error('Person not found.')
  }

  assertPersonCanBeUpdated(existingPerson)

  const address = parseAddress(input.address)
  const interestAreas = cleanStringList(input.interestAreas)
  const tags = cleanTagList(input.tags)

  const updatedPerson = await prisma.person.update({
    where: {
      id: input.personId,
    },
    data: {
      name: requiredString(input.name, 'Name'),
      email: cleanOptionalString(input.email),
      phone: cleanOptionalString(input.phone),
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      preferredContactMethod: toPrismaContactChannel(
        input.preferredContactMethod,
        null,
      ),
      profileType: toPrismaPersonProfileType(input.profileType, null),
      householdType: cleanOptionalString(input.householdType),
      hasOtherPets: input.hasOtherPets ?? false,
      interestAreas,
      tags,
      updatedAt: new Date(),
    },
  })

  return mapPrismaPersonToDomainPerson(updatedPerson)
}
