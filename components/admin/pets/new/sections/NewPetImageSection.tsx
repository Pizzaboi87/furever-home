import Image from '@/components/ui/LoadingImage'
import { ImagePlus } from 'lucide-react'

import {
  FormField,
  adminInputClassName,
} from '@/components/admin/common/FormField'
import PetImageUploadCropper from '@/components/admin/pets/PetImageUploadCropper'
import { fallbackPetImage } from '@/utils/admin/pets/new-pet-utils'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type NewPetImageSectionProps = {
  draft: NewPetDraft
  setters: Pick<
    NewPetFormSetters,
    'setImage' | 'setImageCloudinaryPublicId' | 'setImageThumbnailUrl'
  >
  isCreating: boolean
  onUploadingImageChange: (isUploading: boolean) => void
}

export const NewPetImageSection = ({
  draft,
  setters,
  isCreating,
  onUploadingImageChange,
}: NewPetImageSectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <ImagePlus className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">Primary image</h3>
    </div>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-input">
        <Image
          src={draft.image || fallbackPetImage}
          alt={draft.name || 'Pet image preview'}
          fill
          sizes="(min-width: 1024px) 220px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <PetImageUploadCropper
          disabled={isCreating}
          onUploadingChange={onUploadingImageChange}
          onUploaded={(uploadedImage) => {
            setters.setImage(uploadedImage.secureUrl)
            setters.setImageCloudinaryPublicId(uploadedImage.cloudinaryPublicId)
            setters.setImageThumbnailUrl(
              uploadedImage.thumbnailUrl ?? uploadedImage.secureUrl,
            )
          }}
        />

        <FormField label="Existing image URL or local path" className="block">
          <input
            type="text"
            value={draft.image}
            onChange={(event) => {
              setters.setImage(event.target.value)
              setters.setImageCloudinaryPublicId('')
              setters.setImageThumbnailUrl('')
            }}
            placeholder="/images/assets/pet-placeholder.png"
            className={adminInputClassName}
          />
        </FormField>
      </div>
    </div>
  </section>
)
