import type {
  AdminPetCase,
  ContactChannel,
  Person,
  PersonProfileType,
} from "@/lib/admin/domain";

export const contactChannelOptions: ContactChannel[] = [
  "email",
  "phone",
  "website_form",
  "walk_in",
  "shelter_event",
  "admin_created",
];

export const profileTypeOptions: PersonProfileType[] = [
  "adopter",
  "foster",
  "volunteer",
  "donor",
  "supporter",
  "general_contact",
];

export function formatDateTime(value: string | undefined | null) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(value: string | undefined | null) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const formatAddress = (address: Person["address"]) => {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address;
  }

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.zip,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

export const inferProfileType = (
  currentPerson: Person,
  cases: AdminPetCase[],
): PersonProfileType => {
  if (currentPerson.profileType) {
    return currentPerson.profileType;
  }

  const tags = currentPerson.tags ?? [];

  if (tags.some((tag) => tag.toLowerCase().includes("volunteer"))) {
    return "volunteer";
  }

  if (tags.some((tag) => tag.toLowerCase().includes("donor"))) {
    return "donor";
  }

  if (tags.some((tag) => tag.toLowerCase().includes("foster"))) {
    return "foster";
  }

  if (tags.some((tag) => tag.toLowerCase().includes("support"))) {
    return "supporter";
  }

  if (
    cases.some(
      (item) =>
        item.type === "adoption_application" ||
        item.type === "adoption_interest",
    )
  ) {
    return "adopter";
  }

  return "general_contact";
};

export const getInitialInterestAreas = (currentPerson: Person) => {
  if (currentPerson.interestAreas?.length) {
    return currentPerson.interestAreas.join(", ");
  }

  return (currentPerson.tags ?? [])
    .filter((tag) =>
      /cat|dog|rabbit|pet|adoption|support|volunteer|donation/i.test(tag),
    )
    .join(", ");
};
