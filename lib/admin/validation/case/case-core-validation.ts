import { z } from 'zod'

import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import type {
  AddCaseNoteInput,
  LogCaseInteractionInput,
  UpdateCaseManagementInput,
  UpdateCaseStatusInput,
} from '@/lib/admin/case-write-service'
import {
  caseIdSchema,
  caseStatusValues,
  caseTypeValues,
  contactChannelValues,
  createCasePrioritySchema,
  interactionDirectionValues,
  nullableIdSchema,
  optionalCasePrioritySchema,
  optionalCaseStatusSchema,
  optionalEmail,
  optionalIsoDateString,
  optionalTrimmedString,
  requiredTrimmedString,
} from './case-validation-values'

const createIncomingCaseInputSchema = z.object({
  channel: z.enum(contactChannelValues),
  person: z.object({
    id: optionalTrimmedString,
    name: requiredTrimmedString('Contact name'),
    email: optionalEmail,
    phone: optionalTrimmedString,
    address: optionalTrimmedString,
  }),
  petId: nullableIdSchema,
  petName: optionalTrimmedString,
  type: z.enum(caseTypeValues),
  subject: requiredTrimmedString('Subject'),
  message: requiredTrimmedString('Message'),
  actionTaken: optionalTrimmedString,
  nextStep: optionalTrimmedString,
  priority: createCasePrioritySchema,
  assignedStaff: optionalTrimmedString,
  assignedStaffId: nullableIdSchema,
  createdAt: optionalIsoDateString,
})

const addCaseNoteInputSchema = z.object({
  caseId: caseIdSchema,
  body: requiredTrimmedString('Note'),
})

const logCaseInteractionInputSchema = z.object({
  caseId: caseIdSchema,
  channel: z.enum(contactChannelValues),
  direction: z.enum(interactionDirectionValues),
  summary: requiredTrimmedString('Summary'),
  actionTaken: optionalTrimmedString.nullable(),
  nextStep: optionalTrimmedString.nullable(),
})

const updateCaseStatusInputSchema = z.object({
  caseId: caseIdSchema,
  status: z.enum(caseStatusValues),
  currentStatus: optionalTrimmedString.nullable(),
  outcome: optionalTrimmedString.nullable(),
})

const updateCaseManagementInputSchema = z.object({
  caseId: caseIdSchema,
  assignedStaffId: nullableIdSchema,
  priority: optionalCasePrioritySchema,
  status: optionalCaseStatusSchema,
  outcome: optionalTrimmedString.nullable(),
  nextFollowUpAt: optionalIsoDateString.nullable(),
  nextFollowUpNote: optionalTrimmedString.nullable(),
})

export const validateCreateIncomingCaseInput = (
  input: CreateIncomingCaseInput,
): CreateIncomingCaseInput => {
  return createIncomingCaseInputSchema.parse(input) as CreateIncomingCaseInput
}

export const validateAddCaseNoteInput = (
  input: AddCaseNoteInput,
): AddCaseNoteInput => {
  return addCaseNoteInputSchema.parse(input) as AddCaseNoteInput
}

export const validateLogCaseInteractionInput = (
  input: LogCaseInteractionInput,
): LogCaseInteractionInput => {
  return logCaseInteractionInputSchema.parse(input) as LogCaseInteractionInput
}

export const validateUpdateCaseStatusInput = (
  input: UpdateCaseStatusInput,
): UpdateCaseStatusInput => {
  return updateCaseStatusInputSchema.parse(input) as UpdateCaseStatusInput
}

export const validateUpdateCaseManagementInput = (
  input: UpdateCaseManagementInput,
): UpdateCaseManagementInput => {
  return updateCaseManagementInputSchema.parse(input) as UpdateCaseManagementInput
}
