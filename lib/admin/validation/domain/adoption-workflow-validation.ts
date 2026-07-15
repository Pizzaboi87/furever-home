import { PRISMA_CASE_STATUS } from '@/lib/admin/case-write/case-write-support'
import type { RunAdoptionWorkflowInput } from '@/lib/admin/case-write/case-write-types'
import { assertPetCanContinueAdoptionWorkflow } from './pet-domain-validation'

const CLOSED_WORKFLOW_STATUSES = new Set<string>([
  PRISMA_CASE_STATUS.COMPLETED,
  PRISMA_CASE_STATUS.CLOSED,
  PRISMA_CASE_STATUS.DECLINED,
  PRISMA_CASE_STATUS.CANCELLED,
  PRISMA_CASE_STATUS.REJECTED,
  PRISMA_CASE_STATUS.NO_RESPONSE,
])

type AdoptionWorkflowContext = {
  status: string
  petId: string | null
  pet: {
    id: string
    status: string
  } | null
  adoptionApplication: {
    petId: string
  } | null
}

const ADOPTION_WORKFLOW_ACTIONS = [
  'schedule_meet_and_greet',
  'approve_application',
  'decline_application',
  'complete_adoption',
] as const

type AdoptionWorkflowAction = (typeof ADOPTION_WORKFLOW_ACTIONS)[number]

const isAdoptionWorkflowAction = (value: string): value is AdoptionWorkflowAction => {
  return ADOPTION_WORKFLOW_ACTIONS.includes(value as AdoptionWorkflowAction)
}

export const validateAdoptionWorkflowTransition = ({
  input,
  context,
  resolvedPetId,
}: {
  input: RunAdoptionWorkflowInput
  context: AdoptionWorkflowContext
  resolvedPetId: string | null
}) => {
  if (!isAdoptionWorkflowAction(input.action)) {
    throw new Error('Unsupported adoption workflow action.')
  }

  if (!context.adoptionApplication) {
    throw new Error('This case does not have an adoption application workflow.')
  }

  if (!resolvedPetId) {
    throw new Error('An adoption workflow requires a related pet.')
  }

  if (resolvedPetId !== context.adoptionApplication.petId) {
    throw new Error('The selected pet does not match this adoption application.')
  }

  if (!context.pet || context.pet.id !== resolvedPetId) {
    throw new Error('The related pet could not be loaded for this adoption workflow.')
  }

  if (CLOSED_WORKFLOW_STATUSES.has(context.status)) {
    throw new Error('A completed or closed adoption workflow cannot be changed.')
  }

  if (
    input.action === 'complete_adoption' &&
    context.status !== PRISMA_CASE_STATUS.APPROVED
  ) {
    throw new Error('The adoption application must be approved before completion.')
  }

  assertPetCanContinueAdoptionWorkflow(context.pet, input.action)
}
