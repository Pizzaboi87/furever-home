import { getAdminPetsFromGraphQL } from '@/lib/graphql/admin-queries'
import NewPetClient from './client'


import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

export default async function NewPetPage() {
  await requireCurrentStaff()
  const pets = await getAdminPetsFromGraphQL()

  return <NewPetClient pets={pets} />
}
