import { HeartHandshake } from 'lucide-react'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type CompatibilityOptionProps = {
  checked: boolean
  title: string
  description: string
  onChange: (checked: boolean) => void
}

const CompatibilityOption = ({
  checked,
  title,
  description,
  onChange,
}: CompatibilityOptionProps) => (
  <label className="flex cursor-pointer gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary hover:bg-indigo-50">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-1 h-5 w-5 cursor-pointer accent-primary focus:ring-primary"
    />
    <span>
      <span className="block font-semibold text-foreground">{title}</span>
      <span className="mt-1 block text-sm text-muted-foreground">
        {description}
      </span>
    </span>
  </label>
)

type NewPetHomeFitSectionProps = {
  draft: NewPetDraft
  setters: Pick<
    NewPetFormSetters,
    'setGoodWithChildren' | 'setGoodWithOtherAnimals' | 'setNeutered'
  >
}

export const NewPetHomeFitSection = ({
  draft,
  setters,
}: NewPetHomeFitSectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">
        Home fit and health
      </h3>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <CompatibilityOption
        checked={draft.goodWithChildren}
        onChange={setters.setGoodWithChildren}
        title="Good with children"
        description="Select only if the pet has shown calm, safe behavior around children."
      />
      <CompatibilityOption
        checked={draft.goodWithOtherAnimals}
        onChange={setters.setGoodWithOtherAnimals}
        title="Good with other animals"
        description="Select if the pet has done well with other pets or supervised introductions."
      />
      <CompatibilityOption
        checked={draft.neutered}
        onChange={setters.setNeutered}
        title="Neutered"
        description="Use this when the health record confirms the pet has been neutered."
      />
    </div>
  </section>
)
