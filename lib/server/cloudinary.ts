import { v2 as cloudinary } from 'cloudinary'

import { normalizeValue } from '@/lib/pet-format'
import { getCloudinaryEnv } from '@/lib/server/env'

const configureCloudinary = () => {
  const cloudinaryEnv = getCloudinaryEnv()

  cloudinary.config({
    cloud_name: cloudinaryEnv.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinaryEnv.CLOUDINARY_API_KEY,
    api_secret: cloudinaryEnv.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

const slugify = (value: string) => {
  return normalizeValue(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const getFileNameWithoutExtension = (fileName: string) => {
  return fileName.replace(/\.[a-z0-9]+$/i, '')
}

export type UploadedPetImage = {
  cloudinaryPublicId: string
  secureUrl: string
  thumbnailUrl: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

const getSquareImageUrl = (publicId: string, size = 1200) => {
  return cloudinary.url(publicId, {
    secure: true,
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    fetch_format: 'auto',
    quality: 'auto',
  })
}

export const uploadPetImageToCloudinary = async ({
  buffer,
  fileName,
  petId,
}: {
  buffer: Buffer
  fileName: string
  petId?: string
}): Promise<UploadedPetImage> => {
  configureCloudinary()

  const folderPetId = slugify(petId || 'admin-uploads') || 'admin-uploads'
  const baseFileName = slugify(getFileNameWithoutExtension(fileName)) || 'primary'
  const publicId = `${baseFileName}-${Date.now()}`

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `furever-home/pets/${folderPetId}`,
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed.'))
          return
        }

        resolve({
          cloudinaryPublicId: result.public_id,
          secureUrl: result.secure_url,
          thumbnailUrl: getSquareImageUrl(result.public_id, 640),
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        })
      },
    )

    uploadStream.end(buffer)
  })
}


const isCloudinaryPublicId = (publicId: string) => {
  return publicId.startsWith('furever-home/') || publicId.startsWith('manual-pets/')
}

export const deletePetImagesFromCloudinary = async (publicIds: string[]) => {
  const uniquePublicIds = [...new Set(publicIds.map((id) => id.trim()).filter(Boolean))]
  const cloudinaryPublicIds = uniquePublicIds.filter(isCloudinaryPublicId)

  if (cloudinaryPublicIds.length === 0) {
    return { deleted: 0, skipped: uniquePublicIds.length }
  }

  configureCloudinary()

  const results = await Promise.allSettled(
    cloudinaryPublicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, { resource_type: 'image' }),
    ),
  )

  const failed = results.filter((result) => result.status === 'rejected')

  if (failed.length > 0) {
    throw new Error(
      `Pet was deleted, but ${failed.length} Cloudinary asset${
        failed.length === 1 ? '' : 's'
      } could not be deleted.`,
    )
  }

  return { deleted: cloudinaryPublicIds.length, skipped: uniquePublicIds.length - cloudinaryPublicIds.length }
}
