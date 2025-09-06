import React from 'react';

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
export function ResponsiveImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  loading = 'lazy',
  priority = false
}: ResponsiveImageProps) {
  // Convert PNG/JPG paths to WebP
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const isWebPSupported = src.match(/\.(png|jpg|jpeg)$/i);
  
  // For critical images, use eager loading
  const loadingStrategy = priority ? 'eager' : loading;
  
  if (isWebPSupported) {
    return (
      <picture className={className}>
        <source srcSet={`/webp/${webpSrc}`} type="image/webp" />
        <img 
          src={src} 
          alt={alt} 
          width={width}
          height={height}
          loading={loadingStrategy}
          decoding="async"
          className={className}
        />
      </picture>
    );
  }
  
  // For non-optimizable images, use regular img
  return (
    <img 
      src={src} 
      alt={alt} 
      width={width}
      height={height}
      loading={loadingStrategy}
      decoding="async"
      className={className}
    />
  );
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
