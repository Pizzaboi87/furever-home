import { FileText } from 'lucide-react'

import {
  FormField,
  adminTextareaClassName,
} from '@/components/admin/common/FormField'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type NewPetStorySectionProps = {
  draft: NewPetDraft
  setters: Pick<NewPetFormSetters, 'setDescription'>
}

export const NewPetStorySection = ({
  draft,
  setters,
}: NewPetStorySectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">Public story</h3>
    </div>

    <FormField
      label="Description"
      hint="This should help adopters decide whether the pet could realistically fit into their home."
      className="block"
    >
      <textarea
        required
        rows={8}
        value={draft.description}
        onChange={(event) => setters.setDescription(event.target.value)}
        placeholder="Write a warm, useful profile summary. Include the pet's background, personality, daily needs, health, and what kind of home would suit them."
        className={adminTextareaClassName}
      />
    </FormField>
  </section>
)
