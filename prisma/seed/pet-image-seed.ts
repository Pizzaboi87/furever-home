import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { getOptionalCloudinaryEnv } from "../../lib/server/env";
import {
  getFileNameWithoutExtension,
  slugify,
} from "./seed-normalizers";
import type { RawPet, UploadedImage } from "./seed-types";

const projectRoot = process.cwd();
const seedPetAssetsRoot = path.join(projectRoot, "prisma", "seed-assets", "pets");
const fallbackPetImageUrl = "/placeholder-user.jpg";
const seedCloudinaryEnv = getOptionalCloudinaryEnv();

export const configureSeedCloudinary = () => {
  if (!seedCloudinaryEnv) {
    return false;
  }

  cloudinary.config({
    cloud_name: seedCloudinaryEnv.CLOUDINARY_CLOUD_NAME,
    api_key: seedCloudinaryEnv.CLOUDINARY_API_KEY,
    api_secret: seedCloudinaryEnv.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return true;
};

const getLocalImagePath = (imageFileName: string) => {
  const localImagePath = path.join(
    seedPetAssetsRoot,
    path.basename(imageFileName),
  );

  return fs.existsSync(localImagePath) ? localImagePath : undefined;
};

const getCloudinaryPublicId = (pet: RawPet) => {
  const imageName = getFileNameWithoutExtension(pet.image);
  return `furever-home/pets/${pet.id}/${slugify(imageName || pet.name)}`;
};

const getLegacyImageData = (pet: RawPet): UploadedImage => {
  const publicId = getCloudinaryPublicId(pet);

  return {
    publicId,
    secureUrl: fallbackPetImageUrl,
    thumbnailUrl: fallbackPetImageUrl,
  };
};

export const uploadSeedPetImage = async (
  pet: RawPet,
  shouldUploadToCloudinary: boolean,
  existingImage?: {
    cloudinaryPublicId: string | null;
    secureUrl: string;
    thumbnailUrl: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
    bytes: number | null;
  } | null,
): Promise<UploadedImage> => {
  if (
    existingImage?.cloudinaryPublicId &&
    existingImage.secureUrl.includes("res.cloudinary.com")
  ) {
    return {
      publicId: existingImage.cloudinaryPublicId,
      secureUrl: existingImage.secureUrl,
      thumbnailUrl: existingImage.thumbnailUrl ?? existingImage.secureUrl,
      width: existingImage.width ?? undefined,
      height: existingImage.height ?? undefined,
      format: existingImage.format ?? undefined,
      bytes: existingImage.bytes ?? undefined,
    };
  }

  const localImagePath = getLocalImagePath(pet.image);

  if (!shouldUploadToCloudinary) {
    return getLegacyImageData(pet);
  }

  if (!localImagePath) {
    console.warn(
      `Cloudinary upload skipped for ${pet.id}: local image file was not found for ${pet.image}. Falling back to the public placeholder image.`,
    );
    return getLegacyImageData(pet);
  }

  const publicId = getCloudinaryPublicId(pet);
  const result = await cloudinary.uploader.upload(localImagePath, {
    public_id: publicId,
    overwrite: false,
    unique_filename: false,
    resource_type: "image",
    tags: ["furever-home", "pet-seed", pet.species, pet.status],
    context: {
      pet_id: pet.id,
      pet_name: pet.name,
      source: "prisma_seed",
    },
  });

  const thumbnailUrl = cloudinary.url(result.public_id, {
    secure: true,
    transformation: [
      {
        width: 480,
        height: 360,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    thumbnailUrl,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};
