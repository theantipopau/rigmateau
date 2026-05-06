'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PartImageProps {
  alt: string
  category: string
  imageUrl?: string | null
  className?: string
  sizes?: string
}

function fallbackFor(category: string) {
  return `/images/categories/${category}.svg`
}

export default function PartImage({
  alt,
  category,
  imageUrl,
  className,
  sizes = '48px',
}: PartImageProps) {
  const fallback = fallbackFor(category)
  const [src, setSrc] = useState(imageUrl || fallback)

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback)
        }
      }}
    />
  )
}
