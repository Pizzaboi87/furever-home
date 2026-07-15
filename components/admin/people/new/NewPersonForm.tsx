import { ArrowLeft, Mail, MapPin, PlusCircle, Tag, UserRound } from 'lucide-react'

import { ActionButton, ActionLink } from '@/components/ui/ActionButton'
import { FormField, adminInputClassName, adminTextareaClassName } from '@/components/admin/common/FormField'
import { SectionHeading } from '@/components/admin/common/SectionHeading'
import { CANONICAL_CONTACT_CHANNEL_OPTIONS, type ContactChannel } from '@/lib/admin/domain'
import { formatLabel } from '@/lib/pet-format'

import type { NewPersonFormSetters, NewPersonFormValues } from './new-person-types'

const personTypeOptions = [
    'applicant',
    'donor',
    'volunteer',
    'foster',
    'partner',
    'contact',
]

type NewPersonFormProps = {
    values: NewPersonFormValues
    setters: NewPersonFormSetters
    canCreate: boolean
    isCreating: boolean
    createError: string
    onSubmit: () => void
}

const NewPersonForm = ({
    values,
    setters,
    canCreate,
    isCreating,
    createError,
    onSubmit,
}: NewPersonFormProps) => {
    const {
        name,
        email,
        phone,
        address,
        preferredContactMethod,
        personType,
        extraTags,
    } = values
    const {
        setName,
        setEmail,
        setPhone,
        setAddress,
        setPreferredContactMethod,
        setPersonType,
        setExtraTags,
    } = setters

    return (
        <>
            <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Contact profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the basic identity, communication details, and CRM tags for this contact.
                    </p>
                </div>

                <ActionLink href="/admin/people" variant="secondary" size="sm">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to people
                </ActionLink>
            </div>

            <form
                className="space-y-8"
                onSubmit={(event) => {
                    event.preventDefault()
                    onSubmit()
                }}
            >
                <section>
                    <SectionHeading icon={<UserRound className="h-4 w-4 text-primary" aria-hidden="true" />}>
                        Basic details
                    </SectionHeading>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField label="Full name">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Mia Clark"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Person type">
                            <select
                                value={personType}
                                onChange={(event) => setPersonType(event.target.value)}
                                className={adminInputClassName}
                            >
                                {personTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>
                </section>

                <section>
                    <SectionHeading icon={<Mail className="h-4 w-4 text-primary" aria-hidden="true" />}>
                        Communication
                    </SectionHeading>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <FormField label="Email">
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="mia@example.com"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Phone">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="+1 555 0199"
                                className={adminInputClassName}
                            />
                        </FormField>

                        <FormField label="Preferred contact">
                            <select
                                value={preferredContactMethod}
                                onChange={(event) =>
                                    setPreferredContactMethod(event.target.value as ContactChannel)
                                }
                                className={adminInputClassName}
                            >
                                {CANONICAL_CONTACT_CHANNEL_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {formatLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>
                </section>

                <section>
                    <SectionHeading icon={<MapPin className="h-4 w-4 text-primary" aria-hidden="true" />}>
                        Address
                    </SectionHeading>

                    <FormField label="Address" className="block">
                        <textarea
                            rows={3}
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Street, city, state, zip, country"
                            className={adminTextareaClassName}
                        />
                    </FormField>
                </section>

                <section>
                    <SectionHeading icon={<Tag className="h-4 w-4 text-primary" aria-hidden="true" />}>
                        CRM tags
                    </SectionHeading>

                    <FormField
                        label="Extra tags"
                        className="block"
                        hint="Separate tags with commas. The selected person type is added automatically as the first tag."
                    >
                        <input
                            type="text"
                            value={extraTags}
                            onChange={(event) => setExtraTags(event.target.value)}
                            placeholder="high_intent, event_lead, follow_up"
                            className={adminInputClassName}
                        />
                    </FormField>
                </section>

                {createError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                        {createError}
                    </p>
                ) : null}

                <div className="flex w-full flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
                    <ActionButton type="submit" disabled={!canCreate || isCreating}>
                        <PlusCircle className="h-4 w-4" aria-hidden="true" />
                        {isCreating ? 'Creating...' : 'Create person'}
                    </ActionButton>
                </div>
            </form>
        </>
    )
}

export default NewPersonForm
