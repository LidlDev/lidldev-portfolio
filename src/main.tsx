import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init as initEmailJS } from '@emailjs/browser';
import { pwaManager, performanceMonitor, preloadCriticalResources } from './utils/pwa';

// Initialize EmailJS with your public key from environment variables
// This ensures the key is not hardcoded in the source code
initEmailJS(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

// Initialize PWA and performance monitoring
pwaManager; // This initializes the PWA manager
performanceMonitor; // This initializes performance monitoring

// Preload critical resources
preloadCriticalResources();

// Performance monitoring
performanceMonitor.startMeasure('app-initialization');

createRoot(document.getElementById("root")!).render(<App />);

// End performance measurement
performanceMonitor.endMeasure('app-initialization');
