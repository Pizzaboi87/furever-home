import type { Metadata } from 'next'
import { Suspense } from 'react'

import AdminNavigationFeedback from '@/components/admin/common/AdminNavigationFeedback'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Furever Home Admin',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminNavigationFeedback />
      </Suspense>
      {children}
    </>
  )
}
