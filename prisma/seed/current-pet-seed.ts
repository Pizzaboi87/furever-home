import type { PrismaClient } from "@prisma/client";
import {
  isPublishedStatus,
  slugify,
  toDate,
  toPetPublicStatus,
  toPetStatus,
} from "./seed-normalizers";
import { uploadSeedPetImage } from "./pet-image-seed";
import type { RawDashboardRecord, RawPet } from "./seed-types";

const stringFromRecord = (record: RawDashboardRecord, key: string) => {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
};

export const getCurrentPetIntakeDateByPetId = (
  intakes: RawDashboardRecord[],
  currentPetIds: Set<string>,
) => {
  const intakeDateByPetId = new Map<string, string>();

  for (const intake of intakes) {
    const petId = stringFromRecord(intake, "petId");
    const intakeDate =
      stringFromRecord(intake, "date") ?? stringFromRecord(intake, "createdAt");

    if (petId && currentPetIds.has(petId) && intakeDate) {
      intakeDateByPetId.set(petId, intakeDate);
    }
  }

  return intakeDateByPetId;
};

export const seedCurrentPets = async (
  prisma: PrismaClient,
  pets: RawPet[],
  shouldUploadToCloudinary: boolean,
  intakeDateByPetId: Map<string, string>,
) => {
  let reusedImages = 0;
  let uploadedImages = 0;

  for (const [index, pet] of pets.entries()) {
    const existingImage = await prisma.petImage.findUnique({
      where: { id: `pet-image-${pet.id}-primary` },
    });
    const shouldReuseImage = Boolean(
      existingImage?.cloudinaryPublicId &&
      existingImage.secureUrl.includes("res.cloudinary.com"),
    );

    if (shouldReuseImage) {
      reusedImages += 1;
      console.log(
        `Pets ${index + 1}/${pets.length}: reusing Cloudinary image for ${pet.id}.`,
      );
    } else if (shouldUploadToCloudinary) {
      uploadedImages += 1;
      console.log(
        `Pets ${index + 1}/${pets.length}: uploading image for ${pet.id}.`,
      );
    }

    const uploadedImage = await uploadSeedPetImage(
      pet,
      shouldUploadToCloudinary,
      existingImage,
    );
    const intakeDate = toDate(intakeDateByPetId.get(pet.id));
    const lastUpdatedAt = toDate(pet.lastUpdated) ?? intakeDate ?? new Date();
    const publishedAt = isPublishedStatus(pet.status) ? lastUpdatedAt : undefined;
    const hiddenAt = isPublishedStatus(pet.status) ? undefined : lastUpdatedAt;

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
        status: toPetStatus(pet.status),
        publicStatus: toPetPublicStatus(pet.status),
        isPublished: isPublishedStatus(pet.status),
        size: pet.size,
        neutered: pet.neutered,
        goodWithChildren: pet.goodWithChildren,
        goodWithOtherAnimals: pet.goodWithOtherAnimals,
        ageGroup: pet.ageGroup,
        daysInShelter: pet.daysInShelter,
        publishedAt,
        hiddenAt,
        createdAt: intakeDate,
        updatedAt: lastUpdatedAt,
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
        status: toPetStatus(pet.status),
        publicStatus: toPetPublicStatus(pet.status),
        isPublished: isPublishedStatus(pet.status),
        size: pet.size,
        neutered: pet.neutered,
        goodWithChildren: pet.goodWithChildren,
        goodWithOtherAnimals: pet.goodWithOtherAnimals,
        ageGroup: pet.ageGroup,
        daysInShelter: pet.daysInShelter,
        publishedAt,
        hiddenAt,
        createdAt: intakeDate,
        updatedAt: lastUpdatedAt,
      },
    });

    await prisma.petImage.upsert({
      where: { id: `pet-image-${pet.id}-primary` },
      update: {
        cloudinaryPublicId: uploadedImage.publicId,
        secureUrl: uploadedImage.secureUrl,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        alt: `${pet.name} the ${pet.species}`,
        width: uploadedImage.width,
        height: uploadedImage.height,
        format: uploadedImage.format,
        bytes: uploadedImage.bytes,
        sortOrder: 0,
        isPrimary: true,
      },
      create: {
        id: `pet-image-${pet.id}-primary`,
        petId: pet.id,
        cloudinaryPublicId: uploadedImage.publicId,
        secureUrl: uploadedImage.secureUrl,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        alt: `${pet.name} the ${pet.species}`,
        width: uploadedImage.width,
        height: uploadedImage.height,
        format: uploadedImage.format,
        bytes: uploadedImage.bytes,
        sortOrder: 0,
        isPrimary: true,
      },
    });
  }

  console.log(
    `Pet image seed complete: ${uploadedImages} uploaded, ${reusedImages} reused, ${pets.length - uploadedImages - reusedImages} local fallbacks.`,
  );
};
