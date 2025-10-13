import { type ImgHTMLAttributes, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type ProgressiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  primarySrc?: string
  fallbackSrc: string
}

export function ProgressiveImage({
  primarySrc,
  fallbackSrc,
  className,
  onLoad,
  onError,
  ...props
}: ProgressiveImageProps) {
  const [source, setSource] = useState(fallbackSrc)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setSource(fallbackSrc)
    setIsLoaded(false)

    if (!primarySrc || primarySrc === fallbackSrc) {
      return
    }

    let cancelled = false
    const image = new window.Image()

    image.onload = () => {
      if (!cancelled) {
        setSource(primarySrc)
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setSource(fallbackSrc)
      }
    }

    image.src = primarySrc

    return () => {
      cancelled = true
    }
  }, [primarySrc, fallbackSrc])

  return (
    <img
      {...props}
      src={source}
      onLoad={(event) => {
        setIsLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        setSource(fallbackSrc)
        setIsLoaded(true)
        onError?.(event)
      }}
      className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
    />
  )
}

export default ProgressiveImage
