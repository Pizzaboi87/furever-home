'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { ADMIN_CACHE_TAG_LIST } from '@/lib/admin/cache-tags'
import type { Person } from '@/lib/admin/domain'
import {
  validateAnonymizePersonInput,
  validateCreatePersonInput,
  validateUpdatePersonInput,
} from '@/lib/admin/person-validation'
import type {
  AnonymizePersonInput,
  CreatePersonInput,
  UpdatePersonInput,
} from '@/lib/admin/person-write-service'
import {
  anonymizePersonWithGraphQL,
  createPersonWithGraphQL,
  updatePersonWithGraphQL,
} from '@/lib/graphql/admin-mutations'

export type CreatePersonActionInput = CreatePersonInput
export type UpdatePersonActionInput = UpdatePersonInput
export type AnonymizePersonActionInput = AnonymizePersonInput

const invalidateAdminReadCache = () => {
  for (const tag of ADMIN_CACHE_TAG_LIST) {
    updateTag(tag)
  }
}

const revalidateNewPersonPaths = (personId: string) => {
  invalidateAdminReadCache()
  revalidatePath('/admin/people')
  revalidatePath(`/admin/people/${personId}`)
  revalidatePath('/admin/cases/new')
  revalidatePath('/admin/dashboard')
}

const revalidatePersonRoutes = (personId: string) => {
  invalidateAdminReadCache()
  revalidatePath('/admin/people')
  revalidatePath(`/admin/people/${personId}`)
  revalidatePath('/admin/cases')
  revalidatePath('/admin/cases/new')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/tasks')
}

export async function createPersonAction(
  input: CreatePersonActionInput,
): Promise<Person> {
  const validatedInput = validateCreatePersonInput(input)
  const person = await createPersonWithGraphQL(validatedInput)

  revalidateNewPersonPaths(person.id)

  return person
}

export async function updatePersonAction(
  input: UpdatePersonActionInput,
): Promise<Person> {
  const validatedInput = validateUpdatePersonInput(input)
  const person = await updatePersonWithGraphQL(validatedInput)

  revalidatePersonRoutes(validatedInput.personId)

  return person
}

export async function anonymizePersonAction(
  input: AnonymizePersonActionInput,
): Promise<Person> {
  const validatedInput = validateAnonymizePersonInput(input)
  const person = await anonymizePersonWithGraphQL(validatedInput)

  revalidatePersonRoutes(validatedInput.personId)

  return person
}
