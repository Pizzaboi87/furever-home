import type {
  AdminDashboardFile,
  RawAdoptionApplication,
  RawDonationInquiry,
  RawShelterCase,
  RawVirtualAdoption,
  RawVolunteerApplication,
} from "./seed-types";

type TimestampedRecord = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

const toTimestamp = (value: string | null | undefined) => {
  return value ? new Date(value).getTime() : null;
};

const assertUpdatedAtIsNotBeforeCreatedAt = (
  label: string,
  records: readonly TimestampedRecord[],
) => {
  const invalidRecords = records.filter((record) => {
    const createdAt = toTimestamp(record.createdAt);
    const updatedAt = toTimestamp(record.updatedAt);

    return createdAt !== null && updatedAt !== null && updatedAt < createdAt;
  });

  if (invalidRecords.length > 0) {
    throw new Error(
      `Seed validation failed: ${label} records have updatedAt before createdAt: ${invalidRecords
        .slice(0, 10)
        .map(({ id }) => id)
        .join(", ")}.`,
    );
  }
};

const validateCaseDates = (cases: readonly RawShelterCase[]) => {
  assertUpdatedAtIsNotBeforeCreatedAt("case", cases);

  const invalidClosedDates = cases.filter((shelterCase) => {
    const createdAt = toTimestamp(shelterCase.createdAt);
    const closedAt = toTimestamp(shelterCase.closedAt);

    return createdAt !== null && closedAt !== null && closedAt < createdAt;
  });

  if (invalidClosedDates.length > 0) {
    throw new Error(
      `Seed validation failed: cases have closedAt before createdAt: ${invalidClosedDates
        .slice(0, 10)
        .map(({ caseNumber, id }) => caseNumber ?? id)
        .join(", ")}.`,
    );
  }
};

export const validateSeedDateInvariants = (
  adminDashboardFile: AdminDashboardFile,
) => {
  validateCaseDates(adminDashboardFile.cases ?? []);
  assertUpdatedAtIsNotBeforeCreatedAt(
    "adoption application",
    (adminDashboardFile.adoptionApplications ?? []) as RawAdoptionApplication[],
  );
  assertUpdatedAtIsNotBeforeCreatedAt(
    "virtual adoption",
    (adminDashboardFile.virtualAdoptions ?? []) as RawVirtualAdoption[],
  );
  assertUpdatedAtIsNotBeforeCreatedAt(
    "donation inquiry",
    (adminDashboardFile.donationInquiries ?? []) as RawDonationInquiry[],
  );
  assertUpdatedAtIsNotBeforeCreatedAt(
    "volunteer application",
    (adminDashboardFile.volunteerApplications ?? []) as RawVolunteerApplication[],
  );
};
