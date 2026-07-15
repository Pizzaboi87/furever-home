import type {
  AdminDashboardFile,
  PetsFile,
} from "./seed-types";
import {
  adminDashboardFileSchema,
  petsFileSchema,
} from "./seed-schemas";
import {
  assertNoDuplicateIds,
  assertReferencesExist,
} from "./seed-validation-helpers";
import { validateSeedDateInvariants } from "./seed-date-invariants";
import { validateStructuredRecordInvariants } from "./seed-structured-record-invariants";
import { validateIdentityInvariants } from "./seed-identity-invariants";
import {
  validateApplicationLifecycleInvariants,
  validateCaseLifecycleInvariants,
  validateCurrentPetInvariants,
} from "./seed-domain-invariants";

export const parsePetsFile = (input: unknown): PetsFile => {
  return petsFileSchema.parse(input) as PetsFile;
};

export const parseAdminDashboardFile = (
  input: unknown,
): AdminDashboardFile => {
  return adminDashboardFileSchema.parse(input) as AdminDashboardFile;
};

export const validateSeedInvariants = (
  petsFile: PetsFile,
  adminDashboardFile: AdminDashboardFile,
) => {
  const currentPets = petsFile.pets;
  const staff = adminDashboardFile.staff ?? [];
  const people = adminDashboardFile.people ?? [];
  const cases = adminDashboardFile.cases ?? [];
  const shelterEvents = adminDashboardFile.shelterEvents ?? [];
  const caseInteractions = adminDashboardFile.caseInteractions ?? [];
  const caseNotes = adminDashboardFile.caseNotes ?? [];
  const caseEvents = adminDashboardFile.caseEvents ?? [];
  const activityEvents = adminDashboardFile.activityEvents ?? [];
  const adoptionApplications = adminDashboardFile.adoptionApplications ?? [];
  const virtualAdoptions = adminDashboardFile.virtualAdoptions ?? [];
  const donationInquiries = adminDashboardFile.donationInquiries ?? [];
  const volunteerApplications = adminDashboardFile.volunteerApplications ?? [];

  validateCurrentPetInvariants(petsFile);

  assertNoDuplicateIds("pet", currentPets);
  assertNoDuplicateIds("staff", staff);
  assertNoDuplicateIds("person", people);
  assertNoDuplicateIds("case", cases);
  assertNoDuplicateIds("shelter event", shelterEvents);
  assertNoDuplicateIds("case interaction", caseInteractions);
  assertNoDuplicateIds("case note", caseNotes);
  assertNoDuplicateIds("case event", caseEvents);
  assertNoDuplicateIds("activity event", activityEvents);
  assertNoDuplicateIds("adoption application", adoptionApplications);
  assertNoDuplicateIds("virtual adoption", virtualAdoptions);
  assertNoDuplicateIds("donation inquiry", donationInquiries);
  assertNoDuplicateIds("volunteer application", volunteerApplications);

  const personIds = new Set(people.map(({ id }) => id));
  const staffIds = new Set(staff.map(({ id }) => id));
  const caseIds = new Set(cases.map(({ id }) => id));
  const shelterEventIds = new Set(shelterEvents.map(({ id }) => id));
  const currentPetIds = new Set(currentPets.map(({ id }) => id));
  const historicalPetIds = new Set(
    (adminDashboardFile.animalIntakes ?? [])
      .map((record) => record.petId)
      .filter((petId): petId is string => typeof petId === "string"),
  );
  const allKnownPetIds = new Set([...currentPetIds, ...historicalPetIds]);

  validateCaseLifecycleInvariants({
    adminDashboardFile,
    currentPetIds,
  });
  validateApplicationLifecycleInvariants(adminDashboardFile);
  validateSeedDateInvariants(adminDashboardFile);
  validateStructuredRecordInvariants(adminDashboardFile);
  validateIdentityInvariants(adminDashboardFile);

  assertReferencesExist(
    "case person",
    cases.map(({ id, personId }) => ({ recordId: id, referencedId: personId })),
    personIds,
  );

  assertReferencesExist(
    "assigned staff",
    cases
      .filter(({ assignedStaffId }) => Boolean(assignedStaffId))
      .map(({ id, assignedStaffId }) => ({
        recordId: id,
        referencedId: assignedStaffId as string,
      })),
    staffIds,
  );

  assertReferencesExist(
    "case pet",
    cases
      .map((shelterCase) => ({
        recordId: shelterCase.id,
        referencedId: shelterCase.petId ?? shelterCase.relatedPetId ?? null,
      }))
      .filter(
        (reference): reference is { recordId: string; referencedId: string } =>
          Boolean(reference.referencedId),
      ),
    allKnownPetIds,
  );

  assertReferencesExist(
    "case shelter event",
    cases
      .filter(({ relatedEventId }) => Boolean(relatedEventId))
      .map(({ id, relatedEventId }) => ({
        recordId: id,
        referencedId: relatedEventId as string,
      })),
    shelterEventIds,
  );

  assertReferencesExist(
    "interaction case",
    caseInteractions.map(({ id, caseId }) => ({
      recordId: id,
      referencedId: caseId,
    })),
    caseIds,
  );

  assertReferencesExist(
    "interaction staff",
    caseInteractions
      .filter(({ loggedByStaffId }) => Boolean(loggedByStaffId))
      .map(({ id, loggedByStaffId }) => ({
        recordId: id,
        referencedId: loggedByStaffId as string,
      })),
    staffIds,
  );

  assertReferencesExist(
    "interaction person",
    caseInteractions
      .filter(({ contactPersonId }) => Boolean(contactPersonId))
      .map(({ id, contactPersonId }) => ({
        recordId: id,
        referencedId: contactPersonId as string,
      })),
    personIds,
  );

  assertReferencesExist(
    "note case",
    caseNotes.map(({ id, caseId }) => ({
      recordId: id,
      referencedId: caseId,
    })),
    caseIds,
  );

  assertReferencesExist(
    "note staff",
    caseNotes
      .filter(({ staffId }) => Boolean(staffId))
      .map(({ id, staffId }) => ({
        recordId: id,
        referencedId: staffId as string,
      })),
    staffIds,
  );

  assertReferencesExist(
    "event case",
    caseEvents.map(({ id, caseId }) => ({
      recordId: id,
      referencedId: caseId,
    })),
    caseIds,
  );

  assertReferencesExist(
    "case event staff actor",
    caseEvents
      .filter(
        ({ actorType, actorId }) =>
          actorType?.trim().toLowerCase() === "staff" && Boolean(actorId),
      )
      .map(({ id, actorId }) => ({
        recordId: id,
        referencedId: actorId as string,
      })),
    staffIds,
  );

  const applicationRecords = [
    ...adoptionApplications,
    ...virtualAdoptions,
    ...donationInquiries,
    ...volunteerApplications,
  ];

  assertReferencesExist(
    "application case",
    applicationRecords.map(({ id, caseId }) => ({
      recordId: id,
      referencedId: caseId,
    })),
    caseIds,
  );

  assertReferencesExist(
    "application person",
    applicationRecords.map(({ id, personId }) => ({
      recordId: id,
      referencedId: personId,
    })),
    personIds,
  );

  assertReferencesExist(
    "adoption pet",
    adoptionApplications.map(({ id, petId }) => ({
      recordId: id,
      referencedId: petId,
    })),
    allKnownPetIds,
  );

  assertReferencesExist(
    "virtual adoption pet",
    virtualAdoptions.map(({ id, petId }) => ({
      recordId: id,
      referencedId: petId,
    })),
    allKnownPetIds,
  );

  assertReferencesExist(
    "activity pet",
    activityEvents
      .filter(({ petId }) => Boolean(petId))
      .map(({ id, petId }) => ({
        recordId: id,
        referencedId: petId as string,
      })),
    allKnownPetIds,
  );

  assertReferencesExist(
    "activity case",
    activityEvents
      .filter(({ caseId }) => Boolean(caseId))
      .map(({ id, caseId }) => ({
        recordId: id,
        referencedId: caseId as string,
      })),
    caseIds,
  );

  assertReferencesExist(
    "activity person",
    activityEvents
      .filter(({ personId }) => Boolean(personId))
      .map(({ id, personId }) => ({
        recordId: id,
        referencedId: personId as string,
      })),
    personIds,
  );

  assertReferencesExist(
    "activity staff actor",
    activityEvents
      .filter(({ actorId }) => Boolean(actorId))
      .map(({ id, actorId }) => ({
        recordId: id,
        referencedId: actorId as string,
      })),
    staffIds,
  );
};
