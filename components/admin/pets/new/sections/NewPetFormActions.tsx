import { Save } from 'lucide-react'

import { ActionButton } from '@/components/ui/ActionButton'

type NewPetFormActionsProps = {
  createError: string
  isCreating: boolean
  isUploadingImage: boolean
  onSaveDraft: () => void
}

export const NewPetFormActions = ({
  createError,
  isCreating,
  isUploadingImage,
  onSaveDraft,
}: NewPetFormActionsProps) => (
  <>
    {createError ? (
      <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
        {createError}
      </p>
    ) : null}

    <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
      <ActionButton
        type="button"
        variant="secondary"
        disabled={isCreating || isUploadingImage}
        onClick={onSaveDraft}
      >
        Save as draft
      </ActionButton>

      <ActionButton type="submit" disabled={isCreating || isUploadingImage}>
        <Save className="h-4 w-4" aria-hidden="true" />
        {isCreating ? 'Creating...' : 'Publish pet'}
      </ActionButton>
    </div>
  </>
)
