import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformance = () => {
  const measurePerformance = useCallback(() => {
    const metrics: PerformanceMetrics = {};

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = entry.startTime;
      }
    });

    return metrics;
  }, []);

  const logPerformanceMetrics = useCallback((metrics: PerformanceMetrics) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      if (metrics.ttfb) console.log(`⏱️ TTFB: ${metrics.ttfb.toFixed(2)}ms`);
      if (metrics.fcp) console.log(`🎨 FCP: ${metrics.fcp.toFixed(2)}ms`);
      if (metrics.lcp) console.log(`🖼️ LCP: ${metrics.lcp.toFixed(2)}ms`);
      if (metrics.fid) console.log(`👆 FID: ${metrics.fid.toFixed(2)}ms`);
      if (metrics.cls) console.log(`📐 CLS: ${metrics.cls.toFixed(4)}`);
      console.groupEnd();
    }
  }, []);

  useEffect(() => {
    // Measure initial performance
    const initialMetrics = measurePerformance();
    
    // Set up observers for Web Vitals
    const setupObservers = () => {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            initialMetrics.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              initialMetrics.fid = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            initialMetrics.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Log metrics after a delay to capture most measurements
          setTimeout(() => {
            logPerformanceMetrics(initialMetrics);
          }, 3000);
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }
    };

    // Wait for page load to set up observers
    if (document.readyState === 'complete') {
      setupObservers();
    } else {
      window.addEventListener('load', setupObservers);
    }

    return () => {
      window.removeEventListener('load', setupObservers);
    };
  }, [measurePerformance, logPerformanceMetrics]);

  const measureComponentRender = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚛️ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' | 'font' = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }, []);

  const prefetchResource = useCallback((url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }, []);

  return {
    measurePerformance,
    logPerformanceMetrics,
    measureComponentRender,
    preloadResource,
    prefetchResource,
  };
};
