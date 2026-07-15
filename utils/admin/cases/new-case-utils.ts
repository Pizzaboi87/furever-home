import type { AdminPet, Person } from '@/lib/admin/domain'

export const formatPreviewAddress = (value: unknown) => {
    if (!value) {
        return undefined
    }

    if (typeof value === 'string') {
        return value
    }

    if (typeof value !== 'object') {
        return undefined
    }

    const address = value as {
        line1?: string
        line2?: string
        city?: string
        state?: string
        zip?: string
        country?: string
    }

    return [
        address.line1,
        address.line2,
        address.city,
        address.state,
        address.zip,
        address.country,
    ]
        .filter(Boolean)
        .join(', ')
}

export const formatPersonAddress = (person: Person | undefined) => {
    if (!person?.address) {
        return ''
    }

    if (typeof person.address === 'string') {
        return person.address
    }

    return [
        person.address.line1,
        person.address.line2,
        person.address.city,
        person.address.state,
        person.address.zip,
        person.address.country,
    ]
        .filter(Boolean)
        .join(', ')
}

export const formatPersonSearchLabel = (person: Person) =>
    [person.name, person.email, person.phone].filter(Boolean).join(' · ')

export const filterPeopleForCase = (people: Person[], searchTerm: string) => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
        return people.slice(0, 12)
    }

    return people
        .filter((person) => {
            const searchableValue = [
                person.id,
                person.name,
                person.email,
                person.phone,
                formatPersonAddress(person),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return searchableValue.includes(search)
        })
        .slice(0, 12)
}

export const filterPetsForCase = (pets: AdminPet[], searchTerm: string) => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
        return pets.slice(0, 12)
    }

    return pets
        .filter((pet) => {
            const searchableValue = [pet.id, pet.name, pet.species, pet.status, pet.ageGroup]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return searchableValue.includes(search)
        })
        .slice(0, 12)
}
