import { normalizeValue } from "./common-normalizers";

export const PRISMA_LANDLORD_APPROVAL_STATUS = {
  NOT_NEEDED: "NOT_NEEDED",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
} as const;

export const PRISMA_EXPERIENCE_LEVEL = {
  FIRST_TIME: "FIRST_TIME",
  SOME_EXPERIENCE: "SOME_EXPERIENCE",
  EXPERIENCED: "EXPERIENCED",
} as const;

export const PRISMA_VIRTUAL_ADOPTION_STATUS = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PRISMA_PAYMENT_FREQUENCY = {
  ONE_TIME: "ONE_TIME",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  ANNUAL: "ANNUAL",
} as const;

export const PRISMA_DONATION_INQUIRY_TYPE = {
  RECEIPT_REQUEST: "RECEIPT_REQUEST",
  MONTHLY_DONATION_CHANGE: "MONTHLY_DONATION_CHANGE",
  CORPORATE_DONATION: "CORPORATE_DONATION",
  REFUND_OR_CORRECTION: "REFUND_OR_CORRECTION",
  ALLOCATION_QUESTION: "ALLOCATION_QUESTION",
  EVENT_SPONSORSHIP: "EVENT_SPONSORSHIP",
  OTHER: "OTHER",
} as const;

export const PRISMA_VOLUNTEER_APPLICATION_STATUS = {
  NEW: "NEW",
  SCREENING: "SCREENING",
  ORIENTATION_SCHEDULED: "ORIENTATION_SCHEDULED",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const PRISMA_BACKGROUND_CHECK_STATUS = {
  NOT_REQUIRED: "NOT_REQUIRED",
  PENDING: "PENDING",
  CLEARED: "CLEARED",
  FAILED: "FAILED",
} as const;

export const toPrismaLandlordApproval = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "pending":
      return PRISMA_LANDLORD_APPROVAL_STATUS.PENDING;
    case "confirmed":
      return PRISMA_LANDLORD_APPROVAL_STATUS.CONFIRMED;
    case "rejected":
      return PRISMA_LANDLORD_APPROVAL_STATUS.REJECTED;
    case "not_needed":
    default:
      return PRISMA_LANDLORD_APPROVAL_STATUS.NOT_NEEDED;
  }
};

export const toPrismaExperienceLevel = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "some_experience":
      return PRISMA_EXPERIENCE_LEVEL.SOME_EXPERIENCE;
    case "experienced":
      return PRISMA_EXPERIENCE_LEVEL.EXPERIENCED;
    case "first_time":
    default:
      return PRISMA_EXPERIENCE_LEVEL.FIRST_TIME;
  }
};

export const toPrismaVirtualAdoptionStatus = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "paused":
      return PRISMA_VIRTUAL_ADOPTION_STATUS.PAUSED;
    case "cancelled":
    case "canceled":
      return PRISMA_VIRTUAL_ADOPTION_STATUS.CANCELLED;
    case "completed":
      return PRISMA_VIRTUAL_ADOPTION_STATUS.COMPLETED;
    case "active":
    default:
      return PRISMA_VIRTUAL_ADOPTION_STATUS.ACTIVE;
  }
};

export const toPrismaPaymentFrequency = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "monthly":
      return PRISMA_PAYMENT_FREQUENCY.MONTHLY;
    case "quarterly":
      return PRISMA_PAYMENT_FREQUENCY.QUARTERLY;
    case "annual":
      return PRISMA_PAYMENT_FREQUENCY.ANNUAL;
    case "one_time":
    default:
      return PRISMA_PAYMENT_FREQUENCY.ONE_TIME;
  }
};

export const toPrismaDonationInquiryType = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "receipt_request":
      return PRISMA_DONATION_INQUIRY_TYPE.RECEIPT_REQUEST;
    case "monthly_donation_change":
      return PRISMA_DONATION_INQUIRY_TYPE.MONTHLY_DONATION_CHANGE;
    case "corporate_donation":
      return PRISMA_DONATION_INQUIRY_TYPE.CORPORATE_DONATION;
    case "refund_or_correction":
      return PRISMA_DONATION_INQUIRY_TYPE.REFUND_OR_CORRECTION;
    case "allocation_question":
      return PRISMA_DONATION_INQUIRY_TYPE.ALLOCATION_QUESTION;
    case "event_sponsorship":
      return PRISMA_DONATION_INQUIRY_TYPE.EVENT_SPONSORSHIP;
    default:
      return PRISMA_DONATION_INQUIRY_TYPE.OTHER;
  }
};

export const toPrismaVolunteerApplicationStatus = (
  value: string | null | undefined,
) => {
  switch (normalizeValue(value)) {
    case "screening":
    case "open":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.SCREENING;
    case "orientation_scheduled":
    case "scheduled":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.ORIENTATION_SCHEDULED;
    case "approved":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.APPROVED;
    case "declined":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.DECLINED;
    case "active":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.ACTIVE;
    case "inactive":
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.INACTIVE;
    case "new":
    default:
      return PRISMA_VOLUNTEER_APPLICATION_STATUS.NEW;
  }
};

export const toPrismaBackgroundCheckStatus = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "not_required":
      return PRISMA_BACKGROUND_CHECK_STATUS.NOT_REQUIRED;
    case "cleared":
      return PRISMA_BACKGROUND_CHECK_STATUS.CLEARED;
    case "failed":
      return PRISMA_BACKGROUND_CHECK_STATUS.FAILED;
    case "pending":
    default:
      return PRISMA_BACKGROUND_CHECK_STATUS.PENDING;
  }
};

