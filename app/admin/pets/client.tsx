'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardList, PawPrint, ShieldCheck } from 'lucide-react'

import AdminListPanel from '@/components/admin/common/AdminListPanel'
import Header from '@/components/admin/common/Header'
import PreviewCard from '@/components/admin/common/PreviewCard'
import StatCard from '@/components/admin/common/StatCard'
import PetDesktopTable from '@/components/admin/pets/PetDesktopTable'
import PetFilters from '@/components/admin/pets/PetFilters'
import PetMobileCard from '@/components/admin/pets/PetMobileCard'
import MotionReveal from '@/components/ui/MotionReveal'
import type { AdminPet } from '@/lib/admin/domain'
import {
  getFilteredPets,
  getPetSpeciesValues,
  getPetStatusValues,
  getTotalAvailablePets,
  getTotalPetApplications,
  getTotalReservedPets,
} from '@/utils/admin/pets/pet-utils'

type PetsClientProps = {
  adminPets: AdminPet[]
}

export default function PetsClient({ adminPets }: PetsClientProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [speciesFilter, setSpeciesFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedPetId, setSelectedPetId] = useState(adminPets[0]?.id)

    const speciesValues = useMemo(() => getPetSpeciesValues(adminPets), [adminPets])
    const statusValues = useMemo(() => getPetStatusValues(adminPets), [adminPets])

    const filteredPets = useMemo(() => {
        return getFilteredPets({
            pets: adminPets,
            searchTerm,
            speciesFilter,
            statusFilter,
        })
    }, [adminPets, searchTerm, speciesFilter, statusFilter])

    const totalApplications = getTotalPetApplications(adminPets)
    const totalAvailable = getTotalAvailablePets(adminPets)
    const totalReserved = getTotalReservedPets(adminPets)

    const selectedPet =
        adminPets.find((pet) => pet.id === selectedPetId) ??
        filteredPets[0] ??
        adminPets[0]

    return (
        <main className="min-h-screen bg-background">
            <Header
                currentHref="/admin/pets"
                title="Manage Pets"
                description="Review shelter pets, open records, and create cases from new contacts."
            />

            <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MotionReveal>
                        <StatCard label="Total pets" value={adminPets.length} icon={PawPrint} />
                    </MotionReveal>

                    <MotionReveal delay={0.04}>
                        <StatCard label="Total applications" value={totalApplications} icon={ClipboardList} />
                    </MotionReveal>

                    <MotionReveal delay={0.08}>
                        <StatCard label="Total available" value={totalAvailable} icon={CheckCircle2} />
                    </MotionReveal>

                    <MotionReveal delay={0.12}>
                        <StatCard label="Total reserved" value={totalReserved} icon={ShieldCheck} />
                    </MotionReveal>
                </div>

                <PetFilters
                    searchTerm={searchTerm}
                    speciesFilter={speciesFilter}
                    statusFilter={statusFilter}
                    speciesValues={speciesValues}
                    statusValues={statusValues}
                    onSearchTermChange={setSearchTerm}
                    onSpeciesFilterChange={setSpeciesFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
                    <AdminListPanel
                        title="Pet records"
                        description={`Showing ${filteredPets.length} of ${adminPets.length} records from the Prisma database.`}
                        bodyClassName="max-h-[calc(100vh-10rem)] overflow-auto"
                    >
                        <div className="space-y-3 p-4 lg:hidden">
                            {filteredPets.map((pet, index) => (
                                <PetMobileCard
                                    key={pet.id}
                                    pet={pet}
                                    isSelected={selectedPet?.id === pet.id}
                                    onSelect={() => setSelectedPetId(pet.id)}
                                    eager={index < 2}
                                />
                            ))}

                            {filteredPets.length === 0 ? (
                                <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
                                    No pets match the selected filters.
                                </div>
                            ) : null}
                        </div>

                        <PetDesktopTable
                            pets={filteredPets}
                            selectedPetId={selectedPet?.id}
                            onSelectPet={setSelectedPetId}
                        />
                    </AdminListPanel>

                    {selectedPet && (
                        <MotionReveal className="self-start xl:sticky xl:top-6" delay={0.12}>
                            <PreviewCard pet={selectedPet} />
                        </MotionReveal>
                    )}
                </div>
            </div>
        </main>
    )
}
