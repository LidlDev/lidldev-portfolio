import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { openAuthPopup } from '@/utils/authPopupListener';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

// Create a default context value to prevent errors
const defaultContextValue: AuthContextType = {
  session: null,
  user: null,
  loading: false,
  signIn: async () => ({ error: null, data: null }),
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Wrap in try-catch to prevent app from crashing if Supabase is not available
    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      }).catch(error => {
        console.error('Error getting session:', error);
        setLoading(false);
        setInitialized(true);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing auth context:', error);
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting to sign in with Google...');
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl, getAuthCallbackUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent');
      const callbackUrl = getAuthCallbackUrl();

      // Use our custom popup handler for more reliable popup management
      await openAuthPopup(
        // Auth function to call
        () => supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            // Use the special callback URL that will close the popup
            redirectTo: callbackUrl,
            // Specify scopes explicitly
            scopes: 'email profile',
            queryParams: {
              // Force the redirect to go to /agent after auth is complete
              redirect_to: redirectUrl
            },
            // Use popup mode
            flowType: 'popup'
          },
        }),
        // Provider name for logging/display
        'Google'
      );
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error(`Failed to sign in with Google: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Attempting to sign in with GitHub...');
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl, getAuthCallbackUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent');
      const callbackUrl = getAuthCallbackUrl();

      // Use our custom popup handler for more reliable popup management
      await openAuthPopup(
        // Auth function to call
        () => supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            // Use the special callback URL that will close the popup
            redirectTo: callbackUrl,
            // Specify scopes explicitly
            scopes: 'user:email',
            queryParams: {
              // Force the redirect to go to /agent after auth is complete
              redirect_to: redirectUrl
            },
            // Use popup mode
            flowType: 'popup'
          },
        }),
        // Provider name for logging/display
        'GitHub'
      );
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      toast.error(`Failed to sign in with GitHub: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent');

      console.log('Using email redirect URL:', redirectUrl);

      return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as Error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent/reset-password');

      console.log('Using password reset redirect URL:', redirectUrl);

      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as Error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signUp,
    signOut,
    resetPassword,
  };

  // Only render children once the auth context is initialized
  if (!initialized && loading) {
    return <div>Loading authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
