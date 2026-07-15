import type { AdminPet } from '@/lib/admin/domain'

export const getPetAgeLabel = (age: number) => {
  return `${age} year${age !== 1 ? 's' : ''}`
}

export const formatPetDetailDate = (date: string) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export const getHomeFitBadges = (pet: AdminPet) => {
  const badges: string[] = []

  if (pet.goodWithChildren) {
    badges.push('Kid-friendly')
  }

  if (pet.goodWithOtherAnimals) {
    badges.push('Pet-friendly')
  }

  if (pet.neutered) {
    badges.push('Neutered')
  }

  if (!pet.goodWithChildren && !pet.goodWithOtherAnimals) {
    badges.push('Calm home preferred')
  }

  return badges
}

export const getBestFitText = (pet: AdminPet) => {
  if (pet.goodWithChildren && pet.goodWithOtherAnimals) {
    return `${pet.name} could be a lovely match for a family home with children and other friendly pets. A proper introduction is still important, but the signs point toward a social companion who can fit into a lively household.`
  }

  if (pet.goodWithChildren) {
    return `${pet.name} could be a good fit for a family with children who understand how to treat animals gently and respectfully. A calm introduction and steady routine would help make the transition easier.`
  }

  if (pet.goodWithOtherAnimals) {
    return `${pet.name} may do well in a home with another friendly pet, especially with a slow introduction and enough space to settle in at a comfortable pace.`
  }

  return `${pet.name} would likely do best in a calmer home where there is time, patience, and space to settle in gradually. A peaceful routine could help build trust and confidence.`
}
