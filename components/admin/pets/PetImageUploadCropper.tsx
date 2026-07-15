'use client'

import { useEffect, useRef, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'
import { ImagePlus, Loader2 } from 'lucide-react'

import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import { PetImageCropModal } from '@/components/admin/pets/image-upload/PetImageCropModal'
import type {
  PetImageUploadCropperProps,
  UploadedPetImageResponse,
} from '@/components/admin/pets/image-upload/pet-image-upload-types'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  createCroppedSquareFile,
  uploadPetImage,
} from '@/utils/admin/pets/pet-image-upload-utils'

export type { UploadedPetImageResponse }

const INITIAL_CROP: Point = { x: 0, y: 0 }

export default function PetImageUploadCropper({
  disabled = false,
  petId,
  helperText = 'Choose a JPG, PNG, or WebP image, crop it to a square, then upload it to Cloudinary.',
  onUploaded,
  onUploadingChange,
  onError,
}: PetImageUploadCropperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [crop, setCrop] = useState<Point>(INITIAL_CROP)
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  useBodyScrollLock(Boolean(selectedFile && previewUrl))

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  const closeCropper = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(null)
    setPreviewUrl('')
    setCrop(INITIAL_CROP)
    setZoom(1)
    setCropPixels(null)
  }

  const reportError = (message: string) => {
    setError(message)
    onError?.(message)
  }

  const handleFileChange = (file: File | undefined) => {
    reportError('')

    if (!file) {
      return
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      reportError('Only JPG, PNG, and WebP images are supported.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      reportError('Image must be smaller than 8 MB.')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCrop(INITIAL_CROP)
    setZoom(1)
    setCropPixels(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl || !cropPixels) {
      return
    }

    setIsUploading(true)
    reportError('')

    try {
      const croppedFile = await createCroppedSquareFile({
        imageUrl: previewUrl,
        fileName: selectedFile.name,
        cropPixels,
      })
      const uploadedImage = await uploadPetImage(croppedFile, petId)

      onUploaded(uploadedImage)
      closeCropper()
    } catch (uploadError) {
      reportError(uploadError instanceof Error ? uploadError.message : 'Could not upload this image.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled || isUploading}
        onChange={(event) => {
          handleFileChange(event.target.files?.[0])
          event.target.value = ''
        }}
        className="sr-only"
      />

      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
        {isUploading ? 'Uploading image...' : 'Choose and crop image'}
      </button>

      <p className="text-xs text-muted-foreground">{helperText}</p>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {selectedFile && previewUrl ? (
        <PetImageCropModal
          crop={crop}
          cropPixels={cropPixels}
          isUploading={isUploading}
          previewUrl={previewUrl}
          zoom={zoom}
          onCancel={closeCropper}
          onCropChange={setCrop}
          onCropComplete={setCropPixels}
          onUpload={() => void handleUpload()}
          onZoomChange={setZoom}
        />
      ) : null}
    </div>
  )
}
