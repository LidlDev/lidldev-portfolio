import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/api/email-auth-callback` : 'http://localhost:3000/api/email-auth-callback';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for initiating OAuth flow
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Store the user ID in the session for later use
    // In a real implementation, you would use a secure session store
    // For simplicity, we'll use a cookie
    res.setHeader('Set-Cookie', `email_auth_user_id=${userId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`);

    // Check if Google OAuth credentials are set
    const nextPublicUrl = process.env.NEXT_PUBLIC_URL;

    // Log environment variables (redacted for security)
    console.log('Environment variables check in email-auth:', {
      GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      NEXT_PUBLIC_URL: nextPublicUrl ? nextPublicUrl : 'Not set',
      REDIRECT_URI: REDIRECT_URI,
      SUPABASE_URL: supabaseUrl ? 'Set' : 'Not set',
      SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'Set' : 'Not set'
    });

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth credentials not set');
      // Redirect back to the agent page with an error
      return res.redirect('/agent?auth_error=oauth_credentials_not_set');
    }

    // Generate the Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.readonly');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    // Redirect the user to the Google OAuth page
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating email authentication:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
