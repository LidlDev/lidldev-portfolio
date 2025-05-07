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

// No hardcoded values - rely only on environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found in environment variables. Authentication features will not work.');
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
