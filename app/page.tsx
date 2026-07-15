import type { Metadata } from 'next'

import HomeClient from './client'
import { getPublicPets } from '@/lib/public-pet-service'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Adopt a Pet and Find Your New Companion',
  description:
    'Meet adoptable dogs, cats, rabbits, birds, and small pets, explore their personalities and care needs, and find the companion who fits your home and lifestyle.',
  path: '/',
})

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const pets = await getPublicPets()

  return <HomeClient pets={pets} />
}
