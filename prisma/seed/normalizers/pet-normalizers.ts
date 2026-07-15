import { PetPublicStatus, PetStatus } from "@prisma/client";
import { normalizeValue } from "./common-normalizers";

export const toPetStatus = (value: string) => {
  switch (normalizeValue(value)) {
    case "new":
      return PetStatus.NEW;
    case "reserved":
      return PetStatus.RESERVED;
    case "adoption_in_progress":
      return PetStatus.ADOPTION_IN_PROGRESS;
    case "adopted":
      return PetStatus.ADOPTED;
    case "unavailable":
      return PetStatus.UNAVAILABLE;
    case "hidden":
      return PetStatus.HIDDEN;
    default:
      return PetStatus.AVAILABLE;
  }
};

export const toPetPublicStatus = (value: string) => {
  switch (normalizeValue(value)) {
    case "reserved":
    case "adoption_in_progress":
      return PetPublicStatus.RESERVED;
    case "adopted":
      return PetPublicStatus.ADOPTED;
    case "unavailable":
    case "hidden":
      return PetPublicStatus.HIDDEN;
    default:
      return PetPublicStatus.PUBLISHED;
  }
};

export const isPublishedStatus = (value: string) => {
  return !["adopted", "unavailable", "hidden"].includes(normalizeValue(value));
};

