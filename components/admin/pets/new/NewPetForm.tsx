import { NewPetBasicProfileSection } from './sections/NewPetBasicProfileSection'
import { NewPetFormActions } from './sections/NewPetFormActions'
import { NewPetHomeFitSection } from './sections/NewPetHomeFitSection'
import { NewPetImageSection } from './sections/NewPetImageSection'
import { NewPetPhysicalDetailsSection } from './sections/NewPetPhysicalDetailsSection'
import { NewPetShelterJourneySection } from './sections/NewPetShelterJourneySection'
import { NewPetStorySection } from './sections/NewPetStorySection'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from './new-pet-types'

type NewPetFormProps = {
  draft: NewPetDraft
  setters: NewPetFormSetters
  speciesValues: string[]
  genderValues: string[]
  statusValues: string[]
  sizeValues: string[]
  ageGroupValues: string[]
  createError: string
  isCreating: boolean
  isUploadingImage: boolean
  onUploadingImageChange: (isUploading: boolean) => void
  onSaveDraft: () => void
  onSubmit: () => void
}

export const NewPetForm = ({
  draft,
  setters,
  speciesValues,
  genderValues,
  statusValues,
  sizeValues,
  ageGroupValues,
  createError,
  isCreating,
  isUploadingImage,
  onUploadingImageChange,
  onSaveDraft,
  onSubmit,
}: NewPetFormProps) => (
  <form
    className="space-y-8"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    <NewPetBasicProfileSection
      draft={draft}
      setters={setters}
      speciesValues={speciesValues}
      genderValues={genderValues}
      statusValues={statusValues}
    />
    <NewPetPhysicalDetailsSection
      draft={draft}
      setters={setters}
      ageGroupValues={ageGroupValues}
      sizeValues={sizeValues}
    />
    <NewPetHomeFitSection draft={draft} setters={setters} />
    <NewPetShelterJourneySection draft={draft} setters={setters} />
    <NewPetStorySection draft={draft} setters={setters} />
    <NewPetImageSection
      draft={draft}
      setters={setters}
      isCreating={isCreating}
      onUploadingImageChange={onUploadingImageChange}
    />
    <NewPetFormActions
      createError={createError}
      isCreating={isCreating}
      isUploadingImage={isUploadingImage}
      onSaveDraft={onSaveDraft}
    />
  </form>
)
