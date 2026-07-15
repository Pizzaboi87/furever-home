import { getAdminPetsFromGraphQL } from '@/lib/graphql/admin-queries'
import PetsClient from './client'

import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

export default async function ManagePetsPage() {
  await requireCurrentStaff()
  const adminPets = await getAdminPetsFromGraphQL()

  return <PetsClient adminPets={adminPets} />
}
