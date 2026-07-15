import { formatLabel, normalizeValue } from '@/lib/pet-format'
import type { AdminPet } from '@/lib/admin/domain'

export const formatPetDate = (value: string | undefined | null) => {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getPetSpeciesValues = (pets: AdminPet[]) => {
  return [...new Set(pets.map((pet) => normalizeValue(pet.species)).filter(Boolean))]
}

export const getPetStatusValues = (pets: AdminPet[]) => {
  return [...new Set(pets.map((pet) => normalizeValue(pet.status)).filter(Boolean))]
}

export const getFilteredPets = ({
  pets,
  searchTerm,
  speciesFilter,
  statusFilter,
}: {
  pets: AdminPet[]
  searchTerm: string
  speciesFilter: string
  statusFilter: string
}) => {
  return pets.filter((pet) => {
    const search = searchTerm.toLowerCase()

    const matchSearch =
      pet.id.toLowerCase().includes(search) ||
      pet.name.toLowerCase().includes(search) ||
      normalizeValue(pet.species).includes(search) ||
      normalizeValue(pet.status).includes(search)

    const matchSpecies = speciesFilter === 'all' || normalizeValue(pet.species) === speciesFilter
    const matchStatus = statusFilter === 'all' || normalizeValue(pet.status) === statusFilter

    return matchSearch && matchSpecies && matchStatus
  })
}

export const getTotalPetApplications = (pets: AdminPet[]) => {
  return pets.reduce((sum, pet) => sum + (pet.applications ?? 0), 0)
}

export const getTotalAvailablePets = (pets: AdminPet[]) => {
  return pets.filter((pet) => normalizeValue(pet.status) === 'available').length
}

export const getTotalReservedPets = (pets: AdminPet[]) => {
  return pets.filter((pet) => normalizeValue(pet.status) === 'reserved').length
}

export { formatLabel }
