'use client'

import Cropper from 'react-easy-crop'
import { Loader2, Move, X } from 'lucide-react'

import ModalTransition from '@/components/ui/ModalTransition'

import type { PetImageCropModalProps } from './pet-image-upload-types'

export const PetImageCropModal = ({
  crop,
  cropPixels,
  isUploading,
  previewUrl,
  zoom,
  onCancel,
  onCropChange,
  onCropComplete,
  onUpload,
  onZoomChange,
}: PetImageCropModalProps) => {
  return (
    <ModalTransition
      isOpen
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
      panelClassName="w-full max-w-lg rounded-2xl border border-border bg-white p-5 shadow-2xl"
    >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Crop primary image</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag the image and use zoom until the square crop looks right.
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={onCancel}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close cropper</span>
          </button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-90 overflow-hidden rounded-xl border border-border bg-slate-100">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_, croppedAreaPixels) => onCropComplete(croppedAreaPixels)}
            classes={{ containerClassName: 'rounded-xl' }}
          />
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Zoom
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              disabled={isUploading}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </label>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Move className="h-3.5 w-3.5" aria-hidden="true" />
            Drag inside the square to position the crop.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isUploading}
            onClick={onCancel}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isUploading || !cropPixels}
            onClick={onUpload}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isUploading ? 'Uploading...' : 'Use cropped image'}
          </button>
        </div>
    </ModalTransition>
  )
}
