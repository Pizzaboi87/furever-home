import { notFound } from 'next/navigation'
import { requireCurrentStaff } from '@/lib/admin/auth'

import {
  getAdminPetDetailFromGraphQL,
  getAdminPetsFromGraphQL,
} from '@/lib/graphql/admin-queries'
import { normalizeValue } from '@/lib/pet-format'
import PetDetailClient from './client'


export const dynamic = 'force-dynamic'

type AdminPetDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

const getUniqueValues = (values: string[]) => {
  return [...new Set(values.map((value) => normalizeValue(value)).filter(Boolean))]
}

export default async function AdminPetDetailPage({ params }: AdminPetDetailPageProps) {
  await requireCurrentStaff()
  const { id } = await params

  const detail = await getAdminPetDetailFromGraphQL(id)

  if (!detail) {
    notFound()
  }

  const { pet, cases, activity } = detail
  const adminPets = await getAdminPetsFromGraphQL()

  const speciesValues = getUniqueValues(adminPets.map((item) => item.species))
  const genderValues = getUniqueValues(adminPets.map((item) => item.gender))

  const statusValues = getUniqueValues([
    'new',
    'available',
    'reserved',
    'adoption_in_progress',
    'adopted',
    ...adminPets
      .map((item) => item.status)
      .filter((status) => !['hidden', 'unavailable'].includes(normalizeValue(status))),
  ])

  const sizeValues = getUniqueValues([
    'small',
    'medium',
    'large',
    ...adminPets.map((item) => item.size ?? ''),
  ])

  const ageGroupValues = getUniqueValues([
    'baby',
    'young',
    'adult',
    'senior',
    ...adminPets.map((item) => item.ageGroup ?? ''),
  ])

  return (
    <PetDetailClient
      pet={pet}
      cases={cases}
      activity={activity}
      speciesValues={speciesValues}
      genderValues={genderValues}
      statusValues={statusValues}
      sizeValues={sizeValues}
      ageGroupValues={ageGroupValues}
    />
  )
}
