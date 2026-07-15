import type { Dispatch, SetStateAction } from 'react'

import type { ContactChannel } from '@/lib/admin/domain'

export type NewPersonFormValues = {
    name: string
    email: string
    phone: string
    address: string
    preferredContactMethod: ContactChannel
    personType: string
    extraTags: string
}

export type NewPersonFormSetters = {
    setName: Dispatch<SetStateAction<string>>
    setEmail: Dispatch<SetStateAction<string>>
    setPhone: Dispatch<SetStateAction<string>>
    setAddress: Dispatch<SetStateAction<string>>
    setPreferredContactMethod: Dispatch<SetStateAction<ContactChannel>>
    setPersonType: Dispatch<SetStateAction<string>>
    setExtraTags: Dispatch<SetStateAction<string>>
}
