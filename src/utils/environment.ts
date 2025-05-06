/**
 * Utility functions for environment detection and configuration
 */

/**
 * Determines if the application is running in a production environment
 */
export const isProduction = (): boolean => {
  // Check if we're in a production build
  if (import.meta.env.PROD) {
    return true;
  }

  // Check if we're running on the production domain
  const hostname = window.location.hostname;
  return hostname === 'www.lidldev.com' ||
         hostname === 'lidldev.com' ||
         hostname.endsWith('vercel.app');
};

/**
 * Gets the base URL for the current environment
 */
export const getBaseUrl = (): string => {
  if (isProduction()) {
    // For Vercel deployments, use the current hostname
    const hostname = window.location.hostname;
    if (hostname === 'www.lidldev.com' || hostname === 'lidldev.com') {
      return 'https://www.lidldev.com';
    }
    // For preview deployments on Vercel
    return `${window.location.protocol}//${window.location.host}`;
  }

  // Use localhost with the current port in development
  return `${window.location.protocol}//${window.location.host}`;
};

/**
 * Gets the redirect URL for OAuth authentication
 */
export const getRedirectUrl = (path: string = '/agent'): string => {
  return `${getBaseUrl()}${path}`;
};
