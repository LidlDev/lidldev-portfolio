import { createClient } from '@supabase/supabase-js';

// Try to get environment variables from different sources
// First try import.meta.env (Vite's way)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Checking environment variables from import.meta.env:',
  {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseKey,
    envType: typeof import.meta.env
  }
);

// If not found, try process.env (defined in vite.config.ts)
if (!supabaseUrl && typeof process !== 'undefined' && process.env) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
  console.log('[Supabase] Trying to get URL from process.env:', { urlExists: !!supabaseUrl });
}

if (!supabaseKey && typeof process !== 'undefined' && process.env) {
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  console.log('[Supabase] Trying to get key from process.env:', { keyExists: !!supabaseKey });
}

// No hardcoded values - rely only on environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Credentials not found in environment variables. Authentication features will not work.');
} else {
  console.log('[Supabase] Credentials found in environment variables.');
}

// Create client only if environment variables are available
let supabase: ReturnType<typeof createClient>;

try {
  if (supabaseUrl && supabaseKey) {
    console.log('[Supabase] Creating Supabase client with URL:', supabaseUrl.substring(0, 15) + '...');
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Client created successfully:', !!supabase);

    // Test the client
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[Supabase] Error testing client:', error);
      } else {
        console.log('[Supabase] Client test successful, session:', !!data.session);
      }
    });
  } else {
    console.warn('[Supabase] Creating mock client due to missing credentials');
    // Create a mock client that will throw errors when used
    // This prevents the app from crashing but ensures no operations succeed without proper setup
    supabase = {
      auth: {
        getSession: () => {
          console.warn('[Supabase Mock] getSession called');
          return Promise.resolve({ data: { session: null } });
        },
        onAuthStateChange: () => {
          console.warn('[Supabase Mock] onAuthStateChange called');
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: () => {
          console.warn('[Supabase Mock] signInWithPassword called');
          return Promise.resolve({ error: new Error('Supabase not configured'), data: { user: null, session: null } });
        },
        signInWithOAuth: () => {
          console.warn('[Supabase Mock] signInWithOAuth called');
          return Promise.resolve({ error: new Error('Supabase not configured') });
        },
        signUp: () => {
          console.warn('[Supabase Mock] signUp called');
          return Promise.resolve({ error: new Error('Supabase not configured'), data: { user: null, session: null } });
        },
        signOut: () => {
          console.warn('[Supabase Mock] signOut called');
          return Promise.resolve({ error: null });
        },
        resetPasswordForEmail: () => {
          console.warn('[Supabase Mock] resetPasswordForEmail called');
          return Promise.resolve({ error: new Error('Supabase not configured') });
        },
        getUser: () => {
          console.warn('[Supabase Mock] getUser called');
          return Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') });
        }
      },
      from: (table: string) => {
        console.warn(`[Supabase Mock] from(${table}) called`);
        return {
          select: () => {
            console.warn(`[Supabase Mock] select from ${table} called`);
            return {
              eq: () => {
                console.warn(`[Supabase Mock] eq in select from ${table} called`);
                return {
                  order: () => {
                    console.warn(`[Supabase Mock] order in select from ${table} called`);
                    return Promise.resolve({ data: [], error: new Error('Supabase not configured') });
                  },
                };
              },
            };
          },
          insert: () => {
            console.warn(`[Supabase Mock] insert into ${table} called`);
            return {
              select: () => {
                console.warn(`[Supabase Mock] select after insert into ${table} called`);
                return Promise.resolve({ data: [], error: new Error('Supabase not configured') });
              },
            };
          },
          update: () => {
            console.warn(`[Supabase Mock] update ${table} called`);
            return {
              eq: () => {
                console.warn(`[Supabase Mock] eq in update ${table} called`);
                return {
                  eq: () => {
                    console.warn(`[Supabase Mock] second eq in update ${table} called`);
                    return Promise.resolve({ error: new Error('Supabase not configured') });
                  },
                };
              },
            };
          },
          delete: () => {
            console.warn(`[Supabase Mock] delete from ${table} called`);
            return {
              eq: () => {
                console.warn(`[Supabase Mock] eq in delete from ${table} called`);
                return {
                  eq: () => {
                    console.warn(`[Supabase Mock] second eq in delete from ${table} called`);
                    return Promise.resolve({ error: new Error('Supabase not configured') });
                  },
                };
              },
            };
          },
        };
      },
    } as any;
  }
} catch (error) {
  console.error('[Supabase] Error initializing Supabase client:', error);
  // Create the mock client as above
  console.warn('[Supabase] Creating empty mock client due to initialization error');
  supabase = {} as any;
}

export { supabase };
