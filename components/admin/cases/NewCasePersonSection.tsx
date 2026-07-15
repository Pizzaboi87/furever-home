import { UserRound, X } from 'lucide-react'

import { FormField, adminInputClassName } from '@/components/admin/common/FormField'
import { SectionHeading } from '@/components/admin/common/SectionHeading'
import type { Person } from '@/lib/admin/domain'
import { formatPersonAddress } from '@/utils/admin/cases/new-case-utils'

type NewCasePersonSectionProps = {
    selectedPerson: Person | undefined
    filteredPeople: Person[]
    selectedPersonId: string
    personSearchTerm: string
    personDropdownOpen: boolean
    personName: string
    email: string
    phone: string
    address: string
    onPersonSearchChange: (value: string) => void
    onPersonDropdownOpenChange: (value: boolean) => void
    onSelectPerson: (personId: string) => void
    onClearPersonSearch: () => void
    onPersonNameChange: (value: string) => void
    onEmailChange: (value: string) => void
    onPhoneChange: (value: string) => void
    onAddressChange: (value: string) => void
}

export const NewCasePersonSection = ({
    selectedPerson,
    filteredPeople,
    selectedPersonId,
    personSearchTerm,
    personDropdownOpen,
    personName,
    email,
    phone,
    address,
    onPersonSearchChange,
    onPersonDropdownOpenChange,
    onSelectPerson,
    onClearPersonSearch,
    onPersonNameChange,
    onEmailChange,
    onPhoneChange,
    onAddressChange,
}: NewCasePersonSectionProps) => (
    <section>
        <SectionHeading icon={<UserRound className="h-4 w-4 text-primary" aria-hidden="true" />}>
            Person / contact
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
                className="relative md:col-span-2"
                onBlur={(event) => {
                    const nextFocusedElement = event.relatedTarget

                    if (
                        nextFocusedElement instanceof Node &&
                        event.currentTarget.contains(nextFocusedElement)
                    ) {
                        return
                    }

                    onPersonDropdownOpenChange(false)
                }}
            >
                <label className="text-sm font-semibold text-foreground">
                    Search existing person by name, email, or phone
                    <div className="relative mt-2">
                        <input
                            value={personSearchTerm}
                            onChange={(event) => onPersonSearchChange(event.target.value)}
                            onFocus={() => onPersonDropdownOpenChange(true)}
                            placeholder="Start typing, e.g. Mia Green, mia@example.com, +1 555..."
                            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 pr-11 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />

                        {(selectedPersonId || personSearchTerm) && (
                            <button
                                type="button"
                                onClick={onClearPersonSearch}
                                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white hover:text-primary"
                                aria-label="Clear selected person"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </label>

                {personDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-white p-2 shadow-lg">
                        {filteredPeople.map((person) => (
                            <button
                                key={person.id}
                                type="button"
                                onClick={() => onSelectPerson(person.id)}
                                className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-indigo-50"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                                    <UserRound className="h-5 w-5" aria-hidden="true" />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-bold text-foreground">
                                        {person.name}
                                    </span>

                                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                        {[person.email, person.phone].filter(Boolean).join(' · ') || person.id}
                                    </span>
                                </span>
                            </button>
                        ))}

                        {filteredPeople.length === 0 && (
                            <div className="rounded-lg border border-dashed border-border bg-input p-4 text-sm text-muted-foreground">
                                No existing people match this search. Continue by filling in a new contact manually.
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onClearPersonSearch}
                            className="mt-2 w-full cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50"
                        >
                            Continue as a new contact
                        </button>
                    </div>
                )}
            </div>

            {selectedPerson && (
                <div className="rounded-xl border border-border bg-input p-4 md:col-span-2">
                    <p className="font-bold text-foreground">{selectedPerson.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {[selectedPerson.email, selectedPerson.phone].filter(Boolean).join(' · ') || selectedPerson.id}
                    </p>
                    {formatPersonAddress(selectedPerson) && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {formatPersonAddress(selectedPerson)}
                        </p>
                    )}
                    <p className="mt-2 text-xs font-semibold text-primary">
                        Existing person selected. Clear the selection to create a new contact instead.
                    </p>
                </div>
            )}

            <input type="hidden" name="personId" value={selectedPerson?.id ?? ''} />

            {!selectedPerson && (
                <>
                    <FormField label="Full name">
                        <input
                            required
                            value={personName}
                            onChange={(event) => onPersonNameChange(event.target.value)}
                            placeholder="Anna Kovacs"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <FormField label="Email">
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => onEmailChange(event.target.value)}
                            placeholder="anna@example.com"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <FormField label="Phone">
                        <input
                            value={phone}
                            onChange={(event) => onPhoneChange(event.target.value)}
                            placeholder="+1 555 0100"
                            className={adminInputClassName}
                        />
                    </FormField>

                    <FormField label="Address optional">
                        <input
                            value={address}
                            onChange={(event) => onAddressChange(event.target.value)}
                            placeholder="Street, city"
                            className={adminInputClassName}
                        />
                    </FormField>
                </>
            )}
        </div>
    </section>
)
