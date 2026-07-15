import { getAdminPeopleOverviewFromGraphQL } from '@/lib/graphql/admin-queries'
import PeopleClient from './client'


import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

export default async function AdminPeoplePage() {
    await requireCurrentStaff()
    const people = await getAdminPeopleOverviewFromGraphQL()

    return <PeopleClient people={people} />
}
