import {
  PetPublicStatus,
  PetStatus,
  type PrismaClient,
} from "@prisma/client";
import { normalizeValue, slugify, toDate } from "./seed-normalizers";
import type {
  AdminDashboardFile,
  RawDashboardRecord,
  RawPet,
} from "./seed-types";

const stringFromRecord = (record: RawDashboardRecord, key: string) => {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
};

const numberFromRecord = (record: RawDashboardRecord, key: string) => {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
};

const getMonthValue = (record: RawDashboardRecord) =>
  stringFromRecord(record, "month") ?? "";

const getHistoricalPetAge = (record: RawDashboardRecord) => {
  const age = numberFromRecord(record, "age");
  return typeof age === "number" ? Math.max(0, Math.round(age)) : 1;
};

const getHistoricalPetWeight = (
  species: string,
  ageGroup?: string,
  size?: string,
) => {
  const normalizedSpecies = normalizeValue(species);
  const normalizedAgeGroup = normalizeValue(ageGroup);
  const normalizedSize = normalizeValue(size);

  if (normalizedSpecies === "dog") {
    if (normalizedSize === "large") return 31;
    if (normalizedSize === "small") return 9;
    return normalizedAgeGroup === "young" ? 14 : 22;
  }

  if (normalizedSpecies === "cat") {
    return normalizedAgeGroup === "young" ? 3.5 : 4.8;
  }

  if (normalizedSpecies === "rabbit") return 2.4;
  if (normalizedSpecies === "bird") return 0.4;
  if (normalizedSpecies === "guinea_pig") return 1.1;
  return 5;
};

const getHistoricalPetDescription = (
  name: string,
  species: string,
  intakeDate?: string,
  intakeNote?: string,
  ageGroup?: string,
  gender?: string,
) => {
  const speciesLabel = species.replaceAll("_", " ");
  const ageLabel = ageGroup ? `${ageGroup.replaceAll("_", " ")} ` : "";
  const genderLabel = gender && gender !== "unknown" ? `${gender} ` : "";
  const arrivalText = intakeDate
    ? `${name} came into Furever Home care on ${intakeDate}.`
    : `${name} came into Furever Home care through the shelter intake process.`;

  if (intakeNote?.trim()) {
    return `${arrivalText} ${intakeNote.trim()} Staff kept the record connected to applications, case notes, and outcome history so the team can review the full care timeline when needed.`;
  }

  return `${arrivalText} This ${ageLabel}${genderLabel}${speciesLabel} received an intake assessment, a care plan, and adoption support while at the shelter. Staff kept the record connected to applications, case notes, and outcome history so the team can review the full care timeline when needed.`;
};

const getLatestPetSnapshotByPetId = (snapshots: RawDashboardRecord[]) => {
  const latestByPetId = new Map<string, RawDashboardRecord>();

  for (const snapshot of snapshots) {
    const petId = stringFromRecord(snapshot, "petId");
    if (!petId) continue;

    const existing = latestByPetId.get(petId);
    if (!existing || getMonthValue(existing) < getMonthValue(snapshot)) {
      latestByPetId.set(petId, snapshot);
    }
  }

  return latestByPetId;
};

const getAdoptionByPetId = (adoptions: RawDashboardRecord[]) => {
  const adoptionByPetId = new Map<string, RawDashboardRecord>();

  for (const adoption of adoptions) {
    const petId = stringFromRecord(adoption, "petId");
    if (petId) adoptionByPetId.set(petId, adoption);
  }

  return adoptionByPetId;
};

export const buildHistoricalPets = (
  adminDashboardFile: AdminDashboardFile,
  currentPets: RawPet[],
): RawPet[] => {
  const currentPetIds = getPetIdSet(currentPets);
  const latestSnapshotByPetId = getLatestPetSnapshotByPetId(
    adminDashboardFile.monthlyPetSnapshots ?? [],
  );
  const adoptionByPetId = getAdoptionByPetId(adminDashboardFile.adoptions ?? []);

  return (adminDashboardFile.animalIntakes ?? [])
    .map<RawPet | null>((intake) => {
      const id = stringFromRecord(intake, "petId");
      if (!id || currentPetIds.has(id)) return null;

      const latestSnapshot = latestSnapshotByPetId.get(id);
      const adoption = adoptionByPetId.get(id);
      const name =
        stringFromRecord(intake, "petName") ??
        stringFromRecord(latestSnapshot ?? {}, "petName") ??
        id;
      const species =
        stringFromRecord(intake, "type") ??
        stringFromRecord(latestSnapshot ?? {}, "type") ??
        "dog";
      const ageGroup =
        stringFromRecord(intake, "ageGroup") ??
        stringFromRecord(latestSnapshot ?? {}, "ageGroup");
      const size = stringFromRecord(latestSnapshot ?? {}, "size") ?? "medium";
      const intakeDate =
        stringFromRecord(intake, "date") ?? stringFromRecord(intake, "createdAt");
      const lastUpdated =
        stringFromRecord(adoption ?? {}, "completedAt") ??
        stringFromRecord(adoption ?? {}, "date") ??
        stringFromRecord(latestSnapshot ?? {}, "lastStatusChangedAt") ??
        stringFromRecord(latestSnapshot ?? {}, "monthEndDate") ??
        intakeDate;

      return {
        id,
        name,
        species,
        description: getHistoricalPetDescription(
          name,
          species,
          intakeDate,
          stringFromRecord(intake, "notes"),
          ageGroup,
          stringFromRecord(intake, "gender"),
        ),
        age: getHistoricalPetAge(intake),
        gender:
          stringFromRecord(intake, "gender") ??
          stringFromRecord(latestSnapshot ?? {}, "gender") ??
          "unknown",
        weight: getHistoricalPetWeight(species, ageGroup, size),
        image: "/placeholder-user.jpg",
        status: "adopted",
        size,
        neutered: true,
        goodWithChildren: undefined,
        goodWithOtherAnimals: undefined,
        ageGroup,
        daysInShelter:
          numberFromRecord(adoption ?? {}, "daysInShelter") ??
          numberFromRecord(latestSnapshot ?? {}, "daysInShelter"),
        lastUpdated,
      } satisfies RawPet;
    })
    .filter((pet): pet is RawPet => pet !== null);
};

export const seedHistoricalPets = async (
  prisma: PrismaClient,
  pets: RawPet[],
) => {
  for (const pet of pets) {
    const hiddenAt = toDate(pet.lastUpdated) ?? new Date();

    await prisma.pet.upsert({
      where: { id: pet.id },
      update: {
        publicSlug: `${slugify(pet.name)}-${pet.id}`,
        name: pet.name,
        species: pet.species,
        description: pet.description,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        status: PetStatus.ADOPTED,
        publicStatus: PetPublicStatus.ADOPTED,
        isPublished: false,
        featured: false,
        size: pet.size,
        neutered: pet.neutered,
        goodWithChildren: pet.goodWithChildren,
        goodWithOtherAnimals: pet.goodWithOtherAnimals,
        ageGroup: pet.ageGroup,
        daysInShelter: pet.daysInShelter,
        publishedAt: undefined,
        hiddenAt,
        updatedAt: hiddenAt,
      },
      create: {
        id: pet.id,
        publicSlug: `${slugify(pet.name)}-${pet.id}`,
        name: pet.name,
        species: pet.species,
        description: pet.description,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        status: PetStatus.ADOPTED,
        publicStatus: PetPublicStatus.ADOPTED,
        isPublished: false,
        featured: false,
        size: pet.size,
        neutered: pet.neutered,
        goodWithChildren: pet.goodWithChildren,
        goodWithOtherAnimals: pet.goodWithOtherAnimals,
        ageGroup: pet.ageGroup,
        daysInShelter: pet.daysInShelter,
        createdAt: toDate(pet.lastUpdated) ?? new Date(),
        updatedAt: hiddenAt,
        hiddenAt,
      },
    });
  }
};

export const getPetIdSet = (pets: RawPet[]) =>
  new Set(pets.map((pet) => pet.id));
