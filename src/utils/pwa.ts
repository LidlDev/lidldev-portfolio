// PWA utilities for service worker registration and management

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Check if already installed
    this.isInstalled = this.checkIfInstalled();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as any;
      this.dispatchEvent('installable', { canInstall: true });
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.dispatchEvent('installed', { installed: true });
    });

    // Register service worker (enable for PWA testing)
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA: Service Worker registered successfully');
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.dispatchEvent('updateavailable', { registration: this.registration });
              }
            });
          }
        });
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    }
  }

  // Check if app is installed
  private checkIfInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Show install prompt
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();

      // Add timeout to prevent hanging
      const choiceResult = await Promise.race([
        this.deferredPrompt.userChoice,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Install prompt timeout')), 10000)
        )
      ]);

      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('PWA install failed:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  // Update service worker
  async updateServiceWorker(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
      
      if (this.registration.waiting) {
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('PWA: Error updating service worker:', error);
    }
  }

  // Get installation status
  getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      isServiceWorkerSupported: 'serviceWorker' in navigator,
      isRegistered: !!this.registration
    };
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  // Show notification
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const permission = await this.requestNotificationPermission();
    
    if (permission === 'granted' && this.registration) {
      await this.registration.showNotification(title, {
        icon: '/harry-profile.png',
        badge: '/harry-profile.png',
        ...options
      });
    }
  }

  // Background sync
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log('PWA: Background sync registered:', tag);
    } catch (error) {
      console.error('PWA: Background sync registration failed:', error);
    }
  }

  // Custom event dispatcher
  private dispatchEvent(type: string, detail: any) {
    window.dispatchEvent(new CustomEvent(`pwa:${type}`, { detail }));
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.value || (entry as any).processingStart);
        }
      });

      // Observe different performance metrics
      try {
        this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }

    // Monitor page load
    window.addEventListener('load', () => {
      this.measurePageLoad();
    });
  }

  private measurePageLoad() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordMetric('dom-content-loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.recordMetric('load-complete', navigation.loadEventEnd - navigation.loadEventStart);
        this.recordMetric('first-byte', navigation.responseStart - navigation.requestStart);
      }

      // First Paint and First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        this.recordMetric(entry.name, entry.startTime);
      });
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    console.log(`Performance: ${name} = ${value}ms`);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Measure custom performance
  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      this.recordMetric(name, measure.duration);
    }
  }
}

// Singleton instances
export const pwaManager = new PWAManager();
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const isPWAInstalled = () => pwaManager.getInstallationStatus().isInstalled;
export const canInstallPWA = () => pwaManager.getInstallationStatus().canInstall;
export const installPWA = () => pwaManager.showInstallPrompt();
export const updatePWA = () => pwaManager.updateServiceWorker();

// Critical resource preloading
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/harry-profile.png',
    // Add other critical images
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};
