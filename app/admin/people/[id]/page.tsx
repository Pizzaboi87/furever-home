import { notFound } from 'next/navigation'
import { getAdminPersonDetailFromGraphQL } from '@/lib/graphql/admin-queries'
import PersonDetailClient from './client'



import { requireCurrentStaff } from '@/lib/admin/auth'
export const dynamic = 'force-dynamic'

type AdminPersonDetailPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function AdminPersonDetailPage({
    params,
}: AdminPersonDetailPageProps) {
    await requireCurrentStaff()
    const { id } = await params
    const detail = await getAdminPersonDetailFromGraphQL(id)

    if (!detail) {
        notFound()
    }

    return <PersonDetailClient detail={detail} />
}
