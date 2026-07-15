'use client'

import { useMemo, useState } from 'react'

import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import BrowseFilters from '@/components/pets/browse/BrowseFilters'
import BrowseResults from '@/components/pets/browse/BrowseResults'
import type { AdminPet } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'
import { filterBrowsePets } from '@/utils/pets/browse-utils'

type BrowseClientProps = {
  pets: AdminPet[]
}

export default function BrowseClient({ pets }: BrowseClientProps) {
  const categories = useMemo(
    () => ['all', ...new Set(pets.map((pet) => normalizeValue(pet.species)))],
    [pets]
  )
  const genders = useMemo(
    () => ['all', ...new Set(pets.map((pet) => normalizeValue(pet.gender)))],
    [pets]
  )
  const sizes = useMemo(
    () => [
      ...new Set(
        pets
          .map((pet) => (pet.size ? normalizeValue(pet.size) : ''))
          .filter(Boolean)
      ),
    ],
    [pets]
  )
  const maxPetAge = useMemo(() => Math.max(0, ...pets.map((pet) => pet.age)), [pets])

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(maxPetAge)
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCompatibility, setSelectedCompatibility] = useState<string[]>([])

  const activeFilterCount = [
    selectedCategory !== 'all',
    minAge !== 0 || maxAge !== maxPetAge,
    selectedGender !== 'all',
    selectedSizes.length > 0,
    selectedCompatibility.length > 0,
  ].filter(Boolean).length

  const filteredPets = useMemo(
    () =>
      filterBrowsePets(pets, {
        selectedCategory,
        minAge,
        maxAge,
        selectedGender,
        selectedSizes,
        selectedCompatibility,
      }),
    [
      pets,
      selectedCategory,
      minAge,
      maxAge,
      selectedGender,
      selectedSizes,
      selectedCompatibility,
    ]
  )

  const resetFilters = () => {
    setSelectedCategory('all')
    setMinAge(0)
    setMaxAge(maxPetAge)
    setSelectedGender('all')
    setSelectedSizes([])
    setSelectedCompatibility([])
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Browse All Pets
            </h1>
            <p className="text-muted-foreground">
              Use the filters below to find your perfect companion
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <BrowseFilters
              categories={categories}
              genders={genders}
              sizes={sizes}
              maxPetAge={maxPetAge}
              activeFilterCount={activeFilterCount}
              selectedCategory={selectedCategory}
              minAge={minAge}
              maxAge={maxAge}
              selectedGender={selectedGender}
              selectedSizes={selectedSizes}
              selectedCompatibility={selectedCompatibility}
              onCategoryChange={setSelectedCategory}
              onAgeChange={([nextMinAge, nextMaxAge]) => {
                setMinAge(nextMinAge)
                setMaxAge(nextMaxAge)
              }}
              onGenderChange={setSelectedGender}
              onSizesChange={setSelectedSizes}
              onCompatibilityChange={setSelectedCompatibility}
              onReset={resetFilters}
            />
            <BrowseResults pets={filteredPets} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
