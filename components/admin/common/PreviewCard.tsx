import Image from '@/components/ui/LoadingImage'
import {
    CalendarDays,
    ClipboardList,
    ExternalLink,
    HeartHandshake,
    PawPrint,
} from 'lucide-react'

import { ActionLink } from '@/components/ui/ActionButton'
import { formatLabel } from '@/lib/pet-format'

interface PreviewCardPet {
    id: string
    name: string
    species: string
    gender: string
    age: number
    weight: number
    description: string
    image: string
    status?: string
    size?: string
    goodWithChildren?: boolean
    goodWithOtherAnimals?: boolean
    applications?: number
    daysInShelter?: number
    lastUpdated?: string
}

interface PreviewCardProps {
    pet: PreviewCardPet
    openCases?: number
    showManageDetails?: boolean
}

const getStatusBadgeLabel = (status?: string) => {
    switch (status) {
        case 'new':
            return 'Just arrived'
        case 'reserved':
            return 'Almost home'
        default:
            return status ? formatLabel(status) : 'Unknown'
    }
}

const getStatusBadgeClasses = (status?: string) => {
    switch (status) {
        case 'new':
            return 'border-primary/20 bg-secondary/95 text-primary'
        case 'reserved':
            return 'border-accent/30 bg-primary/95 text-primary-foreground'
        case 'available':
            return 'border-primary/20 bg-white/95 text-primary'
        case 'adopted':
            return 'border-border bg-white/95 text-foreground'
        default:
            return 'border-border bg-white/95 text-muted-foreground'
    }
}

const getGoodWithLabel = (pet: PreviewCardPet) => {
    if (pet.goodWithChildren && pet.goodWithOtherAnimals) {
        return 'Kids & pets'
    }

    if (pet.goodWithChildren) {
        return 'Kids'
    }

    if (pet.goodWithOtherAnimals) {
        return 'Pets'
    }

    return 'Calm home'
}

const formatDate = (value?: string) => {
    if (!value) {
        return 'Unknown'
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value))
}

export default function PreviewCard({
    pet,
    openCases = 0,
    showManageDetails = true,
}: PreviewCardProps) {
    const profileStats = [
        {
            label: 'Age',
            value: `${pet.age}y`,
        },
        {
            label: 'Size',
            value: pet.size ? formatLabel(pet.size) : 'Unknown',
        },
        {
            label: 'Good with',
            value: getGoodWithLabel(pet),
        },
    ]

    const adminStats = [
        {
            label: 'Applications',
            value: pet.applications ?? 0,
            icon: HeartHandshake,
        },
        {
            label: 'Open cases',
            value: openCases,
            icon: ClipboardList,
        },
        {
            label: 'Shelter days',
            value: pet.daysInShelter ?? 0,
            icon: CalendarDays,
        },
    ]

    return (
        <aside className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <div className="relative h-72 w-full overflow-hidden bg-input">
                <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    sizes="(min-width: 1280px) 360px, 100vw"
                    loading="eager"
                    className="object-cover"
                />

                <span
                    className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold tracking-wide shadow-sm backdrop-blur-sm ${getStatusBadgeClasses(
                        pet.status
                    )}`}
                >
                    {getStatusBadgeLabel(pet.status)}
                </span>
            </div>

            <div className="p-5">
                <div className="mb-5">
                    <h2 className="text-2xl font-bold text-foreground">{pet.name}</h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {formatLabel(pet.species)} · {formatLabel(pet.gender)}
                    </p>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-2">
                    {profileStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg border border-border bg-secondary p-2 text-center text-[#1E1B4B]"
                        >
                            <p className="text-xs">{stat.label}</p>
                            <p className="mt-1 text-sm font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-5 rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />
                        <h3 className="text-sm font-bold text-foreground">Admin snapshot</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {adminStats.map((stat) => {
                            const Icon = stat.icon

                            return (
                                <div key={stat.label} className="rounded-lg bg-white p-3 text-center">
                                    <Icon className="mx-auto mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            )
                        })}
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                        Last updated{' '}
                        <span className="font-semibold text-foreground">{formatDate(pet.lastUpdated)}</span>
                    </p>
                </div>

                <div className="space-y-3">
                    {showManageDetails && (
                        <ActionLink href={`/admin/pets/${pet.id}`} fullWidth>
                            <PawPrint className="h-4 w-4" aria-hidden="true" />
                            Manage details
                        </ActionLink>
                    )}

                    <ActionLink
                        href={`/admin/cases/new?petId=${pet.id}`}
                        variant="secondaryWarm"
                        fullWidth
                    >
                        <ClipboardList className="h-4 w-4" aria-hidden="true" />
                        Create case
                    </ActionLink>

                    <ActionLink href={`/pets/${pet.id}`} variant="secondary" fullWidth>
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Public profile
                    </ActionLink>
                </div>
            </div>
        </aside>
    )
}