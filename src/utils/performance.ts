// Performance optimization utilities

// Note: React-specific utilities have been moved to hooks/usePerformance.tsx

// Image preloading
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Batch image preloading
export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(preloadImage);
  await Promise.allSettled(promises);
};

// Critical resource preloading moved to pwa.ts

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling utility
export class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private visibleCount: number;
  private scrollTop: number = 0;
  private totalItems: number = 0;

  constructor(container: HTMLElement, itemHeight: number) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll = throttle(() => {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }, 16); // ~60fps

  setItems(count: number) {
    this.totalItems = count;
    this.render();
  }

  getVisibleRange() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleCount, this.totalItems);
    
    return { startIndex, endIndex };
  }

  private render() {
    // This would be implemented by the component using the virtual scroller
    // The component would use getVisibleRange() to determine which items to render
  }
}

// Memory management utilities
export const cleanupEventListeners = (element: HTMLElement, events: string[]) => {
  events.forEach(event => {
    const listeners = (element as any)._listeners?.[event] || [];
    listeners.forEach((listener: EventListener) => {
      element.removeEventListener(event, listener);
    });
  });
};

// Bundle size optimization - dynamic imports
export const loadModule = async <T>(moduleLoader: () => Promise<T>): Promise<T> => {
  try {
    return await moduleLoader();
  } catch (error) {
    console.error('Failed to load module:', error);
    throw error;
  }
};

// Resource hints
export const addResourceHint = (href: string, rel: 'preload' | 'prefetch' | 'preconnect', as?: string) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.setAttribute('as', as);
  document.head.appendChild(link);
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Font loading optimization
export const optimizeFontLoading = () => {
  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
    // Add other critical fonts
  ];
  
  criticalFonts.forEach(font => {
    addResourceHint(font, 'preload', 'font');
  });
};

// Service Worker communication
export const sendMessageToSW = (message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!navigator.serviceWorker.controller) {
      reject(new Error('No service worker controller'));
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
};

// Cache management
export const clearAppCache = async (): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
};

// Performance monitoring (React hook moved to hooks/usePerformance.tsx)

// Memory usage monitoring
export const getMemoryUsage = (): any => {
  return (performance as any).memory || null;
};

// Network information
export const getNetworkInfo = (): any => {
  return (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection || null;
};

// Adaptive loading based on network conditions
export const shouldLoadHighQuality = (): boolean => {
  const connection = getNetworkInfo();
  if (!connection) return true; // Default to high quality if unknown
  
  const slowConnections = ['slow-2g', '2g', '3g'];
  return !slowConnections.includes(connection.effectiveType);
};

// Battery API for performance optimization
export const getBatteryInfo = async (): Promise<any> => {
  if ('getBattery' in navigator) {
    return await (navigator as any).getBattery();
  }
  return null;
};

// Reduce animations on low battery
export const shouldReduceAnimations = async (): Promise<boolean> => {
  const battery = await getBatteryInfo();
  if (battery && battery.level < 0.2 && !battery.charging) {
    return true;
  }
  
  // Also check user preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
