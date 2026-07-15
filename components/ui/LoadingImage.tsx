'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useState } from 'react'

export default function LoadingImage({
  className,
  onError,
  onLoad,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <NextImage
      {...props}
      className={[className, isLoaded ? undefined : 'app-image-loading']
        .filter(Boolean)
        .join(' ')}
      onLoad={(event) => {
        setIsLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        setIsLoaded(true)
        onError?.(event)
      }}
    />
  )
}
