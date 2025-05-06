import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Make sure .env file is properly configured.');
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
