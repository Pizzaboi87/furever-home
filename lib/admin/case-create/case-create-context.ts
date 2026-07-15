import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import { getNextCaseId, getNextPersonId } from '@/lib/admin/common/id-generators'
import { getPrismaClient } from '@/lib/server/prisma'
import { assertPetCanReceiveOpenCase } from '@/lib/admin/validation/domain/pet-domain-validation'

import {
  inferProfileTypeForNewCasePerson,
  optionalString,
  parseAddress,
  requiredString,
  toPrismaContactChannel,
} from './case-create-normalizers'

export const getNextPrismaCaseId = async (createdAt: string) => {
  const prisma = getPrismaClient()
  const cases: Array<{ id: string; caseNumber: string | null }> =
    await prisma.shelterCase.findMany({
      select: {
        id: true,
        caseNumber: true,
      },
    })

  return getNextCaseId(
    cases.flatMap((item) =>
      [item.id, item.caseNumber].filter(
        (value): value is string => Boolean(value),
      ),
    ),
    createdAt,
  )
}

const getNextPrismaPersonId = async () => {
  const prisma = getPrismaClient()
  const people: Array<{ id: string }> = await prisma.person.findMany({
    select: {
      id: true,
    },
  })

  return getNextPersonId(people.map((item) => item.id))
}

export const getAssignedStaffId = async (
  assignedStaff: string | null | undefined,
) => {
  if (!assignedStaff) {
    return null
  }

  const prisma = getPrismaClient()
  const staff = await prisma.staffUser.findFirst({
    where: {
      name: assignedStaff,
      active: true,
    },
    select: {
      id: true,
    },
  })

  return staff?.id ?? null
}

export const createOrResolvePersonId = async (
  input: CreateIncomingCaseInput,
) => {
  const prisma = getPrismaClient()

  if (input.person.id) {
    const existingPerson = await prisma.person.findUnique({
      where: {
        id: input.person.id,
      },
      select: {
        id: true,
      },
    })

    if (!existingPerson) {
      throw new Error('The selected contact no longer exists.')
    }

    return existingPerson.id
  }

  const name = requiredString(input.person.name, 'Contact name')
  const address = parseAddress(input.person.address)
  const id = await getNextPrismaPersonId()
  const now = input.createdAt ? new Date(input.createdAt) : new Date()

  const person = await prisma.person.create({
    data: {
      id,
      name,
      email: optionalString(input.person.email),
      phone: optionalString(input.person.phone),
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      preferredContactMethod: toPrismaContactChannel(input.channel),
      profileType: inferProfileTypeForNewCasePerson(input),
      tags: ['case_contact'],
      createdAt: now,
      updatedAt: now,
    },
    select: {
      id: true,
    },
  })

  return person.id
}

export const assertRelatedPetExists = async (
  petId: string | null | undefined,
) => {
  if (!petId) {
    return null
  }

  const prisma = getPrismaClient()
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
    select: {
      id: true,
      status: true,
    },
  })

  if (!pet) {
    throw new Error('The selected pet no longer exists.')
  }

  assertPetCanReceiveOpenCase(pet)

  return pet.id
}
