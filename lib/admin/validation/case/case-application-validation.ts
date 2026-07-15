import { z } from 'zod'

import type {
  RunAdoptionWorkflowInput,
  UpdateAdoptionApplicationInput,
  UpdateDonationInquiryInput,
  UpdateVirtualAdoptionInput,
  UpdateVolunteerApplicationInput,
} from '@/lib/admin/case-write-service'
import {
  adoptionWorkflowActionValues,
  caseIdSchema,
  nullableIdSchema,
  optionalCaseStatusSchema,
  optionalIsoDateString,
  optionalNonNegativeNumericString,
  optionalTrimmedString,
  requiredTrimmedString,
} from './case-validation-values'

const updateDonationInquiryInputSchema = z.object({
  caseId: caseIdSchema,
  donationId: optionalTrimmedString.nullable(),
  inquiryType: optionalTrimmedString.nullable(),
  status: optionalCaseStatusSchema,
  amount: optionalNonNegativeNumericString.nullable(),
  currency: optionalTrimmedString.nullable(),
  frequency: optionalTrimmedString.nullable(),
  receiptRequested: z.boolean().optional().nullable(),
  thankYouSent: z.boolean().optional().nullable(),
})

const updateVirtualAdoptionInputSchema = z.object({
  caseId: caseIdSchema,
  status: optionalTrimmedString.nullable(),
  amount: optionalNonNegativeNumericString.nullable(),
  currency: optionalTrimmedString.nullable(),
  frequency: optionalTrimmedString.nullable(),
  sponsorUpdateRequested: z.boolean().optional().nullable(),
  certificateSent: z.boolean().optional().nullable(),
})

const updateVolunteerApplicationInputSchema = z.object({
  caseId: caseIdSchema,
  status: optionalTrimmedString.nullable(),
  interestAreas: z.array(requiredTrimmedString('Interest area')).optional().nullable(),
  availability: optionalTrimmedString.nullable(),
  experience: optionalTrimmedString.nullable(),
  backgroundCheckStatus: optionalTrimmedString.nullable(),
  orientationScheduledAt: optionalIsoDateString.nullable(),
  orientationCompleted: z.boolean().optional().nullable(),
  assignedRole: optionalTrimmedString.nullable(),
  volunteerHoursDate: optionalIsoDateString.nullable(),
  volunteerHours: optionalNonNegativeNumericString.nullable(),
  volunteerHoursActivity: optionalTrimmedString.nullable(),
})

const updateAdoptionApplicationInputSchema = z.object({
  caseId: caseIdSchema,
  status: optionalCaseStatusSchema,
  score: optionalNonNegativeNumericString.nullable(),
  householdType: optionalTrimmedString.nullable(),
  hasOtherPets: z.boolean().optional().nullable(),
  hasChildren: z.boolean().optional().nullable(),
  housingType: optionalTrimmedString.nullable(),
  landlordApproval: optionalTrimmedString.nullable(),
  experienceLevel: optionalTrimmedString.nullable(),
  screeningNote: optionalTrimmedString.nullable(),
})

const runAdoptionWorkflowInputSchema = z.object({
  caseId: caseIdSchema,
  action: z.enum(adoptionWorkflowActionValues),
  petId: nullableIdSchema,
  note: optionalTrimmedString.nullable(),
})

export const validateUpdateDonationInquiryInput = (
  input: UpdateDonationInquiryInput,
): UpdateDonationInquiryInput => {
  return updateDonationInquiryInputSchema.parse(input) as UpdateDonationInquiryInput
}

export const validateUpdateVirtualAdoptionInput = (
  input: UpdateVirtualAdoptionInput,
): UpdateVirtualAdoptionInput => {
  return updateVirtualAdoptionInputSchema.parse(input) as UpdateVirtualAdoptionInput
}

export const validateUpdateVolunteerApplicationInput = (
  input: UpdateVolunteerApplicationInput,
): UpdateVolunteerApplicationInput => {
  return updateVolunteerApplicationInputSchema.parse(input) as UpdateVolunteerApplicationInput
}

export const validateUpdateAdoptionApplicationInput = (
  input: UpdateAdoptionApplicationInput,
): UpdateAdoptionApplicationInput => {
  return updateAdoptionApplicationInputSchema.parse(input) as UpdateAdoptionApplicationInput
}

export const validateRunAdoptionWorkflowInput = (
  input: RunAdoptionWorkflowInput,
): RunAdoptionWorkflowInput => {
  return runAdoptionWorkflowInputSchema.parse(input) as RunAdoptionWorkflowInput
}
