'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { ADMIN_CACHE_TAG_LIST } from '@/lib/admin/cache-tags'
import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import {
  validateAddCaseNoteInput,
  validateCreateIncomingCaseInput,
  validateLogCaseInteractionInput,
  validateRunAdoptionWorkflowInput,
  validateUpdateAdoptionApplicationInput,
  validateUpdateCaseManagementInput,
  validateUpdateCaseStatusInput,
  validateUpdateDonationInquiryInput,
  validateUpdateVirtualAdoptionInput,
  validateUpdateVolunteerApplicationInput,
} from '@/lib/admin/case-validation'
import {
  addCaseNoteWithGraphQL,
  createCaseWithGraphQL,
  logCaseInteractionWithGraphQL,
  runAdoptionWorkflowWithGraphQL,
  updateAdoptionApplicationWithGraphQL,
  updateCaseManagementWithGraphQL,
  updateCaseStatusWithGraphQL,
  updateDonationInquiryWithGraphQL,
  updateVirtualAdoptionWithGraphQL,
  updateVolunteerApplicationWithGraphQL,
} from '@/lib/graphql/admin-mutations'

type CreatedCaseActionResult = {
  case: {
    id: string
    petId?: string | null
  }
  person: {
    id: string
  }
}

const invalidateAdminReadCache = () => {
  for (const tag of ADMIN_CACHE_TAG_LIST) {
    updateTag(tag)
  }
}

const revalidateCreatedCaseRoutes = ({
  caseId,
  personId,
  petId,
}: {
  caseId: string
  personId: string
  petId: string | null
}) => {
  invalidateAdminReadCache()
  revalidatePath('/admin/cases')
  revalidatePath(`/admin/cases/${caseId}`)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/tasks')
  revalidatePath('/admin/cases/new')
  revalidatePath('/admin/people')
  revalidatePath(`/admin/people/${personId}`)

  if (petId) {
    revalidatePath('/admin/pets')
    revalidatePath(`/admin/pets/${petId}`)
  }
}

const revalidateCaseRoutes = ({
  caseId,
  personId,
  petId,
}: {
  caseId: string
  personId?: string | null
  petId?: string | null
}) => {
  invalidateAdminReadCache()
  revalidatePath(`/admin/cases/${caseId}`)
  revalidatePath('/admin/cases')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/tasks')

  if (personId) {
    revalidatePath('/admin/people')
    revalidatePath(`/admin/people/${personId}`)
  }

  if (petId) {
    revalidatePath('/admin/pets')
    revalidatePath(`/admin/pets/${petId}`)
    revalidatePath('/')
    revalidatePath('/browse')
    revalidatePath(`/pets/${petId}`)
  }
}

const revalidateIfChanged = (result: {
  caseId: string
  personId: string | null
  petId: string | null
} | null) => {
  if (!result) {
    return
  }

  revalidateCaseRoutes(result)
}

const formString = (formData: FormData, key: string, fallback = '') => {
  return String(formData.get(key) ?? fallback)
}

const formStringArray = (formData: FormData, key: string) => {
  return formString(formData, key)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const formBoolean = (formData: FormData, key: string) => {
  return formData.get(key) === 'on'
}

export async function createCaseAction(
  input: CreateIncomingCaseInput,
): Promise<CreatedCaseActionResult> {
  const validatedInput = validateCreateIncomingCaseInput(input)
  const created = await createCaseWithGraphQL(validatedInput)

  revalidateCreatedCaseRoutes({
    caseId: created.case.id,
    personId: created.person.id,
    petId: created.case.petId ?? null,
  })

  return created
}

export async function addInternalNoteAction(caseId: string, formData: FormData) {
  const result = await addCaseNoteWithGraphQL(validateAddCaseNoteInput({
    caseId,
    body: formString(formData, 'body'),
  }))

  revalidateIfChanged(result)
}

export async function addInteractionLogAction(caseId: string, formData: FormData) {
  const result = await logCaseInteractionWithGraphQL(validateLogCaseInteractionInput({
    caseId,
    channel: formString(formData, 'channel', 'internal'),
    direction: formString(formData, 'direction', 'internal'),
    summary: formString(formData, 'summary'),
    actionTaken: formString(formData, 'actionTaken'),
    nextStep: formString(formData, 'nextStep'),
  }))

  revalidateIfChanged(result)
}

export async function updateCaseStatusAction(caseId: string, formData: FormData) {
  const result = await updateCaseStatusWithGraphQL(validateUpdateCaseStatusInput({
    caseId,
    status: formString(formData, 'status'),
    currentStatus: formString(formData, 'currentStatus'),
    outcome: formString(formData, 'outcome'),
  }))

  revalidateIfChanged(result)
}

export async function updateCaseManagementAction(caseId: string, formData: FormData) {
  const result = await updateCaseManagementWithGraphQL(validateUpdateCaseManagementInput({
    caseId,
    assignedStaffId: formString(formData, 'assignedStaffId'),
    priority: formString(formData, 'priority'),
    status: formString(formData, 'status'),
    outcome: formString(formData, 'outcome'),
    nextFollowUpAt: formString(formData, 'nextFollowUpAt'),
    nextFollowUpNote: formString(formData, 'nextFollowUpNote'),
  }))

  revalidateIfChanged(result)
}

export async function updateDonationInquiryAction(caseId: string, formData: FormData) {
  const result = await updateDonationInquiryWithGraphQL(validateUpdateDonationInquiryInput({
    caseId,
    donationId: formString(formData, 'donationId'),
    inquiryType: formString(formData, 'inquiryType'),
    status: formString(formData, 'status'),
    amount: formString(formData, 'amount'),
    currency: formString(formData, 'currency'),
    frequency: formString(formData, 'frequency'),
    receiptRequested: formBoolean(formData, 'receiptRequested'),
    thankYouSent: formBoolean(formData, 'thankYouSent'),
  }))

  revalidateIfChanged(result)
}

export async function updateVirtualAdoptionAction(caseId: string, formData: FormData) {
  const result = await updateVirtualAdoptionWithGraphQL(validateUpdateVirtualAdoptionInput({
    caseId,
    status: formString(formData, 'status'),
    amount: formString(formData, 'amount'),
    currency: formString(formData, 'currency'),
    frequency: formString(formData, 'frequency'),
    sponsorUpdateRequested: formBoolean(formData, 'sponsorUpdateRequested'),
    certificateSent: formBoolean(formData, 'certificateSent'),
  }))

  revalidateIfChanged(result)
}

export async function updateVolunteerApplicationAction(
  caseId: string,
  formData: FormData,
) {
  const result = await updateVolunteerApplicationWithGraphQL(validateUpdateVolunteerApplicationInput({
    caseId,
    status: formString(formData, 'status'),
    interestAreas: formStringArray(formData, 'interestAreas'),
    availability: formString(formData, 'availability'),
    experience: formString(formData, 'experience'),
    backgroundCheckStatus: formString(formData, 'backgroundCheckStatus'),
    orientationScheduledAt: formString(formData, 'orientationScheduledAt'),
    orientationCompleted: formBoolean(formData, 'orientationCompleted'),
    assignedRole: formString(formData, 'assignedRole'),
    volunteerHoursDate: formString(formData, 'volunteerHoursDate'),
    volunteerHours: formString(formData, 'volunteerHours'),
    volunteerHoursActivity: formString(formData, 'volunteerHoursActivity'),
  }))

  revalidateIfChanged(result)
}

export async function updateAdoptionApplicationAction(
  caseId: string,
  formData: FormData,
) {
  const result = await updateAdoptionApplicationWithGraphQL(validateUpdateAdoptionApplicationInput({
    caseId,
    status: formString(formData, 'status'),
    score: formString(formData, 'score'),
    householdType: formString(formData, 'householdType'),
    hasOtherPets: formBoolean(formData, 'hasOtherPets'),
    hasChildren: formBoolean(formData, 'hasChildren'),
    housingType: formString(formData, 'housingType'),
    landlordApproval: formString(formData, 'landlordApproval'),
    experienceLevel: formString(formData, 'experienceLevel'),
    screeningNote: formString(formData, 'screeningNote'),
  }))

  revalidateIfChanged(result)
}

export async function runAdoptionWorkflowAction(caseId: string, formData: FormData) {
  const result = await runAdoptionWorkflowWithGraphQL(validateRunAdoptionWorkflowInput({
    caseId,
    action: formString(formData, 'action'),
    petId: formString(formData, 'petId'),
    note: formString(formData, 'note'),
  }))

  revalidateIfChanged(result)
}
