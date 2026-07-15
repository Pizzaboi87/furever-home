import type { RawShelterCase } from "../seed-types";
import { normalizeValue, toDate, toNullableDate } from "./common-normalizers";

export const PRISMA_CASE_TYPE = {
  GENERAL_QUESTION: "GENERAL_QUESTION",
  PET_QUESTION: "PET_QUESTION",
  ADOPTION_APPLICATION: "ADOPTION_APPLICATION",
  VIRTUAL_ADOPTION: "VIRTUAL_ADOPTION",
  DONATION_SUPPORT: "DONATION_SUPPORT",
  VOLUNTEER_APPLICATION: "VOLUNTEER_APPLICATION",
  EVENT_FOLLOWUP: "EVENT_FOLLOWUP",
  SURRENDER_REQUEST: "SURRENDER_REQUEST",
  LOST_AND_FOUND: "LOST_AND_FOUND",
  MEDICAL_UPDATE: "MEDICAL_UPDATE",
  OTHER: "OTHER",
} as const;

export const PRISMA_CASE_SCOPE = {
  PET_RELATED: "PET_RELATED",
  GENERAL: "GENERAL",
} as const;

export const PRISMA_CASE_STATUS = {
  NEW: "NEW",
  OPEN: "OPEN",
  WAITING_ON_CONTACT: "WAITING_ON_CONTACT",
  WAITING_ON_STAFF: "WAITING_ON_STAFF",
  SCREENING: "SCREENING",
  SCHEDULED: "SCHEDULED",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  NO_RESPONSE: "NO_RESPONSE",
} as const;

export const PRISMA_CASE_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export const PRISMA_INTERACTION_DIRECTION = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
  INTERNAL: "INTERNAL",
} as const;

export const PRISMA_REFERENCE_SYSTEM = {
  EMAIL_CLIENT: "EMAIL_CLIENT",
  CALL_RECORDING: "CALL_RECORDING",
  WEBSITE: "WEBSITE",
  MANUAL: "MANUAL",
  EVENT_SIGNUP: "EVENT_SIGNUP",
  STRIPE: "STRIPE",
  SENDER_COM: "SENDER_COM",
} as const;

export const PRISMA_REFERENCE_TYPE = {
  EMAIL: "EMAIL",
  CALL: "CALL",
  FORM_SUBMISSION: "FORM_SUBMISSION",
  CONVERSATION: "CONVERSATION",
  MANUAL_NOTE: "MANUAL_NOTE",
  PAYMENT: "PAYMENT",
  SUBSCRIBER_EVENT: "SUBSCRIBER_EVENT",
} as const;

export const PRISMA_CASE_EVENT_ACTOR_TYPE = {
  SYSTEM: "SYSTEM",
  STAFF: "STAFF",
  CONTACT: "CONTACT",
  APPLICANT: "APPLICANT",
  VOLUNTEER: "VOLUNTEER",
  DONOR: "DONOR",
} as const;

export const toPrismaCaseType = (value: string) => {
  switch (normalizeValue(value)) {
    case "pet_question":
    case "question":
      return PRISMA_CASE_TYPE.PET_QUESTION;
    case "adoption_application":
    case "adoption_interest":
      return PRISMA_CASE_TYPE.ADOPTION_APPLICATION;
    case "virtual_adoption":
      return PRISMA_CASE_TYPE.VIRTUAL_ADOPTION;
    case "donation_support":
    case "donation":
      return PRISMA_CASE_TYPE.DONATION_SUPPORT;
    case "volunteer_application":
    case "volunteer":
      return PRISMA_CASE_TYPE.VOLUNTEER_APPLICATION;
    case "event_followup":
      return PRISMA_CASE_TYPE.EVENT_FOLLOWUP;
    case "surrender_request":
      return PRISMA_CASE_TYPE.SURRENDER_REQUEST;
    case "lost_and_found":
      return PRISMA_CASE_TYPE.LOST_AND_FOUND;
    case "medical_update":
      return PRISMA_CASE_TYPE.MEDICAL_UPDATE;
    case "other":
      return PRISMA_CASE_TYPE.OTHER;
    case "general_question":
    case "general":
    default:
      return PRISMA_CASE_TYPE.GENERAL_QUESTION;
  }
};

export const toPrismaCaseScope = (value: string) => {
  return normalizeValue(value) === "pet_related"
    ? PRISMA_CASE_SCOPE.PET_RELATED
    : PRISMA_CASE_SCOPE.GENERAL;
};

export const toPrismaCaseStatus = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "open":
      return PRISMA_CASE_STATUS.OPEN;
    case "waiting_on_contact":
    case "waiting_reply":
      return PRISMA_CASE_STATUS.WAITING_ON_CONTACT;
    case "waiting_on_staff":
      return PRISMA_CASE_STATUS.WAITING_ON_STAFF;
    case "screening":
    case "in_review":
      return PRISMA_CASE_STATUS.SCREENING;
    case "scheduled":
      return PRISMA_CASE_STATUS.SCHEDULED;
    case "approved":
      return PRISMA_CASE_STATUS.APPROVED;
    case "declined":
      return PRISMA_CASE_STATUS.DECLINED;
    case "completed":
      return PRISMA_CASE_STATUS.COMPLETED;
    case "closed":
      return PRISMA_CASE_STATUS.CLOSED;
    case "cancelled":
    case "canceled":
      return PRISMA_CASE_STATUS.CANCELLED;
    case "rejected":
      return PRISMA_CASE_STATUS.REJECTED;
    case "no_response":
      return PRISMA_CASE_STATUS.NO_RESPONSE;
    case "new":
    default:
      return PRISMA_CASE_STATUS.NEW;
  }
};

export const toPrismaCasePriority = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "low":
      return PRISMA_CASE_PRIORITY.LOW;
    case "high":
      return PRISMA_CASE_PRIORITY.HIGH;
    case "medium":
    default:
      return PRISMA_CASE_PRIORITY.MEDIUM;
  }
};

export type PrismaCaseStatusValue =
  (typeof PRISMA_CASE_STATUS)[keyof typeof PRISMA_CASE_STATUS];

export const CLOSED_PRISMA_CASE_STATUSES = new Set<PrismaCaseStatusValue>([
  PRISMA_CASE_STATUS.COMPLETED,
  PRISMA_CASE_STATUS.CLOSED,
  PRISMA_CASE_STATUS.DECLINED,
  PRISMA_CASE_STATUS.CANCELLED,
  PRISMA_CASE_STATUS.REJECTED,
  PRISMA_CASE_STATUS.NO_RESPONSE,
]);

export const HISTORICAL_PET_CASE_OUTCOME =
  "Closed during seed because the related pet is a historical shelter record and is no longer available. Applicant notified; pet no longer available.";

export const isClosedPrismaCaseStatus = (status: PrismaCaseStatusValue) => {
  return CLOSED_PRISMA_CASE_STATUSES.has(status);
};

export const getHistoricalCaseClosedAt = (shelterCase: RawShelterCase) => {
  return (
    toNullableDate(shelterCase.closedAt) ??
    toDate(shelterCase.updatedAt) ??
    toDate(shelterCase.createdAt) ??
    new Date()
  );
};

export const resolveSeedShelterCaseState = (
  shelterCase: RawShelterCase,
  validPetIds: Set<string>,
  currentPetIds: Set<string>,
) => {
  const rawPetId = shelterCase.petId ?? shelterCase.relatedPetId ?? null;
  const petId = rawPetId && validPetIds.has(rawPetId) ? rawPetId : null;
  const originalStatus = toPrismaCaseStatus(shelterCase.status);
  const isHistoricalPetCase = Boolean(petId && !currentPetIds.has(petId));

  if (!isHistoricalPetCase) {
    return {
      petId,
      status: originalStatus,
      outcome: shelterCase.outcome ?? null,
      nextFollowUpAt: toNullableDate(shelterCase.nextFollowUpAt),
      closedAt: toNullableDate(shelterCase.closedAt),
    };
  }

  return {
    petId,
    status: isClosedPrismaCaseStatus(originalStatus)
      ? originalStatus
      : PRISMA_CASE_STATUS.CLOSED,
    outcome: shelterCase.outcome ?? HISTORICAL_PET_CASE_OUTCOME,
    nextFollowUpAt: null,
    closedAt: getHistoricalCaseClosedAt(shelterCase),
  };
};

export const toPrismaInteractionDirection = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "outbound":
      return PRISMA_INTERACTION_DIRECTION.OUTBOUND;
    case "internal":
      return PRISMA_INTERACTION_DIRECTION.INTERNAL;
    case "inbound":
    default:
      return PRISMA_INTERACTION_DIRECTION.INBOUND;
  }
};

export const toPrismaReferenceSystem = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "email_client":
      return PRISMA_REFERENCE_SYSTEM.EMAIL_CLIENT;
    case "call_recording":
      return PRISMA_REFERENCE_SYSTEM.CALL_RECORDING;
    case "website":
      return PRISMA_REFERENCE_SYSTEM.WEBSITE;
    case "event_signup":
      return PRISMA_REFERENCE_SYSTEM.EVENT_SIGNUP;
    case "stripe":
      return PRISMA_REFERENCE_SYSTEM.STRIPE;
    case "sender_com":
      return PRISMA_REFERENCE_SYSTEM.SENDER_COM;
    case "manual":
      return PRISMA_REFERENCE_SYSTEM.MANUAL;
    default:
      return null;
  }
};

export const toPrismaReferenceType = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "email":
      return PRISMA_REFERENCE_TYPE.EMAIL;
    case "call":
      return PRISMA_REFERENCE_TYPE.CALL;
    case "form_submission":
      return PRISMA_REFERENCE_TYPE.FORM_SUBMISSION;
    case "conversation":
      return PRISMA_REFERENCE_TYPE.CONVERSATION;
    case "payment":
      return PRISMA_REFERENCE_TYPE.PAYMENT;
    case "subscriber_event":
      return PRISMA_REFERENCE_TYPE.SUBSCRIBER_EVENT;
    case "manual_note":
      return PRISMA_REFERENCE_TYPE.MANUAL_NOTE;
    default:
      return null;
  }
};

export const toPrismaCaseEventActorType = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "staff":
      return PRISMA_CASE_EVENT_ACTOR_TYPE.STAFF;
    case "contact":
      return PRISMA_CASE_EVENT_ACTOR_TYPE.CONTACT;
    case "applicant":
      return PRISMA_CASE_EVENT_ACTOR_TYPE.APPLICANT;
    case "volunteer":
      return PRISMA_CASE_EVENT_ACTOR_TYPE.VOLUNTEER;
    case "donor":
      return PRISMA_CASE_EVENT_ACTOR_TYPE.DONOR;
    case "system":
    default:
      return PRISMA_CASE_EVENT_ACTOR_TYPE.SYSTEM;
  }
};

