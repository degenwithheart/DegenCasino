import React, { useState, useMemo } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'

export interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  qualityVariants?: { high?: string; balanced?: string; data?: string }
  eager?: boolean
}

// Helper: attempt to derive a webp candidate
function deriveWebp(src: string) {
  if (/\.(png|jpg|jpeg)$/i.test(src)) return src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  return null
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src = '',
  qualityVariants,
  alt,
  eager,
  style,
  className,
  ...rest
}) => {
  const imageQuality = useUserStore(s => s.imageQuality || 'balanced')
  const progressive = useUserStore(s => !!s.progressiveImages)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const chosenSrc = useMemo(() => {
    // Explicit variants first
  if (qualityVariants) {
      return (
        qualityVariants[imageQuality] ||
        qualityVariants.balanced ||
        qualityVariants.high ||
        qualityVariants.data ||
        src
      )
    }
    // Derive webp for balanced/data
    if (imageQuality !== 'high') {
      const webp = deriveWebp(src)
      if (webp) return webp
    }
    return src
  }, [src, qualityVariants, imageQuality])

  // Fallback chain: if chosen fails and not original, retry original
  const finalSrc = failed ? src : chosenSrc

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={className}
      style={{
        ...style,
        transition: 'filter .4s, opacity .4s',
        filter: !loaded && progressive ? 'blur(12px) saturate(60%)' : undefined,
        opacity: loaded ? 1 : 0.5,
      }}
      {...rest}
    />
  )
}

export default SmartImage
