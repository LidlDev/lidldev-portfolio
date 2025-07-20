import React from 'react';

// Lazy loading utility for components
export const lazyLoad = (importFunc: () => Promise<any>, fallback?: React.ComponentType) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: any) => {
    const fallbackElement = fallback 
      ? React.createElement(fallback) 
      : React.createElement('div', { children: 'Loading...' });
    
    return React.createElement(
      React.Suspense,
      { fallback: fallbackElement },
      React.createElement(LazyComponent, props)
    );
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`Performance: ${entry.name} = ${entry.duration}ms`);
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, []);
};

// Hook for adaptive loading based on network conditions
export const useAdaptiveLoading = () => {
  const [shouldUseHighQuality, setShouldUseHighQuality] = React.useState(true);
  const [networkInfo, setNetworkInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      setNetworkInfo(connection);
      
      if (connection) {
        const slowConnections = ['slow-2g', '2g', '3g'];
        setShouldUseHighQuality(!slowConnections.includes(connection.effectiveType));
      }
    };

    updateNetworkInfo();

    // Listen for network changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return { shouldUseHighQuality, networkInfo };
};

// Hook for battery-aware optimizations
export const useBatteryOptimization = () => {
  const [batteryInfo, setBatteryInfo] = React.useState<any>(null);
  const [shouldReduceAnimations, setShouldReduceAnimations] = React.useState(false);

  React.useEffect(() => {
    const updateBatteryInfo = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setBatteryInfo(battery);
          
          // Reduce animations if battery is low and not charging
          const shouldReduce = (battery.level < 0.2 && !battery.charging) ||
                              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          setShouldReduceAnimations(shouldReduce);

          // Listen for battery changes
          battery.addEventListener('levelchange', () => updateBatteryInfo());
          battery.addEventListener('chargingchange', () => updateBatteryInfo());
        }
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    };

    updateBatteryInfo();
  }, []);

  return { batteryInfo, shouldReduceAnimations };
};

// Hook for memory monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = React.useState<MemoryInfo | null>(null);

  React.useEffect(() => {
    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      if (memory) {
        setMemoryInfo(memory);
      }
    };

    updateMemoryInfo();

    // Update memory info periodically
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Hook for intersection observer
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const [ref, setRef] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (!ref) return;

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver(callback, defaultOptions);
    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, callback, options]);

  return setRef;
};

// Hook for lazy loading images
export const useLazyImage = (src: string, options?: { lowQualitySrc?: string }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const { shouldUseHighQuality } = useAdaptiveLoading();

  const setRef = useIntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    },
    { threshold: 0.1, rootMargin: '50px' }
  );

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = React.useCallback(() => {
    setHasError(true);
  }, []);

  const imageSrc = React.useMemo(() => {
    if (!isInView) return undefined;
    
    if (shouldUseHighQuality) {
      return src;
    } else if (options?.lowQualitySrc) {
      return options.lowQualitySrc;
    } else {
      return src;
    }
  }, [isInView, shouldUseHighQuality, src, options?.lowQualitySrc]);

  return {
    ref: setRef,
    src: imageSrc,
    isLoaded,
    hasError,
    handleLoad,
    handleError
  };
};

export default {
  lazyLoad,
  usePerformanceMonitor,
  useAdaptiveLoading,
  useBatteryOptimization,
  useMemoryMonitor,
  useIntersectionObserver,
  useLazyImage
};
