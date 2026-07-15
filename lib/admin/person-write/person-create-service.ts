import type { Person } from '@/lib/admin/domain'
import { getPrismaClient } from '@/lib/server/prisma'

import {
  PERSON_ID_PREFIX,
  PRISMA_CONTACT_CHANNEL,
} from './person-write-constants'
import type { CreatePersonInput } from './person-write-types'
import {
  cleanOptionalString,
  cleanTagList,
  inferProfileType,
  mapPrismaPersonToDomainPerson,
  parseAddress,
  requiredString,
  toPrismaContactChannel,
} from './person-write-utils'

const getNextPersonId = async () => {
  const prisma = getPrismaClient()
  const people: Array<{ id: string }> = await prisma.person.findMany({
    select: {
      id: true,
    },
  })

  const highestPersonNumber = people.reduce((highest, person) => {
    if (!person.id.startsWith(PERSON_ID_PREFIX)) {
      return highest
    }

    const parsedNumber = Number.parseInt(person.id.replace(PERSON_ID_PREFIX, ''), 10)

    return Number.isFinite(parsedNumber) ? Math.max(highest, parsedNumber) : highest
  }, 0)

  return `${PERSON_ID_PREFIX}${String(highestPersonNumber + 1).padStart(4, '0')}`
}

export const createPerson = async (input: CreatePersonInput): Promise<Person> => {
  const name = requiredString(input.name, 'Name')

  if (name.length < 2) {
    throw new Error('A contact name is required before creating a person.')
  }

  const prisma = getPrismaClient()
  const id = await getNextPersonId()
  const tags = cleanTagList(input.tags)
  const address = parseAddress(input.address)
  const now = new Date()

  const person = await prisma.person.create({
    data: {
      id,
      name,
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
        PRISMA_CONTACT_CHANNEL.EMAIL,
      ),
      profileType: inferProfileType(tags),
      tags,
      createdAt: now,
      updatedAt: now,
    },
  })

  return mapPrismaPersonToDomainPerson(person)
}
