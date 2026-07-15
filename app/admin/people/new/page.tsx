import { requireCurrentStaff } from '@/lib/admin/auth'
import NewPersonClient from './client'

export const dynamic = 'force-dynamic'

export default async function NewPersonPage() {
    await requireCurrentStaff()

    return <NewPersonClient />
}
