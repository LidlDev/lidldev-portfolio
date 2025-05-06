/**
 * Utility for handling OAuth popup authentication
 */

import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getAuthCallbackUrl } from './environment';

// Store references to open popup windows
let authPopupWindow: Window | null = null;
let popupCheckInterval: number | null = null;

/**
 * Opens an authentication popup window and monitors it for completion
 * @param authFunction The Supabase auth function to call
 * @param provider The name of the auth provider (for logging/display)
 * @returns Promise that resolves when auth is complete
 */
export const openAuthPopup = async (
  authFunction: () => Promise<any>,
  provider: string
): Promise<boolean> => {
  try {
    // Clear any existing popup and interval
    cleanupAuthPopup();

    // Set up auth state change listener before initiating auth
    const authPromise = new Promise<boolean>((resolve) => {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`Auth state changed: ${event}`, session);

        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in successfully');

          // Clean up the popup and interval
          cleanupAuthPopup();

          // Show success message
          toast.success(`Successfully signed in with ${provider}!`);

          // Unsubscribe from auth changes
          subscription.unsubscribe();

          // Resolve the promise
          resolve(true);
        }
      });

      // Set a timeout to resolve the promise after 5 minutes (failsafe)
      setTimeout(() => {
        subscription.unsubscribe();
        cleanupAuthPopup();
        resolve(false);
      }, 5 * 60 * 1000);
    });

    // Initiate the auth flow
    console.log(`Initiating ${provider} auth flow...`);
    const { data, error } = await authFunction();

    if (error) {
      throw error;
    }

    // For popup flow, we need to monitor the popup window
    if (data?.url) {
      // Open the popup window
      authPopupWindow = window.open(
        data.url,
        `${provider}Auth`,
        'width=600,height=700,left=200,top=100'
      );

      if (!authPopupWindow) {
        throw new Error('Popup blocked by browser. Please allow popups for this site.');
      }

      // Start monitoring the popup
      startPopupMonitor();
    }

    // Wait for auth to complete
    return await authPromise;
  } catch (error) {
    console.error(`Error during ${provider} auth:`, error);
    toast.error(`Failed to sign in with ${provider}: ${error instanceof Error ? error.message : String(error)}`);
    cleanupAuthPopup();
    return false;
  }
};

/**
 * Starts monitoring the popup window to detect when it closes
 */
const startPopupMonitor = () => {
  // Check every 500ms if the popup is still open
  popupCheckInterval = window.setInterval(() => {
    if (!authPopupWindow || authPopupWindow.closed) {
      console.log('Auth popup closed');
      cleanupAuthPopup();
    }
  }, 500);
};

/**
 * Cleans up the popup window and monitoring interval
 */
export const cleanupAuthPopup = () => {
  // Clear the check interval
  if (popupCheckInterval !== null) {
    window.clearInterval(popupCheckInterval);
    popupCheckInterval = null;
  }

  // Close the popup if it's still open
  if (authPopupWindow && !authPopupWindow.closed) {
    try {
      authPopupWindow.close();
    } catch (e) {
      console.error('Error closing auth popup:', e);
    }
  }

  authPopupWindow = null;
};

/**
 * Handles window focus events to check auth status when user returns to the app
 */
export const setupAuthFocusListener = () => {
  // When the user returns to the app, check if they're authenticated
  window.addEventListener('focus', async () => {
    if (authPopupWindow) {
      // If we have an open popup and the user focuses the main window,
      // check if they've been authenticated
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is authenticated, clean up the popup
        cleanupAuthPopup();
      }
    }
  });

  // Listen for messages from the popup window
  window.addEventListener('message', async (event) => {
    // Check if the message is from our auth callback page
    if (event.data && event.data.type === 'AUTH_COMPLETE') {
      console.log('Received AUTH_COMPLETE message from popup');

      // Check if the user is authenticated
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log('User is authenticated, cleaning up popup');
        cleanupAuthPopup();
      } else {
        console.log('User is not authenticated yet, waiting...');
        // Wait a bit and check again
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log('User is now authenticated, cleaning up popup');
            cleanupAuthPopup();
          }
        }, 1000);
      }
    }
  });
};

// Initialize the focus listener when this module is imported
if (typeof window !== 'undefined') {
  setupAuthFocusListener();
}
