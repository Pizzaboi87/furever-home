import { redirect } from 'next/navigation'

import { requireCurrentStaff } from '@/lib/admin/auth'

export default async function AdminIndexPage() {
  await requireCurrentStaff()
  redirect('/admin/dashboard')
}
