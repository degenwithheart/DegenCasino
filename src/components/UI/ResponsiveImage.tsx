import React from 'react';
import { SmartImage } from './SmartImage'

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

// WebP-optimized image component with PNG fallback
export function ResponsiveImage(props: ResponsiveImageProps) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[ResponsiveImage] Deprecated - use <SmartImage> instead.')
  }
  return <SmartImage src={props.src} alt={props.alt} className={props.className} style={{width: props.width, height: props.height}} />
}

// Hook for preloading critical images
export function useImagePreloading(images: string[]) {
  React.useEffect(() => {
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      
      // Preload WebP if available
      const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      if (src.match(/\.(png|jpg|jpeg)$/i)) {
        link.href = `/webp/${webpSrc}`;
        link.type = 'image/webp';
      } else {
        link.href = src;
      }
      
      document.head.appendChild(link);
    });
  }, [images]);
}

export default ResponsiveImage;
