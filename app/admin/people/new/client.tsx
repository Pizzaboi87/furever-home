'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useMemo, useState, useTransition } from 'react'

import { createPersonAction } from '@/actions/admin/people/person-actions'
import Header from '@/components/admin/common/Header'
import SectionCard from '@/components/admin/common/SectionCard'
import NewPersonForm from '@/components/admin/people/new/NewPersonForm'
import NewPersonPreview from '@/components/admin/people/new/NewPersonPreview'
import type { ContactChannel } from '@/lib/admin/domain'

export default function NewPersonPage() {
    const router = useRouter()
    const [isCreating, startCreateTransition] = useTransition()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [preferredContactMethod, setPreferredContactMethod] = useState<ContactChannel>('email')
    const [personType, setPersonType] = useState('contact')
    const [extraTags, setExtraTags] = useState('')
    const [createError, setCreateError] = useState('')

    const tags = useMemo(() => {
        return [
            personType,
            ...extraTags
                .split(',')
                .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, '_'))
                .filter(Boolean),
        ].filter(Boolean)
    }, [extraTags, personType])

    const canCreate = name.trim().length > 1
    const values = {
        name,
        email,
        phone,
        address,
        preferredContactMethod,
        personType,
        extraTags,
    }
    const setters = {
        setName,
        setEmail,
        setPhone,
        setAddress,
        setPreferredContactMethod,
        setPersonType,
        setExtraTags,
    }

    const handleCreatePerson = () => {
        setCreateError('')

        if (!canCreate) {
            const message = 'Please enter a contact name before creating the person.'

            setCreateError(message)
            toast.error(message)
            return
        }

        startCreateTransition(async () => {
            try {
                const createdPerson = await createPersonAction({
                    name: name.trim(),
                    email: email.trim() || null,
                    phone: phone.trim() || null,
                    address: address.trim() || null,
                    preferredContactMethod,
                    tags,
                })

                toast.success(`${createdPerson.name} was created.`)
                router.push(`/admin/people/${createdPerson.id}`)
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'Could not create this person. Please try again.'

                setCreateError(message)
                toast.error(message)
            }
        })
    }

    return (
        <main className="min-h-screen bg-background">
            <Header
                currentHref="/admin/people/new"
                title="New person"
                description="Create a new contact profile for applicants, donors, volunteers, partners, or general contacts."
            />

            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
                <SectionCard padding="md">
                    <NewPersonForm
                        values={values}
                        setters={setters}
                        canCreate={canCreate}
                        isCreating={isCreating}
                        createError={createError}
                        onSubmit={handleCreatePerson}
                    />
                </SectionCard>

                <NewPersonPreview values={values} tags={tags} />
            </div>
        </main>
    )
}
