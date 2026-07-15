import type { Area } from 'react-easy-crop'

import type { UploadedPetImageResponse } from '@/components/admin/pets/image-upload/pet-image-upload-types'

const OUTPUT_SIZE = 1200
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const createLoadedImage = (imageUrl: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read this image.'))
    image.src = imageUrl
  })
}

export const uploadPetImage = async (
  file: File,
  petId?: string,
): Promise<UploadedPetImageResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  if (petId) {
    formData.append('petId', petId)
  }

  const response = await fetch('/api/admin/pet-images', {
    method: 'POST',
    body: formData,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload: { error?: string } | UploadedPetImageResponse = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() }

  if (!response.ok) {
    const fallbackMessage = contentType.includes('text/html')
      ? 'Image upload endpoint returned an HTML error page. Restart npm run dev and try again.'
      : 'Could not upload this image.'

    throw new Error('error' in payload && payload.error ? payload.error : fallbackMessage)
  }

  return payload as UploadedPetImageResponse
}

export const createCroppedSquareFile = async ({
  imageUrl,
  fileName,
  cropPixels,
}: {
  imageUrl: string
  fileName: string
  cropPixels: Area
}) => {
  const image = await createLoadedImage(imageUrl)
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not prepare the cropped image.')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  )

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92)
  })

  if (!blob) {
    throw new Error('Could not export the cropped image.')
  }

  return new File(
    [blob],
    `${fileName.replace(/\.[a-z0-9]+$/i, '')}-square.jpg`,
    { type: 'image/jpeg' },
  )
}
