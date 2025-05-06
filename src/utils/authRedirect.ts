import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Extracts authentication data from URL hash or query parameters
 */
export const extractAuthFromHash = (): {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  providerToken?: string;
} => {
  // First, check the hash fragment (for OAuth redirects)
  let hash = window.location.hash;

  // If the hash starts with #/ (hash router format), extract just the auth part
  if (hash.startsWith('#/')) {
    const parts = hash.split('#');
    if (parts.length > 2) {
      // There's a second hash that might contain auth data
      hash = parts[2];
    } else {
      // No auth data in the hash
      hash = '';
    }
  } else if (hash.startsWith('#')) {
    // Regular hash with auth data
    hash = hash.substring(1);
  }

  if (hash) {
    // Parse the hash fragment into key-value pairs
    const params = new URLSearchParams(hash);

    const authData = {
      accessToken: params.get('access_token') || undefined,
      refreshToken: params.get('refresh_token') || undefined,
      expiresAt: params.get('expires_at') || undefined,
      providerToken: params.get('provider_token') || undefined,
    };

    // If we found auth data, return it
    if (authData.accessToken) {
      return authData;
    }
  }

  // If no auth data in hash, check query parameters
  const searchParams = new URLSearchParams(window.location.search);

  return {
    accessToken: searchParams.get('access_token') || undefined,
    refreshToken: searchParams.get('refresh_token') || undefined,
    expiresAt: searchParams.get('expires_at') || undefined,
    providerToken: searchParams.get('provider_token') || undefined,
  };
};

/**
 * Hook to handle authentication redirects
 * This should be used in the Agent component to ensure proper redirection
 */
export const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have auth data in the URL
    const authData = extractAuthFromHash();

    if (authData.accessToken) {
      console.log('Detected authentication redirect with token');

      // If we're not already on the /agent page, redirect there
      if (!location.pathname.includes('/agent')) {
        console.log('Redirecting to /agent page');
        navigate('/agent', { replace: true });
      }

      // Clean up the URL by removing the auth tokens
      if (window.history && window.history.replaceState) {
        // Create a clean URL without the auth tokens
        const cleanUrl = `${window.location.protocol}//${window.location.host}${location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('Cleaned up URL:', cleanUrl);
      }
    }

    // Handle hash-based routes for backward compatibility
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const path = window.location.hash.substring(2); // Remove the '#/'
      console.log('Detected hash route, redirecting to:', path);
      navigate('/' + path, { replace: true });
    }
  }, [location, navigate]);
};

/**
 * Utility function to check if the current URL contains authentication data
 */
export const hasAuthData = (): boolean => {
  const authData = extractAuthFromHash();
  return !!authData.accessToken;
};
