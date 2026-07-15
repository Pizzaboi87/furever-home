import { CalendarDays, Ruler, Sparkles, Weight } from 'lucide-react'

import {
  FormField,
  adminInputClassName,
} from '@/components/admin/common/FormField'
import { formatLabel } from '@/lib/pet-format'

import type {
  NewPetDraft,
  NewPetFormSetters,
} from '../new-pet-types'

type NewPetPhysicalDetailsSectionProps = {
  draft: NewPetDraft
  setters: Pick<
    NewPetFormSetters,
    'setAge' | 'setAgeGroup' | 'setSize' | 'setWeight'
  >
  ageGroupValues: string[]
  sizeValues: string[]
}

export const NewPetPhysicalDetailsSection = ({
  draft,
  setters,
  ageGroupValues,
  sizeValues,
}: NewPetPhysicalDetailsSectionProps) => (
  <section>
    <div className="mb-4 flex items-center gap-2">
      <Ruler className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-bold text-foreground">Physical details</h3>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
      <FormField
        label={
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            Age
          </span>
        }
      >
        <input
          type="number"
          min="0"
          value={draft.age}
          onChange={(event) => setters.setAge(event.target.value)}
          className={adminInputClassName}
        />
      </FormField>

      <FormField
        label={
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            Age group
          </span>
        }
      >
        <select
          value={draft.ageGroup}
          onChange={(event) => setters.setAgeGroup(event.target.value)}
          className={adminInputClassName}
        >
          {ageGroupValues.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label={
          <span className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" aria-hidden="true" />
            Size
          </span>
        }
      >
        <select
          value={draft.size}
          onChange={(event) => setters.setSize(event.target.value)}
          className={adminInputClassName}
        >
          {sizeValues.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label={
          <span className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-primary" aria-hidden="true" />
            Weight
          </span>
        }
      >
        <input
          type="number"
          min="0"
          value={draft.weight}
          onChange={(event) => setters.setWeight(event.target.value)}
          className={adminInputClassName}
        />
      </FormField>
    </div>
  </section>
)
