import React, { useState, useRef, useEffect } from 'react';
import { useImageOptimization } from '../hooks/useCMS';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  format = 'webp',
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { optimizeImage, generateBlurDataURL } = useImageOptimization();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate optimized image URLs for different formats and sizes
  const generateSrcSet = () => {
    if (!width) return '';

    const sizes = [width, width * 2]; // 1x and 2x
    return sizes
      .map((size) => {
        const optimizedUrl = optimizeImage(src, {
          width: size,
          height: height ? (height * size) / width : undefined,
          quality,
          format,
        });
        return `${optimizedUrl} ${size}w`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = optimizeImage(src, { width, height, quality, format });
  const placeholderSrc = blurDataURL || generateBlurDataURL(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Blur image */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 filter blur-sm scale-110 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? optimizedSrc : undefined}
        srcSet={isInView ? generateSrcSet() : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

// Component for responsive images with multiple breakpoints
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  breakpoints: {
    mobile?: { width: number; height?: number };
    tablet?: { width: number; height?: number };
    desktop?: { width: number; height?: number };
  };
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  breakpoints,
  ...props
}) => {
  const { mobile, tablet, desktop } = breakpoints;
  
  // Generate sizes attribute based on breakpoints
  const sizes = [
    mobile && `(max-width: 768px) ${mobile.width}px`,
    tablet && `(max-width: 1024px) ${tablet.width}px`,
    desktop && `${desktop.width}px`,
  ]
    .filter(Boolean)
    .join(', ');

  // Use the largest width as the default
  const defaultWidth = desktop?.width || tablet?.width || mobile?.width || 800;
  const defaultHeight = desktop?.height || tablet?.height || mobile?.height;

  return (
    <OptimizedImage
      {...props}
      width={defaultWidth}
      height={defaultHeight}
      sizes={sizes}
    />
  );
};

// Component for hero/banner images with art direction
interface ArtDirectedImageProps extends OptimizedImageProps {
  mobileSrc?: string;
  tabletSrc?: string;
}

export const ArtDirectedImage: React.FC<ArtDirectedImageProps> = ({
  src,
  mobileSrc,
  tabletSrc,
  ...props
}) => {
  return (
    <picture>
      {mobileSrc && (
        <source
          media="(max-width: 768px)"
          srcSet={mobileSrc}
        />
      )}
      {tabletSrc && (
        <source
          media="(max-width: 1024px)"
          srcSet={tabletSrc}
        />
      )}
      <OptimizedImage src={src} {...props} />
    </picture>
  );
};

export default OptimizedImage;
