import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/agent`,
        },
      });

      if (error) {
        console.error('Supabase Google OAuth error:', error);
        alert(`Google sign-in error: ${error.message}`);
        return;
      }

      console.log('Google OAuth initiated:', data);
      // The user will be redirected to Google's OAuth page
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert(`Failed to initiate Google sign-in: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Attempting to sign in with GitHub...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/agent`,
        },
      });

      if (error) {
        console.error('Supabase GitHub OAuth error:', error);
        alert(`GitHub sign-in error: ${error.message}`);
        return;
      }

      console.log('GitHub OAuth initiated:', data);
      // The user will be redirected to GitHub's OAuth page
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      alert(`Failed to initiate GitHub sign-in: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/agent`,
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
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/agent/reset-password`,
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
