import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProjectGalleryProps {
  screenshots: string[];
  title: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ screenshots, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
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

  // Sample iPhone screenshots for demo
  const sampleScreenshots = [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=650&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=650&fit=crop", 
    "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=300&h=650&fit=crop",
    "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=300&h=650&fit=crop",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=650&fit=crop"
  ];

  const displayScreenshots = screenshots.length > 0 ? screenshots : sampleScreenshots;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <h2 className="text-3xl font-bold text-white">Screenshots & Gallery</h2>
      
      {/* Gallery Grid - Optimized for iPhone screenshots */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayScreenshots.map((screenshot, index) => (
          <div
            key={index}
            className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
            onClick={() => openLightbox(index)}
          >
            {/* iPhone aspect ratio container (9:19.5 ≈ 0.46) */}
            <div className="aspect-[9/19.5] relative">
              <img
                src={screenshot}
                alt={`${title} Screenshot ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1} of {displayScreenshots.length}
              </div>
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
          {displayScreenshots.length > 1 && (
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

          {/* Main Image - Optimized for iPhone screenshots */}
          <div className="max-w-sm max-h-full flex items-center justify-center">
            <img
              src={displayScreenshots[currentIndex]}
              alt={`${title} Screenshot ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            {currentIndex + 1} of {displayScreenshots.length}
          </div>

          {/* Thumbnail Navigation - iPhone aspect ratio */}
          {displayScreenshots.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
              {displayScreenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`flex-shrink-0 w-8 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={screenshot}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;