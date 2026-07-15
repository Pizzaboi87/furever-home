import { Mars, SlidersHorizontal, Venus } from 'lucide-react'

import type { AdminPet } from '@/lib/admin/domain'
import { normalizeValue } from '@/lib/pet-format'

export const compatibilityOptions = [
  { value: 'kids', label: 'Kids' },
  { value: 'pets', label: 'Pets' },
  { value: 'calm-home', label: 'Calm Home' },
]

export const getGenderIcon = (gender: string) => {
  if (gender === 'male') {
    return <Mars className="h-4 w-4" aria-hidden="true" />
  }

  if (gender === 'female') {
    return <Venus className="h-4 w-4" aria-hidden="true" />
  }

  return <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
}

export const toggleSelectedValue = (currentValues: string[], nextValue: string) => {
  if (currentValues.includes(nextValue)) {
    return currentValues.filter((value) => value !== nextValue)
  }

  return [...currentValues, nextValue]
}

const matchesSelectedSizes = (selectedSizes: string[], size?: string) => {
  if (selectedSizes.length === 0) {
    return true
  }

  if (!size) {
    return false
  }

  return selectedSizes.includes(normalizeValue(size))
}

const matchesSelectedCompatibility = (
  selectedCompatibility: string[],
  goodWithChildren?: boolean,
  goodWithOtherAnimals?: boolean
) => {
  if (selectedCompatibility.length === 0) {
    return true
  }

  const wantsKids = selectedCompatibility.includes('kids')
  const wantsPets = selectedCompatibility.includes('pets')
  const wantsCalmHome = selectedCompatibility.includes('calm-home')

  if (wantsKids && !goodWithChildren) {
    return false
  }

  if (wantsPets && !goodWithOtherAnimals) {
    return false
  }

  if (wantsCalmHome && (goodWithChildren || goodWithOtherAnimals)) {
    return false
  }

  return true
}

export type BrowseFilterState = {
  selectedCategory: string
  minAge: number
  maxAge: number
  selectedGender: string
  selectedSizes: string[]
  selectedCompatibility: string[]
}

export const filterBrowsePets = (pets: AdminPet[], filters: BrowseFilterState) => {
  return pets.filter((pet) => {
    const matchCategory =
      filters.selectedCategory === 'all' ||
      normalizeValue(pet.species) === filters.selectedCategory
    const matchAge = pet.age >= filters.minAge && pet.age <= filters.maxAge
    const matchGender =
      filters.selectedGender === 'all' || normalizeValue(pet.gender) === filters.selectedGender
    const matchSize = matchesSelectedSizes(filters.selectedSizes, pet.size)
    const matchCompatibility = matchesSelectedCompatibility(
      filters.selectedCompatibility,
      pet.goodWithChildren,
      pet.goodWithOtherAnimals
    )

    return matchCategory && matchAge && matchGender && matchSize && matchCompatibility
  })
}
