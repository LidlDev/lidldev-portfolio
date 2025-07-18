import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from 'lucide-react';

interface DynamicProjectGalleryProps {
  screenshots: string[];
  title: string;
}

const DynamicProjectGallery: React.FC<DynamicProjectGalleryProps> = ({ screenshots, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || screenshots.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, screenshots.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!galleryRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleImages(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const images = galleryRef.current.querySelectorAll('[data-index]');
    images.forEach(img => observerRef.current?.observe(img));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [screenshots]);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsAutoPlaying(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  if (screenshots.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold">
          Screenshots & <span className="magic-text">Gallery</span>
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm"></div>
        
        {/* Main Image Display */}
        <div className="relative h-full flex items-center justify-center p-8">
          <img
            src={screenshots[currentIndex]}
            alt={`${title} Screenshot ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer"
            onClick={() => openLightbox(currentIndex)}
          />
          
          {/* Overlay with zoom hint */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer rounded-lg"
               onClick={() => openLightbox(currentIndex)}>
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
              <ZoomIn className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Grid Gallery */}
      <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            data-index={index}
            className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-700 ${
              visibleImages.has(index)
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
            onClick={() => openLightbox(index)}
          >
            <img
              src={screenshot}
              alt={`${title} Screenshot ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Hover Effects */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Image Number */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-4xl max-h-full flex items-center justify-center">
            <img
              src={screenshots[currentIndex]}
              alt={`${title} Screenshot ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            {currentIndex + 1} of {screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicProjectGallery;
