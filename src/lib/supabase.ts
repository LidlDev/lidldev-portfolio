import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use default values for development if environment variables are not available
const url = supabaseUrl || 'https://mszyijbyiyvjocjtcobh.supabase.co';
const key = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zenlpamJ5aXl2am9janRjb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTM2NDIsImV4cCI6MjA2MjAyOTY0Mn0.BUD46aMAsowGWxRpdQxuh-RzQXBciLnx1ISvuQVbAqc';

if (!url || !key) {
  console.warn('Missing Supabase environment variables, using fallback values');
}

export const supabase = createClient(url, key);
