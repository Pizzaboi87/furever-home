import type { RawPerson } from "../seed-types";
import { normalizeValue } from "./common-normalizers";

export const PRISMA_CONTACT_CHANNEL = {
  WEBSITE_FORM: "WEBSITE_FORM",
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  WALK_IN: "WALK_IN",
  SHELTER_EVENT: "SHELTER_EVENT",
  ADMIN_CREATED: "ADMIN_CREATED",
  INTERNAL: "INTERNAL",
} as const;

export const PRISMA_PERSON_PROFILE_TYPE = {
  ADOPTER: "ADOPTER",
  FOSTER: "FOSTER",
  VOLUNTEER: "VOLUNTEER",
  DONOR: "DONOR",
  SUPPORTER: "SUPPORTER",
  GENERAL_CONTACT: "GENERAL_CONTACT",
} as const;

export const toContactChannel = (value: string | null | undefined) => {
  switch (normalizeValue(value)) {
    case "website_form":
      return PRISMA_CONTACT_CHANNEL.WEBSITE_FORM;
    case "phone":
      return PRISMA_CONTACT_CHANNEL.PHONE;
    case "walk_in":
      return PRISMA_CONTACT_CHANNEL.WALK_IN;
    case "shelter_event":
      return PRISMA_CONTACT_CHANNEL.SHELTER_EVENT;
    case "admin_created":
      return PRISMA_CONTACT_CHANNEL.ADMIN_CREATED;
    case "internal":
      return PRISMA_CONTACT_CHANNEL.INTERNAL;
    case "email":
    default:
      return PRISMA_CONTACT_CHANNEL.EMAIL;
  }
};

export const normalizeAddressPart = (value: string | null | undefined) => {
  const normalized = value?.trim();

  return normalized || null;
};

export const normalizePersonAddress = (address: RawPerson["address"]) => {
  if (!address) {
    return {
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    };
  }

  if (typeof address === "string") {
    return {
      addressLine1: normalizeAddressPart(address),
      addressLine2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
    };
  }

  return {
    addressLine1: normalizeAddressPart(address.line1),
    addressLine2: normalizeAddressPart(address.line2),
    city: normalizeAddressPart(address.city),
    state: normalizeAddressPart(address.state),
    zip: normalizeAddressPart(address.zip),
    country: normalizeAddressPart(address.country),
  };
};

export const inferPersonProfileType = (person: RawPerson) => {
  const tags = person.tags?.map(normalizeValue) ?? [];

  if (tags.some((tag) => tag.includes("volunteer"))) {
    return PRISMA_PERSON_PROFILE_TYPE.VOLUNTEER;
  }

  if (tags.some((tag) => tag.includes("donor"))) {
    return PRISMA_PERSON_PROFILE_TYPE.DONOR;
  }

  if (tags.some((tag) => tag.includes("foster"))) {
    return PRISMA_PERSON_PROFILE_TYPE.FOSTER;
  }

  if (tags.some((tag) => tag.includes("support"))) {
    return PRISMA_PERSON_PROFILE_TYPE.SUPPORTER;
  }

  if (
    tags.some((tag) => tag.includes("adopter") || tag.includes("applicant"))
  ) {
    return PRISMA_PERSON_PROFILE_TYPE.ADOPTER;
  }

  return PRISMA_PERSON_PROFILE_TYPE.GENERAL_CONTACT;
};
