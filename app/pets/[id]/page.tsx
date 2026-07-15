import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { getPublicPetDetailFromGraphQL } from '@/lib/graphql/public-pet-queries'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo'
import PetDetailClient from './client'

export const dynamic = 'force-dynamic'

const getCachedPublicPetDetail = cache(getPublicPetDetailFromGraphQL)

type PetDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

const buildPetDescription = (
  name: string,
  species: string,
  ageGroup?: string,
  gender?: string,
  size?: string,
) => {
  const details = [
    size ? `${size.toLowerCase()}-sized` : null,
    ageGroup?.toLowerCase(),
    gender?.toLowerCase(),
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ')

  const detailText = details
    ? `a ${details} ${species.toLowerCase()}`
    : `a ${species.toLowerCase()}`

  return `Meet ${name}, ${detailText} available for adoption through Furever Home. Learn about their personality, care needs, and compatibility before applying.`
}

export async function generateMetadata({
  params,
}: PetDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const detail = await getCachedPublicPetDetail(id)

  if (!detail) {
    return {
      title: 'Pet Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { pet } = detail
  const species = capitalize(pet.species)
  const title = `Adopt ${pet.name}, a ${species}`
  const socialTitle = `${title} | ${SITE_NAME}`
  const description = buildPetDescription(
    pet.name,
    pet.species,
    pet.ageGroup,
    pet.gender,
    pet.size,
  )
  const image = pet.image || DEFAULT_OG_IMAGE
  const imageAlt = pet.imageAlt || `${pet.name}, an adoptable ${pet.species.toLowerCase()}`

  return {
    title,
    description,
    alternates: {
      canonical: `/pets/${pet.id}`,
    },
    openGraph: {
      type: 'website',
      url: `/pets/${pet.id}`,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PetDetailPage({ params }: PetDetailPageProps) {
  const { id } = await params
  const detail = await getCachedPublicPetDetail(id)

  if (!detail) {
    notFound()
  }

  return <PetDetailClient pet={detail.pet} relatedPets={detail.relatedPets} />
}
