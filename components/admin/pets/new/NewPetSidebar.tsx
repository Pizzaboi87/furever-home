import { CheckCircle2 } from 'lucide-react'

import { PreviewRow } from '@/components/admin/common/PreviewRow'
import MotionReveal from '@/components/ui/MotionReveal'
import { formatLabel } from '@/lib/pet-format'

import type { NewPetDraft } from './new-pet-types'

const workflowSteps = [
  ['1', 'Create profile', 'Add the basic identity, adoption status, and physical details.'],
  ['2', 'Add home fit notes', 'Mark compatibility carefully so adopters can filter responsibly.'],
  ['3', 'Write the story', 'Describe the pet honestly, warmly, and with practical adoption context.'],
  ['4', 'Review & publish', 'Check the profile, image, and status before making it public.'],
]

const profileGuidelines = [
  'Use clear, realistic descriptions.',
  'Mention energy level, daily needs, and the kind of home that would work best.',
  'Only mark compatibility options when staff have enough confidence in them.',
  'Keep status up to date so public badges do not mislead visitors.',
]

export const NewPetSidebar = ({ draft }: { draft: NewPetDraft }) => (
  <MotionReveal
    className="self-start rounded-lg border border-border bg-white p-6 shadow-sm xl:sticky xl:top-6"
    delay={0.12}
  >
    <h2 className="text-xl font-bold text-foreground">Create workflow</h2>

    <div className="mt-5 space-y-4">
      {workflowSteps.map(([step, title, detail]) => (
        <div
          key={step}
          className="flex gap-3 rounded-lg border border-border bg-input p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-[#5f57e7] to-primary text-sm font-bold text-primary-foreground">
            {step}
          </span>
          <div>
            <p className="font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 rounded-lg border border-primary/20 bg-secondary/50 p-4">
      <CheckCircle2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
      <p className="font-semibold text-foreground">Profile quality note</p>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        {profileGuidelines.map((guideline) => (
          <li key={guideline} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{guideline}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-6 rounded-lg border border-border bg-input p-4">
      <p className="mb-4 font-semibold text-foreground">Preview</p>
      <div className="space-y-4">
        <PreviewRow label="Name" value={draft.name} />
        <PreviewRow label="Species" value={formatLabel(draft.species)} />
        <PreviewRow label="Gender" value={formatLabel(draft.gender)} />
        <PreviewRow label="Status" value={formatLabel(draft.status)} />
        <PreviewRow label="Age" value={draft.age ? `${draft.age} years` : null} />
        <PreviewRow label="Age group" value={formatLabel(draft.ageGroup)} />
        <PreviewRow label="Size" value={formatLabel(draft.size)} />
        <PreviewRow label="Weight" value={draft.weight ? `${draft.weight} kg` : null} />
        <PreviewRow label="Good with children" value={draft.goodWithChildren} />
        <PreviewRow label="Good with other animals" value={draft.goodWithOtherAnimals} />
        <PreviewRow label="Neutered" value={draft.neutered} />
      </div>
    </div>
  </MotionReveal>
)
