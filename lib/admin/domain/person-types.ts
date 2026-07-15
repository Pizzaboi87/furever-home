import type { ContactChannel } from './case-types'
import type { Id } from './common-types'

export type PersonAddress = {
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

export type PersonProfileType =
  | 'adopter'
  | 'foster'
  | 'volunteer'
  | 'donor'
  | 'supporter'
  | 'general_contact'

export type Person = {
  id: Id
  name: string
  email?: string
  phone?: string
  address?: string | PersonAddress
  preferredContactMethod?: ContactChannel
  profileType?: PersonProfileType
  householdType?: string
  hasOtherPets?: boolean
  interestAreas?: string[]
  tags?: string[]
  createdAt: string
  updatedAt?: string
}
