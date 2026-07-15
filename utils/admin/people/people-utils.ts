import { formatLabel, normalizeValue } from '@/lib/pet-format'
import type { AdminPersonOverview } from '@/lib/admin/person-service'

export type SearchablePersonOverview = AdminPersonOverview & {
    personType: string
    preferredContact: string
    searchableText: string
}

export const INITIAL_VISIBLE_PEOPLE = 75
export const VISIBLE_PEOPLE_STEP = 75

export const formatPersonDate = (value: string | undefined | null) => {
    if (!value) {
        return 'No activity'
    }

    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export const getPersonInitials = (name: string) => {
    return name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

export const getPersonTypeLabel = (tags: string[] | undefined) => {
    return formatLabel(tags?.[0] ?? 'contact')
}

export const formatSearchableAddress = (address: AdminPersonOverview['person']['address']) => {
    if (!address) {
        return ''
    }

    if (typeof address === 'string') {
        return address
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
        .join(' ')
}

export const buildSearchablePeople = (people: AdminPersonOverview[]): SearchablePersonOverview[] => {
    return people.map((item) => {
        const personType = normalizeValue(item.person.tags?.[0] ?? 'contact')
        const preferredContact = normalizeValue(item.person.preferredContactMethod ?? '')
        const searchableAddress = formatSearchableAddress(item.person.address)

        const searchableText = [
            item.person.id,
            item.person.name,
            item.person.email,
            item.person.phone,
            searchableAddress,
            personType,
            preferredContact,
            ...(item.person.tags ?? []),
        ]
            .filter(Boolean)
            .map((value) => normalizeValue(value))
            .join(' ')

        return {
            ...item,
            personType,
            preferredContact,
            searchableText,
        }
    })
}

export const filterPeople = ({
    people,
    searchTerm,
    typeFilter,
    activityFilter,
}: {
    people: SearchablePersonOverview[]
    searchTerm: string
    typeFilter: string
    activityFilter: string
}) => {
    const search = normalizeValue(searchTerm)

    return people.filter((item) => {
        const matchSearch = !search || item.searchableText.includes(search)
        const matchType = typeFilter === 'all' || item.personType === typeFilter

        const matchActivity =
            activityFilter === 'all' ||
            (activityFilter === 'open_cases' && item.stats.openCases > 0) ||
            (activityFilter === 'has_interactions' && item.stats.totalInteractions > 0) ||
            (activityFilter === 'has_related_pets' && item.stats.relatedPets > 0)

        return matchSearch && matchType && matchActivity
    })
}
