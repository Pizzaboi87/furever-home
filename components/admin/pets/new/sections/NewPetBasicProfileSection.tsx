import { FileText } from 'lucide-react'

import {
  FormField,
  adminInputClassName,
} from '@/components/admin/common/FormField'
import { formatLabel } from '@/lib/pet-format'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type NewPetBasicProfileSectionProps = {
  draft: NewPetDraft
  setters: Pick<
    NewPetFormSetters,
    'setName' | 'setSpecies' | 'setGender' | 'setStatus'
  >
  speciesValues: string[]
  genderValues: string[]
  statusValues: string[]
}

export const NewPetBasicProfileSection = ({
  draft,
  setters,
  speciesValues,
  genderValues,
  statusValues,
}: NewPetBasicProfileSectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">Basic profile</h3>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField
        label="Pet name"
        hint="Shown on cards, detail pages, messages, and staff views."
      >
        <input
          type="text"
          required
          value={draft.name}
          onChange={(event) => setters.setName(event.target.value)}
          placeholder="e.g. Daisy"
          className={adminInputClassName}
        />
      </FormField>

      <FormField
        label="Species"
        hint="Used for browsing, filtering, and similar pet recommendations."
      >
        <select
          value={draft.species}
          onChange={(event) => setters.setSpecies(event.target.value)}
          className={adminInputClassName}
        >
          {speciesValues.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Gender"
        hint="Shown next to the species on public pet pages."
      >
        <select
          value={draft.gender}
          onChange={(event) => setters.setGender(event.target.value)}
          className={adminInputClassName}
        >
          {genderValues.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Adoption status"
        hint="Use reserved only when a meeting or adoption step is already in progress."
      >
        <select
          value={draft.status}
          onChange={(event) =>
            setters.setStatus(event.target.value as NewPetDraft['status'])
          }
          className={adminInputClassName}
        >
          {statusValues.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  </section>
)
