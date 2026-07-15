import { Clock } from 'lucide-react'

import {
  FormField,
  adminInputClassName,
} from '@/components/admin/common/FormField'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type NewPetShelterJourneySectionProps = {
  draft: NewPetDraft
  setters: Pick<NewPetFormSetters, 'setDaysInShelter' | 'setLastUpdated'>
}

export const NewPetShelterJourneySection = ({
  draft,
  setters,
}: NewPetShelterJourneySectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">Shelter journey</h3>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField
        label="Days in shelter"
        hint="This appears as a short shelter journey note on the pet detail page."
      >
        <input
          type="number"
          min="0"
          value={draft.daysInShelter}
          onChange={(event) => setters.setDaysInShelter(event.target.value)}
          className={adminInputClassName}
        />
      </FormField>

      <FormField
        label="Last updated"
        hint="Update this whenever the profile, status, or adoption notes change."
      >
        <input
          type="date"
          value={draft.lastUpdated}
          onChange={(event) => setters.setLastUpdated(event.target.value)}
          className={adminInputClassName}
        />
      </FormField>
    </div>
  </section>
)
