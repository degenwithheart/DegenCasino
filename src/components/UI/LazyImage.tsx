import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
    priority?: boolean; // For critical images that should load immediately
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className,
    style,
    placeholder,
    onLoad,
    onError,
    priority = false
}) => {
    const [isLoaded, setIsLoaded] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (priority || isInView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before the image comes into view
                threshold: 0.1
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
            observerRef.current = observer;
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [priority, isInView]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    // Generate WebP fallback chain
    const getImageSrc = (originalSrc: string) => {
        if (originalSrc.includes('.webp')) {
            // If it's already WebP, also provide PNG fallback
            const pngSrc = originalSrc.replace('.webp', '.png');
            return `${originalSrc}, ${pngSrc}`;
        }
        return originalSrc;
    };

    return (
        <img
            ref={imgRef}
            src={isInView ? src : placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTExIi8+Cjwvc3ZnPgo='}
            alt={alt}
            className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
            style={{
                ...style,
                opacity: isLoaded ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out'
            }}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
        />
    );
};

// Hook for preloading images
export const useImagePreloader = () => {
    const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = src;
        });
    };

    const preloadImages = (srcs: string[]): Promise<void[]> => {
        return Promise.all(srcs.map(src => preloadImage(src)));
    };

    return { preloadImage, preloadImages };
};