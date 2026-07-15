import { Suspense } from 'react'

import {
  getAdminPeopleFromGraphQL,
  getAdminPetsFromGraphQL,
} from '@/lib/graphql/admin-queries'
import NewCaseClient from './client'


import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

export default async function NewCasePage() {
  await requireCurrentStaff()
  const [pets, people] = await Promise.all([
    getAdminPetsFromGraphQL(),
    getAdminPeopleFromGraphQL(),
  ])

  return (
    <Suspense>
      <NewCaseClient pets={pets} people={people} />
    </Suspense>
  )
}
