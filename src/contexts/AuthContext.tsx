import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
    console.log('[AuthContext] Initializing auth context');

    let isMounted = true;

    // Wrap in try-catch to prevent app from crashing if Supabase is not available
    const initializeAuth = async () => {
      try {
        // Get initial session
        console.log('[AuthContext] Getting initial session');
        const { data, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          setLoading(false);
          setInitialized(true);
          return;
        }

        const { session } = data;
        console.log('[AuthContext] Initial session:', !!session);
        if (session?.user) {
          console.log('[AuthContext] User authenticated:', {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role
          });
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('[AuthContext] Error getting session:', error);
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    console.log('[AuthContext] Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      console.log('[AuthContext] Auth state changed:', event, !!session);
      if (session?.user) {
        console.log('[AuthContext] User data:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        });
      }

      // Update state
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Only show toast notifications for sign-out events
      // (sign-in success will be handled by the modal)
      if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
        toast.success('Successfully signed out');
      } else if (event === 'SIGNED_IN') {
        console.log('[AuthContext] User signed in');
        toast.success('Successfully signed in');
      }
    });

    return () => {
      console.log('[AuthContext] Cleaning up auth state change listener');
      isMounted = false;
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('[AuthContext] Error unsubscribing from auth changes:', error);
      }
    };
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
      setLoading(true);
      console.log('Attempting to sign in with Google...');
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent');

      console.log('Using redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          // Specify scopes explicitly
          scopes: 'email profile',
        },
      });

      if (error) {
        console.error('Supabase Google OAuth error:', error);
        toast.error(`Google sign-in error: ${error.message}`);
        return;
      }

      console.log('Google OAuth initiated');
      // The user will be redirected to Google's OAuth page
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error(`Failed to sign in with Google: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with GitHub...');
      // Import the environment utility dynamically to avoid circular dependencies
      const { getRedirectUrl } = await import('@/utils/environment');
      const redirectUrl = getRedirectUrl('/agent');

      console.log('Using redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          // Specify scopes explicitly
          scopes: 'user:email',
        },
      });

      if (error) {
        console.error('Supabase GitHub OAuth error:', error);
        toast.error(`GitHub sign-in error: ${error.message}`);
        return;
      }

      console.log('GitHub OAuth initiated');
      // The user will be redirected to GitHub's OAuth page
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      toast.error(`Failed to sign in with GitHub: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
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

  // Don't block the entire app while loading auth - just set loading state
  // The individual components that need auth can handle the loading state

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
