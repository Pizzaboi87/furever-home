import type { Dispatch, SetStateAction } from 'react'

import type { PetStatus } from '@/lib/admin/domain'

export type NewPetDraft = {
  name: string
  species: string
  gender: string
  status: PetStatus
  age: string
  ageGroup: string
  size: string
  weight: string
  daysInShelter: string
  lastUpdated: string
  description: string
  image: string
  imageCloudinaryPublicId: string
  imageThumbnailUrl: string
  goodWithChildren: boolean
  goodWithOtherAnimals: boolean
  neutered: boolean
}

export type NewPetFormSetters = {
  setName: Dispatch<SetStateAction<string>>
  setSpecies: Dispatch<SetStateAction<string>>
  setGender: Dispatch<SetStateAction<string>>
  setStatus: Dispatch<SetStateAction<PetStatus>>
  setAge: Dispatch<SetStateAction<string>>
  setAgeGroup: Dispatch<SetStateAction<string>>
  setSize: Dispatch<SetStateAction<string>>
  setWeight: Dispatch<SetStateAction<string>>
  setDaysInShelter: Dispatch<SetStateAction<string>>
  setLastUpdated: Dispatch<SetStateAction<string>>
  setDescription: Dispatch<SetStateAction<string>>
  setImage: Dispatch<SetStateAction<string>>
  setImageCloudinaryPublicId: Dispatch<SetStateAction<string>>
  setImageThumbnailUrl: Dispatch<SetStateAction<string>>
  setGoodWithChildren: Dispatch<SetStateAction<boolean>>
  setGoodWithOtherAnimals: Dispatch<SetStateAction<boolean>>
  setNeutered: Dispatch<SetStateAction<boolean>>
}
