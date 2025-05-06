import { createClient } from '@supabase/supabase-js';

// Try to get environment variables from different sources
// First try import.meta.env (Vite's way)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If not found, try process.env (defined in vite.config.ts)
if (!supabaseUrl && typeof process !== 'undefined' && process.env) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
}

if (!supabaseKey && typeof process !== 'undefined' && process.env) {
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
}

// Hardcoded values for development only - REMOVE IN PRODUCTION
if (!supabaseUrl || !supabaseKey) {
  // These are the values from your .env file
  supabaseUrl = 'https://mszyijbyiyvjocjtcobh.supabase.co';
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zenlpamJ5aXl2am9janRjb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTM2NDIsImV4cCI6MjA2MjAyOTY0Mn0.BUD46aMAsowGWxRpdQxuh-RzQXBciLnx1ISvuQVbAqc';

  console.warn('Using hardcoded Supabase credentials for development. This is insecure and should be removed in production.');
}

// Create client only if environment variables are available
let supabase: ReturnType<typeof createClient>;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    // Create a mock client that will throw errors when used
    // This prevents the app from crashing but ensures no operations succeed without proper setup
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured'), data: { user: null, session: null } }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ error: new Error('Supabase not configured'), data: { user: null, session: null } }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
          }),
        }),
        insert: () => ({
          select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
        }),
        update: () => ({
          eq: () => ({
            eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
          }),
        }),
        delete: () => ({
          eq: () => ({
            eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
          }),
        }),
      }),
    } as any;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create the mock client as above
  supabase = {} as any;
}

export { supabase };
