import { z } from "zod";

const nullableOptionalStringSchema = z.string().nullable().optional();
const optionalDateStringSchema = z.string().min(1).optional();
const nullableOptionalNumberSchema = z.number().finite().nullable().optional();
const nullableOptionalBooleanSchema = z.boolean().nullable().optional();

const rawDashboardRecordSchema = z.record(z.string(), z.unknown());

const rawAddressSchema = z
  .object({
    line1: nullableOptionalStringSchema,
    line2: nullableOptionalStringSchema,
    city: nullableOptionalStringSchema,
    state: nullableOptionalStringSchema,
    zip: nullableOptionalStringSchema,
    country: nullableOptionalStringSchema,
  })
  .passthrough();

const rawPetSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    species: z.string().min(1),
    description: z.string(),
    age: z.number().finite().nonnegative(),
    gender: z.string().min(1),
    weight: z.number().finite().nonnegative(),
    image: z.string().min(1),
    status: z.string().min(1),
    size: z.string().optional(),
    neutered: z.boolean().optional(),
    goodWithChildren: z.boolean().optional(),
    goodWithOtherAnimals: z.boolean().optional(),
    ageGroup: z.string().optional(),
    daysInShelter: z.number().int().nonnegative().optional(),
    lastUpdated: z.string().optional(),
  })
  .passthrough();

const rawStaffSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.email(),
    active: z.boolean().optional(),
  })
  .passthrough();

const rawPersonSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().nullable().optional(),
    phone: nullableOptionalStringSchema,
    address: z.union([z.string(), rawAddressSchema]).nullable().optional(),
    preferredContactMethod: nullableOptionalStringSchema,
    tags: z.array(z.string()).optional(),
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
  })
  .passthrough();

const rawShelterEventSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.string().min(1),
    date: z.string().min(1),
    location: nullableOptionalStringSchema,
    notes: nullableOptionalStringSchema,
    createdAt: optionalDateStringSchema,
  })
  .passthrough();

const rawShelterCaseSchema = z
  .object({
    id: z.string().min(1),
    caseNumber: nullableOptionalStringSchema,
    type: z.string().min(1),
    scope: z.string().min(1),
    status: z.string().min(1),
    priority: z.string().min(1),
    source: nullableOptionalStringSchema,
    personId: z.string().min(1),
    petId: nullableOptionalStringSchema,
    relatedPetId: nullableOptionalStringSchema,
    relatedEventId: nullableOptionalStringSchema,
    relatedDonationId: nullableOptionalStringSchema,
    subject: z.string().min(1),
    summary: nullableOptionalStringSchema,
    assignedStaffId: nullableOptionalStringSchema,
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
    closedAt: nullableOptionalStringSchema,
    outcome: nullableOptionalStringSchema,
    nextFollowUpAt: nullableOptionalStringSchema,
    nextFollowUpNote: nullableOptionalStringSchema,
    tags: z.array(z.string()).optional(),
  })
  .passthrough();

const rawCaseInteractionSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    channel: z.string().min(1),
    direction: z.string().min(1),
    occurredAt: optionalDateStringSchema,
    loggedAt: optionalDateStringSchema,
    loggedByStaffId: nullableOptionalStringSchema,
    contactPersonId: nullableOptionalStringSchema,
    contactPoint: nullableOptionalStringSchema,
    externalReference: z
      .object({
        system: nullableOptionalStringSchema,
        type: nullableOptionalStringSchema,
        reference: nullableOptionalStringSchema,
      })
      .passthrough()
      .nullable()
      .optional(),
    summary: z.string().min(1),
    actionTaken: nullableOptionalStringSchema,
    nextStep: nullableOptionalStringSchema,
    visibility: nullableOptionalStringSchema,
  })
  .passthrough();

const rawCaseNoteSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    staffId: nullableOptionalStringSchema,
    body: z.string().min(1),
    createdAt: optionalDateStringSchema,
    tags: z.array(z.string()).optional(),
    visibility: nullableOptionalStringSchema,
  })
  .passthrough();

const rawCaseEventSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    type: z.string().min(1),
    title: z.string().min(1),
    detail: nullableOptionalStringSchema,
    createdAt: optionalDateStringSchema,
    actorType: nullableOptionalStringSchema,
    actorId: nullableOptionalStringSchema,
    actorName: nullableOptionalStringSchema,
    actorRole: nullableOptionalStringSchema,
  })
  .passthrough();

const rawActivityEventSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().min(1),
    title: z.string().min(1),
    detail: z.string(),
    createdAt: optionalDateStringSchema,
    petId: nullableOptionalStringSchema,
    caseId: nullableOptionalStringSchema,
    personId: nullableOptionalStringSchema,
    actorId: nullableOptionalStringSchema,
    actorName: nullableOptionalStringSchema,
    actorRole: nullableOptionalStringSchema,
  })
  .passthrough();

const rawAdoptionApplicationSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    personId: z.string().min(1),
    petId: z.string().min(1),
    sourceApplicationId: nullableOptionalStringSchema,
    status: z.string().min(1),
    householdType: nullableOptionalStringSchema,
    hasOtherPets: nullableOptionalBooleanSchema,
    hasChildren: nullableOptionalBooleanSchema,
    housingType: nullableOptionalStringSchema,
    landlordApproval: nullableOptionalStringSchema,
    experienceLevel: nullableOptionalStringSchema,
    score: nullableOptionalNumberSchema,
    screeningNote: nullableOptionalStringSchema,
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
  })
  .passthrough();

const rawVirtualAdoptionSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    personId: z.string().min(1),
    petId: z.string().min(1),
    status: z.string().min(1),
    frequency: z.string().min(1),
    amount: nullableOptionalNumberSchema,
    currency: nullableOptionalStringSchema,
    sponsorUpdateRequested: nullableOptionalBooleanSchema,
    certificateSent: nullableOptionalBooleanSchema,
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
  })
  .passthrough();

const rawDonationInquirySchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    personId: z.string().min(1),
    donationId: nullableOptionalStringSchema,
    inquiryType: z.string().min(1),
    status: z.string().min(1),
    amount: nullableOptionalNumberSchema,
    currency: nullableOptionalStringSchema,
    frequency: nullableOptionalStringSchema,
    receiptRequested: nullableOptionalBooleanSchema,
    thankYouSent: nullableOptionalBooleanSchema,
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
  })
  .passthrough();

const rawVolunteerApplicationSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    personId: z.string().min(1),
    status: z.string().min(1),
    interestAreas: z.array(z.string()).optional(),
    availability: nullableOptionalStringSchema,
    experience: nullableOptionalStringSchema,
    backgroundCheckStatus: nullableOptionalStringSchema,
    orientationScheduledAt: nullableOptionalStringSchema,
    orientationCompleted: nullableOptionalBooleanSchema,
    assignedRole: nullableOptionalStringSchema,
    createdAt: optionalDateStringSchema,
    updatedAt: optionalDateStringSchema,
  })
  .passthrough();

export const petsFileSchema = z
  .object({
    pets: z.array(rawPetSchema),
  })
  .passthrough();

export const adminDashboardFileSchema = z
  .object({
    metadata: rawDashboardRecordSchema.optional(),
    animalIntakes: z.array(rawDashboardRecordSchema).optional(),
    adoptions: z.array(rawDashboardRecordSchema).optional(),
    applications: z.array(rawDashboardRecordSchema).optional(),
    donations: z.array(rawDashboardRecordSchema).optional(),
    volunteerHours: z.array(rawDashboardRecordSchema).optional(),
    dailySummaries: z.array(rawDashboardRecordSchema).optional(),
    monthlySummaries: z.array(rawDashboardRecordSchema).optional(),
    speciesMonthlySummaries: z.array(rawDashboardRecordSchema).optional(),
    petStatusEvents: z.array(rawDashboardRecordSchema).optional(),
    monthlyPetSnapshots: z.array(rawDashboardRecordSchema).optional(),
    staff: z.array(rawStaffSchema).optional(),
    people: z.array(rawPersonSchema).optional(),
    shelterEvents: z.array(rawShelterEventSchema).optional(),
    cases: z.array(rawShelterCaseSchema).optional(),
    caseInteractions: z.array(rawCaseInteractionSchema).optional(),
    caseNotes: z.array(rawCaseNoteSchema).optional(),
    caseEvents: z.array(rawCaseEventSchema).optional(),
    activityEvents: z.array(rawActivityEventSchema).optional(),
    adoptionApplications: z.array(rawAdoptionApplicationSchema).optional(),
    virtualAdoptions: z.array(rawVirtualAdoptionSchema).optional(),
    donationInquiries: z.array(rawDonationInquirySchema).optional(),
    volunteerApplications: z.array(rawVolunteerApplicationSchema).optional(),
  })
  .passthrough();
