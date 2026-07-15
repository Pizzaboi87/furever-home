'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { ADMIN_CACHE_TAG_LIST } from '@/lib/admin/cache-tags'
import type { AdminPet } from '@/lib/admin/domain'
import { validatePetId, validateCreatePetInput, validateUpdatePetInput } from '@/lib/admin/pet-validation'
import type { CreatePetInput, DeletePetResult, UpdatePetInput } from '@/lib/admin/pet-write-service'
import {
  createPetWithGraphQL,
  deletePetWithGraphQL,
  unpublishPetWithGraphQL,
  updatePetWithGraphQL,
} from '@/lib/graphql/admin-mutations'

export type CreatePetActionInput = CreatePetInput
export type UpdatePetActionInput = UpdatePetInput

const invalidateAdminReadCache = () => {
  for (const tag of ADMIN_CACHE_TAG_LIST) {
    updateTag(tag)
  }
}

const revalidateNewPetPaths = (petId: string) => {
  invalidateAdminReadCache()
  revalidatePath('/admin/pets')
  revalidatePath(`/admin/pets/${petId}`)
  revalidatePath('/admin/cases/new')
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/browse')
  revalidatePath(`/pets/${petId}`)
}

const revalidatePetPaths = (petId: string) => {
  invalidateAdminReadCache()
  revalidatePath('/admin/pets')
  revalidatePath(`/admin/pets/${petId}`)
  revalidatePath('/admin/cases')
  revalidatePath('/admin/cases/new')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/tasks')
  revalidatePath('/')
  revalidatePath('/browse')
  revalidatePath(`/pets/${petId}`)
}

export async function createPetAction(
  input: CreatePetActionInput,
): Promise<AdminPet> {
  const pet = await createPetWithGraphQL(validateCreatePetInput(input))

  revalidateNewPetPaths(pet.id)

  return pet
}

export async function updatePetAction(
  input: UpdatePetActionInput,
): Promise<AdminPet> {
  const pet = await updatePetWithGraphQL(validateUpdatePetInput(input))

  revalidatePetPaths(pet.id)

  return pet
}

export async function unpublishPetAction(petId: string): Promise<AdminPet> {
  const validatedPetId = validatePetId(petId)
  const pet = await unpublishPetWithGraphQL(validatedPetId)

  revalidatePetPaths(pet.id)

  return pet
}

export async function deletePetAction(petId: string): Promise<DeletePetResult> {
  const validatedPetId = validatePetId(petId)
  const result = await deletePetWithGraphQL(validatedPetId)

  revalidatePetPaths(validatedPetId)

  return result
}
