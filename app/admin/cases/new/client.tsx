'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { createCaseAction } from '@/actions/admin/cases/case-actions'
import Header from '@/components/admin/common/Header'
import SectionCard from '@/components/admin/common/SectionCard'
import { NewCaseAssignmentSection } from '@/components/admin/cases/NewCaseAssignmentSection'
import { NewCaseBasicsSection } from '@/components/admin/cases/NewCaseBasicsSection'
import { NewCasePersonSection } from '@/components/admin/cases/NewCasePersonSection'
import { NewCasePetSection } from '@/components/admin/cases/NewCasePetSection'
import { NewCasePreviewPanel } from '@/components/admin/cases/NewCasePreviewPanel'
import { ActionButton } from '@/components/ui/ActionButton'
import {
    buildIncomingCasePreview,
    type CreateIncomingCaseInput,
    type CreateIncomingCasePreview,
} from '@/lib/admin/case-create/case-preview-service'
import type {
    AdminPet,
    CasePriority,
    CaseType,
    ContactChannel,
    Person,
} from '@/lib/admin/domain'
import {
    filterPeopleForCase,
    filterPetsForCase,
    formatPersonAddress,
    formatPersonSearchLabel,
} from '@/utils/admin/cases/new-case-utils'

type NewCaseClientProps = {
    pets: AdminPet[]
    people: Person[]
}

const NewCaseForm = ({ pets, people }: NewCaseClientProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialPetId = searchParams.get('petId') ?? ''
    const initialPersonId = searchParams.get('personId') ?? ''
    const initialPerson = people.find((person) => person.id === initialPersonId)

    const [channel, setChannel] = useState<ContactChannel>(
        initialPerson?.preferredContactMethod ?? 'website_form',
    )
    const [type, setType] = useState<CaseType>('general_question')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [personName, setPersonName] = useState(initialPerson?.name ?? '')
    const [email, setEmail] = useState(initialPerson?.email ?? '')
    const [phone, setPhone] = useState(initialPerson?.phone ?? '')
    const [address, setAddress] = useState(formatPersonAddress(initialPerson))
    const [selectedPersonId, setSelectedPersonId] = useState(initialPersonId)
    const [personSearchTerm, setPersonSearchTerm] = useState(
        initialPerson ? formatPersonSearchLabel(initialPerson) : '',
    )
    const [personDropdownOpen, setPersonDropdownOpen] = useState(false)
    const [selectedPetId, setSelectedPetId] = useState(initialPetId)
    const [petSearchTerm, setPetSearchTerm] = useState('')
    const [petDropdownOpen, setPetDropdownOpen] = useState(false)
    const [assignedStaff, setAssignedStaff] = useState('Unassigned')
    const [priority, setPriority] = useState<CasePriority>('medium')
    const [preview, setPreview] = useState<CreateIncomingCasePreview | null>(null)
    const [previewInput, setPreviewInput] = useState<CreateIncomingCaseInput | null>(null)
    const [createError, setCreateError] = useState('')
    const [isCreating, startCreateTransition] = useTransition()

    const selectedPerson = useMemo(
        () => people.find((person) => String(person.id) === selectedPersonId),
        [people, selectedPersonId],
    )
    const selectedPet = useMemo(
        () => pets.find((pet) => String(pet.id) === selectedPetId),
        [pets, selectedPetId],
    )
    const filteredPeople = useMemo(
        () => filterPeopleForCase(people, personSearchTerm),
        [people, personSearchTerm],
    )
    const filteredPets = useMemo(
        () => filterPetsForCase(pets, petSearchTerm),
        [pets, petSearchTerm],
    )

    useEffect(() => {
        if (selectedPerson && !personSearchTerm) {
            setPersonSearchTerm(formatPersonSearchLabel(selectedPerson))
        }
    }, [personSearchTerm, selectedPerson])

    useEffect(() => {
        if (selectedPet && !petSearchTerm) {
            setPetSearchTerm(`${selectedPet.name} (${selectedPet.id})`)
        }
    }, [petSearchTerm, selectedPet])

    const clearManualContactFields = () => {
        setPersonName('')
        setEmail('')
        setPhone('')
        setAddress('')
    }

    const handlePersonSearchChange = (value: string) => {
        if (selectedPersonId) {
            clearManualContactFields()
        }

        setPersonSearchTerm(value)
        setSelectedPersonId('')
        setPersonDropdownOpen(true)
    }

    const handleSelectPerson = (personId: string) => {
        const nextPerson = people.find((person) => person.id === personId)

        if (!nextPerson) {
            return
        }

        setSelectedPersonId(nextPerson.id)
        setPersonSearchTerm(formatPersonSearchLabel(nextPerson))
        setPersonName(nextPerson.name)
        setEmail(nextPerson.email ?? '')
        setPhone(nextPerson.phone ?? '')
        setAddress(formatPersonAddress(nextPerson))
        setChannel(nextPerson.preferredContactMethod ?? 'website_form')
        setPersonDropdownOpen(false)
    }

    const handleClearPersonSearch = () => {
        setSelectedPersonId('')
        setPersonSearchTerm('')
        clearManualContactFields()
        setPersonDropdownOpen(false)
    }

    const handlePetSearchChange = (value: string) => {
        setPetSearchTerm(value)
        setSelectedPetId('')
        setPetDropdownOpen(true)
    }

    const handleSelectPet = (petId: string) => {
        const nextPet = pets.find((pet) => pet.id === petId)

        setSelectedPetId(petId)
        setPetSearchTerm(nextPet ? `${nextPet.name} (${nextPet.id})` : '')
        setPetDropdownOpen(false)
    }

    const handleClearPet = () => {
        setSelectedPetId('')
        setPetSearchTerm('')
        setPetDropdownOpen(false)
    }

    const buildInput = (): CreateIncomingCaseInput => ({
        channel,
        type,
        subject,
        message,
        priority,
        assignedStaff: assignedStaff === 'Unassigned' ? undefined : assignedStaff,
        petId: selectedPet?.id ?? null,
        petName: selectedPet?.name,
        person: {
            id: selectedPerson?.id,
            name: personName,
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
        },
        createdAt: new Date().toISOString(),
    })

    const handleBuildPreview = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setCreateError('')
        setPersonDropdownOpen(false)
        setPetDropdownOpen(false)

        const nextInput = buildInput()
        setPreviewInput(nextInput)
        setPreview(buildIncomingCasePreview(nextInput))
    }

    const handleCreateCase = () => {
        setCreateError('')

        startCreateTransition(async () => {
            try {
                const created = await createCaseAction(previewInput ?? buildInput())

                toast.success(`${created.case.id} was created.`)
                router.push(`/admin/cases/${created.case.id}`)
                router.refresh()
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Could not create the case. Please try again.'

                setCreateError(errorMessage)
                toast.error(errorMessage)
            }
        })
    }

    const clearSelectedPersonLink = () => setSelectedPersonId('')

    return (
        <main className="min-h-screen bg-background">
            <Header
                currentHref="/admin/cases/new"
                title="New Case"
                description="Record new questions, applications, donations, volunteers, and contacts."
            />

            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_430px]">
                <SectionCard padding="md">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground">Incoming contact</h2>
                        <p className="text-sm text-muted-foreground">
                            Choose existing Prisma people and pets, then capture the first case draft.
                        </p>
                    </div>

                    {selectedPerson && (
                        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                Existing contact selected
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                This case will be linked to {selectedPerson.name}.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleBuildPreview} className="space-y-8">
                        <NewCaseBasicsSection
                            channel={channel}
                            type={type}
                            subject={subject}
                            message={message}
                            onChannelChange={setChannel}
                            onTypeChange={setType}
                            onSubjectChange={setSubject}
                            onMessageChange={setMessage}
                        />

                        <NewCasePersonSection
                            selectedPerson={selectedPerson}
                            filteredPeople={filteredPeople}
                            selectedPersonId={selectedPersonId}
                            personSearchTerm={personSearchTerm}
                            personDropdownOpen={personDropdownOpen}
                            personName={personName}
                            email={email}
                            phone={phone}
                            address={address}
                            onPersonSearchChange={handlePersonSearchChange}
                            onPersonDropdownOpenChange={setPersonDropdownOpen}
                            onSelectPerson={handleSelectPerson}
                            onClearPersonSearch={handleClearPersonSearch}
                            onPersonNameChange={(value) => {
                                setPersonName(value)
                                clearSelectedPersonLink()
                            }}
                            onEmailChange={(value) => {
                                setEmail(value)
                                clearSelectedPersonLink()
                            }}
                            onPhoneChange={(value) => {
                                setPhone(value)
                                clearSelectedPersonLink()
                            }}
                            onAddressChange={(value) => {
                                setAddress(value)
                                clearSelectedPersonLink()
                            }}
                        />

                        <NewCasePetSection
                            selectedPet={selectedPet}
                            filteredPets={filteredPets}
                            selectedPetId={selectedPetId}
                            petSearchTerm={petSearchTerm}
                            petDropdownOpen={petDropdownOpen}
                            onPetSearchChange={handlePetSearchChange}
                            onPetDropdownOpenChange={setPetDropdownOpen}
                            onSelectPet={handleSelectPet}
                            onClearPet={handleClearPet}
                        />

                        <NewCaseAssignmentSection
                            assignedStaff={assignedStaff}
                            priority={priority}
                            onAssignedStaffChange={setAssignedStaff}
                            onPriorityChange={setPriority}
                        />

                        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex w-full flex-col justify-end gap-3 sm:flex-row">
                                <ActionButton type="submit" variant="secondary">
                                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                                    Generate preview
                                </ActionButton>

                                <ActionButton
                                    type="button"
                                    variant="primarySolid"
                                    disabled={!preview || isCreating}
                                    onClick={handleCreateCase}
                                >
                                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                                    {isCreating ? 'Creating...' : 'Create case'}
                                </ActionButton>
                            </div>
                        </div>

                        {createError && (
                            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                                {createError}
                            </p>
                        )}
                    </form>
                </SectionCard>

                <NewCasePreviewPanel preview={preview} />
            </div>
        </main>
    )
}

export default function NewCaseClient({ pets, people }: NewCaseClientProps) {
    return <NewCaseForm pets={pets} people={people} />
}
