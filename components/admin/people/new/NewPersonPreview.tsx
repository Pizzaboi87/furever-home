import { CheckCircle2, Mail, Phone } from 'lucide-react'

import { PreviewRow } from '@/components/admin/common/PreviewRow'
import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/lib/pet-format'

import type { NewPersonFormValues } from './new-person-types'

type NewPersonPreviewProps = {
    values: NewPersonFormValues
    tags: string[]
}

const NewPersonPreview = ({ values, tags }: NewPersonPreviewProps) => {
    const { name, email, phone, address, preferredContactMethod, personType } = values
    const initials = name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || '??'

    return (
        <aside className="space-y-6">
            <SectionCard padding="md" delay={0.12}>
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Preview</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review the contact record before creating it.
                        </p>
                    </div>

                    <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>

                <div className="space-y-5">
                    <div className="rounded-xl border border-border bg-input p-4">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 font-bold text-primary">
                                {initials}
                            </div>

                            <div>
                                <p className="font-bold text-foreground">{name || 'Unnamed contact'}</p>
                                <p className="text-sm text-muted-foreground">{formatLabel(personType)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <PreviewRow label="Email" value={email} />
                            <PreviewRow label="Phone" value={phone} />
                            <PreviewRow label="Preferred contact" value={formatLabel(preferredContactMethod)} />
                            <PreviewRow label="Address" value={address} />
                            <PreviewRow label="Tags" value={tags.join(', ')} />
                        </div>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-primary">
                        After creation, you will land on the new person detail page. From there you can create a new case.
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <a
                            href={email ? `mailto:${email}` : undefined}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out ${
                                email
                                    ? 'text-foreground hover:scale-105 hover:border-primary hover:bg-indigo-50'
                                    : 'pointer-events-none text-muted-foreground opacity-50'
                            }`}
                        >
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            Email
                        </a>

                        <a
                            href={phone ? `tel:${phone}` : undefined}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out ${
                                phone
                                    ? 'text-foreground hover:scale-105 hover:border-primary hover:bg-indigo-50'
                                    : 'pointer-events-none text-muted-foreground opacity-50'
                            }`}
                        >
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            Call
                        </a>
                    </div>
                </div>
            </SectionCard>
        </aside>
    )
}

export default NewPersonPreview
