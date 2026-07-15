import type { Area, Point } from 'react-easy-crop'

export type UploadedPetImageResponse = {
  cloudinaryPublicId: string
  secureUrl: string
  thumbnailUrl?: string
}

export type PetImageUploadCropperProps = {
  disabled?: boolean
  petId?: string
  helperText?: string
  onUploaded: (image: UploadedPetImageResponse) => void
  onUploadingChange?: (isUploading: boolean) => void
  onError?: (message: string) => void
}

export type PetImageCropModalProps = {
  crop: Point
  cropPixels: Area | null
  isUploading: boolean
  previewUrl: string
  zoom: number
  onCancel: () => void
  onCropChange: (crop: Point) => void
  onCropComplete: (cropPixels: Area) => void
  onUpload: () => void
  onZoomChange: (zoom: number) => void
}
