import type {
  AdminDashboardFile,
  PetsFile,
  RawShelterCase,
} from "./seed-types";
import { normalizeSeedValue } from "./seed-validation-helpers";

const CASE_NUMBER_PATTERN = /^FH-\d{4}-\d{4}$/;
const EXPECTED_CURRENT_PET_COUNT = 30;

const CLOSED_CASE_STATUSES = new Set([
  "completed",
  "closed",
  "declined",
  "cancelled",
  "rejected",
  "no_response",
  "withdrawn",
]);

const TERMINAL_APPLICATION_STATUSES = new Set([
  "completed",
  "closed",
  "declined",
  "cancelled",
  "rejected",
  "no_response",
  "withdrawn",
]);

const CURRENT_PET_STATUSES = new Set([
  "available",
  "new",
  "reserved",
  "adoption_in_progress",
]);

const getRelatedPetId = (shelterCase: RawShelterCase) => {
  return shelterCase.petId ?? shelterCase.relatedPetId ?? null;
};

const isClosedCase = (status: string) => {
  return CLOSED_CASE_STATUSES.has(normalizeSeedValue(status));
};

const isTerminalApplication = (status: string) => {
  return TERMINAL_APPLICATION_STATUSES.has(normalizeSeedValue(status));
};

export const validateCurrentPetInvariants = (petsFile: PetsFile) => {
  if (petsFile.pets.length !== EXPECTED_CURRENT_PET_COUNT) {
    throw new Error(
      `Seed validation failed: expected ${EXPECTED_CURRENT_PET_COUNT} current pets, received ${petsFile.pets.length}.`,
    );
  }

  const invalidCurrentPets = petsFile.pets.filter(
    ({ status }) => !CURRENT_PET_STATUSES.has(normalizeSeedValue(status)),
  );

  if (invalidCurrentPets.length > 0) {
    throw new Error(
      `Seed validation failed: current pets have inactive or non-public statuses: ${invalidCurrentPets
        .slice(0, 10)
        .map(({ id, status }) => `${id} (${status})`)
        .join(", ")}.`,
    );
  }
};

export const validateCaseLifecycleInvariants = ({
  adminDashboardFile,
  currentPetIds,
}: {
  adminDashboardFile: AdminDashboardFile;
  currentPetIds: Set<string>;
}) => {
  const cases = adminDashboardFile.cases ?? [];

  const invalidCaseNumbers = cases.filter(
    ({ caseNumber }) => !caseNumber || !CASE_NUMBER_PATTERN.test(caseNumber),
  );

  if (invalidCaseNumbers.length > 0) {
    throw new Error(
      `Seed validation failed: invalid case numbers for ${invalidCaseNumbers
        .slice(0, 10)
        .map(({ id }) => id)
        .join(", ")}. Expected FH-YYYY-NNNN.`,
    );
  }

  const mismatchedCaseIdentifiers = cases.filter(
    ({ id, caseNumber }) => id !== caseNumber,
  );

  if (mismatchedCaseIdentifiers.length > 0) {
    throw new Error(
      `Seed validation failed: case id and caseNumber must match: ${mismatchedCaseIdentifiers
        .slice(0, 10)
        .map(({ id, caseNumber }) => `${id} != ${caseNumber ?? "missing"}`)
        .join(", ")}.`,
    );
  }

  const closedCasesWithoutOutcome = cases.filter(
    ({ status, outcome }) => isClosedCase(status) && !outcome?.trim(),
  );

  if (closedCasesWithoutOutcome.length > 0) {
    throw new Error(
      `Seed validation failed: closed cases without outcomes: ${closedCasesWithoutOutcome
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }

  const closedCasesWithFollowUps = cases.filter(
    ({ status, nextFollowUpAt }) => isClosedCase(status) && Boolean(nextFollowUpAt),
  );

  if (closedCasesWithFollowUps.length > 0) {
    throw new Error(
      `Seed validation failed: closed cases still have active follow-ups: ${closedCasesWithFollowUps
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }

  const closedCasesWithoutClosedAt = cases.filter(
    ({ status, closedAt }) => isClosedCase(status) && !closedAt,
  );

  if (closedCasesWithoutClosedAt.length > 0) {
    throw new Error(
      `Seed validation failed: closed cases without closedAt timestamps: ${closedCasesWithoutClosedAt
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }

  const followUpsWithoutNotes = cases.filter(
    ({ nextFollowUpAt, nextFollowUpNote }) =>
      Boolean(nextFollowUpAt) && !nextFollowUpNote?.trim(),
  );

  if (followUpsWithoutNotes.length > 0) {
    throw new Error(
      `Seed validation failed: active follow-ups without notes: ${followUpsWithoutNotes
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }

  const openCasesLinkedToHistoricalPets = cases.filter((shelterCase) => {
    const petId = getRelatedPetId(shelterCase);

    return petId !== null && !isClosedCase(shelterCase.status) && !currentPetIds.has(petId);
  });

  if (openCasesLinkedToHistoricalPets.length > 0) {
    throw new Error(
      `Seed validation failed: open cases linked to historical pets: ${openCasesLinkedToHistoricalPets
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }

  const followUpsLinkedToHistoricalPets = cases.filter((shelterCase) => {
    const petId = getRelatedPetId(shelterCase);

    return Boolean(shelterCase.nextFollowUpAt) && petId !== null && !currentPetIds.has(petId);
  });

  if (followUpsLinkedToHistoricalPets.length > 0) {
    throw new Error(
      `Seed validation failed: active follow-ups linked to historical pets: ${followUpsLinkedToHistoricalPets
        .slice(0, 10)
        .map(({ caseNumber }) => caseNumber)
        .join(", ")}.`,
    );
  }
};

export const validateApplicationLifecycleInvariants = (
  adminDashboardFile: AdminDashboardFile,
) => {
  const caseById = new Map(
    (adminDashboardFile.cases ?? []).map((shelterCase) => [
      shelterCase.id,
      shelterCase,
    ]),
  );

  const inconsistentApplications = (adminDashboardFile.adoptionApplications ?? []).filter(
    (application) => {
      const shelterCase = caseById.get(application.caseId);

      if (!shelterCase) {
        return false;
      }

      return (
        isClosedCase(shelterCase.status) !==
        isTerminalApplication(application.status)
      );
    },
  );

  if (inconsistentApplications.length > 0) {
    throw new Error(
      `Seed validation failed: adoption application and case lifecycle mismatch: ${inconsistentApplications
        .slice(0, 10)
        .map(({ id, caseId }) => `${id} -> ${caseId}`)
        .join(", ")}.`,
    );
  }
};
