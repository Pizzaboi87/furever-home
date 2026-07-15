import type {
  ContactChannel,
  PersonProfileType,
} from '@/lib/admin/domain'

export type CreatePersonInput = {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  preferredContactMethod?: ContactChannel | string | null
  tags?: string[] | null
}

export type UpdatePersonInput = {
  personId: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  preferredContactMethod?: ContactChannel | string | null
  profileType?: PersonProfileType | string | null
  householdType?: string | null
  hasOtherPets?: boolean | null
  interestAreas?: string[] | null
  tags?: string[] | null
}

export type AnonymizePersonInput = {
  personId: string
  confirmationName: string
}

export type PersonRecord = {
  id: string
  name: string
  email: string | null
  phone: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  preferredContactMethod: string | null
  profileType: string | null
  householdType: string | null
  hasOtherPets: boolean | null
  interestAreas: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
