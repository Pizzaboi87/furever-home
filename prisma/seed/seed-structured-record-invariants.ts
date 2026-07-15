import type {
  AdminDashboardFile,
  RawShelterCase,
} from "./seed-types";
import { normalizeSeedValue } from "./seed-validation-helpers";

type StructuredRecord = {
  id: string;
  caseId: string;
  personId: string;
  petId?: string;
};

type StructuredCollection = {
  label: string;
  expectedCaseType: string;
  records: readonly StructuredRecord[];
  requiresPetMatch: boolean;
};

const getRelatedPetId = (shelterCase: RawShelterCase) => {
  return shelterCase.petId ?? shelterCase.relatedPetId ?? null;
};

const assertSingleRecordPerCase = ({
  label,
  records,
}: StructuredCollection) => {
  const countsByCaseId = new Map<string, number>();

  records.forEach(({ caseId }) => {
    countsByCaseId.set(caseId, (countsByCaseId.get(caseId) ?? 0) + 1);
  });

  const duplicateCaseIds = [...countsByCaseId.entries()]
    .filter(([, count]) => count > 1)
    .map(([caseId]) => caseId);

  if (duplicateCaseIds.length > 0) {
    throw new Error(
      `Seed validation failed: ${label} records are duplicated for cases: ${duplicateCaseIds
        .slice(0, 10)
        .join(", ")}.`,
    );
  }
};


const assertStructuredCaseCoverage = ({
  collection,
  cases,
}: {
  collection: StructuredCollection;
  cases: readonly RawShelterCase[];
}) => {
  const recordCaseIds = new Set(collection.records.map(({ caseId }) => caseId));
  const missingRecordCases = cases.filter(
    (shelterCase) =>
      normalizeSeedValue(shelterCase.type) === collection.expectedCaseType &&
      !recordCaseIds.has(shelterCase.id),
  );

  if (missingRecordCases.length > 0) {
    throw new Error(
      `Seed validation failed: ${collection.label} cases are missing structured records: ${missingRecordCases
        .slice(0, 10)
        .map(({ id }) => id)
        .join(", ")}.`,
    );
  }
};

const assertRequiredPetLinks = ({
  collection,
  caseById,
}: {
  collection: StructuredCollection;
  caseById: Map<string, RawShelterCase>;
}) => {
  if (!collection.requiresPetMatch) {
    return;
  }

  const missingPetLinks = collection.records.filter((record) => {
    const shelterCase = caseById.get(record.caseId);

    return !record.petId || !shelterCase || !getRelatedPetId(shelterCase);
  });

  if (missingPetLinks.length > 0) {
    throw new Error(
      `Seed validation failed: ${collection.label} records or cases are missing required pet references: ${missingPetLinks
        .slice(0, 10)
        .map(({ id, caseId }) => `${id} -> ${caseId}`)
        .join(", ")}.`,
    );
  }
};

const validateStructuredCollection = ({
  collection,
  caseById,
}: {
  collection: StructuredCollection;
  caseById: Map<string, RawShelterCase>;
}) => {
  assertSingleRecordPerCase(collection);
  assertRequiredPetLinks({ collection, caseById });

  const wrongCaseTypes = collection.records.filter((record) => {
    const shelterCase = caseById.get(record.caseId);

    return (
      shelterCase !== undefined &&
      normalizeSeedValue(shelterCase.type) !== collection.expectedCaseType
    );
  });

  if (wrongCaseTypes.length > 0) {
    throw new Error(
      `Seed validation failed: ${collection.label} records reference incompatible case types: ${wrongCaseTypes
        .slice(0, 10)
        .map(({ id, caseId }) => `${id} -> ${caseId}`)
        .join(", ")}.`,
    );
  }

  const personMismatches = collection.records.filter((record) => {
    const shelterCase = caseById.get(record.caseId);

    return shelterCase !== undefined && shelterCase.personId !== record.personId;
  });

  if (personMismatches.length > 0) {
    throw new Error(
      `Seed validation failed: ${collection.label} person references do not match their cases: ${personMismatches
        .slice(0, 10)
        .map(({ id, caseId }) => `${id} -> ${caseId}`)
        .join(", ")}.`,
    );
  }

  if (!collection.requiresPetMatch) {
    return;
  }

  const petMismatches = collection.records.filter((record) => {
    const shelterCase = caseById.get(record.caseId);
    const casePetId = shelterCase ? getRelatedPetId(shelterCase) : null;

    return (
      shelterCase !== undefined &&
      record.petId !== undefined &&
      casePetId !== record.petId
    );
  });

  if (petMismatches.length > 0) {
    throw new Error(
      `Seed validation failed: ${collection.label} pet references do not match their cases: ${petMismatches
        .slice(0, 10)
        .map(({ id, caseId }) => `${id} -> ${caseId}`)
        .join(", ")}.`,
    );
  }
};

export const validateStructuredRecordInvariants = (
  adminDashboardFile: AdminDashboardFile,
) => {
  const cases = adminDashboardFile.cases ?? [];
  const caseById = new Map(cases.map((shelterCase) => [shelterCase.id, shelterCase]));

  const collections: StructuredCollection[] = [
    {
      label: "adoption application",
      expectedCaseType: "adoption_application",
      records: adminDashboardFile.adoptionApplications ?? [],
      requiresPetMatch: true,
    },
    {
      label: "virtual adoption",
      expectedCaseType: "virtual_adoption",
      records: adminDashboardFile.virtualAdoptions ?? [],
      requiresPetMatch: true,
    },
    {
      label: "donation inquiry",
      expectedCaseType: "donation_support",
      records: adminDashboardFile.donationInquiries ?? [],
      requiresPetMatch: false,
    },
    {
      label: "volunteer application",
      expectedCaseType: "volunteer_application",
      records: adminDashboardFile.volunteerApplications ?? [],
      requiresPetMatch: false,
    },
  ];

  collections.forEach((collection) => {
    assertStructuredCaseCoverage({ collection, cases });
    validateStructuredCollection({ collection, caseById });
  });
};
