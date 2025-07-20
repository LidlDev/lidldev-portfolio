import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './animations';
import { createIntersectionObserver, shouldLoadHighQuality } from '../utils/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  lowQualitySrc?: string; // For adaptive loading
  sizes?: string;
  srcSet?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  width,
  height,
  loading = 'lazy',
  lowQualitySrc,
  sizes,
  srcSet
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldUseHighQuality, setShouldUseHighQuality] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check network conditions for adaptive loading
    console.log('shouldLoadHighQuality function:', shouldLoadHighQuality);
    setShouldUseHighQuality(shouldLoadHighQuality());

    const observer = createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Skeleton
              className="w-full h-full"
              animation="wave"
              style={{
                aspectRatio: width && height ? `${width}/${height}` : undefined
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        ref={imgRef}
        src={
          isInView || loading === 'eager'
            ? (shouldUseHighQuality ? src : (lowQualitySrc || src))
            : placeholder
        }
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${hasError ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.1
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <AnimatePresence>
        {hasError && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm">Failed to load image</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LazyImage;
