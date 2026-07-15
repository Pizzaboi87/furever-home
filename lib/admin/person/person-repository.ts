import { getPrismaClient } from '@/lib/server/prisma'

import type { Person } from '../domain'
import type { PrismaPersonRecord } from './person-types'
import {
  isAnonymizedPersonRecord,
  mapPrismaPersonToDomainPerson,
} from './person-utils'

export const getAdminPeopleFromPrisma = async (): Promise<Person[]> => {
  const prisma = getPrismaClient()
  const people = await prisma.person.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  })

  return people
    .filter((person: PrismaPersonRecord) => !isAnonymizedPersonRecord(person))
    .map((person: PrismaPersonRecord) => mapPrismaPersonToDomainPerson(person))
}

export const getAdminPersonByIdFromPrisma = async (
  personId: string,
): Promise<Person | undefined> => {
  const prisma = getPrismaClient()
  const person = await prisma.person.findUnique({
    where: {
      id: personId,
    },
  })

  if (!person || isAnonymizedPersonRecord(person as PrismaPersonRecord)) {
    return undefined
  }

  return mapPrismaPersonToDomainPerson(person as PrismaPersonRecord)
}
