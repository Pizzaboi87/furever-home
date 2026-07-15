'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { createPetAction } from '@/actions/admin/pets/pet-actions'
import Header from '@/components/admin/common/Header'
import SectionCard from '@/components/admin/common/SectionCard'
import { NewPetForm } from '@/components/admin/pets/new/NewPetForm'
import { NewPetSidebar } from '@/components/admin/pets/new/NewPetSidebar'
import type {
  NewPetDraft,
  NewPetFormSetters,
} from '@/components/admin/pets/new/new-pet-types'
import type { AdminPet, PetStatus } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'
import {
  buildNewPetInput,
  getUniquePetValues,
  newPetDraftStorageKey,
} from '@/utils/admin/pets/new-pet-utils'

type NewPetClientProps = {
  pets: AdminPet[]
}

export default function NewPetClient({ pets }: NewPetClientProps) {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const speciesValues = useMemo(
    () =>
      getUniquePetValues([
        'dog',
        'cat',
        'rabbit',
        ...pets.map((pet) => pet.species),
      ]),
    [pets],
  )
  const genderValues = useMemo(
    () =>
      getUniquePetValues([
        'female',
        'male',
        'unknown',
        ...pets.map((pet) => pet.gender),
      ]),
    [pets],
  )
  const statusValues = useMemo(
    () =>
      getUniquePetValues([
        'new',
        'available',
        'reserved',
        'adoption_in_progress',
        'adopted',
        ...pets
          .map((pet) => pet.status)
          .filter(
            (status) =>
              !['hidden', 'unavailable'].includes(normalizeValue(status)),
          ),
      ]),
    [pets],
  )
  const sizeValues = useMemo(
    () =>
      getUniquePetValues([
        'small',
        'medium',
        'large',
        ...pets.map((pet) => pet.size ?? ''),
      ]),
    [pets],
  )
  const ageGroupValues = useMemo(
    () =>
      getUniquePetValues([
        'baby',
        'young',
        'adult',
        'senior',
        ...pets.map((pet) => pet.ageGroup ?? ''),
      ]),
    [pets],
  )

  const [name, setName] = useState('')
  const [species, setSpecies] = useState(speciesValues[0] ?? 'dog')
  const [gender, setGender] = useState(genderValues[0] ?? 'unknown')
  const [status, setStatus] = useState<PetStatus>('new')
  const [age, setAge] = useState('1')
  const [ageGroup, setAgeGroup] = useState(ageGroupValues[0] ?? 'young')
  const [size, setSize] = useState(sizeValues[0] ?? 'medium')
  const [weight, setWeight] = useState('10')
  const [daysInShelter, setDaysInShelter] = useState('0')
  const [lastUpdated, setLastUpdated] = useState(today)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imageCloudinaryPublicId, setImageCloudinaryPublicId] = useState('')
  const [imageThumbnailUrl, setImageThumbnailUrl] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [goodWithChildren, setGoodWithChildren] = useState(false)
  const [goodWithOtherAnimals, setGoodWithOtherAnimals] = useState(false)
  const [neutered, setNeutered] = useState(false)
  const [createError, setCreateError] = useState('')
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false)

  const draft = useMemo<NewPetDraft>(
    () => ({
      name,
      species,
      gender,
      status,
      age,
      ageGroup,
      size,
      weight,
      daysInShelter,
      lastUpdated,
      description,
      image,
      imageCloudinaryPublicId,
      imageThumbnailUrl,
      goodWithChildren,
      goodWithOtherAnimals,
      neutered,
    }),
    [
      age,
      ageGroup,
      daysInShelter,
      description,
      gender,
      goodWithChildren,
      goodWithOtherAnimals,
      image,
      imageCloudinaryPublicId,
      imageThumbnailUrl,
      lastUpdated,
      name,
      neutered,
      size,
      species,
      status,
      weight,
    ],
  )

  const setters = useMemo<NewPetFormSetters>(
    () => ({
      setName,
      setSpecies,
      setGender,
      setStatus,
      setAge,
      setAgeGroup,
      setSize,
      setWeight,
      setDaysInShelter,
      setLastUpdated,
      setDescription,
      setImage,
      setImageCloudinaryPublicId,
      setImageThumbnailUrl,
      setGoodWithChildren,
      setGoodWithOtherAnimals,
      setNeutered,
    }),
    [],
  )

  useEffect(() => {
    try {
      const storedDraft = window.sessionStorage.getItem(newPetDraftStorageKey)

      if (storedDraft) {
        const parsedDraft = JSON.parse(storedDraft) as Partial<NewPetDraft>

        setName(parsedDraft.name ?? '')
        setSpecies(parsedDraft.species ?? speciesValues[0] ?? 'dog')
        setGender(parsedDraft.gender ?? genderValues[0] ?? 'unknown')
        setStatus(parsedDraft.status ?? 'new')
        setAge(parsedDraft.age ?? '1')
        setAgeGroup(parsedDraft.ageGroup ?? ageGroupValues[0] ?? 'young')
        setSize(parsedDraft.size ?? sizeValues[0] ?? 'medium')
        setWeight(parsedDraft.weight ?? '10')
        setDaysInShelter(parsedDraft.daysInShelter ?? '0')
        setLastUpdated(parsedDraft.lastUpdated ?? today)
        setDescription(parsedDraft.description ?? '')
        setImage(parsedDraft.image ?? '')
        setImageCloudinaryPublicId(parsedDraft.imageCloudinaryPublicId ?? '')
        setImageThumbnailUrl(parsedDraft.imageThumbnailUrl ?? '')
        setGoodWithChildren(Boolean(parsedDraft.goodWithChildren))
        setGoodWithOtherAnimals(Boolean(parsedDraft.goodWithOtherAnimals))
        setNeutered(Boolean(parsedDraft.neutered))
      }
    } catch {
      window.sessionStorage.removeItem(newPetDraftStorageKey)
    } finally {
      setHasRestoredDraft(true)
    }
  }, [ageGroupValues, genderValues, sizeValues, speciesValues, today])

  useEffect(() => {
    if (hasRestoredDraft) {
      window.sessionStorage.setItem(newPetDraftStorageKey, JSON.stringify(draft))
    }
  }, [draft, hasRestoredDraft])

  const handleCreatePet = (statusOverride?: PetStatus, isPublished = true) => {
    setCreateError('')

    if (draft.name.trim().length <= 1 || draft.description.trim().length <= 10) {
      const message =
        'Please enter a pet name and a useful public description before creating the profile.'

      setCreateError(message)
      toast.error(message)
      return
    }

    startCreateTransition(async () => {
      try {
        const createdPet = await createPetAction(
          buildNewPetInput(draft, statusOverride, isPublished),
        )

        window.sessionStorage.removeItem(newPetDraftStorageKey)
        toast.success(`${createdPet.name} was created.`)
        router.push(`/admin/pets/${createdPet.id}`)
        router.refresh()
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Could not create this pet in Prisma. Please try again.'

        setCreateError(message)
        toast.error(message)
      }
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/pets/new"
        title="New Pet"
        description="Create shelter pet profiles for admin records and public adoption listings."
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <SectionCard padding="md" className="rounded-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Pet profile details
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill out the public profile with enough detail for adopters to
                understand the pet&apos;s needs, personality, and ideal home.
              </p>
            </div>

            <NewPetForm
              draft={draft}
              setters={setters}
              speciesValues={speciesValues}
              genderValues={genderValues}
              statusValues={statusValues}
              sizeValues={sizeValues}
              ageGroupValues={ageGroupValues}
              createError={createError}
              isCreating={isCreating}
              isUploadingImage={isUploadingImage}
              onUploadingImageChange={setIsUploadingImage}
              onSaveDraft={() => handleCreatePet('new', false)}
              onSubmit={() => handleCreatePet()}
            />
          </SectionCard>

          <NewPetSidebar draft={draft} />
        </div>
      </div>
    </main>
  )
}
