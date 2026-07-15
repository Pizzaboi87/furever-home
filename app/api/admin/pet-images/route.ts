import { NextResponse } from 'next/server'

import { getCurrentStaff } from '@/lib/admin/auth'
import { uploadPetImageToCloudinary } from '@/lib/server/cloudinary'

export const runtime = 'nodejs'

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: Request) {
  try {
    const staff = await getCurrentStaff()

    if (!staff) {
      return NextResponse.json(
        { error: 'Authentication is required to upload pet images.' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const petId = String(formData.get('petId') ?? '').trim()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and WebP images are supported.' },
        { status: 400 },
      )
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Image must be smaller than 8 MB.' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadedImage = await uploadPetImageToCloudinary({
      buffer,
      fileName: file.name,
      petId: petId || undefined,
    })

    return NextResponse.json(uploadedImage)
  } catch (error) {
    console.error('Cloudinary pet image upload failed.', error)

    return NextResponse.json(
      { error: 'Could not upload this image. Please try again later.' },
      { status: 500 },
    )
  }
}
