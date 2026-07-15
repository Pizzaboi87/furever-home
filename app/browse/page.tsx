import type { Metadata } from 'next'

import BrowseClient from './client'
import { getPublicPetsFromGraphQL } from '@/lib/graphql/public-pet-queries'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Browse Adoptable Pets',
  description:
    'Browse adoptable shelter pets and filter by species, age, size, gender, temperament, activity level, and household compatibility to find the right companion.',
  path: '/browse',
})

export const dynamic = 'force-dynamic'

export default async function BrowsePage() {
  const pets = await getPublicPetsFromGraphQL()

  return <BrowseClient pets={pets} />
}
