import Image from '@/components/ui/LoadingImage'
import { PawPrint, X } from 'lucide-react'

import { SectionHeading } from '@/components/admin/common/SectionHeading'
import type { AdminPet } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

type NewCasePetSectionProps = {
    selectedPet: AdminPet | undefined
    filteredPets: AdminPet[]
    selectedPetId: string
    petSearchTerm: string
    petDropdownOpen: boolean
    onPetSearchChange: (value: string) => void
    onPetDropdownOpenChange: (value: boolean) => void
    onSelectPet: (petId: string) => void
    onClearPet: () => void
}

export const NewCasePetSection = ({
    selectedPet,
    filteredPets,
    selectedPetId,
    petSearchTerm,
    petDropdownOpen,
    onPetSearchChange,
    onPetDropdownOpenChange,
    onSelectPet,
    onClearPet,
}: NewCasePetSectionProps) => (
    <section>
        <SectionHeading icon={<PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />}>
            Related pet
        </SectionHeading>

        <div
            className="relative"
            onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget

                if (
                    nextFocusedElement instanceof Node &&
                    event.currentTarget.contains(nextFocusedElement)
                ) {
                    return
                }

                onPetDropdownOpenChange(false)
            }}
        >
            <label className="text-sm font-semibold text-foreground">
                Search pet by name, ID, species, or status
                <div className="relative mt-2">
                    <input
                        value={petSearchTerm}
                        onChange={(event) => onPetSearchChange(event.target.value)}
                        onFocus={() => onPetDropdownOpenChange(true)}
                        placeholder="Start typing, e.g. Smokey, pet-0352, cat..."
                        className="w-full rounded-xl border border-border bg-input px-3 py-2.5 pr-11 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    {(selectedPetId || petSearchTerm) && (
                        <button
                            type="button"
                            onClick={onClearPet}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white hover:text-primary"
                            aria-label="Clear related pet"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </label>

            {petDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-white p-2 shadow-lg">
                    {filteredPets.map((pet) => (
                        <button
                            key={pet.id}
                            type="button"
                            onClick={() => onSelectPet(pet.id)}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-indigo-50"
                        >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-input">
                                <Image
                                    src={pet.image}
                                    alt={pet.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-foreground">{pet.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {pet.id} · {formatLabel(pet.species)} · {formatLabel(pet.status)}
                                </p>
                            </div>

                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-primary">
                                {pet.applications ?? 0} apps
                            </span>
                        </button>
                    ))}

                    {filteredPets.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border bg-input p-4 text-sm text-muted-foreground">
                            No pets match this search.
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClearPet}
                        className="mt-2 w-full cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50"
                    >
                        Continue without a related pet
                    </button>
                </div>
            )}
        </div>

        {selectedPet && (
            <div className="mt-4 flex gap-4 rounded-xl border border-border bg-input p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                        src={selectedPet.image}
                        alt={selectedPet.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                </div>

                <div>
                    <p className="font-bold text-foreground">{selectedPet.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {selectedPet.id} · {formatLabel(selectedPet.species)} · {selectedPet.age} years · {formatLabel(selectedPet.status)}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary">
                        Related pet selected. You can change or clear it before creating the case.
                    </p>
                </div>
            </div>
        )}

        {!selectedPet && (
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
                Leave empty for general, donation, volunteer, or non-pet-specific cases.
            </p>
        )}
    </section>
)
