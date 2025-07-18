import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  once?: boolean;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  fallback,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              setHasBeenVisible(true);
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? (isVisible || hasBeenVisible) : isVisible;

  return (
    <div ref={sectionRef} className={className}>
      {shouldRender ? children : (fallback || <div className="min-h-[200px]" />)}
    </div>
  );
};

export default LazySection;
