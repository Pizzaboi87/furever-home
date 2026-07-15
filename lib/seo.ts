import type { Metadata } from 'next'

export const SITE_NAME = 'Furever Home'
export const SITE_URL = 'https://weiser-furever.vercel.app'
export const DEFAULT_DESCRIPTION =
  'Discover adoptable dogs, cats, rabbits, birds, and small pets, learn their stories, and support shelter animals through adoption, volunteering, virtual adoption, or donations.'
export const DEFAULT_OG_IMAGE = '/og-image.png'

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  noIndex?: boolean
}

export const createPageMetadata = ({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata => {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const socialTitle = `${title} | ${SITE_NAME}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalPath,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} pet adoption and animal shelter`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
  }
}
