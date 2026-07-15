import type { MetadataRoute } from 'next'

import { getPublicPetsFromGraphQL } from '@/lib/graphql/public-pet-queries'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${SITE_URL}/browse`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/about`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/donate`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/volunteer`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pets = await getPublicPetsFromGraphQL()

  const petRoutes: MetadataRoute.Sitemap = pets.map((pet) => ({
    url: `${SITE_URL}/pets/${pet.id}`,
    lastModified: pet.lastUpdated ? new Date(pet.lastUpdated) : undefined,
    changeFrequency: 'daily',
    priority: 0.8,
    images: pet.image ? [pet.image] : undefined,
  }))

  return [...staticRoutes, ...petRoutes]
}
